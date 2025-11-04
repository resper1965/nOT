# 🚀 Plano de Integração IA e Operação Total Supabase

**Data**: 2025-01-04  
**Versão**: 2.0  
**Status**: 📋 Planejado  
**Objetivo**: Evoluir o ness. OT GRC para operação totalmente integrada em Supabase, com IA nativa para avaliação de conformidade

---

## 🎯 Objetivo Principal

Evoluir o **ness. OT GRC** para operação totalmente integrada em Supabase, com IA nativa para avaliação de conformidade, minimização de ambientes e ingestão automática de dados de Wazuh, Zabbix, RMMs e Shuffle.

### Diretrizes Principais

- ✅ **Utilizar apenas Supabase** (PostgreSQL, Auth, Storage, Edge Functions) e Next.js (Vercel)
- ✅ **Evitar novas dependências externas**
- ✅ **Foco em unificar**: conformidade, eventos e IA em um ciclo contínuo
- ✅ **IA interpreta eventos** e gera avaliações automáticas de conformidade e risco
- ✅ **Priorizar**: simplicidade operacional, trilha de auditoria, baixo custo de manutenção

---

## 📊 Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                    SHUFFLE (Hub de Coleta)                   │
│  Wazuh | Zabbix | Datto | Atera | SuperOps → Normalização   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST + HMAC
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS                         │
│  /api/ingest/wazuh  |  /api/ingest/zabbix  |  /api/ingest/rmm │
│  /agent/evaluate (IA de Conformidade)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE POSTGRESQL                              │
│  integration.* | security.* | compliance.* | audit.*         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS DASHBOARD (Vercel)                      │
│  IA de Conformidade | Relatórios | KPIs                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Banco de Dados - Schema Expansion

### Schema: `integration`

#### Tabela: `integration.sources`

**Propósito**: Registrar origens de dados (Wazuh, Zabbix, Shuffle, RMMs)

```sql
CREATE TABLE integration.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('wazuh', 'zabbix', 'shuffle', 'datto', 'atera', 'superops', 'custom')),
    source_name VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT, -- Criptografado
    hmac_secret_encrypted TEXT, -- Criptografado
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    sync_frequency_minutes INTEGER DEFAULT 15,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, source_type, source_name)
);

CREATE INDEX idx_sources_tenant ON integration.sources(tenant_id);
CREATE INDEX idx_sources_type ON integration.sources(source_type);
CREATE INDEX idx_sources_active ON integration.sources(is_active);
```

#### Tabela: `integration.events`

**Propósito**: Armazenar eventos normalizados vindos das fontes

```sql
CREATE TABLE integration.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    source_id UUID REFERENCES integration.sources(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- security, availability, patch, inventory, incident
    event_type VARCHAR(100) NOT NULL, -- alert, metric, change, discovery
    asset_ref VARCHAR(500), -- Referência ao ativo (IP, hostname, UUID)
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    payload JSONB NOT NULL, -- Evento normalizado completo
    occurred_at TIMESTAMP NOT NULL, -- Quando o evento ocorreu na origem
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Quando chegou ao Supabase
    processed_at TIMESTAMP, -- Quando foi processado pela IA
    processed_by VARCHAR(50), -- 'ai' ou 'manual'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_tenant ON integration.events(tenant_id);
CREATE INDEX idx_events_source ON integration.events(source_id);
CREATE INDEX idx_events_category ON integration.events(category);
CREATE INDEX idx_events_asset_ref ON integration.events(asset_ref);
CREATE INDEX idx_events_occurred_at ON integration.events(occurred_at DESC);
CREATE INDEX idx_events_processed ON integration.events(processed_at) WHERE processed_at IS NULL;
CREATE INDEX idx_events_payload ON integration.events USING GIN (payload);
```

### Schema: `security` (Expansão)

#### Tabela: `security.assets` (Atualizar)

