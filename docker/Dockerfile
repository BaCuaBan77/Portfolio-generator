FROM node:20.19.4-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy only dependency files first (better layer caching)
COPY package.json package-lock.json* ./

# Install dependencies with npm ci (clean install)
# This layer will be cached unless package files change
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Install dev dependencies in separate layer
FROM base AS deps-dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from previous stages
COPY --from=deps-dev /app/node_modules ./node_modules

# Copy only necessary files for build (leverage .dockerignore)
COPY package.json package-lock.json* ./
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
COPY config ./config

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy config directory (will be overridden by volume mount in production)
COPY --from=builder --chown=nextjs:nodejs /app/config ./config

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", ".next/standalone/server.js"]

