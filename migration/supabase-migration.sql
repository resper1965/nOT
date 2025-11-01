-- ============================================================================
-- ness. OT GRC - Migração para Supabase
-- ============================================================================
-- Este arquivo contém o schema completo otimizado para Supabase
-- Data: 2025-11-01
-- ============================================================================
-- 
-- NOTA: Extensões uuid-ossp e pgcrypto já estão disponíveis no Supabase
-- Não é necessário criar extensões manualmente
-- ============================================================================

-- Criar schemas se não existirem
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
SET search_path TO security, topology, compliance, audit, public;

-- ============================================================================
-- MULTI-TENANCY
-- ============================================================================

-- Clients table (for multi-tenancy)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Vulnerabilities
CREATE TABLE IF NOT EXISTS security.vulnerabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Data Leakage Paths
CREATE TABLE IF NOT EXISTS security.data_leakage_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_asset_id UUID REFERENCES security.assets(id),
    destination_type VARCHAR(100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
    data_type VARCHAR(100),
    protocol VARCHAR(50),
    encrypted BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    description TEXT,
    recommendations TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_data_leakage_risk ON security.data_leakage_paths(risk_level);
CREATE INDEX IF NOT EXISTS idx_data_leakage_status ON security.data_leakage_paths(status);

-- ============================================================================
-- TOPOLOGY SCHEMA
-- ============================================================================

-- Network Zones
CREATE TABLE IF NOT EXISTS topology.network_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(255) NOT NULL,
    zone_type VARCHAR(100),
    security_level VARCHAR(20),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Network Connections
CREATE TABLE IF NOT EXISTS topology.network_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_asset_id UUID REFERENCES security.assets(id),
    destination_asset_id UUID REFERENCES security.assets(id),
    source_zone_id UUID REFERENCES topology.network_zones(id),
    destination_zone_id UUID REFERENCES topology.network_zones(id),
    protocol VARCHAR(50),
    port INTEGER,
    connection_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_connections_source ON topology.network_connections(source_asset_id);
CREATE INDEX IF NOT EXISTS idx_connections_destination ON topology.network_connections(destination_asset_id);

-- IP Subnets
CREATE TABLE IF NOT EXISTS topology.ip_subnets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subnet_cidr CIDR NOT NULL UNIQUE,
    network_address INET NOT NULL,
    broadcast_address INET,
    subnet_mask INET NOT NULL,
    prefix_length INTEGER NOT NULL,
    total_ips INTEGER NOT NULL,
    usable_ips INTEGER NOT NULL,
    subnet_name VARCHAR(255),
    vlan_id INTEGER,
    zone_id UUID REFERENCES topology.network_zones(id),
    purpose VARCHAR(255),
    criticality VARCHAR(20) CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    allocation_status VARCHAR(50),
    ip_utilization_percent DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subnets_vlan ON topology.ip_subnets(vlan_id);
CREATE INDEX IF NOT EXISTS idx_subnets_zone ON topology.ip_subnets(zone_id);

-- IP Addresses
CREATE TABLE IF NOT EXISTS topology.ip_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    subnet_id UUID REFERENCES topology.ip_subnets(id),
    asset_id UUID REFERENCES security.assets(id),
    mac_address MACADDR,
    hostname VARCHAR(255),
    dns_name VARCHAR(255),
    interface_name VARCHAR(100),
    vlan_id INTEGER,
    ip_type VARCHAR(50) CHECK (ip_type IN ('static', 'dhcp', 'reserved', 'gateway', 'broadcast')),
    status VARCHAR(20) DEFAULT 'active',
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ip_address, interface_name)
);

CREATE INDEX IF NOT EXISTS idx_ips_address ON topology.ip_addresses(ip_address);
CREATE INDEX IF NOT EXISTS idx_ips_asset ON topology.ip_addresses(asset_id);
CREATE INDEX IF NOT EXISTS idx_ips_subnet ON topology.ip_addresses(subnet_id);
CREATE INDEX IF NOT EXISTS idx_ips_vlan ON topology.ip_addresses(vlan_id);

