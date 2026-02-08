# Data Model: Better Auth Integration

## Overview
This document defines the data structures and relationships involved in the Better Auth integration. Since Better Auth manages most of the authentication data internally, this focuses on how the application will interact with and utilize the authentication state.

## Primary Entities

### User Session
**Description**: Represents the authenticated state of a user managed by Better Auth

**Fields**:
- `id`: Unique identifier for the session (provided by Better Auth)
- `userId`: Identifier of the authenticated user (provided by Better Auth)
- `email`: User's email address (provided by Better Auth)
- `username`: User's username/display name (provided by Better Auth)
- `accessToken`: Current authentication token (managed by Better Auth)
- `expiresAt`: Expiration timestamp for the current session (managed by Better Auth)
- `createdAt`: Timestamp when the session was established

**Relationships**:
- Links to user's data in the application backend
- Associated with user's preferences and settings

### Authentication State
**Description**: Application-level state representing the current authentication status

**Fields**:
- `isAuthenticated`: Boolean indicating if user is currently authenticated
- `isLoading`: Boolean indicating if authentication state is being determined
- `user`: User object containing profile information (from Better Auth)
- `error`: Error information if authentication failed

## Data Flows

### Authentication Initiation
1. User interacts with login/register form
2. Better Auth client processes authentication request
3. Authentication tokens are securely stored
4. Application receives updated authentication state

### API Request Authentication
1. Application prepares API request
2. Better Auth automatically attaches authentication token to request
3. Request is sent to backend with proper authentication
4. Backend validates token and processes request

### Session Management
1. Better Auth monitors session validity
2. Automatically refreshes tokens before expiration
3. Updates application state when session changes
4. Handles session cleanup on logout

## Validation Rules

### User Registration
- Email must be valid and unique
- Password must meet strength requirements
- Username must be unique and properly formatted

### Session Validation
- Sessions must be verified before accessing protected resources
- Expired sessions trigger automatic refresh
- Invalid sessions redirect to login page

## State Transitions

### Login Flow
`Logged Out` → `Authenticating` → `Logged In` → `Session Expired` → `Logged In` (refreshed) or `Logged Out`

### Logout Flow
`Logged In` → `Logging Out` → `Logged Out`

### Registration Flow
`Logged Out` → `Registering` → `Authenticating` → `Logged In`

## Persistence Considerations

### Client-Side Storage
- Authentication tokens managed by Better Auth
- Session state cached in browser storage
- Secure token refresh handled automatically

### Server-Side Storage
- User profiles stored in backend database
- Authentication metadata maintained by Better Auth
- Session records linked to user accounts