# backend/schemas/service_record.py

from pydantic import BaseModel
from datetime import datetime

class ServiceRecordResponse(BaseModel):
    id: int
    vehicle_id: int
    total_amount: float
    created_at: datetime

    class Config:
        from_attributes = True