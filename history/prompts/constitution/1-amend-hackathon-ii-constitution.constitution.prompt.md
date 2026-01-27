---
id: 1
title: amend-hackathon-ii-constitution
stage: constitution
date: 2026-01-27
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: sp.constitution
labels: [constitution, hackathon, sdd]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

Phase II Constitution
Project: Hackathon II – Todo (Spec-Driven Development)
1. Purpose

The purpose of Phase II is to stabilize, formalize, and scale the system designed in Phase I by transitioning from implementation-led development to true Spec-Driven Development (SDD).

Phase II prioritizes:

Deterministic behavior

Traceability from idea → spec → code

Reduction of integration errors

Agent-assisted development with minimal ambiguity

This phase exists to ensure that specifications, not assumptions, govern system behavior.

2. Core Development Philosophy

Phase II strictly follows Spec-Driven Development using the Agentic Dev Stack workflow mandated by Hackathon II.

Write spec → Generate plan → Break into tasks → Implement via Claude Code

Rules:

No feature may be implemented without an approved specification

No manual coding is permitted outside agent execution

All iterations (prompts, plans, refinements) are part of the evaluation

Specifications are the primary artifacts under review, not just the final code.

3. Architectural Model

The system follows a multi-layer, service-oriented architecture implemented within a monorepo for maximum agent effectiveness.

3.1 Repository Strategy (Mandated)

A single monorepo is used for frontend, backend, and specifications

This provides a unified context for Claude Code and Spec-Kit Plus

Separate repositories are explicitly discouraged for Phase II

3.2 Technology Stack (Locked)

Frontend: Next.js 16+ (LTS), App Router

Backend: Python FastAPI

ORM: SQLModel

Database: Neon Serverless PostgreSQL

Authentication: Better Auth (JWT-based)

Spec & Agent Tooling: Spec-Kit Plus, Claude Code, Qwen

Any deviation from this stack requires a constitutional amendment.

3.3 Deployment Topology

Frontend: Vercel (UI + API client only)

Backend: Hugging Face Spaces (FastAPI service)

Database: Neon Serverless PostgreSQL (backend-only access)

4. Specification Hierarchy (Order of Authority)

All project artifacts must conform to the following hierarchy:

Constitution (this document)

Shared Contract Specs

Service-Level Specs

Frontend Consumption Specs

Task Specs

Generated or Handwritten Code

If a conflict exists, higher-level documents override lower-level artifacts.

5. Shared Contracts (Single Source of Truth)

Shared contracts are the most critical artifacts in Phase II.

They define:

REST API endpoints and HTTP methods

Request and response schemas

Authentication and authorization expectations

Error formats and status codes

5.1 Required REST Endpoints

The following endpoints are mandatory and must be specified before implementation:

GET /api/{user_id}/tasks – List tasks

POST /api/{user_id}/tasks – Create task

GET /api/{user_id}/tasks/{id} – Get task details

PUT /api/{user_id}/tasks/{id} – Update task

DELETE /api/{user_id}/tasks/{id} – Delete task

PATCH /api/{user_id}/tasks/{id}/complete – Toggle completion

All endpoints:

Require a valid JWT token

Must enforce user ownership

Must return only the authenticated user's data

Breaking a shared contract is a critical system failure.

6. Backend Specification Rules

The backend is responsible for:

Enforcing shared contracts

Validating all incoming data

Applying authorization rules

Preserving data integrity

6.1 Database & ORM Responsibilities

SQLModel is the single authoritative ORM layer

Database schema must be derived from SQLModel definitions

All database invariants (uniqueness, nullability, relationships) must be reflected in specs

Migrations must not silently break existing contracts

6.2 API Behavior Constraints

FastAPI schemas must map directly to contract specs

Validation errors must follow the defined error contract

Business rules must be enforced server-side

The backend may not introduce behavior not declared in specs.

7. Frontend Specification Rules

The frontend is responsible for:

Consuming contracts exactly as defined

Handling success and failure deterministically

Providing UI behavior that reflects backend guarantees

Constraints:

No undocumented API calls

No inferred or guessed fields

Client-side validation must mirror contract rules

The frontend does not own business logic; it renders outcomes of contracts.

