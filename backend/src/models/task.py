from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from .user import User


class Task(SQLModel, table=True):
    """
    Task model representing a todo item with unique identifier (UUID), title,
    description, completion status, creation timestamp, and user ownership.

    Follows constitutional requirements with UUID primary keys for security and scalability.
    """
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(max_length=1000)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    created_at: datetime = Field(default=datetime.utcnow(), index=True)
    updated_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationship to user
    user: User = Relationship(back_populates="tasks")


# Update the model to use the correct datetime behavior
from sqlalchemy import event


@event.listens_for(Task, 'before_update')
def update_updated_at(target: Task, conn, kwargs):
    """Update the updated_at field before any update operation"""
    target.updated_at = datetime.utcnow()