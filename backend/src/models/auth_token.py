from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional
from .user import User


class AuthToken(SQLModel, table=True):
    """
    AuthToken model for managing refresh token metadata for stateful refresh token management
    while maintaining stateless access tokens (JWT) as required by constitutional authentication strategy.

    This model is used exclusively for refresh token revocation tracking. Access tokens remain
    stateless JWTs as required by constitutional requirements.
    """
    __tablename__ = "auth_tokens"

    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    token_hash: str = Field(max_length=255, nullable=False, unique=True, index=True)
    expires_at: datetime = Field(nullable=False, index=True)
    created_at: datetime = Field(default=datetime.utcnow())
    is_revoked: bool = Field(default=False)

    # Relationship to user
    user: User = Relationship(back_populates="auth_tokens")