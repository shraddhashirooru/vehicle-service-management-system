# backend/models/vehicle.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True, nullable=False)
    owner_name = Column(String, nullable=False)
    issue_description = Column(String)
    is_active = Column(Boolean, default=True)   


    # Relationship
    issues = relationship(
        "Issue",
        back_populates="vehicle",
        cascade="all, delete-orphan"   
    )

    services = relationship(          
        "ServiceRecord",
        back_populates="vehicle"
    )