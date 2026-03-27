# ADR 002: Database and ORM Strategy with SQLModel

**Date**: 2026-03-25  
**Status**: Accepted  
**Deciders**: Development Team

## Context and Problem Statement

The Todo Application requires a robust data persistence layer with the following requirements:
- PostgreSQL database (Neon Serverless)
- Type-safe ORM for Python
- Schema validation for all data operations
- Migration support for schema evolution
- UUID primary keys for security
- Timestamp tracking (created_at, updated_at)

We need to select an ORM strategy that provides type safety, validation, and maintainability.

## Considered Options

### Option 1: SQLAlchemy Core
- Direct SQL with Python bindings
- Maximum flexibility and control
- No automatic object mapping
- Manual schema validation required

### Option 2: SQLAlchemy + Pydantic
- SQLAlchemy for ORM
- Pydantic for schema validation
- Two separate type systems to maintain
- More boilerplate code

### Option 3: SQLModel
- Combines SQLAlchemy and Pydantic
- Single source of truth for models and schemas
- Built-in validation
- Type-safe with Python type hints
- Recommended by FastAPI creator

### Option 4: Prisma (Python)
- Type-safe database toolkit
- Auto-generated types from schema
- Different paradigm (query builder)
- Less mature Python ecosystem

## Decision Outcome

**Chosen Option: Option 3 - SQLModel**

### Rationale

1. **Unified Type System**: Single model definition for database and validation
2. **FastAPI Integration**: Designed by same author, seamless integration
3. **Type Safety**: Full Python type hint support
4. **Validation**: Pydantic validation built-in
5. **Constitutional Compliance**: Mandated by project constitution (Section 6.1)

### Implementation Details

**Model Pattern**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from uuid import UUID, uuid4

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(max_length=1000)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

**Database Engine**:
```python
from sqlmodel import create_engine

engine = create_engine(
    settings.DATABASE_URL,  # Neon PostgreSQL connection string
    echo=False,  # Set True for SQL debugging
)
```

**Migration Strategy**:
- Alembic for schema migrations
- Auto-generate migrations from SQLModel changes
- Version-controlled migration files

### DateTime Handling

**Decision**: Use timezone-aware datetime with `datetime.now(timezone.utc)`

**Rationale**:
- `datetime.utcnow()` is deprecated in Python 3.12+
- Timezone-aware datetimes prevent ambiguity
- UTC ensures consistency across deployments
- SQLAlchemy events handle `updated_at` automatically

```python
@event.listens_for(Task, 'before_update')
def update_updated_at(target: Task, conn, kwargs):
    target.updated_at = datetime.now(timezone.utc)
```

## Consequences

### Positive
- Single model definition reduces code duplication
- Automatic validation on model creation
- Type hints enable IDE autocomplete and type checking
- FastAPI automatically generates OpenAPI docs from models
- Constitution compliance

### Negative
- SQLModel is younger than SQLAlchemy (less battle-tested)
- Some advanced SQLAlchemy features require dropping to SQLAlchemy core
- Migration auto-generation sometimes needs manual adjustment

### Performance Implications
- Minimal overhead compared to raw SQLAlchemy
- Validation happens at model instantiation (acceptable trade-off)
- Connection pooling handled by SQLAlchemy engine

## Compliance

This decision complies with constitutional principles:
- **Database Integrity**: SQLModel as single authoritative ORM layer
- **Type Safety**: Python type hints for all backend code
- **UUID Primary Keys**: All entities use UUID for security

## Migration Guidelines

### Creating a Migration

```bash
cd backend
alembic revision --autogenerate -m "Add new_field to tasks"
alembic upgrade head
```

### Rollback Strategy

```bash
alembic downgrade -1  # Rollback one migration
alembic downgrade <revision>  # Rollback to specific revision
```

## Testing

All migrations must be tested:
1. Auto-generate migration
2. Review generated SQL
3. Test upgrade on fresh database
4. Test downgrade path
5. Verify data integrity

## References

- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Alembic Documentation: https://alembic.sqlalchemy.org/
- Neon PostgreSQL: https://neon.tech/docs
