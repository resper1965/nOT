-- ============================================================================
-- MIGRATION: 003_triggers_rls.sql
-- Sistema: ness. OT GRC
-- Data: 2025-01-04
-- Versão: 1.0
-- ============================================================================
-- Row Level Security (RLS) e Triggers de Automação
-- ============================================================================

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE integration.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE security.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.control_crosswalk ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.events ENABLE ROW LEVEL SECURITY;

-- Políticas para integration.sources
CREATE POLICY "Users can view sources in their tenant"
    ON integration.sources
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can create sources in their tenant"
    ON integration.sources
    FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

-- Políticas para integration.events
CREATE POLICY "Users can view events in their tenant"
    ON integration.events
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role can insert events"
    ON integration.events
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Políticas para security.assets
CREATE POLICY "Users can view assets in their tenant"
    ON security.assets
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage assets in their tenant"
    ON security.assets
    FOR ALL
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

-- Políticas para security.findings
CREATE POLICY "Users can view findings in their tenant"
    ON security.findings
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage findings in their tenant"
    ON security.findings
    FOR ALL
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ))
    WITH CHECK (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

-- Políticas para compliance.ai_assessments
CREATE POLICY "Users can view AI assessments in their tenant"
    ON compliance.ai_assessments
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role can insert AI assessments"
    ON compliance.ai_assessments
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Políticas para compliance.control_crosswalk
CREATE POLICY "Users can view crosswalk in their tenant"
    ON compliance.control_crosswalk
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

-- Políticas para audit.events (read-only para todos)
CREATE POLICY "Users can view audit events in their tenant"
    ON audit.events
    FOR SELECT
    TO authenticated
    USING (tenant_id IN (
        SELECT id FROM public.clients 
        WHERE id IN (
            SELECT tenant_id FROM auth.users_tenants 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Service role can insert audit events"
    ON audit.events
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ============================================================================
-- TRIGGERS DE AUTOMAÇÃO
-- ============================================================================

-- Função: Correlacionar eventos com assets
CREATE OR REPLACE FUNCTION integration.correlate_event_with_asset()
RETURNS TRIGGER AS $$
DECLARE
    v_asset_id UUID;
BEGIN
    -- Tentar encontrar asset por asset_ref (IP ou hostname)
    IF NEW.asset_ref IS NOT NULL THEN
        SELECT id INTO v_asset_id
        FROM security.assets
        WHERE tenant_id = NEW.tenant_id
        AND (
            ip_address::TEXT = NEW.asset_ref
            OR hostname = NEW.asset_ref
            OR ext_refs->>'wazuh_agent_id' = NEW.asset_ref
            OR ext_refs->>'zabbix_host_id' = NEW.asset_ref
        )
        LIMIT 1;
        
        -- Se encontrar asset, criar finding se necessário
        IF v_asset_id IS NOT NULL AND NEW.category = 'security' AND NEW.severity IN ('critical', 'high') THEN
            INSERT INTO security.findings (
                tenant_id,
                source_event_id,
                correlated_asset_id,
                finding_type,
                title,
                description,
                severity,
                status,
                metadata
            )
            VALUES (
                NEW.tenant_id,
                NEW.id,
                v_asset_id,
                'threat',
                COALESCE(NEW.payload->>'title', NEW.payload->>'description', 'Evento de segurança'),
                NEW.payload::TEXT,
                NEW.severity,
                'open',
                jsonb_build_object(
                    'source_type', 'event_correlation',
                    'event_category', NEW.category,
                    'event_type', NEW.event_type
                )
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_correlate_event_with_asset
    AFTER INSERT ON integration.events
    FOR EACH ROW
    WHEN (NEW.category = 'security' AND NEW.severity IN ('critical', 'high'))
    EXECUTE FUNCTION integration.correlate_event_with_asset();

-- Função: Registrar evento de auditoria
CREATE OR REPLACE FUNCTION audit.log_event()
RETURNS TRIGGER AS $$
DECLARE
    v_hash VARCHAR(128);
    v_tenant_id UUID;
BEGIN
    -- Determinar tenant_id baseado na tabela
    IF TG_TABLE_SCHEMA = 'integration' THEN
        v_tenant_id := NEW.tenant_id;
    ELSIF TG_TABLE_SCHEMA = 'security' THEN
        v_tenant_id := NEW.tenant_id;
    ELSIF TG_TABLE_SCHEMA = 'compliance' THEN
        v_tenant_id := NEW.tenant_id;
    END IF;
    
    -- Calcular hash do evento
    SELECT encode(digest(
        COALESCE(TG_TABLE_SCHEMA::TEXT, '') ||
        COALESCE(TG_TABLE_NAME::TEXT, '') ||
        COALESCE(NEW.id::TEXT, '') ||
        COALESCE(TG_OP::TEXT, '') ||
        COALESCE(NOW()::TEXT, ''),
        'sha256'
    ), 'hex') INTO v_hash;
    
    -- Inserir evento de auditoria
    INSERT INTO audit.events (
        tenant_id,
        entity_type,
        entity_id,
        action,
        before,
        after,
        actor,
        hash
    )
    VALUES (
        v_tenant_id,
        TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END,
        auth.uid(),
        v_hash
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de auditoria em tabelas principais
CREATE TRIGGER trigger_audit_sources
    AFTER INSERT OR UPDATE OR DELETE ON integration.sources
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_event();

CREATE TRIGGER trigger_audit_events
    AFTER INSERT OR UPDATE OR DELETE ON integration.events
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_event();

CREATE TRIGGER trigger_audit_assets
    AFTER INSERT OR UPDATE OR DELETE ON security.assets
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_event();

CREATE TRIGGER trigger_audit_findings
    AFTER INSERT OR UPDATE OR DELETE ON security.findings
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_event();

CREATE TRIGGER trigger_audit_ai_assessments
    AFTER INSERT OR UPDATE OR DELETE ON compliance.ai_assessments
    FOR EACH ROW
    EXECUTE FUNCTION audit.log_event();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON FUNCTION integration.correlate_event_with_asset() IS 'Correlaciona eventos de segurança com assets e cria findings automaticamente';
COMMENT ON FUNCTION audit.log_event() IS 'Registra eventos de auditoria imutáveis para todas as mudanças nas tabelas principais';

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

