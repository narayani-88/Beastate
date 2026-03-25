"""
MahaRERA Scraper
~~~~~~~~~~~~~~~~
Scrapes registered real-estate project data from the MahaRERA public portal
and saves each record directly to PostgreSQL (no Kafka required).

Endpoint: POST https://maharera.mahaonline.gov.in/Apportal/GetPromoterProjectList
"""
import logging
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

import requests

from config.settings import (
    MAHARERA_BASE_URL,
    REQUEST_TIMEOUT,
    PAGE_SIZE,
    MAX_PAGES,
)
from db.connection import get_session
from models.db_models import MahaReraProject

logger = logging.getLogger(__name__)

_SESSION = requests.Session()
_SESSION.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (compatible; BeastateBot/1.0; "
        "+https://github.com/beastate)"
    ),
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
})


# ── Helpers ───────────────────────────────────────────────────────────────────

def _strip_html(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    return re.sub(r"<[^>]+>", "", str(text)).strip() or None


def _to_int(value: Any) -> Optional[int]:
    try:
        return int(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


# ── Fetch ─────────────────────────────────────────────────────────────────────

def _fetch_page(page: int) -> Optional[Dict[str, Any]]:
    payload = {
        "draw":        page,
        "start":       (page - 1) * PAGE_SIZE,
        "length":      PAGE_SIZE,
        "ProjectType": "",
        "District":    "",
        "Status":      "",
    }
    try:
        resp = _SESSION.post(MAHARERA_BASE_URL, data=payload, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.error("MahaRERA page %d fetch error: %s", page, exc)
        return None


def _parse_projects(raw: Dict[str, Any]) -> List[Dict[str, Any]]:
    return raw.get("data", [])


# ── Save to DB ────────────────────────────────────────────────────────────────

def _save_project(data: Dict[str, Any]) -> None:
    project_id = _strip_html(str(data.get("RegistrationNo", "")))
    if not project_id:
        logger.warning("MahaRERA record missing RegistrationNo, skipping.")
        return

    with get_session() as session:
        existing = (
            session.query(MahaReraProject)
            .filter_by(project_id=project_id)
            .first()
        )
        if existing:
            existing.project_name   = _strip_html(data.get("ProjectName"))
            existing.developer_name = _strip_html(data.get("PromoterName"))
            existing.status         = _strip_html(data.get("ProjectStatus"))
            existing.total_units    = _to_int(data.get("TotalUnits"))
            existing.raw_data       = data
            existing.updated_at     = datetime.utcnow()
            logger.debug("Updated MahaRERA project %s", project_id)
        else:
            row = MahaReraProject(
                project_id     = project_id,
                project_name   = _strip_html(data.get("ProjectName")),
                developer_name = _strip_html(data.get("PromoterName")),
                district       = _strip_html(data.get("District")),
                taluka         = _strip_html(data.get("Taluka")),
                village        = _strip_html(data.get("Village")),
                project_type   = _strip_html(data.get("ProjectType")),
                status         = _strip_html(data.get("ProjectStatus")),
                start_date     = _strip_html(data.get("ProjectStartDate")),
                end_date       = _strip_html(data.get("ProjectEndDate")),
                total_units    = _to_int(data.get("TotalUnits")),
                raw_data       = data,
                scraped_at     = datetime.utcnow(),
                updated_at     = datetime.utcnow(),
            )
            session.add(row)
            logger.debug("Inserted MahaRERA project %s", project_id)


# ── Main entry point ──────────────────────────────────────────────────────────

def run_maharera_scraper() -> int:
    """
    Scrapes all pages and saves records directly to PostgreSQL.

    Returns:
        Total number of records saved.
    """
    total = 0

    for page in range(1, MAX_PAGES + 1):
        logger.info("MahaRERA: fetching page %d ...", page)
        raw = _fetch_page(page)

        if not raw:
            logger.warning("Empty / error response on page %d, stopping.", page)
            break

        projects = _parse_projects(raw)
        if not projects:
            logger.info("No more projects on page %d, stopping.", page)
            break

        for project in projects:
            try:
                _save_project(project)
                total += 1
            except Exception as exc:
                logger.error("Failed to save project: %s", exc)

        logger.info("MahaRERA: page %d → %d records (total so far: %d)",
                    page, len(projects), total)

        if len(projects) < PAGE_SIZE:
            break

    logger.info("MahaRERA scraper finished. Total records saved: %d", total)
    return total