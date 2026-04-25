# backend/schemas/issue.py

from pydantic import BaseModel,Field
from typing import List, Optional
from schemas.issue_component import IssueComponentResponse
from schemas.vehicle import VehicleResponse


class IssueBase(BaseModel):
    description: str
    vehicle_id: int

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id: int
    vehicle: Optional[VehicleResponse]=None
    components: List[IssueComponentResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True