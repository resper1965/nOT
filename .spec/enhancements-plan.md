# 🚀 Plano de Implementação - Melhorias ness. OT GRC

**Data**: 2025-01-04  
**Versão**: 1.0  
**Status**: 📋 Planejado  
**Objetivo**: Tornar o sistema "redondo" para OT + regulatório (ANEEL/ONS) e escalável comercialmente

> **Nota**: Para o plano de integração IA e operação total Supabase, veja `.spec/ai-integration-plan.md`

---

## 📊 Visão Geral

Este plano organiza 10 blocos de melhorias em fases práticas e incrementais, priorizadas por impacto/viabilidade e alinhadas com as necessidades regulatórias e comerciais.

### Princípios de Implementação

- ✅ **Incremental**: Cada fase entrega valor independente
- ✅ **Pragmático**: Foco em 30-60 dias primeiro
- ✅ **Escalável**: Preparação para multi-tenant e planos comerciais
- ✅ **Regulatório**: Priorização ANEEL/ONS (obrigatório)
- ✅ **OT-First**: Foco em Tecnologia Operacional

---

## 🎯 Fase 0: Próximos 30-60 Dias (Prático e Incremental)

**Duração**: 4-8 semanas  
**Prioridade**: P0 (Crítico)  
**Objetivo**: Entregar valor imediato para conformidade regulatória

### Bloco 1: Evidência & Attestation ✅ P0

**Objetivo**: Refinar sistema de evidências com packages e assinatura digital

#### 1.1 Pacotes de Evidência (Evidence Packages)

**O que implementar**:
- Agrupar múltiplos artefatos (PDF, logs, prints, export SIEM) sob um `evidence_package`
- Vincular ao controle/avaliação
- Hash SHA-256 e carimbo de tempo
- Status: draft → submitted → reviewed → approved → locked

**Entregas**:
- ✅ SQL: Tabela `compliance.evidence_packages`
- ✅ API: CRUD de evidence packages
- ✅ Frontend: Interface de upload e agrupamento
- ✅ Hash e timestamp automáticos

**Esforço**: 2 semanas

#### 1.2 Ciclo de Vida da Evidência

**O que implementar**:
- Workflow: draft → submitted → reviewed → approved → locked
- Motivo de reprovação e reenvio
- Notificações por email/webhook

**Entregas**:
- ✅ API: Endpoints de aprovação/rejeição
- ✅ Frontend: Workflow visual de aprovação
- ✅ Notificações: Email/SMS para responsáveis

**Esforço**: 1 semana

#### 1.3 Attestation Digital

**O que implementar**:
- Termo assinado por responsável do controle/instalação
- Assinatura digital (Supabase Auth ou assinatura simples)
- Timestamp e hash
- Histórico de assinaturas

**Entregas**:
- ✅ SQL: Tabela `compliance.attestations`
- ✅ API: Endpoints de assinatura
- ✅ Frontend: Interface de assinatura
- ✅ PDF: Geração de termo assinável

**Esforço**: 1 semana

**Total Fase 0.1**: 4 semanas

### Bloco 2: Exceções & Crosswalk ✅ P0

**Objetivo**: Reaproveitar evidências entre frameworks e gerenciar exceções

#### 2.1 Mapa Cruzado (Crosswalk)

**O que implementar**:
- Mapeamento ANEEL ↔ ONS ↔ ISO 27001 ↔ IEC 62443 ↔ NIST CSF
- Reaproveitamento automático de evidências
- Redução de trabalho duplicado

**Entregas**:
- ✅ SQL: Tabela `compliance.control_mappings`
- ✅ API: Endpoints de crosswalk
- ✅ Frontend: Visualização de mapeamentos
- ✅ Lógica: Reaproveitamento automático

**Esforço**: 2 semanas

#### 2.2 Gestão de Exceções

**O que implementar**:
- Exceções aprovadas pelo Gestor do ARCiber
- Justificativa, aprovador, data de vencimento
- Risco residual e status

**Entregas**:
- ✅ SQL: Tabela `compliance.control_exceptions`
- ✅ API: CRUD de exceções
- ✅ Frontend: Interface de exceções
- ✅ Workflow: Aprovação de exceções

**Esforço**: 1 semana

**Total Fase 0.2**: 3 semanas

### Bloco 3: Mudanças OT & Backups de Config ✅ P0

**Objetivo**: Integrar Engenharia sem invadir escopo

