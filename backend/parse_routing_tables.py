#!/usr/bin/env python3
"""
Parser de Tabelas de Roteamento - TBE OT Network
Extrai rotas estáticas de configurações Cisco e Huawei
"""

import os
import re
import pandas as pd
from pathlib import Path

def parse_cisco_routes(content, device_name):
    """Parse rotas Cisco IOS (ip route)"""
    routes = []
    # Padrão: ip route 192.168.1.0 255.255.255.0 10.0.0.1
    pattern = r'ip route\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)'
    
    for match in re.finditer(pattern, content):
        network = match.group(1)
        netmask = match.group(2)
        next_hop = match.group(3)
        
        # Converter netmask para CIDR
        cidr = sum([bin(int(x)).count('1') for x in netmask.split('.')])
        prefix = f"{network}/{cidr}"
        
        routes.append({
            'Device': device_name,
            'Prefix': prefix,
            'Next_Hop': next_hop,
            'Interface': 'N/A',
            'Metric': 1,
            'Type': 'Static'
        })
    
    return routes

def parse_huawei_routes(content, device_name):
    """Parse rotas Huawei VRP (ip route-static)"""
    routes = []
    # Padrão: ip route-static 192.168.1.0 255.255.255.0 10.0.0.1
    pattern = r'ip route-static\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)'
    
    for match in re.finditer(pattern, content):
        network = match.group(1)
        netmask = match.group(2)
        next_hop = match.group(3)
        
        cidr = sum([bin(int(x)).count('1') for x in netmask.split('.')])
        prefix = f"{network}/{cidr}"
        
        routes.append({
            'Device': device_name,
            'Prefix': prefix,
            'Next_Hop': next_hop,
            'Interface': 'N/A',
            'Metric': 60,
            'Type': 'Static'
        })
    
    return routes

def parse_connected_routes(content, device_name):
    """Parse rotas conectadas diretas (interfaces)"""
    routes = []
    # Cisco: interface X + ip address
    interface_pattern = r'interface\s+([\w/.-]+)'
    ip_pattern = r'ip address\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)'
    
    current_interface = None
    for line in content.split('\n'):
        if_match = re.search(interface_pattern, line)
        if if_match:
            current_interface = if_match.group(1)
        
        if current_interface:
            ip_match = re.search(ip_pattern, line)
            if ip_match:
                ip = ip_match.group(1)
                netmask = ip_match.group(2)
                cidr = sum([bin(int(x)).count('1') for x in netmask.split('.')])
                
                # Calcular endereço de rede
                ip_parts = [int(x) for x in ip.split('.')]
                mask_parts = [int(x) for x in netmask.split('.')]
                network_parts = [ip_parts[i] & mask_parts[i] for i in range(4)]
                network = '.'.join(map(str, network_parts))
                prefix = f"{network}/{cidr}"
                
                routes.append({
                    'Device': device_name,
                    'Prefix': prefix,
                    'Next_Hop': 'Connected',
                    'Interface': current_interface,
                    'Metric': 0,
                    'Type': 'Connected'
                })
    
    return routes

def main():
    """Parse todas as configurações de roteadores"""
    rotas_dir = Path("/app/assets/rotas")
    all_routes = []
    
    print("🔍 Parseando tabelas de roteamento...")
    
    for config_file in rotas_dir.glob("*.txt"):
        if config_file.name.endswith('Zone.Identifier'):
            continue
            
        device_name = config_file.stem
        print(f"  Processando: {device_name}")
        
        try:
            with open(config_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Parse diferentes tipos de rotas
            cisco_routes = parse_cisco_routes(content, device_name)
            huawei_routes = parse_huawei_routes(content, device_name)
            connected_routes = parse_connected_routes(content, device_name)
            
            all_routes.extend(cisco_routes)
            all_routes.extend(huawei_routes)
            all_routes.extend(connected_routes)
            
        except Exception as e:
            print(f"    ⚠️  Erro ao processar {device_name}: {e}")
    
    # Criar DataFrame
    if all_routes:
        df = pd.DataFrame(all_routes)
        
        # Salvar CSV
        output_file = "/app/assets/routing_table_parsed.csv"
        df.to_csv(output_file, index=False)
        
        print(f"\n✅ Rotas parseadas: {len(df)}")
        print(f"📊 Dispositivos: {df['Device'].nunique()}")
        print(f"📁 Arquivo salvo: {output_file}")
        
        # Estatísticas
        print("\n📈 Estatísticas:")
        print(df.groupby('Type')['Device'].count())
        
        return df
    else:
        print("❌ Nenhuma rota encontrada!")
        return None

if __name__ == "__main__":
    main()

