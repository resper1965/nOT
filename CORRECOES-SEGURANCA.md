# 🔒 Correções de Segurança - ness. OT GRC

**Data**: 2025-01-04  
**Sistema**: ness. OT GRC  
**Versão**: 1.0

---

## 📋 Problemas Identificados e Corrigidos

### ⚠️ 1. Views com SECURITY DEFINER (ERROR)

**Problema**: 18 views no schema `public` estavam definidas com `SECURITY DEFINER`, o que pode ser um risco de segurança pois elas executam com as permissões do criador da view, não do usuário que está consultando.

**Impacto**: RISCO DE SEGURANÇA - Violação de princípio de menor privilégio

**Solução**: Recriar todas as views com `SECURITY INVOKER` (padrão seguro) usando `WITH (security_invoker = true)`.

**Views Corrigidas**:
- ✅ `public.assets`
- ✅ `public.controls`
- ✅ `public.frameworks`
- ✅ `public.documents`
- ✅ `public.incidents`
- ✅ `public.vulnerabilities`
- ✅ `public.document_categories`
- ✅ `public.required_documents`
- ✅ `public.document_status`
- ✅ `public.document_approvals`
- ✅ `public.document_review_schedule`
- ✅ `public.document_versions`
- ✅ `public.audit_changes`
- ✅ `public.audit_logs`
- ✅ `public.ip_addresses`
- ✅ `public.ip_subnets`
- ✅ `public.network_connections`
- ✅ `public.vlans`

---

### ⚠️ 2. Funções com Search Path Mutável (WARN)

**Problema**: 13 funções não tinham o `search_path` fixo, o que pode permitir SQL injection via search_path hijacking.

**Impacto**: RISCO DE SEGURANÇA - Possível SQL injection

**Solução**: Adicionar `SET search_path = ''` nas funções para prevenir search_path hijacking.

**Funções Corrigidas**:
- ✅ `public.update_updated_at_column()` - Adicionado `SET search_path = ''`
- ✅ `integration.correlate_event_with_asset()` - Adicionado `SET search_path = ''`
- ✅ `audit.log_event()` - Adicionado `SET search_path = ''`

**Funções que Precisam Correção** (já existentes no sistema):
- ⚠️ `compliance.get_next_version()` - Precisa correção
- ⚠️ `compliance.calculate_compliance_percentage()` - Precisa correção
- ⚠️ `compliance.update_assessment_status()` - Precisa correção
- ⚠️ `compliance.update_evidence_packages_updated_at()` - Precisa correção
- ⚠️ `compliance.calculate_evidence_package_hash()` - Precisa correção
- ⚠️ `compliance.create_attestation()` - Precisa correção
- ⚠️ `compliance.submit_evidence_package()` - Precisa correção
- ⚠️ `compliance.review_evidence_package()` - Precisa correção
- ⚠️ `compliance.approve_evidence_package()` - Precisa correção
- ⚠️ `compliance.lock_evidence_package()` - Precisa correção

---

### ⚠️ 3. RLS Habilitado sem Políticas (INFO)

**Problema**: Tabela `public.clients` tem RLS habilitado mas não tem políticas criadas.

**Impacto**: Baixo - RLS bloqueia acesso até políticas serem criadas

**Status**: Já identificado, pode ser corrigido posteriormente quando necessário.

---

## ✅ Correções Aplicadas

### Views Corrigidas

Todas as 18 views foram recriadas com `SECURITY INVOKER`:

```sql
CREATE OR REPLACE VIEW public.assets
WITH (security_invoker = true)
AS
SELECT ... FROM security.assets;
```

### Funções Corrigidas

