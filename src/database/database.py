from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
from typing import Generator
from ..core.config import settings
import os
import sys

# Create database engine
# For local development with SQLite, we need to handle the path correctly
if settings.DATABASE_URL.startswith("sqlite"):
    # For SQLite, use relative path or absolute path
    database_url = settings.DATABASE_URL.replace("sqlite:///", "sqlite:///./")
    engine = create_engine(database_url, echo=False, connect_args={"check_same_thread": False})
else:
    # For PostgreSQL (Neon), use the provided URL
    engine = create_engine(settings.DATABASE_URL, echo=False)


def create_db_and_tables():
    """Create database tables based on SQLModel models"""
    try:
        # Import models to ensure they're registered with SQLModel before creating tables
        from ..models.user import User
        from ..models.task import Task
        from ..models.auth_token import AuthToken

        # Create all tables
        SQLModel.metadata.create_all(engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get database session as a context manager"""
    with Session(engine) as session:
        yield session


# Dependency for FastAPI to get database session
def get_session_dep():
    """Dependency function for FastAPI to get database session"""
    with Session(engine) as session:
        yield session