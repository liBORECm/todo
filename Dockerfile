# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Install backend deps
COPY package*.json ./
RUN npm ci

# Install frontend deps
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy source and build (builds frontend + generates swagger + compiles TS)
COPY . .
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

# Install production deps only (ts-node + typescript are production deps — needed for migrations)
COPY package*.json ./
RUN npm ci --omit=dev

# Compiled backend
COPY --from=builder /app/dist ./dist

# Built frontend (served as static files by Express)
COPY --from=builder /app/frontend/dist ./frontend/dist

# Migration files (TypeScript, executed via ts-node at startup)
COPY knexfile.ts ./
COPY db/migrations ./db/migrations

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 5533

ENTRYPOINT ["./docker-entrypoint.sh"]