#### 3.1 Gestão de Mudanças OT (Change Control)

**O que implementar**:
- Fluxo: solicitação → análise risco cyber → janela → execução → verificação
- Checklist ONS/ANEEL embutido
- Aprovações necessárias

**Entregas**:
- ✅ SQL: Tabela `ops.ot_changes`
- ✅ API: CRUD de mudanças
- ✅ Frontend: Workflow de mudanças
- ✅ Checklist: ONS/ANEEL automático

**Esforço**: 2 semanas

#### 3.2 Backups de Config OT

**O que implementar**:
- Registro de backup de configuração (PLC/RTU/HMI)
- Local e periodicidade do backup
- Teste de restauração documentado

**Entregas**:
- ✅ SQL: Tabela `ops.ot_backups`
- ✅ API: CRUD de backups
- ✅ Frontend: Interface de backups
- ✅ Alertas: Backup vencido

**Esforço**: 1 semana

**Total Fase 0.3**: 3 semanas

### Bloco 4: Relatórios "1-clique" ANEEL/ONS ✅ P0

**Objetivo**: Relatórios prontos para auditor/regulador

#### 4.1 Relatório ANEEL RN 964/2021

**O que implementar**:
- Status por controle, evidência, responsável, última revisão, exceções
- PDF exportável
- CSV exportável

**Entregas**:
- ✅ API: Endpoint de geração de relatório
- ✅ Frontend: Página `/dashboard/compliance/reports/aneel`
- ✅ PDF: Template de relatório ANEEL
- ✅ CSV: Export de dados

**Esforço**: 1 semana

#### 4.2 Relatório ONS RO-CB.BR.01

**O que implementar**:
- Checklist detalhado por planta/instalação
- Status de cada controle
- Evidências e exceções

**Entregas**:
- ✅ API: Endpoint de geração de relatório
- ✅ Frontend: Página `/dashboard/compliance/reports/ons`
- ✅ PDF: Template de relatório ONS
- ✅ CSV: Export de dados

**Esforço**: 1 semana

**Total Fase 0.4**: 2 semanas

### Bloco 5: KPIs/SLOs no Dashboard ✅ P0

**Objetivo**: Métricas visíveis no dashboard

#### 5.1 KPIs Principais

**O que implementar**:
- Conformidade por framework/planta/domínio
- % evidências válidas (≤30/60/90 dias para vencer)
- % ativos críticos com baseline verificada
- % mudanças OT com análise cyber prévia
- % exceções em dia / vencidas
- MTTD/MTTR OT
- % playbooks testados
- % recertificação de acessos cumprida

**Entregas**:
- ✅ SQL: Views para KPIs
- ✅ API: Endpoints de KPIs
- ✅ Frontend: Cards de KPIs no dashboard
- ✅ Gráficos: Visualizações de tendências

**Esforço**: 2 semanas

**Total Fase 0**: **12 semanas** (3 meses)

---

## 🚀 Fase 1: Camada de Conformidade & Evidências (Refinamento)

**Duração**: 6-8 semanas  
**Prioridade**: P1 (Alto)  
**Dependências**: Fase 0 completa

### 1.1 Recertificação Periódica

**O que implementar**:
- Tarefas automáticas para revalidar controles/documentos
- Exemplo: ONS-06 inventário a cada 24 meses
- Alertas e notificações

**Entregas**:
- ✅ SQL: Tabela `compliance.recertification_tasks`
- ✅ Backend: Cron jobs / Scheduled tasks
- ✅ Frontend: Interface de recertificação
- ✅ Notificações: Alertas automáticos

**Esforço**: 2 semanas

### 1.2 Linha do Tempo de Conformidade

**O que implementar**:
- Evolução trimestral por instalação e por domínio
- Histórico de conformidade
- Gráficos de tendência

**Entregas**:
- ✅ SQL: Views de histórico
- ✅ API: Endpoints de histórico
- ✅ Frontend: Visualização de linha do tempo
- ✅ Gráficos: Recharts para visualização

**Esforço**: 1 semana

### 1.3 Heatmap: Controles x Plantas

**O que implementar**:
- Visualização: controles x plantas (verde/amarelo/vermelho)
- Filtros por framework, domínio, planta
- Export de heatmap

**Entregas**:
- ✅ API: Endpoint de dados de heatmap
- ✅ Frontend: Componente de heatmap
- ✅ Interatividade: Tooltips e detalhes

