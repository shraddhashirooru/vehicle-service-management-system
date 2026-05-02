from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class ServiceItem(Base):
    __tablename__ = "service_items"

    id = Column(Integer, primary_key=True, index=True)

    service_id = Column(
        Integer,
        ForeignKey("service_records.id"),
        nullable=False,
        index=True
    )

    issue = Column(String, nullable=False)

    item_name = Column(String, nullable=False)

    amount = Column(Float, nullable=False)

    service_record = relationship(
        "ServiceRecord",
        back_populates="items"
    )