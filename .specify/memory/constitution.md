<!--
SYNC IMPACT REPORT
Version change: undefined → 1.0.0
Added sections: All sections from user input (Purpose, Core Development Philosophy, Architectural Model, etc.)
Removed sections: Template placeholders ([PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], etc.)
Modified principles: None (completely new constitution based on user input)
Templates requiring updates: ⚠ pending review of plan-template.md, spec-template.md, tasks-template.md
Follow-up TODOs: RATIFICATION_DATE needs to be set appropriately
-->

# Hackathon II – Todo Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development must follow the Spec-Driven Development workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No feature may be implemented without an approved specification; no manual coding is permitted outside agent execution.

### II. Agent-Assisted Development Policy
AI agents (Claude Code, Qwen) are the exclusive implementers of code in Phase II. Humans write and refine specifications only; agents generate plans, tasks, and code; manual edits to implementation files are prohibited.

### III. Shared Contracts as Single Source of Truth
Shared contracts define REST API endpoints, request/response schemas, authentication expectations, and error formats. Breaking a shared contract is a critical system failure that must be prevented.

### IV. Deterministic Behavior and Traceability
All changes must maintain traceability from idea → spec → code to reduce integration errors. Every meaningful change must be traceable: Feature → Contract → Service Spec → Task → Code.

### V. Technology Stack Adherence (Locked)
Strict adherence to mandated technology stack: Frontend: Next.js 16+ (LTS), App Router; Backend: Python FastAPI; ORM: SQLModel; Database: Neon Serverless PostgreSQL; Authentication: Better Auth (JWT-based). Any deviation requires constitutional amendment.

### VI. Three-Level Feature Progression Model
Implementation follows a strict three-tier model: Basic Level (core essentials - mandatory), Intermediate Level (organization/usability - optional), Advanced Level (intelligent features - out of scope for Phase II).

## Architectural Requirements

### Monorepo Strategy (Mandated)
A single monorepo is used for frontend, backend, and specifications to provide unified context for Claude Code and Spec-Kit Plus. Separate repositories are explicitly discouraged for Phase II.

### Deployment Topology
Frontend: Vercel (UI + API client only); Backend: Hugging Face Spaces (FastAPI service); Database: Neon Serverless PostgreSQL (backend-only access). This topology must be maintained as specified.

### Authentication & Authorization Boundary
Authentication is delegated to Better Auth as an external bounded context. Authorization is enforced exclusively on the backend; frontend may only perform UX-level gating. Claims-based authorization must be explicitly specified.

## Development Workflow

### Specification Hierarchy (Order of Authority)
All project artifacts must conform to the following hierarchy: Constitution (this document) → Shared Contract Specs → Service-Level Specs → Frontend Consumption Specs → Task Specs → Generated or Handwritten Code. Higher-level documents override lower-level artifacts.

### Backend Specification Rules
The backend is responsible for enforcing shared contracts, validating all incoming data, applying authorization rules, and preserving data integrity. FastAPI schemas must map directly to contract specs; validation errors must follow the defined error contract.

### Frontend Specification Rules
The frontend is responsible for consuming contracts exactly as defined, handling success and failure deterministically, and providing UI behavior that reflects backend guarantees. Client-side validation must mirror contract rules; the frontend does not own business logic.

### Error Handling Doctrine
Errors are contractual, not incidental. All errors must have defined shapes, HTTP status codes must be intentional, and frontend error handling must map to error specs. Unspecified errors are treated as design defects.

## Governance

### Amendment Policy
This constitution may be amended only when: a clear limitation is identified, the change is documented, the impact on existing specs is assessed. Silent drift is prohibited. Constitutional amendments require explicit documentation and approval process.

### Non-Goals (Explicit)
Phase II does not aim to: prematurely optimize performance, introduce microservices beyond logical boundaries, add features without spec justification, bypass validation for speed. Correctness and clarity outweigh speed.

### Success Criteria for Phase II
Phase II is considered successful when: All Basic Level features are implemented end-to-end; RESTful API endpoints conform exactly to shared contracts; Authentication and user isolation work correctly via JWT; Data is persisted properly with user ownership enforcement.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): to be set | **Last Amended**: 2026-01-27