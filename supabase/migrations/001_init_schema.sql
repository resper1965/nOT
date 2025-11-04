-- ============================================================================
-- MIGRATION: 001_init_schema.sql
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- Versão: 1.0
-- ============================================================================
-- Criação dos schemas e tabelas principais para integração e IA
-- ============================================================================

-- ============================================================================
-- SCHEMAS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;

-- ============================================================================
-- INTEGRATION SCHEMA
-- ============================================================================

-- Tabela: integration.sources
-- Registra origens de dados (Wazuh, Zabbix, RMMs, etc)
CREATE TABLE IF NOT EXISTS integration.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('wazuh', 'zabbix', 'shuffle', 'datto', 'atera', 'superops', 'custom')),
    description TEXT,
    api_endpoint VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    sync_frequency_minutes INTEGER DEFAULT 15,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sources_tenant ON integration.sources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sources_code ON integration.sources(code);
CREATE INDEX IF NOT EXISTS idx_sources_type ON integration.sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_active ON integration.sources(is_active);

-- Tabela: integration.events
-- Armazena eventos normalizados vindos das fontes
CREATE TABLE IF NOT EXISTS integration.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    source_id UUID REFERENCES integration.sources(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- security, availability, patch, inventory, incident
    event_type VARCHAR(100), -- alert, metric, change, discovery
    asset_ref TEXT, -- Referência ao ativo (IP, hostname, UUID)
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    payload JSONB NOT NULL, -- Evento normalizado completo
    occurred_at TIMESTAMPTZ NOT NULL, -- Quando o evento ocorreu na origem
    received_at TIMESTAMPTZ DEFAULT NOW(), -- Quando chegou ao Supabase
    processed_at TIMESTAMPTZ, -- Quando foi processado pela IA
    processed_by VARCHAR(50), -- 'ai' ou 'manual'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_tenant ON integration.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_source ON integration.events(source_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON integration.events(category);
CREATE INDEX IF NOT EXISTS idx_events_asset_ref ON integration.events(asset_ref);
CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON integration.events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_processed ON integration.events(processed_at) WHERE processed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_payload ON integration.events USING GIN (payload);

-- ============================================================================
-- SECURITY SCHEMA
-- ============================================================================

-- Tabela: security.assets
-- Ativos OT/IT com criticidade e zona
CREATE TABLE IF NOT EXISTS security.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    asset_type VARCHAR(50), -- server, switch, router, firewall, plc, rtu, hmi
    zone TEXT CHECK (zone IN ('IT', 'DMZ', 'OT', 'DMZ-OT', 'External')),
    criticality TEXT CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
    ip_address INET,
    hostname VARCHAR(255),
    ext_refs JSONB DEFAULT '{}'::jsonb, -- Referências externas (Wazuh agent ID, Zabbix host ID, etc)
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_tenant ON security.assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_assets_zone ON security.assets(zone);
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON security.assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_ip ON security.assets(ip_address);
CREATE INDEX IF NOT EXISTS idx_assets_hostname ON security.assets(hostname);

-- Tabela: security.findings
-- Vulnerabilidades e achados correlacionados a ativos
CREATE TABLE IF NOT EXISTS security.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    source_event_id UUID REFERENCES integration.events(id) ON DELETE SET NULL,
    correlated_asset_id UUID REFERENCES security.assets(id) ON DELETE SET NULL,
    finding_type VARCHAR(50) NOT NULL, -- vulnerability, misconfiguration, incident, threat
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    cve_id VARCHAR(50),
    cvss_score DECIMAL(3,1),
    mitre_technique_id VARCHAR(50), -- T1001, T1055, etc
    mitre_tactic_id VARCHAR(50), -- TA0001, TA0002, etc
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'accepted', 'false_positive')),
    due_date DATE,
    remediation_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_findings_tenant ON security.findings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_findings_event ON security.findings(source_event_id);
CREATE INDEX IF NOT EXISTS idx_findings_asset ON security.findings(correlated_asset_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON security.findings(severity);
CREATE INDEX IF NOT EXISTS idx_findings_status ON security.findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_cve ON security.findings(cve_id);
CREATE INDEX IF NOT EXISTS idx_findings_mitre ON security.findings(mitre_technique_id);

-- ============================================================================
-- COMPLIANCE SCHEMA (Expansão)
-- ============================================================================

-- Tabela: compliance.ai_assessments
-- Armazena resultados das análises automáticas da IA
CREATE TABLE IF NOT EXISTS compliance.ai_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    scope TEXT NOT NULL, -- 'control', 'assessment', 'incident', 'event', 'risk'
    scope_id UUID NOT NULL, -- ID do controle, avaliação, incidente, evento ou risco
    assessment_type VARCHAR(50) NOT NULL, -- 'conformity', 'risk', 'attack', 'exception'
    model_used VARCHAR(50) DEFAULT 'gpt-4o', -- gpt-4o, llama-3.1, etc
    result_json JSONB NOT NULL, -- Resultado completo da análise
    confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    recommendations JSONB, -- Ações recomendadas
    evidence_event_ids UUID[], -- IDs de eventos que suportam a análise
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_by VARCHAR(50) DEFAULT 'ai',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_assessments_tenant ON compliance.ai_assessments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_scope ON compliance.ai_assessments(scope, scope_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_type ON compliance.ai_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_evaluated ON compliance.ai_assessments(evaluated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_result ON compliance.ai_assessments USING GIN (result_json);

-- ============================================================================
-- AUDIT SCHEMA (Expansão)
-- ============================================================================

-- Tabela: audit.events
-- Trilha de auditoria (entidade, ação, antes/depois, ator, timestamp, hash)
CREATE TABLE IF NOT EXISTS audit.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    entity_type VARCHAR(100) NOT NULL, -- Tipo de entidade modificada
    entity_id UUID NOT NULL, -- ID da entidade modificada
    action VARCHAR(50) NOT NULL, -- create, update, delete, approve, reject
    before JSONB, -- Estado anterior
    after JSONB, -- Estado posterior
    actor UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    hash VARCHAR(128), -- SHA-256 do evento para integridade
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_events_tenant ON audit.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit.events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit.events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit.events(actor);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit.events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_hash ON audit.events(hash);

-- ============================================================================
-- TRIGGERS: updated_at automático
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sources_updated_at
    BEFORE UPDATE ON integration.sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_assets_updated_at
    BEFORE UPDATE ON security.assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_findings_updated_at
    BEFORE UPDATE ON security.findings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON SCHEMA integration IS 'Schema para integração com fontes externas (Wazuh, Zabbix, RMMs)';
COMMENT ON SCHEMA security IS 'Schema para ativos, vulnerabilidades e incidentes de segurança';
COMMENT ON SCHEMA compliance IS 'Schema para conformidade regulatória (expandido com IA)';
COMMENT ON SCHEMA audit IS 'Schema para trilha de auditoria imutável';

COMMENT ON TABLE integration.sources IS 'Origens de dados externas (Wazuh, Zabbix, RMMs)';
COMMENT ON TABLE integration.events IS 'Eventos normalizados vindos das fontes externas';
COMMENT ON TABLE security.assets IS 'Ativos OT/IT com criticidade e zona';
COMMENT ON TABLE security.findings IS 'Vulnerabilidades e achados correlacionados a ativos';
COMMENT ON TABLE compliance.ai_assessments IS 'Resultados das análises automáticas da IA';
COMMENT ON TABLE audit.events IS 'Trilha de auditoria imutável (entidade, ação, antes/depois, ator, hash)';

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

