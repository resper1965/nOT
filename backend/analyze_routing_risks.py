#!/usr/bin/env python3
"""
Análise de Riscos de Roteamento OT - TBE
Identifica vulnerabilidades de acessibilidade e bypass de segurança
Baseado em Modelo Purdue e segmentação de zonas
"""

import pandas as pd
import networkx as nx
from ipaddress import ip_network, ip_address
from typing import List, Dict, Tuple, Optional
import psycopg2
from psycopg2.extras import execute_values

# Mapa de Segmentação (Zonas de Risco Purdue)
SEGMENTATION_MAP = {
    # Nível 3-4: Operações e Controle (CRÍTICO)
    '192.168.10.0/24': 'SCADA_CRITICAL',
    '192.168.11.0/24': 'SCADA_CRITICAL',
    '192.168.20.0/24': 'HMI_CRITICAL',
    '192.168.30.0/24': 'PLC_CRITICAL',
    '10.10.0.0/16': 'SCADA_NETWORK',
    
    # Nível 2: Supervisão (ALTO RISCO)
    '172.16.5.0/24': 'DATA_HISTORIAN',
    '172.16.10.0/24': 'ENGINEERING_WORKSTATION',
    '10.20.0.0/16': 'SUPERVISORY',
    
    # DMZ e Transição (RISCO MÉDIO)
    '172.16.6.0/24': 'JUMP_SERVER_DMZ',
    '192.168.100.0/24': 'DMZ',
    '10.30.0.0/16': 'DMZ_ZONE',
    
    # Nível 5: Enterprise/IT (BAIXO RISCO)
    '10.1.0.0/16': 'IT_CORP',
    '10.2.0.0/16': 'IT_CORP',
    '172.20.0.0/16': 'IT_MANAGEMENT',
    
    # Internet e Externo (ALTÍSSIMO RISCO)
    '0.0.0.0/0': 'INTERNET'
}

# Políticas de Segurança (matriz de acesso proibido)
FORBIDDEN_PATHS = [
    ('IT_CORP', 'SCADA_CRITICAL'),
    ('IT_CORP', 'PLC_CRITICAL'),
    ('IT_CORP', 'HMI_CRITICAL'),
    ('INTERNET', 'SCADA_CRITICAL'),
    ('INTERNET', 'PLC_CRITICAL'),
    ('INTERNET', 'HMI_CRITICAL'),
    ('INTERNET', 'DATA_HISTORIAN'),
    ('IT_CORP', 'SCADA_NETWORK'),
]

# Dispositivos de Segurança (devem estar no caminho)
SECURITY_DEVICES = ['FW', 'FIREWALL', 'IPS', 'IDS']

def classify_prefix_to_zone(prefix: str) -> str:
    """
    Classifica um prefixo IP para uma zona de segurança.
    Usa Longest Prefix Match (LPM).
    """
    try:
        target_net = ip_network(prefix, strict=False)
    except:
        return 'UNKNOWN'
    
    # LPM: procurar a rede mais específica que contém o prefixo
    best_match = None
    best_prefix_len = -1
    
    for seg_prefix, zone in SEGMENTATION_MAP.items():
        try:
            seg_net = ip_network(seg_prefix, strict=False)
            if target_net.subnet_of(seg_net) or target_net == seg_net:
                if seg_net.prefixlen > best_prefix_len:
                    best_match = zone
                    best_prefix_len = seg_net.prefixlen
        except:
            continue
    
    return best_match if best_match else 'UNKNOWN'

def build_routing_graph(routing_df: pd.DataFrame) -> nx.DiGraph:
    """
    Constrói um grafo direcionado de roteadores e rotas.
    
    Nós: Roteadores (Device) e Next_Hops
    Arestas: Rotas (com peso = metric)
    """
    G = nx.DiGraph()
    
    for _, row in routing_df.iterrows():
        device = row['Device']
        next_hop = row['Next_Hop']
        prefix = row['Prefix']
        interface = row['Interface']
        metric = row['Metric']
        
        # Adicionar nós
        if device not in G:
            G.add_node(device, type='router')
        
        if next_hop != 'Connected' and next_hop not in G:
            G.add_node(next_hop, type='next_hop')
        
        # Adicionar aresta com atributos
        if next_hop != 'Connected':
            G.add_edge(
                device, 
                next_hop,
                prefix=prefix,
                interface=interface,
                metric=metric,
                zone=classify_prefix_to_zone(prefix)
            )
    
    return G

