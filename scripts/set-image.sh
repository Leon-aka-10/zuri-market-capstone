#!/usr/bin/env bash
set -euo pipefail
APP="${1:?backend or frontend}"; TAG="${2:?tag such as sha-abc1234}"
sed -i -E "s|(image: ghcr.io/[^:]+-${APP}:).*|\1${TAG}|" "k8s/${APP}/deployment.yaml"
git --no-pager diff --stat
