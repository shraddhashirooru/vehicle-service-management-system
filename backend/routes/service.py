# backend/routes/service.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.service_record import ServiceRecord
from models.vehicle import Vehicle
from models.issue import Issue

from schemas.service_record import ServiceCreate, ServiceRecordResponse
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from models.issue_component import IssueComponent
from schemas.service_record import ServiceUpdate   # 🔥 ADD IMPORT



router = APIRouter(tags=["Services"])

# ➕ Create Order
@router.post("/service-records", response_model=ServiceRecordResponse)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):

    # ✅ Check vehicle exists
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == data.vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if data.type not in ["new", "repair"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid service type"
        )

    issues = db.query(Issue).options(
        joinedload(Issue.components).joinedload(IssueComponent.component)
    ).filter(
        Issue.vehicle_id == data.vehicle_id,
        Issue.is_active == True
    ).all()

    if not issues:
        raise HTTPException(
            status_code=400,
            detail="No active issues found for this vehicle"
        )


    valid_items = [
        ic
        for issue in issues
        for ic in issue.components
        if ic.component and ic.component.type == data.type
    ] 

    if not valid_items:
        raise HTTPException(
            status_code=400,
            detail=f"No {data.type} components available for this vehicle"
        )

    # ❌ Prevent duplicate ongoing order
    existing = db.query(ServiceRecord).filter(
        ServiceRecord.vehicle_id == data.vehicle_id,
        ServiceRecord.status == "pending",
        ServiceRecord.type == data.type   # ✅ ADD THIS
    ).first()


    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"{data.type.capitalize()} order already pending for this vehicle"
        )

    calculated_total = sum(
        ic.component.price * ic.quantity
        for ic in valid_items
    )

    if round(calculated_total, 2) != round(data.total_amount, 2):
        raise HTTPException(
            status_code=400,
            detail="Total amount mismatch"
        )

    # ✅ Create order
    service = ServiceRecord(
        vehicle_id=data.vehicle_id,
        total_amount=calculated_total,
        status="pending",
        type=data.type   # 🔥 ADD THIS
    )

    db.add(service)

    for issue in issues:
        has_matching_component = any(
            ic.component and ic.component.type == data.type
            for ic in issue.components
        )
        
        if has_matching_component:
            issue.is_active = False
    
    db.commit()
    db.refresh(service)

    service = db.query(ServiceRecord).options(
        joinedload(ServiceRecord.vehicle)
    ).filter(ServiceRecord.id == service.id).first()

    return service

# 📄 Get All Orders
@router.get("/service-records", response_model=list[ServiceRecordResponse])
def get_services(status: str = None, db: Session = Depends(get_db)):

    query = db.query(ServiceRecord).options(
        joinedload(ServiceRecord.vehicle)
    )

    # ✅ FILTER IF STATUS PROVIDED
    if status:
        query = query.filter(ServiceRecord.status == status)

    services = query.order_by(ServiceRecord.created_at.desc()).all()

    return services

# 🔧 Update Service Status
@router.patch("/service-records/{service_id}", response_model=ServiceRecordResponse)
def update_service(service_id: int, data: ServiceUpdate, db: Session = Depends(get_db)):

    service = db.query(ServiceRecord).filter(ServiceRecord.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # ✅ Validate status
    if data.status not in ["pending", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    # ✅ Update status
    service.status = data.status

    db.commit()
    db.refresh(service)

    # 🔥 Return with vehicle info
    service = db.query(ServiceRecord).options(
        joinedload(ServiceRecord.vehicle)
    ).filter(ServiceRecord.id == service.id).first()

    return service


# Daily Revenue
@router.get("/revenue/daily")
def daily_revenue(db: Session = Depends(get_db)):
    result = db.query(
        func.date(ServiceRecord.created_at),
        func.sum(ServiceRecord.total_amount)
    ).group_by(func.date(ServiceRecord.created_at)).all()

    return [{"date": str(r[0]), "revenue": r[1]} for r in result]


# Monthly Revenue
@router.get("/revenue/monthly")
def monthly_revenue(db: Session = Depends(get_db)):
    result = db.query(
        func.strftime('%Y-%m', ServiceRecord.created_at),
        func.sum(ServiceRecord.total_amount)
    ).group_by(func.strftime('%Y-%m', ServiceRecord.created_at)).all()

    return [{"month": r[0], "revenue": r[1]} for r in result]


# Yearly Revenue
@router.get("/revenue/yearly")
def yearly_revenue(db: Session = Depends(get_db)):
    result = db.query(
        func.strftime('%Y', ServiceRecord.created_at),
        func.sum(ServiceRecord.total_amount)
    ).group_by(func.strftime('%Y', ServiceRecord.created_at)).all()

    return [{"year": r[0], "revenue": r[1]} for r in result]