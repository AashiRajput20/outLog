# ------------------------------------------------------------
# Dockerfile – builds a single image that serves both the backend API
# and the React frontend (built at build time). This is the file
# Railway will use on the free tier.
# ------------------------------------------------------------

# ---------- Build stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install backend dependencies (production only) – this speeds up later stages
COPY package*.json ./
RUN npm ci --only=production

# Copy the whole source tree
COPY . .

# ---- Build the React frontend ----
# The frontend lives in ./frontend and produces static files in ./frontend/build
WORKDIR /app/frontend
RUN npm ci && npm run build

# Move the built static files into the backend's public directory
# Adjust the target path if your backend serves static files from a different folder.
WORKDIR /app/backend
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

# Start the backend server – replace "index.js" with your actual entry point if different.
CMD ["node", "index.js"]
