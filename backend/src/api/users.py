from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from uuid import UUID
from ..database.database import get_session_dep as get_session
from ..models.user import User
from ..utils.security import get_current_user
from ..schemas.auth_schemas import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get the current authenticated user's profile
    Maps to GET /users/me from openapi.yaml
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        created_at=current_user.created_at
    )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user_profile(
    user_id: UUID,
    # In a real implementation, we'd have an update request schema here
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update user profile information
    Maps to PUT /users/{user_id} from openapi.yaml
    """
    # Verify that the user is updating their own profile
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )

    # In a real implementation, we would update user fields here
    # For now, just return the current user
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        created_at=current_user.created_at
    )