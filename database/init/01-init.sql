-- ness. OT GRC Database Schema
-- Governance, Risk & Compliance for OT Networks
-- PostgreSQL 16

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
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
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_code ON public.clients(code);

-- ============================================================================
-- SECURITY SCHEMA
-- ============================================================================

-- Assets (Network devices and systems)
CREATE TABLE security.assets (
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

CREATE INDEX idx_assets_type ON security.assets(asset_type);
CREATE INDEX idx_assets_criticality ON security.assets(criticality);
CREATE INDEX idx_assets_status ON security.assets(status);

-- Vulnerabilities
CREATE TABLE security.vulnerabilities (
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

CREATE INDEX idx_vulnerabilities_severity ON security.vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON security.vulnerabilities(status);
CREATE INDEX idx_vulnerabilities_cve ON security.vulnerabilities(cve_id);
CREATE INDEX idx_vulnerabilities_asset ON security.vulnerabilities(asset_id);

-- Security Incidents
CREATE TABLE security.incidents (
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

CREATE INDEX idx_incidents_severity ON security.incidents(severity);
CREATE INDEX idx_incidents_status ON security.incidents(status);

-- Data Leakage Paths
CREATE TABLE security.data_leakage_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_data_leakage_risk ON security.data_leakage_paths(risk_level);
CREATE INDEX idx_data_leakage_status ON security.data_leakage_paths(status);

-- ============================================================================
-- TOPOLOGY SCHEMA
-- ============================================================================

-- Network Zones
CREATE TABLE topology.network_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(255) NOT NULL,
    zone_type VARCHAR(100),
    security_level VARCHAR(20),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Network Connections
CREATE TABLE topology.network_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_connections_source ON topology.network_connections(source_asset_id);
CREATE INDEX idx_connections_destination ON topology.network_connections(destination_asset_id);

-- ============================================================================
-- COMPLIANCE SCHEMA
-- ============================================================================

-- Compliance Frameworks
CREATE TABLE compliance.frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    ('CIS Controls', 'CIS', 'Controles de segurança críticos', 'v8');

-- Compliance Controls
CREATE TABLE compliance.controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_controls_framework ON compliance.controls(framework_id);

-- Compliance Assessments
CREATE TABLE compliance.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE compliance.control_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- ============================================================================
-- AUDIT SCHEMA
-- ============================================================================

-- Audit Log
CREATE TABLE audit.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit.activity_log(user_id);
CREATE INDEX idx_audit_action ON audit.activity_log(action);
CREATE INDEX idx_audit_timestamp ON audit.activity_log(timestamp DESC);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Security Dashboard Summary
CREATE VIEW security.dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM security.assets WHERE status = 'active') as total_assets,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open') as open_vulnerabilities,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open' AND severity = 'critical') as critical_vulnerabilities,
    (SELECT COUNT(*) FROM security.vulnerabilities WHERE status = 'open' AND severity = 'high') as high_vulnerabilities,
    (SELECT COUNT(*) FROM security.incidents WHERE status = 'open') as open_incidents,
    (SELECT COUNT(*) FROM security.data_leakage_paths WHERE status = 'active' AND risk_level IN ('critical', 'high')) as high_risk_leakage_paths;

-- Vulnerability Summary by Asset
CREATE VIEW security.vulnerability_summary_by_asset AS
SELECT 
    a.id as asset_id,
    a.asset_name,
    a.asset_type,
    a.criticality,
    COUNT(v.id) as total_vulnerabilities,
    COUNT(CASE WHEN v.severity = 'critical' THEN 1 END) as critical_count,
    COUNT(CASE WHEN v.severity = 'high' THEN 1 END) as high_count,
    COUNT(CASE WHEN v.severity = 'medium' THEN 1 END) as medium_count,
    COUNT(CASE WHEN v.severity = 'low' THEN 1 END) as low_count,
    AVG(v.cvss_score) as avg_cvss_score
FROM security.assets a
LEFT JOIN security.vulnerabilities v ON a.id = v.asset_id AND v.status = 'open'
GROUP BY a.id, a.asset_name, a.asset_type, a.criticality;

-- Compliance Status Overview
CREATE VIEW compliance.status_overview AS
SELECT 
    f.framework_name,
    f.framework_code,
    a.compliance_percentage,
    a.status,
    a.gaps_identified,
    a.assessment_date
FROM compliance.frameworks f
LEFT JOIN LATERAL (
    SELECT * FROM compliance.assessments 
    WHERE framework_id = f.id 
    ORDER BY assessment_date DESC 
    LIMIT 1
) a ON true;

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
$$ language 'plpgsql';

-- Apply update timestamp trigger to all tables
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON security.assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vulnerabilities_updated_at BEFORE UPDATE ON security.vulnerabilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON security.incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_leakage_paths_updated_at BEFORE UPDATE ON security.data_leakage_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_network_zones_updated_at BEFORE UPDATE ON topology.network_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_network_connections_updated_at BEFORE UPDATE ON topology.network_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_frameworks_updated_at BEFORE UPDATE ON compliance.frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON compliance.controls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON compliance.assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_control_results_updated_at BEFORE UPDATE ON compliance.control_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA security TO ness_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA topology TO ness_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA compliance TO ness_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA security TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA topology TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA compliance TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit TO ness_admin;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ ness. OT GRC database initialized successfully!';
    RAISE NOTICE '📊 Governance, Risk & Compliance platform ready!';
END $$;