**Adicionar campos**:
- `tenant_id UUID REFERENCES public.clients(id)`
- `criticity VARCHAR(20)` -- critical, high, medium, low
- `zone VARCHAR(50)` -- IT, DMZ, OT, DMZ-OT, External
- `asset_type VARCHAR(50)` -- server, switch, router, firewall, plc, rtu, hmi

#### Tabela: `security.findings` (Expandir)

**Adicionar campos**:
- `tenant_id UUID REFERENCES public.clients(id)`
- `source_event_id UUID REFERENCES integration.events(id)`
- `correlated_asset_id UUID REFERENCES security.assets(id)`
- `mitre_technique_id VARCHAR(50)` -- T1001, T1055, etc
- `mitre_tactic_id VARCHAR(50)` -- TA0001, TA0002, etc

### Schema: `compliance` (Expansão)

#### Tabela: `compliance.control_crosswalk` (Nova)

**Propósito**: Mapear controles equivalentes entre frameworks

```sql
CREATE TABLE compliance.control_crosswalk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    source_framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    source_control_id UUID REFERENCES compliance.controls(id) ON DELETE CASCADE,
    target_framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    target_control_id UUID REFERENCES compliance.controls(id) ON DELETE CASCADE,
    mapping_type VARCHAR(20) CHECK (mapping_type IN ('exact', 'partial', 'related')),
    confidence DECIMAL(3,2) DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
    evidence_event_ids UUID[], -- IDs de eventos que suportam o mapeamento
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, source_framework_id, source_control_id, target_framework_id, target_control_id)
);

CREATE INDEX idx_crosswalk_tenant ON compliance.control_crosswalk(tenant_id);
CREATE INDEX idx_crosswalk_source ON compliance.control_crosswalk(source_framework_id, source_control_id);
CREATE INDEX idx_crosswalk_target ON compliance.control_crosswalk(target_framework_id, target_control_id);
```

#### Tabela: `compliance.ai_assessments` (Nova)

**Propósito**: Armazenar resultados das análises automáticas da IA

```sql
CREATE TABLE compliance.ai_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    scope VARCHAR(100) NOT NULL, -- 'control', 'assessment', 'incident', 'event', 'risk'
    scope_id UUID NOT NULL, -- ID do controle, avaliação, incidente, evento ou risco
    assessment_type VARCHAR(50) NOT NULL, -- 'conformity', 'risk', 'attack', 'exception'
    model_used VARCHAR(50) DEFAULT 'gpt-4o', -- gpt-4o, llama-3.1, etc
    result_json JSONB NOT NULL, -- Resultado completo da análise
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    recommendations JSONB, -- Ações recomendadas
    evidence_event_ids UUID[], -- IDs de eventos que suportam a análise
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by VARCHAR(50) DEFAULT 'ai',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_assessments_tenant ON compliance.ai_assessments(tenant_id);
CREATE INDEX idx_ai_assessments_scope ON compliance.ai_assessments(scope, scope_id);
CREATE INDEX idx_ai_assessments_type ON compliance.ai_assessments(assessment_type);
CREATE INDEX idx_ai_assessments_processed ON compliance.ai_assessments(processed_at DESC);
CREATE INDEX idx_ai_assessments_result ON compliance.ai_assessments USING GIN (result_json);
```

### Schema: `audit` (Expansão)

#### Tabela: `audit.events` (Expandir)

**Adicionar campos**:
- `tenant_id UUID REFERENCES public.clients(id)`
- `entity_type VARCHAR(100)` -- Tipo de entidade modificada
- `entity_id UUID` -- ID da entidade modificada
- `action VARCHAR(50)` -- create, update, delete, approve, reject
- `before JSONB` -- Estado anterior
- `after JSONB` -- Estado posterior
- `actor UUID REFERENCES auth.users(id)`
- `timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `hash VARCHAR(128)` -- SHA-256 do evento para integridade

---

## ⚡ Supabase Edge Functions

### 1. `/api/ingest/wazuh`

**Função**: Recebe eventos do Wazuh via Shuffle

**Endpoint**: `https://[project].supabase.co/functions/v1/ingest-wazuh`

