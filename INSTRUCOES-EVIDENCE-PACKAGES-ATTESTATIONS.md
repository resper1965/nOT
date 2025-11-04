# 📋 Instruções: Evidence Packages & Attestations

**Data**: 2025-01-04  
**Versão**: 1.0  
**Fase**: 0.1 - Evidence Packages & Attestation (P0 - Crítico)

---

## 🎯 Objetivo

Criar sistema completo de **Pacotes de Evidência** e **Attestations Digitais** para o ness. OT GRC, permitindo:

- ✅ Agrupar múltiplos artefatos (PDF, logs, prints, export SIEM) sob um evidence_package
- ✅ Vincular ao controle/avaliação com hash SHA-256 e carimbo de tempo
- ✅ Workflow de aprovação: draft → submitted → reviewed → approved → locked
- ✅ Assinatura digital de responsáveis por controles/avaliações/instalações
- ✅ Histórico imutável de todas as assinaturas

---

## 📊 O Que Foi Criado

### 1. Tabelas Principais

#### `compliance.evidence_packages`
- Pacotes de evidência que agrupam múltiplos artefatos
- Status: draft → submitted → reviewed → approved → locked
- Hash SHA-256 do pacote
- Timestamps de cada etapa do workflow
- Responsáveis por cada etapa

#### `compliance.evidence_artifacts`
- Artefatos individuais (PDF, logs, prints, SIEM exports)
- Vinculados a um pacote de evidência
- Hash SHA-256 de cada arquivo
- Path no Supabase Storage
- Metadados (tipo, tamanho, MIME type)

#### `compliance.attestations`
- Assinaturas digitais de responsáveis
- Escopo: control, assessment, installation, framework
- Hash SHA-256 da assinatura
- IP e user agent de origem
- Timestamp da assinatura

#### `compliance.attestation_history`
- Histórico imutável de todas as assinaturas
- Ações: created, revoked, renewed
- Motivos de revogação/renovação

#### `compliance.evidence_package_attestations`
- Vinculação entre pacotes de evidência e attestations

### 2. Views Criadas

#### `compliance.v_evidence_packages_detail`
- Detalhes completos de pacotes de evidência
- Inclui: controle, avaliação, artefatos, attestations, responsáveis
- Métricas: contagem de artefatos, tamanho total, contagem de attestations

#### `compliance.v_attestations_detail`
- Detalhes completos de attestations
- Inclui: owner, scope, labels, validade

#### `compliance.v_evidence_packages_by_status`
- Estatísticas de pacotes por status
- Métricas: total, últimos 30/7 dias, tempo médio de aprovação

#### `compliance.v_attestations_by_scope`
- Estatísticas de attestations por escopo
- Métricas: total, últimos 30/7 dias, signatários únicos

### 3. Funções Criadas

#### Workflow de Evidence Packages
- `compliance.submit_evidence_package()` - Submeter para revisão
- `compliance.review_evidence_package()` - Revisar (aprovar ou rejeitar)
- `compliance.approve_evidence_package()` - Aprovar
- `compliance.lock_evidence_package()` - Bloquear (final)

#### Attestations
- `compliance.create_attestation()` - Criar attestation e registrar no histórico
- `compliance.calculate_evidence_package_hash()` - Calcular hash do pacote

### 4. Row Level Security (RLS)

- ✅ Políticas para todas as tabelas
- ✅ Usuários autenticados podem ver todos os pacotes/attestations
- ✅ Usuários podem criar seus próprios pacotes (draft)
- ✅ Usuários podem atualizar apenas seus próprios pacotes (draft)
- ✅ Usuários podem criar suas próprias attestations

---

## 🚀 Como Executar

### Passo 1: Executar o Script SQL no Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto: **ness. OT GRC**
3. Vá para **SQL Editor**
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase-create-evidence-packages-attestations.sql`
6. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Passo 2: Verificar a Execução

Execute esta query para verificar se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'compliance'
AND table_name IN (
    'evidence_packages',
    'evidence_artifacts',
    'attestations',
    'attestation_history',
    'evidence_package_attestations'
)
ORDER BY table_name;
```

