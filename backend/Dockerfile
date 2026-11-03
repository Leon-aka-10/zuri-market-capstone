# Stage 1: Install production dependencies
FROM node:22-alpine AS build

RUN apk upgrade --no-cache

ENV NODE_ENV=production

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install only production dependencies
# Disable dependency lifecycle scripts for security
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# Copy application source
COPY . .


# Stage 2: Production runtime
FROM node:22-alpine AS runtime

# Patch OS packages and remove npm from the runtime image
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

ENV NODE_ENV=production

WORKDIR /app

# Copy application and production dependencies
COPY --from=build --chown=node:node /app /app

# Run as non-root user
USER node

EXPOSE 5000

CMD ["node", "server.js"]
