"""
IBAPI Scraper
~~~~~~~~~~~~~
Fetches real-estate dataset records from the Open Government Data (OGD)
Platform India (api.data.gov.in) and publishes each record to Kafka.

Set IBAPI_API_KEY and IBAPI_RESOURCE_ID in your environment / .env file.
"""
import logging
from typing import Any, Dict, List, Optional

import requests

from config.settings import (
    IBAPI_BASE_URL,
    IBAPI_API_KEY,
    IBAPI_RESOURCE_ID,
    REQUEST_TIMEOUT,
    PAGE_SIZE,
    MAX_PAGES,
    KAFKA_TOPIC_IBAPI,
)
from kafka.producer import KafkaProducer

logger = logging.getLogger(__name__)

_SESSION = requests.Session()
_SESSION.headers.update({
    "User-Agent": "BeastateBot/1.0",
    "Accept": "application/json",
})


def _fetch_page(offset: int) -> Optional[Dict[str, Any]]:
    """GET a single paginated results page from the OGD API."""
    url = f"{IBAPI_BASE_URL}/{IBAPI_RESOURCE_ID}"
    params = {
        "api-key": IBAPI_API_KEY,
        "format":  "json",
        "offset":  offset,
        "limit":   PAGE_SIZE,
    }
    try:
        resp = _SESSION.get(url, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.error("IBAPI offset=%d fetch error: %s", offset, exc)
        return None


def _parse_records(raw: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract list of records from the OGD API response envelope."""
    # OGD API wraps records under 'records' or 'data' depending on resource
    return raw.get("records") or raw.get("data", [])


def run_ibapi_scraper() -> int:
    """
    Main entry point — pages through the IBAPI dataset and publishes to Kafka.

    Returns:
        Total number of records published.
    """
    producer = KafkaProducer()
    total = 0

    try:
        for page in range(MAX_PAGES):
            offset = page * PAGE_SIZE
            logger.info("IBAPI: fetching offset=%d …", offset)
            raw = _fetch_page(offset)

            if not raw:
                logger.warning("Empty / error response at offset=%d, stopping.", offset)
                break

            records = _parse_records(raw)
            if not records:
                logger.info("No more records at offset=%d, stopping.", offset)
                break

            for record in records:
                # Use index-based key if the record has no natural identifier
                key = str(record.get("id") or record.get("_id") or f"{offset}")
                producer.send_message(
                    topic=KAFKA_TOPIC_IBAPI,
                    data=record,
                    key=key,
                )
                total += 1

            logger.info(
                "IBAPI: offset=%d → %d records (total so far: %d)",
                offset, len(records), total,
            )

            if len(records) < PAGE_SIZE:
                break

        logger.info("IBAPI scraper finished. Total records published: %d", total)
    finally:
        producer.flush()
        producer.close()

    return total