8. Authentication & Authorization Boundary

Authentication is delegated to Better Auth as an external bounded context.

8.1 Authentication Contract Clarity

Only the following aspects are considered spec-authoritative:

Token type (e.g., JWT)

Token structure and claims

Token expiry and refresh semantics

Trust assumptions between frontend and backend

Better Auth internals are treated as opaque and are not depended upon directly.

8.2 Authorization Rules

Authorization is enforced exclusively on the backend

Frontend may only perform UX-level gating

Claims-based authorization must be explicitly specified

Authorization logic must never be inferred or duplicated across layers.

9. Agent-Assisted Development Policy

AI agents (Claude Code, Qwen) are the exclusive implementers of code in Phase II.

Rules:

Humans write and refine specifications only

Agents generate plans, tasks, and code

Manual edits to implementation files are prohibited

Agents must:

Read relevant specs before acting

Reference specs explicitly (e.g., @specs/features/task-crud.md)

Stay within defined architectural and security boundaries

Any code not traceable to a spec-driven agent task is invalid.

10. Error Handling Doctrine

Errors are contractual, not incidental.

Rules:

All errors must have defined shapes

HTTP status codes must be intentional

Frontend error handling must map to error specs

Unspecified errors are treated as design defects.

11. Traceability & Auditability

Every meaningful change must be traceable:

Feature → Contract

Contract → Service Spec

Service Spec → Task

Task → Code

This traceability ensures:

Debugging efficiency

Agent reliability

Reduced regression risk

12. Non-Goals (Explicit)

Phase II does not aim to:

Prematurely optimize performance

Introduce microservices beyond logical boundaries

Add features without spec justification

Bypass validation for speed

Correctness and clarity outweigh speed.

13. Amendment Policy

This constitution may be amended only when:

A clear limitation is identified

The change is documented

The impact on existing specs is assessed

Silent drift is prohibited.

14. Feature Progression & Scope Control

Phase II follows a three-level feature progression model. This model defines scope boundaries and prevents uncontrolled feature creep.

14.1 Basic Level (Core Essentials) — Mandatory for Phase II

These features form the minimum viable system and must be fully implemented as a web application:

Add Task – Create new todo items

Delete Task – Remove tasks from the list

Update Task – Modify existing task details

View Task List – Display all tasks for the authenticated user

Mark as Complete – Toggle task completion status

All Basic Level features must:

Use REST API endpoints defined in shared contracts

Enforce user ownership via JWT

Persist data in Neon PostgreSQL

14.2 Intermediate Level (Organization & Usability) — Optional / Post-Basic

These features enhance usability but are not required for Phase II completion unless explicitly added via specs:

Priorities and tags/categories (e.g., high/medium/low, work/home)

Search and filtering by keyword, status, priority, or date

Sorting by due date, priority, or alphabetical order

Intermediate features must not be implemented without explicit feature specifications.

14.3 Advanced Level (Intelligent Features) — Out of Scope for Phase II

These features are deferred and must not influence Phase II architecture:

Recurring tasks (auto-rescheduling)

Due dates and time-based reminders

Browser or system notifications

Advanced features are reserved for future phases and require architectural review.

15. Success Criteria for Phase II

Phase II is considered successful when:

All Basic Level features are implemented end-to-end

RESTful API endpoints conform exactly to shared contracts

Authentication and user isolation work correctly via JWT

Data is pers

## Response snapshot

The constitution has been successfully updated with the Phase II Constitution for the Hackathon II Todo project. The new constitution establishes core principles around Spec-Driven Development, agent-assisted development, shared contracts as the single source of truth, deterministic behavior and traceability, technology stack adherence, and a three-level feature progression model.

Key changes include:
- Version 1.0.0 of the constitution has been established
- Core principles defined with specific rules and guidelines
- Architectural requirements specified
- Development workflow outlined with clear hierarchies
- Governance policies established

## Outcome

- ✅ Impact: Constitution updated to version 1.0.0 with comprehensive Phase II guidelines
- 🧪 Tests: none
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: Ready for feature specification and planning
- 🧠 Reflection: Constitution now provides clear governance for the Hackathon II project

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification based on new constitution