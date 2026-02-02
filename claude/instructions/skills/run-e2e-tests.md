---
name: run-e2e-tests
description: Run Playwright e2e tests and verify screenshots were captured
---

# Run E2E Tests

Run Playwright tests and verify screenshots were captured successfully.

## Prerequisites

- Backend server running on port 8000
- Frontend dev server running on port 5173
- Playwright browsers installed (`npx playwright install chromium`)
- Tests customized for your app (see CLAUDE.md Final Validation Steps)

## Run Tests

```bash
cd frontend && npx playwright test
```

## Verify Screenshots

Check that screenshots were captured:

```bash
ls -la frontend/tests/screenshots/
```

## Expected Outputs

| Screenshot | Description |
|------------|-------------|
| `MainPage.png` | Screenshot of the main/home page |
| `LandingPage.png` | Screenshot of the landing/auth page |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Browser not found | Run `npx playwright install chromium` |
| Connection refused | Ensure frontend dev server is running on port 5173 |
| Tests timeout | Increase timeout in `playwright.config.ts` |
| Screenshots missing | Check `tests/screenshots/` directory was created |