**Resultado esperado**: 5 tabelas listadas

### Passo 3: Verificar Views Criadas

Execute esta query para verificar se as views foram criadas:

```sql
-- Verificar views criadas
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'compliance'
AND table_name LIKE 'v_evidence%'
OR table_name LIKE 'v_attestation%'
ORDER BY table_name;
```

**Resultado esperado**: 4 views listadas

### Passo 4: Verificar Funções Criadas

Execute esta query para verificar se as funções foram criadas:

```sql
-- Verificar funções criadas
SELECT 
    routine_schema,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'compliance'
AND routine_name IN (
    'submit_evidence_package',
    'review_evidence_package',
    'approve_evidence_package',
    'lock_evidence_package',
    'create_attestation',
    'calculate_evidence_package_hash'
)
ORDER BY routine_name;
```

**Resultado esperado**: 6 funções listadas

### Passo 5: Verificar RLS Configurado

Execute esta query para verificar se o RLS está habilitado:

```sql
-- Verificar RLS habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'compliance'
AND tablename IN (
    'evidence_packages',
    'evidence_artifacts',
    'attestations',
    'attestation_history',
    'evidence_package_attestations'
)
ORDER BY tablename;
```

**Resultado esperado**: `rowsecurity = true` para todas as tabelas

---

## 📝 Exemplos de Uso

### 1. Criar um Evidence Package

```sql
-- Criar um pacote de evidência para um controle
INSERT INTO compliance.evidence_packages (
    control_id,
    assessment_id,
    package_name,
    description,
    hash,
    status
)
VALUES (
    'control-uuid-here',
    'assessment-uuid-here',
    'Evidências de Conformidade - ONS-01',
    'Pacote contendo logs de autenticação, prints de telas e export do SIEM',
    'hash-sha256-here', -- Calculado no backend
    'draft'
)
RETURNING id;
```

### 2. Adicionar Artefatos ao Pacote

```sql
-- Adicionar artefato ao pacote
INSERT INTO compliance.evidence_artifacts (
    package_id,
    artifact_name,
    artifact_type,
    file_path,
    file_size,
    mime_type,
    hash,
    uploaded_by
)
VALUES (
    'package-uuid-here',
    'logs-autenticacao-2025-01-04.pdf',
    'pdf',
    'storage/evidence/logs-autenticacao-2025-01-04.pdf',
    1048576, -- 1 MB
    'application/pdf',
    'hash-sha256-here', -- Calculado no backend
    auth.uid()
)
RETURNING id;
```

### 3. Submeter Pacote para Revisão

```sql
-- Submeter pacote para revisão
SELECT compliance.submit_evidence_package(
    'package-uuid-here',
    auth.uid()
);
```

### 4. Criar Attestation

```sql
-- Criar attestation para um controle
SELECT compliance.create_attestation(
    p_owner_id := auth.uid(),
    p_scope := 'control',
    p_scope_id := 'control-uuid-here',
    p_statement := 'Atesto que o controle ONS-01 está em conformidade conforme evidências apresentadas.',
    p_signature_hash := 'hash-sha256-here', -- Calculado no backend
    p_ip_address := '192.168.1.100'::INET,
    p_user_agent := 'Mozilla/5.0...'
);
```

### 5. Vincular Attestation ao Pacote

```sql
-- Vincular attestation ao pacote
INSERT INTO compliance.evidence_package_attestations (
    package_id,
    attestation_id
)
VALUES (
    'package-uuid-here',
    'attestation-uuid-here'
)
ON CONFLICT (package_id, attestation_id) DO NOTHING;
```

### 6. Aprovar Pacote

```sql
-- Aprovar pacote
SELECT compliance.approve_evidence_package(
    'package-uuid-here',
    auth.uid()
);
```

### 7. Consultar Pacotes por Status

```sql
-- Consultar pacotes por status
SELECT * FROM compliance.v_evidence_packages_detail
WHERE status = 'submitted'
ORDER BY submitted_at DESC;
```

