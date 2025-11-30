# Backend Tests

## Test Structure

The backend tests are simplified to focus on:

- **Unit Tests**: Essential utility and validation functions (no database needed)
- **Integration Tests**: Real API endpoints using the actual router and database

## Setup

### 1. Create `.env` file

Create a `server/.env` file with your database connection:

```env
DATABASE_URL=postgres://tyk_user:tyk_password@localhost:5432/tyk_registration?sslmode=disable
SERVER_PORT=3001
```

The tests will automatically load `DATABASE_URL` from this file.

## Running Tests

### Run all tests:

```bash
go test ./tests/...
```

### Run only unit tests (no database needed):

```bash
go test ./tests/internal/utils ./tests/internal/validator -v
```

### Run integration tests (requires DATABASE_URL in .env):

```bash
go test ./tests/internal/integration -v
```

## Test Details

### Unit Tests

- **utils**: Password hashing functions
- **validator**: Email, phone, password, and domain validation

### Integration Tests

- **integration/api_test.go**: Tests all API endpoints using the real router
  - Health and ready endpoints
  - User registration (success and error cases)
  - Username availability checking
  - All tests use real database and clean up after completion

All integration tests:

- Use the real API router
- Connect to the database using `DATABASE_URL` from `.env`
- Clean the database before and after each test
- Test the complete request/response flow
