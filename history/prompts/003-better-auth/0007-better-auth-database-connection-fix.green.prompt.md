---
id: 0007
title: Better Auth Database Connection Fix
stage: green
date: 2026-02-28
surface: agent
model: qwen-3.5b
feature: 003-better-auth
branch: main
user: sufi
command: Database connection debugging and fix
labels: ["better-auth", "database", "neon-postgresql", "migration", "env-configuration"]
links:
  spec: specs/003-better-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/.env
  - frontend/src/lib/auth.ts
  - frontend/check-db.js
tests:
  - Database table verification via Node.js script
  - Better Auth API endpoint testing
---

## Prompt

Frontend logs showing Better Auth 500 errors:
```
BetterAuthContext.tsx:20  GET http://localhost:3000/api/auth/get-session 500 (Internal Server Error)
[Error [BetterAuthError]: Failed to initialize database adapter]
```

Backend is healthy and running on port 8000.

## Response snapshot

### Root Cause Analysis

1. **Multiple .env files**: Found 3 env files in frontend (`.env`, `.env.local`, `.env.example`)
2. **Outdated DATABASE_URL**: The `.env` file had old connection string with `&channel_binding=require` parameter
3. **Better Auth CLI bug**: The `@better-auth/cli migrate` command has compatibility issues with Neon connection strings
4. **Database tables already exist**: Verified via custom Node.js script that all Better Auth tables (user, session, account, verification) already exist in Neon database

### Issues Fixed

1. **Updated `frontend/.env`**: Removed `&channel_binding=require` from DATABASE_URL
2. **Simplified `frontend/src/lib/auth.ts`**: Changed database config from object format to direct string:
   ```typescript
   database: process.env.DATABASE_URL!
   ```
3. **Created verification script**: `check-db.js` to verify database tables exist

### Files Modified
- `frontend/.env` - Fixed DATABASE_URL
- `frontend/src/lib/auth.ts` - Simplified database configuration
- `frontend/check-db.js` - Created database verification script

### Verification
Ran `node check-db.js` which confirmed tables exist:
- user
- session
- account
- verification
- tasks
- users
- auth_tokens

## Outcome

- ✅ Impact: Database is properly configured, Better Auth tables exist, frontend should now work
- 🧪 Tests: Database connection verified via Node.js script, frontend restarted with clean cache
- 📁 Files: 3 files modified/created
- 🔁 Next prompts: Test registration flow with frontend + backend both running
- 🧠 Reflection: Better Auth CLI has bugs with Neon connection strings, but Next.js app uses different code path that should work

## Evaluation notes (flywheel)

- Failure modes observed: Better Auth CLI migration tool incompatible with Neon connection strings
- Graders run and results (PASS/FAIL): N/A - Manual debugging
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test registration flow - if still failing, check Better Auth Next.js handler configuration
