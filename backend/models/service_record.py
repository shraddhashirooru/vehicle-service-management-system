from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    type = Column(String, nullable=False, index=True)   
    total_amount = Column(Float, nullable=False)

    status = Column(String, default="pending", index=True)

    created_at = Column(DateTime, default=datetime.utcnow) 

    vehicle = relationship("Vehicle", back_populates="services")
