"""
Data Cleaner
~~~~~~~~~~~~
Kafka consumer that reads raw records from MahaRERA and IBAPI topics,
normalises / validates the data, then writes clean rows to PostgreSQL.
"""
import logging
import re
from datetime import datetime
from typing import Any, Dict, Optional

from db.connection import get_session
from kafka.consumer import KafkaConsumer
from models.db_models import MahaReraProject, IbapiListing
from config.settings import KAFKA_TOPIC_MAHARERA, KAFKA_TOPIC_IBAPI

logger = logging.getLogger(__name__)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _strip_html(text: Optional[str]) -> Optional[str]:
    """Remove HTML tags from a string (basic)."""
    if not text:
        return None
    return re.sub(r"<[^>]+>", "", text).strip() or None


def _to_float(value: Any) -> Optional[float]:
    """Coerce *value* to float, returning None on failure."""
    try:
        return float(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


def _to_int(value: Any) -> Optional[int]:
    try:
        return int(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


# ── MahaRERA cleaner ─────────────────────────────────────────────────────────

def handle_maharera(data: Dict[str, Any]) -> None:
    """Clean one raw MahaRERA record and upsert it in PostgreSQL."""
    project_id = _strip_html(str(data.get("RegistrationNo", "")))
    if not project_id:
        logger.warning("MahaRERA record missing RegistrationNo, skipping.")
        return

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

    with get_session() as session:
        existing = (
            session.query(MahaReraProject)
            .filter_by(project_id=project_id)
            .first()
        )
        if existing:
            # Update mutable fields only
            existing.project_name   = row.project_name
            existing.developer_name = row.developer_name
            existing.status         = row.status
            existing.total_units    = row.total_units
            existing.raw_data       = row.raw_data
            existing.updated_at     = row.updated_at
            logger.debug("Updated MahaRERA project %s", project_id)
        else:
            session.add(row)
            logger.debug("Inserted MahaRERA project %s", project_id)


# ── IBAPI cleaner ─────────────────────────────────────────────────────────────

def handle_ibapi(data: Dict[str, Any]) -> None:
    """Clean one raw IBAPI record and upsert it in PostgreSQL."""
    listing_id = str(data.get("id") or data.get("_id") or "")

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

    with get_session() as session:
        if listing_id:
            existing = (
                session.query(IbapiListing)
                .filter_by(listing_id=listing_id)
                .first()
            )
            if existing:
                existing.title        = row.title
                existing.price        = row.price
                existing.area_sqft    = row.area_sqft
                existing.raw_data     = row.raw_data
                existing.updated_at   = row.updated_at
                logger.debug("Updated IBAPI listing %s", listing_id)
                return
        session.add(row)
        logger.debug("Inserted IBAPI listing %s", listing_id)


# ── Consumer runners ──────────────────────────────────────────────────────────

def run_maharera_consumer() -> None:
    """Run the MahaRERA Kafka consumer loop (blocking)."""
    consumer = KafkaConsumer(topic=KAFKA_TOPIC_MAHARERA)
    logger.info("Starting MahaRERA cleaner consumer …")
    try:
        consumer.consume(handler=handle_maharera)
    finally:
        consumer.close()


def run_ibapi_consumer() -> None:
    """Run the IBAPI Kafka consumer loop (blocking)."""
    consumer = KafkaConsumer(topic=KAFKA_TOPIC_IBAPI)
    logger.info("Starting IBAPI cleaner consumer …")
    try:
        consumer.consume(handler=handle_ibapi)
    finally:
        consumer.close()