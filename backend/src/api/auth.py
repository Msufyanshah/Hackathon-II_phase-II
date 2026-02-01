from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from typing import Dict
from datetime import timedelta
from ..database.database import get_session_dep as get_session
from ..database.user_service import UserService
from ..database.auth_token_service import AuthTokenService
from ..models.user import User
from ..utils.security import create_access_token
from ..utils.password import verify_password, get_password_hash
from ..schemas.auth_schemas import UserRegistrationRequest, UserLoginRequest, LoginResponse, UserResponse
from uuid import UUID

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=LoginResponse)
async def register_user(
    user_data: UserRegistrationRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user account
    Maps to POST /auth/register from openapi.yaml
    """
    user_service = UserService()

    # Check if user already exists
    existing_user = user_service.get_user_by_email(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Check if username is taken
    existing_username = user_service.get_user_by_username(session, user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )

    # Create new user
    user = user_service.create_user(
        session=session,
        email=user_data.email,
        username=user_data.username,
        password=user_data.password
    )

    # Create access token
    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        created_at=user.created_at
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=LoginResponse)
async def login_user(
    login_data: UserLoginRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token
    Maps to POST /auth/login from openapi.yaml
    """
    user_service = UserService()

    # Authenticate user
    user = user_service.authenticate_user(
        session=session,
        email=login_data.email,
        password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "created_at": user.created_at
        }
    )