-- Create views in public schema for Supabase PostgREST access
-- These views expose tables from custom schemas (compliance, topology, security, audit)

-- ============================================================================
-- COMPLIANCE SCHEMA VIEWS
-- ============================================================================

-- Documents view
CREATE OR REPLACE VIEW public.documents AS
SELECT * FROM compliance.documents;

-- Frameworks view
CREATE OR REPLACE VIEW public.frameworks AS
SELECT * FROM compliance.frameworks;

-- Controls view
CREATE OR REPLACE VIEW public.controls AS
SELECT * FROM compliance.controls;

-- Document Categories view
CREATE OR REPLACE VIEW public.document_categories AS
SELECT * FROM compliance.document_categories;

-- Required Documents view
CREATE OR REPLACE VIEW public.required_documents AS
SELECT * FROM compliance.required_documents;

-- Document Versions view
CREATE OR REPLACE VIEW public.document_versions AS
SELECT * FROM compliance.document_versions;

-- Document Status view
CREATE OR REPLACE VIEW public.document_status AS
SELECT * FROM compliance.document_status;

-- Document Approvals view
CREATE OR REPLACE VIEW public.document_approvals AS
SELECT * FROM compliance.document_approvals;

-- Document Review Schedule view
CREATE OR REPLACE VIEW public.document_review_schedule AS
SELECT * FROM compliance.document_review_schedule;

-- ============================================================================
-- TOPOLOGY SCHEMA VIEWS
-- ============================================================================

-- Network Connections view (topology.connections)
CREATE OR REPLACE VIEW public.network_connections AS
SELECT * FROM topology.connections;

-- IP Subnets view
CREATE OR REPLACE VIEW public.ip_subnets AS
SELECT * FROM topology.ip_subnets;

-- IP Addresses view
CREATE OR REPLACE VIEW public.ip_addresses AS
SELECT * FROM topology.ip_addresses;

-- VLANs view
CREATE OR REPLACE VIEW public.vlans AS
SELECT * FROM topology.vlans;

-- ============================================================================
-- SECURITY SCHEMA VIEWS
-- ============================================================================

-- Assets view
CREATE OR REPLACE VIEW public.assets AS
SELECT * FROM security.assets;

-- Vulnerabilities view
CREATE OR REPLACE VIEW public.vulnerabilities AS
SELECT * FROM security.vulnerabilities;

-- Incidents view
CREATE OR REPLACE VIEW public.incidents AS
SELECT * FROM security.incidents;

-- ============================================================================
-- AUDIT SCHEMA VIEWS
-- ============================================================================

-- Audit Logs view
CREATE OR REPLACE VIEW public.audit_logs AS
SELECT * FROM audit.logs;

-- Audit Changes view
CREATE OR REPLACE VIEW public.audit_changes AS
SELECT * FROM audit.changes;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant SELECT permissions on views
GRANT SELECT ON public.documents TO authenticated;
GRANT SELECT ON public.documents TO anon;
GRANT SELECT ON public.frameworks TO authenticated;
GRANT SELECT ON public.frameworks TO anon;
GRANT SELECT ON public.controls TO authenticated;
GRANT SELECT ON public.controls TO anon;
GRANT SELECT ON public.document_categories TO authenticated;
GRANT SELECT ON public.document_categories TO anon;
GRANT SELECT ON public.required_documents TO authenticated;
GRANT SELECT ON public.required_documents TO anon;
GRANT SELECT ON public.document_versions TO authenticated;
GRANT SELECT ON public.document_versions TO anon;
GRANT SELECT ON public.document_status TO authenticated;
GRANT SELECT ON public.document_status TO anon;
GRANT SELECT ON public.document_approvals TO authenticated;
GRANT SELECT ON public.document_approvals TO anon;
GRANT SELECT ON public.document_review_schedule TO authenticated;
GRANT SELECT ON public.document_review_schedule TO anon;

GRANT SELECT ON public.network_connections TO authenticated;
GRANT SELECT ON public.network_connections TO anon;
GRANT SELECT ON public.ip_subnets TO authenticated;
GRANT SELECT ON public.ip_subnets TO anon;
GRANT SELECT ON public.ip_addresses TO authenticated;
GRANT SELECT ON public.ip_addresses TO anon;
GRANT SELECT ON public.vlans TO authenticated;
GRANT SELECT ON public.vlans TO anon;

GRANT SELECT ON public.assets TO authenticated;
GRANT SELECT ON public.assets TO anon;
GRANT SELECT ON public.vulnerabilities TO authenticated;
GRANT SELECT ON public.vulnerabilities TO anon;
GRANT SELECT ON public.incidents TO authenticated;
GRANT SELECT ON public.incidents TO anon;

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT ON public.audit_logs TO anon;
GRANT SELECT ON public.audit_changes TO authenticated;
GRANT SELECT ON public.audit_changes TO anon;

