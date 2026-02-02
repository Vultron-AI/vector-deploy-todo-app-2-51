---
description: General Code architecture principles and style guidelines
alwaysApply: true
---

# Code Principles & Style Guide

## Scope & Priorities

- **Priority order:** Extensibility & Composability > Readability > Performance
- Prefer **specific, actionable** code; avoid style nitpicks already covered by linters
- Generally refer to Google's Python Style Guide

## Getting Started

**The frontend is pre-scaffolded** with Vite + React + TypeScript + Tailwind CSS. See `.claude/instructions/skills/scaffold-frontend.md` for the project structure.


**For API integration**, create new files like `src/services/myApi.ts` that import from `api.ts`:

```typescript
// ✅ src/services/customersApi.ts (NEW FILE)
import { api } from './api'

export const customersApi = {
  list: async () => (await api.get('/api/customers/')).data,
}
```

### UI Components (REQUIRED - Generated per Project)

**CRITICAL: You MUST build ALL core UI components before creating any feature pages.** This is not optional. Skipping this step will result in an inconsistent, unpolished application.

#### Design Tokens (Pre-generated)

The `frontend/src/styles/tokens.css` file is **pre-generated** from the design style guide. It contains all CSS custom properties for colors, radius, shadows, and motion values. Verify it exists and is imported in `frontend/src/index.css` before building components.

#### Step 1: Generate ALL Core UI Components (REQUIRED)

**You MUST create ALL of the following components** in `frontend/src/components/ui/` before building any feature pages. Do not skip any component - each one is essential for a polished application:

| Component | Required Variants/Features |
|-----------|---------------------------|
| **Button** | **PRE-BUILT** - includes default, destructive, outline, secondary, ghost, link variants + sizes |
| **Input** | Text input with label, placeholder, error state, disabled state |
| **Card** | Content container with optional title, description, footer; hover states if interactive |
| **Badge** | Default, success, warning, error, info variants |
| **Table** | Header, body, hover rows, optional sorting indicators, empty state |
| **Dialog** | **PRE-BUILT** - includes AlertDialog, ConfirmDialog, PromptDialog, CustomDialog + useDialog hook |
| **Select** | **PRE-BUILT** - just customize styles in `src/components/ui/Select.tsx` to match tokens |
| **Toast** | Success, error, warning, info variants; auto-dismiss; action button |
| **EmptyState** | Icon, title, description, optional CTA |
| **Loading** | Spinner and/or skeleton variants |

Use **shadcn/ui** patterns (built on Radix) and reference the tokens from `tokens.css`. All components must follow the design-style-guide.md conventions.

**Note on Button:** The Button component is pre-built in the boilerplate (`src/components/ui/Button.tsx`). It includes all common variants (default, destructive, outline, secondary, ghost, link) and sizes (sm, default, lg, icon). Update its styling to match your design tokens—do NOT recreate it.

```tsx
// ✅ Usage (Button is already built, just import and use)
import { Button } from '@/components/ui'

<Button variant="default">Save</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" disabled>Disabled</Button>
```

**Note on Select:** The Select component is pre-built in the boilerplate (`src/components/ui/Select.tsx`). You only need to update its styling to match your design tokens—do NOT recreate it.

```tsx
// ✅ Usage (Select is already built, just import and use)
import { Select } from '@/components/ui'

<Select
  value={status}
  onValueChange={setStatus}
  options={[{ value: 'a', label: 'Option A' }]}
  placeholder="Choose..."
/>
```

**Note on Dialog:** The Dialog system is pre-built in the boilerplate (`src/components/ui/Dialog.tsx` and `DialogProvider.tsx`). It includes `AlertDialog`, `ConfirmDialog`, `PromptDialog`, and a `useDialog` hook for programmatic usage. The app is pre-wrapped with `DialogProvider`—do NOT recreate these components.

```tsx
// ✅ Usage (Dialog is already built, just import and use)
import { useDialog, ConfirmDialog } from '@/components/ui'

// Programmatic usage via hook
const { alert, confirm, prompt } = useDialog()
const confirmed = await confirm({ title: 'Delete?', variant: 'destructive' })

// Or declarative usage
<ConfirmDialog open={isOpen} onOpenChange={setIsOpen} title="Delete?" onConfirm={handleDelete} />
```

**Do NOT proceed to Step 2 until ALL components above are complete.**

#### Step 2: Build Feature Components
Only after ALL core components exist, build feature-specific components that compose them.

### Comments and Documentation
- Use docstrings when function purpose is not immediately clear
- Comments should add value, not repeat what code already says
- Always include context for complex algorithms or business rules

## Type Annotations (Required)

**All Python code must be fully typed for code maintainability.**

### Rules

1. **All functions must have return type annotations**
2. **All function parameters must be typed**
3. **Use `from __future__ import annotations`** at the top of every Python file
4. **Use `Any` sparingly** - prefer specific types

### Common Django/DRF Patterns

