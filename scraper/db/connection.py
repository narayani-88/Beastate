import logging
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from config.settings import DATABASE_URL
from models.db_models import Base

logger = logging.getLogger(__name__)

# ── Engine & Session Factory ─────────────────────────────────────────────────
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # auto-reconnect on stale connections
    pool_size=5,
    max_overflow=10,
    echo=False,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Create all tables if they don't already exist."""
    logger.info("Initialising database schema …")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema ready.")


@contextmanager
def get_session() -> Session:
    """Yield a transactional DB session; rollback on error, close on exit."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()