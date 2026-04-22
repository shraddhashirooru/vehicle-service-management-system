# backend/routes/component.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.component import Component
from schemas.component import ComponentCreate, ComponentResponse, ComponentPriceUpdate
from utils.normalize import normalize_name

router = APIRouter(tags=["Components"])


# Create Component
@router.post("/components", response_model=ComponentResponse)
def create_component(data: ComponentCreate, db: Session = Depends(get_db)):

    # Check duplicate
    normalized_input = normalize_name(data.name)

    components = db.query(Component).filter(Component.is_active == True).all()

    for comp in components:
        if (
            normalize_name(comp.name) == normalized_input
            and comp.type == data.type   
        ):
            raise HTTPException(
                status_code=400,
                detail="Component already exists with same type"
            )

    component = Component(**data.model_dump())
    db.add(component)
    db.commit()
    db.refresh(component)
    return component


# Get All Components
@router.get("/components")
def get_components(type: str = None, db: Session = Depends(get_db)):
    query = db.query(Component).filter(Component.is_active == True)

    if type:
        query = query.filter(Component.type == type)

    return query.all()


@router.patch("/components/{component_id}/price", response_model=ComponentResponse)
def update_component_price(component_id: int, data: ComponentPriceUpdate, db: Session = Depends(get_db)):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.is_active == True
    ).first()

    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    component.price = data.price

    db.commit()
    db.refresh(component)

    return component

@router.delete("/components/{component_id}")
def delete_component(component_id: int, db: Session = Depends(get_db)):
    component = db.query(Component).filter(Component.id == component_id).first()

    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    component.is_active = False   

    db.commit()

    return {"message": "Component deactivated"}