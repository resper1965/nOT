-- ============================================================================
-- Fix RLS Policies - Remove existing policies and recreate
-- ============================================================================
-- Execute this if you get "policy already exists" error
-- ============================================================================

-- Remove existing policies
DROP POLICY IF EXISTS "Authenticated users can view assets" ON security.assets;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON compliance.documents;
DROP POLICY IF EXISTS "Authenticated users can view vlans" ON topology.vlans;
DROP POLICY IF EXISTS "Authenticated users can view ip_addresses" ON topology.ip_addresses;

-- Recreate policies
CREATE POLICY "Authenticated users can view assets"
ON security.assets FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view documents"
ON compliance.documents FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view vlans"
ON topology.vlans FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view ip_addresses"
ON topology.ip_addresses FOR SELECT
USING (auth.role() = 'authenticated');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies fixed successfully!';
END $$;

