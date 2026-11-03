FROM node:22-alpine AS build

# Patch Alpine packages in the build stage
RUN apk upgrade --no-cache

# Update npm and its bundled dependencies
RUN npm install --global npm@latest

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* values in at build time
ARG VITE_API_URL=
ARG VITE_STORE_NAME="Zuri Market"

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STORE_NAME=$VITE_STORE_NAME

RUN npm run build


FROM nginxinc/nginx-unprivileged:stable-alpine

# The unprivileged Nginx image normally runs as nginx.
# Temporarily switch to root to patch Alpine packages.
USER root
RUN apk upgrade --no-cache

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Restore the unprivileged runtime user
USER nginx

EXPOSE 8080
