---
description: "Task list for Better Auth integration in frontend"
---

# Tasks: Better Auth Integration

**Input**: Design documents from `/specs/003-better-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No explicit test requirements specified in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Better Auth integration project structure
- [x] T002 [P] Install Better Auth dependencies in frontend: npm install better-auth @better-auth/react
- [x] T003 [P] Update frontend package.json with Better Auth dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Better Auth client configuration in frontend/src/lib/better-auth-client.ts
- [x] T005 [P] Create Better Auth context wrapper in frontend/src/contexts/BetterAuthContext.tsx
- [x] T006 [P] Update environment configuration for Better Auth in .env.local
- [x] T007 Modify API client to work with Better Auth tokens in frontend/src/lib/ApiClient.ts
- [x] T008 Update frontend tsconfig.json to support Better Auth imports if needed

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration with Better Auth (Priority: P1) 🎯 MVP

**Goal**: Enable users to register for new accounts using Better Auth's registration flow

**Independent Test**: Can navigate to registration page, fill form with valid credentials, and successfully create an account with automatic login

### Implementation for User Story 1

- [x] T009 [P] [US1] Update registration page UI in frontend/src/app/register/page.tsx to use Better Auth
- [x] T010 [US1] Implement Better Auth registration handler in registration page
- [x] T011 [US1] Test registration flow with Better Auth integration
- [x] T012 [US1] Verify new user is created and automatically logged in after registration

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Login with Better Auth (Priority: P1)

**Goal**: Enable existing users to securely log in to their accounts using Better Auth's login flow

**Independent Test**: Can navigate to login page, enter valid credentials, and successfully authenticate with redirect to dashboard

### Implementation for User Story 2

- [x] T013 [P] [US2] Update login page UI in frontend/src/app/login/page.tsx to use Better Auth
- [x] T014 [US2] Implement Better Auth login handler in login page
- [x] T015 [US2] Test login flow with Better Auth integration
- [x] T016 [US2] Verify user authentication state and redirect to dashboard after login

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure API Access with Better Auth Tokens (Priority: P2)

**Goal**: Enable authenticated users to access protected API endpoints with Better Auth's automatic token management

**Independent Test**: Can authenticate a user and make API calls to protected endpoints with tokens automatically attached

### Implementation for User Story 3

- [x] T017 [P] [US3] Update API client interceptors to use Better Auth session tokens in frontend/src/lib/ApiClient.ts
- [x] T018 [US3] Test API calls with Better Auth authentication tokens
- [x] T019 [US3] Verify token refresh and expiration handling works automatically
- [x] T020 [US3] Test protected route access with Better Auth authentication state

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - User Profile Management (Priority: P3)

**Goal**: Enable authenticated users to view and update their profile information through Better Auth integration

**Independent Test**: Can log in as a user, access profile management interface, update information, and verify changes persist

### Implementation for User Story 4

- [x] T021 [P] [US4] Create user profile page in frontend/src/app/profile/page.tsx
- [x] T022 [US4] Implement profile retrieval using Better Auth session data
- [x] T023 [US4] Test profile viewing functionality with Better Auth integration
- [x] T024 [US4] Verify profile information displays correctly from Better Auth session

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T025 [P] Update documentation for Better Auth implementation in specs/003-better-auth/
- [x] T026 Update README with Better Auth setup instructions in frontend/README.md
- [x] T027 [P] Remove legacy custom JWT authentication code from frontend/src/contexts/AuthContext.tsx
- [x] T028 [P] Remove legacy auth utility functions from frontend/src/lib/auth.ts
- [x] T029 Update protected route components to use Better Auth in frontend/src/components/layouts/
- [x] T030 Run quickstart validation with Better Auth implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Builds on authentication from previous stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tasks for User Story 1 together:
Task: "Update registration page UI in frontend/src/app/register/page.tsx to use Better Auth"
Task: "Implement Better Auth registration handler in registration page"
Task: "Test registration flow with Better Auth integration"
Task: "Verify new user is created and automatically logged in after registration"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. Complete Phase 4: User Story 2
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 & 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence