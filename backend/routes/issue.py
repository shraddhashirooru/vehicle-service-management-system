# backend/routes/issue.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db

from models.issue import Issue
from models.issue_component import IssueComponent
from models.component import Component
from models.vehicle import Vehicle

from schemas.issue import IssueCreate, IssueResponse
from schemas.issue_component import IssueComponentCreate, UpdateQuantity
from utils.normalize import normalize_text
from typing import Optional



router = APIRouter(tags=["Issues"])


# Create Issue
@router.post("/issues", response_model=IssueResponse)
def create_issue(data: IssueCreate, db: Session = Depends(get_db)):

    # Check vehicle exists
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == data.vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    issue = Issue(
        vehicle_id=data.vehicle_id,
        description=data.description
    )

    db.add(issue)
    db.commit()
    db.refresh(issue)

    return issue


@router.get("/issues", response_model=list[IssueResponse])
def get_issues(
    vehicle_id: Optional[int] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Issue).options(
        joinedload(Issue.vehicle),
        joinedload(Issue.components).joinedload(IssueComponent.component)
    ).filter(Issue.is_active == True)

    # ✅ ADD FILTER
    if vehicle_id:
        query = query.filter(Issue.vehicle_id == vehicle_id)

    return query.all()


# Add Component to Issue
@router.post("/issue-components")
def add_component(data: IssueComponentCreate, db: Session = Depends(get_db)):

    # Check issue exists and is active
    issue = db.query(Issue).filter(
        Issue.id == data.issue_id,
        Issue.is_active == True
    ).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # Check component exists and is active
    component = db.query(Component).filter(
        Component.id == data.component_id,
        Component.is_active == True
    ).first()

    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    
    existing = db.query(IssueComponent).join(Issue).join(Component).filter(
    Issue.vehicle_id == issue.vehicle_id,
    Issue.is_active == True,
    Issue.id != data.issue_id,   # ✅ ADD THIS  
    IssueComponent.component_id == data.component_id,
    Component.type == component.type).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Issue already exists for this vehicle with same component and type. Update instead."
        )

    issue_component = IssueComponent(**data.model_dump())
    db.add(issue_component)
    db.commit()
    db.refresh(issue_component)
    return {"message": "Component added to issue"}


# Calculate Bill for Vehicle
@router.get("/vehicles/{vehicle_id}/bill")
def get_bill(vehicle_id: int, type: Optional[str] = None, db: Session = Depends(get_db)):

    # Check vehicle exists
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Get only active issues
    issues = db.query(Issue).options(
    joinedload(Issue.components).joinedload(IssueComponent.component)
    ).filter(
        Issue.vehicle_id == vehicle_id,
        Issue.is_active == True
    ).all()


    total = 0
    items = []

    for issue in issues:
        for ic in issue.components:
            if not ic.component:
                continue

            # 🔥 FILTER LOGIC
            if type and ic.component.type != type:
                continue

            amount = ic.component.price * ic.quantity
            total += amount

            items.append({
                "component": ic.component.name,
                "type": ic.component.type,
                "quantity": ic.quantity,
                "price": ic.component.price,
                "amount": amount
            })
    if not items:
        raise HTTPException(
            status_code=400,
            detail=f"No {type or ''} components found for this vehicle"
        )

    return {
        "vehicle_id": vehicle_id,
        "type": type or "all",
        "items": items,
        "total": total
    }


# Update Issue
@router.put("/issues/{issue_id}", response_model=IssueResponse)
def update_issue(issue_id: int, data: IssueCreate, db: Session = Depends(get_db)):

    issue = db.query(Issue).filter(
        Issue.id == issue_id,
        Issue.is_active == True
    ).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # Check vehicle exists
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == data.vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    normalized_input = normalize_text(data.description)

    issues = db.query(Issue).filter(
        Issue.vehicle_id == data.vehicle_id,
        Issue.is_active == True,
        Issue.id != issue_id
    ).all()

    for i in issues:
        if normalize_text(i.description) == normalized_input:
            raise HTTPException(
                status_code=400,
                detail="Issue already exists for this vehicle"
            )

    issue.description = data.description
    issue.vehicle_id = data.vehicle_id

    db.commit()
    db.refresh(issue)

    return issue


@router.patch("/issue-components/{id}")
def update_issue_component(id: int, data: UpdateQuantity, db: Session = Depends(get_db)):

    ic = db.query(IssueComponent).filter(IssueComponent.id == id).first()

    if not ic:
        raise HTTPException(status_code=404, detail="Entry not found")

    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    ic.quantity = data.quantity

    db.commit()
    db.refresh(ic)

    return {"message": "Quantity updated"}

# Delete Issue (Soft Delete)
@router.delete("/issues/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):

    issue = db.query(Issue).filter(
        Issue.id == issue_id,
        Issue.is_active == True
    ).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    issue.is_active = False  

    db.commit()

    return {"message": "Issue deactivated"}

@router.delete("/issue-components/{id}")
def delete_issue_component(id: int, db: Session = Depends(get_db)):

    ic = db.query(IssueComponent).filter(IssueComponent.id == id).first()

    if not ic:
        raise HTTPException(status_code=404, detail="Entry not found")

    db.delete(ic)
    db.commit()

    return {"message": "Component removed from issue"}