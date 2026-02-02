---
description: Testing best practices and pytest conventions for the backend
globs: **/test_*.py
---

# Testing Standards

## Testing Framework

We use **pytest** for running backend tests, executed via **uv**.

### Running Tests

```bash
# Run all tests
uv run pytest

# Or use the Makefile
make test
```

See `skills/run-tests.md` for detailed test running instructions and troubleshooting.

## Testing Expectations

- **Rule:** Prefer focused tests with Arrange-Act-Assert structure
- **Coverage:** Use codecov as a first pass on test coverage in your PR. Actively review and decide that testing is not needed when flagged
- **Not enforced but recommended:** Reviewers should flag missing coverage; implementers are responsible for deciding coverage at their discretion

### Test File Location

**Rule:** Place unit tests in a `tests` folder within the module being tested.

- **Standard modules** (e.g., `notifications`): `notifications/tests/`
- **Complex modules** (e.g., `chat`): Mirror the source structure in `tests/`
  - Example: `chat/services/foo.py` → `chat/tests/services/test_foo.py`
- **Shared modules** (`app/shared/*`): Each subfolder has its own `tests/`
  - Example: `app/shared/document/` → `app/shared/document/tests/`

**Recommendation:** Integration tests spanning multiple modules can live in the outermost module's test folder.

### When to Write Tests

✅ **Always test:**
- All endpoints (at least one test per endpoint)
- All public functions
- Complex algorithmic private functions (as sanity checks)

✅ **Generally recommended:**
- Broad test coverage using helpers and mocks
- End-to-end tests for features

❌ **Avoid:**
- Tests for trivial getters/setters
- Duplicate test coverage without added value

---

## 1. Test Naming Conventions

**Rule:** Use descriptive function names that clearly communicate the behavior being tested

**✅ Good:**
```python
def test_save_sections_creates_report_and_links():
    ...

def test_fetch_report_sections_ordering_is_maintained():
    ...
```

**❌ Bad:**
```python
def test_report():
    ...

def test_1():
    ...
```

---

## 2. Setup Consistency

Use **test factories or test helpers** like `create_user` to set up consistent test objects. Write these helpers whenever needed.

**✅ Good:**
```python
user_workspace = create_user()
chat_session = create_chat_session(user)
```

**❌ Avoid custom inline setup unless necessary**

---

## 3. Arrange-Act-Assert Structure

Structure tests into **3 clear sections** using line breaks or comments:

```python
def test_chat_attached_files():
    # Arrange
    user = create_user()
    chat_session = create_chat_session(user=user)
    message_id = "test-message-id"
    
    # Act
    response = client.get(f"/chat/{message_id}/attached_files")
    
    # Assert
    assert response.status_code == 200
    assert "files" in response.data
```

---

## 4. Use `@pytest.mark.django_db` Appropriately

Use `@pytest.mark.django_db(transaction=True)` when:
- Testing transactional behavior
- Using `.create()` and DB commits

```python
@pytest.mark.django_db(transaction=True)
def test_save_sections_creates_report():
    ...
```

---

## 5. Isolated & Focused Tests

Tests should validate **one behavior only**. If testing multiple behaviors, split into separate tests.

**✅ Good:**
```python
def test_save_sections_creates_report_and_links():
    ...

def test_save_sections_does_nothing_if_link_exists():
    ...
```

**❌ Bad:**
```python
def test_save_sections():
    # Tests creation, linking, updates, and deletion all in one
    ...
```

---

## 6. Assert Precisely

Be specific with assertions. Avoid vague checks.

**✅ Good:**
```python
assert db_section.title == ReportTitle.ELIGIBILITY_REQUIREMENTS
assert response.data == [{"id": ..., "name": ..., "file_extension_type": ...}]
assert response.status_code == 200
```

**❌ Bad:**
```python
assert response.status_code  # Too vague
assert len(response.data) > 0  # Not specific enough
assert response.data  # What are we actually checking?
```

---

## 7. Use Helper Functions for Repeated Setup

If multiple tests use the same setup pattern, extract it into a helper function:

```python
def create_workflow_variable(chat_session):
    global_chat_session = create_global_chat_session(
        chat_room=chat_session, 
        workflow=None
    )
    return WorkflowVariable.objects.create(
        workflow_type=Workflow.DRAFT,
        content_type=ContentType.objects.get_for_model(GlobalChatSession),
        object_id=str(global_chat_session.id),
        variables={},
    )
```

Then use it in multiple tests:
```python
def test_workflow_variable_creation():
    chat_session = create_chat_session()
    workflow_var = create_workflow_variable(chat_session)
    assert workflow_var.workflow_type == Workflow.DRAFT
```

---

## 8. Use Meaningful Test Data

Use representative test data to catch bugs and communicate intent

**✅ Good:**
```python
file_contents = create_file_contents(file, ["chunk3"])
sourced_content = SourcedContent(content="Test content for eligibility", ...)
```

**❌ Bad:**
```python
create_file_contents(file, ["asdf"])
SourcedContent(content="", ...)
```

---

## 9. API Test Best Practices

Always assert both **status codes** and **response structure**:

```python
def test_get_attached_files():
    # Arrange
    user_workspace = create_user_workspace()
    authenticate(user_workspace.user)
    
    # Act
    response = client.get(f"/chat/{message_id}/attached_files")
    
    # Assert
    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert "id" in response.data[0]
```

**Validate list contents:**
```python
ids_in_data = {file["id"] for file in response.data}
assert str(file1.id) in ids_in_data
assert str(file2.id) not in ids_in_data
```

**Use authentication helpers properly:**
- `authenticate()` for real user authentication
- `mock_authentication()` for test authentication

---

## Test Coverage Philosophy

We **do NOT enforce** strict test coverage percentages, but reasonably try to have
coverage over impactful lines.

The goal is maintainable, reliable code - not 100% coverage for its own sake.