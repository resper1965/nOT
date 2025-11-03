-- ness. OT GRC - Supabase Migration Script
-- Migração completa do schema PostgreSQL para Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- ============================================================================
-- EXTENSIONS (já disponíveis no Supabase)
-- ============================================================================
-- Supabase já tem uuid-ossp habilitado por padrão
-- gen_random_uuid() está disponível via pgcrypto (habilitado por padrão)
-- Se precisar de uuid-ossp explicitamente, habilitar no Dashboard do Supabase
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
-- NOTA: Autenticação é nativa do Supabase via auth.users
-- Referências a usuários devem usar auth.users.id (UUID)
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
CREATE INDEX IF NOT EXISTS idx_assets_ip ON security.assets(ip_address);

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

-- ============================================================================
-- TOPOLOGY SCHEMA
-- ============================================================================

-- IP Subnets
CREATE TABLE IF NOT EXISTS topology.ip_subnets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- GIST index requires inet_ops operator class or btree_gist extension
-- Using B-tree index instead for compatibility
CREATE INDEX IF NOT EXISTS idx_subnets_network ON topology.ip_subnets(network_address);

-- Add purdue_level column if table exists without it
-- Drop view if exists (prevent conflict)
DROP VIEW IF EXISTS topology.ip_subnets CASCADE;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'topology' AND table_name = 'ip_subnets' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'topology' AND table_name = 'ip_subnets' AND column_name = 'purdue_level')
    THEN
        ALTER TABLE topology.ip_subnets ADD COLUMN purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_subnets_purdue ON topology.ip_subnets(purdue_level);

-- IP Addresses
CREATE TABLE IF NOT EXISTS topology.ip_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- GIST index requires inet_ops operator class or btree_gist extension
-- Using B-tree index instead for compatibility
CREATE INDEX IF NOT EXISTS idx_ips_address ON topology.ip_addresses(ip_address);
CREATE INDEX IF NOT EXISTS idx_ips_subnet ON topology.ip_addresses(subnet_id);
CREATE INDEX IF NOT EXISTS idx_ips_asset ON topology.ip_addresses(asset_id);

-- VLANs
CREATE TABLE IF NOT EXISTS topology.vlans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Add purdue_level column if table exists without it
-- Drop view if exists (prevent conflict)
DROP VIEW IF EXISTS topology.vlans CASCADE;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'topology' AND table_name = 'vlans' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'topology' AND table_name = 'vlans' AND column_name = 'purdue_level')
    THEN
        ALTER TABLE topology.vlans ADD COLUMN purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vlans_purdue ON topology.vlans(purdue_level);

-- Network Connections
CREATE TABLE IF NOT EXISTS topology.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_name VARCHAR(255) NOT NULL UNIQUE,
    version VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Framework Controls
CREATE TABLE IF NOT EXISTS compliance.controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Add control_code column if table exists without it
-- Drop view if exists (prevent conflict)
DROP VIEW IF EXISTS compliance.controls CASCADE;
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'compliance' AND table_name = 'controls' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'compliance' AND table_name = 'controls' AND column_name = 'control_code')
    THEN
        ALTER TABLE compliance.controls ADD COLUMN control_code VARCHAR(100);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_controls_code ON compliance.controls(control_code);

