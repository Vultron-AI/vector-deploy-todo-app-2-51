---
name: scaffold-frontend
description: Frontend setup - the project is pre-scaffolded, just install and configure
---

# Frontend Setup

The frontend is **already scaffolded** with Vite + React + TypeScript + Tailwind CSS.
All dependencies are defined in `frontend/package.json`.

## Quick Start

```bash
cd frontend
pnpm install
pnpm dev
```

## What's Pre-Configured

| File | Configuration |
|------|---------------|
| `package.json` | All dependencies (React, Radix UI, Tailwind, etc.) |
| `vite.config.ts` | Path aliases (`@/`) and backend proxy (`/api`) |
| `tsconfig.json` | TypeScript with path aliases |
| `tailwind.config.js` | Content paths for Tailwind |
| `postcss.config.js` | PostCSS with Tailwind and Autoprefixer |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # Pre-built UI components (Button, Input, Card, etc.)
│   │   ├── auth/        # Authentication components
│   │   └── Layout/      # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── store/           # Redux store
│   ├── types/           # TypeScript types
│   ├── lib/
│   │   └── utils.ts     # cn() utility for Tailwind class merging
│   └── styles/
│       └── tokens.css   # Design tokens (colors, radii, motion)
├── index.html
└── package.json
```

## UI Components

Pre-built components are available in `src/components/ui/`:

| Component | Description |
|-----------|-------------|
| `Button` | Primary interactive button with variants |
| `Input` | Form input with label and error states |
| `Card` | Content container with variants |
| `Badge` | Status indicator |
| `PageHeader` | Page title with actions |
| `EmptyState` | Empty data placeholder |
| `StatCard` | Metric display with trend |
| `Toast` | Notification toasts |
| `Dialog` | Modal dialog (Radix) |
| `Select` | Dropdown select (Radix) |
| `DropdownMenu` | Action menu (Radix) |
| `Popover` | Floating content (Radix) |
| `Table` | Data table |

Import from `@/components/ui`:

```tsx
import { Button, Card, Badge, Input } from '@/components/ui';
```

## Theme Customization

To customize the visual theme, modify **only** `src/styles/tokens.css`:

```css
:root {
  /* Change primary color to blue */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  
  /* Dark mode */
  --color-bg: #0a0a0a;
  --color-fg: #fafafa;
  
  /* Sharp corners */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
}
```

**Never modify component JSX or props for theming** - only change token values.

## Adding New Pages

1. Create page component in `src/pages/`. Below is a simple example.

```tsx
// src/pages/CustomersPage.tsx
import { PageHeader, Card, Button } from '@/components/ui';

export function CustomersPage() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Customers" 
        actions={<Button>Add Customer</Button>}
      />
      <Card>
        {/* Content */}
      </Card>
    </div>
  );
}
```

2. Add route in `App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomersPage } from './pages/CustomersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## API Integration

**NEVER modify `src/services/api.ts`** - it's a protected boilerplate file.

Instead, create new API service files that import from `api.ts`:

```tsx
// src/services/customersApi.ts - CREATE NEW FILE
import { api } from './api'

export const customersApi = {
  list: async () => {
    const response = await api.get('/api/customers/')
    return response.data
  },
  create: async (data: CustomerData) => {
    const response = await api.post('/api/customers/', data)
    return response.data
  },
  get: async (id: string) => {
    const response = await api.get(`/api/customers/${id}/`)
    return response.data
  },
  update: async (id: string, data: CustomerData) => {
    const response = await api.put(`/api/customers/${id}/`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/customers/${id}/`)
    return response.data
  },
}
```

## Verification

After setup, verify the frontend works:

```bash
cd frontend
pnpm dev
```

Should see:
```
VITE vX.X.X ready in XXX ms
➜ Local: http://localhost:5173/
```

## Next Steps

After frontend setup, run `skills/validate-frontend.md` to verify frontend-backend connection.
