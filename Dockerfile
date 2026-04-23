# ------------------------------------------------------------
# Dockerfile – builds a single image that serves both the backend API
# and the React frontend (built at build time).
# ------------------------------------------------------------

# ---------- Build stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy the whole source tree
COPY . .

# ---- Build the React frontend ----
WORKDIR /app/frontend
RUN npm install && npm run build

# ---- Install backend dependencies and copy frontend build ----
WORKDIR /app/backend
RUN npm install --omit=dev
RUN mkdir -p public && cp -R /app/frontend/build/* public/

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy the backend (with the embedded static assets) from the builder
COPY --from=builder /app/backend .

# Expose the port the backend listens on (default 5000). Railway will map it automatically.
EXPOSE 5000

# Ensure a production Node environment (Railway can override via env var if needed)
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "server.js"]
