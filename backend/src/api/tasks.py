from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from uuid import UUID
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
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a specific user
    Maps to GET /users/{user_id}/tasks from openapi.yaml
    Enforces user data isolation - users can only access their own tasks
    """
    # Verify that the requested user ID matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    task_service = TaskService()
    tasks = task_service.get_user_tasks(session, user_id)

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
    Maps to POST /users/{user_id}/tasks from openapi.yaml
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
    Maps to GET /users/{user_id}/tasks/{task_id} from openapi.yaml
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
    Maps to PUT /users/{user_id}/tasks/{task_id} from openapi.yaml
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
    Maps to PATCH /users/{user_id}/tasks/{task_id} from openapi.yaml
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
    Maps to DELETE /users/{user_id}/tasks/{task_id} from openapi.yaml
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