def find_router_for_zone(G: nx.DiGraph, routing_df: pd.DataFrame, zone: str) -> List[str]:
    """
    Encontra roteadores que têm rotas para uma zona específica.
    """
    routers = []
    for _, row in routing_df.iterrows():
        route_zone = classify_prefix_to_zone(row['Prefix'])
        if route_zone == zone and row['Device'] not in routers:
            routers.append(row['Device'])
    
    return routers

def analyze_path_security(path: List[str], G: nx.DiGraph) -> Dict:
    """
    Analisa um caminho para identificar riscos de segurança.
    """
    risks = []
    
    # Verificar se há dispositivo de segurança no caminho
    has_security_device = any(
        any(sec_dev in hop.upper() for sec_dev in SECURITY_DEVICES)
        for hop in path
    )
    
    if not has_security_device:
        risks.append({
            'type': 'BYPASS_SECURITY_DEVICE',
            'severity': 'HIGH',
            'message': 'Caminho não passa por firewall ou IPS'
        })
    
    # Verificar saltos
    if len(path) > 5:
        risks.append({
            'type': 'TOO_MANY_HOPS',
            'severity': 'MEDIUM',
            'message': f'Caminho muito longo: {len(path)} saltos'
        })
    
    return {
        'has_security_device': has_security_device,
        'hop_count': len(path),
        'risks': risks
    }

def analyze_routing_risks(routing_df: pd.DataFrame, segmentation_map: Dict) -> List[Dict]:
    """
    Função principal de análise de riscos de roteamento.
    
    Args:
        routing_df: DataFrame com colunas [Device, Prefix, Next_Hop, Interface, Metric]
        segmentation_map: Dicionário de prefixos para zonas de segurança
        
    Returns:
        Lista de vulnerabilidades encontradas
    """
    vulnerabilities = []
    
    # Passo A: Construir grafo de roteamento
    print("\n📊 Construindo grafo de roteamento...")
    G = build_routing_graph(routing_df)
    print(f"  • Nós (roteadores): {G.number_of_nodes()}")
    print(f"  • Arestas (rotas): {G.number_of_edges()}")
    
    # Passo B: Identificar pares de risco crítico
    print("\n🎯 Analisando pares de risco...")
    
    for origin_zone, target_zone in FORBIDDEN_PATHS:
        origin_routers = find_router_for_zone(G, routing_df, origin_zone)
        target_routers = find_router_for_zone(G, routing_df, target_zone)
        
        if not origin_routers or not target_routers:
            continue
        
        # Passo C: Calcular caminhos e analisar riscos
        for origin_router in origin_routers[:3]:  # Limitar a 3 por zona
            for target_router in target_routers[:3]:
                if origin_router == target_router:
                    continue
                
                try:
                    # Verificar se há caminho
                    if nx.has_path(G, origin_router, target_router):
                        # Encontrar caminho mais curto
                        path = nx.shortest_path(G, origin_router, target_router, weight='metric')
                        
                        # Analisar segurança do caminho
                        path_analysis = analyze_path_security(path, G)
                        
                        # VIOLAÇÃO 1: Acessibilidade Não Autorizada
                        vulnerabilities.append({
                            'Risk_Level': 'HIGH',
                            'Origin_Zone': origin_zone,
                            'Target_Zone': target_zone,
                            'Vulnerability_Type': 'Acessibilidade Não Permitida',
                            'Path_Hops': ' → '.join(path),
                            'Hop_Count': len(path),
                            'Has_Security_Device': path_analysis['has_security_device'],
                            'Recommendation': f'Bloquear roteamento de {origin_zone} para {target_zone} ou adicionar firewall'
                        })
                        
                        print(f"  ⚠️  RISCO ALTO: {origin_zone} → {target_zone}")
                        print(f"      Caminho: {' → '.join(path)}")
                        
                except nx.NetworkXNoPath:
                    # Bom! Não há caminho (isolado)
                    pass
                except Exception as e:
                    print(f"    Erro ao analisar {origin_router} → {target_router}: {e}")
    
    return vulnerabilities

