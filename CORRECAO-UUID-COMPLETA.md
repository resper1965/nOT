# 🔧 Correção: UUID e Tabelas Completas

**Erro:** `ERROR: 42883: function uuid_generate_v4() does not exist`

---

## ✅ Problemas Resolvidos

### 1. Função UUID

**Causa:** No Supabase, embora `uuid-ossp` esteja disponível, `gen_random_uuid()` do `pgcrypto` é mais confiável e já está habilitado por padrão.

**Solução:** Substituído todos os `uuid_generate_v4()` por `gen_random_uuid()` (13 ocorrências).

### 2. Tabelas Faltantes (Compliance Documents)

**Causa:** O script não incluía todas as tabelas de gestão de documentos de compliance (ANEEL RN 964/2021).

**Solução:** Adicionadas todas as tabelas:
- `compliance.document_categories`
- `compliance.required_documents`
- `compliance.document_status`
- `compliance.document_versions`
- `compliance.document_approvals`
- `compliance.document_review_schedule`

### 3. Autenticação Nativa do Supabase

**Causa:** Referências a usuários não estavam usando `auth.users` do Supabase.

**Solução:** Todas as colunas `user_id` e `created_by`/`approved_by` agora referenciam `auth.users(id)`:
- `audit.logs.user_id` → `auth.users(id)`
- `audit.changes.changed_by` → `auth.users(id)`
- `compliance.document_status.created_by` → `auth.users(id)`
- `compliance.document_status.approved_by` → `auth.users(id)`
- `compliance.document_versions.created_by` → `auth.users(id)`
- `compliance.document_versions.approved_by` → `auth.users(id)`
- `compliance.document_approvals.approver_id` → `auth.users(id)`
- `compliance.document_review_schedule.assigned_to` → `auth.users(id)`

---

## 🔧 Alterações Realizadas

### 1. Extensões
- Mantido `uuid-ossp` e `pgcrypto`
- `gen_random_uuid()` usado como padrão (mais confiável no Supabase)

### 2. UUID Substituído
- **13 tabelas** atualizadas: `public.clients`, `security.assets`, `security.vulnerabilities`, `security.incidents`, `topology.ip_subnets`, `topology.ip_addresses`, `topology.vlans`, `topology.connections`, `compliance.frameworks`, `compliance.controls`, `compliance.documents`, `audit.logs`, `audit.changes`

### 3. Novas Tabelas de Compliance
- **6 tabelas** adicionadas para gestão completa de documentos regulatórios

### 4. Triggers
- Adicionados triggers para novas tabelas de compliance documents

### 5. Seed Data
- Adicionado seed de categorias de documentos (10 categorias ANEEL RN 964/2021)

---

## ✅ Arquivo Corrigido

- **Arquivo:** `supabase-migration.sql`
- **Status:** ✅ Pronto para executar - TODAS as tabelas incluídas

---

## 📋 Resumo de Tabelas Criadas

### Schemas e Tabelas

**Public:**
- `public.clients` (multi-tenancy)

**Security:**
- `security.assets`
- `security.vulnerabilities`
- `security.incidents`

**Topology:**
- `topology.ip_subnets`
- `topology.ip_addresses`
- `topology.vlans`
- `topology.connections`

**Compliance:**
- `compliance.frameworks`
- `compliance.controls`
- `compliance.documents`
- `compliance.document_categories` ✅ **NOVO**
- `compliance.required_documents` ✅ **NOVO**
- `compliance.document_status` ✅ **NOVO**
- `compliance.document_versions` ✅ **NOVO**
- `compliance.document_approvals` ✅ **NOVO**
- `compliance.document_review_schedule` ✅ **NOVO**

**Audit:**
- `audit.logs`
- `audit.changes`

**Total: 19 tabelas**

---

## 🚀 Próximo Passo

**Execute novamente o script no Supabase SQL Editor:**

1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql/new
2. Copie o conteúdo de `supabase-migration.sql` (já corrigido)
3. Cole no SQL Editor
4. Execute

**✅ Agora deve funcionar com todas as tabelas!**

---

**Correção aplicada!** ✅

