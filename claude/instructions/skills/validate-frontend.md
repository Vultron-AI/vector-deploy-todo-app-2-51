---
name: validate-frontend
description: Run dev servers and verify frontend connects to backend
---

# Validate Frontend

Run this skill as a final step to verify the frontend dev server runs and connects to the backend.

## Prerequisites

The frontend is pre-scaffolded. See `skills/scaffold-frontend.md` for the project structure.

Ensure both environments are set up:

```bash
# Backend: install dependencies
uv sync

# Frontend: install npm dependencies
cd /home/user/frontend && npm install
```

## Process

### 1. Start the Backend Server

```bash
# Run migrations first
uv run python manage.py migrate

# Start the backend server
uv run python manage.py runserver
```

Verify no startup errors. The server should show:
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Run TypeScript Compilation Check

Run a standalone TypeScript check to verify types are correct:

```bash
cd /home/user/frontend && npx tsc --noEmit
```

This type-checks the entire project without emitting files. Verify it completes with no errors (no output means success).

If there are type errors, fix them before proceeding.

### 3. Build the Frontend

Run the production build to catch TypeScript and build errors:

```bash
cd /home/user/frontend && npm run build
```

This runs `tsc -b && vite build`. Verify it completes without errors:
```
vite v5.x.x building for production...
✓ X modules transformed.
dist/index.html                   0.xx kB │ gzip: 0.xx kB
dist/assets/index-xxxxx.css       x.xx kB │ gzip: x.xx kB
dist/assets/index-xxxxx.js        x.xx kB │ gzip: x.xx kB
✓ built in Xs
```

### 4. Start the Frontend Dev Server

In a separate terminal:

```bash
cd /home/user/frontend && npm run dev
```

Verify the frontend compiles successfully. Look for:
```
VITE vX.X.X ready in XXX ms
➜ Local: http://localhost:5173/
```

### 5. Verify Frontend-Backend Connection

Check that the frontend can communicate with the backend:

1. **No CORS errors** in browser console
2. **API calls succeed** - network tab shows 200 responses to backend endpoints
3. **No proxy errors** in the Vite terminal

## Common Issues and Fixes

| Issue | Solution |
|-------|----------|
| CORS errors | Add frontend URL to `CORS_ALLOWED_ORIGINS` in settings.py |
| Connection refused | Ensure backend is running on expected port (8000) |
| Proxy errors | Check `vite.config.ts` proxy configuration matches backend URL |
| Port already in use | Kill existing process or use different port |
| Module not found (frontend) | Run `npm install` to install dependencies |
| Module not found (backend) | Run `uv sync` to install dependencies |

## Vite Proxy Configuration

If the frontend uses a proxy to the backend, verify `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
```

## Commands Reference

All commands must be run from `/home/user/frontend`:

| Command | Purpose | Required |
|---------|---------|----------|
| `cd /home/user/frontend && npx tsc --noEmit` | TypeScript type-check only | ✅ Yes |
| `cd /home/user/frontend && npm run build` | TypeScript check + production build | ✅ Yes |
| `cd /home/user/frontend && npm run dev` | Start dev server | ✅ Yes |
| `cd /home/user/frontend && npm run lint` | ESLint check | ❌ Optional |

## Important

- Run backend before frontend to ensure API is available
- Run `npm run build` before `npm run dev` to catch TypeScript errors early
- Check both terminal outputs for errors
- Verify at least one API call succeeds before considering validation complete
