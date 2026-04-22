# backend/models/issue_component.py

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class IssueComponent(Base):
    __tablename__ = "issue_components"

    id = Column(Integer, primary_key=True, index=True)

    issue_id = Column(Integer, ForeignKey("issues.id"))
    component_id = Column(Integer, ForeignKey("components.id"))

    quantity = Column(Integer, default=1)

    # Relationships
    issue = relationship("Issue", back_populates="components")
    component = relationship("Component")

    __table_args__ = (
        UniqueConstraint('issue_id', 'component_id', name='unique_issue_component'),
    )