from sqlmodel import Session, select
from typing import Optional
from uuid import UUID
from ..models.user import User
from ..models.auth_token import AuthToken
from passlib.context import CryptContext
from datetime import datetime


class UserService:
    """
    Service class for managing User operations following constitutional requirements
    for user data isolation and security.
    """

    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_user(self, session: Session, email: str, username: str, password: str) -> User:
        """
        Create a new user with hashed password
        """
        from ..utils.password import get_password_hash

        hashed_password = get_password_hash(password)

        user = User(
            email=email,
            username=username,
            hashed_password=hashed_password
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    def get_user_by_email(self, session: Session, email: str) -> Optional[User]:
        """
        Get user by email
        """
        statement = select(User).where(User.email == email)
        return session.exec(statement).first()

    def get_user_by_username(self, session: Session, username: str) -> Optional[User]:
        """
        Get user by username
        """
        statement = select(User).where(User.username == username)
        return session.exec(statement).first()

    def get_user_by_id(self, session: Session, user_id: UUID) -> Optional[User]:
        """
        Get user by ID
        """
        statement = select(User).where(User.id == user_id)
        return session.exec(statement).first()

    def authenticate_user(self, session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password
        """
        from ..utils.password import verify_password

        user = self.get_user_by_email(session, email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def update_user(self, session: Session, user_id: UUID, **kwargs) -> Optional[User]:
        """
        Update user with provided fields
        """
        user = self.get_user_by_id(session, user_id)
        if not user:
            return None

        for field, value in kwargs.items():
            if hasattr(user, field):
                setattr(user, field, value)

        user.updated_at = datetime.utcnow()
        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    def deactivate_user(self, session: Session, user_id: UUID) -> bool:
        """
        Deactivate user account
        """
        user = self.get_user_by_id(session, user_id)
        if not user:
            return False

        user.is_active = False
        session.add(user)
        session.commit()

        # Revoke all auth tokens for this user
        auth_token_service = AuthTokenService()
        auth_token_service.revoke_all_user_tokens(session, user_id)

        return True