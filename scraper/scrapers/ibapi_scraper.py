"""
IBAPI Scraper
~~~~~~~~~~~~~
Fetches real-estate dataset records from the Open Government Data (OGD)
Platform India (api.data.gov.in) and saves each record directly to PostgreSQL
(no Kafka required).

Set IBAPI_API_KEY and IBAPI_RESOURCE_ID in your environment / .env file.
"""
import logging
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

import requests

from config.settings import (
    IBAPI_BASE_URL,
    IBAPI_API_KEY,
    IBAPI_RESOURCE_ID,
    REQUEST_TIMEOUT,
    PAGE_SIZE,
    MAX_PAGES,
)
from db.connection import get_session
from models.db_models import IbapiListing

logger = logging.getLogger(__name__)

_SESSION = requests.Session()
_SESSION.headers.update({
    "User-Agent": "BeastateBot/1.0",
    "Accept":     "application/json",
})


# ── Helpers ───────────────────────────────────────────────────────────────────

def _strip_html(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    return re.sub(r"<[^>]+>", "", str(text)).strip() or None


def _to_float(value: Any) -> Optional[float]:
    try:
        return float(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


def _to_int(value: Any) -> Optional[int]:
    try:
        return int(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


# ── Fetch ─────────────────────────────────────────────────────────────────────

def _fetch_page(offset: int) -> Optional[Dict[str, Any]]:
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
    return raw.get("records") or raw.get("data", [])


# ── Save to DB ────────────────────────────────────────────────────────────────

def _save_listing(data: Dict[str, Any], offset: int) -> None:
    listing_id = str(data.get("id") or data.get("_id") or "")

    with get_session() as session:
        if listing_id:
            existing = (
                session.query(IbapiListing)
                .filter_by(listing_id=listing_id)
                .first()
            )
            if existing:
                existing.title      = _strip_html(data.get("title") or data.get("project_name"))
                existing.price      = _to_float(data.get("price") or data.get("sale_price"))
                existing.area_sqft  = _to_float(data.get("area") or data.get("built_up_area"))
                existing.raw_data   = data
                existing.updated_at = datetime.utcnow()
                logger.debug("Updated IBAPI listing %s", listing_id)
                return

        row = IbapiListing(
            listing_id   = listing_id or None,
            title        = _strip_html(data.get("title") or data.get("project_name")),
            city         = _strip_html(data.get("city") or data.get("district")),
            state        = _strip_html(data.get("state")),
            price        = _to_float(data.get("price") or data.get("sale_price")),
            area_sqft    = _to_float(data.get("area") or data.get("built_up_area")),
            bedrooms     = _to_int(data.get("bedrooms") or data.get("bhk")),
            listing_type = _strip_html(data.get("type") or data.get("listing_type")),
            raw_data     = data,
            scraped_at   = datetime.utcnow(),
            updated_at   = datetime.utcnow(),
        )
        session.add(row)
        logger.debug("Inserted IBAPI listing %s", listing_id)


# ── Main entry point ──────────────────────────────────────────────────────────

def run_ibapi_scraper() -> int:
    """
    Pages through the IBAPI dataset and saves records directly to PostgreSQL.

    Returns:
        Total number of records saved.
    """
    total = 0

    for page in range(MAX_PAGES):
        offset = page * PAGE_SIZE
        logger.info("IBAPI: fetching offset=%d ...", offset)
        raw = _fetch_page(offset)

        if not raw:
            logger.warning("Empty / error response at offset=%d, stopping.", offset)
            break

        records = _parse_records(raw)
        if not records:
            logger.info("No more records at offset=%d, stopping.", offset)
            break

        for record in records:
            try:
                _save_listing(record, offset)
                total += 1
            except Exception as exc:
                logger.error("Failed to save listing: %s", exc)

        logger.info("IBAPI: offset=%d → %d records (total so far: %d)",
                    offset, len(records), total)

        if len(records) < PAGE_SIZE:
            break

    logger.info("IBAPI scraper finished. Total records saved: %d", total)
    return total