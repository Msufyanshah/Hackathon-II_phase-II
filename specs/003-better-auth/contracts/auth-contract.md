# Authentication API Contract: Better Auth Integration

## Overview
This document defines the API contract for authentication endpoints that will work with Better Auth integration. The contract maintains compatibility with the existing backend API while leveraging Better Auth's token management.

## Authentication Endpoints

### Registration
**POST** `/api/auth/register`

Registers a new user account with Better Auth.

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "username"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "username": "username",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "access_token": "jwt-token-string",
    "token_type": "Bearer"
  }
}
```

#### Response (Error - 409)
```json
{
  "success": false,
  "error": {
    "code": "USER_EXISTS",
    "message": "User with this email already exists"
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticates a user and returns an access token.

#### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "username": "username",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "access_token": "jwt-token-string",
    "token_type": "Bearer"
  }
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Incorrect email or password"
  }
}
```

### Get Current User
**GET** `/api/auth/me`

Retrieves the currently authenticated user's information.

#### Headers
```
Authorization: Bearer {access_token}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "username",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Response (Error - 401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated"
  }
}
```

### Logout
**POST** `/api/auth/logout`

Logs out the current user and invalidates the session.

#### Headers
```
Authorization: Bearer {access_token}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## Token Management

### Token Format
- Better Auth will generate JWT tokens compatible with the existing backend
- Tokens will include user identity information in the payload
- Standard JWT structure with `sub`, `iat`, and `exp` claims

### Token Refresh
- Automatic token refresh handled by Better Auth client
- Refresh endpoints will be available if needed
- Seamless renewal before token expiration

## Security Considerations

### Authentication Headers
All authenticated requests must include:
```
Authorization: Bearer {token}
```

### Rate Limiting
Authentication endpoints should implement rate limiting to prevent brute-force attacks.

### Password Requirements
- Minimum 8 characters
- At least one uppercase, lowercase, number, and special character (configurable)

## Integration Notes

### Frontend Integration
- Better Auth client will automatically handle token inclusion in requests
- Session state will be managed by Better Auth
- Redirects will be handled according to Better Auth configuration

### Backend Compatibility
- Existing backend API endpoints will continue to function
- JWT token validation remains unchanged
- User data models remain the same