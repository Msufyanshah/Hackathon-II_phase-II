# ADR 001: Authentication Architecture with Dual JWT System

**Date**: 2026-03-25  
**Status**: Accepted  
**Deciders**: Development Team

## Context and Problem Statement

The Todo Application requires secure user authentication with the following requirements:
- User registration and login functionality
- Session management across frontend and backend
- User data isolation (users can only access their own tasks)
- JWT-based authentication for API calls
- Integration with Better Auth library on frontend
- FastAPI backend with JWT verification

We need to decide on an authentication architecture that satisfies these requirements while maintaining security and simplicity.

## Considered Options

### Option 1: Single JWT Authority (Backend-Only)
- Backend generates and verifies all JWT tokens
- Frontend stores token and includes in requests
- Simple flow, single source of truth

### Option 2: Dual JWT System (Better Auth + Backend)
- Better Auth manages user sessions on frontend
- Backend generates separate JWT for API calls
- Both systems share a secret key for compatibility
- Redundant but provides better session management

### Option 3: Session-Based Authentication
- Cookie-based sessions managed by backend
- CSRF protection required
- More complex for API-based architecture

## Decision Outcome

**Chosen Option: Option 2 - Dual JWT System**

### Rationale

1. **Better Auth Integration**: Leverages Better Auth's built-in session management and UI components
2. **Backend Independence**: Backend maintains its own JWT tokens for API authorization
3. **Shared Secret**: Both systems use the same `SECRET_KEY` for JWT compatibility
4. **Flexibility**: Allows independent token expiration and refresh strategies
5. **Security**: Backend validates all API requests independently

### Implementation Details

**Frontend Flow**:
1. User registers/logs in via Better Auth client
2. Frontend calls backend `/api/auth/login` or `/api/auth/register`
3. Backend returns JWT token with user UUID
4. Frontend stores JWT and attaches to all API requests
5. Backend verifies JWT on protected endpoints

**Shared Configuration**:
```env
# Both frontend and backend must share:
SECRET_KEY=<same-32-character-secret>
DATABASE_URL=<same-neon-postgresql-connection-string>
```

**Token Structure**:
```python
{
  "sub": "<user-uuid>",
  "exp": "<expiration-timestamp>",
  "iat": "<issued-at-timestamp>"
}
```

## Consequences

### Positive
- Clear separation of concerns between frontend session and API auth
- Better Auth handles edge cases (password reset, email verification)
- Backend maintains full control over API authorization
- User data isolation enforced at API layer

### Negative
- Two authentication systems to maintain
- Slightly more complex initial setup
- Requires careful secret key synchronization

### Security Implications
- Secret key must be securely stored in both environments
- JWT tokens expire after 15 minutes (configurable)
- Rate limiting on auth endpoints prevents brute force attacks
- Password hashing uses bcrypt with appropriate cost factor

## Compliance

This decision complies with the following constitutional principles:
- **Security-First Architecture**: JWT token-based authentication required
- **User Data Isolation**: Enforced at database and API layers
- **No Hardcoded Secrets**: All configuration via environment variables

## Notes

- Token refresh mechanism to be implemented in Phase III
- Password reset flow planned for future enhancement
- Consider migrating to single JWT authority if complexity becomes problematic
