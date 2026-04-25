# backend/models/component.py

from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "new" or "repair"
    price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)   