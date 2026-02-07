# Multi-stage Bun build — keeps the final image small by only copying
# production dependencies and source into a slim runtime image.

# Stage 1: Install dependencies in a full image (includes build tooling)
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy lockfile and manifest first for layer caching — deps only
# re-install when these files change.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 2: Slim runtime image — no build tools, smaller attack surface
FROM oven/bun:slim

# Install curl for the healthcheck
RUN apt-get update -y && apt-get install -y curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Run as non-root for security (mirrors source repo pattern)
RUN chown nobody /app
USER nobody

# Copy production node_modules from builder
COPY --from=builder --chown=nobody:root /app/node_modules ./node_modules

# Copy application source and metadata
COPY --chown=nobody:root package.json ./
COPY --chown=nobody:root version.txt ./
COPY --chown=nobody:root src ./src
COPY --chown=nobody:root public ./public

EXPOSE 3000

# Healthcheck mirrors source repo — ensures container is serving traffic
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["bun", "run", "src/index.ts"]
