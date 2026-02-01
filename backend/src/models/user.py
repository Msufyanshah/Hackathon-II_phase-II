from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List
import enum


class UserRole(str, enum.Enum):
    """User roles for permission management"""
    USER = "user"
    ADMIN = "admin"


class User(SQLModel, table=True):
    """
    User model representing an authenticated user with unique identifier (UUID),
    authentication tokens, and associated tasks.

    Follows constitutional requirements with UUID primary keys for security and scalability.
    """
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    username: str = Field(unique=True, index=True, max_length=50, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=True)
    role: UserRole = Field(default=UserRole.USER)
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)


# Update the model to use the correct datetime behavior
from sqlalchemy import event
from sqlalchemy.engine import Connection
from sqlalchemy.schema import Table


@event.listens_for(User, 'before_update')
def update_updated_at(target: User, conn: Connection, kwargs):
    """Update the updated_at field before any update operation"""
    target.updated_at = datetime.utcnow()