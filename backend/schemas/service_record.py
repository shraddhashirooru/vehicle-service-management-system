# backend/schemas/service_record.py

from pydantic import BaseModel, Field
from datetime import datetime
from schemas.vehicle import VehicleResponse
from typing import Optional, List


class ServiceCreate(BaseModel):
    vehicle_id: int
    total_amount: float
    type: str   
    
class ServiceUpdate(BaseModel):
    status: str   # "pending" or "completed"

class ServiceItemResponse(BaseModel):
    issue: str
    item_name: str
    amount: float

class ServiceRecordResponse(BaseModel):
    id: int
    order_number: Optional[str] = None
    vehicle_id: int
    issue_id: Optional[int] = None
    total_amount: float
    type: str
    status: str

    created_at: datetime
    completed_at: Optional[datetime] = None

    vehicle: VehicleResponse 

    items: List[ServiceItemResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True