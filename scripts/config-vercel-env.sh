#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel via CLI
# ness. OT GRC - Configuração Vercel

set -e

echo "🔐 Configurando variáveis de ambiente no Vercel..."
echo ""

# Verificar se está logado
if ! vercel whoami &>/dev/null; then
    echo "❌ Você precisa fazer login no Vercel primeiro!"
    echo ""
    echo "Execute:"
    echo "  vercel login"
    echo ""
    exit 1
fi

echo "✅ Logado no Vercel"
echo ""

# Diretório do projeto
cd "$(dirname "$0")/../frontend" || exit 1

# Variáveis de ambiente
SUPABASE_URL="https://bingfdowmvyfeffieujk.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s"
USE_SUPABASE="true"

# Ambientes
ENVIRONMENTS=("production" "preview" "development")

echo "📦 Configurando variáveis para: ${ENVIRONMENTS[*]}"
echo ""

# Função para adicionar variável
add_env_var() {
    local var_name=$1
    local var_value=$2
    local envs=("${@:3}")
    
    echo "🔧 Configurando: $var_name"
    
    for env in "${envs[@]}"; do
        echo "  → $env..."
        # Verificar se variável já existe
        if vercel env ls 2>/dev/null | grep -q "^$var_name.*$env"; then
            echo "    ⚠️  Variável já existe, removendo..."
            echo "y" | vercel env rm "$var_name" "$env" 2>&1 || true
        fi
        # Adicionar variável
        echo "$var_value" | vercel env add "$var_name" "$env" 2>&1 || {
            echo "    ❌ Erro ao adicionar variável para $env"
        }
    done
    echo "  ✅ Concluído"
    echo ""
}

# Configurar variáveis
echo "🚀 Iniciando configuração..."
echo ""

add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL" "${ENVIRONMENTS[@]}"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY" "${ENVIRONMENTS[@]}"
add_env_var "NEXT_PUBLIC_USE_SUPABASE" "$USE_SUPABASE" "${ENVIRONMENTS[@]}"

echo "✅ Variáveis configuradas com sucesso!"
echo ""
echo "📋 Verificar variáveis:"
echo "   vercel env ls"
echo ""
echo "🔗 Dashboard:"
echo "   https://vercel.com/nessbr-projects/frontend/settings/environment-variables"
echo ""

