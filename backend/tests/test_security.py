"""
Tests for security utilities
"""

from datetime import datetime, timedelta, timezone

import pytest
from jose import jwt

from src.core.config import settings
from src.utils.security import create_access_token, verify_token


class TestCreateAccessToken:
    """Test JWT token creation"""

    def test_create_token_returns_string(self, test_user):
        """Test that create_access_token returns a string"""
        token = create_access_token(data={"sub": str(test_user.id)})
        assert isinstance(token, str)

    def test_create_token_contains_user_id(self, test_user):
        """Test that token contains user ID"""
        token = create_access_token(data={"sub": str(test_user.id)})
        decoded = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        assert decoded["sub"] == str(test_user.id)

    def test_create_token_with_expiration(self, test_user):
        """Test token with custom expiration"""
        expires_delta = timedelta(hours=2)
        token = create_access_token(
            data={"sub": str(test_user.id)}, expires_delta=expires_delta
        )
        decoded = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )

        # Check expiration is approximately 2 hours from now
        exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
        expected_exp = datetime.now(timezone.utc) + expires_delta
        assert abs((exp_time - expected_exp).total_seconds()) < 5  # 5 second tolerance

    def test_create_token_default_expiration(self, test_user):
        """Test token with default expiration (15 minutes)"""
        token = create_access_token(data={"sub": str(test_user.id)})
        decoded = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )

        exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
        expected_exp = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        assert abs((exp_time - expected_exp).total_seconds()) < 5


class TestVerifyToken:
    """Test JWT token verification"""

    def test_verify_valid_token(self, test_user):
        """Test verifying a valid token"""
        token = create_access_token(data={"sub": str(test_user.id)})
        payload = verify_token(token)
        assert payload is not None
        assert payload["sub"] == str(test_user.id)

    def test_verify_invalid_token(self):
        """Test verifying an invalid token"""
        payload = verify_token("invalid_token_string")
        assert payload is None

    def test_verify_expired_token(self, test_user):
        """Test verifying an expired token"""
        # Create token that expired 1 hour ago
        expired_delta = timedelta(hours=-1)
        token = create_access_token(
            data={"sub": str(test_user.id)}, expires_delta=expired_delta
        )
        payload = verify_token(token)
        assert payload is None

    def test_verify_tampered_token(self, test_user):
        """Test verifying a tampered token"""
        valid_token = create_access_token(data={"sub": str(test_user.id)})
        # Tamper with the token
        tampered_token = valid_token[:-5] + "XXXXX"
        payload = verify_token(tampered_token)
        assert payload is None


class TestSecurityIntegration:
    """Integration tests for security features"""

    def test_token_roundtrip(self, test_user):
        """Test creating and verifying token maintains data integrity"""
        user_id = str(test_user.id)
        token = create_access_token(data={"sub": user_id})
        payload = verify_token(token)
        assert payload["sub"] == user_id

    def test_different_users_get_different_tokens(self, test_user, session):
        """Test that different users get different tokens"""
        from src.models.user import User
        from src.utils.password import get_password_hash

        other_user = User(
            email="other@example.com",
            username="otheruser",
            hashed_password=get_password_hash("password123"),
            is_active=True,
        )
        session.add(other_user)
        session.commit()

        token1 = create_access_token(data={"sub": str(test_user.id)})
        token2 = create_access_token(data={"sub": str(other_user.id)})

        assert token1 != token2

        payload1 = verify_token(token1)
        payload2 = verify_token(token2)

        assert payload1["sub"] != payload2["sub"]
