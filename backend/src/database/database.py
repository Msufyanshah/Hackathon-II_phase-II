from sqlmodel import create_engine, Session, SQLModel
from ..models.user import User
from ..models.task import Task
from ..models.auth_token import AuthToken
from ..core.config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create database tables based on SQLModel models"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session generator"""
    with Session(engine) as session:
        yield session


# Dependency for FastAPI
from fastapi import Depends


def get_session_dep():
    """Dependency function for FastAPI to get database session"""
    with Session(engine) as session:
        yield session