**Método**: POST

**Autenticação**: HMAC header

**Ações**:
1. Validar HMAC signature
2. Normalizar evento Wazuh para JSON padrão
3. Inserir em `integration.events`
4. Correlacionar com `security.assets`
5. Criar `security.findings` se necessário
6. Criar `security.incidents` se severidade >= high
7. Disparar avaliação IA assíncrona se evento crítico

**Payload de entrada**:
```json
{
  "source": "wazuh",
  "event": {
    "id": "wazuh-event-id",
    "timestamp": "2025-01-04T10:00:00Z",
    "agent": {
      "id": "agent-id",
      "name": "hostname",
      "ip": "192.168.1.100"
    },
    "rule": {
      "id": 1001,
      "description": "Rule description",
      "level": 12,
      "mitre": {
        "technique": "T1001",
        "tactic": "TA0001"
      }
    },
    "data": { ... }
  }
}
```

### 2. `/api/ingest/zabbix`

**Função**: Recebe métricas de disponibilidade

**Endpoint**: `https://[project].supabase.co/functions/v1/ingest-zabbix`

**Método**: POST

**Ações**:
1. Validar HMAC signature
2. Normalizar métrica Zabbix
3. Inserir em `integration.events` (category: 'availability')
4. Atualizar conformidade de OPS-05 (continuidade operacional)
5. Atualizar `compliance.control_results` se disponibilidade < 99.9%

### 3. `/api/ingest/rmm`

**Função**: Recebe patch/inventário de RMMs (Datto, Atera, SuperOps)

**Endpoint**: `https://[project].supabase.co/functions/v1/ingest-rmm`

**Método**: POST

**Ações**:
1. Validar HMAC signature
2. Normalizar dados do RMM
3. Inserir em `integration.events` (category: 'patch' ou 'inventory')
4. Atualizar `security.assets` com informações de inventário
5. Atualizar conformidade ONS-08 (gestão de patches)
6. Atualizar `compliance.control_results`

### 4. `/agent/evaluate`

**Função**: Agente de IA de conformidade

**Endpoint**: `https://[project].supabase.co/functions/v1/agent-evaluate`

**Método**: POST

**Ações**:
1. Receber contexto (eventos, controles, histórico)
2. Chamar API OpenAI (GPT-4o) ou Llama 3.1
3. Analisar conformidade e riscos
4. Gerar recomendações
5. Armazenar resultado em `compliance.ai_assessments`
6. Atualizar `compliance.control_results` se necessário
7. Criar `security.findings` se riscos identificados

**Payload de entrada**:
```json
{
  "scope": "control",
  "scope_id": "control-uuid",
  "event_ids": ["event-uuid-1", "event-uuid-2"],
  "context": {
    "recent_events_count": 10,
    "time_window_hours": 24,
    "include_mitre": true
  }
}
```

**Payload de saída**:
```json
{
  "assessment_id": "uuid",
  "confidence": 0.95,
  "result": {
    "conformity_status": "compliant",
    "risk_level": "low",
    "mitre_techniques": ["T1001", "T1055"],
    "recommendations": [
      {
        "action": "update_firewall_rule",
        "priority": "high",
        "description": "..."
      }
    ],
    "evidence_summary": "..."
  }
}
```

---

## 🤖 IA de Conformidade - Detalhes

### Modelo de IA

**Preferência**: OpenAI GPT-4o (via API direta)

**Alternativa**: Llama 3.1 (via Supabase Function)

### Prompt Template

