---
id: 0002
title: Update tasks.md for contract alignment
stage: tasks
date: 2026-01-29
surface: agent
model: Claude Sonnet 4.5
feature: 001-phase-ii-overview
branch: 001-phase-ii-overview
user: sufi
command: /sp.tasks
labels: ["tasks", "frontend", "contract", "validation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - E:/Hackathon-II_phase-II/specs/001-phase-ii-overview/tasks.md
tests:
 - none
---

## Prompt

update these changes and addition in tasks.md:
Task ID: T047

- [x] T047 TaskCompletionToggle
  - Calls PATCH /users/{userId}/tasks/{taskId}/complete

✅ Corrected (contract-aligned)
- [ ] T047 TaskCompletionToggle
  - Calls PATCH /users/{userId}/tasks/{taskId}
  - Toggles completion state via request body as defined in openapi.yaml
FIX 2 — Filtering Clarification (No Backend Assumption)
❌ Current (ambiguous)

Task ID: T043

- [x] T043 TaskFilter
  - Filters tasks via API

✅ Corrected (explicit, contract-safe)
- [ ] T043 TaskFilter
  - Performs client-side filtering only
  - Uses data from GET /users/{userId}/tasks
  - No filtering parameters assumed unless defined in openapi.yaml
FIX 3 — Missing Endpoint Reference (Traceability)
❌ Current

Task ID: T049

- [x] T049 TaskDetailModal
  - Displays full task details

✅ Corrected
- [ ] T049 TaskDetailModal
  - Fetches task via GET /users/{userId}/tasks/{taskId}
  - Displays task details per Task schema in openapi.yaml
FIX 5 — Schema Validation Explicitness
🔧 Update these tasks (description only)

Tasks: T039, T040, T041, T042

Append this line to each:

- Validation MUST strictly conform to the corresponding schema in openapi.yaml
OPTIONAL (Recommended) — Error Handling Completeness
🔧 Add to error handling task(s)
- Must explicitly handle HTTP error codes:
  400, 401, 403, 404, 409 as defined in openapi.yaml

## Response snapshot

Successfully updated the tasks.md file to align with the openapi.yaml contract:

1. Fixed T047 TaskCompletionToggle task to correctly reference PATCH /users/{userId}/tasks/{taskId} (instead of the incorrect /complete suffix) as defined in the openapi.yaml contract

2. Updated T043 TaskFilter task to explicitly state "performing client-side filtering only" to clarify that no backend filtering parameters are assumed since they're not defined in openapi.yaml

3. Enhanced T049 TaskDetailModal task to explicitly reference the GET /users/{userId}/tasks/{taskId} endpoint and specify that it displays data per the Task schema in openapi.yaml

4. Added schema validation requirements to form validation tasks (T039, T040, T041, T042) to ensure validation "strictly conforms to the corresponding schema in openapi.yaml"

5. Enhanced error handling tasks (T027, T037, T068) to explicitly specify that they "must handle HTTP error codes: 400, 401, 403, 404, 409 as defined in openapi.yaml"

All changes ensure better contract compliance and traceability between frontend tasks and the backend API specification.

## Outcome

- ✅ Impact: Improved contract alignment between frontend tasks and openapi.yaml specification
- 🧪 Tests: No tests needed for this documentation update
- 📁 Files: Updated tasks.md with contract-compliant task descriptions
- 🔁 Next prompts: Ready to proceed with contract-compliant frontend implementation
- 🧠 Reflection: Changes enhance traceability and ensure frontend components properly align with backend contracts

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - all contract alignment issues resolved
- Prompt variant (if applicable): Contract validation improvement
- Next experiment (smallest change to try): Proceed with implementation based on corrected tasks
