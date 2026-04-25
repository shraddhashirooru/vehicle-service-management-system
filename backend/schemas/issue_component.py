# backend/schemas/issue_component.py

from pydantic import BaseModel, Field
from schemas.component import ComponentResponse


class IssueComponentBase(BaseModel):
    issue_id: int
    component_id: int
    quantity: int = Field(gt=0)

class UpdateQuantity(BaseModel):
    quantity: int = Field(gt=0)
    
class IssueComponentCreate(IssueComponentBase):
    pass


class IssueComponentResponse(BaseModel):
    id: int
    component_id: int
    quantity: int
    component: ComponentResponse

    class Config:
        from_attributes = True