```
Você é um especialista em conformidade regulatória OT/IT para o setor elétrico brasileiro.

Contexto:
- Framework: {framework_name}
- Controle: {control_code} - {control_title}
- Eventos recentes: {event_summary}
- Histórico de conformidade: {compliance_history}

Analise:
1. O status atual de conformidade do controle
2. Riscos identificados baseados em MITRE ATT&CK
3. Violações potenciais ou confirmadas
4. Recomendações de ações corretivas

Responda em JSON estruturado:
{
  "conformity_status": "compliant" | "partially_compliant" | "non_compliant" | "not_applicable",
  "confidence": 0.0-1.0,
  "risk_level": "critical" | "high" | "medium" | "low",
  "mitre_techniques": ["T1001", "T1055"],
  "violations": [
    {
      "type": "regulatory" | "technical" | "operational",
      "description": "...",
      "severity": "critical" | "high" | "medium" | "low"
    }
  ],
  "recommendations": [
    {
      "action": "...",
      "priority": "critical" | "high" | "medium" | "low",
      "description": "...",
      "estimated_effort_hours": 10
    }
  ],
  "evidence_summary": "..."
}
```

### Integração com Eventos

**Correlação automática**:
- Eventos Wazuh → MITRE ATT&CK → Controles de segurança
- Eventos Zabbix → Disponibilidade → Controles de continuidade
- Eventos RMM → Patches → Controles de gestão de patches

### Armazenamento de Resultados

**Tabela**: `compliance.ai_assessments`

**Campos principais**:
- `scope`: Tipo de avaliação (control, assessment, incident, event, risk)
- `scope_id`: ID do item avaliado
- `result_json`: Resultado completo da IA
- `confidence`: Confiança da avaliação (0.0-1.0)
- `recommendations`: Ações recomendadas
- `evidence_event_ids`: IDs dos eventos que suportam a análise

---

## 🔄 Automação e Regras

### Triggers SQL

#### 1. Gerar Evidence Packages Automaticamente

```sql
CREATE OR REPLACE FUNCTION compliance.auto_generate_evidence_package()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando um controle muda para "compliant" e há eventos de suporte
    IF NEW.status = 'compliant' AND OLD.status != 'compliant' THEN
        -- Criar evidence package automaticamente
        INSERT INTO compliance.evidence_packages (
            control_id,
            assessment_id,
            package_name,
            description,
            hash,
            status
        )
        SELECT
            NEW.control_id,
            NEW.assessment_id,
            'Evidências Automáticas - ' || c.control_code,
            'Pacote gerado automaticamente quando o controle foi marcado como conforme.',
            encode(digest(NEW.id::TEXT || CURRENT_TIMESTAMP::TEXT, 'sha256'), 'hex'),
            'draft'
        FROM compliance.controls c
        WHERE c.id = NEW.control_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_evidence_package
    AFTER UPDATE ON compliance.control_results
    FOR EACH ROW
    WHEN (NEW.status = 'compliant' AND OLD.status != 'compliant')
    EXECUTE FUNCTION compliance.auto_generate_evidence_package();
```

#### 2. Criar Exceções Automaticamente

```sql
CREATE OR REPLACE FUNCTION compliance.auto_create_exception()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando um controle permanece "non_compliant" por mais de 30 dias
    IF NEW.status = 'non_compliant' AND 
       NOT EXISTS (
           SELECT 1 FROM compliance.control_exceptions ce
           WHERE ce.control_id = NEW.control_id
           AND ce.status = 'approved'
       ) AND
       (CURRENT_DATE - NEW.updated_at::DATE) > 30 THEN
        -- Criar exceção automaticamente
        INSERT INTO compliance.control_exceptions (
            control_id,
            assessment_id,
            justification,
            status,
            due_date
        )
        VALUES (
            NEW.control_id,
            NEW.assessment_id,
            'Exceção criada automaticamente após 30 dias de não conformidade.',
            'pending',
            CURRENT_DATE + INTERVAL '90 days'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_exception
    AFTER UPDATE ON compliance.control_results
    FOR EACH ROW
    WHEN (NEW.status = 'non_compliant' AND (CURRENT_DATE - NEW.updated_at::DATE) > 30)
    EXECUTE FUNCTION compliance.auto_create_exception();
```

