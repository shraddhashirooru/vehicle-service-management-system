# backend/routes/vehicle.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate, VehicleResponse
from utils.normalize import normalize_vehicle_number
from models.issue import Issue

router = APIRouter(tags=["Vehicles"])


# Create Vehicle
@router.post("/vehicles", response_model=VehicleResponse)
def create_vehicle(data: VehicleCreate, db: Session = Depends(get_db)):

    normalized_number = normalize_vehicle_number(data.vehicle_number)

    # Check if vehicle exists (active OR inactive)
    existing_vehicle = db.query(Vehicle).filter(
        Vehicle.vehicle_number == normalized_number
    ).first()

    if existing_vehicle:
        if existing_vehicle.is_active:
            raise HTTPException(
                status_code=400,
                detail="Vehicle already exists"
            )
        else:
            existing_vehicle.is_active = True
            existing_vehicle.owner_name = data.owner_name
            existing_vehicle.issue_description = data.issue_description

            db.commit()
            db.refresh(existing_vehicle)

            return existing_vehicle

    # CREATE NEW VEHICLE 
    vehicle = Vehicle(
        vehicle_number=normalized_number,
        owner_name=data.owner_name,
        issue_description=data.issue_description
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


# Get All Vehicles
@router.get("/vehicles", response_model=list[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).filter(Vehicle.is_active == True).all()


@router.put("/vehicles/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(vehicle_id: int, data: VehicleCreate, db: Session = Depends(get_db)):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    normalized_number = normalize_vehicle_number(data.vehicle_number)

    # 🔍 Check duplicate
    existing_vehicle = db.query(Vehicle).filter(
        Vehicle.vehicle_number == normalized_number,
        Vehicle.id != vehicle_id,   # exclude current vehicle
        Vehicle.is_active == True
    ).first()

    if existing_vehicle:
        raise HTTPException(
            status_code=400,
            detail="Vehicle already exists"
        )

    # ✅ Update fields
    vehicle.vehicle_number = normalized_number
    vehicle.owner_name = data.owner_name

    db.commit()
    db.refresh(vehicle)

    return vehicle

    
@router.delete("/vehicles/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # ❗ Check ongoing issues
    issues = db.query(Issue).filter(
        Issue.vehicle_id == vehicle_id,
        Issue.is_active == True
    ).all()

    if issues:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete vehicle with ongoing issues"
        )

    # ✅ Soft delete
    vehicle.is_active = False
    db.commit()

    return {"message": "Vehicle deleted successfully"}