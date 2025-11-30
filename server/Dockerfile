# Frontend build stage
FROM node:20-alpine AS frontend-builder

WORKDIR /build/client

# Copy client package files
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy client source
COPY client/ ./

# Build frontend
RUN npm run build

# Backend build stage
FROM golang:1.24-alpine AS backend-builder

# Install build dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /build

# Copy go mod files
COPY server/go.mod server/go.sum ./
RUN go mod download

# Copy server source code
COPY server/ ./

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/server ./cmd/api

# Runtime stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Create the directory structure to match what the code expects
# The router.go uses ../client/dist, which from server/ means ../client/dist
# So structure should be:
# /app/server/ (contains the server)
# /app/client/dist/ (contains the frontend)
# We'll run the binary from /app/server/bin/

# Copy the binary
COPY --from=backend-builder /app/server ./server/bin/

# Copy migrations (they are embedded, but keeping for reference)
COPY --from=backend-builder /build/internal/db/migrations ./server/internal/db/migrations

# Copy frontend build - this goes to /app/client/dist
# From /app/server/, ../client/dist resolves to /app/client/dist
COPY --from=frontend-builder /build/client/dist ./client/dist

# Expose port
EXPOSE 8080

# Set environment variables
ENV SERVER_PORT=8080

# Change to server directory to match the expected working directory
# The binary will be at ./bin/server relative to this directory
WORKDIR /app/server

# Run migrations and start server
# Note: Migrations are run in main.go, so we just start the server
# From /app/server, ../client/dist correctly resolves to /app/client/dist
CMD ["./bin/server"]

