
# 🌐 Análise de Rede TBE - Dados Reais

**Cliente**: TBE (Primeiro Cliente ness. OT GRC)  
**Data de Análise**: 2025-10-20 17:06:18  
**Fonte**: assets/ativos_normalizados.csv + conexoes_origem_destino.csv  

---

## 📊 Resumo Executivo

### Estatísticas Gerais
- **Total de Ativos**: 3,907
- **Total de Conexões**: 1,345
- **Ativos com IP**: 951 (24%)
- **Ativos com Hostname**: 1,305 (33%)
- **Ativos com VLAN**: 515 (13%)
- **Subnets Identificados**: 109
- **VLANs Identificados**: 59

---

## 📋 Inventário por Tipo de Dispositivo

| Tipo | Quantidade | % do Total |
|------|------------|------------|
| Network Link | 1,582 | 40.5% |
| Unknown | 1,406 | 36.0% |
| Router | 249 | 6.4% |
| Switch | 244 | 6.2% |
| Server | 177 | 4.5% |
| Mainframe | 96 | 2.5% |
| VoIP Device | 76 | 1.9% |
| Ethernet | 23 | 0.6% |
| Optical fiber | 11 | 0.3% |
| Firewall | 9 | 0.2% |
| Radio tower | 9 | 0.2% |
| Modem | 6 | 0.2% |
| PBX | 5 | 0.1% |
| Laptop | 4 | 0.1% |
| Bridge | 2 | 0.1% |
| Hub | 2 | 0.1% |
| Workstation | 2 | 0.1% |
| Ethernet.16 | 1 | 0.0% |
| LCD Monitor | 1 | 0.0% |
| House | 1 | 0.0% |
| Printer | 1 | 0.0% |

**Total de Tipos Únicos**: 21

---

## 🎯 Distribuição por Criticidade

| Criticidade | Quantidade | % |
|-------------|------------|---|
| 🔴 CRITICAL | 0 | 0.0% |
| 🟠 HIGH | 270 | 6.9% |
| 🟡 MEDIUM | 421 | 10.8% |
| 🟢 LOW | 3,216 | 82.3% |

---

## 🌐 Análise de Endereçamento IP

### Subnets Identificados (109 subnets)

| Subnet CIDR | Network | IPs Utilizáveis |
|-------------|---------|------------------|
| 10.0.0.0/24 | 10.0.0.0 | 254 |
| 10.1.2.0/24 | 10.1.2.0 | 254 |
| 10.1.3.0/24 | 10.1.3.0 | 254 |
| 10.1.4.0/24 | 10.1.4.0 | 254 |
| 10.2.1.0/24 | 10.2.1.0 | 254 |
| 10.2.1.28/30 | 10.2.1.28 | 2 |
| 10.2.4.0/24 | 10.2.4.0 | 254 |
| 10.255.250.4/30 | 10.255.250.4 | 2 |
| 100.127.121.128/30 | 100.127.121.128 | 2 |
| 100.127.196.176/30 | 100.127.196.176 | 2 |
| 100.127.77.4/30 | 100.127.77.4 | 2 |
| 172.19.0.0/24 | 172.19.0.0 | 254 |
| 172.22.119.0/24 | 172.22.119.0 | 254 |
| 172.26.0.0/24 | 172.26.0.0 | 254 |
| 189.52.218.252/30 | 189.52.218.252 | 2 |
| 192.0.17.16/30 | 192.0.17.16 | 2 |
| 192.0.2.100/30 | 192.0.2.100 | 2 |
| 192.0.2.116/30 | 192.0.2.116 | 2 |
| 192.0.2.248/30 | 192.0.2.248 | 2 |
| 192.0.2.252/30 | 192.0.2.252 | 2 |
| 192.0.2.64/30 | 192.0.2.64 | 2 |
| 192.0.2.68/30 | 192.0.2.68 | 2 |
| 192.0.2.72/30 | 192.0.2.72 | 2 |
| 192.0.2.80/30 | 192.0.2.80 | 2 |
| 192.0.2.84/30 | 192.0.2.84 | 2 |
| 192.0.21.0/30 | 192.0.21.0 | 2 |
| 192.0.3.8/30 | 192.0.3.8 | 2 |
| 192.0.48.0/28 | 192.0.48.0 | 14 |
| 192.0.48.240/28 | 192.0.48.240 | 14 |
| 192.0.5.4/30 | 192.0.5.4 | 2 |

**+ 79 subnets adicionais** (ver detalhes completos)

---

## 🏷️ Análise de VLANs

### VLANs Identificadas (59 VLANs)

| VLAN ID | Faixa | Uso Típico |
|---------|-------|------------|
| VLAN 7 | Management/Native | [A CLASSIFICAR] |
| VLAN 10 | Management/Native | [A CLASSIFICAR] |
| VLAN 20 | Infrastructure | [A CLASSIFICAR] |
| VLAN 35 | Infrastructure | [A CLASSIFICAR] |
| VLAN 40 | Infrastructure | [A CLASSIFICAR] |
| VLAN 50 | Infrastructure | [A CLASSIFICAR] |
| VLAN 70 | Infrastructure | [A CLASSIFICAR] |
| VLAN 95 | Infrastructure | [A CLASSIFICAR] |
| VLAN 96 | Infrastructure | [A CLASSIFICAR] |
| VLAN 100 | User/Data | [A CLASSIFICAR] |
| VLAN 102 | User/Data | [A CLASSIFICAR] |
| VLAN 103 | User/Data | [A CLASSIFICAR] |
| VLAN 121 | User/Data | [A CLASSIFICAR] |
| VLAN 123 | User/Data | [A CLASSIFICAR] |
| VLAN 130 | User/Data | [A CLASSIFICAR] |
| VLAN 169 | User/Data | [A CLASSIFICAR] |
| VLAN 201 | User/Data | [A CLASSIFICAR] |
| VLAN 202 | User/Data | [A CLASSIFICAR] |
| VLAN 300 | User/Data | [A CLASSIFICAR] |
| VLAN 301 | User/Data | [A CLASSIFICAR] |

**+ 39 VLANs adicionais**

---

## 🔗 Análise de Conectividade

### Estatísticas de Conexões
- **Total de Conexões Mapeadas**: 1,345
- **Média de Conexões por Dispositivo**: 0

### Top Dispositivos por Conexões
[ANÁLISE DETALHADA APÓS IMPORTAÇÃO NO DATABASE]

---

## 🚨 Achados Preliminares

### Rede de Grande Escala
✅ **3,907 ativos** - Rede complexa de nível enterprise  
✅ **109 subnets** - Endereçamento bem estruturado  
✅ **59 VLANs** - Segmentação Layer 2 existente  

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
