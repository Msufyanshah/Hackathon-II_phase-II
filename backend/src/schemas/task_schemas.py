from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class CreateTaskRequest(BaseModel):
    """
    Request model for creating a task
    Matching schema from openapi.yaml
    """
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False


class UpdateTaskRequest(BaseModel):
    """
    Request model for updating a task
    Matching schema from openapi.yaml
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """
    Response model for task data
    Matching schema from openapi.yaml
    """
    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime