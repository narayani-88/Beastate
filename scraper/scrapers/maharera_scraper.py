"""
MahaRERA Scraper
~~~~~~~~~~~~~~~~
Scrapes registered real-estate project data from the MahaRERA public portal
and publishes each record as a JSON message to Kafka.

Endpoint: POST https://maharera.mahaonline.gov.in/Apportal/GetPromoterProjectList
"""
import logging
from typing import Any, Dict, List, Optional

import requests

from config.settings import (
    MAHARERA_BASE_URL,
    REQUEST_TIMEOUT,
    PAGE_SIZE,
    MAX_PAGES,
    KAFKA_TOPIC_MAHARERA,
)
from kafka.producer import KafkaProducer

logger = logging.getLogger(__name__)

# ── HTTP session shared across pages ─────────────────────────────────────────
_SESSION = requests.Session()
_SESSION.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (compatible; BeastateBot/1.0; "
        "+https://github.com/beastate)"
    ),
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
})


def _fetch_page(page: int) -> Optional[Dict[str, Any]]:
    """POST a single paginated request and return the parsed JSON, or None."""
    payload = {
        "draw": page,
        "start": (page - 1) * PAGE_SIZE,
        "length": PAGE_SIZE,
        "ProjectType": "",   # '' = all types
        "District": "",
        "Status": "",
    }
    try:
        resp = _SESSION.post(MAHARERA_BASE_URL, data=payload, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.error("MahaRERA page %d fetch error: %s", page, exc)
        return None


def _parse_projects(raw: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract the list of project dicts from the raw API response."""
    return raw.get("data", [])


def run_maharera_scraper() -> int:
    """
    Main entry point — scrapes all pages and publishes records to Kafka.

    Returns:
        Total number of records published.
    """
    producer = KafkaProducer()
    total = 0

    try:
        for page in range(1, MAX_PAGES + 1):
            logger.info("MahaRERA: fetching page %d …", page)
            raw = _fetch_page(page)
            if not raw:
                logger.warning("Empty / error response on page %d, stopping.", page)
                break

            projects = _parse_projects(raw)
            if not projects:
                logger.info("No more projects on page %d, stopping.", page)
                break

            for project in projects:
                # Ensure every record has a stable key
                key = str(project.get("RegistrationNo", "unknown"))
                producer.send_message(
                    topic=KAFKA_TOPIC_MAHARERA,
                    data=project,
                    key=key,
                )
                total += 1

            logger.info("MahaRERA: page %d → %d records (total so far: %d)",
                        page, len(projects), total)

            # If the page returned fewer than PAGE_SIZE rows, we're at the end
            if len(projects) < PAGE_SIZE:
                break

        logger.info("MahaRERA scraper finished. Total records published: %d", total)
    finally:
        producer.flush()
        producer.close()

    return total