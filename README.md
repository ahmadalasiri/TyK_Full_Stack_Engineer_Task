## TyK Full Stack Engineer Task

This repository implements the TyK multi-step user registration assignment as a full monorepo:

- `client`: React + Vite + TailwindCSS, React Hook Form + Zod, Axios, React Context.
- `server`: Go (Fiber), PostgreSQL, sqlc, bcrypt, google/uuid, middleware-chain validation.

The backend can serve the built frontend for production, or you can run both separately in development. A Docker Compose setup is also provided.

---

## Repository Structure

- `client/` – React SPA with multi-step registration flow and TyK-themed UI.
- `server/` – Go Fiber backend, PostgreSQL integration, validation middleware chain.
- `TyK_Full_Stack_Engineer_Task.md` – Original assignment.

Key server packages (under `server/internal`):

- `config/` – Environment configuration (`SERVER_PORT`, `DATABASE_URL`).
- `db/` – `migrations/`, `queries/`, `sqlc/` (generated), `db.go` (pool & ping).
- `models/` – Request/response DTOs (e.g. `RegistrationRequest`).
- `validator/` – Pure validation helpers (email, password strength, UK email rule).
- `middleware/` – Logging, JSON parsing, and validator chain middlewares.
- `repositories/` – Database access via sqlc (`UserRepository`).
- `services/` – Business logic (`UserService`, password hashing, ID generation).
- `handlers/` – HTTP handlers for `/api/register` and `/api/username-availability`.
- `router/` – Fiber app wiring, health/readiness, static assets, middleware.
- `response/` – Structured success/error JSON helpers.
- `utils/` – `hash.go` (bcrypt), `time.go` (UTC helpers).

---

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Hook Form, Zod, Axios, React Context.
- **Backend**: Go, Fiber, PostgreSQL, sqlc, google/uuid, bcrypt.
- **Validation**: Middleware-chain pattern with field-level, cross-field, and business validations.
- **Containerization**: Dockerfile for the server, `docker-compose.yml` for server + PostgreSQL.

---

## Setup & Installation

### Prerequisites

- Node.js (LTS) and npm.
- Go 1.24+.
- PostgreSQL 14+.
- `sqlc` installed (`go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest` or package manager).
- Docker & Docker Compose (optional, for containerized run).

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

Create the database and user (example):

```bash
createdb tyk_registration
psql -d tyk_registration -c "CREATE USER tyk_user WITH PASSWORD 'tyk_password';"
psql -d tyk_registration -c "GRANT ALL PRIVILEGES ON DATABASE tyk_registration TO tyk_user;"
```

Apply migrations:

```bash
psql -d tyk_registration -f internal/db/migrations/001_create_users.sql
```

Generate sqlc code:

```bash
cd server
sqlc generate
```

Configure environment (either via real env vars or a local `.env` that you load in your shell):

- `SERVER_PORT=8080`
- `DATABASE_URL=postgres://tyk_user:tyk_password@localhost:5432/tyk_registration?sslmode=disable`

---

## Running the Application (Local Dev)

### Backend (Go + Fiber)

From `server/`:

```bash
export SERVER_PORT=8080
export DATABASE_URL=postgres://tyk_user:tyk_password@localhost:5432/tyk_registration?sslmode=disable
go run ./cmd/api
```

The API will listen on `http://localhost:8080`.

### Frontend (Vite + React)

From `client/`:

```bash
npm run dev
```

By default Vite runs on `http://localhost:5173` and proxies `/api` to `http://localhost:8080`, so the client can call the backend without additional config.

---

## Running via Docker Compose

From the repository root:

```bash
docker compose up --build
```

This will:

- Start a PostgreSQL 16-alpine container with the `tyk_registration` DB and apply migrations automatically from `server/internal/db/migrations`.
- Build and run the Go Fiber server image (`server/Dockerfile`).

The API will be available on `http://localhost:8080`.

> Note: The PostgreSQL port is only exposed inside the Docker network by default. Uncomment the `ports` block in `docker-compose.yml` if you need direct host access.

---

## Frontend Features & UX

- **Multi-step form (3 steps + review)**:

  - Step 1: Personal Information (first name, last name, email, optional phone).
  - Step 2: Address Details (street, city, state/province, country).
  - Step 3: Account Setup (username, password, confirm password, terms checkbox, optional newsletter).
  - Review screen: shows all data and allows editing sections by jumping back to earlier steps.

- **Validation & Navigation**:

  - Real-time validation via React Hook Form + Zod per step.
  - Next buttons disabled when the current step is invalid.
  - Progress indicator shows current step and allows navigation only up to the highest completed step (no skipping ahead).
  - Data is persisted between steps using a React Context store.

- **Async Username Check & Submission**:
  - Username field performs a debounced availability check against `/api/username-availability`.
  - Review step submits the combined payload to `/api/register`, shows loading, success, or structured error feedback, and resets state on success.

---

## Backend API & Validation

### Endpoints

- `POST /api/register`

  - Accepts a single JSON payload representing all steps:
    - `first_name`, `last_name`, `email`, `phone?`
    - `street`, `city`, `state`, `country`
    - `username`, `password`, `confirm_password`
    - `terms_accepted`, `newsletter`
  - Responses:
    - `201 Created` + `{ "user_id": "...", "message": "Registration successful" }`.
    - `400/422` + structured error:
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

- `GET /api/username-availability?username=...`

  - Returns `{ "username": "foo", "available": true|false }`.

- `GET /health`

  - Simple `{ "status": "ok" }` for liveness checks.

- `GET /ready`
  - Pings the database; returns `{ "status": "ready" }` or a 503 error JSON if DB is not ready.

### Validation Chain

Validation is implemented as a middleware chain around the registration request:

- `FieldValidator`:

  - Required fields (name, email, address, country, username, password, terms).
  - Email format, optional phone format.
  - Password strength: min 8 chars with uppercase, lowercase, number, special.
  - Username length: min 6 chars.

- `CrossFieldValidator`:

  - Password confirmation match.
  - Country/email domain rule: if country is UK/United Kingdom, email must include `.uk`.

- `BusinessValidator`:
  - Email and username uniqueness using `UserRepository` + sqlc.

These validators are composed and executed via a shared `RegistrationValidator` type and `RunValidationChain`, making it easy to add or remove validators without breaking the routing.

---

## Testing

### Backend

From `server/`:

```bash
go test ./...
```

- Includes table-driven tests for the validator helpers (email, password, UK rule).
- Additional business logic tests can be added around repositories/services with a test DB.

### Frontend (Manual)

Key flows to verify:

- Happy-path registration: all fields valid, unique email/username, UK and non-UK countries.
- Validation errors on each step (missing required fields, weak password, mismatched passwords).
- UK email/domain rule enforced in both frontend and backend.
- Username already taken: async field shows proper message and prevents progression.
- Terms not accepted: cannot continue / receive clear validation errors.

---

## Assumptions & Notes

- Passwords are write-only: stored as bcrypt hashes and never logged.
- Email verification and authentication/login flows are out of scope; the focus is registration only.
- The UK email rule is implemented both client-side and server-side for a better UX and integrity.
- sqlc-generated code is not committed; instead, `sqlc.yaml` + queries are provided and `sqlc generate` is documented in the setup steps.
