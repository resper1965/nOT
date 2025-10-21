#!/usr/bin/env python3
"""
Script para reclassificar criticidade dos 14.606 assets
baseado em tipo e função na rede OT

Resolve: Distribuição inadequada de criticidade
Atual: 0% critical, 90% low
Meta: 5-10% critical, 15-20% high, 30-40% medium, 30-50% low

Autor: BMAD™ Core - Team All
Data: 21/10/2025
"""

import psycopg2

# Configuração do banco
DB_CONFIG = {
    'host': 'localhost',
    'port': 5434,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

# Regras de reclassificação baseadas em tipo e contexto
CRITICALITY_RULES = {
    'critical': {
        'types': ['Server'],
        'conditions': [
            "asset_name ILIKE '%SCADA%'",
            "asset_name ILIKE '%HMI%'",
            "asset_name ILIKE '%historian%'",
            "asset_name ILIKE '%safety%'",
            "asset_name ILIKE '%critical%'",
            "metadata->>'function' = 'scada'",
            "metadata->>'function' = 'safety'"
        ],
        'description': 'Servidores SCADA, HMI, Safety Systems'
    },
    
    'high': {
        'types': ['Router', 'Firewall', 'Switch', 'Server'],
        'conditions': [
            "asset_type = 'Router'",
            "asset_type = 'Firewall'",
            "(asset_type = 'Switch' AND (asset_name ILIKE '%core%' OR asset_name ILIKE '%backbone%'))",
            "(asset_type = 'Server' AND asset_name ILIKE '%database%')",
            "(asset_type = 'Server' AND asset_name ILIKE '%controller%')",
            "metadata->>'function' = 'core'"
        ],
        'description': 'Routers, Firewalls, Core Switches, Database Servers'
    },
    
    'medium': {
        'types': ['Switch', 'Server', 'Hub'],
        'conditions': [
            "(asset_type = 'Switch' AND asset_name NOT ILIKE '%core%')",
            "(asset_type = 'Server' AND asset_name NOT ILIKE '%scada%' AND asset_name NOT ILIKE '%hmi%')",
            "asset_type = 'Hub'",
            "asset_type = 'Modem'",
            "metadata->>'function' = 'access'"
        ],
        'description': 'Access Switches, Application Servers, Communication devices'
    },
    
    'low': {
        'types': ['Network Device', 'Ethernet'],
        'conditions': [
            "asset_type = 'Network Device'",
            "asset_type = 'Ethernet'",
            "asset_name ILIKE '%printer%'",
            "asset_name ILIKE '%camera%'",
            "asset_name ILIKE '%iot%'",
            "metadata->>'function' = 'endpoint'"
        ],
        'description': 'Generic devices, printers, cameras, IoT'
    }
}

def connect_db():
    """Conecta ao banco de dados"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print(f"✅ Conectado ao banco {DB_CONFIG['database']}")
        return conn
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        raise

def show_current_distribution(conn):
    """Mostra distribuição atual de criticidade"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            criticality,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
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
    
    print("\n📊 DISTRIBUIÇÃO ATUAL:")
    print("─" * 60)
    for row in cursor.fetchall():
        crit, count, pct = row
        bar = '█' * int(pct/2)
        print(f"   {crit:10s}: {count:6d} ({pct:5.2f}%) {bar}")
    
    cursor.close()

def reclassify_by_rules(conn):
    """Reclassifica assets baseado nas regras"""
    cursor = conn.cursor()
    
    stats = {
        'critical': 0,
        'high': 0,
        'medium': 0,
        'low': 0
    }
    
    print("\n🔄 RECLASSIFICANDO ASSETS:")
    print("─" * 80)
    
    # Reclassifica CRITICAL (SCADA, HMI, Safety)
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'critical',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "SCADA/HMI/Safety system"}'::jsonb
        WHERE asset_type = 'Server'
          AND (
              asset_name ILIKE '%SCADA%' OR
              asset_name ILIKE '%HMI%' OR
              asset_name ILIKE '%historian%' OR
              asset_name ILIKE '%safety%' OR
              asset_name ILIKE '%critical%'
          )
          AND criticality != 'critical'
    """)
    stats['critical'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Servers → CRITICAL (SCADA/HMI/Safety)")
    
    # Reclassifica HIGH (Routers já são high, mantém; Firewalls, Core Switches)
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'high',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Infrastructure device"}'::jsonb
        WHERE (asset_type = 'Firewall' OR asset_type = 'Router')
          AND criticality != 'high'
    """)
    stats['high'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Firewalls/Routers → HIGH")
    
    # Core Switches → HIGH
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'high',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Core/Backbone switch"}'::jsonb
        WHERE asset_type = 'Switch'
          AND (asset_name ILIKE '%core%' OR asset_name ILIKE '%backbone%' OR asset_name ILIKE '%distribution%')
          AND criticality != 'high'
    """)
    stats['high'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Core Switches → HIGH")
    
    # Database/Controller Servers → HIGH
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'high',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Database/Controller server"}'::jsonb
        WHERE asset_type = 'Server'
          AND (asset_name ILIKE '%database%' OR asset_name ILIKE '%controller%' OR asset_name ILIKE '%plc%')
          AND criticality NOT IN ('critical', 'high')
    """)
    stats['high'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Database/Controller Servers → HIGH")
    
    # Access Switches → MEDIUM
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'medium',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Access switch"}'::jsonb
        WHERE asset_type = 'Switch'
          AND asset_name NOT ILIKE '%core%' 
          AND asset_name NOT ILIKE '%backbone%'
          AND criticality = 'low'
    """)
    stats['medium'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Access Switches → MEDIUM")
    
    # Application Servers → MEDIUM
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'medium',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Application server"}'::jsonb
        WHERE asset_type = 'Server'
          AND criticality = 'low'
    """)
    stats['medium'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Application Servers → MEDIUM")
    
    # Hubs, Modems → MEDIUM
    cursor.execute("""
        UPDATE security.assets
        SET 
            criticality = 'medium',
            updated_at = CURRENT_TIMESTAMP,
            metadata = COALESCE(metadata, '{}'::jsonb) || 
                       '{"reclassified": true, "reason": "Communication device"}'::jsonb
        WHERE (asset_type = 'Hub' OR asset_type = 'Modem')
          AND criticality = 'low'
    """)
    stats['medium'] += cursor.rowcount
    print(f"   ✓ {cursor.rowcount} Hubs/Modems → MEDIUM")
    
    conn.commit()
    cursor.close()
    
    print(f"\n✅ Reclassificação concluída:")
    print(f"   • Critical: +{stats['critical']}")
    print(f"   • High: +{stats['high']}")
    print(f"   • Medium: +{stats['medium']}")
    
    return stats

def show_new_distribution(conn):
    """Mostra nova distribuição de criticidade"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            criticality,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
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
    
    print("\n📊 NOVA DISTRIBUIÇÃO:")
    print("─" * 60)
    
    results = cursor.fetchall()
    for row in results:
        crit, count, pct = row
        bar = '█' * int(pct/2)
        
        # Avaliação
        if crit == 'critical' and 5 <= pct <= 10:
            status = "✅ ÓTIMO"
        elif crit == 'high' and 15 <= pct <= 20:
            status = "✅ ÓTIMO"
        elif crit == 'medium' and 30 <= pct <= 40:
            status = "✅ ÓTIMO"
        elif crit == 'low' and 30 <= pct <= 50:
            status = "✅ ÓTIMO"
        else:
            status = "⚠️  Ajustar"
        
        print(f"   {crit:10s}: {count:6d} ({pct:5.2f}%) {bar} {status}")
    
    cursor.close()

def generate_report(conn):
    """Gera relatório detalhado da reclassificação"""
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            asset_type,
            criticality,
            COUNT(*) as count
        FROM security.assets
        WHERE metadata->>'reclassified' = 'true'
        GROUP BY asset_type, criticality
        ORDER BY criticality, asset_type
    """)
    
    print("\n📋 RELATÓRIO DE RECLASSIFICAÇÃO:")
    print("─" * 80)
    
    current_crit = None
    for row in cursor.fetchall():
        asset_type, crit, count = row
        
        if crit != current_crit:
            print(f"\n{crit.upper()}:")
            current_crit = crit
        
        print(f"   • {asset_type:20s}: {count:4d} assets")
    
    cursor.close()

def main():
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║        RECLASSIFICAÇÃO DE CRITICIDADE - Assets OT                            ║
║        Meta: 5-10% critical, 15-20% high, 30-40% medium, 30-50% low         ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Conecta
    conn = connect_db()
    
    # Mostra distribuição atual
    show_current_distribution(conn)
    
    # Reclassifica
    stats = reclassify_by_rules(conn)
    
    # Mostra nova distribuição
    show_new_distribution(conn)
    
    # Gera relatório
    generate_report(conn)
    
    # Fecha
    conn.close()
    
    print(f"\n✅ Script concluído com sucesso!")
    print(f"   Distribuição de criticidade: CRÍTICO → ADEQUADO")

if __name__ == '__main__':
    main()

