from fastapi import APIRouter, HTTPException
import psycopg2
from typing import List, Dict, Any
import os

router = APIRouter(prefix="/api/assets", tags=["assets"])

DB_CONFIG = {
    'host': 'postgres',
    'port': 5432,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def get_db():
    return psycopg2.connect(**DB_CONFIG)

@router.get("/stats")
async def get_assets_stats():
    """Get network assets statistics"""
    conn = get_db()
    cur = conn.cursor()
    
    # Total assets
    cur.execute("SELECT COUNT(*) FROM security.assets")
    total_assets = cur.fetchone()[0]
    
    # By type
    cur.execute("""
        SELECT asset_type, COUNT(*) as count
        FROM security.assets
        GROUP BY asset_type
        ORDER BY count DESC
        LIMIT 10
    """)
    by_type = [{"type": row[0], "count": row[1]} for row in cur.fetchall()]
    
    # By criticality
    cur.execute("""
        SELECT criticality, COUNT(*) as count
        FROM security.assets
        GROUP BY criticality
        ORDER BY 
            CASE criticality
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
            END
    """)
    by_criticality = [{"criticality": row[0], "count": row[1]} for row in cur.fetchall()]
    
    # VLANs
    cur.execute("SELECT COUNT(*) FROM topology.vlans")
    total_vlans = cur.fetchone()[0]
    
    # IPs
    cur.execute("SELECT COUNT(*) FROM topology.ip_addresses")
    total_ips = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return {
        "total_assets": total_assets,
        "total_vlans": total_vlans,
        "total_ips": total_ips,
        "by_type": by_type,
        "by_criticality": by_criticality
    }

@router.get("/top-devices")
async def get_top_devices():
    """Get top network devices by type"""
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            asset_type,
            COUNT(*) as count,
            COUNT(CASE WHEN criticality = 'high' THEN 1 END) as high_criticality,
            COUNT(CASE WHEN ip_address IS NOT NULL THEN 1 END) as with_ip
        FROM security.assets
        WHERE asset_type IN ('Router', 'Switch', 'Server', 'Firewall', 'Mainframe')
        GROUP BY asset_type
        ORDER BY count DESC
    """)
    
    devices = []
    for row in cur.fetchall():
        devices.append({
            "type": row[0],
            "count": row[1],
            "high_criticality": row[2],
            "with_ip": row[3]
        })
    
    cur.close()
    conn.close()
    
    return {"devices": devices}

@router.get("/list")
async def get_assets_list(limit: int = 100, offset: int = 0):
    """Get paginated list of assets"""
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            asset_name,
            asset_type,
            ip_address,
            criticality,
            status
        FROM security.assets
        ORDER BY 
            CASE criticality
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
            END,
            asset_name
        LIMIT %s OFFSET %s
    """, (limit, offset))
    
    assets = []
    for row in cur.fetchall():
        assets.append({
            "name": row[0],
            "type": row[1],
            "ip": str(row[2]) if row[2] else None,
            "criticality": row[3],
            "status": row[4]
        })
    
    cur.close()
    conn.close()
    
    return {"assets": assets, "limit": limit, "offset": offset}

