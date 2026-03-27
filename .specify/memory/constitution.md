# Todo Application Constitution

## Core Principles

### I. Contract-First Development
All API endpoints must be defined in OpenAPI specification before implementation. Frontend and backend must adhere strictly to defined contracts without introducing undocumented behaviors.

### II. Security-First Architecture
- JWT token-based authentication required on all protected endpoints
- User data isolation enforced at database and API layers
- No hardcoded secrets; all sensitive configuration via environment variables
- Password hashing using bcrypt with appropriate cost factors

### III. Test-Driven Development (NON-NEGOTIABLE)
- Tests written before implementation code
- Red-Green-Refactor cycle enforced for all features
- Minimum 80% code coverage required for all modules
- Integration tests for all API endpoints

### IV. Type Safety
- TypeScript for all frontend code
- Python type hints for all backend code
- Pydantic schemas for all request/response validation
- No `any` types in TypeScript without explicit justification

### V. Database Integrity
- SQLModel as single authoritative ORM layer
- UUID primary keys for all entities
- Database constraints enforce data integrity
- Migrations version-controlled and tested

### VI. Observability
- Structured logging with correlation IDs
- All errors logged with stack traces in development
- Health check endpoints for monitoring
- Request/response logging for debugging

### VII. Performance Budgets
- API responses under 200ms for p95
- Frontend initial load under 3 seconds
- Database queries under 100ms
- No N+1 query patterns allowed

### VIII. Accessibility
- WCAG 2.1 AA compliance for all UI components
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements met

## Additional Constraints

### Security Requirements
- Rate limiting on authentication endpoints (max 5 requests/minute)
- CORS configured explicitly for allowed origins only
- HTTPS required in production
- JWT tokens expire within 15 minutes
- Refresh token rotation implemented

### Code Quality Standards
- ESLint + Prettier for frontend code
- Black + isort + flake8 for backend code
- No console.log in production frontend code
- Docstrings required for all public functions

### Deployment Requirements
- Environment-specific configuration via .env files
- Database migrations run automatically on deployment
- Health checks pass before traffic routing
- Rollback capability within 5 minutes

## Development Workflow

### Code Review Requirements
- All changes require PR review
- Tests must pass before merge
- Code coverage must not decrease
- Security scan must pass

### Quality Gates
1. **Pre-commit**: Linting, formatting, type checking
2. **CI Pipeline**: Unit tests, integration tests, security scan
3. **Pre-deployment**: E2E tests, performance tests
4. **Post-deployment**: Health checks, smoke tests

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Written proposal with rationale
2. Team review and approval
3. Migration plan for existing code
4. Documentation update

**Version**: 1.0.0 | **Ratified**: 2026-03-25 | **Last Amended**: 2026-03-25