-- Compliance Documents
CREATE TABLE IF NOT EXISTS compliance.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Add columns if table exists without them (for indexes)
-- Drop view if exists (prevent conflict)
DROP VIEW IF EXISTS compliance.documents CASCADE;
DO $$ 
BEGIN
    -- Add category column if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'compliance' AND table_name = 'documents' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'compliance' AND table_name = 'documents' AND column_name = 'category')
    THEN
        ALTER TABLE compliance.documents ADD COLUMN category VARCHAR(100);
    END IF;
    -- Add status column if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'compliance' AND table_name = 'documents' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'compliance' AND table_name = 'documents' AND column_name = 'status')
    THEN
        ALTER TABLE compliance.documents ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
    END IF;
    -- Add framework_id column if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'compliance' AND table_name = 'documents' AND table_type = 'BASE TABLE')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'compliance' AND table_name = 'documents' AND column_name = 'framework_id')
    THEN
        ALTER TABLE compliance.documents ADD COLUMN framework_id UUID REFERENCES compliance.frameworks(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_documents_category ON compliance.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON compliance.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_framework ON compliance.documents(framework_id);

-- ============================================================================
-- COMPLIANCE DOCUMENTS MANAGEMENT (ANEEL RN 964/2021)
-- ============================================================================

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

-- Required Documents Registry
CREATE TABLE IF NOT EXISTS compliance.required_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES compliance.document_categories(id),
    document_code VARCHAR(50) NOT NULL UNIQUE,
    document_name VARCHAR(500) NOT NULL,
    description TEXT,
    regulatory_reference VARCHAR(500),
    mandatory BOOLEAN DEFAULT true,
    frequency VARCHAR(50), -- 'once', 'annual', 'biannual', 'quarterly', 'monthly', 'continuous'
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

CREATE INDEX IF NOT EXISTS idx_required_documents_category ON compliance.required_documents(category_id);
CREATE INDEX IF NOT EXISTS idx_required_documents_code ON compliance.required_documents(document_code);

-- Document Status Tracking
CREATE TABLE IF NOT EXISTS compliance.document_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    required_document_id UUID REFERENCES compliance.required_documents(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('missing', 'draft', 'under_review', 'approved', 'published', 'expired', 'archived')),
    current_version VARCHAR(20),
    file_path VARCHAR(500),
    file_hash VARCHAR(128),
    file_size_bytes BIGINT,
    created_by UUID REFERENCES auth.users(id), -- Supabase auth.users
    approved_by UUID REFERENCES auth.users(id), -- Supabase auth.users
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
CREATE INDEX IF NOT EXISTS idx_document_status_next_review ON compliance.document_status(next_review_date);

-- Document Versions History
CREATE TABLE IF NOT EXISTS compliance.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_status_id UUID REFERENCES compliance.document_status(id),
    version VARCHAR(20) NOT NULL,
    file_path VARCHAR(500),
    file_hash VARCHAR(128),
    changes_description TEXT,
    created_by UUID REFERENCES auth.users(id), -- Supabase auth.users
    approved_by UUID REFERENCES auth.users(id), -- Supabase auth.users
    approved_at TIMESTAMP,
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_versions_status ON compliance.document_versions(document_status_id);

-- Document Approval Workflow
CREATE TABLE IF NOT EXISTS compliance.document_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_status_id UUID REFERENCES compliance.document_status(id),
    approver_role VARCHAR(100) NOT NULL,
    approver_name VARCHAR(255),
    approver_id UUID REFERENCES auth.users(id), -- Supabase auth.users
    approval_status VARCHAR(50) CHECK (approval_status IN ('pending', 'approved', 'rejected', 'returned')),
    approval_date TIMESTAMP,
    comments TEXT,
    sequence_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_approvals_status ON compliance.document_approvals(document_status_id);

-- Document Review Schedule
CREATE TABLE IF NOT EXISTS compliance.document_review_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    required_document_id UUID REFERENCES compliance.required_documents(id),
    scheduled_date DATE NOT NULL,
    review_type VARCHAR(50) CHECK (review_type IN ('periodic', 'ad_hoc', 'regulatory', 'incident_driven')),
    assigned_to UUID REFERENCES auth.users(id), -- Supabase auth.users
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    completion_date DATE,
    findings TEXT,
    actions_required JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_schedule_required ON compliance.document_review_schedule(required_document_id);
CREATE INDEX IF NOT EXISTS idx_review_schedule_date ON compliance.document_review_schedule(scheduled_date);

-- ============================================================================
-- AUDIT SCHEMA
-- ============================================================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    user_id UUID REFERENCES auth.users(id), -- Supabase auth.users
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES auth.users(id), -- Supabase auth.users
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

-- Drop existing triggers if they exist (for idempotent execution)
DROP TRIGGER IF EXISTS update_assets_updated_at ON security.assets;
DROP TRIGGER IF EXISTS update_vulnerabilities_updated_at ON security.vulnerabilities;
DROP TRIGGER IF EXISTS update_incidents_updated_at ON security.incidents;
DROP TRIGGER IF EXISTS update_subnets_updated_at ON topology.ip_subnets;
DROP TRIGGER IF EXISTS update_ips_updated_at ON topology.ip_addresses;
DROP TRIGGER IF EXISTS update_vlans_updated_at ON topology.vlans;
DROP TRIGGER IF EXISTS update_connections_updated_at ON topology.connections;
DROP TRIGGER IF EXISTS update_frameworks_updated_at ON compliance.frameworks;
DROP TRIGGER IF EXISTS update_controls_updated_at ON compliance.controls;
DROP TRIGGER IF EXISTS update_documents_updated_at ON compliance.documents;
DROP TRIGGER IF EXISTS update_document_categories_updated_at ON compliance.document_categories;
DROP TRIGGER IF EXISTS update_required_documents_updated_at ON compliance.required_documents;
DROP TRIGGER IF EXISTS update_document_status_updated_at ON compliance.document_status;
DROP TRIGGER IF EXISTS update_document_review_schedule_updated_at ON compliance.document_review_schedule;

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

CREATE TRIGGER update_document_categories_updated_at BEFORE UPDATE ON compliance.document_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_required_documents_updated_at BEFORE UPDATE ON compliance.required_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_status_updated_at BEFORE UPDATE ON compliance.document_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_review_schedule_updated_at BEFORE UPDATE ON compliance.document_review_schedule
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
-- SEED DATA: Document Categories (ANEEL RN 964/2021)
-- ============================================================================

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

