-- ness. OT GRC - Supabase Migration Script
-- Migração completa do schema PostgreSQL para Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- ============================================================================
-- EXTENSIONS (já disponíveis no Supabase, mas verificar)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SCHEMAS
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
SET search_path TO security, topology, compliance, audit, public;

-- ============================================================================
-- MULTI-TENANCY (Public Schema)
-- ============================================================================

-- Clients table (for multi-tenancy)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_code ON public.clients(code);

-- ============================================================================
-- SECURITY SCHEMA
-- ============================================================================

-- Assets (Network devices and systems)
CREATE TABLE IF NOT EXISTS security.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    ip_address INET,
    mac_address MACADDR,
    location VARCHAR(255),
    criticality VARCHAR(20) CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_type ON security.assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON security.assets(criticality);
CREATE INDEX IF NOT EXISTS idx_assets_status ON security.assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_ip ON security.assets(ip_address);

-- Vulnerabilities
CREATE TABLE IF NOT EXISTS security.vulnerabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES security.assets(id) ON DELETE CASCADE,
    cve_id VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    cvss_score DECIMAL(3,1),
    cvss_vector VARCHAR(100),
    exploit_available BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'accepted', 'false_positive')),
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    remediation_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON security.vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON security.vulnerabilities(status);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_cve ON security.vulnerabilities(cve_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_asset ON security.vulnerabilities(asset_id);

-- Security Incidents
CREATE TABLE IF NOT EXISTS security.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'open',
    affected_assets UUID[],
    incident_type VARCHAR(100),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidents_severity ON security.incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON security.incidents(status);

-- ============================================================================
-- TOPOLOGY SCHEMA
-- ============================================================================

-- IP Subnets
CREATE TABLE IF NOT EXISTS topology.ip_subnets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subnet_name VARCHAR(255) NOT NULL,
    network_address CIDR NOT NULL,
    subnet_mask VARCHAR(50),
    gateway INET,
    vlan_id INTEGER,
    purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subnets_network ON topology.ip_subnets USING GIST (network_address);
CREATE INDEX IF NOT EXISTS idx_subnets_purdue ON topology.ip_subnets(purdue_level);

-- IP Addresses
CREATE TABLE IF NOT EXISTS topology.ip_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    subnet_id UUID REFERENCES topology.ip_subnets(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES security.assets(id) ON DELETE SET NULL,
    hostname VARCHAR(255),
    mac_address MACADDR,
    status VARCHAR(20) DEFAULT 'active',
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ips_address ON topology.ip_addresses USING GIST (ip_address);
CREATE INDEX IF NOT EXISTS idx_ips_subnet ON topology.ip_addresses(subnet_id);
CREATE INDEX IF NOT EXISTS idx_ips_asset ON topology.ip_addresses(asset_id);

-- VLANs
CREATE TABLE IF NOT EXISTS topology.vlans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vlan_id INTEGER NOT NULL,
    vlan_name VARCHAR(255),
    description TEXT,
    purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5),
    subnet_id UUID REFERENCES topology.ip_subnets(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vlans_id ON topology.vlans(vlan_id);
CREATE INDEX IF NOT EXISTS idx_vlans_purdue ON topology.vlans(purdue_level);

-- Network Connections
CREATE TABLE IF NOT EXISTS topology.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_asset_id UUID REFERENCES security.assets(id) ON DELETE CASCADE,
    target_asset_id UUID REFERENCES security.assets(id) ON DELETE CASCADE,
    connection_type VARCHAR(100),
    port INTEGER,
    protocol VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_connections_source ON topology.connections(source_asset_id);
CREATE INDEX IF NOT EXISTS idx_connections_target ON topology.connections(target_asset_id);

-- ============================================================================
-- COMPLIANCE SCHEMA
-- ============================================================================

-- Security Frameworks
CREATE TABLE IF NOT EXISTS compliance.frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_name VARCHAR(255) NOT NULL UNIQUE,
    version VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Framework Controls
CREATE TABLE IF NOT EXISTS compliance.controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE CASCADE,
    control_code VARCHAR(100) NOT NULL,
    control_title VARCHAR(500) NOT NULL,
    description TEXT,
    requirement_text TEXT,
    level VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_controls_framework ON compliance.controls(framework_id);
CREATE INDEX IF NOT EXISTS idx_controls_code ON compliance.controls(control_code);

-- Compliance Documents
CREATE TABLE IF NOT EXISTS compliance.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_name VARCHAR(500) NOT NULL,
    document_type VARCHAR(100),
    category VARCHAR(100),
    framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE SET NULL,
    control_id UUID REFERENCES compliance.controls(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    version VARCHAR(50),
    storage_path TEXT,
    approval_status VARCHAR(50),
    required_by TIMESTAMP,
    reviewed_at TIMESTAMP,
    next_review TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON compliance.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON compliance.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_framework ON compliance.documents(framework_id);

-- ============================================================================
-- AUDIT SCHEMA
-- ============================================================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    user_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_action ON audit.logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_resource ON audit.logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON audit.logs(created_at DESC);

-- Change Tracking
CREATE TABLE IF NOT EXISTS audit.changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_changes_table ON audit.changes(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_changes_changed ON audit.changes(changed_at DESC);

-- ============================================================================
-- TRIGGERS: Auto-update updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON security.assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON security.vulnerabilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON security.incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subnets_updated_at BEFORE UPDATE ON topology.ip_subnets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ips_updated_at BEFORE UPDATE ON topology.ip_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vlans_updated_at BEFORE UPDATE ON topology.vlans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON topology.connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frameworks_updated_at BEFORE UPDATE ON compliance.frameworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON compliance.controls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON compliance.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS: Summary and Dashboard Views
-- ============================================================================

-- Security Summary View
CREATE OR REPLACE VIEW security.dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM security.assets) as total_assets,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open') as open_vulnerabilities,
    (SELECT COUNT(*) FROM security.incidents WHERE status = 'open') as open_incidents,
    (SELECT COUNT(*) FROM security.assets WHERE criticality = 'critical') as critical_assets;

-- Compliance Status View
CREATE OR REPLACE VIEW compliance.status_overview AS
SELECT
    (SELECT COUNT(*) FROM compliance.documents) as total_documents,
    (SELECT COUNT(*) FROM compliance.documents WHERE status = 'approved') as approved_documents,
    (SELECT COUNT(*) FROM compliance.documents WHERE status = 'pending') as pending_documents,
    (SELECT COUNT(*) FROM compliance.documents WHERE next_review < CURRENT_TIMESTAMP) as documents_needing_review;

-- Network Topology Summary
CREATE OR REPLACE VIEW topology.summary AS
SELECT
    (SELECT COUNT(*) FROM topology.ip_subnets) as total_subnets,
    (SELECT COUNT(*) FROM topology.ip_addresses) as total_ips,
    (SELECT COUNT(*) FROM topology.vlans) as total_vlans,
    (SELECT COUNT(*) FROM topology.connections) as total_connections;

-- ============================================================================
-- SEED DATA: Frameworks
-- ============================================================================

INSERT INTO compliance.frameworks (framework_name, version, description) VALUES
    ('ANEEL RN 964/2021', '2021', 'Resolução Normativa ANEEL 964/2021 - Segurança Cibernética'),
    ('ONS Rotina Operacional', '2023', 'Controles Mínimos ONS para Sistemas Críticos'),
    ('IEC 62443', '3-3', 'IEC 62443 - Security for Industrial Automation and Control Systems'),
    ('NIST CSF', '2.0', 'NIST Cybersecurity Framework 2.0'),
    ('ISO 27001', '2022', 'ISO/IEC 27001:2022 - Information Security Management')
ON CONFLICT (framework_name) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Opcional
-- ============================================================================

-- Por enquanto, RLS está desabilitado para facilitar desenvolvimento
-- Reativar conforme necessário em produção

-- Exemplo: Habilitar RLS em security.assets
-- ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON security.assets FOR SELECT USING (true);
-- CREATE POLICY "Authenticated write access" ON security.assets FOR ALL TO authenticated USING (true);

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Migração do schema ness. OT GRC concluída com sucesso!';
    RAISE NOTICE 'Schemas criados: security, topology, compliance, audit';
    RAISE NOTICE 'Próximo passo: Migrar dados (se necessário)';
END $$;

