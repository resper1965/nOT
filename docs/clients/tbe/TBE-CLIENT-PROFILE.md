# Cliente TBE - Perfil e Dados

**Cliente**: TBE - Transmissora Brasileira de Energia  
**Código**: TBE-001  
**Setor**: Energia Elétrica  
**Tipo de Rede**: OT (Operational Technology)  
**Criticidade**: MÁXIMA - Infraestrutura Crítica Nacional  
**Regulação**: ANEEL RN 964/2021 + ONS  
**Data de Onboarding**: 2025-01-20  

---

## 📊 Dados da Rede TBE (Ingeridos)

### Assets Recebidos

| Arquivo | Registros | Tamanho | Data |
|---------|-----------|---------|------|
| ativos_normalizados.csv | 15.638 linhas | 730 KB | 2025-01-20 |
| conexoes_origem_destino.csv | 1.468 linhas | 93 KB | 2025-01-20 |

### Dados Processados

**Ativos Relevantes**: 3.907  
**Conexões**: 1.345  
**Ativos com IP**: 951 (24%)  
**Ativos com Hostname**: 1.305 (33%)  
**Ativos com VLAN**: 515 (13%)  

---

## 🌐 Inventário de Rede TBE

### Por Tipo de Dispositivo

| Tipo | Quantidade | % | Criticidade |
|------|------------|---|-------------|
| **Routers** | 249 | 6.4% | 🟠 High |
| **Switches** | 244 | 6.2% | 🟡 Medium |
| **Servers** | 177 | 4.5% | 🟡 Medium |
| **Mainframe** | 96 | 2.5% | 🟡 Medium |
| **VoIP Device** | 76 | 1.9% | 🟢 Low |
| **Firewalls** | 9 | 0.2% | 🟠 High |
| **Modems** | 6 | 0.2% | 🟡 Medium |
| **PBX** | 5 | 0.1% | 🟡 Medium |
| **Laptops** | 4 | 0.1% | 🟢 Low |
| **Hubs** | 2 | 0.1% | 🔴 Legacy (substituir) |
| **Bridges** | 2 | 0.1% | 🟡 Medium |
| **Network Links** | 1.582 | 40.5% | - |
| **Unknown** | 1.406 | 36.0% | ⚠️ A classificar |
| **Outros** | 49 | 1.3% | 🟢 Low |

**TOTAL**: 3.907 ativos

---

## 🌐 Endereçamento IP

### Subnets (109 subnets)

**Distribuição**:
- Classe A (10.x.x.x): ~40 subnets
- Classe B (172.x.x.x): ~15 subnets
- Classe C (192.168.x.x): ~30 subnets
- Point-to-Point (/30): ~20 subnets
- Públicos: ~4 subnets

**IPs Alocados**: 951 IPs identificados

**Taxa de Utilização Média**: ~9% (951 / ~10.000 IPs disponíveis estimados)

---

## 🏷️ VLANs (59 VLANs)

### Distribuição por Faixa

| Faixa | VLANs | Uso Típico |
|-------|-------|------------|
| 1-10 | 2 | Management/Native |
| 11-99 | 6 | Infrastructure |
| 100-999 | 48 | User/Data/Services |
| 1000+ | 3 | Extended |

**VLANs Críticas Identificadas**: [A CLASSIFICAR]  
**VLANs OT**: [A IDENTIFICAR]  
**VLANs IT**: [A IDENTIFICAR]  

---

## 🔗 Conectividade

**Conexões Mapeadas**: 1.345  
**Topologia**: Parcialmente mapeada  
**Redundância**: A analisar  

---

## 🚨 Riscos Identificados (Preliminar)

### Críticos
1. **2 Hubs** em rede (CVSS 7.5) - SUBSTITUIR URGENTE
2. **1.406 dispositivos Unknown** (36%) - CLASSIFICAR URGENTE
3. **Modelo Purdue ausente** (CVSS 9.1)
4. **9 firewalls** insuficientes

### Altos
5. 59 VLANs sem classificação
6. 109 subnets sem mapeamento
7. Versões de OS desconhecidas (3.907 sistemas)

---

## ✅ Próximos Passos

### Semana 1-2: Data Collection
- [ ] Coletar versões de OS (3.907 ativos)
- [ ] Identificar MFA status
- [ ] Verificar antimalware coverage
- [ ] Validar VPN existence

### Semana 3-4: Classification
- [ ] Classificar 1.406 "Unknown" devices
- [ ] Mapear 109 subnets → Purdue Levels
- [ ] Classificar 59 VLANs → Security Zones

### Semana 5-6: Analysis
- [ ] Analisar 1.345 conexões
- [ ] Trace critical paths
- [ ] Identify SPOFs
- [ ] Gap analysis completo

---

**Cliente**: TBE  
**Status**: Em Análise  
**Conformidade ONS**: 0%  
**Próxima Revisão**: Após data collection
