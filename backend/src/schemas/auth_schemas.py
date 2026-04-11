from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserRegistrationRequest(BaseModel):
    """
    Request model for user registration
    Matching schema from openapi.yaml
    """

    email: str
    password: str
    username: str


class UserLoginRequest(BaseModel):
    """
    Request model for user login
    Matching schema from openapi.yaml
    """

    email: str
    password: str


class UserResponse(BaseModel):
    """
    Response model for user data
    Matching schema from openapi.yaml
    """

    id: UUID
    email: str
    username: str
    created_at: datetime


class LoginResponse(BaseModel):
    """
    Response model for login endpoint
    Includes both access and refresh tokens
    Matching schema from openapi.yaml
    """

    access_token: str
    refresh_token: Optional[str] = None
    token_type: str
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """
    Request model for token refresh endpoint
    """

    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """
    Response model for token refresh endpoint
    """

    access_token: str
    token_type: str


class PasswordResetRequest(BaseModel):
    """
    Request model for password reset initiation
    """

    email: str


class PasswordResetConfirmRequest(BaseModel):
    """
    Request model for password reset confirmation
    """

    token: str
    new_password: str


class PasswordChangeRequest(BaseModel):
    """
    Request model for authenticated password change
    """

    current_password: str
    new_password: str
