#!/usr/bin/env bash
# Runs ON the node (through SSM). Safe on a fresh node and on every deploy.
set -euo pipefail
ENV_NAME="${1:?usage: deploy-on-node.sh <dev|prod>}"
export HOME=/root
export PATH="$PATH:/usr/local/bin"
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-us-east-1}"
cd "$(dirname "$0")/.."

echo "Waiting for k3s to be ready (up to 15 min on a fresh node)..."
for _ in $(seq 1 90); do
  if command -v kubectl >/dev/null 2>&1 && kubectl get nodes 2>/dev/null | grep -qw Ready; then break; fi
  sleep 10
done
kubectl get nodes | grep -qw Ready

kubectl apply -f k8s/namespace.yaml -f k8s/rbac.yaml
./scripts/sync-secrets.sh "$ENV_NAME"
kubectl apply -f k8s/backend/ -f k8s/frontend/ -f k8s/ingress.yaml
kubectl -n zuri-market rollout status deployment/backend --timeout=300s
kubectl -n zuri-market rollout status deployment/frontend --timeout=300s
kubectl -n zuri-market get pods
