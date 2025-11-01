#!/bin/bash

# Script para migrar schema do PostgreSQL local para Supabase
# ness. OT GRC - Migração Supabase

set -e

echo "🔄 Iniciando migração de schema para Supabase..."
echo ""

# Verificar se Docker está rodando
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se container do banco existe
CONTAINER_NAME="ness-ot-grc-db"
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container ${CONTAINER_NAME} não encontrado."
    echo "💡 Execute: docker-compose up -d"
    exit 1
fi

echo "✅ Docker e container verificados"
echo ""

# Diretório de saída
OUTPUT_DIR="migration"
mkdir -p "$OUTPUT_DIR"

echo "📤 Exportando schema do PostgreSQL local..."

# Exportar schema completo
docker exec "${CONTAINER_NAME}" pg_dump -U ness_admin -d ness_ot_grc \
  --schema-only \
  --no-owner \
  --no-privileges \
  > "${OUTPUT_DIR}/schema-complete.sql"

if [ $? -eq 0 ]; then
    echo "✅ Schema completo exportado: ${OUTPUT_DIR}/schema-complete.sql"
else
    echo "❌ Erro ao exportar schema"
    exit 1
fi

# Exportar apenas estrutura (schemas e tabelas)
echo "📤 Exportando estrutura de schemas..."

docker exec "${CONTAINER_NAME}" pg_dump -U ness_admin -d ness_ot_grc \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-comments \
  > "${OUTPUT_DIR}/schema-structure.sql"

echo "✅ Estrutura exportada: ${OUTPUT_DIR}/schema-structure.sql"
echo ""

# Criar arquivo SQL otimizado para Supabase
echo "🔧 Criando arquivo SQL otimizado para Supabase..."

cat > "${OUTPUT_DIR}/supabase-migration.sql" << 'EOF'
-- ============================================================================
-- Migração de Schema para Supabase - ness. OT GRC
-- ============================================================================
-- Este arquivo contém o schema otimizado para Supabase
-- Data: $(date +%Y-%m-%d)
-- ============================================================================

-- Criar schemas se não existirem
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;

-- Nota: As extensões UUID e crypto já estão disponíveis no Supabase
-- Não é necessário criar extensões manualmente

EOF

# Adicionar conteúdo do schema
cat "${OUTPUT_DIR}/schema-complete.sql" >> "${OUTPUT_DIR}/supabase-migration.sql"

# Adicionar configuração de RLS
cat >> "${OUTPUT_DIR}/supabase-migration.sql" << 'EOF'

-- ============================================================================
-- Configuração de Row Level Security (RLS)
-- ============================================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE compliance.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE topology.vlans ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para compliance.documents
CREATE POLICY "Users can view documents"
ON compliance.documents
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert documents"
ON compliance.documents
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update documents"
ON compliance.documents
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Políticas básicas para security.assets
CREATE POLICY "Users can view assets"
ON security.assets
FOR SELECT
USING (auth.role() = 'authenticated');

-- Políticas básicas para topology.vlans
CREATE POLICY "Users can view vlans"
ON topology.vlans
FOR SELECT
USING (auth.role() = 'authenticated');

-- ============================================================================
-- Migração concluída
-- ============================================================================
EOF

echo "✅ Arquivo otimizado criado: ${OUTPUT_DIR}/supabase-migration.sql"
echo ""

echo "📋 Próximos passos:"
echo "   1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql"
echo "   2. Cole o conteúdo de: ${OUTPUT_DIR}/supabase-migration.sql"
echo "   3. Execute o script SQL"
echo "   4. Verifique a migração com as queries em MIGRATION-GUIDE.md"
echo ""
echo "✅ Migração de schema preparada!"
