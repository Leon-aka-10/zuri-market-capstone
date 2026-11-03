FROM node:22-alpine

# Patch Alpine OS packages
RUN apk upgrade --no-cache

# Install a pinned npm version without lifecycle scripts
RUN npm install --global --ignore-scripts npm@11.6.2

# Application environment
ENV NODE_ENV=production

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies without lifecycle scripts
RUN npm ci --omit=dev --ignore-scripts

# Copy application source
COPY . .

# Run as non-root user
USER node

EXPOSE 5000

CMD ["node", "server.js"]

