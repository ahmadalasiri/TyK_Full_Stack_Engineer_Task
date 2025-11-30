## TyK Full Stack Engineer Task

### Overview

Build a multi-step user registration system with a React-based frontend. This assignment demonstrates technical skills, problem-solving approach, and code quality.

### Project Description

This repository implements a User Registration application that collects user information across multiple steps and submits the complete data at the end of the process. The solution is built as a monorepo with:

- **Frontend**: React + Vite + TailwindCSS, React Hook Form + Zod, Axios, React Context
- **Backend**: Go (Fiber), PostgreSQL, sqlc, bcrypt, google/uuid, middleware-chain validation

The backend can serve the built frontend for production, or you can run both separately in development. A Docker Compose setup is also provided.

---

## Frontend Requirements

### 1. Multi-Step Form (3 steps + Review)

**Step 1: Personal Information**

- **First Name** (required)
- **Last Name** (required)
- **Email** (required, must be valid email format)
- **Phone Number** (optional, must be valid format if provided)

**Step 2: Address Details**

- **Street Address** (required)
- **City** (required)
- **State/Province** (required, dropdown selection)
- **Country** (required, dropdown selection)

**Step 3: Account Setup**

- **Username** (required, minimum 6 characters, check availability)
- **Password** (required, minimum 8 characters, must include uppercase, lowercase, number, and special character)
- **Confirm Password** (required, must match password)
- **Terms and Conditions** checkbox (required)
- **Newsletter subscription** (optional checkbox)

**Step 4: Review & Submit**

- Review screen showing all entered information before final submission
- Ability to edit sections by jumping back to earlier steps

### 2. Navigation Features

- **Progress indicator** showing current step and can be used to jump to any step (only up to highest completed step)
- **Previous/Next buttons** for navigation between steps
- **Ability to go back and edit previous steps**
- **Data persistence** when navigating between steps (using React Context)

### 3. Validation Requirements

- **Real-time field validation** with appropriate error messages (React Hook Form + Zod)
- **Prevent progression** to next step if current step has validation errors
- **Validation for all fields** including:
  - Email format validation
  - Phone number format validation (when provided)
  - Password strength validation
  - Password confirmation matching
  - Username availability check (debounced API call)
  - Country/email domain matching (UK bonus feature)

### 4. Final Submission

- **Review screen** showing all entered information before final submission
- **Submit button** that sends all collected data to the API endpoint
- **Success/Error handling** with appropriate user feedback
- **Reset form** after successful submission

### 5. UI/UX Requirements

- **Loading states** during async operations (username availability check, form submission)
- **Clean and intuitive user interface** with TailwindCSS styling
- **Smooth transitions** between steps
- **Error banners** for backend validation errors

### 6. Bonus

- **Additional UI polish** with modern design, animations, and responsive layout
- **Validate Step 2**: Country/email domain matching - if user selects country as **UK** (or United Kingdom), their email must include **.uk** domain

---

## Backend Requirements

Build a backend service to support the multi-step user registration process described above.

### Functional Requirements

#### 1. Monorepo Structure

- Both the **backend (Go)** and **frontend (React)** are in a single repository
- The backend serves the frontend's static assets in production mode
- Can be decoupled for development (frontend runs on Vite dev server, backend on separate port)

#### 2. API Endpoints

- **POST `/api/register`**

  - Accepts the complete registration payload after all steps are completed
  - Checks that the email is available before storing user data
  - Returns `201 Created` with `{ "user_id": "...", "message": "Registration successful" }` on success
  - Returns structured error responses with field-specific validation errors

- **GET `/api/username-availability?username=...`**

  - Checks username availability
  - Returns `{ "username": "...", "available": true|false }`
  - Validates minimum length (6 characters) before checking database

- **GET `/health`**

  - Simple health check endpoint returning `{ "status": "ok" }`

- **GET `/ready`**
  - Readiness check that pings the database
  - Returns `{ "status": "ready" }` or `503` if database is not ready

#### 3. Form Response Handling

- Accepts a **single JSON payload** representing all registration steps:
  ```json
  {
    "first_name": "...",
    "last_name": "...",
    "email": "...",
    "phone": "...",
    "street": "...",
    "city": "...",
    "state": "...",
    "country": "...",
    "country_iso": "...",
    "username": "...",
    "password": "...",
    "confirm_password": "...",
    "terms_accepted": true,
    "newsletter": false
  }
  ```
- Parses, validates, and reports errors in a **structured format**:
  ```json
  {
    "error": {
      "code": "validation_error|business_error",
      "message": "description",
      "field_errors": {
        "field_name": "error message"
      }
    }
  }
  ```

#### 4. Validation

Validation is implemented as a **middleware chain**, where each validator is a middleware function. It is **easy to add or remove validators** without breaking the app.

- **Field-level validation** (`FieldValidator` middleware):

  - Required fields (name, email, address, country, username, password, terms)
  - Email format validation
  - Optional phone format validation
  - Password strength: min 8 chars with uppercase, lowercase, number, special character
  - Username length: min 6 characters