#### 3. Atualizar Control Results com IA

```sql
CREATE OR REPLACE FUNCTION compliance.update_control_result_from_ai()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando uma avaliação IA é criada para um controle
    IF NEW.scope = 'control' AND NEW.assessment_type = 'conformity' THEN
        -- Atualizar control_results se confiança > 0.8
        IF NEW.confidence > 0.8 THEN
            UPDATE compliance.control_results cr
            SET
                status = (NEW.result_json->>'conformity_status')::VARCHAR,
                evidence = NEW.result_json->>'evidence_summary',
                metadata = jsonb_build_object(
                    'ai_assessment_id', NEW.id,
                    'ai_confidence', NEW.confidence,
                    'ai_processed_at', NEW.processed_at
                ) || COALESCE(cr.metadata, '{}'::jsonb),
                updated_at = CURRENT_TIMESTAMP
            WHERE cr.control_id = NEW.scope_id
            AND cr.assessment_id = (
                SELECT assessment_id 
                FROM compliance.assessments 
                WHERE id IN (
                    SELECT assessment_id 
                    FROM compliance.control_results 
                    WHERE control_id = NEW.scope_id 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_control_result_from_ai
    AFTER INSERT ON compliance.ai_assessments
    FOR EACH ROW
    WHEN (NEW.scope = 'control' AND NEW.assessment_type = 'conformity')
    EXECUTE FUNCTION compliance.update_control_result_from_ai();
```

### Cron Jobs (Supabase pg_cron)

#### 1. Processar Eventos Pendentes

```sql
-- Processar eventos não processados pela IA
SELECT cron.schedule(
    'process-pending-events',
    '*/15 * * * *', -- A cada 15 minutos
    $$
    SELECT net.http_post(
        url := 'https://[project].supabase.co/functions/v1/agent-evaluate',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object(
            'scope', 'event',
            'scope_id', e.id,
            'event_ids', ARRAY[e.id]::UUID[]
        )
    )
    FROM integration.events e
    WHERE e.processed_at IS NULL
    AND e.severity IN ('critical', 'high')
    AND e.occurred_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
    LIMIT 10;
    $$
);
```

#### 2. Avaliar Conformidade Periodicamente

```sql
-- Avaliar controles críticos a cada 6 horas
SELECT cron.schedule(
    'evaluate-critical-controls',
    '0 */6 * * *', -- A cada 6 horas
    $$
    SELECT net.http_post(
        url := 'https://[project].supabase.co/functions/v1/agent-evaluate',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object(
            'scope', 'control',
            'scope_id', c.id,
            'event_ids', (
                SELECT ARRAY_AGG(id)::UUID[]
                FROM integration.events
                WHERE asset_ref IN (
                    SELECT asset_ref 
                    FROM security.assets 
                    WHERE criticity = 'critical'
                )
                AND occurred_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
            )
        )
    )
    FROM compliance.controls c
    WHERE c.metadata->>'priority' = 'critical'
    AND c.id IN (
        SELECT control_id 
        FROM compliance.control_results 
        WHERE status != 'compliant'
        AND updated_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    )
    LIMIT 5;
    $$
);
```

---

## 🔗 Integrações via Shuffle

### Configuração Shuffle

**Função**: Hub de coleta e entrega

**Fluxo**:
1. Shuffle puxa dados das APIs (Wazuh, Zabbix, Datto, Atera, SuperOps)
2. Normaliza para JSON padrão
3. Adiciona metadados (tenant_id, source_type, timestamp)
4. Calcula HMAC signature
5. Envia via HTTP POST para Edge Functions Supabase

### Autenticação HMAC

**Algoritmo**: HMAC-SHA256

