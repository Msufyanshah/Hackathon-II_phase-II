# ADR 003: Testing Strategy and Framework Selection

**Date**: 2026-03-25  
**Status**: Accepted  
**Deciders**: Development Team

## Context and Problem Statement

The Todo Application requires comprehensive testing to ensure:
- Authentication flows work correctly
- API endpoints respond as documented
- User data isolation is enforced
- Frontend components render correctly
- Integration between services functions properly
- Code coverage meets minimum thresholds (80%)

We need to establish a testing strategy with appropriate frameworks and practices.

## Considered Options

### Backend Testing

#### Option 1: unittest (Standard Library)
- Built into Python
- Verbose syntax
- Limited fixtures support
- No async support without extensions

#### Option 2: pytest
- Simple, concise syntax
- Powerful fixture system
- Excellent plugin ecosystem
- Native async support with pytest-asyncio
- Coverage integration

#### Option 3: unittest + pytest
- Hybrid approach
- Maximum compatibility
- Increased complexity

### Frontend Testing

#### Option 1: Jest
- Industry standard
- Fast parallel execution
- Built-in mocking
- Snapshot testing

#### Option 2: Vitest
- Vite-native (faster for Next.js)
- Jest-compatible API
- Better TypeScript support
- Built-in coverage

#### Option 3: React Testing Library
- Focus on user behavior
- Framework agnostic
- Often used with Jest/Vitest

## Decision Outcome

**Backend: Option 2 - pytest**  
**Frontend: Option 2 - Vitest + React Testing Library**

### Backend Testing Stack

```python
# pytest + pytest-asyncio + pytest-cov
```

**Rationale**:
1. **Simplicity**: Clean, readable test syntax
2. **Fixtures**: Powerful dependency injection for test setup
3. **Async Support**: Native async/await test support
4. **Coverage**: Built-in coverage reporting
5. **Ecosystem**: Rich plugin ecosystem (factory-boy, responses, etc.)

**Test Structure**:
```
backend/
├── tests/
│   ├── conftest.py          # Shared fixtures
│   ├── test_auth.py         # Authentication tests
│   ├── test_tasks.py        # Task CRUD tests
│   └── test_security.py     # JWT/security tests
├── pytest.ini               # pytest configuration
└── requirements.txt         # Includes pytest, pytest-asyncio, pytest-cov
```

**Fixture Pattern**:
```python
@pytest.fixture
def test_user(session: Session) -> User:
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpassword123"),
    )
    session.add(user)
    session.commit()
    return user
```

### Frontend Testing Stack

```typescript
// Vitest + @testing-library/react + jsdom
```

**Rationale**:
1. **Speed**: Vite-based, faster than Jest
2. **Compatibility**: Jest-compatible API (easy migration)
3. **TypeScript**: First-class TypeScript support
4. **React Testing Library**: User-centric testing approach
5. **Coverage**: Built-in coverage with multiple reporters

**Test Structure**:
```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts         # Test setup and mocks
│   │   ├── auth.test.tsx    # Auth context tests
│   │   ├── taskService.test.ts
│   │   └── Button.test.tsx  # Component tests
│   └── vitest.config.ts     # Vitest configuration
```

**Component Test Pattern**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'

test('should handle click events', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click Me</Button>)
  
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## Testing Requirements

### Backend Coverage Requirements

- **Unit Tests**: All utility functions, security helpers
- **Integration Tests**: All API endpoints
- **Security Tests**: Authentication, authorization, rate limiting
- **Minimum Coverage**: 80% line coverage

### Frontend Coverage Requirements

- **Unit Tests**: Utility functions, services
- **Component Tests**: All reusable UI components
- **Integration Tests**: Auth flows, task management
- **Minimum Coverage**: 80% line coverage

## Test Execution

### Backend

```bash
# Run all tests
cd backend
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v

# Run with detailed output
pytest -v --cov=src --cov-report=term-missing
```

### Frontend

```bash
# Run all tests
cd frontend
npm run test

# Run once with coverage
npm run test:coverage

# Run in watch mode
npm run test -- --watch
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` and `develop`
- Every pull request
- Pre-deployment checks

**Coverage Threshold**:
- Backend: Fail if < 80%
- Frontend: Fail if < 80%

## Mocking Strategy

### Backend Mocking

```python
# Use in-memory SQLite for unit tests
@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    return Session(engine)

# Mock external services with responses
import responses

@responses.activate
def test_external_api():
    responses.get("https://api.example.com", json={"data": "test"})
    # Test code
```

### Frontend Mocking

```typescript
// Mock fetch API
global.fetch = vi.fn()

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000'
```

## Consequences

### Positive
- Comprehensive test coverage prevents regressions
- Fast test execution encourages running tests frequently
- Clear patterns make tests maintainable
- CI/CD integration ensures tests always run

### Negative
- Initial setup requires time investment
- Tests add to development time (acceptable trade-off)
- Mocking external dependencies requires maintenance

## Compliance

This decision complies with constitutional principles:
- **Test-Driven Development**: Tests written before implementation
- **Code Quality**: Minimum 80% coverage requirement
- **Observability**: Tests provide documentation of expected behavior

## Future Considerations

- End-to-end testing with Playwright (Phase III)
- Visual regression testing for UI components
- Performance testing for API endpoints
- Load testing for scalability verification
