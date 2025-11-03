# 🔍 Como Verificar Todas as Tabelas no Supabase

---

## ❓ Problema

Você está vendo apenas a tabela `clients` no schema `public`. **Isso é normal!** As outras tabelas estão em **outros schemas**.

---

## ✅ Onde estão as tabelas

### Schema: `public`
- ✅ `clients` (6 colunas) - Esta você já viu!

### Schema: `security`
- ✅ `assets` - Ativos de rede
- ✅ `vulnerabilities` - Vulnerabilidades
- ✅ `incidents` - Incidentes de segurança

### Schema: `topology`
- ✅ `ip_subnets` - Sub-redes IP
- ✅ `ip_addresses` - Endereços IP
- ✅ `vlans` - VLANs
- ✅ `connections` - Conexões de rede

### Schema: `compliance`
- ✅ `frameworks` - Frameworks de conformidade
- ✅ `controls` - Controles de segurança
- ✅ `documents` - Documentos
- ✅ `document_categories` - Categorias de documentos
- ✅ `required_documents` - Documentos obrigatórios
- ✅ `document_status` - Status de documentos
- ✅ `document_versions` - Versões de documentos
- ✅ `document_approvals` - Aprovações
- ✅ `document_review_schedule` - Agendamento de revisões

### Schema: `audit`
- ✅ `logs` - Logs de auditoria
- ✅ `changes` - Rastreamento de mudanças

**Total: 19 tabelas criadas!**

---

## 🔍 Como verificar no Supabase Dashboard

### Método 1: SQL Editor

Execute este comando no SQL Editor:

```sql
-- Ver todas as tabelas em todos os schemas
SELECT 
    table_schema,
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_schema = t.table_schema 
     AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema IN ('public', 'security', 'topology', 'compliance', 'audit')
  AND table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;
```

### Método 2: Table Editor (Interface Visual)

1. No Supabase Dashboard, vá para **Table Editor**
2. No dropdown superior direito (onde mostra "All schemas" ou "public")
3. Selecione cada schema:
   - `public` → Verá `clients`
   - `security` → Verá `assets`, `vulnerabilities`, `incidents`
   - `topology` → Verá `ip_subnets`, `ip_addresses`, `vlans`, `connections`
   - `compliance` → Verá todas as tabelas de compliance
   - `audit` → Verá `logs`, `changes`

### Método 3: Database → Schemas

1. No Supabase Dashboard, vá para **Database**
2. Clique em **Schemas**
3. Expanda cada schema para ver as tabelas:
   - `public`
   - `security`
   - `topology`
   - `compliance`
   - `audit`

---

## 📊 Verificação Completa

Execute este script para verificar tudo:

```sql
-- Verificar schemas criados
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('security', 'topology', 'compliance', 'audit', 'public')
ORDER BY schema_name;

-- Verificar contagem de tabelas por schema
SELECT 
    table_schema,
    COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema IN ('public', 'security', 'topology', 'compliance', 'audit')
  AND table_type = 'BASE TABLE'
GROUP BY table_schema
ORDER BY table_schema;

-- Verificar todas as tabelas e colunas
SELECT 
    table_schema,
    table_name,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema IN ('public', 'security', 'topology', 'compliance', 'audit')
GROUP BY table_schema, table_name
ORDER BY table_schema, table_name;
```

---

## ✅ Resultado Esperado

- **public**: 1 tabela (`clients`)
- **security**: 3 tabelas (`assets`, `vulnerabilities`, `incidents`)
- **topology**: 4 tabelas (`ip_subnets`, `ip_addresses`, `vlans`, `connections`)
- **compliance**: 9 tabelas (frameworks, controls, documents, etc.)
- **audit**: 2 tabelas (`logs`, `changes`)

**Total: 19 tabelas!**

---

## 🚀 Próximo Passo

Se você não estiver vendo as tabelas nos outros schemas, verifique:

1. O script executou completamente? (Verifique se não houve erros)
2. Os schemas foram criados? (Execute o SQL acima para verificar)
3. Você está olhando no schema correto no Table Editor?

---

**Todas as 19 tabelas foram criadas!** ✅

Elas estão nos schemas `security`, `topology`, `compliance` e `audit`. Use o Table Editor ou SQL Editor para vê-las! 🔍