**Esforço**: 1 semana

**Total Fase 1**: 4 semanas

---

## ⚠️ Fase 2: Risco OT "de Verdade"

**Duração**: 8-10 semanas  
**Prioridade**: P1 (Alto)  
**Dependências**: Fase 0 e Fase 1

### 2.1 Registro de Risco OT

**O que implementar**:
- Taxonomia própria: falha de controle/atuador, comando indevido, perda de telemetria, lateral movement IT→OT
- Riscos vinculados a ativos/zonas (DMZ, Subestação X, Protocolo IEC-61850)
- Riscos vinculados a controles mitigadores

**Entregas**:
- ✅ SQL: Tabela `risk.ot_risks`
- ✅ API: CRUD de riscos OT
- ✅ Frontend: Interface de gestão de riscos
- ✅ Taxonomia: Catálogo de cenários OT

**Esforço**: 3 semanas

### 2.2 FAIR-light para Priorização

**O que implementar**:
- Probabilidade x Impacto (segurança, operação, financeiro, regulatório)
- Cálculo de risk score
- Priorização automática

**Entregas**:
- ✅ SQL: Funções de cálculo de risco
- ✅ API: Endpoints de cálculo
- ✅ Frontend: Visualização de matriz de risco
- ✅ Gráficos: Scatter plot de riscos

**Esforço**: 2 semanas

### 2.3 Planos de Tratamento

**O que implementar**:
- Custo, prazo, risco residual
- "Aceite com condição" (exceções reguladas)
- Status de tratamento

**Entregas**:
- ✅ SQL: Tabela `risk.treatment_plans`
- ✅ API: CRUD de planos
- ✅ Frontend: Interface de planos
- ✅ Workflow: Aprovação de planos

**Esforço**: 2 semanas

**Total Fase 2**: 7 semanas

---

## 🔧 Fase 3: Operação Segura Integrando Engenharia

**Duração**: 6-8 semanas  
**Prioridade**: P1 (Alto)  
**Dependências**: Fase 0 e Fase 2

### 3.1 Linha de Base (Baseline) OT

**O que implementar**:
- Versão de firmware/parametrização por ativo
- Alerta se divergência
- Comparação de baselines

**Entregas**:
- ✅ SQL: Tabela `ops.ot_baselines`
- ✅ API: CRUD de baselines
- ✅ Frontend: Interface de baselines
- ✅ Alertas: Divergência detectada

**Esforço**: 2 semanas

### 3.2 Acesso de Terceiros

**O que implementar**:
- Janela, owner, justificativa
- Bastion/PAM, logs associados ao ticket
- Aprovações necessárias

**Entregas**:
- ✅ SQL: Tabela `ops.third_party_access`
- ✅ API: CRUD de acessos
- ✅ Frontend: Interface de acessos
- ✅ Integração: Logs de bastion/PAM

**Esforço**: 2 semanas

**Total Fase 3**: 4 semanas

---

## 🚨 Fase 4: Incidentes & Resposta (Foco Regulatório)

**Duração**: 6-8 semanas  
**Prioridade**: P1 (Alto)  
**Dependências**: Fase 0 e Fase 2

### 4.1 Classificador ANEEL

**O que implementar**:
- "Incidente Cibernético de Maior Impacto"
- Perguntas orientadas que calculam classificação
- Disparam obrigações (notificação ANEEL)

**Entregas**:
- ✅ SQL: Tabela `security.aneel_incident_classifications`
- ✅ API: Endpoint de classificação
- ✅ Frontend: Wizard de classificação
- ✅ Notificações: Disparo automático

**Esforço**: 2 semanas

### 4.2 Playbooks OT

**O que implementar**:
- Ransomware em HMI, RTU comprometida, perda de enlace, vazamento de credenciais
- Passos, responsáveis, tempos-alvo
- Testes periódicos

**Entregas**:
- ✅ SQL: Tabela `security.ot_playbooks`
- ✅ API: CRUD de playbooks
- ✅ Frontend: Interface de playbooks
- ✅ Execução: Workflow de resposta

**Esforço**: 2 semanas

### 4.3 Pós-Incidente

**O que implementar**:
- Lições aprendidas
- Ações corretivas
- Verificação de eficácia (fecha o ciclo)

