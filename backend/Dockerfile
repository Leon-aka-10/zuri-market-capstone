FROM node:22-alpine

# Patch Alpine OS packages
RUN apk upgrade --no-cache

# Update npm and its bundled dependencies
RUN npm install --global npm@latest

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY . .

USER node
EXPOSE 5000
CMD ["node", "server.js"]
