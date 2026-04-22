# backend/models/service_record.py

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from datetime import datetime
from database import Base

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    total_amount = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)