- **Cross-field validation** (`CrossFieldValidator` middleware):

  - Password confirmation match
  - Country/email domain rule: if country is UK/United Kingdom, email must include `.uk`

- **Business logic validation** (`BusinessValidator` middleware):
  - Email uniqueness using `UserRepository`
  - Username uniqueness using `UserRepository`
  - Phone uniqueness (if provided) using `UserRepository`

#### 5. Middleware Chain Support

- Middlewares are registered in a way that allows **easy addition/removal** without breaking the chain
- Includes middleware for:
  - **Logging** (`Logging` middleware) - logs all requests
  - **JSON parsing** (`ParseRegistrationJSON` middleware) - parses and validates JSON structure
  - **Field validation** (`FieldValidator` middleware)
  - **Cross-field validation** (`CrossFieldValidator` middleware)
  - **Business validation** (`BusinessValidator` middleware)

The middleware chain is defined in `server/internal/router/router.go`:

```go
api.Post("/register",
    middleware.ParseRegistrationJSON(),
    middleware.FieldValidator(),
    middleware.CrossFieldValidator(),
    middleware.BusinessValidator(repo),
    registerHandler.Handle)
```

#### 6. Database Storage

- Persists user registration data to **PostgreSQL** database
- Stores all fields from the registration process, including **audit fields**:

  - `id` (UUID, primary key)
  - `first_name`, `last_name`, `email`, `phone`
  - `street`, `city`, `state`, `country`
  - `username`, `password_hash` (bcrypt hashed)
  - `terms_accepted`, `newsletter`
  - `created_at`, `updated_at` (TIMESTAMPTZ)

- Database migrations are managed with `golang-migrate` and run automatically on server startup
- Uses `sqlc` for type-safe SQL queries

#### 7. Error Handling & Feedback

- Returns **consistent JSON error responses** with error codes and messages
- Returns **field-specific validation errors** for frontend display
- On successful registration, returns a **success message** and **user ID**
- Error response structure:
  ```json
  {
    "error": {
      "code": "validation_error|business_error|internal_error",
      "message": "Human-readable error message",
      "field_errors": {
        "field_name": "Specific error message for this field"
      }
    }
  }
  ```

#### 8. Bonus Features

- **Configurable database backend** via environment variables (`DATABASE_URL`)
- **Health and readiness endpoints** (`/health` and `/ready`) for deployment checks
- **Easy to switch to a different SQL database system** - uses `pgx/v5` with PostgreSQL, but the repository pattern makes it straightforward to adapt to other SQL databases

---

## Technical Requirements

### Tech Stack

- **Frontend Framework**: React 19
- **State Management**: React Context API
- **Form Management**: React Hook Form + Zod
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Backend Framework**: Go 1.24+ with Fiber
- **Database**: PostgreSQL 14+
- **Query Builder**: sqlc
- **Password Hashing**: bcrypt
- **UUID Generation**: google/uuid
- **Validation**: Custom middleware chain pattern
- **Containerization**: Docker & Docker Compose

---

## Deliverables

### 1. Source Code

- ✅ Complete implementation in GitHub repository
- ✅ Comprehensive `README.md` with:
  - Project setup instructions
  - How to run the application
  - How to run tests
  - Brief architectural overview
  - Assumptions made

### 2. Documentation

- ✅ `README.md` with clear setup instructions
- ✅ Code comments and documentation
- ✅ Test documentation in `server/tests/README.md`

---

## Setup & Installation

### Prerequisites

- Node.js (LTS) and npm
- Go 1.24+
- PostgreSQL 14+
- `sqlc` installed (`go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest` or package manager)
- Docker & Docker Compose (optional, for containerized run)

### 1. Clone & Install Dependencies

From the repository root:

```bash
# Client deps
cd client
npm install

# Server deps
cd ../server
go mod download
```

### 2. Database Setup (Local)

