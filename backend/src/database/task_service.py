from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID

from sqlmodel import Session, col, select

from ..models.task import Task
from ..models.user import User


class TaskService:
    """
    Service class for managing Task operations following constitutional requirements
    for user data isolation and security.
    """

    def get_user_tasks(self, session: Session, user_id: UUID) -> List[Task]:
        """
        Get all tasks for a specific user
        """
        statement = select(Task).where(Task.user_id == user_id)
        return session.exec(statement).all()

    def get_user_tasks_filtered(
        self,
        session: Session,
        user_id: UUID,
        completed: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Task]:
        """
        Get tasks for a user with filtering, sorting, and pagination support

        Args:
            session: Database session
            user_id: UUID of the user
            completed: Filter by completion status (None = all, True/False = specific status)
            sort_by: Field to sort by (created_at, updated_at, title, is_completed)
            sort_order: Sort order (asc or desc)
            search: Search term for title and description
            skip: Number of tasks to skip
            limit: Maximum number of tasks to return
        """
        # Build base query
        statement = select(Task).where(Task.user_id == user_id)

        # Apply completion filter
        if completed is not None:
            statement = statement.where(Task.is_completed == completed)

        # Apply search filter
        if search:
            search_pattern = f"%{search}%"
            statement = statement.where(
                (Task.title.ilike(search_pattern))
                | (Task.description.ilike(search_pattern))
            )

        # Apply sorting
        valid_sort_fields = {
            "created_at": Task.created_at,
            "updated_at": Task.updated_at,
            "title": Task.title,
            "is_completed": Task.is_completed,
        }

        sort_field = valid_sort_fields.get(sort_by, Task.created_at)

        if sort_order.lower() == "asc":
            statement = statement.order_by(col(sort_field).asc())
        else:
            statement = statement.order_by(col(sort_field).desc())

        # Apply pagination
        statement = statement.offset(skip).limit(limit)

        return session.exec(statement).all()

    def get_task_by_id(
        self, session: Session, task_id: UUID, user_id: UUID
    ) -> Optional[Task]:
        """
        Get a specific task by ID for a specific user (enforcing user isolation)
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return session.exec(statement).first()

    def create_task(
        self,
        session: Session,
        user_id: UUID,
        title: str,
        description: Optional[str] = None,
    ) -> Task:
        """
        Create a new task for a specific user
        """
        task = Task(title=title, description=description, user_id=user_id)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def update_task(
        self,
        session: Session,
        task_id: UUID,
        user_id: UUID,
        title: Optional[str] = None,
        description: Optional[str] = None,
        is_completed: Optional[bool] = None,
    ) -> Optional[Task]:
        """
        Update a task for a specific user (enforcing user isolation)

        Args:
            session: Database session
            task_id: UUID of the task to update
            user_id: UUID of the task owner (for isolation enforcement)
            title: New task title (optional)
            description: New task description (optional)
            is_completed: New completion status (optional)
        """
        task = self.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if is_completed is not None:
            task.is_completed = is_completed

        task.updated_at = datetime.now(timezone.utc)
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def toggle_task_completion(
        self, session: Session, task_id: UUID, user_id: UUID, completed: bool
    ) -> Optional[Task]:
        """
        Toggle task completion status for a specific user's task (enforcing user isolation)
        """
        task = self.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        task.is_completed = completed
        task.updated_at = datetime.now(timezone.utc)
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def delete_task(self, session: Session, task_id: UUID, user_id: UUID) -> bool:
        """
        Delete a task for a specific user (enforcing user isolation)
        """
        task = self.get_task_by_id(session, task_id, user_id)
        if not task:
            return False

        session.delete(task)
        session.commit()

        return True
