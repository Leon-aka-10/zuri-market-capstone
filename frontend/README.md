# Zuri Market frontend

React + Vite storefront. Starter code from `Test-class2026/zuriapp-frontend`.

## Configuration (build time)

Vite reads `VITE_*` variables when the app is **built**, so they cannot be changed later with a Kubernetes ConfigMap. In Docker they are build arguments.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL for API calls. **Empty means same origin** (`/api/...`), which is what Compose (nginx) and Kubernetes (Ingress) use |
| `VITE_STORE_NAME` | Store name shown in the header |

`src/App.jsx` falls back to `http://localhost:5000` only when `VITE_API_URL` is *undefined*. It uses `??` and not `||`, so an empty value is respected. With `||` an empty build argument silently baked `localhost:5000` into the production bundle.

## Run locally

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:5000 for local development
npm ci
npm run dev              # http://localhost:3000 (start the backend first)
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built app locally |
| `npm run lint` | ESLint over `src/` (flat config with `eslint-plugin-react`) |

**Test gate:** the app has no test suite, so a successful `npm run build` is the test. CI runs lint, `npm test --if-present` and the build before any image is made.

ESLint is pinned to major version 9 because `eslint-plugin-react` does not support ESLint 10 yet.

## Container image

Multi-stage build: Node 22 builds the static files, `nginxinc/nginx-unprivileged` serves them on port 8080 (non-root). The final image has no Node, no source and no build tooling.

```bash
docker build -t zuri-frontend:local --build-arg VITE_API_URL= .
```

`nginx.conf` forwards `/api/` to `http://backend:5000`, which only resolves inside Docker Compose. In Kubernetes the Ingress splits `/api` and `/` itself, and the `frontend-nginx` ConfigMap mounts a config without the proxy block. Run the image on its own and nginx exits with `host not found in upstream "backend"`.

Published to `ghcr.io/leon-aka-10/zuri-market-capstone-frontend` with the tag `sha-<7 chars of the commit>`.

## Kubernetes

2 replicas behind the `frontend` Service (port 80 to container port 8080), probes on `/`, resource limits, capabilities dropped. Manifests are in `../k8s/frontend/`.
