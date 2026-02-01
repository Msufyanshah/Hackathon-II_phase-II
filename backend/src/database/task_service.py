from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from ..models.task import Task
from ..models.user import User
from datetime import datetime


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

    def create_task(self, session: Session, user_id: UUID, title: str, description: Optional[str] = None) -> Task:
        """
        Create a new task for a specific user
        """
        task = Task(
            title=title,
            description=description,
            user_id=user_id
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def get_task_by_id(self, session: Session, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Get a specific task by ID for a specific user (enforcing user isolation)
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        return session.exec(statement).first()

    def create_task(self, session: Session, user_id: UUID, title: str, description: Optional[str] = None) -> Task:
        """
        Create a new task for a specific user
        """
        task = Task(
            title=title,
            description=description,
            user_id=user_id
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def update_task(self, session: Session, task_id: UUID, user_id: UUID, **kwargs) -> Optional[Task]:
        """
        Update a task for a specific user (enforcing user isolation)
        """
        task = self.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        for field, value in kwargs.items():
            if hasattr(task, field):
                setattr(task, field, value)

        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    def toggle_task_completion(self, session: Session, task_id: UUID, user_id: UUID, completed: bool) -> Optional[Task]:
        """
        Toggle task completion status for a specific user's task (enforcing user isolation)
        """
        task = self.get_task_by_id(session, task_id, user_id)
        if not task:
            return None

        task.is_completed = completed
        task.updated_at = datetime.utcnow()
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