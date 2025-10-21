-- ============================================================================
-- NETWORK TOPOLOGY & IP ANALYSIS SCHEMA
-- Deep network analysis for ness. OT GRC
-- ============================================================================

-- Extend topology schema with detailed network analysis tables

-- Updated timestamp trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- IP Subnets
CREATE TABLE topology.ip_subnets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    allocation_status VARCHAR(50), -- planned, allocated, full, deprecated
    ip_utilization_percent DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subnets_cidr ON topology.ip_subnets USING GIST(subnet_cidr inet_ops);
CREATE INDEX idx_subnets_vlan ON topology.ip_subnets(vlan_id);
CREATE INDEX idx_subnets_zone ON topology.ip_subnets(zone_id);

-- IP Addresses (individual IPs assigned to assets)
CREATE TABLE topology.ip_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_ips_address ON topology.ip_addresses(ip_address);
CREATE INDEX idx_ips_asset ON topology.ip_addresses(asset_id);
CREATE INDEX idx_ips_subnet ON topology.ip_addresses(subnet_id);
CREATE INDEX idx_ips_mac ON topology.ip_addresses(mac_address);
CREATE INDEX idx_ips_vlan ON topology.ip_addresses(vlan_id);

-- VLANs
CREATE TABLE topology.vlans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE INDEX idx_vlans_id ON topology.vlans(vlan_id);
CREATE INDEX idx_vlans_zone ON topology.vlans(zone_id);

-- Routing Tables
CREATE TABLE topology.routing_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    router_asset_id UUID REFERENCES security.assets(id),
    destination_network CIDR NOT NULL,
    next_hop INET,
    interface_name VARCHAR(100),
    routing_protocol VARCHAR(50), -- static, ospf, bgp, eigrp, rip
    metric INTEGER,
    administrative_distance INTEGER,
    route_type VARCHAR(50), -- connected, static, dynamic
    is_default_route BOOLEAN DEFAULT false,
    vlan_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routes_router ON topology.routing_tables(router_asset_id);
CREATE INDEX idx_routes_dest ON topology.routing_tables USING GIST(destination_network inet_ops);
CREATE INDEX idx_routes_protocol ON topology.routing_tables(routing_protocol);

-- Network Paths (traced paths between systems)
CREATE TABLE topology.network_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_name VARCHAR(255),
    source_asset_id UUID REFERENCES security.assets(id),
    destination_asset_id UUID REFERENCES security.assets(id),
    hop_sequence JSONB, -- [{hop: 1, device_id: uuid, ip: "x.x.x.x"}, ...]
    total_hops INTEGER,
    estimated_latency_ms DECIMAL(10,2),
    path_type VARCHAR(50), -- direct, routed, via_firewall, cross_zone
    protocols_used TEXT[],
    crosses_security_boundaries BOOLEAN DEFAULT false,
    criticality VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_paths_source ON topology.network_paths(source_asset_id);
CREATE INDEX idx_paths_dest ON topology.network_paths(destination_asset_id);

-- Network Interfaces (detailed interface information)
CREATE TABLE topology.network_interfaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES security.assets(id),
    interface_name VARCHAR(100) NOT NULL,
    interface_type VARCHAR(50), -- ethernet, fiber, serial, loopback, vlan
    ip_address INET,
    subnet_mask INET,
    mac_address MACADDR,
    vlan_id INTEGER,
    vlan_mode VARCHAR(20), -- access, trunk
    speed_mbps INTEGER,
    duplex VARCHAR(20), -- full, half, auto
    status VARCHAR(20) DEFAULT 'up', -- up, down, admin_down
    description TEXT,
    connected_to_interface_id UUID REFERENCES topology.network_interfaces(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, interface_name)
);

CREATE INDEX idx_interfaces_asset ON topology.network_interfaces(asset_id);
CREATE INDEX idx_interfaces_ip ON topology.network_interfaces(ip_address);
CREATE INDEX idx_interfaces_vlan ON topology.network_interfaces(vlan_id);
CREATE INDEX idx_interfaces_connected ON topology.network_interfaces(connected_to_interface_id);

-- Routing Protocols Configuration
CREATE TABLE topology.routing_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    router_asset_id UUID REFERENCES security.assets(id),
    protocol_name VARCHAR(50) NOT NULL, -- OSPF, BGP, EIGRP, RIP, Static
    protocol_config JSONB,
    areas_or_as TEXT[], -- OSPF areas or BGP AS numbers
    enabled BOOLEAN DEFAULT true,
    priority INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_routing_protocols_router ON topology.routing_protocols(router_asset_id);
CREATE INDEX idx_routing_protocols_name ON topology.routing_protocols(protocol_name);

