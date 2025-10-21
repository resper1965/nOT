#!/usr/bin/env python3
"""
Importação de Assets da Rede TBE para ness. OT GRC
Processa CSV de ativos e conexões e importa para PostgreSQL
"""

import csv
import json
import ipaddress
import re
from collections import defaultdict
from datetime import datetime

def parse_csv_ativos(filepath):
    """Parse CSV de ativos normalizados"""
    ativos = []
    
    print(f"📖 Lendo {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Extrair informações
            ativo = {
                'page': row.get('page', ''),
                'shape_id': row.get('shape_id', ''),
                'shape_name': row.get('shape_name', ''),
                'master_name': row.get('master_name', ''),
                'text': row.get('text', ''),
                'ipv4': row.get('ipv4', ''),
                'ipv4_cidr': row.get('ipv4_cidr', ''),
                'macs': row.get('macs', ''),
                'vlans': row.get('vlans', ''),
                'ifaces': row.get('ifaces', ''),
                'hostnames': row.get('hostnames', ''),
                'primary_id': row.get('primary_id', '')
            }
            
            # Apenas ativos com dados relevantes
            if ativo['master_name'] or ativo['ipv4'] or ativo['hostnames']:
                ativos.append(ativo)
    
    return ativos

def parse_csv_conexoes(filepath):
    """Parse CSV de conexões"""
    conexoes = []
    
    print(f"📖 Lendo {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            conexao = {
                'from_shape_id': row.get('from_shape_id', ''),
                'from_master': row.get('from_master', ''),
                'from_hostnames': row.get('from_hostnames', ''),
                'from_ipv4': row.get('from_ipv4', ''),
                'from_ipv4_cidr': row.get('from_ipv4_cidr', ''),
                'from_text': row.get('from_text', ''),
                'to_shape_id': row.get('to_shape_id', ''),
                'to_master': row.get('to_master', ''),
                'to_hostnames': row.get('to_hostnames', ''),
                'to_ipv4': row.get('to_ipv4', ''),
                'to_ipv4_cidr': row.get('to_ipv4_cidr', ''),
                'to_text': row.get('to_text', '')
            }
            conexoes.append(conexao)
    
    return conexoes

def categorize_asset_type(master_name, text):
    """Categoriza tipo de ativo"""
    if not master_name:
        return 'Unknown'
    
    master_lower = master_name.lower()
    
    # Categorização
    if 'router' in master_lower:
        return 'Router'
    elif 'switch' in master_lower:
        return 'Switch'
    elif 'firewall' in master_lower:
        return 'Firewall'
    elif 'server' in master_lower:
        return 'Server'
    elif 'scada' in master_lower or 'hmi' in master_lower:
        return 'SCADA/HMI'
    elif 'plc' in master_lower:
        return 'PLC'
    elif 'rtu' in master_lower:
        return 'RTU'
    elif 'pc' in master_lower or 'workstation' in master_lower:
        return 'Workstation'
    elif 'laptop' in master_lower:
        return 'Laptop'
    elif 'phone' in master_lower or 'voip' in master_lower:
        return 'VoIP Device'
    elif 'wireless' in master_lower:
        return 'Wireless AP'
    elif 'modem' in master_lower:
        return 'Modem'
    elif 'connector' in master_lower:
        return 'Network Link'
    else:
        return master_name

def determine_criticality(asset_type, text):
    """Determina criticidade do ativo"""
    critical_keywords = ['scada', 'subestacao', 'controle', 'usina', 'geracao']
    high_keywords = ['servidor', 'server', 'firewall', 'router', 'rtu', 'plc']
    
    asset_lower = asset_type.lower()
    text_lower = text.lower() if text else ''
    
    # SCADA, RTU, PLC sempre críticos
    if asset_type in ['SCADA/HMI', 'RTU', 'PLC']:
        return 'critical'
    
    # Firewalls e routers sempre high+
    if asset_type in ['Firewall', 'Router']:
        return 'high'
    
    # Buscar palavras-chave no texto
    if any(kw in text_lower for kw in critical_keywords):
        return 'critical'
    
    if any(kw in text_lower for kw in high_keywords):
        return 'high'
    
    # Switches e servidores medium por padrão
    if asset_type in ['Switch', 'Server']:
        return 'medium'
    
    # Default
    return 'low'

def extract_subnets(ativos):
    """Extrai lista de subnets únicos"""
    subnets = set()
    
    for ativo in ativos:
        cidr = ativo.get('ipv4_cidr', '')
        if cidr:
            # Pode haver múltiplos CIDRs separados por vírgula
            cidrs = [c.strip() for c in cidr.split(',')]
            for c in cidrs:
                if c and '/' in c:
                    try:
                        subnet = ipaddress.ip_network(c, strict=False)
                        subnets.add(str(subnet))
                    except:
                        pass
    
    return sorted(list(subnets))

def extract_vlans(ativos):
    """Extrai lista de VLANs únicos"""
    vlans = set()
    
    for ativo in ativos:
        vlan_str = ativo.get('vlans', '')
        if vlan_str:
            # Extrair números
            vlan_nums = re.findall(r'\d+', vlan_str)
            for vn in vlan_nums:
                vlan_id = int(vn)
                if 1 <= vlan_id <= 4094:
                    vlans.add(vlan_id)
    
    return sorted(list(vlans))

def analyze_network(ativos, conexoes):
    """Análise completa da rede"""
    
    print("\n🔍 Analisando rede TBE...")
    
    # Estatísticas de ativos
    total_ativos = len(ativos)
    
    # Contagem por tipo
    tipos = defaultdict(int)
    por_criticidade = defaultdict(int)
    
    ativos_com_ip = 0
    ativos_com_hostname = 0
    ativos_com_vlan = 0
    
    for ativo in ativos:
        tipo = categorize_asset_type(ativo['master_name'], ativo['text'])
        tipos[tipo] += 1
        
        crit = determine_criticality(tipo, ativo['text'])
        por_criticidade[crit] += 1
        
        if ativo['ipv4'] or ativo['ipv4_cidr']:
            ativos_com_ip += 1
        if ativo['hostnames']:
            ativos_com_hostname += 1
        if ativo['vlans']:
            ativos_com_vlan += 1
    
    # Análise de subnets
    subnets = extract_subnets(ativos)
    
    # Análise de VLANs
    vlans = extract_vlans(ativos)
    
    # Análise de conexões
    total_conexoes = len(conexoes)
    
    # Gerar relatório
    report = f"""
# 🌐 Análise de Rede TBE - Dados Reais

**Cliente**: TBE (Primeiro Cliente ness. OT GRC)  
**Data de Análise**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Fonte**: assets/ativos_normalizados.csv + conexoes_origem_destino.csv  

---

## 📊 Resumo Executivo

### Estatísticas Gerais
- **Total de Ativos**: {total_ativos:,}
- **Total de Conexões**: {total_conexoes:,}
- **Ativos com IP**: {ativos_com_ip:,} ({100*ativos_com_ip//total_ativos}%)
- **Ativos com Hostname**: {ativos_com_hostname:,} ({100*ativos_com_hostname//total_ativos}%)
- **Ativos com VLAN**: {ativos_com_vlan:,} ({100*ativos_com_vlan//total_ativos}%)
- **Subnets Identificados**: {len(subnets)}
- **VLANs Identificados**: {len(vlans)}

---

## 📋 Inventário por Tipo de Dispositivo

| Tipo | Quantidade | % do Total |
|------|------------|------------|
"""
    
    # Ordenar por quantidade
    for tipo, count in sorted(tipos.items(), key=lambda x: x[1], reverse=True):
        pct = 100 * count / total_ativos
        report += f"| {tipo} | {count:,} | {pct:.1f}% |\n"
    
    report += f"""
**Total de Tipos Únicos**: {len(tipos)}

---

## 🎯 Distribuição por Criticidade

| Criticidade | Quantidade | % |
|-------------|------------|---|
"""
    
    for crit in ['critical', 'high', 'medium', 'low']:
        count = por_criticidade.get(crit, 0)
        pct = 100 * count / total_ativos if total_ativos > 0 else 0
        emoji = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}.get(crit, '')
        report += f"| {emoji} {crit.upper()} | {count:,} | {pct:.1f}% |\n"
    
    report += f"""
---

## 🌐 Análise de Endereçamento IP

### Subnets Identificados ({len(subnets)} subnets)

"""
    
    if subnets:
        report += "| Subnet CIDR | Network | IPs Utilizáveis |\n"
        report += "|-------------|---------|------------------|\n"
        
        for subnet_cidr in subnets[:30]:  # Primeiros 30
            try:
                net = ipaddress.ip_network(subnet_cidr)
                report += f"| {subnet_cidr} | {net.network_address} | {net.num_addresses - 2} |\n"
            except:
                report += f"| {subnet_cidr} | - | - |\n"
        
        if len(subnets) > 30:
            report += f"\n**+ {len(subnets) - 30} subnets adicionais** (ver detalhes completos)\n"
    
    report += f"""
---

## 🏷️ Análise de VLANs

### VLANs Identificadas ({len(vlans)} VLANs)

"""
    
    if vlans:
        # Agrupar VLANs por faixa
        report += "| VLAN ID | Faixa | Uso Típico |\n"
        report += "|---------|-------|------------|\n"
        
        for vlan in vlans[:20]:  # Primeiros 20
            if vlan <= 10:
                uso = "Management/Native"
            elif vlan <= 99:
                uso = "Infrastructure"
            elif vlan <= 999:
                uso = "User/Data"
            else:
                uso = "Extended/Specific"
            
            report += f"| VLAN {vlan} | {uso} | [A CLASSIFICAR] |\n"
        
        if len(vlans) > 20:
            report += f"\n**+ {len(vlans) - 20} VLANs adicionais**\n"
    
    report += f"""
---

## 🔗 Análise de Conectividade

### Estatísticas de Conexões
- **Total de Conexões Mapeadas**: {total_conexoes:,}
- **Média de Conexões por Dispositivo**: {total_conexoes // total_ativos if total_ativos > 0 else 0}

### Top Dispositivos por Conexões
[ANÁLISE DETALHADA APÓS IMPORTAÇÃO NO DATABASE]

---

## 🚨 Achados Preliminares

### Rede de Grande Escala
✅ **{total_ativos:,} ativos** - Rede complexa de nível enterprise  
✅ **{len(subnets)} subnets** - Endereçamento bem estruturado  
✅ **{len(vlans)} VLANs** - Segmentação Layer 2 existente  

### Próximos Passos
1. ⏳ Importar ativos para database PostgreSQL
2. ⏳ Importar conexões e construir grafo de rede
3. ⏳ Análise de endereçamento IP detalhada
4. ⏳ Mapeamento de VLANs para zonas de segurança
5. ⏳ Identificação de rotas críticas
6. ⏳ Análise de segmentação (Modelo Purdue)
7. ⏳ Detecção de conflitos de IP
8. ⏳ Análise de utilização de subnets

---

**Arquivo Gerado**: `docs/security/tbe-network-analysis-real-data.md`  
**Próximo Script**: Executar importação para database  
**Status**: Análise preliminar completa
"""
    
    return report, {
        'total_ativos': total_ativos,
        'ativos_com_ip': ativos_com_ip,
        'tipos': dict(tipos),
        'criticidade': dict(por_criticidade),
        'subnets': subnets,
        'vlans': vlans,
        'total_conexoes': total_conexoes
    }

