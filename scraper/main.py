"""
main.py — Beastate Scraper entry point
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
1. Initialises the PostgreSQL schema (creates tables if not present).
2. Optionally runs an immediate one-shot scrape (set RUN_NOW=true in env).
3. Starts the APScheduler to run daily scrapes and the Kafka consumer loops.
"""
import logging
import os
import sys

from config.settings import LOG_LEVEL
from db.connection import init_db
from scheduler.cron import run_scheduler
from scrapers.maharera_scraper import run_maharera_scraper
from scrapers.ibapi_scraper import run_ibapi_scraper

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)

logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("=== Beastate Scraper starting ===")

    # 1. Ensure DB tables exist
    try:
        init_db()
    except Exception as exc:
        logger.error("Failed to initialise DB: %s", exc)
        sys.exit(1)

    # 2. Optional immediate scrape (useful on first run / debugging)
    if os.getenv("RUN_NOW", "false").lower() == "true":
        logger.info("RUN_NOW=true — running scrapers immediately …")
        try:
            run_maharera_scraper()
        except Exception as exc:
            logger.error("MahaRERA immediate scrape failed: %s", exc)
        try:
            run_ibapi_scraper()
        except Exception as exc:
            logger.error("IBAPI immediate scrape failed: %s", exc)

    # 3. Start scheduler + consumer threads (blocking)
    run_scheduler()


if __name__ == "__main__":
    main()