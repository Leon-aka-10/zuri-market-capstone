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

# ---------------------------------------------------------------- argocd
echo "Installing ArgoCD..."
kubectl get namespace argocd >/dev/null 2>&1 || kubectl create namespace argocd
# server-side apply: the ApplicationSet CRD is too large for client-side apply
kubectl apply --server-side --force-conflicts -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.6.0/manifests/install.yaml
# trim for a small node: these components are not used here
kubectl -n argocd scale deployment argocd-dex-server argocd-notifications-controller argocd-applicationset-controller --replicas=0 || true
kubectl wait --for condition=established --timeout=120s crd/applications.argoproj.io
kubectl -n argocd rollout status deployment/argocd-server --timeout=300s
kubectl -n argocd rollout status deployment/argocd-repo-server --timeout=300s
kubectl -n argocd rollout status statefulset/argocd-application-controller --timeout=300s
kubectl apply -f argocd/

echo "Waiting for ArgoCD to sync the applications (up to 10 min)..."
for _ in $(seq 1 60); do
  st=$(kubectl -n argocd get applications.argoproj.io \
        -o jsonpath='{range .items[*]}{.metadata.name}={.status.sync.status}/{.status.health.status} {end}' 2>/dev/null || true)
  echo "$st"
  case "$st" in *OutOfSync*|*Progressing*|*Missing*|*Degraded*|"") sleep 10 ;; *) break ;; esac
done
kubectl -n zuri-market rollout status deployment/backend --timeout=300s
kubectl -n zuri-market rollout status deployment/frontend --timeout=300s
kubectl -n zuri-market get pods

# ------------------------------------------------------------- monitoring
echo "Installing or upgrading the monitoring stack..."
kubectl get namespace monitoring >/dev/null 2>&1 || kubectl create namespace monitoring
kubectl -n monitoring get secret grafana-admin >/dev/null 2>&1 || \
  kubectl -n monitoring create secret generic grafana-admin \
    --from-literal=admin-user=admin \
    --from-literal=admin-password="$(openssl rand -hex 16)"

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts >/dev/null 2>&1 || true
helm repo update >/dev/null
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring -f monitoring/values.yaml --wait --timeout 10m

# CRDs exist now, so the ServiceMonitor can be applied
kubectl apply -f monitoring/servicemonitor-backend.yaml

# Dashboard as code: the Grafana sidecar loads ConfigMaps labelled grafana_dashboard=1
kubectl -n monitoring create configmap zuri-dashboard \
  --from-file=monitoring/dashboards/zuri-overview.json --dry-run=client -o yaml \
  | kubectl label --local -f - grafana_dashboard=1 -o yaml \
  | kubectl apply -f -
kubectl -n monitoring get pods
