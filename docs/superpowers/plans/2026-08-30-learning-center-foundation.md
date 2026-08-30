# Nirva Academy Learning Center Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a usable Learning Center home and reliable desktop navigation without replacing the existing Thai curriculum.

**Architecture:** Add one focused client component above the existing dashboard and feed it the current server-built lesson catalog. Reuse local-first progress helpers and internal tracked links, while tightening the shell's information architecture and protecting the behavior with static-export tests.

**Tech Stack:** Next.js 15 static export, React 19, TypeScript, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-30-learning-center-foundation.md`

## Global Constraints

- Preserve all existing lesson, lab, script, progress, and track routes.
- Nirva Media is a case study; Nirva Academy and Nirva AI remain separate products.
- Keep progress local-first and do not add model calls, auth, or sync.
- Do not add dependencies.
- Do not merge, deploy, edit DNS, secrets, Pages, or production integrations.

---

### Task 1: Lock the Learning Center contract with tests

**Files:**
- Modify: `tests/accept-static.test.js`
- Modify: `tests/product-boundary.test.js`

**Interfaces:**
- Consumes: static export in `out/` and source under `app/`, `components/`, `app/globals.css`
- Produces: regression contract for hub labels, internal CTAs, product boundaries, and responsive rail behavior

- [ ] **Step 1: Write failing assertions**

Add assertions that `/` includes the five Learning Center labels and internal hub routes, and that the source/CSS preserves the Academy/Media/AI boundary and desktop/mobile rail rules.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm run build && node --test tests/accept-static.test.js tests/product-boundary.test.js`

Expected: FAIL because the current home does not contain the Learning Center labels.

- [ ] **Step 3: Commit only after the implementation makes these assertions pass**

Commit message: `test: lock learning center foundation`

### Task 2: Build the Learning Center home

**Files:**
- Create: `components/LearningCenterHome.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `PortalLesson[]`, `readDone()`, `PROGRESS_EVENT`, `TrackedLink`
- Produces: `LearningCenterHome({ lessons }: { lessons: PortalLesson[] })`

- [ ] **Step 1: Implement the local-first continue state**

Read completed lesson IDs on mount and on `PROGRESS_EVENT`. Choose the first incomplete lesson, while offering `/start` for a new learner and `/progress` when the core path is complete.

- [ ] **Step 2: Render four semantic hub links**

Render `เส้นทางเรียน`, `ฝึกปฏิบัติ`, `สำรวจความรู้`, and `ความก้าวหน้า`, each with a short Thai explanation and internal route.

- [ ] **Step 3: Render the product boundary note**

Explain that Nirva Academy owns learning, Nirva Media is a case study, and Nirva AI is a separate operating system. Link the case study internally to `/media`.

- [ ] **Step 4: Place the component above the existing detailed dashboard**

Replace `HeroStart` in `app/page.tsx` with `LearningCenterHome`, leaving `Dashboard`, `WeekPlan`, and module lists in the existing disclosure.

### Task 3: Clarify the shell navigation and responsive presentation

**Files:**
- Modify: `components/Shell.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing routes and `TrackedLink`
- Produces: grouped navigation and responsive `.learning-center-*` styles

- [ ] **Step 1: Regroup the navigation**

Keep all routes but label them by learner intent. Put `/media` only under `กรณีศึกษา`, not under the first-start group.

- [ ] **Step 2: Add focused responsive styles**

Use a responsive grid that collapses to one column on narrow screens. Preserve the existing 980px rail breakpoint and do not add animations that ignore reduced-motion preferences.

- [ ] **Step 3: Run type and static checks**

Run: `npm run build`

Expected: 65 or more pages generated without TypeScript errors.

### Task 4: Verify the full slice

**Files:**
- Review: all files changed in Tasks 1–3

**Interfaces:**
- Consumes: complete working tree
- Produces: evidence-backed handoff for draft PR #4

- [ ] **Step 1: Run the full suite**

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Inspect the diff for scope and forbidden changes**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors, no generated `out/` or `.next/`, and no DNS, secret, deploy, or production files.

- [ ] **Step 3: Fetch the remote branch before push**

Run: `git fetch origin cursor/nirva-media-learning-track`

Expected: compare remote head and reconcile any Cursor commit before pushing.

- [ ] **Step 4: Update draft PR only after clean verification**

Push the same branch and leave PR #4 in draft. Do not merge or deploy.
