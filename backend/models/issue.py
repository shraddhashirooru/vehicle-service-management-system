# backend/models/issue.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    is_active = Column(Boolean, default=True)   # ✅ ADD THIS


    # Relationships
    vehicle = relationship("Vehicle", back_populates="issues")
    components = relationship("IssueComponent", back_populates="issue")