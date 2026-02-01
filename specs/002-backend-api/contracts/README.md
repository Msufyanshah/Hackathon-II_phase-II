# Backend API Contracts

This directory contains the backend-specific contracts and API specifications for the Todo Application backend service.

## Contract Files

- `api-contracts.md` - Behavioral and security contracts for the API
- `openapi.yaml` - OpenAPI 3.0 specification defining the API endpoints, schemas, and contracts
- `database-contracts.md` - Database schema and persistence contracts
- `security-contracts.md` - Authentication and authorization contracts

## Contract Hierarchy

Following the constitutional requirement for shared contracts as the single source of truth:

1. **OpenAPI Specification** (`openapi.yaml`) - Formal interface definition
2. **Behavioral Contracts** (`api-contracts.md`) - Critical business rules and constraints
3. **Security Contracts** (`security-contracts.md`) - Authentication and authorization requirements
4. **Database Contracts** (`database-contracts.md`) - Persistence and data integrity requirements

All backend implementation must comply with these contracts in the specified order of authority.