#!/usr/bin/env python3
"""
Import TBE network assets to PostgreSQL database
"""

import csv
import json
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
import ipaddress

# Database connection
DB_CONFIG = {
    'host': 'localhost',
    'port': 5434,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def parse_ip(ip_str):
    """Parse IP address and return network info"""
    if not ip_str or ip_str == 'N/A':
        return None, None
    
    try:
        ip = ipaddress.ip_address(ip_str)
        return str(ip), None
    except:
        try:
            network = ipaddress.ip_network(ip_str, strict=False)
            return str(network.network_address), str(network.netmask)
        except:
            return None, None

def import_assets():
    """Import assets from CSV to database"""
    
    print("=" * 80)
    print("🔄 Importando dados TBE para PostgreSQL")
    print("=" * 80)
    
    # Connect to database
    print(f"\n📡 Conectando ao banco: {DB_CONFIG['database']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Create client TBE
    print("\n👤 Criando cliente TBE...")
    cur.execute("""
        INSERT INTO clients (id, name, code, industry, created_at)
        VALUES (gen_random_uuid(), 'TBE - Transmissora Brasileira de Energia', 'TBE', 'Setor Elétrico', NOW())
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
    """)
    client_id = cur.fetchone()[0]
    print(f"   ✅ Cliente TBE: {client_id}")
    
    # Read CSV
    print("\n📖 Lendo assets/ativos_normalizados.csv...")
    with open('assets/ativos_normalizados.csv', 'r', encoding='utf-8') as f:
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
    ip_data = []
    vlan_data = set()
    subnet_data = set()
    
    for asset in valid_assets:
        asset_id = asset.get('id', 'unknown')
        asset_type = asset.get('Tipo', 'Unknown')
        hostname = asset.get('hostname') or None
        if hostname == 'N/A':
            hostname = None
        
        ip_address = asset.get('Endereco_IP')
        if ip_address == 'N/A':
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
        if mac_address == 'N/A':
            mac_address = None
        
        # Determine criticality based on type
        criticality = 'low'
        if asset_type.lower() in ['router', 'firewall', 'server']:
            criticality = 'medium'
        elif asset_type.lower() in ['mainframe']:
            criticality = 'high'
        
        asset_data.append((
            asset_id,
            asset_type,
            hostname,
            ip_address,
            mac_address,
            vlan,
            criticality,
            'active',
            client_id
        ))
        
        # Collect IP data
        if ip_address:
            ip, netmask = parse_ip(ip_address)
            if ip:
                ip_data.append((
                    ip,
                    netmask,
                    vlan,
                    client_id
                ))
                
                # Try to determine subnet
                try:
                    ip_obj = ipaddress.ip_address(ip)
                    if ip_obj.is_private:
                        # Determine subnet based on IP
                        if str(ip).startswith('10.'):
                            subnet = str(ipaddress.ip_network(f"{ip}/24", strict=False))
                        elif str(ip).startswith('172.'):
                            subnet = str(ipaddress.ip_network(f"{ip}/24", strict=False))
                        elif str(ip).startswith('192.168'):
                            subnet = str(ipaddress.ip_network(f"{ip}/24", strict=False))
                        else:
                            subnet = str(ipaddress.ip_network(f"{ip}/30", strict=False))
                        subnet_data.add(subnet)
                except:
                    pass
    
    print(f"   ✅ {len(asset_data)} ativos preparados")
    print(f"   ✅ {len(ip_data)} IPs preparados")
    print(f"   ✅ {len(vlan_data)} VLANs únicas")
    print(f"   ✅ {len(subnet_data)} Subnets únicos")
    
    # Insert VLANs
    if vlan_data:
        print("\n🏷️  Inserindo VLANs...")
        vlan_insert = [
            (vlan_id, f"VLAN {vlan_id}", None, 'active', client_id)
            for vlan_id in sorted(vlan_data)
        ]
        execute_values(
            cur,
            """
            INSERT INTO topology.vlans (vlan_id, name, description, status, client_id)
            VALUES %s
            ON CONFLICT (vlan_id, client_id) DO NOTHING
            """,
            vlan_insert
        )
        print(f"   ✅ {len(vlan_data)} VLANs inseridas")
    
    # Insert Subnets
    if subnet_data:
        print("\n🌐 Inserindo Subnets...")
        subnet_insert = [
            (subnet, subnet.split('/')[0], int(subnet.split('/')[1]), None, 'active', client_id)
            for subnet in sorted(subnet_data)
        ]
        execute_values(
            cur,
            """
            INSERT INTO topology.ip_subnets (subnet_cidr, network_address, prefix_length, description, status, client_id)
            VALUES %s
            ON CONFLICT (subnet_cidr, client_id) DO NOTHING
            """,
            subnet_insert
        )
        print(f"   ✅ {len(subnet_data)} Subnets inseridos")
    
    # Insert Assets
    print("\n📦 Inserindo Assets...")
    execute_values(
        cur,
        """
        INSERT INTO security.assets 
        (asset_id, asset_type, hostname, ip_address, mac_address, vlan_id, criticality, status, client_id)
        VALUES %s
        ON CONFLICT (asset_id, client_id) DO UPDATE SET
            asset_type = EXCLUDED.asset_type,
            hostname = EXCLUDED.hostname,
            ip_address = EXCLUDED.ip_address,
            mac_address = EXCLUDED.mac_address,
            vlan_id = EXCLUDED.vlan_id,
            updated_at = NOW()
        """,
        asset_data,
        page_size=1000
    )
    print(f"   ✅ {len(asset_data)} Assets inseridos")
    
    # Insert IP Addresses
    if ip_data:
        print("\n🔢 Inserindo IP Addresses...")
        execute_values(
            cur,
            """
            INSERT INTO topology.ip_addresses (ip_address, netmask, vlan_id, client_id)
            VALUES %s
            ON CONFLICT (ip_address, client_id) DO NOTHING
            """,
            ip_data,
            page_size=1000
        )
        print(f"   ✅ {len(ip_data)} IPs inseridos")
    
    # Read and insert connections
    print("\n🔗 Lendo conexões...")
    with open('assets/conexoes_origem_destino.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        connections = list(reader)
    
    connection_data = []
    for conn in connections:
        source = conn.get('source_id', '').strip()
        target = conn.get('target_id', '').strip()
        if source and target and source != 'N/A' and target != 'N/A':
            connection_data.append((
                source,
                target,
                'physical',
                'active',
                client_id
            ))
    
    print(f"   ✅ {len(connection_data)} conexões preparadas")
    
    if connection_data:
        print("\n🔗 Inserindo Conexões...")
        execute_values(
            cur,
            """
            INSERT INTO topology.network_connections 
            (source_asset_id, target_asset_id, connection_type, status, client_id)
            VALUES %s
            ON CONFLICT (source_asset_id, target_asset_id, client_id) DO NOTHING
            """,
            connection_data,
            page_size=1000
        )
        print(f"   ✅ {len(connection_data)} Conexões inseridas")
    
    # Commit
    conn.commit()
    
    # Get statistics
    print("\n📊 Estatísticas do banco:")
    
    cur.execute("SELECT COUNT(*) FROM security.assets WHERE client_id = %s", (client_id,))
    assets_count = cur.fetchone()[0]
    print(f"   • Assets: {assets_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.ip_addresses WHERE client_id = %s", (client_id,))
    ips_count = cur.fetchone()[0]
    print(f"   • IPs: {ips_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.vlans WHERE client_id = %s", (client_id,))
    vlans_count = cur.fetchone()[0]
    print(f"   • VLANs: {vlans_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.ip_subnets WHERE client_id = %s", (client_id,))
    subnets_count = cur.fetchone()[0]
    print(f"   • Subnets: {subnets_count:,}")
    
    cur.execute("SELECT COUNT(*) FROM topology.network_connections WHERE client_id = %s", (client_id,))
    connections_count = cur.fetchone()[0]
    print(f"   • Conexões: {connections_count:,}")
    
    # Close
    cur.close()
    conn.close()
    
    print("\n" + "=" * 80)
    print("✅ Importação completa!")
    print("=" * 80)
    print(f"""
🌐 Dados TBE importados com sucesso!

Cliente: TBE ({client_id})
Assets: {assets_count:,}
IPs: {ips_count:,}
VLANs: {vlans_count:,}
Subnets: {subnets_count:,}
Conexões: {connections_count:,}

🔍 Consultar dados:
   psql postgresql://ness_admin:ness_secure_pass_2025@localhost:5434/ness_ot_grc
   
   SELECT * FROM security.assets LIMIT 10;
   SELECT * FROM topology.vlans ORDER BY vlan_id;
   SELECT * FROM topology.ip_subnets ORDER BY subnet_cidr;
""")

if __name__ == '__main__':
    try:
        import_assets()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()

