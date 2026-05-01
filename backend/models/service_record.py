from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False, index=True)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    type = Column(String, nullable=False, index=True)   
    total_amount = Column(Float, nullable=False)

    status = Column(String, default="pending", nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False) 
    completed_at = Column(DateTime, nullable=True)


    vehicle = relationship("Vehicle", back_populates="services")

    items = relationship("ServiceItem", back_populates="service_record", cascade="all, delete-orphan")
