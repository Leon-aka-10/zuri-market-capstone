FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite bakes VITE_* in at build time, so they are build args, not runtime variables.
ARG VITE_API_URL=
ARG VITE_STORE_NAME="Zuri Market"
ENV VITE_API_URL=$VITE_API_URL VITE_STORE_NAME=$VITE_STORE_NAME
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