def save_to_database(vulnerabilities: List[Dict]):
    """Salva vulnerabilidades no PostgreSQL"""
    if not vulnerabilities:
        print("✅ Nenhuma vulnerabilidade encontrada (rede segmentada corretamente)!")
        return
    
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="ness_ot_grc",
            user="ness_user",
            password="ness_password"
        )
        cur = conn.cursor()
        
        # Criar tabela se não existir
        cur.execute("""
            CREATE TABLE IF NOT EXISTS topology.routing_vulnerabilities (
                id SERIAL PRIMARY KEY,
                risk_level VARCHAR(20),
                origin_zone VARCHAR(100),
                target_zone VARCHAR(100),
                vulnerability_type VARCHAR(200),
                path_hops TEXT,
                hop_count INTEGER,
                has_security_device BOOLEAN,
                recommendation TEXT,
                discovered_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        # Limpar dados antigos
        cur.execute("DELETE FROM topology.routing_vulnerabilities")
        
        # Inserir vulnerabilidades
        insert_query = """
            INSERT INTO topology.routing_vulnerabilities 
            (risk_level, origin_zone, target_zone, vulnerability_type, path_hops, hop_count, has_security_device, recommendation)
            VALUES %s
        """
        
        values = [
            (
                v['Risk_Level'],
                v['Origin_Zone'],
                v['Target_Zone'],
                v['Vulnerability_Type'],
                v['Path_Hops'],
                v['Hop_Count'],
                v['Has_Security_Device'],
                v['Recommendation']
            )
            for v in vulnerabilities
        ]
        
        execute_values(cur, insert_query, values)
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"\n✅ {len(vulnerabilities)} vulnerabilidades salvas no banco de dados!")
        
    except Exception as e:
        print(f"❌ Erro ao salvar no banco: {e}")

def main():
    """Executa análise completa de roteamento"""
    print("🔍 Análise de Riscos de Roteamento OT - TBE")
    print("=" * 80)
    
    # Carregar dados parseados
    routing_file = "/app/assets/routing_table_parsed.csv"
    
    try:
        routing_df = pd.read_csv(routing_file)
        print(f"\n📊 Dados carregados: {len(routing_df)} rotas de {routing_df['Device'].nunique()} dispositivos")
    except FileNotFoundError:
        print(f"❌ Arquivo não encontrado: {routing_file}")
        print("💡 Execute primeiro: python parse_routing_tables.py")
        return
    
    # Executar análise
    vulnerabilities = analyze_routing_risks(routing_df, SEGMENTATION_MAP)
    
    # Exibir resultados
    print(f"\n{'=' * 80}")
    print(f"📋 RELATÓRIO DE VULNERABILIDADES")
    print(f"{'=' * 80}")
    print(f"\n🔴 Total de vulnerabilidades: {len(vulnerabilities)}")
    
    if vulnerabilities:
        vuln_df = pd.DataFrame(vulnerabilities)
        
        print("\n📊 Distribuição por nível de risco:")
        print(vuln_df.groupby('Risk_Level').size())
        
        print("\n🎯 Top 10 vulnerabilidades críticas:")
        for i, vuln in enumerate(vulnerabilities[:10], 1):
            print(f"\n{i}. {vuln['Vulnerability_Type']}")
            print(f"   {vuln['Origin_Zone']} → {vuln['Target_Zone']}")
            print(f"   Caminho: {vuln['Path_Hops']}")
            print(f"   Recomendação: {vuln['Recommendation']}")
        
        # Salvar no banco
        save_to_database(vulnerabilities)
        
        # Salvar CSV
        output_csv = "/app/assets/routing_vulnerabilities.csv"
        vuln_df.to_csv(output_csv, index=False)
        print(f"\n📁 Relatório salvo: {output_csv}")
    else:
        print("\n✅ Nenhuma vulnerabilidade encontrada!")
        print("   A rede está corretamente segmentada segundo o Modelo Purdue.")

if __name__ == "__main__":
    # Adicionar networkx ao requirements se necessário
    try:
        import networkx
    except ImportError:
        print("⚠️  NetworkX não instalado. Instale com: pip install networkx")
        exit(1)
    
    main()

