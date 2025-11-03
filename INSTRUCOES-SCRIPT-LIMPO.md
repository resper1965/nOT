# 📝 Instruções: Script Limpo de Criação

---

## ✅ Script Criado: `supabase-create.sql`

**Conteúdo:**
- ✅ Apenas comandos `CREATE` diretos
- ✅ Sem verificações complexas
- ✅ Sem `ALTER TABLE`
- ✅ Sem blocos `DO $$` complicados
- ✅ Simples e direto

---

## 🚀 Como Usar

### Opção 1: Se objetos não existem (primeira vez)

1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql/new
2. Abra o arquivo `supabase-create.sql`
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Execute

### Opção 2: Se objetos já existem (limpar e recriar)

**PASSO 1: Limpar schemas existentes**

Execute no SQL Editor do Supabase:

```sql
DROP SCHEMA IF EXISTS security CASCADE;
DROP SCHEMA IF EXISTS topology CASCADE;
DROP SCHEMA IF EXISTS compliance CASCADE;
DROP SCHEMA IF EXISTS audit CASCADE;
```

**PASSO 2: Criar tudo do zero**

Execute o arquivo `supabase-create.sql` completo.

---

## 📊 O que será criado

### Schemas
- `security`
- `topology`
- `compliance`
- `audit`

### Tabelas (19 total)

**Security (3):**
- `assets`
- `vulnerabilities`
- `incidents`

**Topology (4):**
- `ip_subnets`
- `ip_addresses`
- `vlans`
- `connections`

**Compliance (9):**
- `frameworks`
- `controls`
- `documents`
- `document_categories`
- `required_documents`
- `document_status`
- `document_versions`
- `document_approvals`
- `document_review_schedule`

**Audit (2):**
- `logs`
- `changes`

**Public (1):**
- `clients`

### Extras
- ✅ Todos os índices necessários
- ✅ Triggers de `updated_at`
- ✅ Views de resumo
- ✅ Seed data (frameworks e categorias)

---

## ✅ Vantagens deste Script

1. **Simples**: Apenas CREATE, sem complexidade
2. **Direto**: Não há verificações condicionais confusas
3. **Limpo**: Fácil de ler e entender
4. **Idempotente parcial**: Use com `IF NOT EXISTS` ou limpe primeiro

---

## ⚠️ Importante

- **Se der erro**: Objetos já existem. Use `DROP SCHEMA CASCADE` primeiro.
- **Autenticação**: Todas as referências a usuários usam `auth.users(id)` (Supabase nativo)
- **UUID**: Usa `gen_random_uuid()` (padrão do Supabase)

---

**Script pronto para uso!** ✅

