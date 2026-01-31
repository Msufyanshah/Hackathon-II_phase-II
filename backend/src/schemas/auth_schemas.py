from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


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
    Matching schema from openapi.yaml
    """
    access_token: str
    token_type: str
    user: UserResponse