-- VLANs
CREATE TABLE IF NOT EXISTS topology.vlans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vlan_id INTEGER NOT NULL UNIQUE CHECK (vlan_id BETWEEN 1 AND 4094),
    vlan_name VARCHAR(255) NOT NULL,
    zone_id UUID REFERENCES topology.network_zones(id),
    description TEXT,
    purpose VARCHAR(255),
    criticality VARCHAR(20) CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    subnet_ids UUID[],
    trunk_ports TEXT[],
    access_ports TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vlans_id ON topology.vlans(vlan_id);
CREATE INDEX IF NOT EXISTS idx_vlans_zone ON topology.vlans(zone_id);

-- ============================================================================
-- COMPLIANCE SCHEMA
-- ============================================================================

-- Compliance Frameworks
CREATE TABLE IF NOT EXISTS compliance.frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_name VARCHAR(255) NOT NULL UNIQUE,
    framework_code VARCHAR(50) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default frameworks
INSERT INTO compliance.frameworks (framework_name, framework_code, description, version) VALUES
    ('Lei Geral de Proteção de Dados', 'LGPD', 'Lei brasileira de proteção de dados pessoais', '1.0'),
    ('IEC 62443', 'IEC62443', 'Segurança para sistemas de automação industrial e controle', '4.0'),
    ('NIST Cybersecurity Framework', 'NIST_CSF', 'Framework de cibersegurança do NIST', '2.0'),
    ('ISO/IEC 27001', 'ISO27001', 'Sistema de gestão de segurança da informação', '2022'),
    ('CIS Controls', 'CIS', 'Controles de segurança críticos', 'v8')
ON CONFLICT (framework_name) DO NOTHING;

-- Compliance Controls
CREATE TABLE IF NOT EXISTS compliance.controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance.frameworks(id),
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_controls_framework ON compliance.controls(framework_id);

-- ONS Controls
CREATE TABLE IF NOT EXISTS compliance.ons_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'implemented', 'compliant', 'non_compliant')),
    evidence TEXT,
    implementation_date DATE,
    review_date DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Assessments
CREATE TABLE IF NOT EXISTS compliance.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance.frameworks(id),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('compliant', 'partially_compliant', 'non_compliant', 'not_applicable')),
    compliance_percentage DECIMAL(5,2),
    gaps_identified INTEGER,
    notes TEXT,
    assessed_by VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Assessment Results
CREATE TABLE IF NOT EXISTS compliance.control_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES compliance.assessments(id),
    control_id UUID REFERENCES compliance.controls(id),
    status VARCHAR(20) CHECK (status IN ('compliant', 'partially_compliant', 'non_compliant', 'not_applicable')),
    evidence TEXT,
    gap_description TEXT,
    remediation_plan TEXT,
    target_date DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Categories
CREATE TABLE IF NOT EXISTS compliance.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    regulatory_source VARCHAR(100),
    mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert main categories
INSERT INTO compliance.document_categories (category_code, category_name, description, regulatory_source, mandatory) VALUES
    ('POL', 'Políticas', 'Políticas de Segurança Cibernética', 'ANEEL RN 964/2021', true),
    ('PROC', 'Procedimentos', 'Procedimentos Operacionais', 'ANEEL RN 964/2021 + ONS', true),
    ('PRI', 'Planos de Resposta', 'Planos de Resposta a Incidentes', 'ANEEL RN 964/2021', true),
    ('TRAIN', 'Treinamentos', 'Programas e Evidências de Treinamento', 'ANEEL RN 964/2021', true),
    ('AUD', 'Auditorias', 'Relatórios de Auditoria', 'ANEEL RN 964/2021', true),
    ('CERT', 'Certificações', 'Certificados e Conformidades', 'ANEEL + ONS', false),
    ('INC', 'Incidentes', 'Relatórios de Incidentes', 'ANEEL RN 964/2021', true),
    ('RISK', 'Análise de Risco', 'Avaliações de Risco', 'ANEEL RN 964/2021', true),
    ('BCP', 'Continuidade', 'Planos de Continuidade e DR', 'ANEEL RN 964/2021', true),
    ('EVID', 'Evidências', 'Evidências de Conformidade', 'ANEEL + ONS', true)
ON CONFLICT (category_code) DO NOTHING;

-- Documents (simplified for Supabase)
CREATE TABLE IF NOT EXISTS compliance.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_name VARCHAR(500) NOT NULL,
    document_code VARCHAR(50),
    category_id UUID REFERENCES compliance.document_categories(id),
    status VARCHAR(50) DEFAULT 'missing' CHECK (status IN ('missing', 'draft', 'review', 'approved', 'published')),
    framework VARCHAR(50),
    requirement_type VARCHAR(100),
    file_path TEXT,
    file_url TEXT,
    version VARCHAR(20),
    created_by UUID,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_status ON compliance.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_framework ON compliance.documents(framework);

