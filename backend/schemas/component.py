# backend/schemas/component.py

from pydantic import BaseModel, Field

class ComponentBase(BaseModel):
    name: str
    type: str   # "new" or "repair"
    price: float = Field(gt=0)


class ComponentCreate(ComponentBase):
    pass

class ComponentPriceUpdate(BaseModel):
    price: float

class ComponentResponse(ComponentBase):
    id: int

    class Config:
        from_attributes = True   