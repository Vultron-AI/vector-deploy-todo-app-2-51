## Core Rules

### 1. Todos Must Link to Linear
- **Rule:** All TODO comments **must** link to Linear with an `[ENG-xxxx]` tag
- **Format:**
  ```python
  # TODO [ENG-xxxx]: Update this to "x"
  ```

### 2. Migrations
- **Rule:** Migrations should always be in their own PR. All migrations must be rollback-safe with correct defaults
- **Flag if:** Migration is within a larger PR or is not rollback-safe

### 3. Separation of Concerns
- **Rule:** Keep **traversal/iteration** separate from **business logic**. Avoid bespoke one-pass loops when it harms reuse/readability
- **Flag if:** A long loop both (a) walks a structure **and** (b) computes multiple unrelated effects; or a function both **(de)serializes** and runs core logic

**Example - Separate Traversal from Logic:**
```python
def _group_partitions_with_overlap(
    partitions: List[Partition],
    previous_context_length: int = 5,
    following_context_length: int = 5,
    partition_max_word_size: int = 800,
) -> List[GroupedPartitions]:
    # Separate iteration from business logic
    partition_groups = list(
        split_accumulate(partitions, max_size=partition_max_word_size, size_fn=lambda p: count_words(p.text))
    )
    
    # Business logic in separate function
    return _create_grouped_partitions(partition_groups, previous_context_length, following_context_length)
```

### 4. (De)Serialization at the Edges
- **Rule:** Convert external data **at boundaries** (view/API/IO). Core code operates on **typed** in-memory objects (Pydantic models/Enums), **not** raw dicts/JSON
  - All public functions should do the same
- **Flag if:** Business functions accept/return untyped `dict`/JSON blobs or DRF serializers

**Example:**
```python
# Bad: Mixes deserialization and logic
def process_user_data(json_data):
    user_data = json.loads(json_data)
    if user_data['active']:
        process_user(user_data)

# Good: Separate deserialization from logic
class User(BaseModel):
    user_name: str
    active: bool

def deserialize_user(json_data) -> User:
    return User.model_validate_json(json_data)

def get_active_username(user: User) -> Optional[str]:
    if user.active:
        return user.username
    return None
```

### 5. Public Functions Are Self-Contained
- **Rule:** A public function's purpose should be clear from its **name, inputs, outputs**—no hidden globals or caller context
- **Flag if:** Reads config from globals rather than parameters; relies on module state; uses vague names or returns opaque dicts

**Example:**
```python
# Bad: Relies on external context
def num_batch(items):
    return len(items) / BATCH_SIZE

# Good: Self-contained
def num_batch(items: List[Any], batch_size: int) -> int:
    return len(items) / batch_size
```

### 6. Dependency Injection
- **Rule:** External clients (OpenAI, S3, etc.) are **injected**, not constructed inline (except in DI/config wiring)
- **Flag if:** `OpenAIClient()` (or other external clients) are instantiated inside business code

**Example:**
```python
# Bad: Directly instantiates a client
def ask_question(user_query: str):
    openai = OpenAIClient()
    return openai.chat.completions.create(...)

# Good: Uses inject
@inject.params(openai_client=OpenAIClient)
def ask_question(
    user_query: str, 
    *,
    openai_client: Optional[OpenAIClient] = None
) -> str:
    assert openai_client is not None
    return openai_client.chat.completions.create(...)
```

### 7. Function Argument Discipline
- **Rule:** **≤ 5 primary args**. If more, consider splitting the function or grouping related args into a Pydantic model. Use `*` to force kwargs for config/injected deps
- **Flag if:** 4+ positional args that look groupable; mixed unrelated flags; or missing `*` before config/injected args

**Example:**
```python
# Bad: Too many arguments
def will_drink_coffee(
    origin: str,
    varietal: str,
    process: str,
    roast: str,
    brand: str,
    well_rested: bool,
    after_12pm: bool,
    session_context: Optional[SessionContext] = None,
):
    pass

# Good: Group related arguments
class Coffee(BaseModel):
    origin: str
    varietal: str
    process: str
    roast: str

class DrinkerState(BaseModel):
    well_rested: bool
    after_12pm: bool

def will_drink_coffee(
    coffee: Coffee,
    brand: str,
    state: DrinkerState,
    *,  # require kwargs for injected clients and config arguments
    session_context: Optional[SessionContext] = None,
) -> bool:
    pass
```

### 8. No In-Place Mutation of Inputs
- **Rule:** Prefer **pure** transforms. Return a new value instead of mutating arguments (especially lists/dicts)
- **Flag if:** Function writes back into input collections
- **Comment suggestion:** "Return a new list/obj; avoid mutating inputs unless performance is critical and documented"

**Example:**
```python
# Bad: Modifies its argument
def add_one(my_list: List[int]):
    for i, n in enumerate(my_list):
        my_list[i] += 1

# Good: Returns the updated value
def add_one(my_list: List[int]) -> List[int]:
    return [n + 1 for n in my_list]
```

### 9. Readability
- **Rule:** Functions should be readable and strive to use helpers, Pydantic models, thoughtful variable names, and function naming to be as close to plain English as possible. Functions intent should be understood by reading its helpers. Most functions should be 50 lines or less
  - In situations where this is not clear, docstrings or comments are required
  - Comments should be useful and thoughtful. Flag excessive or unnecessary comments
- **Flag if:** Function purpose is not clear, relies on other functions to understand its purpose, or could use helpers to improve readability

## Module Organization

The typical structure of a module:

```
backend/
    app/
        mymodule/
            types.py          # Enums and data structures
            config.py         # Configuration and DI wiring
            models.py         # Database models
            migrations/       # Database migrations
            service.py        # Business logic (pure functions)
            views.py          # API views
            urls.py           # URL routing
            serializers.py    # REST API serializers
```

**Key principles:**
- Business logic operates mostly on types defined in `types.py`
- It's sometimes acceptable to pass database models directly
- Avoid functions accepting or returning DRF serializers
- Most business logic should be in `service.py` as pure functions
- Avoid packaging functionality into a client class unless it calls external services

## Prioritization

We prioritize principles in this order:

**Extensibility & Composability > Readability > Performance**

1. **Extensibility/Composability** - Code can handle new features, changes, and integrations without significant rewrites
2. **Readability** - Code reduces onboarding time, simplifies debugging, enhances collaboration
3. **Performance** - Optimize only when there's a clear bottleneck or performance target. Premature optimization complicates the codebase

## Additional Guidelines

### Type Usage
- Input and output types should make sense
- Avoid using untyped dicts as input/output types
- Use Pydantic models for structured data

**Example:**
```python
# Bad: Abstract and unintuitive mapping
def parse_template(json) -> Dict[str, Dict[str, Dict[str, str]]]:
    return json.loads(json)

# Good: Well-defined Pydantic model
class Volume(BaseModel):
    name: str
    size: int

class Template(BaseModel):
    id: str
    volumes: List[Volume]

def parse_template(json_blob: dict) -> Template:
    """Parses the JSON blob into a well-defined Template Pydantic model."""
    return Template.model_validate(json_blob)
```

### Dependencies
Add any dependencies for imports to `pyproject.toml`.