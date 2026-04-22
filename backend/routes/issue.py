# backend/routes/issue.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

from models.issue import Issue
from models.issue_component import IssueComponent
from models.component import Component
from models.vehicle import Vehicle

from schemas.issue import IssueCreate, IssueResponse
from schemas.issue_component import IssueComponentCreate, UpdateQuantity
from utils.normalize import normalize_text

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

    normalized_input = normalize_text(data.description)

    issues = db.query(Issue).filter(
        Issue.vehicle_id == data.vehicle_id,
        Issue.is_active == True
    ).all()

    for issue in issues:
        if normalize_text(issue.description) == normalized_input:
            raise HTTPException(
                status_code=400,
                detail="Issue already exists for this vehicle"
            )

    issue = Issue(**data.model_dump())
    db.add(issue)
    db.commit()
    db.refresh(issue)

    return issue

@router.get("/issues", response_model=list[IssueResponse])
def get_issues(db: Session = Depends(get_db)):
    issues = db.query(Issue).filter(Issue.is_active == True).all()
    return issues


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
    
    existing = db.query(IssueComponent).filter(IssueComponent.issue_id == data.issue_id, IssueComponent.component_id == data.component_id).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Component already added to this issue. Update quantity instead."
        )

    issue_component = IssueComponent(**data.model_dump())
    db.add(issue_component)
    db.commit()
    db.refresh(issue_component)
    return {"message": "Component added to issue"}


# Calculate Bill for Vehicle
@router.get("/vehicles/{vehicle_id}/bill")
def calculate_bill(vehicle_id: int, db: Session = Depends(get_db)):

    # Check vehicle exists
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.is_active == True
    ).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Get only active issues
    issues = db.query(Issue).filter(
        Issue.vehicle_id == vehicle_id,
        Issue.is_active == True
    ).all()

    if not issues:
        raise HTTPException(status_code=404, detail="No issues found")

    total = 0
    breakdown = []

    for issue in issues:
        for ic in issue.components:
            comp = ic.component

            if not comp or not comp.is_active:
                continue

            cost = comp.price * ic.quantity
            total += cost

            breakdown.append({
                "component": comp.name,
                "type": comp.type,       
                "quantity": ic.quantity,
                "cost": cost
            })

    return {
        "total": total,
        "breakdown": breakdown
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