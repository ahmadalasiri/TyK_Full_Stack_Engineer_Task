# TyK User Registration System

🌐 **Live Demo:** [https://api.adam.ahmadalasiri.info/](https://api.adam.ahmadalasiri.info/)

A full-stack multi-step user registration application built with React and Go. This monorepo implements a complete registration flow with real-time validation, progress tracking, and a robust backend API.

## 🚀 Features

- **Multi-step Registration Form** - Collects user data across 3 steps plus review
- **Real-time Validation** - Client and server-side validation with immediate feedback
- **Progress Tracking** - Visual progress indicator with step navigation
- **Username Availability Check** - Debounced async validation
- **Middleware Chain Validation** - Extensible validation system on the backend
- **PostgreSQL Integration** - Type-safe queries with sqlc
- **Docker Support** - One-command deployment with Docker Compose

## 📋 Prerequisites

- **Node.js** (LTS) and npm
- **Go** 1.24+
- **PostgreSQL** 14+
- **sqlc**
- **Docker & Docker Compose** (optional)

## 🏃 Quick Start

### Option 1: 🐳 Docker Compose (Recommended)

```bash
docker compose up --build
```

The application will be available at `http://localhost:3001`.

### Option 2: Local Development

```bash
# 1. Install dependencies
cd client && npm install
cd ../server && go mod download

# 2. Setup database
createdb tyk_registration
cd server && sqlc generate

# 3. Configure environment
# Create server/.env with:
# SERVER_PORT=3001
# DATABASE_URL=postgres://postgres:password@localhost:5432/tyk_registration

# 4. Run backend (terminal 1)
cd server
export SERVER_PORT=3001
export DATABASE_URL=postgres://postgres:password@localhost:5432/tyk_registration
go run ./cmd/api

# 5. Run frontend (terminal 2)
cd client
npm run dev
```

Frontend: `http://localhost:5173` | Backend: `http://localhost:3001`

## 🧪 Testing

```bash
# Backend tests
cd server && go test ./tests/...

# Frontend tests
cd client && npm test
```

## 🏗️ Architecture

### Frontend

- **React 19** with Vite for fast development
- **React Hook Form + Zod** for form management and validation
- **TailwindCSS** for styling
- **React Context** for state management
- **Axios** for API communication

### Backend

- **Go Fiber** web framework
- **PostgreSQL** database with **sqlc** for type-safe queries
- **Middleware Chain** pattern for validation (field-level, cross-field, business logic)
- **bcrypt** for password hashing
- **golang-migrate** for database migrations

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── features/       # Registration flow components
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context for state
│   │   ├── api/           # API client
│   │   └── validation/    # Zod schemas
│   └── package.json
│
├── server/                 # Go backend
│   ├── cmd/api/           # Application entry point
│   ├── internal/
│   │   ├── handlers/      # HTTP handlers
│   │   ├── middleware/    # Validation middleware chain
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database access
│   │   ├── models/        # Data models
│   │   ├── validator/     # Validation helpers
│   │   └── db/            # Database setup & migrations
│   └── go.mod
│
└── docker-compose.yml      # Docker setup
```

## 💡 Technology Choices

### Backend

**Fiber** - Selected over standard `net/http` and other Go frameworks for Express-like API patterns. Excellent middleware support that perfectly fits our validation chain architecture.

**sqlc** - Key choice for type-safe database queries. Generates Go code from SQL, eliminating runtime errors and providing autocomplete. Reduces boilerplate and ensures type safety between database and application code.

**Middleware Chain Pattern** - Architectural decision to implement extensible validation. Allows easy addition/removal of validators without breaking the chain, separating concerns (field-level, cross-field, business logic).

### Frontend

**Vite** - Chose over Create React App for significantly faster builds and instant HMR. Provides better developer experience with modern tooling.

**React Hook Form + Zod** - Selected for optimal form performance with minimal re-renders. Zod provides runtime validation and type safety, ensuring data consistency between frontend and backend.

**TailwindCSS** - Utility-first approach enables rapid UI development with consistent design system. Faster than writing custom CSS and easier to maintain.

**React Context** - Chose over Redux for this application's scope. Lightweight solution that avoids unnecessary complexity while providing clean state management across the registration flow.

## 🔌 API Endpoints

- `POST /api/register` - Register a new user
- `GET /api/username-availability?username=...` - Check username availability
- `GET /health` - Health check
- `GET /ready` - Readiness check (database connectivity)

## 🔧 Development

### Backend Auto-reload

Install [Air](https://github.com/cosmtrek/air) for automatic rebuilds:

```bash
go install github.com/cosmtrek/air@latest
cd server && air
```

### Database Migrations

Migrations run automatically on server startup.

### Generate sqlc Code

After modifying SQL queries:

```bash
cd server && sqlc generate
```

## 🚀 Deployment

### Infrastructure

- **VPS Provider:** Contabo
- **Web Server:** Nginx (reverse proxy)
- **SSL/TLS:** Let's Encrypt (certbot)
- **Containerization:** Docker Compose
- **Domain Management:** Cloudflare
- **Domain:** api.adam.ahmadalasiri.info (Got a bit lazy to create a new subdomain 🙂)

## 🚀 Future Enhancements

- **Frontend Email Domain Validation** - Add client-side validation for email domain matching (e.g., UK email domain check)
- **Enhanced Dropdown UI** - Improve country/state dropdown with better visual design
- **Increased Test Coverage** - Expand unit and integration test coverage for better reliability
- **E2E Testing** - Add end-to-end tests using tools like Playwright or Cypress
- **TypeScript Migration** - Migrate frontend from JavaScript to TypeScript for better type safety and developer experience

## 📚 Documentation

For detailed requirements and specifications, see [`TyK_Full_Stack_Engineer_Task.md`](./TyK_Full_Stack_Engineer_Task.md).

## 🛠️ Tech Stack

**Frontend:** React 19 • Vite • TailwindCSS • React Hook Form • Zod • Axios

**Backend:** Go 1.24+ • Fiber • PostgreSQL • sqlc • bcrypt • golang-migrate

**DevOps:** Docker • Docker Compose
