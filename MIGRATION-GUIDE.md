# 🔄 Guia de Migração para Supabase - ness. OT GRC

**Data**: 2025-01-27  
**Status**: Guia preparado

---

## 📋 Visão Geral

Este guia descreve como migrar o schema do PostgreSQL local para o Supabase.

---

## 🎯 Pré-requisitos

- ✅ Projeto Supabase criado
- ✅ Credenciais configuradas (URL e Anon Key)
- ✅ Schema local funcionando
- ✅ Acesso ao SQL Editor do Supabase

---

## 📊 Passo 1: Exportar Schema do PostgreSQL Local

### Via pg_dump (Recomendado)

```bash
# Exportar apenas o schema (estrutura)
pg_dump -h localhost -p 5434 -U ness_admin -d ness_ot_grc \
  --schema-only \
  --no-owner \
  --no-privileges \
  > schema.sql

# Ou exportar schema e dados
pg_dump -h localhost -p 5434 -U ness_admin -d ness_ot_grc \
  --no-owner \
  --no-privileges \
  > schema_and_data.sql
```

### Via Docker

```bash
# Exportar schema via container
docker exec ness-ot-grc-db pg_dump -U ness_admin -d ness_ot_grc \
  --schema-only \
  --no-owner \
  --no-privileges \
  > schema.sql
```

---

## 📝 Passo 2: Ajustar Schema para Supabase

### Mudanças Necessárias

1. **Remover extensions não disponíveis**:
   ```sql
   -- Remover se não disponível no Supabase
   -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   -- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   
   -- Supabase já tem estas extensions disponíveis
   ```

2. **Ajustar permissões**:
   ```sql
   -- No Supabase, usar roles do Supabase
   -- Não precisa de GRANT específico (RLS gerencia)
   ```

3. **Ajustar schemas**:
   ```sql
   -- Verificar se schemas precisam ser criados explicitamente
   -- CREATE SCHEMA IF NOT EXISTS security;
   -- CREATE SCHEMA IF NOT EXISTS topology;
   -- CREATE SCHEMA IF NOT EXISTS compliance;
   -- CREATE SCHEMA IF NOT EXISTS audit;
   ```

---

## 🚀 Passo 3: Importar no Supabase

### Via SQL Editor

1. **Acesse o Supabase Dashboard**:
   - https://supabase.com/dashboard/project/bingfdowmvyfeffieujk
   - Vá em **SQL Editor**

2. **Execute o schema**:
   - Cole o conteúdo de `schema.sql`
   - Execute (Ctrl+Enter ou botão Run)

3. **Verifique os schemas**:
   ```sql
   SELECT schema_name 
   FROM information_schema.schemata 
   WHERE schema_name IN ('security', 'topology', 'compliance', 'audit');
   ```

4. **Verifique as tabelas**:
   ```sql
   SELECT schemaname, tablename 
   FROM pg_tables 
   WHERE schemaname IN ('security', 'topology', 'compliance', 'audit')
   ORDER BY schemaname, tablename;
   ```

### Via CLI do Supabase (Opcional)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref bingfdowmvyfeffieujk

# Push schema
supabase db push
```

---

## 🔐 Passo 4: Configurar Row Level Security (RLS)

### Habilitar RLS

```sql
-- Habilitar RLS nas tabelas principais
ALTER TABLE compliance.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE topology.vlans ENABLE ROW LEVEL SECURITY;
```

### Criar Políticas Básicas

```sql
-- Política para permitir usuários autenticados verem seus dados
CREATE POLICY "Users can view documents"
ON compliance.documents
FOR SELECT
USING (auth.role() = 'authenticated');

-- Política para usuários autenticados inserirem documentos
CREATE POLICY "Users can insert documents"
ON compliance.documents
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política para usuários autenticados atualizarem documentos
CREATE POLICY "Users can update documents"
ON compliance.documents
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Repetir para outras tabelas conforme necessário
```

---

## 📦 Passo 5: Migrar Dados (Opcional)

### Exportar Dados

```bash
# Exportar apenas dados
pg_dump -h localhost -p 5434 -U ness_admin -d ness_ot_grc \
  --data-only \
  --no-owner \
  --no-privileges \
  > data.sql
```

### Importar Dados

1. **Via SQL Editor do Supabase**:
   - Execute `data.sql` no SQL Editor

2. **Via CSV (Recomendado para grandes volumes)**:
   ```sql
   -- Exportar para CSV
   COPY (SELECT * FROM security.assets) TO '/tmp/assets.csv' CSV HEADER;
   
   -- Importar no Supabase (via Table Editor ou SQL)
   COPY security.assets FROM '/tmp/assets.csv' CSV HEADER;
   ```

---

## ✅ Passo 6: Verificar Migração

### Checklist de Verificação

- [ ] Schemas criados (security, topology, compliance, audit)
- [ ] Tabelas criadas (40+ tabelas)
- [ ] Views criadas (6 views)
- [ ] Triggers criados (10+ triggers)
- [ ] Índices criados
- [ ] RLS habilitado nas tabelas sensíveis
- [ ] Políticas de segurança criadas
- [ ] Dados migrados (se aplicável)

### Queries de Verificação

```sql
-- Contar tabelas por schema
SELECT schemaname, COUNT(*) as table_count
FROM pg_tables
WHERE schemaname IN ('security', 'topology', 'compliance', 'audit')
GROUP BY schemaname;

-- Verificar estrutura de uma tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'security' 
  AND table_name = 'assets'
ORDER BY ordinal_position;

-- Verificar RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname IN ('security', 'topology', 'compliance', 'audit')
ORDER BY schemaname, tablename;
```

---

## 🔧 Passo 7: Atualizar Código Frontend

### Atualizar Queries Supabase

Depois de migrar, atualize as queries no frontend para usar Supabase diretamente:

```typescript
// Exemplo: Buscar documentos
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('compliance.documents')
  .select('*')
  .order('created_at', { ascending: false });
```

### Remover Dependência do Backend FastAPI (Opcional)

Se quiser usar apenas Supabase, pode remover a dependência do backend para queries simples:

```typescript
// Antes (usando FastAPI)
const data = await getComplianceDocuments();

// Depois (usando Supabase diretamente)
const { data } = await supabase
  .from('compliance.documents')
  .select('*');
```

---

## 🚨 Troubleshooting

### Erro: Schema não existe

```sql
-- Criar schemas manualmente
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;
```

### Erro: Extension não disponível

```sql
-- Verificar extensions disponíveis
SELECT * FROM pg_available_extensions WHERE name LIKE 'uuid%';

-- Supabase já tem uuid-ossp por padrão
```

### Erro: Permissão negada

- Supabase gerencia permissões via RLS
- Não é necessário configurar GRANT/REVOKE manualmente

### Erro: Tabela não encontrada em queries

- Verificar se está usando o schema correto: `schema.table`
- Ou configurar search_path:
  ```sql
  SET search_path TO security, topology, compliance, audit, public;
  ```

---

## 📚 Próximos Passos Após Migração

1. **Testar Conexão**:
   - Verificar se frontend consegue conectar ao Supabase
   - Testar queries básicas

2. **Validar Dados**:
   - Comparar contagens de registros
   - Validar integridade referencial

3. **Configurar Storage**:
   - Criar bucket para documentos
   - Configurar políticas de acesso

4. **Implementar Upload**:
   - Upload de documentos via Supabase Storage
   - Versionamento de arquivos

---

## 🔗 Links Úteis

- [Supabase SQL Editor](https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql)
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Schema](https://supabase.com/docs/guides/database/tables)

---

**Desenvolvido com 💙 pela equipe ness.**

