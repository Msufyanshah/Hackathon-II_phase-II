"""
Tests for task endpoints
"""
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session


class TestTaskCreation:
    """Test task creation endpoint"""

    def test_create_task_success(self, client: TestClient, auth_headers: dict, test_user):
        """Test successful task creation"""
        response = client.post(
            f"/api/users/{test_user.id}/tasks",
            json={"title": "New Task", "description": "Test description"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New Task"
        assert data["description"] == "Test description"
        assert data["completed"] is False
        assert "id" in data

    def test_create_task_without_auth(self, client: TestClient, test_user):
        """Test task creation without authentication"""
        response = client.post(
            f"/api/users/{test_user.id}/tasks",
            json={"title": "New Task", "description": "Test description"},
        )
        assert response.status_code == 401

    def test_create_task_empty_title(self, client: TestClient, auth_headers: dict, test_user):
        """Test task creation with empty title"""
        response = client.post(
            f"/api/users/{test_user.id}/tasks",
            json={"title": "", "description": "Test description"},
            headers=auth_headers,
        )
        assert response.status_code == 422

    def test_create_task_long_title(self, client: TestClient, auth_headers: dict, test_user):
        """Test task creation with title exceeding max length"""
        response = client.post(
            f"/api/users/{test_user.id}/tasks",
            json={"title": "A" * 201, "description": "Test description"},
            headers=auth_headers,
        )
        assert response.status_code == 422


class TestTaskReading:
    """Test task reading endpoints"""

    def test_get_user_tasks(self, client: TestClient, auth_headers: dict, test_user, test_task):
        """Test getting all user tasks"""
        response = client.get(
            f"/api/users/{test_user.id}/tasks",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert any(task["id"] == str(test_task.id) for task in data)

    def test_get_single_task(self, client: TestClient, auth_headers: dict, test_user, test_task):
        """Test getting a single task"""
        response = client.get(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_task.id)
        assert data["title"] == "Test Task"

    def test_get_task_not_found(self, client: TestClient, auth_headers: dict, test_user):
        """Test getting non-existent task"""
        fake_id = str(uuid4())
        response = client.get(
            f"/api/users/{test_user.id}/tasks/{fake_id}",
            headers=auth_headers,
        )
        assert response.status_code == 404

    def test_cannot_access_other_user_tasks(
        self, client: TestClient, auth_headers: dict, session: Session
    ):
        """Test that users cannot access other users' tasks"""
        from src.models.task import Task
        from src.models.user import User
        from src.utils.security import get_password_hash

        # Create another user
        other_user = User(
            email="other@example.com",
            username="otheruser",
            hashed_password=get_password_hash("password123"),
            is_active=True,
        )
        session.add(other_user)
        
        # Create task for other user
        other_task = Task(
            title="Other User Task",
            user_id=other_user.id,
        )
        session.add(other_task)
        session.commit()
        
        # Try to access other user's task
        response = client.get(
            f"/api/users/{other_user.id}/tasks",
            headers=auth_headers,
        )
        # Should return 403 Forbidden or empty list
        assert response.status_code in [200, 403]
        if response.status_code == 200:
            data = response.json()
            assert not any(task["user_id"] == str(other_user.id) for task in data)


class TestTaskUpdating:
    """Test task update endpoints"""

    def test_update_task_success(self, client: TestClient, auth_headers: dict, test_user, test_task):
        """Test successful task update"""
        response = client.put(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
            json={"title": "Updated Task", "description": "Updated description", "completed": True},
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Task"
        assert data["description"] == "Updated description"

    def test_toggle_task_completion(
        self, client: TestClient, auth_headers: dict, test_user, test_task
    ):
        """Test toggling task completion"""
        # Task starts as not completed
        assert test_task.is_completed is False
        
        response = client.patch(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_completed"] is True


class TestTaskDeletion:
    """Test task deletion endpoint"""

    def test_delete_task_success(self, client: TestClient, auth_headers: dict, test_user, test_task):
        """Test successful task deletion"""
        response = client.delete(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
            headers=auth_headers,
        )
        assert response.status_code == 204
        
        # Verify task is deleted
        get_response = client.get(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
            headers=auth_headers,
        )
        assert get_response.status_code == 404

    def test_delete_task_without_auth(self, client: TestClient, test_user, test_task):
        """Test task deletion without authentication"""
        response = client.delete(
            f"/api/users/{test_user.id}/tasks/{test_task.id}",
        )
        assert response.status_code == 401
