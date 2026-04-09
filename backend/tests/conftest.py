"""
Pytest configuration and fixtures for backend tests
"""
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from src.database.database import get_session_dep
from src.main import app
from src.models.task import Task
from src.models.user import User
from src.utils.password import get_password_hash


# Create test database engine
@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    """Create a new in-memory database session for each test"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    # Create session
    session = Session(engine)
    
    # Override dependency
    def get_session_override():
        return session
    
    app.dependency_overrides[get_session_dep] = get_session_override
    
    yield session
    
    # Cleanup
    session.close()
    app.dependency_overrides.clear()


@pytest.fixture
def client(session: Session) -> TestClient:
    """Create test client with overridden dependencies"""
    return TestClient(app)


@pytest.fixture
def test_user(session: Session) -> User:
    """Create a test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpassword123"),
        is_active=True,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def test_task(session: Session, test_user: User) -> Task:
    """Create a test task"""
    task = Task(
        title="Test Task",
        description="Test Description",
        is_completed=False,
        user_id=test_user.id,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@pytest.fixture
def auth_headers(client: TestClient, test_user: User, session: Session) -> dict:
    """Get authentication headers for test user"""
    # Disable rate limiting for tests
    app.state.limiter.enabled = False
    
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    
    # Re-enable rate limiting
    app.state.limiter.enabled = True
    
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