```python
from __future__ import annotations

from typing import Any

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MyModel


# View with typed request and response
class MyView(APIView):
    def get(self, request: Request) -> Response:
        return Response({"status": "ok"})

    def post(self, request: Request) -> Response:
        data: dict[str, Any] = request.data
        return Response(data, status=201)


# Model manager with generic type
class MyModelManager(models.Manager["MyModel"]):
    def create_item(self, name: str, **kwargs: Any) -> MyModel:
        return self.create(name=name, **kwargs)


# Serializer with generic type
class MySerializer(serializers.ModelSerializer[MyModel]):
    class Meta:
        model = MyModel
        fields = ["id", "name"]


# Test function with typed fixture
@pytest.mark.django_db
def test_my_endpoint(api_client: APIClient) -> None:
    response = api_client.get("/api/items/")
    assert response.status_code == 200


# Test helper returning typed tuple
@pytest.fixture
def authenticated_client(api_client: APIClient) -> tuple[APIClient, User]:
    user = create_user()
    return api_client, user
```

### Quick Reference

| Pattern | Type Annotation |
|---------|-----------------|
| View method | `def get(self, request: Request) -> Response:` |
| Model manager | `class Manager(models.Manager["MyModel"]):` |
| Serializer | `class Serializer(serializers.ModelSerializer[MyModel]):` |
| ListAPIView | `class View(generics.ListAPIView[MyModel]):` |
| Test function | `def test_something() -> None:` |
| Fixture | `def my_fixture() -> ReturnType:` |
| **kwargs | `**kwargs: Any` |

## Other Documentation
You may pull in other important sections of the style guide from the following locations
if you are working on that task specifically. Use progressive disclosure as your guiding
principal on when to bring in said documents.

### Common Operation -> Location
Backend -> backend-standards.md
Testing (Backend) -> testing-standards.md
Frontend -> frontend-standards.md
Design System & Styling -> design-style-guide.md
Starting Frontend App -> skills/validate-frontend.md

## Skills

Skills are specialized workflows for common tasks. Find them in `skills/` directory.
Subagents may use skills when its applicable to their task. **Always run tests using `skills/run-tests.md` never run pytest or test commands directly.**

| Skill | When to Use |
|-------|-------------|
| `skills/setup-environment.md` | Install dependencies with uv |
| `skills/run-tests.md` | Run specific commands and fix failing tests |
| `skills/static-check.md` | Run `make static` (or `make static files="file.py"` for specific files), fix type errors |
| `skills/scaffold-frontend.md` | Frontend project structure and UI components (pre-scaffolded) |
| `skills/validate-frontend.md` | Final validation: run dev servers, verify frontend-backend connection |
| `skills/run-e2e-tests.md` | Run Playwright tests and verify screenshots were captured |

## Parallelization
Agree upon contracts between the backend and frontend upfront. Parallelize AS MUCH AS possible including splitting tests into smaller files to maximimize speed.
Use testing as a chance to fix discrepancies.

## Environment & Dependencies

Use uv for Python dependency management:

```bash
# Install dependencies
uv sync

# Run commands
uv run python manage.py migrate
uv run pytest
```

Add all dependencies to `pyproject.toml` with version constraints. See `skills/setup-environment.md` for details.

## Edit Tool Best Practices

When using the Edit tool to modify files:

### Make `old_string` Unique

The `old_string` must match exactly ONE location in the file. If you get "Found N matches" error:

**Include more context** - add surrounding lines to make the match unique:

```
# ❌ Bad - too short, might match multiple places
old_string: "return None"

# ✅ Good - include surrounding context
old_string: """def get_user(self, user_id):
        if not user_id:
            return None"""
```

### Use `replace_all: true` for Bulk Changes

When intentionally replacing ALL occurrences (e.g., renaming a variable):

```
old_string: "old_variable_name"
new_string: "new_variable_name"
replace_all: true
```

### Prefer Write for New Files

Use the Write tool (not Edit) when creating new files from scratch.

## Final Validation Steps

Before considering the app complete, run these validation steps in order:

1. **UI Polish Pass**: Take extra time (you may include an entire Task) to review the overall visual experience:
   - Verify consistent spacing, shadows, and border radius across all pages
   - Check that the layout feels cohesive and matches the design-style-guide.md and design best practices
   - Ensure hover states, transitions, and micro-interactions are smooth
   - Review empty states, loading states, and error states for polish
   - Confirm typography hierarchy is clear and text is readable
   - Look for any jarring visual inconsistencies between components
2. **Static Analysis**: See `skills/static-check.md` - run `make static`, fix any type errors
3. **Frontend Validation**: See `skills/validate-frontend.md` - run backend server, then frontend dev, verify connection
4. **E2E Test Setup**: Prepare the Playwright tests for screenshot capture:
   - Edit `frontend/tests/e2e/app.spec.ts` to match your app's pages:
     - **MainPage test**: Update to navigate to your app's actual main page route and verify key elements
     - **LandingPage test**: Either capture auth page (if app has auth) or duplicate main page
   - Use semantic `data-testid` selectors (e.g., `auth.login.submit`, `projects.list`)
5. **E2E Tests**: See `skills/run-e2e-tests.md` - run Playwright tests and verify screenshots were captured