**Header**: `X-Supabase-Signature`

**Cálculo**:
```
signature = HMAC-SHA256(secret_key, payload_json_string)
header = "X-Supabase-Signature: " + base64(signature)
```

### Payload Padrão

```json
{
  "tenant_id": "tenant-uuid",
  "source": {
    "type": "wazuh",
    "name": "wazuh-production",
    "id": "source-uuid"
  },
  "event": {
    "id": "event-id",
    "category": "security",
    "type": "alert",
    "severity": "high",
    "asset_ref": "192.168.1.100",
    "payload": { ... },
    "occurred_at": "2025-01-04T10:00:00Z"
  }
}
```

---

## 🎨 Interface Next.js - Novas Páginas

### 1. Aba "IA de Conformidade"

**Rota**: `/dashboard/compliance/ai`

**Componentes**:
- `AIInsights.tsx` - Insights e recomendações
- `AIRiskAssessment.tsx` - Avaliação de riscos emergentes
- `AIRecommendations.tsx` - Ações recomendadas
- `AIComplianceStatus.tsx` - Status de conformidade por IA

**Funcionalidades**:
- Visualizar avaliações IA recentes
- Filtrar por framework, controle, severidade
- Comparar status humano vs IA
- Ver confiança das avaliações
- Acessar recomendações detalhadas

### 2. Botão "Gerar Avaliação IA"

**Localização**: 
- Página de controle (`/dashboard/compliance/frameworks/[id]/controls/[control_id]`)
- Página de avaliação (`/dashboard/compliance/assessments/[id]`)

**Ação**:
- Dispara `POST /api/agent/evaluate`
- Mostra loading state
- Exibe resultado em modal ou página dedicada

### 3. Painel Consolidado por Controle

**Rota**: `/dashboard/compliance/controls/[id]`

**Componentes**:
- `ControlStatusComparison.tsx` - Status humano vs IA lado a lado
- `ControlEventsTimeline.tsx` - Timeline de eventos relacionados
- `ControlAIHistory.tsx` - Histórico de avaliações IA
- `ControlRecommendations.tsx` - Recomendações ativas

### 4. Relatórios 1-clique ANEEL/ONS

**Rotas**:
- `/dashboard/compliance/reports/aneel`
- `/dashboard/compliance/reports/ons`

**Melhorias**:
- Incluir avaliações IA automaticamente
- Anexar evidence packages gerados automaticamente
- Indicadores automáticos de conformidade
- Export PDF/CSV com dados completos

---

## 📊 Métricas e KPIs

### KPIs Principais

1. **% controles com evidência automática**
   ```sql
   SELECT 
       COUNT(*) FILTER (WHERE ep.status = 'approved') * 100.0 / 
       COUNT(*) AS auto_evidence_percentage
   FROM compliance.control_results cr
   LEFT JOIN compliance.evidence_packages ep ON cr.control_id = ep.control_id
   WHERE ep.metadata->>'auto_generated' = 'true';
   ```

2. **% incidentes classificados corretamente pela IA**
   ```sql
   SELECT 
       COUNT(*) FILTER (WHERE ai.confidence > 0.8) * 100.0 / 
       COUNT(*) AS ai_classification_accuracy
   FROM security.incidents i
   JOIN compliance.ai_assessments ai ON i.id = ai.scope_id
   WHERE ai.scope = 'incident';
   ```

3. **Tempo médio para restabelecer conformidade**
   ```sql
   SELECT 
       AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) AS avg_hours_to_compliance
   FROM compliance.control_results
   WHERE status = 'compliant'
   AND updated_at > created_at;
   ```

4. **% exceções abertas e encerradas**
   ```sql
   SELECT 
       status,
       COUNT(*) AS count,
       COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
   FROM compliance.control_exceptions
   GROUP BY status;
   ```