3 funções críticas foram corrigidas:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- ✅ CORRIGIDO
AS $$ ... $$;
```

---

## 📊 Status Final

### ✅ Correções Aplicadas
- ✅ 18 views recriadas com `SECURITY INVOKER`
- ✅ 3 funções críticas corrigidas com `SET search_path = ''`

### ⚠️ Pendências
- ⚠️ 10 funções ainda precisam de correção (não críticas, mas recomendado)
- ⚠️ RLS sem políticas em `public.clients` (pode ser corrigido depois)

---

## 🔍 Verificação

Execute novamente o Supabase Advisor para confirmar que os problemas foram resolvidos:

```bash
# Via MCP Supabase
mcp_supabase_get_advisors(type: "security")
```

---

## 📝 Notas

1. **SECURITY INVOKER vs SECURITY DEFINER**:
   - `SECURITY INVOKER` (padrão): View executa com permissões do usuário que consulta
   - `SECURITY DEFINER`: View executa com permissões do criador da view (risco de segurança)

2. **Search Path Fixo**:
   - `SET search_path = ''`: Previne search_path hijacking
   - Funções devem sempre especificar schema completo (ex: `security.assets`, não apenas `assets`)

3. **Impacto**:
   - As correções aplicadas resolvem os problemas críticos (ERROR)
   - As funções pendentes são WARN (recomendado, mas não crítico)

---

---

## ✅ Correções Adicionais Aplicadas

### Política RLS Otimizada

**Problema**: Política RLS `Users can update own draft evidence packages` em `compliance.evidence_packages` estava reavaliando `auth.uid()` para cada linha, causando problemas de performance.

**Solução**: Substituído `auth.uid()` por `(SELECT auth.uid())` na política RLS.

**Política Corrigida**:
- ✅ `compliance.evidence_packages` - "Users can update own draft evidence packages"
- ✅ `compliance.attestations` - "Users can create own attestations"

### Funções do Schema Compliance Corrigidas

**Problema**: 10 funções no schema `compliance` tinham search_path mutável.

**Solução**: Adicionado `SET search_path = ''` em todas as funções.

**Funções Corrigidas**:
- ✅ `compliance.get_next_version()` - Adicionado `SET search_path = ''`
- ✅ `compliance.calculate_compliance_percentage()` - Adicionado `SET search_path = ''`
- ✅ `compliance.update_assessment_status()` - Adicionado `SET search_path = ''`
- ✅ `compliance.update_evidence_packages_updated_at()` - Adicionado `SET search_path = ''`
- ✅ `compliance.calculate_evidence_package_hash()` - Adicionado `SET search_path = ''`
- ✅ `compliance.create_attestation()` - Adicionado `SET search_path = ''`
- ✅ `compliance.submit_evidence_package()` - Adicionado `SET search_path = ''`
- ✅ `compliance.review_evidence_package()` - Adicionado `SET search_path = ''`
- ✅ `compliance.approve_evidence_package()` - Adicionado `SET search_path = ''`
- ✅ `compliance.lock_evidence_package()` - Adicionado `SET search_path = ''`

---

---

## ✅ Correções Finais Aplicadas

### Políticas RLS para public.clients

**Problema**: Tabela `public.clients` tinha RLS habilitado mas não tinha políticas criadas.

**Solução**: Criadas políticas RLS básicas:
- ✅ `Authenticated users can view clients`: Usuários autenticados podem visualizar todos os clientes
- ✅ `Service role can manage clients`: Apenas service_role pode gerenciar clientes (INSERT/UPDATE/DELETE)

**Nota**: Essas políticas podem ser refinadas quando houver estrutura de usuários-cliente implementada.

---

## ⚠️ Configuração Pendente (Manual no Dashboard)

### Auth Leaked Password Protection

**Problema**: Proteção contra senhas vazadas está desabilitada no Supabase Auth.

**Solução**: Habilitar no dashboard do Supabase:
1. Acesse: **Supabase Dashboard** → **Authentication** → **Settings** → **Password Security**
2. Habilite: **"Leaked password protection"**
3. Esta funcionalidade verifica senhas contra HaveIBeenPwned.org

**Nota**: Esta é uma configuração do Supabase Auth que não pode ser feita via SQL, apenas no dashboard.

---

**Relatório gerado em**: 2025-01-04  
**Versão**: 3.0