-- Layer 2 Topology (Switches and VLANs)
CREATE TABLE topology.layer2_topology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    switch_asset_id UUID REFERENCES security.assets(id),
    port_number VARCHAR(50) NOT NULL,
    port_mode VARCHAR(20), -- access, trunk
    vlan_id INTEGER,
    trunk_allowed_vlans INTEGER[],
    stp_state VARCHAR(50), -- forwarding, blocking, disabled
    port_security BOOLEAN DEFAULT false,
    connected_device_id UUID REFERENCES security.assets(id),
    connected_port VARCHAR(50),
    link_speed_mbps INTEGER,
    duplex VARCHAR(20),
    status VARCHAR(20) DEFAULT 'up',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(switch_asset_id, port_number)
);

CREATE INDEX idx_l2_switch ON topology.layer2_topology(switch_asset_id);
CREATE INDEX idx_l2_vlan ON topology.layer2_topology(vlan_id);
CREATE INDEX idx_l2_connected ON topology.layer2_topology(connected_device_id);

-- Network Segments (Purdue Model Levels)
CREATE TABLE topology.network_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_name VARCHAR(255) NOT NULL,
    purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5),
    zone_id UUID REFERENCES topology.network_zones(id),
    subnets CIDR[],
    vlans INTEGER[],
    description TEXT,
    criticality VARCHAR(20) CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
    isolation_level VARCHAR(50), -- isolated, firewalled, segmented, flat
    allowed_communications JSONB, -- rules for inter-segment communication
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_segments_purdue ON topology.network_segments(purdue_level);
CREATE INDEX idx_segments_zone ON topology.network_segments(zone_id);

-- ============================================================================
-- VIEWS FOR NETWORK ANALYSIS
-- ============================================================================

-- Subnet Utilization
CREATE VIEW topology.subnet_utilization AS
SELECT 
    s.subnet_cidr,
    s.subnet_name,
    s.total_ips,
    s.usable_ips,
    COUNT(ip.id) as allocated_ips,
    s.usable_ips - COUNT(ip.id) as available_ips,
    ROUND(100.0 * COUNT(ip.id) / NULLIF(s.usable_ips, 0), 2) as utilization_percent,
    s.vlan_id,
    v.vlan_name,
    z.zone_name,
    s.criticality
FROM topology.ip_subnets s
LEFT JOIN topology.ip_addresses ip ON s.id = ip.subnet_id AND ip.status = 'active'
LEFT JOIN topology.vlans v ON s.vlan_id = v.vlan_id
LEFT JOIN topology.network_zones z ON s.zone_id = z.id
GROUP BY s.id, s.subnet_cidr, s.subnet_name, s.total_ips, s.usable_ips, s.vlan_id, v.vlan_name, z.zone_name, s.criticality
ORDER BY utilization_percent DESC;

-- VLAN Summary
CREATE VIEW topology.vlan_summary AS
SELECT 
    v.vlan_id,
    v.vlan_name,
    v.purpose,
    v.criticality,
    z.zone_name,
    COUNT(DISTINCT s.id) as subnet_count,
    COUNT(DISTINCT ip.id) as ip_count,
    COUNT(DISTINCT ip.asset_id) as device_count,
    STRING_AGG(DISTINCT s.subnet_cidr::text, ', ' ORDER BY s.subnet_cidr::text) as subnets
FROM topology.vlans v
LEFT JOIN topology.ip_subnets s ON v.vlan_id = s.vlan_id
LEFT JOIN topology.ip_addresses ip ON v.vlan_id = ip.vlan_id
LEFT JOIN topology.network_zones z ON v.zone_id = z.id
GROUP BY v.id, v.vlan_id, v.vlan_name, v.purpose, v.criticality, z.zone_name
ORDER BY v.vlan_id;

-- Network Topology Map (simplified for visualization)
CREATE VIEW topology.network_map AS
SELECT 
    a.id as device_id,
    a.asset_name,
    a.asset_type,
    a.criticality,
    STRING_AGG(DISTINCT ip.ip_address::text, ', ') as ip_addresses,
    STRING_AGG(DISTINCT ip.vlan_id::text, ', ') as vlans,
    z.zone_name,
    COUNT(DISTINCT nc_out.id) as outbound_connections,
    COUNT(DISTINCT nc_in.id) as inbound_connections
FROM security.assets a
LEFT JOIN topology.ip_addresses ip ON a.id = ip.asset_id
LEFT JOIN topology.network_zones z ON ip.subnet_id IN (
    SELECT id FROM topology.ip_subnets WHERE zone_id = z.id
)
LEFT JOIN topology.network_connections nc_out ON a.id = nc_out.source_asset_id
LEFT JOIN topology.network_connections nc_in ON a.id = nc_in.destination_asset_id
WHERE a.status = 'active'
GROUP BY a.id, a.asset_name, a.asset_type, a.criticality, z.zone_name;

-- Routing Analysis View
CREATE VIEW topology.routing_summary AS
SELECT 
    a.asset_name as router_name,
    a.asset_type,
    COUNT(DISTINCT rt.id) as total_routes,
    COUNT(DISTINCT rt.destination_network) as unique_destinations,
    STRING_AGG(DISTINCT rt.routing_protocol, ', ') as protocols_used,
    COUNT(DISTINCT CASE WHEN rt.is_default_route THEN rt.id END) as default_routes,
    MAX(rt.metric) as max_metric
