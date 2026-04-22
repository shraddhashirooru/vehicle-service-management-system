# backend/routes/service.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.service_record import ServiceRecord
from schemas.service_record import ServiceRecordResponse
from datetime import datetime
from sqlalchemy import func

router = APIRouter(tags=["Services"])


# Save Service Record
@router.post("/services/{vehicle_id}")
def create_service(vehicle_id: int, total_amount: float, db: Session = Depends(get_db)):
    record = ServiceRecord(
        vehicle_id=vehicle_id,
        total_amount=total_amount,
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    return {"message": "Service recorded"}


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