# Execution Plan: Team Task Tracker

## Overview
A simple task management app for teams where each task has a clear owner. Team members see only their assigned tasks, creating accountability by making ownership explicit and visible.

## Architecture Decisions
- **Frontend-only MVP**: This app will be built as a frontend-only application with mock/local data since the project has no backend directory. Data will be stored in React state (or localStorage for persistence).
- **No authentication**: Since this is a simple v1, user selection will be done via a dropdown rather than full authentication.
- **Existing scaffold**: Build on the existing Vite + React + TypeScript + Tailwind setup at `/home/user/frontend/`.

---

## Tasks

### Task 1: Create design tokens and utility setup
**Description:** Create the design tokens CSS file and cn() utility function required by the existing UI components.

**Context:** The existing Button and Select components reference `@/lib/utils` for `cn()` and CSS variables from `tokens.css`. These don't exist yet.

**Files to create:**
- `/home/user/frontend/src/lib/utils.ts` - cn() utility function using clsx + tailwind-merge
- `/home/user/frontend/src/styles/tokens.css` - CSS custom properties for colors, radius, shadows

**Files to modify:**
- `/home/user/frontend/src/index.css` - Import tokens.css

**Verification:**
- [ ] `cn()` function exports correctly
- [ ] CSS variables defined for --color-accent, --color-bg, --color-fg, --color-surface, --color-border, --color-muted, --color-error, --radius-md, --shadow-sm, --shadow-md
- [ ] Frontend compiles without errors

**Depends on:** None

---

### Task 2: Create core UI components (Input, Card, Badge)
**Description:** Build the remaining core UI components needed for the task tracker.

**Context:** Button, Select, Dialog, and Spinner are pre-built. Need Input for task creation form, Card for task display, Badge for status indicators.

**Files to create:**
- `/home/user/frontend/src/components/ui/Input.tsx` - Text input with label, error state, disabled state
- `/home/user/frontend/src/components/ui/Card.tsx` - Content container for displaying tasks
- `/home/user/frontend/src/components/ui/Badge.tsx` - Status badge (pending, completed)

**Files to modify:**
- `/home/user/frontend/src/components/ui/index.ts` - Export new components

**Verification:**
- [ ] Input component renders with label and handles onChange
- [ ] Card component renders children with proper styling
- [ ] Badge component renders with different variants (default, success)
- [ ] All components use design tokens from tokens.css

**Depends on:** Task 1

---

### Task 3: Create TypeScript types and mock data
**Description:** Define TypeScript interfaces for Task and TeamMember, plus initial mock data.

**Context:** The app needs typed data structures for tasks and team members. Mock data allows development without a backend.

**Files to create:**
- `/home/user/frontend/src/types/models.ts` - Task and TeamMember interfaces

**Verification:**
- [ ] Task interface includes: id, title, assigneeId, completed
- [ ] TeamMember interface includes: id, name
- [ ] Types export correctly

**Depends on:** None

---

### Task 4: Create tasks API service with local storage
**Description:** Build the API service layer that manages tasks using localStorage for persistence.

**Context:** Since there's no backend, use localStorage to persist tasks. Follow the pattern from api.ts but implement local storage operations.

**Files to create:**
- `/home/user/frontend/src/services/tasksApi.ts` - CRUD operations for tasks using localStorage
- `/home/user/frontend/src/services/teamApi.ts` - Team member data (hardcoded list for v1)

**Verification:**
- [ ] tasksApi.list() returns all tasks
- [ ] tasksApi.listByAssignee(userId) returns filtered tasks
- [ ] tasksApi.create(task) adds a new task
- [ ] tasksApi.toggleComplete(taskId) toggles completion status
- [ ] teamApi.list() returns team members
- [ ] Data persists in localStorage across page refreshes

**Depends on:** Task 3

---

### Task 5: Create TaskList component
**Description:** Build the main TaskList component that displays tasks assigned to the selected user.

**Context:** This is the core UI for team members to see and manage their assigned tasks.

**Files to create:**
- `/home/user/frontend/src/components/TaskList.tsx` - Displays list of tasks with completion toggle

**Verification:**
- [ ] Renders list of task Cards
- [ ] Shows task title and completion status via Badge
- [ ] Checkbox to toggle task completion
- [ ] Shows empty state when no tasks
- [ ] Uses data-testid attributes for testing (tasks.list, tasks.list.item, tasks.list.empty-state)

**Depends on:** Task 2, Task 4

---

### Task 6: Create TaskForm component
**Description:** Build the form for creating new tasks with team member assignment.

**Context:** Managers/team leads use this form to create tasks and assign them to team members.

**Files to create:**
- `/home/user/frontend/src/components/TaskForm.tsx` - Form with title input and assignee Select

**Verification:**
- [ ] Input field for task title
- [ ] Select dropdown for assignee selection (using pre-built Select component)
- [ ] Submit button (using pre-built Button component)
- [ ] Clears form after successful submission
- [ ] Uses data-testid attributes (tasks.form.title, tasks.form.assignee, tasks.form.submit)

**Depends on:** Task 2, Task 4

---

### Task 7: Create UserSelector component
**Description:** Build a component that allows switching between team member views.

**Context:** Since there's no auth, users select their identity from a dropdown to see their assigned tasks.

**Files to create:**
- `/home/user/frontend/src/components/UserSelector.tsx` - Dropdown to select current user

**Verification:**
- [ ] Select dropdown shows all team members
- [ ] Selection changes the "current user" context
- [ ] Uses pre-built Select component
- [ ] Uses data-testid attribute (nav.user-selector)

**Depends on:** Task 4

---

### Task 8: Build main App page layout
**Description:** Integrate all components into the main App.tsx with proper layout.

**Context:** Combine UserSelector, TaskForm, and TaskList into a cohesive single-page app layout.

**Files to modify:**
- `/home/user/frontend/src/App.tsx` - Main app layout with all components

**Verification:**
- [ ] Page header with app title and UserSelector
- [ ] TaskForm section for creating new tasks
- [ ] TaskList section showing current user's tasks
- [ ] Responsive layout using Tailwind
- [ ] State management connecting components (selected user, tasks)

**Depends on:** Task 5, Task 6, Task 7

---

### Task 9: Update E2E tests for the app
**Description:** Customize the Playwright E2E tests to capture screenshots of the task tracker app.

**Context:** The existing e2e tests need to be updated to match the actual app pages and elements.

**Files to modify:**
- `/home/user/frontend/tests/e2e/app.spec.ts` - Update selectors and flows for task tracker

**Verification:**
- [ ] LandingPage test navigates to root and captures screenshot
- [ ] MainPage test verifies task list and form elements
- [ ] Tests use correct data-testid selectors
- [ ] Both screenshots are captured when tests run

**Depends on:** Task 8

---

## Summary

| Task | Description | Depends On |
|------|-------------|------------|
| 1 | Create design tokens and utility setup | None |
| 2 | Create core UI components (Input, Card, Badge) | 1 |
| 3 | Create TypeScript types and mock data | None |
| 4 | Create tasks API service with local storage | 3 |
| 5 | Create TaskList component | 2, 4 |
| 6 | Create TaskForm component | 2, 4 |
| 7 | Create UserSelector component | 4 |
| 8 | Build main App page layout | 5, 6, 7 |
| 9 | Update E2E tests for the app | 8 |

**Total tasks:** 9

**Parallelization opportunities:**
- Tasks 1 and 3 can run in parallel (no dependencies)
- Tasks 5, 6, and 7 can run in parallel after their dependencies are complete