**Entregas**:
- ✅ SQL: Tabela `security.post_incident_reviews`
- ✅ API: CRUD de reviews
- ✅ Frontend: Interface de pós-incidente
- ✅ Workflow: Fechamento de ciclo

**Esforço**: 2 semanas

### 4.4 Métricas de Incidentes

**O que implementar**:
- MTTD/MTTR, % playbooks testados
- Incidentes por zona/planta
- Dashboards de incidentes

**Entregas**:
- ✅ SQL: Views de métricas
- ✅ API: Endpoints de métricas
- ✅ Frontend: Dashboard de incidentes
- ✅ Gráficos: Visualizações

**Esforço**: 1 semana

**Total Fase 4**: 7 semanas

---

## 📊 Fase 5: Monitoramento & Integração (Leve e Valioso)

**Duração**: 6-8 semanas  
**Prioridade**: P2 (Médio)  
**Dependências**: Fase 0 e Fase 2

### 5.1 Integração SIEM (Metadados)

**O que implementar**:
- Trazer só o essencial: contagem de alertas, casos abertos/fechados, tempo de resposta
- Não "virar SOC"
- Integração via API REST

**Entregas**:
- ✅ SQL: Tabela `monitoring.siem_metadata`
- ✅ API: Endpoints de integração SIEM
- ✅ Frontend: Cards de métricas SIEM
- ✅ Integração: Conectores para SIEMs principais

**Esforço**: 2 semanas

### 5.2 Ingestão de Vulnerabilidades

**O que implementar**:
- CSV/API de scanner
- Normalizar CVE/CVSS
- Vincular ao ativo e ao controle

**Entregas**:
- ✅ SQL: Tabela `security.findings`
- ✅ API: Endpoints de ingestão
- ✅ Frontend: Interface de findings
- ✅ Normalização: Parser de CVE/CVSS

**Esforço**: 2 semanas

### 5.3 Descoberta OT (Opcional)

**O que implementar**:
- Importar lista de ativos/protocolos de ferramenta OT
- IEC-61850/DNP3/Modbus
- Enriquecer inventário

**Entregas**:
- ✅ SQL: Tabela `topology.ot_discovered_assets`
- ✅ API: Endpoints de descoberta
- ✅ Frontend: Interface de descoberta
- ✅ Parsers: Protocolos OT

**Esforço**: 2 semanas

**Total Fase 5**: 6 semanas

---

## 👥 Fase 6: Governança & Pessoas

**Duração**: 6-8 semanas  
**Prioridade**: P2 (Médio)  
**Dependências**: Fase 0 e Fase 1

### 6.1 RACI por Framework/Controle

**O que implementar**:
- Quem define, aprova, executa, audita
- Matriz RACI visual
- Atribuições por controle

**Entregas**:
- ✅ SQL: Tabela `compliance.raci_assignments`
- ✅ API: CRUD de RACI
- ✅ Frontend: Interface de RACI
- ✅ Visualização: Matriz RACI

**Esforço**: 2 semanas

### 6.2 Trilha de Auditoria "Imutável"

**O que implementar**:
- Toda mudança em avaliação/evidência/documento registrada
- Quem, quando, de → para
- Hash para integridade

**Entregas**:
- ✅ SQL: Tabela `audit.events` (expandida)
- ✅ Triggers: Captura automática de mudanças
- ✅ Frontend: Visualização de trilha
- ✅ Hash: SHA-256 para integridade

**Esforço**: 2 semanas

### 6.3 Recertificação de Acessos OT

**O que implementar**:
- Trimestral/semestral
- Puxar usuários privilegiados/terceiros
- Coletar attestation

**Entregas**:
- ✅ SQL: Tabela `compliance.access_recertifications`
- ✅ API: Endpoints de recertificação
- ✅ Frontend: Interface de recertificação
- ✅ Notificações: Alertas automáticos

**Esforço**: 2 semanas

### 6.4 Treinamentos Vinculados a Controles

**O que implementar**:
- Exemplo: HUM-01 (Programas de Capacitação)
- Quem fez, quando vence, % cobertura por instalação

**Entregas**:
- ✅ SQL: Tabela `compliance.training_records`
- ✅ API: CRUD de treinamentos
- ✅ Frontend: Interface de treinamentos
- ✅ Métricas: Cobertura por controle

**Esforço**: 2 semanas

**Total Fase 6**: 8 semanas

---

## 💼 Fase 7: Produto (Multi-Tenant, Escalabilidade e Venda)

