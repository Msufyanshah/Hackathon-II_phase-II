from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from typing import Dict
from datetime import timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address
from ..database.database import get_session_dep as get_session
from ..database.user_service import UserService
from ..database.auth_token_service import AuthTokenService
from ..models.user import User
from ..utils.security import (
    create_access_token,
    create_refresh_token,
    refresh_access_token,
    create_password_reset_token,
    verify_password_reset_token,
    get_current_user
)
from ..utils.password import verify_password, get_password_hash
from ..schemas.auth_schemas import (
    UserRegistrationRequest,
    UserLoginRequest,
    LoginResponse,
    UserResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    PasswordResetRequest,
    PasswordResetConfirmRequest,
    PasswordChangeRequest
)
from uuid import UUID

# Rate limiter for auth endpoints (stricter limits)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=LoginResponse)
@limiter.limit("5/minute")  # Strict rate limit on registration
async def register_user(
    request: Request,
    user_data: UserRegistrationRequest,
    session: Session = Depends(get_session)
):
    """
    Register a new user account
    Maps to POST /auth/register from openapi.yaml
    Rate limited to 5 requests per minute to prevent abuse
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

    # Create access token and refresh token
    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        created_at=user.created_at
    )

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")  # Strict rate limit on login to prevent brute force
async def login_user(
    request: Request,
    login_data: UserLoginRequest,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token
    Maps to POST /auth/login from openapi.yaml
    Rate limited to 5 requests per minute to prevent brute force attacks
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

    # Create access token and refresh token
    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    user_response = UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        created_at=user.created_at
    )

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/refresh", response_model=RefreshTokenResponse)
@limiter.limit("10/minute")  # Rate limit for token refresh
async def refresh_token(
    request: Request,
    token_data: RefreshTokenRequest,
    session: Session = Depends(get_session)
):
    """
    Refresh access token using refresh token
    Maps to POST /auth/refresh from openapi.yaml
    Rate limited to 10 requests per minute
    """
    # Use the refresh_access_token utility function
    new_access_token = refresh_access_token(token_data.refresh_token)

    if new_access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return RefreshTokenResponse(
        access_token=new_access_token,
        token_type="bearer"
    )


@router.post("/password-reset/request")
@limiter.limit("3/minute")  # Strict rate limit to prevent enumeration
async def request_password_reset(
    request: Request,
    reset_data: PasswordResetRequest,
    session: Session = Depends(get_session)
):
    """
    Request password reset email
    Maps to POST /auth/password-reset/request from openapi.yaml
    Rate limited to 3 requests per minute to prevent email enumeration
    
    Note: In production, this would send an email with the reset link.
    For now, we return the token directly (development mode).
    """
    user_service = UserService()
    
    # Find user by email
    user = user_service.get_user_by_email(session, reset_data.email)
    
    # Always return success to prevent email enumeration
    if user is None:
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Create password reset token
    reset_token = create_password_reset_token(str(user.id), user.email)
    
    # In production: Send email with reset link containing token
    # For development: Return token in response
    return {
        "message": "Password reset token generated",
        "reset_token": reset_token,  # Remove this in production
        "note": "In production, this token would be sent via email"
    }


@router.post("/password-reset/confirm")
@limiter.limit("5/minute")
async def confirm_password_reset(
    request: Request,
    confirm_data: PasswordResetConfirmRequest,
    session: Session = Depends(get_session)
):
    """
    Confirm password reset with token
    Maps to POST /auth/password-reset/confirm from openapi.yaml
    Rate limited to 5 requests per minute
    """
    # Verify reset token
    payload = verify_password_reset_token(confirm_data.token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired reset token",
        )
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    if not user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid reset token payload",
        )
    
    # Get user from database
    user_service = UserService()
    user = user_service.get_user_by_id(session, UUID(user_id))
    
    if user is None or user.email != email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid reset token",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account",
        )
    
    # Update password
    user.hashed_password = get_password_hash(confirm_data.new_password)
    session.add(user)
    session.commit()
    
    return {"message": "Password has been reset successfully"}


@router.post("/password/change")
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    change_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Change password for authenticated user
    Maps to POST /auth/password/change from openapi.yaml
    Requires authentication
    Rate limited to 5 requests per minute
    """
    # Verify current password
    if not verify_password(change_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(change_data.new_password)
    session.add(current_user)
    session.commit()
    
    return {"message": "Password has been changed successfully"}
