from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    Text,
    JSON,
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class MahaReraProject(Base):
    """A real-estate project registered on the MahaRERA portal."""

    __tablename__ = "maharera_projects"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    project_id     = Column(String(100), unique=True, nullable=False, index=True)
    project_name   = Column(String(500), nullable=True)
    developer_name = Column(String(500), nullable=True)
    district       = Column(String(200), nullable=True)
    taluka         = Column(String(200), nullable=True)
    village        = Column(String(200), nullable=True)
    project_type   = Column(String(100), nullable=True)   # Residential / Commercial
    status         = Column(String(100), nullable=True)   # New / Ongoing / Lapsed
    start_date     = Column(String(50),  nullable=True)
    end_date       = Column(String(50),  nullable=True)
    total_units    = Column(Integer,     nullable=True)
    raw_data       = Column(JSON,        nullable=True)   # full raw payload
    scraped_at     = Column(DateTime,    default=datetime.utcnow, nullable=False)
    updated_at     = Column(DateTime,    default=datetime.utcnow,
                            onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<MahaReraProject id={self.project_id!r} name={self.project_name!r}>"


class IbapiListing(Base):
    """A real-estate listing fetched from the IBAPI (data.gov.in) dataset."""

    __tablename__ = "ibapi_listings"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    listing_id  = Column(String(200), unique=True, nullable=True, index=True)
    title       = Column(String(500), nullable=True)
    city        = Column(String(200), nullable=True)
    state       = Column(String(200), nullable=True)
    price       = Column(Float,       nullable=True)
    area_sqft   = Column(Float,       nullable=True)
    bedrooms    = Column(Integer,     nullable=True)
    listing_type= Column(String(100), nullable=True)   # Sale / Rent
    raw_data    = Column(JSON,        nullable=True)   # full raw payload
    scraped_at  = Column(DateTime,    default=datetime.utcnow, nullable=False)
    updated_at  = Column(DateTime,    default=datetime.utcnow,
                         onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<IbapiListing id={self.listing_id!r} city={self.city!r}>"