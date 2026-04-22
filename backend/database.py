# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔹 Replace with your PostgreSQL credentials
DATABASE_URL = "sqlite:///./test.db"

# Engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class (used in models)
Base = declarative_base()


# Dependency (VERY IMPORTANT for FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()