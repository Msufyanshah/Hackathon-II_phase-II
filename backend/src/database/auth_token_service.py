from sqlmodel import Session, select
from typing import Optional
from uuid import UUID
from datetime import datetime, timedelta
from ..models.auth_token import AuthToken
from passlib.context import CryptContext


class AuthTokenService:
    """
    Service class for managing AuthToken operations for refresh token management
    while maintaining stateless JWT access tokens as required by constitutional requirements.
    """

    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_auth_token(self, session: Session, user_id: UUID, token: str, expires_delta: Optional[timedelta] = None) -> AuthToken:
        """
        Create an auth token record for refresh token management
        """
        if expires_delta:
            expires_at = datetime.utcnow() + expires_delta
        else:
            expires_at = datetime.utcnow() + timedelta(days=7)  # Default 7 days

        # Hash the token for security
        token_hash = self.pwd_context.hash(token)

        auth_token = AuthToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at
        )

        session.add(auth_token)
        session.commit()
        session.refresh(auth_token)

        return auth_token

    def get_valid_token(self, session: Session, token: str, user_id: UUID) -> Optional[AuthToken]:
        """
        Get a valid, non-revoked, non-expired token for a specific user
        """
        statement = select(AuthToken).where(
            AuthToken.user_id == user_id,
            AuthToken.expires_at > datetime.utcnow(),
            AuthToken.is_revoked == False
        )
        tokens = session.exec(statement).all()

        # Verify the token hash matches
        for auth_token in tokens:
            if self.pwd_context.verify(token, auth_token.token_hash):
                return auth_token

        return None

    def revoke_token(self, session: Session, token: str, user_id: UUID) -> bool:
        """
        Revoke a specific token for a user
        """
        auth_token = self.get_valid_token(session, token, user_id)
        if not auth_token:
            return False

        auth_token.is_revoked = True
        session.add(auth_token)
        session.commit()

        return True

    def revoke_all_user_tokens(self, session: Session, user_id: UUID) -> int:
        """
        Revoke all tokens for a specific user (used when deactivating account)
        """
        statement = select(AuthToken).where(
            AuthToken.user_id == user_id,
            AuthToken.is_revoked == False
        )
        tokens = session.exec(statement).all()

        revoked_count = 0
        for token in tokens:
            token.is_revoked = True
            session.add(token)
            revoked_count += 1

        session.commit()
        return revoked_count

    def cleanup_expired_tokens(self, session: Session) -> int:
        """
        Remove all expired tokens from the database
        """
        statement = select(AuthToken).where(AuthToken.expires_at < datetime.utcnow())
        expired_tokens = session.exec(statement).all()

        deleted_count = 0
        for token in expired_tokens:
            session.delete(token)
            deleted_count += 1

        session.commit()
        return deleted_count