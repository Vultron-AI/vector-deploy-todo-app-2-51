---
name: static-check
description: Run static analysis (prospector, mypy) and autonomously fix any linting or type errors found
---

# Static Analysis & Auto-Fix

Run this skill autonomously when the user asks to check static analysis, lint the code, fix type errors, or run `make static`.

## Prerequisites

Ensure dependencies are installed:
```bash
uv sync
```

## Process

1. **Run the check**: Execute `make static` to identify all issues
   - To check specific files only: `make static files="path/to/file.py another.py"`

2. **Parse the output**: Extract from the output:
   - File paths and line numbers
   - Error codes (e.g., pylint: unused-import, mypy type errors)
   - Error descriptions

3. **Fix issues in parallel**: For each file with issues, spawn a Task subagent to fix that file. Run multiple subagents in parallel for different files. Each subagent prompt should include:
   - The file path
   - All issues found in that file with line numbers
   - Instructions to read the file, fix issues, and not introduce new problems

4. **Verify fixes**: Run `make static` again to confirm all issues are resolved

5. **Iterate if needed**: If new issues appear, repeat steps 3-4 until clean

## Example subagent prompt

```
Fix these static analysis issues in tasks/views.py:

- Line 12: pylint: unused-import / Unused TeamSerializer imported from serializers
- Line 46: pylint: unused-argument / Unused argument 'pk' (col 34)

Read the file, fix each issue, and ensure fixes don't break functionality.
Do NOT add unnecessary changes beyond fixing the listed issues.
```

## Important

- Run the entire process autonomously without asking for confirmation
- Use parallel subagents when fixing multiple files
- Only report back when fully complete or if a blocking issue occurs
