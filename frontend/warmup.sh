#!/bin/sh
# Warm-up script para pré-compilar rotas do Next.js

echo "🔥 Iniciando warm-up das rotas..."

# Aguardar Next.js iniciar
sleep 5

# Rotas principais para pré-compilar
ROUTES=(
  "/"
  "/dashboard"
  "/dashboard/overview"
  "/dashboard/compliance"
  "/dashboard/network"
  "/dashboard/remediation"
  "/dashboard/product"
  "/dashboard/kanban"
)

for route in "${ROUTES[@]}"; do
  echo "  ⏳ Pré-compilando: $route"
  curl -s http://localhost:3000$route > /dev/null 2>&1 &
done

wait
echo "✅ Warm-up completo! Todas as rotas pré-compiladas."

