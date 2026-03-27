# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records (ADRs) for the Todo Application. Each ADR documents a significant architectural decision, its context, and consequences.

## ADR Index

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](./001-authentication-architecture.md) | Authentication Architecture with Dual JWT System | Accepted | 2026-03-25 |
| [002](./002-database-orm-strategy.md) | Database and ORM Strategy with SQLModel | Accepted | 2026-03-25 |
| [003](./003-testing-strategy.md) | Testing Strategy and Framework Selection | Accepted | 2026-03-25 |

## ADR Template

When creating new ADRs, use the following structure:

```markdown
# ADR XXX: [Title]

**Date**: YYYY-MM-DD  
**Status**: [Proposed | Accepted | Deprecated | Superseded]  
**Deciders**: [List of decision makers]

## Context and Problem Statement

[Describe the problem and context]

## Considered Options

[List options considered with pros/cons]

## Decision Outcome

[Chosen option with rationale]

## Consequences

[Positive, negative, and security implications]

## Compliance

[How this aligns with constitution]

## Notes

[Additional context and future considerations]
```

## ADR Status Definitions

- **Proposed**: Under discussion, not yet approved
- **Accepted**: Approved and being implemented
- **Deprecated**: No longer recommended, but still in use
- **Superseded**: Replaced by a newer ADR

## Related Documentation

- [Project Constitution](../.specify/memory/constitution.md)
- [Phase II Specification](../specs/001-phase-ii-overview/spec.md)
- [Backend API Specification](../specs/002-backend-api/spec.md)
