#!/usr/bin/env python3
"""
Análise de Topologia de Rede TBE
Extrai e analisa dados de segurança do arquivo JSON de topologia
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

def load_topology(file_path):
    """Carrega arquivo JSON de topologia"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao carregar arquivo: {e}")
        return None

def analyze_masters(topology):
    """Analisa tipos de dispositivos (masters)"""
    masters = topology.get('masters', {})
    device_types = defaultdict(int)
    
    for master_id, master_info in masters.items():
        device_name = master_info.get('Name', 'Unknown')
        device_types[device_name] += 1
    
    return dict(device_types)

def analyze_pages(topology):
    """Analisa páginas e dispositivos"""
    pages = topology.get('pages', [])
    
    total_pages = len(pages)
    total_shapes = 0
    device_instances = []
    
    for page in pages:
        shapes = page.get('shapes', [])
        total_shapes += len(shapes)
        
        for shape in shapes:
            shape_data = shape.get('shape', {})
            device_instances.append({
                'type': shape_data.get('type', 'Unknown'),
                'text': shape_data.get('text', 'N/A'),
                'master': shape_data.get('master', 'N/A'),
                'page': page.get('page_name', 'Unknown')
            })
    
    return {
        'total_pages': total_pages,
        'total_shapes': total_shapes,
        'devices': device_instances
    }

def identify_security_devices(device_types):
    """Identifica dispositivos de segurança"""
    security_keywords = ['firewall', 'vpn', 'security', 'ids', 'ips']
    security_devices = {}
    
    for device, count in device_types.items():
        device_lower = device.lower()
        if any(keyword in device_lower for keyword in security_keywords):
            security_devices[device] = count
    
    return security_devices

def identify_network_devices(device_types):
    """Identifica dispositivos de rede"""
    network_keywords = ['router', 'switch', 'hub', 'bridge', 'modem']
    network_devices = {}
    
    for device, count in device_types.items():
        device_lower = device.lower()
        if any(keyword in device_lower for keyword in network_keywords):
            network_devices[device] = count
    
    return network_devices

def identify_servers(device_types):
    """Identifica servidores"""
    server_keywords = ['server', 'mainframe', 'terminal server']
    servers = {}
    
    for device, count in device_types.items():
        device_lower = device.lower()
        if any(keyword in device_lower for keyword in server_keywords):
            servers[device] = count
    
    return servers

def identify_endpoints(device_types):
    """Identifica endpoints"""
    endpoint_keywords = ['pc', 'laptop', 'workstation', 'phone', 'voip']
    endpoints = {}
    
    for device, count in device_types.items():
        device_lower = device.lower()
        if any(keyword in device_lower for keyword in endpoint_keywords):
            endpoints[device] = count
    
    return endpoints

def generate_report(topology_data):
    """Gera relatório de análise"""
    device_types = analyze_masters(topology_data)
    page_analysis = analyze_pages(topology_data)
    
    security_devices = identify_security_devices(device_types)
    network_devices = identify_network_devices(device_types)
    servers = identify_servers(device_types)
    endpoints = identify_endpoints(device_types)
    
    report = f"""
# Análise Preliminar de Topologia TBE

## Resumo Executivo

### Estatísticas Gerais
- **Total de tipos de dispositivos**: {len(device_types)}
- **Total de páginas no diagrama**: {page_analysis['total_pages']}
- **Total de objetos mapeados**: {page_analysis['total_shapes']}

### Dispositivos de Segurança Identificados
{format_device_list(security_devices) if security_devices else "Nenhum dispositivo de segurança explicitamente identificado"}

### Dispositivos de Rede
{format_device_list(network_devices)}

### Servidores
{format_device_list(servers)}

### Endpoints
{format_device_list(endpoints)}

## Análise de Segurança Preliminar

### 🔴 Preocupações Críticas Identificadas

1. **Dispositivos de Segurança**
   - Firewalls detectados: {security_devices.get('Firewall', 0)}
   - Necessário validar configuração e posicionamento

2. **Segmentação de Rede**
   - Análise detalhada necessária para identificar zonas de segurança
   - Verificar isolamento entre redes OT e IT

3. **Superfície de Ataque**
   - Endpoints identificados: {sum(endpoints.values()) if endpoints else 0}
   - Servidores expostos: {sum(servers.values()) if servers else 0}

### 🟡 Áreas Requerendo Análise Aprofundada

1. **Conectividade Externa**
   - Identificar pontos de conexão com Internet
   - Mapear acessos VPN e remotos

2. **Protocolos e Serviços**
   - Análise de protocolos em uso necessária
   - Identificação de protocolos inseguros (Telnet, HTTP, FTP)

3. **Controles de Acesso**
   - Validar autenticação e autorização
   - Verificar implementação de MFA

### 📋 Inventário Completo de Tipos de Dispositivos

{format_full_inventory(device_types)}

## Próximos Passos

1. **Análise Detalhada da Topologia**
   - Mapear conexões entre dispositivos
   - Identificar zonas de confiança
   - Documentar fluxos de dados críticos

2. **Inventário de Ativos**
   - Catalogar cada instância de dispositivo
   - Classificar por criticidade
   - Identificar dados sensíveis

3. **Modelagem de Ameaças**
   - Identificar atores de ameaça relevantes
   - Mapear superfície de ataque
   - Documentar cenários de risco

4. **Varredura de Vulnerabilidades**
   - Executar scans de segurança
   - Identificar configurações inseguras
   - Verificar patches e atualizações

5. **Análise de Vazamento de Dados**
   - Mapear caminhos de exfiltração
   - Verificar criptografia de dados
   - Avaliar controles DLP

---

**Data da Análise**: {Path(__file__).stat().st_mtime}
**Arquivo Analisado**: assets/Topologia_TBE_full.json
**Status**: Análise Preliminar Completa
"""
    
    return report

def format_device_list(devices):
    """Formata lista de dispositivos"""
    if not devices:
        return "Nenhum dispositivo identificado"
    
    result = ""
    for device, count in sorted(devices.items(), key=lambda x: x[1], reverse=True):
        result += f"- **{device}**: {count} instância(s)\n"
    return result.strip()

def format_full_inventory(device_types):
    """Formata inventário completo"""
    result = "| Tipo de Dispositivo | Quantidade |\n"
    result += "|---------------------|------------|\n"
    
    for device, count in sorted(device_types.items(), key=lambda x: x[1], reverse=True):
        result += f"| {device} | {count} |\n"
    
    return result

def main():
    topology_file = 'assets/Topologia_TBE_full.json'
    
    print("Carregando topologia TBE...")
    topology = load_topology(topology_file)
    
    if not topology:
        print("Erro ao carregar topologia. Abortando.")
        sys.exit(1)
    
    print("Analisando dados...")
    report = generate_report(topology)
    
    output_file = 'docs/security/topology-analysis-preliminary.md'
    print(f"Salvando relatório em {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("✅ Análise concluída!")
    print(f"📄 Relatório salvo: {output_file}")
    
    # Também exibe no terminal
    print("\n" + "="*80)
    print(report)

if __name__ == '__main__':
    main()
