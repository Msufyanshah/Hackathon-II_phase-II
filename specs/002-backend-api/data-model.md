# Data Model: Backend API - Todo Application REST API Service

**Date**: 2026-01-31
**Feature**: Backend API - Todo Application REST API Service
**Branch**: 002-backend-api

## Overview

This document defines the data models for the Backend API Todo application. All models follow constitutional requirements using SQLModel as the single authoritative ORM layer with UUID primary keys for security and scalability. The models serve as the foundation for the backend's domain model layer and are consumed by persistence logic and API handlers.

## Entity Models

### User Model
- **Name**: User
- **Primary Key**: id (UUID4) - Unique identifier for each user
- **Fields**:
  - id: UUID4 (Primary Key, default: gen_random_uuid())
  - email: String (unique, indexed, max_length: 255, required)
  - username: String (unique, indexed, max_length: 50, required)
  - hashed_password: String (indexed, max_length: 255, required)
  - is_active: Boolean (default: True)
  - created_at: DateTime (default: current timestamp)
  - updated_at: DateTime (default: current timestamp, updated on change)
- **Relationships**:
  - tasks: One-to-Many (User has many Tasks, cascade delete)
- **Validation Rules**:
  - Email format validation
  - Username alphanumeric with underscores/hyphens only
  - Password minimum length of 8 characters
- **Indexes**: email, username, created_at

### Task Model
- **Name**: Task
- **Primary Key**: id (UUID4) - Unique identifier for each task
- **Fields**:
  - id: UUID4 (Primary Key, default: gen_random_uuid())
  - title: String (max_length: 200, required)
  - description: String (optional, max_length: 1000)
  - is_completed: Boolean (default: False)
  - user_id: UUID4 (Foreign Key to User.id, required)
  - created_at: DateTime (default: current timestamp)
  - updated_at: DateTime (default: current timestamp, updated on change)
- **Relationships**:
  - user: Many-to-One (Task belongs to one User)
- **Validation Rules**:
  - Title minimum length of 1 character
  - Title maximum length of 200 characters
  - Description maximum length of 1000 characters
- **Indexes**: user_id, created_at, is_completed

### AuthToken Model (Refresh Token Management)
- **Name**: AuthToken
- **Primary Key**: id (UUID4) - Unique identifier for each refresh token record
- **Purpose**: Store refresh token metadata for stateful refresh token management while maintaining stateless access tokens (JWT)
- **Fields**:
  - id: UUID4 (Primary Key, default: gen_random_uuid())
  - user_id: UUID4 (Foreign Key to User.id, required)
  - token_hash: String (indexed, unique, max_length: 255, required)
  - expires_at: DateTime (required)
  - created_at: DateTime (default: current timestamp)
  - is_revoked: Boolean (default: False)
- **Relationships**:
  - user: Many-to-One (AuthToken belongs to one User)
- **Validation Rules**:
  - expires_at must be in the future
  - token_hash must be securely hashed using bcrypt or similar
- **Indexes**: user_id, token_hash, expires_at
- **Usage**: This model is used exclusively for refresh token revocation tracking. Access tokens remain stateless JWTs as required by constitutional authentication strategy.

## State Transitions

### Task State Transitions
- **Initial State**: New Task (is_completed: False)
- **Transition 1**: Incomplete → Completed
  - Trigger: User marks task as complete
  - Action: Set is_completed = True
  - Validation: Task belongs to authenticated user
- **Transition 2**: Completed → Incomplete
  - Trigger: User marks task as incomplete
  - Action: Set is_completed = False
  - Validation: Task belongs to authenticated user

### User State Transitions
- **Initial State**: Pending Activation (is_active: False)
- **Transition 1**: Pending → Active
  - Trigger: Successful account verification
  - Action: Set is_active = True
- **Transition 2**: Active → Deactivated
  - Trigger: User deactivation request or admin action
  - Action: Set is_active = False
  - Note: Does not delete user data to maintain referential integrity

## Relationship Constraints

### Referential Integrity
- Tasks are deleted when the associated User is deleted (cascade delete)
- AuthTokens are deleted when the associated User is deleted (cascade delete)
- All foreign key relationships enforce referential integrity

### Data Isolation
- All queries must include user_id filter to ensure data isolation
- Cross-user data access is prevented at the application layer
- Database views/procedures enforce user ownership

## Indexing Strategy

### Primary Indexes
- All UUID primary keys are automatically indexed
- Foreign key columns are indexed for join performance

### Secondary Indexes
- User email and username for authentication performance
- Task user_id for user-specific queries
- Timestamp fields for time-based queries
- Boolean fields (is_completed, is_active) for filtered queries

## Validation Rules

### Input Validation
- All string inputs are validated for length and format
- Email addresses use standard email format validation
- Usernames allow alphanumeric characters, underscores, and hyphens only
- Passwords must meet minimum security requirements

### Business Logic Validation
- Tasks can only be modified by their owner
- Users cannot access other users' tasks
- Authentication tokens expire automatically
- Deleted users have their authentication tokens invalidated

## Security Considerations

### Data Protection
- Passwords are stored as bcrypt hashes
- Authentication tokens are securely hashed
- Sensitive data is encrypted at rest when required
- Personal information is protected according to privacy regulations

### Access Control
- Row-level security ensures user data isolation
- Authentication required for all protected operations
- Authorization checks performed at service layer
- Audit trails maintained for sensitive operations

This data model aligns with constitutional requirements and provides the foundation for the application's persistence layer.