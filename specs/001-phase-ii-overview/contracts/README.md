# API Contracts for Phase II Spec-Driven Todo Application

## Overview

This document defines the formal API contracts for the todo application, specifying the behavioral and security requirements for the interface between frontend and backend services. All implementations must conform to these contracts to ensure proper integration and data isolation.

The OpenAPI specification (openapi.yaml) is the single source of truth.

## How to Authenticate (high-level)

All protected endpoints require JWT authentication in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

The system enforces user data isolation - users can only access resources associated with their own account.

## How to Read the OpenAPI Spec

The openapi.yaml file contains the formal API specification with detailed endpoints, schemas, and response formats. Use an OpenAPI viewer or validator to visualize the complete API contract.

## Development Rules (no implementation)

- All API implementations MUST strictly follow the OpenAPI specification
- No undocumented endpoints or behaviors are permitted
- All authentication and authorization checks MUST be performed server-side
- Input validation MUST occur for all request parameters and bodies

## Ownership & Authorization Rules (plain English)

- Users can only access tasks where `user_id` matches their authenticated user ID
- Attempts to access another user's tasks will result in a 403 Forbidden response
- Path parameters must match the authenticated user's ID for validation
- All task mutations MUST verify that task.user_id == authenticated_user.id