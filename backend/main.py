# backend/main.py

from fastapi import FastAPI
from database import engine, Base

# Import all models 
from models import component, vehicle, issue, issue_component, service_record, service_item

# Import routes
from routes import component as component_routes
from routes import vehicle as vehicle_routes
from routes import issue as issue_routes
from routes import service as service_routes
from fastapi.middleware.cors import CORSMiddleware


# Initialize app
app = FastAPI(title="Vehicle Service Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# Include routers
app.include_router(component_routes.router, prefix="/api")
app.include_router(vehicle_routes.router, prefix="/api")
app.include_router(issue_routes.router, prefix="/api")
app.include_router(service_routes.router, prefix="/api")

# Root API
@app.get("/")
def root():
    return {"message": "API is running"}