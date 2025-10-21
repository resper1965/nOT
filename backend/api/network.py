from fastapi import APIRouter
import psycopg2

router = APIRouter(prefix="/api/network", tags=["network"])

DB_CONFIG = {
    'host': 'postgres',
    'port': 5432,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def get_db():
    return psycopg2.connect(**DB_CONFIG)

@router.get("/vlans")
async def get_vlans():
    """Get all VLANs"""
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT vlan_id, vlan_name, criticality, description
        FROM topology.vlans
        ORDER BY vlan_id
    """)
    
    vlans = []
    for row in cur.fetchall():
        vlans.append({
            "id": row[0],
            "name": row[1],
            "criticality": row[2],
            "description": row[3]
        })
    
    cur.close()
    conn.close()
    
    return {"vlans": vlans, "total": len(vlans)}

@router.get("/ip-summary")
async def get_ip_summary():
    """Get IP address summary"""
    conn = get_db()
    cur = conn.cursor()
    
    # Total IPs
    cur.execute("SELECT COUNT(*) FROM topology.ip_addresses")
    total_ips = cur.fetchone()[0]
    
    # IPs by VLAN
    cur.execute("""
        SELECT v.vlan_name, COUNT(ip.id) as ip_count
        FROM topology.vlans v
        LEFT JOIN topology.ip_addresses ip ON ip.vlan_id = v.vlan_id
        GROUP BY v.vlan_name
        HAVING COUNT(ip.id) > 0
        ORDER BY ip_count DESC
        LIMIT 10
    """)
    
    by_vlan = [{"vlan": row[0], "count": row[1]} for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    return {
        "total_ips": total_ips,
        "by_vlan": by_vlan
    }

@router.get("/topology-summary")
async def get_topology_summary():
    """Get network topology summary"""
    conn = get_db()
    cur = conn.cursor()
    
    # Assets by type
    cur.execute("""
        SELECT asset_type, COUNT(*) as count
        FROM security.assets
        WHERE asset_type IN ('Router', 'Switch', 'Server', 'Firewall', 'Hub', 'Bridge')
        GROUP BY asset_type
        ORDER BY count DESC
    """)
    
    devices = {}
    for row in cur.fetchall():
        devices[row[0].lower()] = row[1]
    
    # Get VLANs count
    cur.execute("SELECT COUNT(*) FROM topology.vlans")
    total_vlans = cur.fetchone()[0]
    
    # Get IPs count
    cur.execute("SELECT COUNT(*) FROM topology.ip_addresses")
    total_ips = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return {
        "devices": devices,
        "vlans": total_vlans,
        "ips": total_ips,
        "subnets": 109,  # From analysis
        "connections": 1345  # From CSV
    }

