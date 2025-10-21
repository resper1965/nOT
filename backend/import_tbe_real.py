#!/usr/bin/env python3
"""
Import TBE network assets from real CSV structure to PostgreSQL
"""

import csv
import psycopg2
from psycopg2.extras import execute_values
import re

# Database connection (within Docker network)
DB_CONFIG = {
    'host': 'postgres',
    'port': 5432,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def parse_ips(ipv4_str):
    """Parse IPs from comma-separated string"""
    if not ipv4_str or ipv4_str == '':
        return []
    return [ip.strip() for ip in ipv4_str.split(',') if ip.strip()]

def parse_vlans(vlan_str):
    """Parse VLANs from comma-separated string"""
    if not vlan_str or vlan_str == '':
        return []
    vlans = []
    for v in vlan_str.split(','):
        v = v.strip()
        if v.isdigit():
            vlan_id = int(v)
            # Valid VLAN range: 1-4094
            if 1 <= vlan_id <= 4094:
                vlans.append(vlan_id)
    return vlans

def determine_device_type(shape_name, master_name, text):
    """Determine device type from available fields"""
    combined = f"{shape_name} {master_name} {text}".lower()
    
    if any(word in combined for word in ['router', 'roteador']):
        return 'Router'
    elif any(word in combined for word in ['switch', 'comutador']):
        return 'Switch'
    elif any(word in combined for word in ['server', 'servidor']):
        return 'Server'
    elif any(word in combined for word in ['firewall', 'fw']):
        return 'Firewall'
    elif 'ethernet' in combined:
        return 'Ethernet'
    elif any(word in combined for word in ['hub']):
        return 'Hub'
    elif any(word in combined for word in ['modem']):
        return 'Modem'
    else:
        return 'Network Device'

def import_assets():
    """Import assets from real CSV structure"""
    
    print("=" * 80)
    print("💧 HIDRATANDO Sistema - Importando dados reais TBE")
    print("=" * 80)
    
    # Connect to database
    print(f"\n📡 Conectando ao banco: {DB_CONFIG['database']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Read CSV
    print("\n📖 Lendo assets/ativos_normalizados.csv...")
    with open('/app/assets/ativos_normalizados.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        assets = list(reader)
    
    print(f"   ✅ {len(assets)} linhas lidas")
    
    # Process assets
    asset_data = []
    vlan_set = set()
    ip_list = []
    
    valid_count = 0
    for idx, asset in enumerate(assets):
        shape_id = asset.get('shape_id', '').strip()
        if not shape_id:
            continue
        
        shape_name = asset.get('shape_name', '').strip()
        master_name = asset.get('master_name', '').strip()
        text = asset.get('text', '').strip()
        
        # Skip if no meaningful data
        if not shape_name and not master_name and not text:
            continue
        
        # Get IPs
        ipv4_str = asset.get('ipv4', '').strip()
        ips = parse_ips(ipv4_str)
        
        # Get VLANs
        vlan_str = asset.get('vlans', '').strip()
        vlans = parse_vlans(vlan_str)
        
        # Get device type
        device_type = determine_device_type(shape_name, master_name, text)
        
        # Get primary IP (first one if multiple)
        primary_ip = ips[0] if ips else None
        
        # Get primary VLAN
        primary_vlan = vlans[0] if vlans else None
        
        # Determine criticality
        criticality = 'low'
        if device_type.lower() in ['router', 'firewall']:
            criticality = 'high'
        elif device_type.lower() in ['switch', 'server']:
            criticality = 'medium'
        
        # Create asset name
        asset_name = shape_name or text or f"Device-{shape_id}"
        if len(asset_name) > 100:
            asset_name = asset_name[:97] + "..."
        
        asset_data.append((
            asset_name,
            device_type,
            primary_ip,
            None,  # mac_address
            criticality,
            'active'
        ))
        
        # Collect VLANs
        for vlan in vlans:
            vlan_set.add(vlan)
        
        # Collect IPs with asset info
        for ip in ips:
            ip_list.append((ip, primary_vlan))
        
        valid_count += 1
    
    print(f"   ✅ {valid_count} ativos válidos processados")
    print(f"   ✅ {len(vlan_set)} VLANs únicas")
    print(f"   ✅ {len(ip_list)} IPs coletados")
    
    # Insert VLANs
    if vlan_set:
        print(f"\n🏷️  Inserindo {len(vlan_set)} VLANs...")
        vlan_insert = [
            (vlan_id, f"VLAN {vlan_id}", None, 'low')  # vlan_id, vlan_name, description, criticality
            for vlan_id in sorted(vlan_set)
        ]
        
        execute_values(
            cur,
            """
            INSERT INTO topology.vlans (vlan_id, vlan_name, description, criticality)
            VALUES %s
            ON CONFLICT (vlan_id) DO NOTHING
            """,
            vlan_insert
        )
        print(f"   ✅ VLANs inseridas")
    
    # Insert Assets
    if asset_data:
        print(f"\n📦 Inserindo {len(asset_data)} Assets...")
        execute_values(
            cur,
            """
            INSERT INTO security.assets 
            (asset_name, asset_type, ip_address, mac_address, criticality, status)
            VALUES %s
            """,
            asset_data,
            page_size=1000
        )
        print(f"   ✅ Assets inseridos")
    
    # Insert IPs
    if ip_list:
        print(f"\n🔢 Inserindo {len(ip_list)} IPs...")
        # Add interface_name to avoid conflict (ip_address, interface_name is UNIQUE)
        ip_data_with_iface = [(ip, vlan, 'eth0') for ip, vlan in ip_list]
        ip_data_unique = list(set(ip_data_with_iface))  # Remove duplicates
        execute_values(
            cur,
            """
            INSERT INTO topology.ip_addresses (ip_address, vlan_id, interface_name)
            VALUES %s
            ON CONFLICT (ip_address, interface_name) DO NOTHING
            """,
            ip_data_unique,
            page_size=1000
        )
        print(f"   ✅ IPs inseridos")
    
    # Commit
    conn.commit()
    
    # Get statistics
    print("\n📊 Estatísticas do banco:")
    
    cur.execute("SELECT COUNT(*) FROM security.assets")
    assets_count = cur.fetchone()[0]
    print(f"   • Assets: {assets_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.vlans")
    vlans_count = cur.fetchone()[0]
    print(f"   • VLANs: {vlans_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.ip_addresses")
    ips_count = cur.fetchone()[0]
    print(f"   • IPs: {ips_count:,}")
    
    # Show sample
    print("\n📋 Amostra de assets:")
    cur.execute("""
        SELECT asset_name, asset_type, ip_address, criticality 
        FROM security.assets 
        LIMIT 5
    """)
    for row in cur.fetchall():
        print(f"   • {row[0][:40]:40} | {row[1]:15} | {row[2] or 'N/A':15} | {row[3]}")
    
    # Close
    cur.close()
    conn.close()
    
    print("\n" + "=" * 80)
    print("✅ Sistema HIDRATADO com sucesso!")
    print("=" * 80)
    print(f"""
💧 Dados TBE importados!

Assets: {assets_count:,}
VLANs: {vlans_count:,}
IPs: {ips_count:,}

🌐 Acesse o frontend: http://localhost:3002
📊 API: http://localhost:8001/docs
""")

if __name__ == '__main__':
    try:
        import_assets()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()

