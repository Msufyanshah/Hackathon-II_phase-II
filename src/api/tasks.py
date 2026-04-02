from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from ..database.database import get_session_dep as get_session
from ..database.task_service import TaskService
from ..database.user_service import UserService
from ..models.task import Task
from ..models.user import User
from ..utils.security import get_current_user
from ..schemas.task_schemas import CreateTaskRequest, UpdateTaskRequest, TaskResponse

router = APIRouter()


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
async def get_user_tasks(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    # Filtering parameters
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    # Sorting parameters
    sort_by: str = Query("created_at", description="Field to sort by (created_at, updated_at, title, is_completed)"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)"),
    # Search parameter
    search: Optional[str] = Query(None, description="Search in title and description"),
    # Pagination parameters
    skip: int = Query(0, ge=0, description="Number of tasks to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of tasks to return")
):
    """
    Get all tasks for a specific user with filtering, sorting, and pagination
    Maps to GET /api/users/{user_id}/tasks from openapi.yaml
    Enforces user data isolation - users can only access their own tasks
    
    Query Parameters:
    - completed: Filter by completion status (true/false)
    - sort_by: Field to sort by (created_at, updated_at, title, is_completed)
    - sort_order: Sort order (asc or desc)
    - search: Search term for title and description
    - skip: Number of tasks to skip (for pagination)
    - limit: Maximum number of tasks to return (default: 100, max: 500)
    """
    # Verify that the requested user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    task_service = TaskService()
    tasks = task_service.get_user_tasks_filtered(
        session, 
        user_id,
        completed=completed,
        sort_by=sort_by,
        sort_order=sort_order,
        search=search,
        skip=skip,
        limit=limit
    )

    # Convert to response format
    return [
        TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.is_completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]


@router.post("/{user_id}/tasks", response_model=TaskResponse)
async def create_task(
    user_id: UUID,
    task_data: CreateTaskRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for a specific user
    Maps to POST /api/users/{user_id}/tasks from openapi.yaml
    Enforces user data isolation - users can only create tasks for themselves
    """
    # Verify that the user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    task_service = TaskService()
    task = task_service.create_task(
        session=session,
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    user_id: UUID,
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task for a user
    Maps to GET /api/users/{user_id}/tasks/{task_id} from openapi.yaml
    Enforces user data isolation - users can only access their own tasks
    """
    # Verify that the requested user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    task_service = TaskService()
    task = task_service.get_task_by_id(session, task_id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    user_id: UUID,
    task_id: UUID,
    task_data: UpdateTaskRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for a user
    Maps to PUT /api/users/{user_id}/tasks/{task_id} from openapi.yaml
    Enforces user data isolation - users can only update their own tasks
    """
    # Verify that the user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    task_service = TaskService()

    # Prepare update data
    update_data = {}
    if task_data.title is not None:
        update_data['title'] = task_data.title
    if task_data.description is not None:
        update_data['description'] = task_data.description
    if task_data.completed is not None:
        update_data['is_completed'] = task_data.completed

    task = task_service.update_task(
        session=session,
        task_id=task_id,
        user_id=user_id,
        **update_data
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.patch("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task_partial(
    user_id: UUID,
    task_id: UUID,
    task_data: UpdateTaskRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Partially update a specific task for a user (including completion status)
    Maps to PATCH /api/users/{user_id}/tasks/{task_id} from openapi.yaml
    Enforces user data isolation - users can only update their own tasks
    """
    # Verify that the user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    task_service = TaskService()

    # Prepare update data
    update_data = {}
    if task_data.title is not None:
        update_data['title'] = task_data.title
    if task_data.description is not None:
        update_data['description'] = task_data.description
    if task_data.completed is not None:
        update_data['is_completed'] = task_data.completed

    task = task_service.update_task(
        session=session,
        task_id=task_id,
        user_id=user_id,
        **update_data
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=task.is_completed,
        user_id=task.user_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.delete("/{user_id}/tasks/{task_id}")
async def delete_task(
    user_id: UUID,
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for a user
    Maps to DELETE /api/users/{user_id}/tasks/{task_id} from openapi.yaml
    Enforces user data isolation - users can only delete their own tasks
    """
    # Verify that the user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    task_service = TaskService()
    success = task_service.delete_task(session, task_id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}