### 8. Consultar Attestations por Scope

```sql
-- Consultar attestations de um controle
SELECT * FROM compliance.v_attestations_detail
WHERE scope = 'control'
AND scope_id = 'control-uuid-here'
ORDER BY signed_at DESC;
```

---

## 🔍 Verificações Adicionais

### Verificar Estatísticas

```sql
-- Estatísticas de pacotes por status
SELECT * FROM compliance.v_evidence_packages_by_status;

-- Estatísticas de attestations por scope
SELECT * FROM compliance.v_attestations_by_scope;
```

### Verificar Índices

```sql
-- Verificar índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'compliance'
AND tablename IN (
    'evidence_packages',
    'evidence_artifacts',
    'attestations',
    'attestation_history',
    'evidence_package_attestations'
)
ORDER BY tablename, indexname;
```

---

## 📊 Próximos Passos

### Backend (API Routes)

1. **Criar API Routes Next.js**:
   - `POST /api/compliance/evidence-packages` - Criar pacote
   - `GET /api/compliance/evidence-packages` - Listar pacotes
   - `GET /api/compliance/evidence-packages/[id]` - Detalhes do pacote
   - `PUT /api/compliance/evidence-packages/[id]` - Atualizar pacote
   - `POST /api/compliance/evidence-packages/[id]/submit` - Submeter
   - `POST /api/compliance/evidence-packages/[id]/review` - Revisar
   - `POST /api/compliance/evidence-packages/[id]/approve` - Aprovar
   - `POST /api/compliance/evidence-packages/[id]/lock` - Bloquear

2. **Upload de Artefatos**:
   - `POST /api/compliance/evidence-artifacts/upload` - Upload de arquivo
   - `DELETE /api/compliance/evidence-artifacts/[id]` - Deletar artefato

3. **Attestations**:
   - `POST /api/compliance/attestations` - Criar attestation
   - `GET /api/compliance/attestations` - Listar attestations
   - `GET /api/compliance/attestations/[id]` - Detalhes da attestation

### Frontend (Páginas Next.js)

1. **Página de Evidence Packages**:
   - `/dashboard/compliance/evidence/packages` - Lista de pacotes
   - `/dashboard/compliance/evidence/packages/[id]` - Detalhes do pacote
   - `/dashboard/compliance/evidence/packages/new` - Criar novo pacote

2. **Página de Attestations**:
   - `/dashboard/compliance/attestations` - Lista de attestations
   - `/dashboard/compliance/attestations/[id]` - Detalhes da attestation

3. **Componentes**:
   - `EvidencePackageForm.tsx` - Formulário de pacote
   - `EvidenceArtifactUpload.tsx` - Upload de artefatos
   - `AttestationForm.tsx` - Formulário de attestation
   - `EvidencePackageWorkflow.tsx` - Workflow de aprovação

---

## ✅ Checklist de Implementação

### Banco de Dados ✅
- [x] Tabelas criadas (5 tabelas)
- [x] Views criadas (4 views)
- [x] Funções criadas (6 funções)
- [x] RLS configurado (5 políticas)
- [x] Índices criados
- [x] Triggers criados
- [x] Comentários adicionados

### Backend (Pendente)
- [ ] API Routes criadas
- [ ] Upload de arquivos implementado
- [ ] Cálculo de hash SHA-256 implementado
- [ ] Validações implementadas

### Frontend (Pendente)
- [ ] Páginas criadas
- [ ] Componentes criados
- [ ] Formulários criados
- [ ] Workflow visual implementado

---

## 🎯 Status

- ✅ **Banco de Dados**: Pronto para uso
- ⏳ **Backend**: Pendente
- ⏳ **Frontend**: Pendente

---

**Próximo Passo**: Criar API Routes Next.js para Evidence Packages e Attestations

---

**Data**: 2025-01-04  
**Versão**: 1.0  
**Fase**: 0.1 - Evidence Packages & Attestation