Create the database (if it doesn't exist):

```bash
createdb tyk_registration
# Or using psql:
# psql -c "CREATE DATABASE tyk_registration;"
```

Generate sqlc code (required for database queries):

```bash
cd server
sqlc generate
```

Configure environment (either via real env vars or a local `.env` file in `server/`):

- `SERVER_PORT=3001`
- `DATABASE_URL=postgres://postgres:password@localhost:5432/tyk_registration?sslmode=disable`

**Note:** Database migrations run automatically on server startup using `golang-migrate`. No manual migration step needed!

---

## Running the Application

### Local Development

#### Backend (Go + Fiber)

**Option 1: Standard Run**

From `server/`:

```bash
export SERVER_PORT=3001
export DATABASE_URL=postgres://tyk_user:tyk_password@localhost:5432/tyk_registration?sslmode=disable
go run ./cmd/api
```

**Option 2: Auto-Reload with Air (Recommended for Development)**

[Air](https://github.com/cosmtrek/air) automatically rebuilds and restarts your Go server when files change (like nodemon for Node.js).

**Install Air:**

```bash
go install github.com/cosmtrek/air@latest
```

**Run with auto-reload:**

```bash
cd server
air
```

Air will watch for changes in `.go` files and automatically rebuild and restart the server. Configuration is in `server/.air.toml`.

**Alternative tools:**

- **Fresh**: `go install github.com/gravityblast/fresh@latest` then `fresh`
- **CompileDaemon**: `go install github.com/githubnemo/CompileDaemon@latest` then `CompileDaemon -command="./bin/server"`

The API will listen on `http://localhost:3001`.

#### Frontend (Vite + React)

From `client/`:

```bash
npm run dev
```

By default Vite runs on `http://localhost:5173` and proxies `/api` to `http://localhost:3001`, so the client can call the backend without additional config.

### Running via Docker Compose

From the repository root:

```bash
docker compose up --build
```

This will:

- Start a PostgreSQL 16-alpine container with the `tyk_registration` DB and apply migrations automatically from `server/internal/db/migrations`
- Build and run the Go Fiber server image (`server/Dockerfile`)

The API will be available on `http://localhost:3001`.

> Note: The PostgreSQL port is only exposed inside the Docker network by default. Uncomment the `ports` block in `docker-compose.yml` if you need direct host access.

---

## Testing

### Backend

From `server/`:

```bash
# Run all tests
go test ./tests/...

# Run only unit tests (no database needed)
go test ./tests/internal/utils ./tests/internal/validator -v

# Run integration tests (requires DATABASE_URL in .env)
go test ./tests/internal/integration -v
```

**Test Coverage:**

- **Unit Tests**: Essential utility and validation functions (no database needed)

  - Password hashing functions (`tests/internal/utils/hash_test.go`)
  - Email, phone, password, and domain validation (`tests/internal/validator/fields_test.go`)

- **Integration Tests**: Real API endpoints using the actual router and database (`tests/internal/integration/api_test.go`)
  - Health and ready endpoints
  - User registration (success and error cases)
  - Username availability checking
  - All tests use real database and clean up after completion

All integration tests:

- Use the real API router
- Connect to the database using `DATABASE_URL` from `.env`
- Clean the database before and after each test
- Test the complete request/response flow

### Frontend

From `client/`:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**

- **Unit Tests**: Validation schemas, utility functions, API functions
- **Integration Tests**: Full registration flow, data persistence between steps

**Key flows to verify manually:**

- Happy-path registration: all fields valid, unique email/username, UK and non-UK countries
- Validation errors on each step (missing required fields, weak password, mismatched passwords)
- UK email/domain rule enforced in both frontend and backend
- Username already taken: async field shows proper message and prevents progression
- Terms not accepted: cannot continue / receive clear validation errors

---

## Repository Structure

- `client/` – React SPA with multi-step registration flow and TyK-themed UI
- `server/` – Go Fiber backend, PostgreSQL integration, validation middleware chain
- `TyK_Full_Stack_Engineer_Task.md` – Original assignment

Key server packages (under `server/internal`):

- `config/` – Environment configuration (`SERVER_PORT`, `DATABASE_URL`)
- `db/` – `migrations/`, `queries/`, `sqlc/` (generated), `db.go` (pool & ping)
- `models/` – Request/response DTOs (e.g. `RegistrationRequest`)
- `validator/` – Pure validation helpers (email, password strength, UK email rule)
- `middleware/` – Logging, JSON parsing, and validator chain middlewares
- `repositories/` – Database access via sqlc (`UserRepository`)
- `services/` – Business logic (`UserService`, password hashing, ID generation)
- `handlers/` – HTTP handlers for `/api/register` and `/api/username-availability`
- `router/` – Fiber app wiring, health/readiness, static assets, middleware
- `response/` – Structured success/error JSON helpers
- `utils/` – `hash.go` (bcrypt), `time.go` (UTC helpers)

---

## Assumptions & Notes

- **Passwords are write-only**: Stored as bcrypt hashes and never logged or returned in responses
- **Email verification and authentication/login flows are out of scope**: The focus is registration only
- **The UK email rule is implemented both client-side and server-side**: For better UX and data integrity
- **sqlc-generated code is not committed**: Instead, `sqlc.yaml` + queries are provided and `sqlc generate` is documented in the setup steps
- **Database migrations run automatically**: Using `golang-migrate` on server startup
- **Frontend and backend can run separately in development**: Frontend on Vite dev server (port 5173), backend on port 3001
- **In production, backend serves frontend static assets**: Built frontend is served from `client/dist`
- **Phone number is optional**: But if provided, must be unique and in valid format
- **Country/email domain validation**: Only enforced for UK/United Kingdom (bonus feature)
- **Progress indicator navigation**: Users can only navigate to completed steps or the next step (no skipping ahead)

---

## Time Expectation

This assignment took approximately **4–6 hours** to complete.

---

## Submission Instructions

1. ✅ Complete implementation in GitHub repository
2. ✅ All code is committed and pushed
3. ✅ Comprehensive `README.md` with setup instructions, architectural overview, and assumptions

---

## Notes

- Focus on demonstrating **best practices** and **coding standards**
- Additional libraries used as necessary (React Hook Form, Zod, TailwindCSS, sqlc, etc.)
- Significant assumptions are **documented in the README**