**Duração**: 8-10 semanas  
**Prioridade**: P2 (Médio)  
**Dependências**: Todas as fases anteriores

### 7.1 Planos Comerciais

**O que implementar**:
- Core: ANEEL/ONS + doc
- Pro: riscos + crosswalk + mudanças
- Enterprise: integrações SIEM/CMDB/SSO
- Limites por plano

**Entregas**:
- ✅ SQL: Tabela `public.plan_features`
- ✅ API: Validação de features por plano
- ✅ Frontend: Gerenciamento de planos
- ✅ Billing: Integração com sistema de cobrança

**Esforço**: 3 semanas

### 7.2 SSO OIDC

**O que implementar**:
- Entra ID/Google via Supabase Auth
- Perfis: org_admin, compliance_officer, auditor_readonly, eng_view
- Permissões por perfil

**Entregas**:
- ✅ Config: Supabase Auth OIDC
- ✅ Frontend: Login SSO
- ✅ RLS: Row Level Security por perfil
- ✅ Permissões: Sistema de permissões

**Esforço**: 2 semanas

### 7.3 SLA Interno

**O que implementar**:
- Tarefas do sistema: geração de relatórios, lembretes, sincronizações
- Métricas de SLA
- Alertas de SLA

**Entregas**:
- ✅ SQL: Tabela `system.sla_metrics`
- ✅ Backend: Monitoramento de tarefas
- ✅ Frontend: Dashboard de SLA
- ✅ Alertas: SLA não cumprido

**Esforço**: 2 semanas

**Total Fase 7**: 7 semanas

---

## 📋 Modelo de Dados - Novas Tabelas

### Tabelas Prioritárias (Fase 0)

```sql
-- Evidence Packages
compliance.evidence_packages (
    id UUID PRIMARY KEY,
    control_id UUID REFERENCES compliance.controls(id),
    assessment_id UUID REFERENCES compliance.assessments(id),
    package_name VARCHAR(255),
    hash VARCHAR(128), -- SHA-256
    status VARCHAR(20), -- draft, submitted, reviewed, approved, locked
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    locked_at TIMESTAMP,
    rejection_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Attestations
compliance.attestations (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id),
    scope VARCHAR(100), -- control, assessment, installation
    scope_id UUID,
    statement TEXT,
    signed_at TIMESTAMP,
    signature_hash VARCHAR(128),
    metadata JSONB,
    created_at TIMESTAMP
)

-- Control Exceptions
compliance.control_exceptions (
    id UUID PRIMARY KEY,
    control_id UUID REFERENCES compliance.controls(id),
    assessment_id UUID REFERENCES compliance.assessments(id),
    justification TEXT,
    approver_id UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    due_date DATE,
    risk_residual TEXT,
    status VARCHAR(20), -- pending, approved, expired
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Control Mappings (Crosswalk)
compliance.control_mappings (
    id UUID PRIMARY KEY,
    source_framework_id UUID REFERENCES compliance.frameworks(id),
    source_control_id UUID REFERENCES compliance.controls(id),
    target_framework_id UUID REFERENCES compliance.frameworks(id),
    target_control_id UUID REFERENCES compliance.controls(id),
    mapping_type VARCHAR(20), -- exact, partial, related
    confidence DECIMAL(3,2),
    metadata JSONB,
    created_at TIMESTAMP
)
```

### Tabelas Fase 2 (Risco OT)

