"""
Scheduler (APScheduler)
~~~~~~~~~~~~~~~~~~~~~~~~
Defines cron triggers for the MahaRERA and IBAPI scrapers, then immediately
also fires the Kafka consumer/cleaner loops in background threads so that
scraped data is persisted to PostgreSQL without a separate process.
"""
import logging
import threading

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from config.settings import MAHARERA_CRON_HOUR, IBAPI_CRON_HOUR
from scrapers.maharera_scraper import run_maharera_scraper
from scrapers.ibapi_scraper import run_ibapi_scraper
from cleaner.cleaner import run_maharera_consumer, run_ibapi_consumer

logger = logging.getLogger(__name__)


def _start_consumers() -> None:
    """Launch both Kafka consumer loops in daemon threads."""
    for name, target in [
        ("maharera-consumer", run_maharera_consumer),
        ("ibapi-consumer",    run_ibapi_consumer),
    ]:
        t = threading.Thread(target=target, name=name, daemon=True)
        t.start()
        logger.info("Started background thread: %s", name)


def run_scheduler() -> None:
    """Configure and start the APScheduler blocking scheduler."""
    # Start consumer threads first so data is persisted as scrapers run
    _start_consumers()

    scheduler = BlockingScheduler(timezone="Asia/Kolkata")

    scheduler.add_job(
        run_maharera_scraper,
        trigger=CronTrigger(hour=MAHARERA_CRON_HOUR, minute=0),
        id="maharera_scrape",
        name="MahaRERA daily scrape",
        replace_existing=True,
    )
    logger.info(
        "Scheduled MahaRERA scraper → daily at %02d:00 IST", MAHARERA_CRON_HOUR
    )

    scheduler.add_job(
        run_ibapi_scraper,
        trigger=CronTrigger(hour=IBAPI_CRON_HOUR, minute=0),
        id="ibapi_scrape",
        name="IBAPI daily scrape",
        replace_existing=True,
    )
    logger.info(
        "Scheduled IBAPI scraper     → daily at %02d:00 IST", IBAPI_CRON_HOUR
    )

    logger.info("Scheduler started. Press Ctrl+C to exit.")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler stopped.")