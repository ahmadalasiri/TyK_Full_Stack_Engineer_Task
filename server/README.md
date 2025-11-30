# Backend - TyK Registration System

Go Fiber API server with PostgreSQL, type-safe queries, and middleware-chain validation.

## 📦 Dependencies

### Core
- **Go 1.24+** - Programming language
- **Fiber v2** - Web framework
- **PostgreSQL** - Database (via pgx/v5)
- **sqlc** - Type-safe SQL code generation

### Key Packages
- **golang-migrate** - Database migrations
- **bcrypt** (golang.org/x/crypto) - Password hashing
- **google/uuid** - UUID generation
- **joho/godotenv** - Environment variable loading
- **nyaruka/phonenumbers** - Phone number validation

## 🏗️ Project Structure

```
cmd/
└── api/
    └── main.go                    # Application entry point

internal/
├── config/
│   └── config.go                 # Environment configuration
│
├── db/
│   ├── db.go                     # Database connection pool
│   ├── migrate.go                # Migration runner
│   ├── migrations/               # SQL migration files
│   ├── queries/                  # SQL queries for sqlc
│   └── sqlc/                     # Generated code (run sqlc generate)
│
├── models/
│   └── user.go                   # Request/response DTOs
│
├── validator/
│   └── fields.go                 # Pure validation functions
│
├── middleware/
│   ├── json.go                   # JSON parsing middleware
│   ├── logging.go                # Request logging
│   ├── validator_field.go        # Field-level validation
│   ├── validator_cross.go        # Cross-field validation
│   └── validator_business.go     # Business logic validation
│
├── repositories/
│   └── user_repo.go              # Database access layer
│
├── services/
│   └── user_service.go           # Business logic
│
├── handlers/
│   ├── register_handler.go       # POST /api/register
│   └── username_handler.go       # GET /api/username-availability
│
├── router/
│   └── router.go                 # Fiber app setup & routing
│
├── response/
│   ├── success.go                # Success response helpers
│   └── error.go                  # Error response helpers
│
└── utils/
    ├── hash.go                   # Password hashing (bcrypt)
    └── time.go                   # Time utilities
```

## 🚀 Development

### Prerequisites

- Go 1.24+
- PostgreSQL 14+
- sqlc (`go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`)

### Setup

1. **Install dependencies:**
   ```bash
   go mod download
   ```

2. **Generate sqlc code:**
   ```bash
   sqlc generate
   ```

3. **Create `.env` file:**
   ```env
   SERVER_PORT=3001
   DATABASE_URL=postgres://postgres:password@localhost:5432/tyk_registration
   ```

4. **Run migrations:**
   Migrations run automatically on startup, or manually:
   ```bash
   migrate -path ./internal/db/migrations -database "$DATABASE_URL" up
   ```

### Run Server

```bash
go run ./cmd/api
```

### Auto-reload (Air)

```bash
go install github.com/cosmtrek/air@latest
air
```

Configuration in `.air.toml`.

## 🏛️ Architecture

### Middleware Chain Pattern

Validation is implemented as a chain of middleware functions:

```go
api.Post("/register",
    middleware.ParseRegistrationJSON(),    // 1. Parse JSON
    middleware.FieldValidator(),           // 2. Field-level validation
    middleware.CrossFieldValidator(),      // 3. Cross-field validation
    middleware.BusinessValidator(repo),    // 4. Business logic validation
    registerHandler.Handle)                // 5. Handler
```

**Benefits:**
- Easy to add/remove validators
- Clear separation of concerns
- Testable in isolation
- Follows single responsibility principle

### Validation Layers

1. **Field Validator**: Required fields, format validation (email, phone, password strength)
2. **Cross-Field Validator**: Password confirmation, country/email domain matching
3. **Business Validator**: Uniqueness checks (email, username, phone)

### Database Layer

- **sqlc**: Generates type-safe Go code from SQL queries
- **Repository Pattern**: Abstracts database access
- **Service Layer**: Contains business logic, calls repositories

### Error Handling

Structured error responses:
```json
{
  "error": {
    "code": "validation_error|business_error|internal_error",
    "message": "Human-readable message",
    "field_errors": {
      "field_name": "Specific error message"
    }
  }
}
```

## 🧪 Testing

See `tests/README.md` for detailed testing information.

### Quick Test Commands

```bash
# All tests
go test ./tests/...

# Unit tests only
go test ./tests/internal/utils ./tests/internal/validator -v

# Integration tests
go test ./tests/internal/integration -v
```

## 📝 API Endpoints

### POST /api/register

Registers a new user.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "United States",
  "country_iso": "US",
  "username": "johndoe",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "terms_accepted": true,
  "newsletter": false
}
```

**Success Response (201):**
```json
{
  "user_id": "uuid-here",
  "message": "Registration successful"
}
```

**Error Response (400/422):**
```json
{
  "error": {
    "code": "validation_error",
    "message": "There are validation errors",
    "field_errors": {
      "email": "Invalid email address"
    }
  }
}
```

### GET /api/username-availability

Checks if username is available.

**Query Parameters:**
- `username` (required)

**Response:**
```json
{
  "username": "johndoe",
  "available": true
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### GET /ready

Readiness check (tests database connectivity).

**Response:**
```json
{
  "status": "ready"
}
```

## 🔧 Configuration

### Environment Variables

- `SERVER_PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string (required)

### Database Migrations

Migrations are in `internal/db/migrations/`:
- `000001_create_users_table.up.sql` - Creates users table
- `000001_create_users_table.down.sql` - Drops users table

Migrations run automatically on server startup via `golang-migrate`.

## 🔐 Security

- **Password Hashing**: bcrypt with adaptive cost
- **SQL Injection**: Prevented by sqlc (type-safe queries)
- **Input Validation**: Multi-layer validation chain
- **Error Messages**: Don't leak sensitive information

## 📊 Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    newsletter BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🐛 Common Issues

### sqlc Code Not Generated

Run:
```bash
sqlc generate
```

### Database Connection Errors

Check:
- PostgreSQL is running
- `DATABASE_URL` is correct
- Database exists: `createdb tyk_registration`

### Migration Errors

Reset migrations:
```bash
migrate -path ./internal/db/migrations -database "$DATABASE_URL" down
migrate -path ./internal/db/migrations -database "$DATABASE_URL" up
```

### Port Already in Use

Change `SERVER_PORT` in `.env` or kill the process using port 3001.