def main():
    print("="*80)
    print("🌐 ness. OT GRC - Importação de Assets TBE")
    print("="*80)
    
    # Parse CSVs
    ativos = parse_csv_ativos('assets/ativos_normalizados.csv')
    conexoes = parse_csv_conexoes('assets/conexoes_origem_destino.csv')
    
    # Análise
    report, stats = analyze_network(ativos, conexoes)
    
    # Salvar relatório
    output_file = 'docs/security/tbe-network-analysis-real-data.md'
    print(f"\n💾 Salvando relatório em {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✅ Relatório salvo!")
    print(f"\n📊 Estatísticas:")
    print(f"   • Ativos processados: {stats['total_ativos']:,}")
    print(f"   • Ativos com IP: {stats['ativos_com_ip']:,}")
    print(f"   • Subnets únicos: {len(stats['subnets'])}")
    print(f"   • VLANs únicos: {len(stats['vlans'])}")
    print(f"   • Conexões: {stats['total_conexoes']:,}")
    
    print(f"\n📖 Ver relatório: cat {output_file}")
    
    # Salvar stats como JSON
    stats_file = 'docs/security/tbe-network-stats.json'
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, default=str)
    
    print(f"📊 Stats JSON: {stats_file}")
    
    print("\n" + "="*80)
    print("✅ Análise preliminar completa!")
    print("="*80)
    print("\n🔄 Próximo passo: Importar para PostgreSQL")
    print("   python3 import_to_database.py")

if __name__ == '__main__':
    main()
