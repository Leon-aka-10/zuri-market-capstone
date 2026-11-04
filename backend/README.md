# Zuri Market backend

Express API for the Zuri Market storefront. Starter code from `Test-class2026/zuriapp-backend`, extended with the platform hooks the pipeline needs (health endpoint, Prometheus metrics, lint and smoke tests). No product features were added.

## Configuration

| Variable | Secret | Purpose |
|---|---|---|
| `PORT` | no | Listen port, default `5000` |
| `API_SECRET_KEY` | **yes** | Required in the `x-api-key` header for protected routes |
| `STORE_NAME` | no | Store name returned by `/api/store` |

Locally: `cp .env.example .env` (git-ignored; the example holds fake values only). In the cluster, `PORT` and `STORE_NAME` come from the `backend-config` ConfigMap and `API_SECRET_KEY` from the `backend-secrets` Secret, which is synced from AWS Secrets Manager (`zuri/<env>/backend`). The key never lives in Git.

## API

| Route | Auth | Notes |
|---|---|---|
| `GET /api/store` | none | Store details |
| `GET /api/products` | none | Product list |
| `GET /api/products/:id` | none | One product |
| `POST /api/cart/validate` | `x-api-key` | Returns 401 without the key |
| `GET /api/health` | none | `{"status":"ok"}`, used by Kubernetes probes and Compose |
| `GET /metrics` | none | Prometheus metrics. Deliberately outside `/api`, so the Ingress never exposes it |

## Run

```bash
cp .env.example .env
npm ci
npm start          # http://localhost:5000
```

## Scripts

| Script | What it does |
|---|---|
| `npm start` | `node server.js` |
| `npm run dev` | `nodemon server.js` |
| `npm run lint` | ESLint (flat config, `eslint.config.js`) |
| `npm test` | Node's built-in test runner: health, 401 without key, metrics |

CI runs `npm ci`, lint, tests and `npm audit --omit=dev --audit-level=high` on every push and pull request.

## Metrics

`http_request_duration_seconds` (histogram, labels `method`, `route`, `status_code`) plus the default Node process metrics. Request rate, error rate and p95 latency on the Grafana dashboard are all derived from this one histogram.

## Container image

`node:22-alpine`, `npm ci --omit=dev`, runs as the non-root `node` user, `CMD ["node","server.js"]` so the process receives shutdown signals directly during rolling updates.

```bash
docker build -t zuri-backend:local .
docker run --rm -p 5000:5000 -e API_SECRET_KEY=local-dev-key zuri-backend:local
```

Published to `ghcr.io/leon-aka-10/zuri-market-capstone-backend` with the tag `sha-<7 chars of the commit>`. Manifests use only that tag, never `latest`.

## Kubernetes

2 replicas, rolling update with `maxUnavailable: 0`, readiness and liveness probes on `/api/health`, resource requests and limits, `runAsNonRoot`, read-only root filesystem, all capabilities dropped, and no service-account token mounted. Manifests are in `../k8s/backend/`.