5. **MTTD e MTTR derivados de incidentes Wazuh + IA**
   ```sql
   SELECT 
       AVG(EXTRACT(EPOCH FROM (detected_at - occurred_at)) / 3600) AS mttd_hours,
       AVG(EXTRACT(EPOCH FROM (resolved_at - detected_at)) / 3600) AS mttr_hours
   FROM security.incidents
   WHERE source_event_id IS NOT NULL
   AND detected_at IS NOT NULL
   AND resolved_at IS NOT NULL;
   ```

---

## 🗓️ Fases de Implementação

### Fase 1: Foundation (4 semanas)

**Objetivo**: Estrutura base de integração

**Tarefas**:
1. Criar schemas `integration` e expandir `security`, `compliance`, `audit`
2. Criar tabelas: `integration.sources`, `integration.events`
3. Criar tabelas: `compliance.control_crosswalk`, `compliance.ai_assessments`
4. Implementar RLS em todas as tabelas
5. Criar triggers de auditoria

**Entregas**:
- ✅ SQL scripts completos
- ✅ RLS configurado
- ✅ Triggers criados

### Fase 2: Edge Functions - Ingestão (3 semanas)

**Objetivo**: Receber dados de fontes externas

**Tarefas**:
1. Criar `/api/ingest/wazuh`
2. Criar `/api/ingest/zabbix`
3. Criar `/api/ingest/rmm`
4. Implementar validação HMAC
5. Implementar normalização de eventos
6. Testar integração com Shuffle

**Entregas**:
- ✅ 3 Edge Functions funcionais
- ✅ Validação HMAC implementada
- ✅ Normalização de eventos funcionando

### Fase 3: IA de Conformidade (4 semanas)

**Objetivo**: Agente IA avaliando conformidade

**Tarefas**:
1. Criar `/agent/evaluate`
2. Implementar integração com OpenAI API
3. Criar prompt templates
4. Implementar correlação eventos → controles
5. Implementar armazenamento de resultados
6. Criar triggers de atualização automática

**Entregas**:
- ✅ Edge Function `/agent/evaluate` funcional
- ✅ Integração com OpenAI funcionando
- ✅ Resultados armazenados em `ai_assessments`
- ✅ Triggers de atualização automática

### Fase 4: Automação e Regras (2 semanas)

**Objetivo**: Automação completa

**Tarefas**:
1. Implementar triggers SQL (evidence packages automáticos, exceções automáticas)
2. Configurar cron jobs (pg_cron)
3. Implementar correlação eventos → controles → frameworks
4. Testar fluxo completo

**Entregas**:
- ✅ Triggers SQL funcionando
- ✅ Cron jobs configurados
- ✅ Fluxo completo testado

### Fase 5: Interface Next.js (3 semanas)

**Objetivo**: Interface completa para IA

**Tarefas**:
1. Criar página `/dashboard/compliance/ai`
2. Criar componentes de insights e recomendações
3. Adicionar botão "Gerar Avaliação IA"
4. Criar painel consolidado por controle
5. Melhorar relatórios ANEEL/ONS com dados IA

**Entregas**:
- ✅ Página IA de Conformidade
- ✅ Componentes React funcionais
- ✅ Relatórios melhorados

### Fase 6: Integração Shuffle (2 semanas)

**Objetivo**: Integração completa com Shuffle

**Tarefas**:
1. Configurar workflows Shuffle
2. Testar integração Wazuh → Shuffle → Supabase
3. Testar integração Zabbix → Shuffle → Supabase
4. Testar integração RMM → Shuffle → Supabase
5. Documentar configuração

**Entregas**:
- ✅ Workflows Shuffle configurados
- ✅ Integrações testadas
- ✅ Documentação completa

**Total**: 18 semanas (4,5 meses)

---

## 📋 Checklist de Implementação

