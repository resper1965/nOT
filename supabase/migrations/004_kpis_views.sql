-- ============================================================================
-- Views para KPIs e Métricas do Dashboard
-- ============================================================================
-- Fase 0 - Bloco 5: KPIs/SLOs no Dashboard
-- 
-- KPIs a calcular:
-- 1. Conformidade por framework/planta/domínio
-- 2. % evidências válidas (≤30/60/90 dias para vencer)
-- 3. % ativos críticos com baseline verificada
-- 4. % mudanças OT com análise cyber prévia
-- 5. % exceções em dia / vencidas
-- 6. MTTD/MTTR OT (Mean Time To Detect/Resolve)
-- 7. % playbooks testados
-- 8. % recertificação de acessos cumprida
-- ============================================================================

-- View: Conformidade por Framework
CREATE OR REPLACE VIEW compliance.v_kpi_framework_compliance AS
SELECT 
    f.id AS framework_id,
    f.framework_name,
    COALESCE(f.metadata->>'code', SUBSTRING(f.framework_name, 1, 10)) AS framework_code,
    COUNT(DISTINCT c.id) AS total_controls,
    COUNT(DISTINCT cr.id) AS assessed_controls,
    COUNT(DISTINCT CASE WHEN cr.status = 'compliant' THEN cr.id END) AS compliant_controls,
    COUNT(DISTINCT CASE WHEN cr.status = 'partially_compliant' THEN cr.id END) AS partially_compliant_controls,
    COUNT(DISTINCT CASE WHEN cr.status = 'non_compliant' THEN cr.id END) AS non_compliant_controls,
    COUNT(DISTINCT CASE WHEN cr.status = 'not_applicable' THEN cr.id END) AS not_applicable_controls,
    CASE 
        WHEN COUNT(DISTINCT cr.id) > 0 
        THEN ROUND(
            (COUNT(DISTINCT CASE WHEN cr.status = 'compliant' THEN cr.id END)::numeric / 
             COUNT(DISTINCT cr.id)) * 100, 
            2
        )
        ELSE 0
    END AS compliance_percentage,
    MAX(a.assessment_date) AS last_assessment_date
FROM compliance.frameworks f
LEFT JOIN compliance.controls c ON c.framework_id = f.id
LEFT JOIN compliance.assessments a ON a.framework_id = f.id
LEFT JOIN compliance.control_results cr ON cr.assessment_id = a.id AND cr.control_id = c.id
GROUP BY f.id, f.framework_name, f.metadata;

-- View: Evidências Válidas por Prazo
CREATE OR REPLACE VIEW compliance.v_kpi_evidence_validity AS
SELECT 
    COUNT(*) AS total_evidence_packages,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_evidence,
    COUNT(CASE WHEN status = 'locked' THEN 1 END) AS locked_evidence,
    COUNT(CASE 
        WHEN status IN ('approved', 'locked') 
        AND updated_at >= CURRENT_DATE - INTERVAL '30 days'
        THEN 1 
    END) AS valid_30_days,
    COUNT(CASE 
        WHEN status IN ('approved', 'locked') 
        AND updated_at >= CURRENT_DATE - INTERVAL '60 days'
        AND updated_at < CURRENT_DATE - INTERVAL '30 days'
        THEN 1 
    END) AS valid_60_days,
    COUNT(CASE 
        WHEN status IN ('approved', 'locked') 
        AND updated_at >= CURRENT_DATE - INTERVAL '90 days'
        AND updated_at < CURRENT_DATE - INTERVAL '60 days'
        THEN 1 
    END) AS valid_90_days,
    COUNT(CASE 
        WHEN status IN ('approved', 'locked') 
        AND updated_at < CURRENT_DATE - INTERVAL '90 days'
        THEN 1 
    END) AS expired_evidence,
    CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND(
            (COUNT(CASE 
                WHEN status IN ('approved', 'locked') 
                AND updated_at >= CURRENT_DATE - INTERVAL '90 days'
                THEN 1 
            END)::numeric / COUNT(*)) * 100, 
            2
        )
        ELSE 0
    END AS validity_percentage
FROM compliance.evidence_packages;

-- View: Ativos Críticos com Baseline
CREATE OR REPLACE VIEW security.v_kpi_critical_assets_baseline AS
SELECT 
    COUNT(*) AS total_critical_assets,
    COUNT(CASE WHEN metadata->>'has_baseline' = 'true' OR metadata->>'baseline_verified_at' IS NOT NULL THEN 1 END) AS assets_with_baseline,
    COUNT(CASE WHEN metadata->>'has_baseline' != 'true' AND metadata->>'baseline_verified_at' IS NULL THEN 1 END) AS assets_without_baseline,
    CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND(
            (COUNT(CASE WHEN metadata->>'has_baseline' = 'true' OR metadata->>'baseline_verified_at' IS NOT NULL THEN 1 END)::numeric / COUNT(*)) * 100, 
            2
        )
        ELSE 0
    END AS baseline_coverage_percentage,
    MAX((metadata->>'baseline_verified_at')::timestamp) AS last_baseline_verification
FROM security.assets
WHERE asset_type IN ('plc', 'rtu', 'hmi', 'scada', 'firewall', 'switch')
  AND criticality = 'critical';

