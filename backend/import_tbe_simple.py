#!/usr/bin/env python3
"""
Import TBE network assets to PostgreSQL database (simplified version)
"""

import csv
import json
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
import ipaddress

# Database connection (within Docker network)
DB_CONFIG = {
    'host': 'postgres',
    'port': 5432,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def import_assets():
    """Import assets from CSV to database"""
    
    print("=" * 80)
    print("🔄 Importando dados TBE para PostgreSQL (Versão Simplificada)")
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
    
    # Filter valid assets
    valid_assets = []
    for asset in assets:
        asset_id = asset.get('id', '').strip()
        if asset_id and asset_id != 'N/A':
            valid_assets.append(asset)
    
    print(f"   ✅ {len(valid_assets)} ativos válidos")
    
    # Prepare data for insertion
    print("\n💾 Preparando dados para importação...")
    asset_data = []
    vlan_data = set()
    
    for asset in valid_assets:
        asset_id = asset.get('id', 'unknown')
        asset_type = asset.get('Tipo', 'Unknown')
        hostname = asset.get('hostname') or None
        if hostname == 'N/A':
            hostname = None
        
        ip_address = asset.get('Endereco_IP')
        if ip_address == 'N/A' or not ip_address:
            ip_address = None
        
        vlan = asset.get('VLAN')
        if vlan and vlan != 'N/A':
            try:
                vlan = int(vlan)
                vlan_data.add(vlan)
            except:
                vlan = None
        else:
            vlan = None
        
        mac_address = asset.get('Endereco_MAC')
        if mac_address == 'N/A' or not mac_address:
            mac_address = None
        
        # Determine criticality based on type
        criticality = 'low'
        if asset_type.lower() in ['router', 'firewall', 'server']:
            criticality = 'medium'
        elif asset_type.lower() in ['mainframe']:
            criticality = 'high'
        
        # Use asset_id as asset_name for now
        asset_data.append((
            asset_id,
            asset_type,
            ip_address,
            mac_address,
            criticality,
            'active'
        ))
    
    print(f"   ✅ {len(asset_data)} ativos preparados")
    print(f"   ✅ {len(vlan_data)} VLANs únicas")
    
    # Insert VLANs (into topology schema)
    if vlan_data:
        print("\n🏷️  Inserindo VLANs...")
        vlan_insert = [
            (vlan_id, f"VLAN {vlan_id}", None, 'active')
            for vlan_id in sorted(vlan_data)
        ]
        
        # First check if table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'topology' 
                AND table_name = 'vlans'
            )
        """)
        
        if cur.fetchone()[0]:
            execute_values(
                cur,
                """
                INSERT INTO topology.vlans (vlan_id, vlan_name, description, status)
                VALUES %s
                ON CONFLICT (vlan_id) DO NOTHING
                """,
                vlan_insert
            )
            print(f"   ✅ {len(vlan_data)} VLANs inseridas")
        else:
            print(f"   ⚠️  Tabela topology.vlans não existe (skip)")
    
    # Insert Assets
    print("\n📦 Inserindo Assets...")
    execute_values(
        cur,
        """
        INSERT INTO security.assets 
        (asset_name, asset_type, ip_address, mac_address, criticality, status)
        VALUES %s
        ON CONFLICT DO NOTHING
        """,
        asset_data,
        page_size=1000
    )
    print(f"   ✅ {len(asset_data)} Assets inseridos")
    
    # Commit
    conn.commit()
    
    # Get statistics
    print("\n📊 Estatísticas do banco:")
    
    cur.execute("SELECT COUNT(*) FROM security.assets")
    assets_count = cur.fetchone()[0]
    print(f"   • Assets: {assets_count:,}")
    
    # Close
    cur.close()
    conn.close()
    
    print("\n" + "=" * 80)
    print("✅ Importação completa!")
    print("=" * 80)
    print(f"""
🌐 Dados TBE importados com sucesso!

Assets: {assets_count:,}

🔍 Consultar dados:
   docker-compose exec postgres psql -U ness_admin -d ness_ot_grc
   
   SELECT * FROM security.assets LIMIT 10;
""")

if __name__ == '__main__':
    try:
        import_assets()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()

