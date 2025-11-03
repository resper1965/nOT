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

-- ONS Controls view
CREATE OR REPLACE VIEW public.ons_controls AS
SELECT * FROM compliance.ons_controls;

-- Document Categories view
CREATE OR REPLACE VIEW public.document_categories AS
SELECT * FROM compliance.document_categories;

-- Required Documents view
CREATE OR REPLACE VIEW public.required_documents AS
SELECT * FROM compliance.required_documents;

-- Document Versions view
CREATE OR REPLACE VIEW public.document_versions AS
SELECT * FROM compliance.document_versions;

-- Assessments view
CREATE OR REPLACE VIEW public.assessments AS
SELECT * FROM compliance.assessments;

-- Control Results view
CREATE OR REPLACE VIEW public.control_results AS
SELECT * FROM compliance.control_results;

-- ============================================================================
-- TOPOLOGY SCHEMA VIEWS
-- ============================================================================

-- Network Zones view
CREATE OR REPLACE VIEW public.network_zones AS
SELECT * FROM topology.network_zones;

-- Network Connections view
CREATE OR REPLACE VIEW public.network_connections AS
SELECT * FROM topology.network_connections;

-- IP Subnets view
CREATE OR REPLACE VIEW public.ip_subnets AS
SELECT * FROM topology.ip_subnets;

-- IP Addresses view
CREATE OR REPLACE VIEW public.ip_addresses AS
SELECT * FROM topology.ip_addresses;

-- VLANs view
CREATE OR REPLACE VIEW public.vlans AS
SELECT * FROM topology.vlans;

-- Routing Tables view
CREATE OR REPLACE VIEW public.routing_tables AS
SELECT * FROM topology.routing_tables;

-- Network Paths view
CREATE OR REPLACE VIEW public.network_paths AS
SELECT * FROM topology.network_paths;

-- Network Interfaces view
CREATE OR REPLACE VIEW public.network_interfaces AS
SELECT * FROM topology.network_interfaces;

-- Layer2 Topology view
CREATE OR REPLACE VIEW public.layer2_topology AS
SELECT * FROM topology.layer2_topology;

-- Network Segments view
CREATE OR REPLACE VIEW public.network_segments AS
SELECT * FROM topology.network_segments;

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

-- Data Leakage Paths view
CREATE OR REPLACE VIEW public.data_leakage_paths AS
SELECT * FROM security.data_leakage_paths;

-- ============================================================================
-- AUDIT SCHEMA VIEWS
-- ============================================================================

-- Activity Log view
CREATE OR REPLACE VIEW public.activity_log AS
SELECT * FROM audit.activity_log;

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
GRANT SELECT ON public.ons_controls TO authenticated;
GRANT SELECT ON public.ons_controls TO anon;
GRANT SELECT ON public.document_categories TO authenticated;
GRANT SELECT ON public.document_categories TO anon;
GRANT SELECT ON public.required_documents TO authenticated;
GRANT SELECT ON public.required_documents TO anon;
GRANT SELECT ON public.document_versions TO authenticated;
GRANT SELECT ON public.document_versions TO anon;
GRANT SELECT ON public.assessments TO authenticated;
GRANT SELECT ON public.assessments TO anon;
GRANT SELECT ON public.control_results TO authenticated;
GRANT SELECT ON public.control_results TO anon;

GRANT SELECT ON public.network_zones TO authenticated;
GRANT SELECT ON public.network_zones TO anon;
GRANT SELECT ON public.network_connections TO authenticated;
GRANT SELECT ON public.network_connections TO anon;
GRANT SELECT ON public.ip_subnets TO authenticated;
GRANT SELECT ON public.ip_subnets TO anon;
GRANT SELECT ON public.ip_addresses TO authenticated;
GRANT SELECT ON public.ip_addresses TO anon;
GRANT SELECT ON public.vlans TO authenticated;
GRANT SELECT ON public.vlans TO anon;
GRANT SELECT ON public.routing_tables TO authenticated;
GRANT SELECT ON public.routing_tables TO anon;
GRANT SELECT ON public.network_paths TO authenticated;
GRANT SELECT ON public.network_paths TO anon;
GRANT SELECT ON public.network_interfaces TO authenticated;
GRANT SELECT ON public.network_interfaces TO anon;
GRANT SELECT ON public.layer2_topology TO authenticated;
GRANT SELECT ON public.layer2_topology TO anon;
GRANT SELECT ON public.network_segments TO authenticated;
GRANT SELECT ON public.network_segments TO anon;

GRANT SELECT ON public.assets TO authenticated;
GRANT SELECT ON public.assets TO anon;
GRANT SELECT ON public.vulnerabilities TO authenticated;
GRANT SELECT ON public.vulnerabilities TO anon;
GRANT SELECT ON public.incidents TO authenticated;
GRANT SELECT ON public.incidents TO anon;
GRANT SELECT ON public.data_leakage_paths TO authenticated;
GRANT SELECT ON public.data_leakage_paths TO anon;

GRANT SELECT ON public.activity_log TO authenticated;
GRANT SELECT ON public.activity_log TO anon;

