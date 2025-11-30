# Frontend build stage
FROM node:20-alpine AS frontend-builder

WORKDIR /build/client

COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Backend build stage
FROM golang:1.24-alpine AS backend-builder

WORKDIR /build

COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
RUN go build -o /app/server ./cmd/api

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Copy binary and frontend (router expects ../client/dist from /app/server)
COPY --from=backend-builder /app/server ./server/bin/
COPY --from=frontend-builder /build/client/dist ./client/dist

EXPOSE 3001

WORKDIR /app/server

# Start server (migrations run automatically in main.go)
CMD ["./bin/server"]

