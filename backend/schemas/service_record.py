# backend/schemas/service_record.py

from pydantic import BaseModel
from datetime import datetime
from schemas.vehicle import VehicleResponse
from schemas.issue import IssueResponse
from typing import Optional


class ServiceCreate(BaseModel):
    vehicle_id: int
    total_amount: float
    type: str   # ✅ MUST ADD
    
class ServiceUpdate(BaseModel):
    status: str   # "pending" or "completed"

class ServiceRecordResponse(BaseModel):
    id: int
    vehicle_id: int
    issue_id: Optional[int] = None
    total_amount: float
    type: str
    status: str
    created_at: datetime
    vehicle: VehicleResponse # ✅ OPTIONAL BUT GOOD

    class Config:
        from_attributes = True