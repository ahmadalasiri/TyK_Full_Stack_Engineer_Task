# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Output stage - just copy the dist folder
# This will be used by the backend Dockerfile
FROM scratch AS export
COPY --from=builder /build/dist /dist

