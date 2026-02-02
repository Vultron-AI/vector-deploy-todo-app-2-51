---
description: Project design system with tokens, colors, typography, and component patterns
globs: **/*.tsx, **/*.ts, **/*.css
---

# Design System & Style Guide

## Design Tokens (tokens.css)

See `frontend/src/styles/tokens.css` (pre-generated).

## Design Philosophy

**Clear. Accountable. Efficient.**

TaskMaster exists to eliminate ambiguity around task ownership. The interface must reflect this core value through visual clarity and purposeful simplicity.

- **Ownership is visible at a glance.** Every task clearly displays its assignee; no hunting for information.
- **Completion feels rewarding.** Marking a task done should provide immediate, satisfying feedback.
- **Reduce cognitive load.** Show only what matters: title, owner, status. No feature bloat.
- **Trust through consistency.** Predictable patterns let users focus on work, not learning the UI.
- **Hierarchy guides action.** The most important action (completing a task) is always the most prominent.
- **Professional but approachable.** Enterprise-grade reliability with a human touch—this is a tool people use daily.

Inspirations: Modern productivity tools with clean task lists (linear, minimal Notion views), enterprise software that doesn't feel heavy.

## Brand Voice

**Direct. Supportive. Action-oriented.**

| Principle | Avoid | Use |
|-----------|-------|-----|
| Be direct | "You might want to consider completing this task soon" | "Due tomorrow" |
| Use active voice | "Tasks have been assigned to you" | "You have 3 tasks" |
| Celebrate completion | "Task status changed to complete" | "Done! Nice work." |
| Stay brief | "Please enter the title of the task you would like to create" | "Task title" |
| Be specific | "Something went wrong" | "Couldn't save task. Check your connection." |
| Respect time | "Welcome back to TaskMaster, your productivity companion!" | "Your tasks" |
| Guide, don't lecture | "You should always assign tasks to ensure accountability" | "Who's responsible?" |

### Key Messages

**Headline:** Every task has an owner.

**Contrast statement:** Unlike scattered to-do lists and unclear email threads, TaskMaster ensures every task has exactly one person accountable for completing it.

**Supporting messages:**
- See only what you're responsible for—no noise, no confusion.
- Assign tasks in seconds. Ownership is immediate and explicit.
- Track completion across your team without micromanaging.
- Simple by design. If a feature doesn't serve accountability, it doesn't exist.

## Color Palette

### Primary Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| --color-bg | #F9FAFB | `bg-gray-50` | Page background, app shell |
| --color-surface | #FFFFFF | `bg-white` | Cards, panels, modals |
| --color-fg | #111827 | `text-gray-900` | Primary text, headings |

### Brand Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| --color-primary | #1E40AF | `bg-blue-800` / `text-blue-800` | Primary buttons, key actions |
| --color-primary-hover | #1E3A8A | `bg-blue-900` | Primary button hover state |
| --color-secondary | #3B82F6 | `bg-blue-500` / `text-blue-500` | Links, secondary emphasis |
| --color-secondary-hover | #2563EB | `bg-blue-600` | Link hover state |

### Accent Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| --color-accent | #059669 | `bg-emerald-600` / `text-emerald-600` | Success states, completion actions |
| --color-accent-hover | #047857 | `bg-emerald-700` | Accent hover state |
| --color-focus-ring | #93C5FD | `ring-blue-300` | Focus indicators for accessibility |

### Secondary Neutrals

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| --color-muted | #6B7280 | `text-gray-500` | Secondary text, timestamps, metadata |
| --color-border | #E5E7EB | `border-gray-200` | Card borders, dividers |
| --color-border-hover | #D1D5DB | `border-gray-300` | Border hover states |

### Status Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| --color-success | #059669 | `text-emerald-600` | Completed tasks, success messages |
| --color-success-bg | #ECFDF5 | `bg-emerald-50` | Success badge backgrounds |
| --color-warning | #D97706 | `text-amber-600` | Due soon indicators |
| --color-warning-bg | #FFFBEB | `bg-amber-50` | Warning badge backgrounds |
| --color-error | #DC2626 | `text-red-600` | Errors, destructive actions |
| --color-error-bg | #FEF2F2 | `bg-red-50` | Error badge backgrounds |
| --color-info | #3B82F6 | `text-blue-500` | Informational messages |
| --color-info-bg | #EFF6FF | `bg-blue-50` | Info badge backgrounds |

## Typography

### Font Stack

| Purpose | Font | Fallback |
|---------|------|----------|
| Primary (all text) | Inter | system-ui, -apple-system, sans-serif |

Inter is used throughout for both headings and body text. Its clarity at small sizes makes it ideal for task lists, while its professional appearance suits enterprise contexts.

### Weight Usage

| Weight | Tailwind Class | Usage |
|--------|----------------|-------|
| 400 (Regular) | `font-normal` | Body text, descriptions |
| 500 (Medium) | `font-medium` | Labels, navigation items, task titles |
| 600 (Semibold) | `font-semibold` | Headings, emphasis, buttons |

**Note:** Avoid `font-bold` (700) except for rare emphasis. The design philosophy favors calm hierarchy over heavy contrast.

### Type Scale

| Role | Tailwind Classes | Usage |
|------|------------------|-------|
| Page Title | `text-2xl font-semibold text-gray-900` | Main page headings ("Your Tasks") |
| Section Title | `text-lg font-semibold text-gray-900` | Section headers, card group labels |
| Card Title | `text-base font-medium text-gray-900` | Task titles, list item primary text |
| Body | `text-sm text-gray-700` | Descriptions, supporting content |
| Caption | `text-xs text-gray-500` | Timestamps, metadata |
| Label | `text-sm font-medium text-gray-700` | Form labels, field names |

## Spacing

TaskMaster uses a comfortable density appropriate for daily-use productivity tools. Spacing should feel breathable without wasting screen real estate.

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| 2 | `p-2`, `gap-2` | Tight spacing: icon-to-text, inline elements |
| 3 | `p-3`, `gap-3` | Compact spacing: list items, small cards |
| 4 | `p-4`, `gap-4` | Standard spacing: card padding, form groups |
| 6 | `p-6`, `gap-6` | Comfortable spacing: section padding, modal content |
| 8 | `p-8`, `gap-8` | Generous spacing: page sections, hero areas |
| 12 | `py-12` | Large spacing: page-level vertical rhythm |

**Canonical patterns:**
- Card internal padding: `p-4`
- Space between cards in a list: `gap-3`
- Space between form fields: `gap-4`
- Page horizontal padding: `px-6`
- Space between page sections: `gap-8`

## Components

### Cards

**What:** Cards are the primary container for tasks. They use `--color-surface` (white) background with a subtle `--color-border` border and `--radius-md` corners. Internal padding follows the `p-4` standard.

**Why:** Tasks are the core object in TaskMaster. Cards create clear visual boundaries that make each task distinct and scannable. The white surface lifts content from the gray page background, establishing hierarchy without heavy shadows.

**Default state:** White background, 1px gray-200 border, rounded-lg corners, p-4 padding. No shadow by default—shadows are reserved for elevated states.

**Interactive/hover state:** On hover, the border transitions to `--color-border-hover` (gray-300). For task cards specifically, a subtle left border accent (`border-l-2 border-l-primary`) can indicate the card is actionable.

**Elevated cards:** Use `--shadow-sm` only for cards that float above others (modals, dropdowns). Standard task cards remain flat to reduce visual noise in long lists.

### Buttons

**Primary button:** Used for the main action on a page (e.g., "Add Task", "Mark Complete"). Background uses `--color-primary`, text is white, corners use `--radius-md`. On hover, background darkens to `--color-primary-hover`. Padding is `px-4 py-2` with `font-medium`.

**Secondary button:** Used for supporting actions (e.g., "Cancel", "View All"). Transparent background with `--color-primary` text and a 1px `--color-primary` border. On hover, background fills with a light blue tint (`bg-blue-50`).

**Ghost button:** Used for tertiary actions or within tight spaces (e.g., task row actions). No background or border, just `--color-muted` text. On hover, background becomes `bg-gray-100`.

**Destructive button:** Used for delete or remove actions. Background uses `--color-error`, text is white. On hover, darkens to `bg-red-700`. Use sparingly and always with confirmation for irreversible actions.

**Why these variants:** The hierarchy (Primary > Secondary > Ghost) guides users toward the intended action. Destructive is visually distinct to prevent accidental clicks.

### Form Inputs

**Text inputs and textareas:** White background, 1px `--color-border` border, `--radius-md` corners. Padding is `px-3 py-2`. Placeholder text uses `--color-muted`.

**Focus state:** Border changes to `--color-secondary` (blue-500) with a `ring-2 ring-offset-2` using `--color-focus-ring`. This high-contrast focus ring ensures accessibility.

**Error state:** Border changes to `--color-error`. An error message appears below the input in `text-sm text-red-600`. The input retains the error border until corrected.

**Labels:** Positioned above inputs with `gap-1.5` spacing. Use `text-sm font-medium text-gray-700`. Required fields append a red asterisk.

**Select dropdowns:** Same styling as text inputs. Chevron icon (Lucide `ChevronDown`) in `--color-muted` positioned right.

**Why:** Consistent, minimal input styling reduces friction. The prominent focus ring ensures keyboard users always know where they are.

### Navigation Items

**Inactive state:** `text-gray-600 font-medium` with no background. Icon (if present) matches text color.

**Active state:** `text-primary font-medium` with `bg-blue-50` background and `rounded-md` corners. A 2px left border in `--color-primary` provides a strong active indicator.

**Hover state (inactive):** Background becomes `bg-gray-100`.

**Why:** The left border accent creates a clear "you are here" signal without overwhelming the nav. Color change reinforces the active state for users who may not notice the border.

### Tables

**Header row:** `bg-gray-50` background, `text-xs font-medium text-gray-500 uppercase tracking-wide`. Bottom border in `--color-border`.

**Body rows:** White background, `text-sm text-gray-900`. Each row has a bottom border in `--color-border`.

**Hover state:** Row background becomes `bg-gray-50`.

**Cell padding:** `px-4 py-3` for comfortable density.

**Why:** Tables in TaskMaster might display team task overviews. The subtle header treatment and row hover help users track across columns without visual clutter.

### Status Badges

**Completed:** `bg-emerald-50 text-emerald-700` with `rounded-full` and `px-2.5 py-0.5 text-xs font-medium`.

**Pending/In Progress:** `bg-blue-50 text-blue-700` with same shape and sizing.

**Overdue/Urgent:** `bg-red-50 text-red-700`.

**Neutral/Default:** `bg-gray-100 text-gray-700`.

**Why:** Badges provide at-a-glance status without reading text. The soft background colors maintain the calm aesthetic while clearly differentiating states.

### Empty States

**Structure:** Centered vertically and horizontally within the container. Stack order: Icon (48px, `text-gray-400`), Title (`text-lg font-medium text-gray-900`), Description (`text-sm text-gray-500`, max-width for readability), CTA button (Primary style).

**Spacing:** `gap-2` between icon and title, `gap-1` between title and description, `gap-4` before CTA.

**Tone:** Encouraging, not apologetic. Example: Icon: `CheckCircle`, Title: "All caught up", Description: "You've completed all your tasks. Nice work!", CTA: "View completed tasks" (secondary button).

**Why:** Empty states are opportunities to reinforce the product value (accountability, completion) rather than just saying "nothing here."

## Layout Patterns

### Page Header

**Structure:** The page header sits at the top of the content area and establishes context. It contains a title (Page Title style), an optional description (Body style, `text-gray-500`), and an optional primary action button aligned to the right.

**Spacing:** The title and description stack with `gap-1`. The header group and action button are separated using `justify-between` in a flex container. Bottom margin of `mb-6` separates the header from page content.

**Alignment:** Title and description are left-aligned. The primary action button is right-aligned and vertically centered with the title.

**Why:** This pattern immediately orients users ("Your Tasks") and surfaces the primary action ("Add Task") without scrolling. Consistent placement builds muscle memory.

### Two-Panel Layout

**Structure:** A fixed-width sidebar (navigation) on the left, with the main content area filling the remaining space. The sidebar uses `--color-surface` background with a right border in `--color-border`.

**Sidebar width:** 240px (w-60) on desktop. Contains logo/app name at top, navigation items, and user menu at bottom.

**Content area:** Uses `--color-bg` background. Content is constrained to a max-width (e.g., `max-w-4xl`) and centered for readability on wide screens.

**Responsive behavior:** On screens below 768px, the sidebar collapses into a hamburger menu. The mobile nav appears as a slide-over panel from the left.

**Why:** Team members will use TaskMaster frequently. A persistent sidebar provides quick navigation between views (My Tasks, Team Overview if permitted) without losing context.

### Hero Section

**Context:** TaskMaster is an internal tool, so traditional marketing heroes aren't needed. However, a first-time user or empty-state hero helps onboarding.

**Onboarding hero structure:** Centered layout with generous vertical padding (`py-12`). Contains: Headline (`text-2xl font-semibold`), Subhead (`text-base text-gray-500`, max-width `max-w-md`), Primary CTA button.

**Example content:** Headline: "Welcome to TaskMaster", Subhead: "See only the tasks assigned to you. Complete them. Stay accountable.", CTA: "View your tasks".

**Visual weight:** No background image or heavy graphics. The calm `--color-bg` background with centered text maintains the professional, focused aesthetic.

**Why:** First impressions matter. The onboarding hero reinforces the core value proposition (clear ownership) before users dive into the task list.

## Icons

TaskMaster uses **Lucide** icons exclusively for consistency with the shadcn/ui component stack.

### Icon Sizes

| Size | Tailwind Class | Usage |
|------|----------------|-------|
| 16px | `w-4 h-4` | Inline with text, buttons, form elements |
| 20px | `w-5 h-5` | Navigation items, list item icons |
| 24px | `w-6 h-6` | Page headers, empty state icons (secondary) |
| 48px | `w-12 h-12` | Empty state primary icons |

### Icon Colors

- **Primary text context:** `text-gray-900` or `text-current` to inherit
- **Muted/secondary context:** `text-gray-400` or `text-gray-500`
- **Interactive (buttons):** Inherit from button text color
- **Status icons:** Match status color (e.g., `text-emerald-600` for success)

### Common Icons

| Purpose | Icon Name |
|---------|-----------|
| Add/Create | `Plus` |
| Complete/Check | `Check`, `CheckCircle` |
| Task/Todo | `Circle`, `CheckSquare` |
| User/Assignee | `User`, `UserCircle` |
| Menu | `Menu` |
| Close | `X` |
| More options | `MoreHorizontal`, `MoreVertical` |
| Delete | `Trash2` |
| Edit | `Pencil` |
| Search | `Search` |

## Shadows

Shadows are used sparingly to maintain the calm, flat aesthetic.

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| --shadow-sm | `shadow-sm` | Dropdowns, popovers, tooltips |
| --shadow-md | `shadow-md` | Modals, dialogs |

**Guidance:** Task cards and standard UI elements should not have shadows. Reserve shadows for elements that truly float above the page (modals, dropdown menus). This keeps the interface feeling grounded and reduces visual noise.

## Transitions

All interactive elements should have smooth transitions for a polished feel.

| Transition | Tailwind Class | Usage |
|------------|----------------|-------|
| Color changes | `transition-colors` | Buttons, links, borders |
| All properties | `transition-all` | Cards with multiple changing properties |
| Duration | `duration-150` | Fast interactions (hovers) |
| Duration | `duration-200` | Standard interactions |

**Standard pattern:** `transition-colors duration-150` for most hover states. Use `duration-200` for more complex transitions involving multiple properties.

**Guidance:** Avoid transitions longer than 200ms—they feel sluggish in a productivity tool. Never animate layout shifts that could disrupt task scanning.

## Borders & Radius

| Element | Radius Class | Border Treatment |
|---------|--------------|------------------|
| Buttons | `rounded-md` | None (primary), 1px (secondary) |
| Cards | `rounded-lg` | 1px `border-gray-200` |
| Inputs | `rounded-md` | 1px `border-gray-200`, 2px on focus |
| Badges | `rounded-full` | None |
| Modals | `rounded-lg` | None (shadow provides edge) |
| Avatars | `rounded-full` | None or 1px `border-gray-200` |
| Navigation items | `rounded-md` | None (background provides shape) |

**Guidance:** Consistent use of `rounded-md` (buttons, inputs) and `rounded-lg` (cards, modals) creates visual harmony. `rounded-full` is reserved for badges and avatars to differentiate them as distinct object types.

## Checklist for New Components

Before shipping any new component, verify:

- [ ] **Background:** Uses `--color-surface` or `--color-bg` appropriately (not arbitrary colors)
- [ ] **Text colors:** Primary text uses `--color-fg`, secondary uses `--color-muted`
- [ ] **Borders:** Uses `--color-border` with appropriate radius from the scale
- [ ] **Accent usage:** `--color-primary` for actions, `--color-accent` for success/completion only
- [ ] **Spacing:** Padding and gaps use canonical tokens (p-3, p-4, gap-2, gap-4, etc.)
- [ ] **Hover states:** All interactive elements have visible hover feedback
- [ ] **Focus states:** Keyboard focus is visible using `--color-focus-ring`
- [ ] **Typography:** Text styles match the type scale (no arbitrary sizes)
- [ ] **Icons:** Uses Lucide icons at standard sizes with appropriate colors
- [ ] **Voice:** Labels and messages follow brand voice (direct, brief, action-oriented)
- [ ] **Loading states:** Component handles loading gracefully (skeleton or spinner)
- [ ] **Empty states:** Component handles empty data with helpful messaging
- [ ] **Error states:** Component displays errors clearly with recovery guidance
- [ ] **Responsive:** Component works on mobile viewports (320px minimum)

## Anti-Patterns (Avoid)

### Visual Anti-Patterns

- **Arbitrary colors:** Never use colors outside the defined palette. No `bg-purple-500` or `text-teal-400`.
- **Heavy shadows on flat elements:** Task cards should not have `shadow-md`. Reserve shadows for floating elements.
- **Inconsistent radius:** Don't mix `rounded-sm` and `rounded-xl` arbitrarily. Stick to the scale.
- **Dense layouts:** Avoid cramming elements together. TaskMaster uses comfortable density—when in doubt, add space.
- **Decorative elements:** No gradients, patterns, or illustrations that don't serve function. Every pixel should aid task completion.
- **Multiple accent colors:** Don't introduce new accent colors. Use `--color-primary` for actions, `--color-accent` for completion.
- **Heavy font weights:** Avoid `font-bold` (700) for headings. `font-semibold` (600) is the maximum.
- **Centered body text:** Task lists and forms should be left-aligned. Center alignment is only for empty states and heroes.
- **Icon overload:** Don't add icons to every element. Use icons to aid recognition, not as decoration.
- **Inconsistent icon sizes:** Don't use arbitrary icon sizes. Stick to 16px, 20px, 24px, or 48px.

### Voice Anti-Patterns

- **Passive voice:** Avoid "Tasks have been assigned" → Use "You have 3 tasks"
- **Unnecessary words:** Avoid "Please click the button to..." → Use "Click to..."
- **Robotic confirmations:** Avoid "Task status updated successfully" → Use "Done!" or "Task completed"
- **Vague errors:** Avoid "An error occurred" → Use "Couldn't save. Check your connection."
- **Marketing speak:** Avoid "Supercharge your productivity!" → Use "Your tasks"
- **Apologetic tone:** Avoid "Sorry, we couldn't find any tasks" → Use "No tasks yet"
- **Exclamation overuse:** Limit to genuine celebrations (task completion). Not every message needs excitement.
- **Jargon:** Avoid technical terms. "Assignee" is fine; "task owner entity" is not.
- **Long instructions:** If an action needs a paragraph to explain, the UI is too complex.
- **Inconsistent terminology:** Pick one term and stick with it. "Task" not sometimes "task" and sometimes "to-do" or "item."