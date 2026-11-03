FROM node:22-alpine

# Patch Alpine OS packages
RUN apk upgrade --no-cache

# Install updated npm and clean cache
RUN npm install --global --ignore-scripts npm@latest \
    && npm cache clean --force

ENV NODE_ENV=production

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy application source
COPY . .

# Run as non-root user
USER node

EXPOSE 5000

CMD ["node", "server.js"]