FROM security.assets a
JOIN topology.routing_tables rt ON a.id = rt.router_asset_id
WHERE a.asset_type IN ('Router', 'Firewall', 'L3 Switch')
GROUP BY a.id, a.asset_name, a.asset_type
ORDER BY total_routes DESC;

-- Network Segmentation Analysis
CREATE VIEW topology.segmentation_analysis AS
SELECT 
    ns.segment_name,
    ns.purdue_level,
    nz.zone_name,
    ns.isolation_level,
    COUNT(DISTINCT s.id) as subnet_count,
    COUNT(DISTINCT ip.id) as device_count,
    COUNT(DISTINCT nc.id) as cross_segment_connections,
    CASE 
        WHEN COUNT(DISTINCT nc.id) = 0 THEN 'Fully Isolated'
        WHEN COUNT(DISTINCT nc.id) < 5 THEN 'Well Segmented'
        WHEN COUNT(DISTINCT nc.id) < 20 THEN 'Moderately Segmented'
        ELSE 'Poor Segmentation'
    END as segmentation_quality
FROM topology.network_segments ns
LEFT JOIN topology.network_zones nz ON ns.zone_id = nz.id
LEFT JOIN topology.ip_subnets s ON s.zone_id = nz.id
LEFT JOIN topology.ip_addresses ip ON s.id = ip.subnet_id
LEFT JOIN topology.network_connections nc ON 
    (nc.source_zone_id = nz.id OR nc.destination_zone_id = nz.id)
    AND nc.source_zone_id != nc.destination_zone_id
GROUP BY ns.id, ns.segment_name, ns.purdue_level, nz.zone_name, ns.isolation_level
ORDER BY ns.purdue_level;

-- IP Address Conflicts Detection
CREATE VIEW topology.ip_conflicts AS
SELECT 
    ip.ip_address,
    COUNT(*) as conflict_count,
    STRING_AGG(DISTINCT a.asset_name, ', ' ORDER BY a.asset_name) as conflicting_devices,
    STRING_AGG(DISTINCT ip.interface_name, ', ') as interfaces,
    STRING_AGG(DISTINCT ip.mac_address::text, ', ') as mac_addresses
FROM topology.ip_addresses ip
JOIN security.assets a ON ip.asset_id = a.id
WHERE ip.status = 'active'
GROUP BY ip.ip_address
HAVING COUNT(*) > 1
ORDER BY conflict_count DESC;

-- Unused Subnets
CREATE VIEW topology.unused_subnets AS
SELECT 
    s.subnet_cidr,
    s.subnet_name,
    s.usable_ips,
    s.vlan_id,
    v.vlan_name,
    z.zone_name,
    s.allocation_status,
    CURRENT_DATE - s.created_at::date as days_since_created
FROM topology.ip_subnets s
LEFT JOIN topology.vlans v ON s.vlan_id = v.vlan_id
LEFT JOIN topology.network_zones z ON s.zone_id = z.id
LEFT JOIN topology.ip_addresses ip ON s.id = ip.subnet_id
WHERE ip.id IS NULL
ORDER BY s.usable_ips DESC;

-- Critical Path Analysis
CREATE VIEW topology.critical_paths AS
SELECT 
    np.path_name,
    sa.asset_name as source,
    da.asset_name as destination,
    np.total_hops,
    np.estimated_latency_ms,
    np.crosses_security_boundaries,
    np.protocols_used,
    CASE 
        WHEN np.crosses_security_boundaries AND np.total_hops > 5 THEN 'High Risk'
        WHEN np.crosses_security_boundaries THEN 'Medium Risk'
        WHEN np.total_hops > 10 THEN 'Performance Risk'
        ELSE 'Low Risk'
    END as risk_assessment
FROM topology.network_paths np
JOIN security.assets sa ON np.source_asset_id = sa.id
JOIN security.assets da ON np.destination_asset_id = da.id
WHERE sa.criticality IN ('critical', 'high')
   OR da.criticality IN ('critical', 'high')
ORDER BY np.total_hops DESC;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_ip_subnets_updated_at 
    BEFORE UPDATE ON topology.ip_subnets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_addresses_updated_at 
    BEFORE UPDATE ON topology.ip_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vlans_updated_at 
    BEFORE UPDATE ON topology.vlans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routing_tables_updated_at 
    BEFORE UPDATE ON topology.routing_tables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_paths_updated_at 
    BEFORE UPDATE ON topology.network_paths 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_interfaces_updated_at 
    BEFORE UPDATE ON topology.network_interfaces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_layer2_topology_updated_at 
    BEFORE UPDATE ON topology.layer2_topology 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_segments_updated_at 
    BEFORE UPDATE ON topology.network_segments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routing_protocols_updated_at 
    BEFORE UPDATE ON topology.routing_protocols 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA topology TO ness_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA topology TO ness_admin;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Network topology deep analysis schema initialized!';
    RAISE NOTICE '🌐 IP addressing, routing, VLANs, paths analysis ready!';
END $$;
