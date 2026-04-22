# backend/schemas/issue.py

from pydantic import BaseModel
from typing import List
from schemas.issue_component import IssueComponentResponse


class IssueBase(BaseModel):
    description: str
    vehicle_id: int


class IssueCreate(IssueBase):
    pass


class IssueResponse(IssueBase):
    id: int
    description: str
    vehicle_id: int
    components: List[IssueComponentResponse] = []

    class Config:
        from_attributes = True