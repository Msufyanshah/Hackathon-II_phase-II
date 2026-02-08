---
id: 170820260208123457
title: Fix Frontend `better-auth` Subscribe Error
stage: general
date: 2026-02-08
surface: agent
model: unknown
feature: none
branch: unknown
user: user
command: "the frontend server is showing this error: 

1 of 1 error
Next.js (14.2.35) is outdated (learn more)

Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'subscribe')

Call Stack
Proxy.listen
node_modules\better-auth\dist\client\config.mjs (70:1)
eval
node_modules\better-auth\dist\clienteacteact-store.mjs (39:1)
React
subscribeToStore
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (12033:1)
commitHookEffectListMount
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (21102:1)
commitHookPassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23154:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23259:1)
recursivelyTraversePassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23237:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23237:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjs
..."
labels: ["frontend", "error-fix", "better-auth", "Next.js"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/providers/AuthProviderWrapper.tsx
tests:
  - null
---

## Prompt

the frontend server is showing this error: 

1 of 1 error
Next.js (14.2.35) is outdated (learn more)

Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'subscribe')

Call Stack
Proxy.listen
node_modules\better-auth\dist\client\config.mjs (70:1)
eval
node_modules\better-auth\dist\clienteacteact-store.mjs (39:1)
React
subscribeToStore
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (12033:1)
commitHookEffectListMount
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (21102:1)
commitHookPassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23154:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23259:1)
recursivelyTraversePassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23237:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23237:1)
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23370:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
commitPassiveMountOnFiber
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
commitPassiveMountOnFiber
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
commitPassiveMountOnFiber
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
commitPassiveMountOnFiber
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
recursivelyTraversePassiveMountEffects
webpack-internal:/(app-pages-browser)/node_modules/next/dist/compiled/react-dom/cjs/react-dom.development.js
React
commitPassiveMountOnFiber
node_modules
ext\dist\compiledeact-dom\cjseact-dom.development.js (23256:1)
"
## Response snapshot

I have applied the fix by wrapping the `AuthProvider` with `authClient.Provider` in `frontend/src/components/providers/AuthProviderWrapper.tsx`. This change should be picked up by Next.js's hot reloading.

## Outcome

- ✅ Impact: Frontend `better-auth` subscribe error addressed by correctly wrapping `AuthProvider` with `authClient.Provider`.
- 🧪 Tests: N/A
- 📁 Files: Modified `frontend/src/components/providers/AuthProviderWrapper.tsx`.
- 🔁 Next prompts: Ask user to verify if error is resolved.
- 🧠 Reflection: Successfully identified and fixed the `better-auth` initialization issue by correctly placing `authClient.Provider` in the component hierarchy.

## Evaluation notes (flywheel)

- Failure modes observed: Initial incorrect setup of `better-auth` provider leading to `undefined` store.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
