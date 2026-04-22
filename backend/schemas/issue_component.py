# backend/schemas/issue_component.py

from pydantic import BaseModel

class IssueComponentBase(BaseModel):
    issue_id: int
    component_id: int
    quantity: int

class UpdateQuantity(BaseModel):
    quantity: int
    
class IssueComponentCreate(IssueComponentBase):
    pass


class IssueComponentResponse(IssueComponentBase):
    id: int

    class Config:
        from_attributes = True