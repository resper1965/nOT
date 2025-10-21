#!/usr/bin/env python3
"""
Script para importar conexões do CSV conexoes_origem_destino.csv
para a tabela topology.network_connections

Resolve GAP-DATA-002: 0 conexões mapeadas de 1.345
CVSS: 8.2 (HIGH) - Impossível detectar lateral movement

Autor: BMAD™ Core - Team All
Data: 21/10/2025
"""

import csv
import psycopg2
from psycopg2.extras import execute_batch
import os
from datetime import datetime

# Configuração do banco
DB_CONFIG = {
    'host': 'postgres',  # Nome do serviço no Docker
    'port': 5432,        # Porta interna do container
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

CSV_FILE = '/app/assets/conexoes_origem_destino.csv'

def connect_db():
    """Conecta ao banco de dados"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print(f"✅ Conectado ao banco {DB_CONFIG['database']}")
        return conn
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        raise

def read_connections_csv():
    """Lê o CSV de conexões e retorna lista de dicionários"""
    connections = []
    
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Ignora linhas vazias
            if not row.get('from_shape_id') or not row.get('to_shape_id'):
                continue
                
            connections.append({
                'page': row.get('page', ''),
                'from_shape_id': row.get('from_shape_id', ''),
                'from_master': row.get('from_master', ''),
                'from_hostnames': row.get('from_hostnames', ''),
                'from_ipv4': row.get('from_ipv4', ''),
                'from_text': row.get('from_text', ''),
                'to_shape_id': row.get('to_shape_id', ''),
                'to_master': row.get('to_master', ''),
                'to_hostnames': row.get('to_hostnames', ''),
                'to_ipv4': row.get('to_ipv4', ''),
                'to_text': row.get('to_text', ''),
            })
    
    print(f"✅ Lidas {len(connections)} conexões do CSV")
    return connections

def find_or_create_asset(cursor, identifier, asset_type='Unknown'):
    """
    Encontra asset por IP, hostname ou cria um novo
    Retorna UUID do asset
    """
    # Tenta encontrar por IP
    if identifier:
        # Por IP
        cursor.execute("""
            SELECT id FROM security.assets 
            WHERE ip_address = %s::inet
            LIMIT 1
        """, (identifier,))
        result = cursor.fetchone()
        if result:
            return result[0]
        
        # Por nome (se for hostname)
        cursor.execute("""
            SELECT id FROM security.assets 
            WHERE asset_name ILIKE %s
            LIMIT 1
        """, (f'%{identifier}%',))
        result = cursor.fetchone()
        if result:
            return result[0]
    
    # Se não encontrou, cria novo asset
    cursor.execute("""
        INSERT INTO security.assets 
        (asset_name, asset_type, criticality, status, metadata)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (
        identifier or 'Unknown-' + datetime.now().strftime('%Y%m%d%H%M%S'),
        asset_type,
        'low',
        'active',
        {'imported_from': 'conexoes_origem_destino.csv', 'auto_created': True}
    ))
    
    return cursor.fetchone()[0]

def import_connections(conn, connections):
    """Importa conexões para topology.network_connections"""
    cursor = conn.cursor()
    imported = 0
    skipped = 0
    
    print(f"\n🔄 Iniciando importação de {len(connections)} conexões...")
    
    for i, conn_data in enumerate(connections, 1):
        try:
            # Identifica source e destination
            source_id = conn_data['from_ipv4'] or conn_data['from_hostnames'] or conn_data['from_text']
            dest_id = conn_data['to_ipv4'] or conn_data['to_hostnames'] or conn_data['to_text']
            
            if not source_id or not dest_id:
                skipped += 1
                continue
            
            # Encontra ou cria assets
            source_asset_id = find_or_create_asset(cursor, source_id, conn_data.get('from_master', 'Unknown'))
            dest_asset_id = find_or_create_asset(cursor, dest_id, conn_data.get('to_master', 'Unknown'))
            
            # Insere conexão
            cursor.execute("""
                INSERT INTO topology.network_connections 
                (source_asset_id, destination_asset_id, protocol, port, bandwidth_mbps, status, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                source_asset_id,
                dest_asset_id,
                'Unknown',  # Protocolo não especificado no CSV
                None,       # Porta não especificada
                None,       # Bandwidth não especificado
                'active',
                {
                    'page': conn_data['page'],
                    'from_shape_id': conn_data['from_shape_id'],
                    'to_shape_id': conn_data['to_shape_id'],
                    'imported_from': 'conexoes_origem_destino.csv'
                }
            ))
            
            imported += 1
            
            if i % 100 == 0:
                conn.commit()
                print(f"   Processadas {i}/{len(connections)} conexões... ({imported} importadas, {skipped} ignoradas)")
        
        except Exception as e:
            print(f"⚠️  Erro na linha {i}: {e}")
            skipped += 1
            continue
    
    conn.commit()
    cursor.close()
    
    print(f"\n✅ Importação concluída!")
    print(f"   • Importadas: {imported}")
    print(f"   • Ignoradas: {skipped}")
    print(f"   • Total: {len(connections)}")
    
    return imported, skipped

def verify_import(conn):
    """Verifica quantas conexões foram importadas"""
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM topology.network_connections")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT source_asset_id) FROM topology.network_connections")
    unique_sources = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT destination_asset_id) FROM topology.network_connections")
    unique_dests = cursor.fetchone()[0]
    
    print(f"\n📊 VERIFICAÇÃO:")
    print(f"   • Total de conexões: {total}")
    print(f"   • Assets origem únicos: {unique_sources}")
    print(f"   • Assets destino únicos: {unique_dests}")
    
    cursor.close()

def main():
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║        IMPORTAÇÃO DE CONEXÕES - Gap GAP-DATA-002                             ║
║        Resolve: 0 → 1.345 conexões mapeadas                                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Conecta ao banco
    conn = connect_db()
    
    # Lê CSV
    connections = read_connections_csv()
    
    # Importa
    imported, skipped = import_connections(conn, connections)
    
    # Verifica
    verify_import(conn)
    
    # Fecha conexão
    conn.close()
    
    print(f"\n✅ Script concluído com sucesso!")
    print(f"   GAP-DATA-002: CVSS 8.2 → {((imported/1345)*100):.1f}% RESOLVIDO")

if __name__ == '__main__':
    main()

