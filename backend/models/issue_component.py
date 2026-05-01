# backend/models/issue_component.py

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint,String
from sqlalchemy.orm import relationship
from database import Base

class IssueComponent(Base):
    __tablename__ = "issue_components"

    id = Column(Integer, primary_key=True, index=True)

    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=False, index=True)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False, index=True)

    quantity = Column(Integer, nullable=False, default=1)
    delivery_status = Column(String, default="pending", nullable=False, index=True)

    # Relationships
    issue = relationship("Issue", back_populates="components")
    component = relationship("Component", lazy="joined")

    __table_args__ = (
        UniqueConstraint('issue_id', 'component_id', name='unique_issue_component'),
    )