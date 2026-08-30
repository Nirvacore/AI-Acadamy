# Nirva Academy Adaptive Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional, local-first learner profile and short calibration flow.

**Architecture:** Keep recommendation logic as a pure CommonJS module with TypeScript declarations, then build one client component that persists a versioned profile. Expose it through a static `/profile` route and link it from the Learning Center after browser review completes.

**Tech Stack:** Next.js 15, React 19, localStorage, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-30-adaptive-onboarding.md`

## Global Constraints

- Never infer age or ability.
- Never send profile or trial data to AI or a server.
- Onboarding stays optional.
- Do not add dependencies, auth, sync, deployment, DNS, or production changes.

---

### Task 1: Recommendation core

**Files:** `lib/learner-profile.js`, `lib/learner-profile.d.ts`, `tests/learner-profile.test.js`, `package.json`

- [x] Write failing normalization and adjustment tests.
- [x] Implement minimal one-step support adjustment.
- [x] Run the focused and full suites.

### Task 2: Optional profile route

**Files:** `components/LearnerProfileSetup.tsx`, `app/profile/page.tsx`, `tests/accept-static.test.js`

- [ ] Add a failing static-route contract.
- [ ] Build the accessible selection and calibration flow.
- [ ] Save only after the learner confirms selected or recommended settings.
- [ ] Build and verify the static route.

### Task 3: Learning Center entry point

**Files:** `components/LearningCenterHome.tsx`, `app/globals.css`

- [ ] Reconcile any Cursor visual-review commit first.
- [ ] Add an optional profile CTA without displacing the primary continue CTA.
- [ ] Add responsive styles and run the full verification suite.
