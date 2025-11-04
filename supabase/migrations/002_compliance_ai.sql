-- ============================================================================
-- MIGRATION: 002_compliance_ai.sql
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- Versão: 1.0
-- ============================================================================
-- Expansão do schema compliance com tabelas de IA e crosswalk
-- ============================================================================

-- ============================================================================
-- COMPLIANCE SCHEMA (Expansão)
-- ============================================================================

-- Tabela: compliance.control_crosswalk
-- Mapeia controles equivalentes entre frameworks
CREATE TABLE IF NOT EXISTS compliance.control_crosswalk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    source_framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    source_control_id UUID REFERENCES compliance.controls(id) ON DELETE CASCADE,
    target_framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    target_control_id UUID REFERENCES compliance.controls(id) ON DELETE CASCADE,
    mapping_type VARCHAR(20) CHECK (mapping_type IN ('exact', 'partial', 'related')),
    confidence NUMERIC(3,2) DEFAULT 1.0 CHECK (confidence >= 0 AND confidence <= 1),
    evidence_event_ids UUID[], -- IDs de eventos que suportam o mapeamento
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, source_framework_id, source_control_id, target_framework_id, target_control_id)
);

CREATE INDEX IF NOT EXISTS idx_crosswalk_tenant ON compliance.control_crosswalk(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crosswalk_source ON compliance.control_crosswalk(source_framework_id, source_control_id);
CREATE INDEX IF NOT EXISTS idx_crosswalk_target ON compliance.control_crosswalk(target_framework_id, target_control_id);
CREATE INDEX IF NOT EXISTS idx_crosswalk_type ON compliance.control_crosswalk(mapping_type);

-- Trigger: updated_at automático
CREATE TRIGGER trigger_crosswalk_updated_at
    BEFORE UPDATE ON compliance.control_crosswalk
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS PARA IA E COMPLIANCE
-- ============================================================================

-- View: Eventos recentes por categoria
CREATE OR REPLACE VIEW integration.v_recent_events_by_category AS
SELECT
    category,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE severity = 'critical') AS critical_count,
    COUNT(*) FILTER (WHERE severity = 'high') AS high_count,
    COUNT(*) FILTER (WHERE occurred_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours') AS last_24h,
    COUNT(*) FILTER (WHERE occurred_at >= CURRENT_TIMESTAMP - INTERVAL '7 days') AS last_7d,
    MAX(occurred_at) AS last_event_at
FROM integration.events
GROUP BY category;

-- View: Assets críticos sem baseline
CREATE OR REPLACE VIEW security.v_critical_assets_without_baseline AS
SELECT
    a.id,
    a.name,
    a.zone,
    a.criticality,
    a.ip_address,
    COUNT(f.id) AS findings_count,
    MAX(f.updated_at) AS last_finding_at
FROM security.assets a
LEFT JOIN security.findings f ON a.id = f.correlated_asset_id
WHERE a.criticality IN ('critical', 'high')
GROUP BY a.id, a.name, a.zone, a.criticality, a.ip_address
HAVING COUNT(f.id) = 0 OR MAX(f.updated_at) < CURRENT_TIMESTAMP - INTERVAL '90 days';

-- View: Avaliações IA por scope
CREATE OR REPLACE VIEW compliance.v_ai_assessments_summary AS
SELECT
    scope,
    assessment_type,
    COUNT(*) AS total_count,
    AVG(confidence) AS avg_confidence,
    COUNT(*) FILTER (WHERE confidence > 0.8) AS high_confidence_count,
    COUNT(*) FILTER (WHERE evaluated_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours') AS last_24h,
    MAX(evaluated_at) AS last_evaluation_at
FROM compliance.ai_assessments
GROUP BY scope, assessment_type;

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE compliance.control_crosswalk IS 'Mapeamento de controles equivalentes entre frameworks para reaproveitamento de evidências';
COMMENT ON VIEW integration.v_recent_events_by_category IS 'Estatísticas de eventos recentes por categoria';
COMMENT ON VIEW security.v_critical_assets_without_baseline IS 'Assets críticos sem baseline ou com baseline desatualizada';
COMMENT ON VIEW compliance.v_ai_assessments_summary IS 'Resumo de avaliações IA por scope e tipo';

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

