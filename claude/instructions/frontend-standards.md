---
description: Frontend architecture and coding standards for React/TypeScript development
globs: **/*.tsx, **/*.ts, **/*.css
---

# Frontend Standards
## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS with `cn()` utility
- **UI Primitives**: Radix UI components
- **State**: Redux Toolkit (global) + React Query (server state)
- **Icons**: lucide-react
- **Animation**: framer-motion (complex), CSS animations (simple)

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Dialog, Input)
│   ├── builder/         # Feature-specific components
│   ├── Layout/          # Layout components (Sidebar, TopNav)
│   └── auth/            # Auth-related components
├── hooks/               # Custom React hooks (useApps, useAuth)
├── pages/               # Route page components
├── services/            # API services and external integrations
├── store/               # Redux store and slices
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions
└── utils/               # Helper functions
```

## Component Patterns

### Functional Components with TypeScript

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'default', size = 'default', children, onClick }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} onClick={onClick}>
      {children}
    </button>
  )
}
```

### Use forwardRef for UI Primitives

```typescript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn('h-10 w-full rounded-md border px-3', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
```

## Styling

### Use cn() for Class Merging

```typescript
import { cn } from '@/lib/utils'

// cn() combines clsx and tailwind-merge
<div className={cn(
  'base-classes here',
  isActive && 'active-classes',
  className
)} />
```

### class-variance-authority for Variants

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white hover:bg-gray-800',
        outline: 'border border-gray-200 hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-9 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

### Tailwind Best Practices

- Use semantic color names from theme (primary, muted, success, error)
- Prefer utility classes over custom CSS
- Group related utilities logically (positioning, sizing, appearance)
- **No focus rings**: Do not use `focus:ring-*` or `focus-visible:ring-*` utilities. Use `focus:outline-none` and reuse hover styles for focus states (e.g., `hover:bg-surface focus:bg-surface`).

## Design Token System (CRITICAL - MANDATORY)

**⚠️ ALL visual values MUST use CSS custom properties (tokens).** This is not optional. Hardcoded colors, radii, or shadows are not allowed.

### Tokens Are Pre-generated

The `src/styles/tokens.css` file is **pre-generated** from the design style guide and already contains all design values (colors, radius, shadows, motion). Before writing any component:
1. Verify `src/styles/tokens.css` exists in the project
2. Review the token values to understand the design system
3. Reference these tokens in all components (never use hardcoded colors)

### Token Usage in Components (REQUIRED)

```typescript
// ✅ REQUIRED: Reference tokens via CSS variables
const buttonVariants = cva([
  "bg-[var(--color-accent)] text-white",
  "hover:bg-[var(--color-accent-hover)]",
  "rounded-[var(--radius-md)]",
  "shadow-[var(--shadow-sm)]",
]);

// ✅ REQUIRED: Use tokens for all colors
<div className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-fg)]">

// ❌ DISALLOWED: Hardcoded Tailwind colors
const buttonVariants = cva([
  "bg-blue-600 text-white",  // ❌ Not themeable
  "rounded-md",              // ❌ Not themeable
]);

// ❌ DISALLOWED: Hardcoded colors in components
<div className="bg-gray-100 border-gray-200 text-gray-900">  // ❌ Must use tokens
```

### When Hardcoded Values Are Allowed

The ONLY places where hardcoded Tailwind values are acceptable:
- Layout utilities: `flex`, `grid`, `gap-*`, `w-*`, `h-*`, `p-*`, `m-*`
- Positioning: `absolute`, `relative`, `fixed`, `inset-*`
- Typography sizing: `text-sm`, `text-lg`, `font-medium`

Colors, borders, shadows, and radii MUST always use tokens.

### Theme Swap Rule

Changing the theme MUST NOT require:
- JSX changes
- Prop changes
- Component rewrites

Only `tokens.css` may change.

## Styling Location Rules (CRITICAL)

### No Inline Styling in Feature Code

Application/feature code MUST NOT contain:
- Tailwind color utilities (`bg-blue-600`, `text-white`)
- Typography utilities with colors
- Border/shadow/radius with hardcoded values
- Brand or visual identity decisions

```typescript
// DISALLOWED in feature code
<div className="bg-blue-600 text-white rounded-lg">

// ALLOWED in feature code
<Card variant="primary" />
<Button variant="destructive">Delete</Button>
```

### Allowed Utilities in Feature Code

Feature code MAY use layout-only utilities:
- `flex`, `grid`
- `gap-*`
- `items-*`, `justify-*`
- `w-*`, `max-w-*`

### Styling Ownership

Styling MUST live only in:
- `src/components/ui/*`
- `src/lib/variants/*`
- `src/styles/*`

## Semantic Props Contract

Components MUST expose props that describe intent, not appearance.

```typescript
// ALLOWED
variant="primary"
tone="danger"
size="sm"

// DISALLOWED
color="red"
bg="blue"
padding="12px"
```

Rule: If a prop would change during a redesign, it is not semantic.

## State Management

### React Query for Server State

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useApps(orgId: string | null) {
  return useQuery({
    queryKey: ['apps', orgId],
    queryFn: () => appsApi.list(orgId!),
    enabled: !!orgId,
  })
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orgId, data }) => appsApi.create(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['apps', variables.orgId] })
    },
  })
}
```

### Redux for Global UI State

```typescript
import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  selectedOrgId: string | null
  sidebarOpen: boolean
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedOrg: (state, action) => {
      state.selectedOrgId = action.payload
    },
  },
})
```

## API Services

### Protected Files (CRITICAL)

**NEVER modify these files** - they are managed by the system with required settings:

- **`vite.config.ts`** - Contains required server settings for the preview environment (allowedHosts, proxy). Modifying this file will break the preview.
- **`src/services/api.ts`** - Provides the base axios client configuration. Modifying it can cause sync issues between preview and sandbox.

Instead, **create new API service files** that import from `api.ts`:

```typescript
// ✅ CORRECT - create a new file like src/services/customersApi.ts
import { api } from './api'

export const customersApi = {
  list: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/api/customers/')
    return response.data
  },
  create: async (data: CustomerData): Promise<Customer> => {
    const response = await api.post<Customer>('/api/customers/', data)
    return response.data
  },
}

// ❌ WRONG - editing api.ts directly
// Don't add your API functions to api.ts
```

### API Base URL (CRITICAL)

**NEVER hardcode `http://localhost:8000`** - it won't work in deployed environments.

**NEVER define your own `API_BASE_URL`** - import it from `api.ts` if you need it:

```typescript
// ✅ CORRECT - use the shared api instance (preferred)
import { api } from './api'
const response = await api.get('/api/items/')

// ✅ CORRECT - import base URL if you really need it
import { API_BASE_URL } from './api'

// ❌ WRONG - hardcoded localhost won't work in E2B/production
const response = await axios.get('http://localhost:8000/api/items/')

// ❌ WRONG - don't redefine the base URL
const API_BASE_URL = 'http://localhost:8000/api/tasks'
```

### Centralized API Pattern

Create separate API service files for each domain:

```typescript
// src/services/customersApi.ts - NEW FILE (don't edit api.ts!)
import { api } from './api'

export const customersApi = {
  list: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/api/customers/')
    return response.data
  },

  create: async (data: CustomerData): Promise<Customer> => {
    const response = await api.post<Customer>('/api/customers/', data)
    return response.data
  },
}
```

```typescript
// src/services/ordersApi.ts - another NEW FILE
import { api } from './api'

export const ordersApi = {
  list: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/api/orders/')
    return response.data
  },
}
```

### Use API Namespaces

```typescript
// Good: Import specific APIs from their own files
import { customersApi } from '@/services/customersApi'
import { ordersApi } from '@/services/ordersApi'

const customers = await customersApi.list()
const orders = await ordersApi.list()
```

### API Response Handling

Always verify the actual response shape from backend endpoints before assuming the data structure. The backend uses Django REST Framework's `PageNumberPagination` by default, so list endpoints return paginated objects rather than plain arrays.

**DRF Paginated Response Shape:**
```typescript
interface PaginatedResponse<T> {
  count: number        // Total number of items
  next: string | null  // URL to next page, or null
  previous: string | null  // URL to previous page, or null
  results: T[]         // Items for current page
}
```

**Handle this in the API service layer**, not in consumers:

```typescript
// Define the pagination type
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Option 1: Extract results in service (when pagination metadata not needed)
list: async (orgId: string): Promise<Item[]> => {
  const response = await api.get<PaginatedResponse<Item>>(`/orgs/${orgId}/items/`)
  return response.data.results
}

// Option 2: Return full pagination response (when consumers need metadata)
listPaginated: async (orgId: string, page?: number): Promise<PaginatedResponse<Item>> => {
  const response = await api.get<PaginatedResponse<Item>>(
    `/orgs/${orgId}/items/`,
    { params: { page } }
  )
  return response.data
}
```

**Key principle:** Type the API contract correctly based on what the backend actually returns. Normalize in the service layer so consumers get a consistent shape.

## Types

### Define Types in types/ Folder

```typescript
// types/models.ts
export interface InternalApp {
  id: string
  name: string
  organization: string
  status: 'draft' | 'published'
  created_at: string
}

export type OrgRole = 'admin' | 'editor' | 'viewer'
```

### Use Type Imports

```typescript
import type { InternalApp, AppVersion } from '@/types/models'
```

## Custom Hooks

### Naming Convention

- Prefix with `use`
- Be specific: `useApps`, `useCreateApp`, `useAppVersions`

### Pattern

```typescript
export function useApp(appId: string | null) {
  return useQuery({
    queryKey: ['app', appId],
    queryFn: async () => {
      if (!appId) return null
      return appsApi.get(appId)
    },
    enabled: !!appId,
  })
}
```

## Error Handling

### Centralized Error Extraction

```typescript
import { getErrorMessage } from '@/services/api'

try {
  await someApiCall()
} catch (error) {
  const message = getErrorMessage(error)
  toast.error(message)
}
```

## File Naming

- Components: PascalCase (`Button.tsx`, `AppBuilderPage.tsx`)
- Hooks: camelCase with use prefix (`useApps.ts`, `useAuth.ts`)
- Services: camelCase (`apiService.ts`, `authService.ts`)
- Types: camelCase (`models.ts`, `api.ts`)

## Exports and Imports

### Export Conventions (CRITICAL)

Page components in `pages/` MUST use `export default function` since they are imported as default imports in the router. When creating or editing any file, ensure the export style matches how the file is imported elsewhere—default imports (`import X from`) require `export default`, while named imports (`import { X } from`) require named exports.

### Use Path Aliases

```typescript
// Good
import { Button } from '@/components/ui/button'
import { useApps } from '@/hooks/useApps'
import type { InternalApp } from '@/types/models'

// Avoid relative paths for deep imports
import { Button } from '../../../components/ui/button'
```

## Animation

### framer-motion for Complex Animations

```typescript
import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Tailwind for Simple Animations

```typescript
<div className="transition-colors hover:bg-gray-100" />
<div className="animate-fade-in" />
```

## Radix UI Components

### Wrap Radix Primitives

```typescript
import * as DialogPrimitive from '@radix-ui/react-dialog'

const DialogContent = React.forwardRef<...>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn('fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
```

### Button Component (PRE-BUILT)

**The Button component is pre-built in the boilerplate at `src/components/ui/Button.tsx`.** It uses class-variance-authority for variants and is fully styleable.

**DO NOT recreate or replace the Button component.** Only update its styling to match your design tokens and design-style-guide.md.

#### Variants

- `default` - Primary action button (accent color)
- `destructive` - Dangerous actions (error color)
- `outline` - Secondary action with border
- `secondary` - Less prominent action
- `ghost` - Minimal styling, text only
- `link` - Styled as a link

#### Sizes

- `sm` - Small button
- `default` - Standard button
- `lg` - Large button
- `icon` - Square button for icons

#### Usage

```typescript
import { Button } from '@/components/ui'

<Button variant="default">Save</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" disabled>Cancel</Button>
```

#### Customizing Button Styles

Open `src/components/ui/Button.tsx` and update the `className` values marked with `// STYLE:` comments to match your design tokens from `tokens.css`.

### Select Component (PRE-BUILT)

**The Select component is pre-built in the boilerplate at `src/components/ui/Select.tsx`.** It uses Radix UI primitives and is fully styleable. You MUST replace the styles while you're building all other components.

**DO NOT recreate or replace the Select component.** Only update its styling to match your design tokens and design-style-guide.md.

#### Usage

```typescript
import { Select } from '@/components/ui'

<Select
  value={formData.status}
  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  placeholder="Select status"
/>
```

#### Customizing Select Styles

Open `src/components/ui/Select.tsx` and update the `className` values marked with `// STYLE:` comments to match your design tokens from `tokens.css`.

Key styling points:
- Trigger background, border, text colors
- Focus ring color
- Hover border color
- Dropdown content background and border
- Item hover/focus background

**⚠️ CRITICAL: Never rewrite Select to use native `<select>` or `<option>` elements.** The pre-built component uses Radix primitives which are fully accessible and styleable.

### Dialog Component (PRE-BUILT)

**The Dialog component system is pre-built in the boilerplate at `src/components/ui/Dialog.tsx` and `src/components/ui/DialogProvider.tsx`.** It uses Radix UI primitives and provides both declarative components and a programmatic API via the `useDialog` hook.

**DO NOT recreate or replace the Dialog components.** Only update styling to match your design tokens and design-style-guide.md.

#### Available Components

**Base components** (for building custom dialogs):
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`, `DialogDescription`

**Pre-built dialogs** (ready to use):
- `AlertDialog` - Simple alert with OK button (replaces `window.alert`)
- `ConfirmDialog` - Confirm/Cancel dialog (replaces `window.confirm`)
- `PromptDialog` - Input dialog (replaces `window.prompt`)
- `CustomDialog` - Custom content with standard header/body layout

**Programmatic API**:
- `DialogProvider` - Wrap your app to enable `useDialog`
- `useDialog` hook - Returns `{ alert, confirm, prompt }` functions

#### Dialog Variants

Dialogs support semantic variants: `'default' | 'destructive' | 'warning' | 'success' | 'info'`

#### Usage: Declarative

```typescript
import { ConfirmDialog } from '@/components/ui'

function DeleteButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item?"
        description="This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}
```

#### Usage: Programmatic (useDialog hook)

```typescript
import { useDialog } from '@/components/ui'

function MyComponent() {
  const { alert, confirm, prompt } = useDialog()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete item?',
      description: 'This action cannot be undone.',
      variant: 'destructive',
    })
    if (confirmed) {
      // perform delete
    }
  }

  const handleRename = async () => {
    const newName = await prompt({
      title: 'Rename file',
      placeholder: 'Enter new name',
      defaultValue: currentName,
    })
    if (newName) {
      // perform rename
    }
  }

  const showSuccess = async () => {
    await alert({
      title: 'Success!',
      description: 'Your changes have been saved.',
      variant: 'success',
    })
  }
}
```

#### Customizing Dialog Styles

Open `src/components/ui/Dialog.tsx` and update the `className` values to match your design tokens from `tokens.css`.

Key styling points:
- Overlay background and blur
- Content background, border, shadow, border-radius
- Header/body/footer padding
- Title and description typography
- Close button colors and hover states
- Variant icon colors and backgrounds

#### DialogProvider Setup

The boilerplate `App.tsx` is pre-wrapped with `DialogProvider`, so the `useDialog` hook works out of the box. If you restructure the app, ensure `DialogProvider` remains at the root level.

## ESLint Rules (Enforced)

- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `@typescript-eslint/no-unused-vars`: warn (underscore prefix ignored)
- `@typescript-eslint/no-explicit-any`: off (flexibility allowed)


## Design System & Component Styling

For component styling and design tokens, refer to the project's design style guide:

- **Design Style Guide**: `.claude/instructions/design-style-guide.md`

The design style guide contains:
- Color palette with Tailwind tokens
- Typography scale and font weights
- Spacing conventions
- Component patterns (buttons, cards, inputs, tables, etc.)
- Layout patterns
- Anti-patterns to avoid

When creating new components, use **shadcn/ui** (built on Radix) and follow the conventions defined in the design style guide to ensure visual consistency.

## Complex Page Layouts

When building any of the following, you MUST read and follow `complex-page-standards.md`:

- Pages with 3+ distinct UI components
- Layouts with complex grid/flex arrangements
- Pages with multiple interactive states (loading, empty, error, success)
- Forms with validation and multi-step flows
- Pages where user flows span multiple interactions

The complex page standards include required pre-coding planning steps, layout validation checklists, and micro-interaction considerations.

## Test IDs (data-testid)

Use stable, semantic, dot-separated names that reflect user intent and feature hierarchy:

| Pattern | Example |
|---------|---------|
| feature.element.action | `auth.login.submit` |
| feature.form.field | `projects.form.name` |
| feature.list.item | `tasks.list.item` |
| nav.section.link | `nav.sidebar.home` |

### Naming Rules

- **Use dot-separated hierarchy**: `feature.component.element`
- **Reflect user intent**: Names should describe what the user is doing, not how it looks
- **Never use visual styling**: No `blue-button`, `large-header`, `rounded-card`
- **Never use dynamic values**: No `item-${id}`, `row-${index}`
- **Keep hierarchy shallow**: 2-3 segments maximum

### Common Patterns

```typescript
// Auth forms
data-testid="auth.login.email"
data-testid="auth.login.password"
data-testid="auth.login.submit"
data-testid="auth.register.submit"

// Navigation
data-testid="nav.sidebar.home"
data-testid="nav.sidebar.settings"
data-testid="nav.header.user-menu"

// Lists and tables
data-testid="projects.list.create-button"
data-testid="projects.list.empty-state"
data-testid="tasks.table.header"

// Forms
data-testid="projects.form.name"
data-testid="projects.form.description"
data-testid="projects.form.submit"
data-testid="projects.form.cancel"

// Modals/Dialogs
data-testid="dialog.confirm.accept"
data-testid="dialog.confirm.cancel"
```

### Why This Matters

These IDs are used by Playwright e2e tests (see `skills/run-e2e-tests.md`) to:
- Navigate through the app
- Verify elements are present
- Capture screenshots for visual validation

Stable, semantic IDs ensure tests remain deterministic and resilient to UI changes.