-- View: Mudanças OT com Análise Cyber
CREATE OR REPLACE VIEW ops.v_kpi_ot_changes_cyber AS
SELECT 
    COUNT(*) AS total_changes,
    COUNT(CASE WHEN status = 'requested' THEN 1 END) AS requested_changes,
    COUNT(CASE WHEN status = 'risk_assessment' THEN 1 END) AS in_risk_assessment,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_changes,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_changes,
    COUNT(CASE 
        WHEN status IN ('approved', 'scheduled', 'in_progress', 'completed')
        AND metadata->>'risk_assessment_completed' = 'true'
        THEN 1 
    END) AS changes_with_cyber_analysis,
    CASE 
        WHEN COUNT(CASE WHEN status IN ('approved', 'scheduled', 'in_progress', 'completed') THEN 1 END) > 0 
        THEN ROUND(
            (COUNT(CASE 
                WHEN status IN ('approved', 'scheduled', 'in_progress', 'completed')
                AND metadata->>'risk_assessment_completed' = 'true'
                THEN 1 
            END)::numeric / 
            COUNT(CASE WHEN status IN ('approved', 'scheduled', 'in_progress', 'completed') THEN 1 END)) * 100, 
            2
        )
        ELSE 0
    END AS cyber_analysis_percentage
FROM ops.ot_changes;

-- View: Exceções em Dia / Vencidas
CREATE OR REPLACE VIEW compliance.v_kpi_exceptions_status AS
SELECT 
    COUNT(*) AS total_exceptions,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_exceptions,
    COUNT(CASE 
        WHEN status = 'approved' 
        AND expires_at IS NOT NULL 
        AND expires_at >= CURRENT_DATE
        THEN 1 
    END) AS valid_exceptions,
    COUNT(CASE 
        WHEN status = 'approved' 
        AND expires_at IS NOT NULL 
        AND expires_at < CURRENT_DATE
        THEN 1 
    END) AS expired_exceptions,
    COUNT(CASE 
        WHEN status = 'approved' 
        AND expires_at IS NOT NULL 
        AND expires_at >= CURRENT_DATE 
        AND expires_at <= CURRENT_DATE + INTERVAL '30 days'
        THEN 1 
    END) AS expiring_soon_exceptions,
    CASE 
        WHEN COUNT(CASE WHEN status = 'approved' THEN 1 END) > 0 
        THEN ROUND(
            (COUNT(CASE 
                WHEN status = 'approved' 
                AND expires_at IS NOT NULL 
                AND expires_at >= CURRENT_DATE
                THEN 1 
            END)::numeric / 
            COUNT(CASE WHEN status = 'approved' THEN 1 END)) * 100, 
            2
        )
        ELSE 0
    END AS valid_exceptions_percentage
FROM compliance.control_exceptions;

-- View: MTTD/MTTR OT (simplificado - usando mudanças OT como proxy)
CREATE OR REPLACE VIEW ops.v_kpi_ot_mttd_mttr AS
SELECT 
    COUNT(*) AS total_incidents,
    AVG(EXTRACT(EPOCH FROM (COALESCE(verified_at, executed_at) - requested_at)) / 3600) AS avg_time_to_resolve_hours,
    AVG(EXTRACT(EPOCH FROM (scheduled_window_start - requested_at)) / 3600) AS avg_time_to_schedule_hours,
    MIN(EXTRACT(EPOCH FROM (COALESCE(verified_at, executed_at) - requested_at)) / 3600) AS min_time_to_resolve_hours,
    MAX(EXTRACT(EPOCH FROM (COALESCE(verified_at, executed_at) - requested_at)) / 3600) AS max_time_to_resolve_hours
FROM ops.ot_changes
WHERE status = 'completed'
  AND (verified_at IS NOT NULL OR executed_at IS NOT NULL)
  AND requested_at IS NOT NULL;

-- View: Resumo Geral de KPIs
CREATE OR REPLACE VIEW compliance.v_kpi_dashboard_summary AS
SELECT 
    (SELECT framework_name FROM compliance.v_kpi_framework_compliance ORDER BY compliance_percentage DESC LIMIT 1) AS top_framework,
    (SELECT compliance_percentage FROM compliance.v_kpi_framework_compliance ORDER BY compliance_percentage DESC LIMIT 1) AS top_framework_compliance,
    (SELECT validity_percentage FROM compliance.v_kpi_evidence_validity) AS evidence_validity,
    (SELECT baseline_coverage_percentage FROM security.v_kpi_critical_assets_baseline) AS baseline_coverage,
    (SELECT cyber_analysis_percentage FROM ops.v_kpi_ot_changes_cyber) AS cyber_analysis_coverage,
    (SELECT valid_exceptions_percentage FROM compliance.v_kpi_exceptions_status) AS exceptions_validity,
    (SELECT avg_time_to_resolve_hours FROM ops.v_kpi_ot_mttd_mttr) AS avg_mttr_hours,
    CURRENT_TIMESTAMP AS last_updated;

-- Comentários nas views
COMMENT ON VIEW compliance.v_kpi_framework_compliance IS 'Conformidade por framework com percentuais de compliance';
COMMENT ON VIEW compliance.v_kpi_evidence_validity IS 'Status de validade das evidências por prazo (30/60/90 dias)';
COMMENT ON VIEW security.v_kpi_critical_assets_baseline IS 'Cobertura de baseline em ativos críticos OT';
COMMENT ON VIEW ops.v_kpi_ot_changes_cyber IS 'Percentual de mudanças OT com análise cyber prévia';
COMMENT ON VIEW compliance.v_kpi_exceptions_status IS 'Status de exceções aprovadas (válidas/vencidas)';
COMMENT ON VIEW ops.v_kpi_ot_mttd_mttr IS 'Métricas MTTD/MTTR para mudanças OT';
COMMENT ON VIEW compliance.v_kpi_dashboard_summary IS 'Resumo geral de todos os KPIs para o dashboard';

