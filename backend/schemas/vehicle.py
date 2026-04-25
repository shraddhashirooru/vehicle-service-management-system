# backend/schemas/vehicle.py

from pydantic import BaseModel, field_validator
from typing import Optional


class VehicleBase(BaseModel):
    vehicle_number: str
    owner_name: str
    issue_description: Optional[str] = None

    @field_validator("vehicle_number")
    def validate_vehicle_number(cls, value):
        cleaned = "".join(value.split())

        if not cleaned.isalnum():
            raise ValueError("Vehicle number must contain only letters and numbers")

        return value


class VehicleCreate(VehicleBase):
    pass


class VehicleResponse(BaseModel):
    id: int
    vehicle_number: str
    owner_name: str
    class Config:
        from_attributes = True