-- Required Documents Registry
CREATE TABLE IF NOT EXISTS compliance.required_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES compliance.document_categories(id),
    document_code VARCHAR(50) NOT NULL UNIQUE,
    document_name VARCHAR(500) NOT NULL,
    description TEXT,
    regulatory_reference VARCHAR(500),
    mandatory BOOLEAN DEFAULT true,
    frequency VARCHAR(50),
    responsible_role VARCHAR(100),
    template_available BOOLEAN DEFAULT false,
    template_path VARCHAR(500),
    estimated_effort_hours INTEGER,
    dependencies TEXT[],
    approval_required_by VARCHAR(100),
    retention_years INTEGER DEFAULT 5,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Status Tracking
CREATE TABLE IF NOT EXISTS compliance.document_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    required_document_id UUID REFERENCES compliance.required_documents(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('missing', 'draft', 'under_review', 'approved', 'published', 'expired', 'archived')),
    current_version VARCHAR(20),
    file_path VARCHAR(500),
    file_hash VARCHAR(128),
    file_size_bytes BIGINT,
    created_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    valid_from DATE,
    valid_until DATE,
    next_review_date DATE,
    last_review_date DATE,
    review_status VARCHAR(50),
    comments TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_status_required ON compliance.document_status(required_document_id);
CREATE INDEX IF NOT EXISTS idx_document_status_status ON compliance.document_status(status);

-- ============================================================================
-- AUDIT SCHEMA
-- ============================================================================

-- Audit Log
CREATE TABLE IF NOT EXISTS audit.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit.activity_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit.activity_log(timestamp DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Apply update timestamp trigger to all tables
DROP TRIGGER IF EXISTS update_assets_updated_at ON security.assets;
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON security.assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vulnerabilities_updated_at ON security.vulnerabilities;
CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON security.vulnerabilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_incidents_updated_at ON security.incidents;
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON security.incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ip_subnets_updated_at ON topology.ip_subnets;
CREATE TRIGGER update_ip_subnets_updated_at BEFORE UPDATE ON topology.ip_subnets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vlans_updated_at ON topology.vlans;
CREATE TRIGGER update_vlans_updated_at BEFORE UPDATE ON topology.vlans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Security Dashboard Summary
CREATE OR REPLACE VIEW security.dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM security.assets WHERE status = 'active') as total_assets,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open') as open_vulnerabilities,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open' AND severity = 'critical') as critical_vulnerabilities,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open' AND severity = 'high') as high_vulnerabilities,
    (SELECT COUNT(*) FROM security.incidents WHERE status = 'open') as open_incidents,
    (SELECT COUNT(*) FROM security.data_leakage_paths WHERE status = 'active' AND risk_level IN ('critical', 'high')) as high_risk_leakage_paths;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on main tables
ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE topology.vlans ENABLE ROW LEVEL SECURITY;
ALTER TABLE topology.ip_addresses ENABLE ROW LEVEL SECURITY;

-- Basic policies: authenticated users can view everything
-- You can customize these policies later based on your security requirements
-- Remove existing policies if they exist before creating new ones

DROP POLICY IF EXISTS "Authenticated users can view assets" ON security.assets;
CREATE POLICY "Authenticated users can view assets"
ON security.assets FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view documents" ON compliance.documents;
CREATE POLICY "Authenticated users can view documents"
ON compliance.documents FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view vlans" ON topology.vlans;
CREATE POLICY "Authenticated users can view vlans"
ON topology.vlans FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view ip_addresses" ON topology.ip_addresses;
CREATE POLICY "Authenticated users can view ip_addresses"
ON topology.ip_addresses FOR SELECT
USING (auth.role() = 'authenticated');

-- Service role can do everything (bypasses RLS)
-- This is handled automatically by using service_role_key

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ness. OT GRC database schema migrated to Supabase successfully!';
    RAISE NOTICE '📊 Schemas created: security, topology, compliance, audit';
    RAISE NOTICE '🔒 Row Level Security (RLS) enabled on main tables';
END $$;

