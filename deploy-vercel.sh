#!/bin/bash
# Script para criar projeto na Vercel e fazer deploy

set -e

echo "🚀 === Deploy na Vercel - Projeto nGRCOT ==="
echo ""

cd "$(dirname "$0")/frontend"

# Verificar se está autenticado
if ! vercel whoami &>/dev/null; then
    echo "⚠️  Não autenticado na Vercel"
    echo "📝 Execute: vercel login"
    echo "   Depois execute este script novamente"
    exit 1
fi

echo "✅ Autenticado na Vercel"
echo ""

# Configurar variáveis de ambiente
echo "📝 Configurando variáveis de ambiente..."

# Criar projeto ou linkar
if [ ! -f .vercel/project.json ]; then
    echo "🔗 Criando/linkando projeto..."
    vercel link --yes --name ngrcot --scope $(vercel teams ls 2>/dev/null | head -1 | awk '{print $1}' || echo "")
else
    echo "✅ Projeto já linkado"
fi

# Adicionar variáveis de ambiente
echo "🔐 Configurando variáveis de ambiente do Supabase..."

vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://bingfdowmvyfeffieujk.supabase.co" 2>/dev/null || echo "Variável já existe"
vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "https://bingfdowmvyfeffieujk.supabase.co" 2>/dev/null || echo "Variável já existe"
vercel env add NEXT_PUBLIC_SUPABASE_URL development <<< "https://bingfdowmvyfeffieujk.supabase.co" 2>/dev/null || echo "Variável já existe"

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s" 2>/dev/null || echo "Variável já existe"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s" 2>/dev/null || echo "Variável já existe"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s" 2>/dev/null || echo "Variável já existe"

echo ""
echo "🚀 Fazendo deploy..."
vercel --prod --name ngrcot --yes

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse o projeto em: https://ngrcot.vercel.app"
echo "   (ou verifique a URL retornada pelo comando acima)"