```sql
-- OT Risks
risk.ot_risks (
    id UUID PRIMARY KEY,
    asset_id UUID REFERENCES security.assets(id),
    zone VARCHAR(100),
    protocol VARCHAR(50),
    scenario VARCHAR(100), -- falha_controle, comando_indevido, perda_telemetria, lateral_movement
    likelihood DECIMAL(3,2),
    impact_vector JSONB, -- {security, operation, financial, regulatory}
    risk_score DECIMAL(5,2),
    treatment_plan_id UUID REFERENCES risk.treatment_plans(id),
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Treatment Plans
risk.treatment_plans (
    id UUID PRIMARY KEY,
    risk_id UUID REFERENCES risk.ot_risks(id),
    treatment_type VARCHAR(20), -- mitigate, accept, transfer, avoid
    cost DECIMAL(12,2),
    deadline DATE,
    risk_residual DECIMAL(5,2),
    status VARCHAR(20),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Tabelas Fase 3 (Operação)

```sql
-- OT Changes
ops.ot_changes (
    id UUID PRIMARY KEY,
    type VARCHAR(50), -- firmware, config, patch, access
    asset_id UUID REFERENCES security.assets(id),
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    impact TEXT,
    backout_plan TEXT,
    cyber_risk_score DECIMAL(3,2),
    approvals JSONB, -- [{role, user_id, approved_at}]
    result TEXT,
    status VARCHAR(20), -- requested, approved, executed, verified, cancelled
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- OT Backups
ops.ot_backups (
    id UUID PRIMARY KEY,
    asset_id UUID REFERENCES security.assets(id),
    type VARCHAR(50), -- config, firmware, parameters
    location VARCHAR(500),
    frequency VARCHAR(50), -- daily, weekly, monthly, on_change
    last_backup_at TIMESTAMP,
    last_restore_test_at TIMESTAMP,
    restore_test_result TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- OT Baselines
ops.ot_baselines (
    id UUID PRIMARY KEY,
    asset_id UUID REFERENCES security.assets(id),
    baseline_version VARCHAR(50),
    firmware_version VARCHAR(50),
    parameters JSONB,
    hash VARCHAR(128),
    verified_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Tabelas Fase 4 (Incidentes)

```sql
-- ANEEL Incident Classifications
security.aneel_incident_classifications (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES security.incidents(id),
    classification_questions JSONB,
    classification_score DECIMAL(5,2),
    is_major_impact BOOLEAN,
    aneel_notification_required BOOLEAN,
    notified_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP
)

-- OT Playbooks
security.ot_playbooks (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    scenario VARCHAR(100), -- ransomware_hmi, rtu_compromised, link_loss, cred_leak
    steps JSONB, -- [{step, responsible, target_time}]
    last_tested_at TIMESTAMP,
    test_result TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Post Incident Reviews
security.post_incident_reviews (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES security.incidents(id),
    lessons_learned TEXT,
    corrective_actions JSONB,
    effectiveness_verification TEXT,
    closed_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Tabelas Fase 5 (Monitoramento)

```sql
-- SIEM Metadata
monitoring.siem_metadata (
    id UUID PRIMARY KEY,
    siem_type VARCHAR(50), -- splunk, qradar, sentinel, etc
    alert_count INTEGER,
    open_cases INTEGER,
    closed_cases INTEGER,
    avg_response_time INTEGER, -- seconds
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP
)

-- Security Findings
security.findings (
    id UUID PRIMARY KEY,
    source VARCHAR(50), -- scanner, siem, manual
    asset_id UUID REFERENCES security.assets(id),
    control_id UUID REFERENCES compliance.controls(id),
    cve_id VARCHAR(50),
    cvss_score DECIMAL(3,1),
    severity VARCHAR(20),
    due_date DATE,
    status VARCHAR(20), -- open, in_progress, resolved, accepted
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Tabelas Fase 6 (Governança)

```sql
-- RACI Assignments
compliance.raci_assignments (
    id UUID PRIMARY KEY,
    framework_id UUID REFERENCES compliance.frameworks(id),
    control_id UUID REFERENCES compliance.controls(id),
    responsible_id UUID REFERENCES auth.users(id),
    accountable_id UUID REFERENCES auth.users(id),
    consulted_ids UUID[],
    informed_ids UUID[],
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Access Recertifications
compliance.access_recertifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    access_type VARCHAR(50), -- privileged, third_party, ot_access
    scope TEXT,
    frequency VARCHAR(50), -- quarterly, semiannual, annual
    last_recertified_at TIMESTAMP,
    next_recertification_due DATE,
    attestation_id UUID REFERENCES compliance.attestations(id),
    status VARCHAR(20), -- pending, completed, overdue
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Training Records
compliance.training_records (
    id UUID PRIMARY KEY,
    control_id UUID REFERENCES compliance.controls(id),
    user_id UUID REFERENCES auth.users(id),
    training_name VARCHAR(255),
    completed_at TIMESTAMP,
    expires_at DATE,
    certificate_path VARCHAR(500),
    metadata JSONB,
    created_at TIMESTAMP
)
```

### Tabelas Fase 7 (Produto)

```sql
-- Plan Features
public.plan_features (
    id UUID PRIMARY KEY,
    plan_name VARCHAR(50), -- core, pro, enterprise
    feature_code VARCHAR(100),
    feature_name VARCHAR(255),
    limit_value INTEGER, -- NULL = unlimited
    metadata JSONB,
    created_at TIMESTAMP
)

-- SLA Metrics
system.sla_metrics (
    id UUID PRIMARY KEY,
    task_type VARCHAR(50), -- report_generation, reminder, sync
    task_id UUID,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    sla_target INTEGER, -- seconds
    status VARCHAR(20), -- pending, in_progress, completed, failed
    metadata JSONB,
    created_at TIMESTAMP
)
```

---

## 📊 Cronograma Consolidado

### Fase 0: Próximos 30-60 Dias (P0 - Crítico)
- **Duração**: 12 semanas (3 meses)
- **Blocos**: Evidência & Attestation, Exceções & Crosswalk, Mudanças OT & Backups, Relatórios 1-clique, KPIs/SLOs

### Fase 1: Conformidade & Evidências (P1 - Alto)
- **Duração**: 4 semanas
- **Dependências**: Fase 0

### Fase 2: Risco OT (P1 - Alto)
- **Duração**: 7 semanas
- **Dependências**: Fase 0 e Fase 1

### Fase 3: Operação Segura (P1 - Alto)
- **Duração**: 4 semanas
- **Dependências**: Fase 0 e Fase 2

### Fase 4: Incidentes & Resposta (P1 - Alto)
- **Duração**: 7 semanas
- **Dependências**: Fase 0 e Fase 2

### Fase 5: Monitoramento & Integração (P2 - Médio)
- **Duração**: 6 semanas
- **Dependências**: Fase 0 e Fase 2

### Fase 6: Governança & Pessoas (P2 - Médio)
- **Duração**: 8 semanas
- **Dependências**: Fase 0 e Fase 1

### Fase 7: Produto Multi-Tenant (P2 - Médio)
- **Duração**: 7 semanas
- **Dependências**: Todas as fases anteriores

**Total Estimado**: 55 semanas (13-14 meses) com 1 pessoa

**Com equipe de 2 pessoas**: 27-28 semanas (6-7 meses)

**Com equipe de 4 pessoas**: 14-15 semanas (3-4 meses)

---

## 🎯 Priorização e Sequenciamento

### Sprint 1-3 (Fase 0.1): Evidência & Attestation
**Duração**: 4 semanas  
**Prioridade**: P0

### Sprint 4-5 (Fase 0.2): Exceções & Crosswalk
**Duração**: 3 semanas  
**Prioridade**: P0

### Sprint 6-7 (Fase 0.3): Mudanças OT & Backups
**Duração**: 3 semanas  
**Prioridade**: P0

### Sprint 8-9 (Fase 0.4): Relatórios 1-clique
**Duração**: 2 semanas  
**Prioridade**: P0

### Sprint 10-11 (Fase 0.5): KPIs/SLOs
**Duração**: 2 semanas  
**Prioridade**: P0

**Total Fase 0**: 14 semanas (3,5 meses)

---

## 📦 Entregas por Fase

### Fase 0: Entregas Imediatas

1. **SQL Completo**
   - Tabelas de evidence packages, attestations, exceptions, mappings
   - Tabelas de mudanças OT, backups, baselines
   - Views para relatórios e KPIs
   - Funções de cálculo

2. **2 Páginas Next.js**
   - `/dashboard/compliance/reports/aneel`
   - `/dashboard/compliance/reports/ons`

3. **Seed JSON**
   - KPIs/SLOs com exemplos
   - Evidence packages de exemplo
   - Attestations de exemplo

4. **APIs**
   - CRUD de evidence packages
   - Endpoints de assinatura
   - Geração de relatórios
   - Endpoints de KPIs

---

## 🔗 Dependências e Pré-requisitos

### Dependências Técnicas

- ✅ Supabase PostgreSQL (já configurado)
- ✅ Supabase Auth (já configurado)
- ✅ Supabase Storage (já configurado)
- ✅ Next.js 15 (já configurado)
- 📋 Bibliotecas adicionais (PDF, CSV export)

### Dependências de Negócio

- ✅ Frameworks ANEEL e ONS cadastrados (já feito)
- ✅ Controles mapeados (já feito)
- 📋 Entendimento dos processos de conformidade
- 📋 Aprovação de stakeholders

---

## 📈 Métricas de Sucesso

### Fase 0 (Próximos 30-60 dias)

- ✅ **Evidências**: 100% dos controles com evidence packages
- ✅ **Attestations**: 100% dos responsáveis com assinatura
- ✅ **Exceções**: 100% das exceções documentadas
- ✅ **Relatórios**: 2 relatórios prontos (ANEEL e ONS)
- ✅ **KPIs**: 8 KPIs principais no dashboard

### Fase 1-7 (Médio Prazo)

- ✅ **Conformidade**: 95%+ de conformidade medido
- ✅ **Riscos**: 100% dos riscos OT registrados
- ✅ **Mudanças**: 100% das mudanças OT documentadas
- ✅ **Incidentes**: 100% dos incidentes classificados
- ✅ **Integrações**: SIEM e scanners integrados
- ✅ **Multi-tenant**: 3+ clientes em produção

---

## 🚀 Próximos Passos Imediatos

### Semana 1-2: Evidence Packages

1. Criar tabela `compliance.evidence_packages`
2. Criar API endpoints (CRUD)
3. Criar interface de upload
4. Implementar hash e timestamp

### Semana 3-4: Attestations

1. Criar tabela `compliance.attestations`
2. Criar API endpoints de assinatura
3. Criar interface de assinatura
4. Implementar geração de PDF

### Semana 5-6: Crosswalk

1. Criar tabela `compliance.control_mappings`
2. Criar lógica de mapeamento
3. Criar interface de crosswalk
4. Implementar reaproveitamento automático

### Semana 7-8: Exceções

1. Criar tabela `compliance.control_exceptions`
2. Criar API endpoints
3. Criar interface de exceções
4. Implementar workflow de aprovação

---

## 📚 Documentação Adicional

### Scripts SQL a Criar

- `supabase-create-evidence-packages.sql`
- `supabase-create-attestations.sql`
- `supabase-create-exceptions.sql`
- `supabase-create-crosswalk.sql`
- `supabase-create-ot-changes.sql`
- `supabase-create-ot-backups.sql`
- `supabase-create-ot-risks.sql`
- `supabase-create-playbooks.sql`

### Páginas Next.js a Criar

- `/dashboard/compliance/evidence/packages`
- `/dashboard/compliance/attestations`
- `/dashboard/compliance/exceptions`
- `/dashboard/compliance/crosswalk`
- `/dashboard/ops/changes`
- `/dashboard/ops/backups`
- `/dashboard/risk/ot-risks`
- `/dashboard/security/playbooks`
- `/dashboard/compliance/reports/aneel`
- `/dashboard/compliance/reports/ons`

### APIs a Criar

- `/api/compliance/evidence-packages`
- `/api/compliance/attestations`
- `/api/compliance/exceptions`
- `/api/compliance/crosswalk`
- `/api/ops/changes`
- `/api/ops/backups`
- `/api/risk/ot-risks`
- `/api/security/playbooks`
- `/api/compliance/reports/aneel`
- `/api/compliance/reports/ons`

---

## ✅ Checklist de Implementação

### Fase 0.1: Evidence Packages
- [ ] Tabela `compliance.evidence_packages` criada
- [ ] API endpoints criados
- [ ] Interface de upload criada
- [ ] Hash e timestamp implementados
- [ ] Workflow de aprovação implementado

### Fase 0.2: Attestations
- [ ] Tabela `compliance.attestations` criada
- [ ] API endpoints de assinatura criados
- [ ] Interface de assinatura criada
- [ ] Geração de PDF implementada

### Fase 0.3: Crosswalk
- [ ] Tabela `compliance.control_mappings` criada
- [ ] Lógica de mapeamento implementada
- [ ] Interface de crosswalk criada
- [ ] Reaproveitamento automático implementado

### Fase 0.4: Exceções
- [ ] Tabela `compliance.control_exceptions` criada
- [ ] API endpoints criados
- [ ] Interface de exceções criada
- [ ] Workflow de aprovação implementado

### Fase 0.5: Relatórios
- [ ] Relatório ANEEL criado
- [ ] Relatório ONS criado
- [ ] Export PDF implementado
- [ ] Export CSV implementado

### Fase 0.6: KPIs
- [ ] Views de KPIs criadas
- [ ] API endpoints de KPIs criados
- [ ] Cards de KPIs no dashboard criados
- [ ] Gráficos de tendências criados

---

**Data**: 2025-01-04  
**Versão**: 1.0  
**Status**: 📋 Planejado  
**Próxima Revisão**: Após implementação da Fase 0

