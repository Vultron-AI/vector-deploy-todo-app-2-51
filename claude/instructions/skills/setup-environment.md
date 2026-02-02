---
name: setup-environment
description: Install dependencies and run commands using uv
---

# Environment Setup

Run this skill when starting a new project or when dependencies need to be installed/updated.

## Install Dependencies

```bash
# Install all dependencies from pyproject.toml
uv sync

# Or use the Makefile
make install
```

## Adding New Dependencies

When adding new packages to the project:

1. **Add to pyproject.toml** under `[project.dependencies]`:
   ```toml
   [project]
   dependencies = [
       "django>=4.2,<5.0",
       "package-name>=1.0,<2.0",
   ]
   ```

2. **Sync the environment**:
   ```bash
   uv sync
   ```

## Common Dependency Categories

Organize `pyproject.toml` dependencies:

```toml
[project]
dependencies = [
    # Django & REST Framework
    "django>=4.2,<5.0",
    "djangorestframework>=3.14",

    # Testing
    "pytest>=8.0",
    "pytest-django>=4.8",

    # Linting & Type Checking
    "black>=24.0",
    "isort>=5.13",
    "prospector>=1.10",
    "mypy>=1.8",
    "django-stubs>=4.2",
]
```

## Running Commands

Use `uv run` to execute commands:

```bash
# Run Django management commands
uv run python manage.py migrate
uv run python manage.py runserver

# Run tests
uv run pytest

# Run linting
uv run black .
uv run mypy .
```

Or use Makefile targets:

```bash
make test      # Runs: uv run pytest
make static    # Runs: uv run prospector && uv run mypy
make format    # Runs: uv run black && uv run isort
```

## Troubleshooting

### Dependencies out of sync
```bash
# Force reinstall all packages
uv sync --reinstall
```

### Package conflicts
```bash
# Update lock file and reinstall
uv lock
uv sync
```

## Important

- Add dependencies to `pyproject.toml` with version constraints
- Use `uv run` to execute any Python commands
- The Makefile uses `uv run` internally
