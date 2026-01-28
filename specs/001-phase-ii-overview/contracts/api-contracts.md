# API Contracts for Phase II Spec-Driven Todo Application

## Contract Overview

This document defines the behavioral and security contracts for the todo application API. The OpenAPI specification (openapi.yaml) serves as the formal interface definition, while this document outlines the critical business rules and constraints that must be enforced.

## Security Requirements

- All protected endpoints MUST require JWT authentication in the Authorization header as "Bearer {token}"
- All authentication-related endpoints (login, register, logout) are exempt from JWT requirements
- API implementations MUST validate JWT tokens against the configured authentication provider
- Expired or invalid tokens MUST result in 401 Unauthorized responses

## Performance Requirements

The system SHOULD demonstrate reasonable responsiveness for interactive usage under expected hackathon-scale load.

## User Ownership Enforcement

- All task operations MUST verify that the authenticated user ID matches the task's user_id property
- Task retrieval endpoints MUST only return tasks owned by the authenticated user
- All task mutations MUST verify that task.user_id == authenticated_user.id
- Any attempt to access another user's tasks MUST result in 403 Forbidden response
- User ID path parameters MUST match the authenticated user's identity for validation

## Non-Functional Constraints

- Base Path: Defined in OpenAPI (openapi.yaml)
- Completion field: The task completion status is represented as "completed" (boolean) rather than "is_completed"
- All API responses MUST include appropriate HTTP status codes as defined in the OpenAPI specification
- All error responses MUST follow the standardized error format defined in the OpenAPI specification