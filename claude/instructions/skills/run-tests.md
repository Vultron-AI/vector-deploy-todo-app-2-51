---
name: run-tests
description: Run pytest tests and fix any failing tests
---

# Run Tests

Run this skill to execute the test suite and fix any failing tests.

## Prerequisites

Ensure dependencies are installed:
```bash
uv sync
```

## Process

### 1. Run the Test Suite

```bash
# Run all tests (with explicit settings to avoid parent conftest issues)
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest --rootdir=. 2>&1

# Or use the Makefile (if available)
make test
```

### 2. Run Tests with Verbose Output

For debugging failing tests (always prefix with `DJANGO_SETTINGS_MODULE=config.settings`):

```bash
# Verbose output showing each test
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest -v --rootdir=. 2>&1

# Show print statements and logging
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest -v -s --rootdir=. 2>&1

# Stop on first failure
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest -x --rootdir=. 2>&1

# Run last failed tests only
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest --lf --rootdir=. 2>&1
```

### 3. Run Specific Tests

```bash
# Run tests in a specific file
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest accounts/tests/test_views.py --rootdir=. 2>&1

# Run a specific test function
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest accounts/tests/test_views.py::test_create_user --rootdir=. 2>&1

# Run tests matching a pattern
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest -k "test_create" --rootdir=. 2>&1
```

### 4. Fix Failing Tests

When tests fail, spawn parallel subagents to fix them:

1. **Parse the failure output** to identify:
   - Which test files/functions failed
   - The error messages and stack traces
   - Line numbers where failures occurred

2. **Spawn Task subagents in parallel** for each failing test file:
   ```
   Task("Fix failing tests in todos/tests/test_views.py:
   - test_create_todo: AssertionError - expected 201, got 400
   - test_list_todos: KeyError 'results'

   Read the test file and the code it tests, fix the issues.")
   ```

3. **Re-run tests** after fixes to verify

### 5. Common Test Issues and Fixes

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Check imports, ensure package is in pyproject.toml |
| `django.db.utils.OperationalError` | Add `@pytest.mark.django_db` decorator |
| `AssertionError` on status code | Check view logic, serializer validation |
| `KeyError` in response | Check serializer fields match test expectations |

## Running with Coverage

```bash
# Run tests with coverage report
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest --cov=. --cov-report=term-missing --rootdir=. 2>&1

# Generate HTML coverage report
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest --cov=. --cov-report=html --rootdir=. 2>&1
```

## Database Transactions

For tests that modify the database:

```python
@pytest.mark.django_db(transaction=True)
def test_creates_record():
    # Test that creates/modifies database records
    pass
```

## Environment Isolation

If tests fail with `ModuleNotFoundError` for modules like `internal_apps`, pytest is discovering `conftest.py` files from parent directories. This happens because pytest loads conftest files from root to leaf order, and parent conftest files may set incorrect Django settings.

### Solution: Always Use Explicit Settings

**Always run tests with the environment variable set BEFORE the command:**

```bash
# Correct - set env var before pytest
DJANGO_SETTINGS_MODULE=config.settings uv run python -m pytest --rootdir=. 2>&1
```

**Why this works:**
1. `DJANGO_SETTINGS_MODULE=config.settings` - Sets the correct settings before any conftest runs
2. `uv run python -m pytest` - Runs pytest as a module via uv (more reliable)
3. `--rootdir=.` - Tells pytest to treat current directory as root
4. `2>&1` - Captures both stdout and stderr

### Common Symptoms

| Error | Cause |
|-------|-------|
| `ModuleNotFoundError: No module named 'internal_apps'` | Parent conftest.py is setting wrong Django settings |
| `django.core.exceptions.ImproperlyConfigured` | Django settings module not found |
| Tests from parent directories running | Missing `--rootdir=.` flag |

### If Issues Persist

If you're running the boilerplate inside a larger project and still hitting parent conftest issues:

1. **Check you're in the correct directory** - `pwd` should show the project root (where `manage.py` is)
2. **Verify pytest.ini exists** - It should have `DJANGO_SETTINGS_MODULE = config.settings`
3. **Ensure uv is using the correct environment** - Run `uv run which python` to verify

## Important

- Use `uv sync` to install dependencies before running tests
- Use parallel subagents when fixing multiple test files
- Re-run the full test suite after fixes to catch regressions
- Report back only when all tests pass or if blocked