### Fase 1: Foundation
- [ ] Criar schema `integration`
- [ ] Criar tabela `integration.sources`
- [ ] Criar tabela `integration.events`
- [ ] Expandir schema `security` (assets, findings)
- [ ] Criar tabela `compliance.control_crosswalk`
- [ ] Criar tabela `compliance.ai_assessments`
- [ ] Expandir schema `audit` (events)
- [ ] Implementar RLS em todas as tabelas
- [ ] Criar triggers de auditoria

### Fase 2: Edge Functions - Ingestão
- [ ] Criar `/api/ingest/wazuh`
- [ ] Criar `/api/ingest/zabbix`
- [ ] Criar `/api/ingest/rmm`
- [ ] Implementar validação HMAC
- [ ] Implementar normalização de eventos
- [ ] Testar integração com Shuffle

### Fase 3: IA de Conformidade
- [ ] Criar `/agent/evaluate`
- [ ] Implementar integração OpenAI
- [ ] Criar prompt templates
- [ ] Implementar correlação eventos → controles
- [ ] Implementar armazenamento de resultados
- [ ] Criar triggers de atualização automática

### Fase 4: Automação e Regras
- [ ] Implementar trigger de evidence packages automáticos
- [ ] Implementar trigger de exceções automáticas
- [ ] Implementar trigger de atualização control_results
- [ ] Configurar cron jobs (pg_cron)
- [ ] Testar fluxo completo

### Fase 5: Interface Next.js
- [ ] Criar página `/dashboard/compliance/ai`
- [ ] Criar componentes de insights
- [ ] Adicionar botão "Gerar Avaliação IA"
- [ ] Criar painel consolidado por controle
- [ ] Melhorar relatórios ANEEL/ONS

### Fase 6: Integração Shuffle
- [ ] Configurar workflows Shuffle
- [ ] Testar integração Wazuh
- [ ] Testar integração Zabbix
- [ ] Testar integração RMM
- [ ] Documentar configuração

---

## 🎯 Resultados Esperados

### Plataforma Unificada

- ✅ **Sem backend intermediário**: Tudo em Supabase + Next.js
- ✅ **Coleta automática**: Dados de conformidade OT/IT coletados automaticamente
- ✅ **Agente IA**: Avaliando riscos e conformidade em tempo real
- ✅ **Auditoria regulatória**: Capacidade de auditoria instantânea (ANEEL/ONS)
- ✅ **Redução de manutenção**: Menos ambientes e dependências

### Métricas de Sucesso

- **% controles com evidência automática**: > 80%
- **% incidentes classificados corretamente pela IA**: > 90%
- **Tempo médio para restabelecer conformidade**: < 48 horas
- **MTTD**: < 1 hora
- **MTTR**: < 4 horas
- **% exceções em dia**: > 95%

---

## 📚 Documentação Adicional

### Scripts SQL a Criar

- `supabase-create-integration-schema.sql`
- `supabase-create-ai-assessments.sql`
- `supabase-create-control-crosswalk.sql`
- `supabase-create-automation-triggers.sql`
- `supabase-create-cron-jobs.sql`

### Edge Functions a Criar

- `supabase/functions/ingest-wazuh/index.ts`
- `supabase/functions/ingest-zabbix/index.ts`
- `supabase/functions/ingest-rmm/index.ts`
- `supabase/functions/agent-evaluate/index.ts`

### Páginas Next.js a Criar

- `/dashboard/compliance/ai`
- `/dashboard/compliance/ai/assessments/[id]`
- `/dashboard/compliance/controls/[id]/ai`

### Documentação a Criar

- `INSTRUCOES-CONFIGURAR-INTEGRACAO-SHUFFLE.md`
- `INSTRUCOES-CONFIGURAR-IA-CONFORMIDADE.md`
- `INSTRUCOES-CONFIGURAR-EDGE-FUNCTIONS.md`

---

**Data**: 2025-01-04  
**Versão**: 2.0  
**Status**: 📋 Planejado  
**Próxima Revisão**: Após implementação da Fase 1

