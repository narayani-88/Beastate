import os
from dotenv import load_dotenv

load_dotenv()

# ── PostgreSQL ──────────────────────────────────────────────────────────────
DB_HOST     = os.getenv("DB_HOST",     "userdb")
DB_PORT     = int(os.getenv("DB_PORT", "5432"))
DB_NAME     = os.getenv("DB_NAME",     "userdb")
DB_USER     = os.getenv("DB_USER",     "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ── Kafka ───────────────────────────────────────────────────────────────────
KAFKA_BROKER         = os.getenv("KAFKA_BROKER",         "kafka:9092")
KAFKA_TOPIC_MAHARERA = os.getenv("KAFKA_TOPIC_MAHARERA", "maharera_raw")
KAFKA_TOPIC_IBAPI    = os.getenv("KAFKA_TOPIC_IBAPI",    "ibapi_raw")
KAFKA_GROUP_ID       = os.getenv("KAFKA_GROUP_ID",       "scraper_group")

# ── Scraper URLs ─────────────────────────────────────────────────────────────
MAHARERA_BASE_URL = os.getenv(
    "MAHARERA_BASE_URL",
    "https://maharera.mahaonline.gov.in/Apportal/GetPromoterProjectList"
)
IBAPI_BASE_URL    = os.getenv("IBAPI_BASE_URL",    "https://api.data.gov.in/resource")
IBAPI_API_KEY     = os.getenv("IBAPI_API_KEY",     "your_ibapi_key_here")
IBAPI_RESOURCE_ID = os.getenv("IBAPI_RESOURCE_ID", "your_resource_id_here")

# ── Scraper Behaviour ────────────────────────────────────────────────────────
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
PAGE_SIZE       = int(os.getenv("PAGE_SIZE",       "100"))
MAX_PAGES       = int(os.getenv("MAX_PAGES",       "50"))

# ── Scheduler ────────────────────────────────────────────────────────────────
MAHARERA_CRON_HOUR = int(os.getenv("MAHARERA_CRON_HOUR", "2"))
IBAPI_CRON_HOUR    = int(os.getenv("IBAPI_CRON_HOUR",    "3"))

# ── Logging ──────────────────────────────────────────────────────────────────
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")