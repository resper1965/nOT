#!/bin/bash
# Script de migração para Supabase - ness. OT GRC
# Exporta schema do PostgreSQL local para importar no Supabase

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Migração para Supabase - ness. OT GRC${NC}"
echo ""

# Variáveis
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5434}"
DB_USER="${DB_USER:-ness_admin}"
DB_NAME="${DB_NAME:-ness_ot_grc}"
OUTPUT_DIR="${OUTPUT_DIR:-./migration}"

# Criar diretório de output
mkdir -p "$OUTPUT_DIR"

echo -e "${YELLOW}📊 Passo 1: Exportando schema...${NC}"

# Exportar schema completo (sem dados)
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file="$OUTPUT_DIR/schema.sql" 2>/dev/null || {
    echo "❌ Erro ao exportar schema. Verifique se PostgreSQL está rodando e acessível."
    exit 1
  }

echo -e "${GREEN}✅ Schema exportado: $OUTPUT_DIR/schema.sql${NC}"

# Exportar apenas estrutura (sem constraints complexas)
echo -e "${YELLOW}📊 Passo 2: Criando versão simplificada do schema...${NC}"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-tablespaces \
  --file="$OUTPUT_DIR/schema-simple.sql" 2>/dev/null

echo -e "${GREEN}✅ Schema simplificado criado: $OUTPUT_DIR/schema-simple.sql${NC}"

# Exportar dados (opcional)
read -p "Deseja exportar dados também? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}📊 Passo 3: Exportando dados...${NC}"
    
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
      --data-only \
      --no-owner \
      --no-privileges \
      --file="$OUTPUT_DIR/data.sql" 2>/dev/null || {
        echo "⚠️  Aviso: Não foi possível exportar dados."
      }
    
    echo -e "${GREEN}✅ Dados exportados: $OUTPUT_DIR/data.sql${NC}"
fi

echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo ""
echo "1. Acesse o Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql"
echo ""
echo "2. Execute o arquivo: $OUTPUT_DIR/schema.sql"
echo ""
echo "3. Verifique os schemas criados"
echo ""
echo "4. Configure Row Level Security (RLS) se necessário"
echo ""
echo -e "${GREEN}✅ Migração preparada com sucesso!${NC}"

