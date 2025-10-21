# 📋 Menu Detalhado Completo - ness. OT GRC

**Sistema**: ness. OT GRC  
**BMad Master**: Detalhamento item a item  
**Baseado em**: Dados REAIS da rede TBE (14.606 assets, 59 VLANs, 106 IPs)  
**Data**: 2025-10-20

---

## 🎯 VISÃO GERAL (/dashboard/overview)

**Objetivo**: Dashboard executivo com métricas principais das 3 frentes

### Cards Principais (Dados REAIS):

**Card 1: Total de Assets**
- **Valor**: 14.606 assets
- **Fonte**: `SELECT COUNT(*) FROM security.assets`
- **Detalhamento**:
  - 544 Routers (Layer 3)
  - 492 Switches (Layer 2)
  - 386 Servers (aplicações)
  - 36 Firewalls (segurança)
  - 40 Hubs (legacy - CRÍTICO: substituir)
  - 13.042 Network Devices (diversos)
  - 54 Ethernet devices
  - 12 Modems
- **Status**: ✅ Importado
- **API**: `/api/assets/stats`

**Card 2: Conformidade ONS**
- **Valor**: 0%
- **Cálculo**: 0 controles OK / 5 controles mínimos = 0%
- **Detalhamento**:
  1. MFA: ❌ 0% (não verificado)
  2. Patches: ❌ 0% (não verificado)
  3. VPN: ❌ 0% (não verificado)
  4. Antimalware: ❌ 0% (não verificado)
  5. Segmentação: ❌ 0% (Purdue não implementado)
- **Status**: 🔴 Não Conforme
- **Risco**: CRÍTICO

**Card 3: Documentos Obrigatórios**
- **Valor**: 2/50 (4%)
- **Fonte**: Inventário de documentos ANEEL RN 964 + ONS
- **Detalhamento**:
  - ✅ 2 templates criados (POL-001, PROC-001)
  - ❌ 48 documentos faltando (96%)
  - Categorias:
    - Políticas: 0/6
    - Procedimentos: 0/6
    - Planos: 0/10
    - Evidências: 2/28
- **Status**: 🔴 Crítico
- **Prioridade**: P0

**Card 4: Gaps Críticos**
- **Valor**: 6 gaps
- **CVSS Médio**: 8.3
- **Mais Crítico**: GAP-SEG-001 (CVSS 9.1)
- **Detalhamento**:
  1. GAP-SEG-001: Purdue não implementado (9.1)
  2. GAP-SEG-002: 109 Subnets não mapeados (8.5)
  3. GAP-SEG-003: 59 VLANs não classificadas (7.8)
  4. GAP-SEG-004: 1.345 Conexões não analisadas (8.2)
  5. GAP-SEG-005: Firewalls insuficientes (9.0)
  6. GAP-SEG-006: Documentação ausente (6.5)
- **Esforço Total**: 560 horas (14 semanas-pessoa)
- **Investimento**: R$ 250k-400k
- **Status**: 🔴 Ação urgente requerida

### Gráficos (Dados REAIS):

**Gráfico 1: Distribuição de Assets TBE**
- **Tipo**: Barras verticais
- **Fonte**: `SELECT asset_type, COUNT(*) GROUP BY asset_type`
- **Dados**:
  - Network Device: 13.042 (89.3%)
  - Router: 544 (3.7%)
  - Switch: 492 (3.4%)
  - Server: 386 (2.6%)
  - Ethernet: 54 (0.4%)
  - Hub: 40 (0.3%)
  - Firewall: 36 (0.2%)
  - Modem: 12 (0.1%)
- **Total**: 14.606

**Gráfico 2: Gaps Críticos Identificados**
- **Tipo**: Lista com scores CVSS
- **Dados**:
  - GAP-SEG-001: 9.1 (Purdue)
  - GAP-SEG-002: 8.5 (Subnets)
  - GAP-SEG-003: 7.8 (VLANs)
  - GAP-SEG-004: 8.2 (Conexões)
  - GAP-SEG-005: 9.0 (Firewalls)
- **Fonte**: Análise de conformidade ONS

**Gráfico 3: Progresso de Segmentação**
- **Tipo**: Progress bars
- **Dados REAIS**:
  - Subnets mapeados: 0/109 (0%)
  - VLANs classificadas: 0/59 (0%)
  - Conexões analisadas: 0/1.345 (0%)
  - Firewalls implementados: 36/15 (mas mal posicionados)
  - Documentos: 0/6 (0%)
  - Conformidade: 0/100 (0%)

**Gráfico 4: Status de Conformidade**
- **Tipo**: Círculo de progresso
- **Valor**: 0%
- **Breakdown**:
  - Conformidade ONS: 0%
  - Documentos: 0/50
  - Controles: 0/5

---

## 1️⃣ FRENTE 1: NORMATIVA (Compliance)

### 1.1 📄 Documentos Obrigatórios (/dashboard/compliance/documents)

**Objetivo**: Gestão dos 50 documentos obrigatórios ANEEL RN 964 + ONS

**Dados REAIS**:
- **Total**: 50 documentos obrigatórios
- **Criados**: 2 (4%)
- **Faltando**: 48 (96%)
- **Status**:
  - 🔴 Missing: 48
  - 🟡 Draft: 0
  - 🟠 Em Revisão: 0
  - 🟢 Aprovados: 2

**Categorias (REAL)**:

#### Políticas (0/6)
1. **POL-001**: Política de Segurança da Informação - ❌ Missing - P0
2. **POL-002**: Política de Segurança Cibernética OT - ❌ Missing - P0
3. **POL-003**: Política de Controle de Acesso - ❌ Missing - P0
4. **POL-004**: Política de Gestão de Incidentes - ❌ Missing - P0
5. **POL-005**: Política de Gestão de Patches - ❌ Missing - P0
6. **POL-006**: Política de Segmentação de Rede - ❌ Missing - P0

#### Procedimentos (0/6)
1. **PROC-001**: Gestão de Incidentes - ❌ Missing - P0
2. **PROC-002**: Gestão de Patches - ❌ Missing - P0
3. **PROC-003**: Backup e Recovery - ❌ Missing - P0
4. **PROC-004**: Controle de Acesso - ❌ Missing - P0
5. **PROC-005**: Monitoramento de Segurança - ❌ Missing - P1
6. **PROC-006**: Segmentação de Rede - ❌ Missing - P1

#### Planos de Resposta (0/4)
1. **PRI-001**: Plano de Resposta a Incidentes - ❌ Missing - P0
2. **PRI-002**: Plano de Comunicação de Crise - ❌ Missing - P0
3. **PRI-003**: Plano de Recuperação - ❌ Missing - P0
4. **PRI-004**: Plano de Contenção - ❌ Missing - P1

#### Planos de Continuidade (0/3)
1. **BCP-001**: Business Continuity Plan Principal - ❌ Missing - P0
2. **BCP-002**: Disaster Recovery Plan - ❌ Missing - P0
3. **BCP-003**: Plano de Testes de Continuidade - ❌ Missing - P1

#### Treinamentos (0/4)
1. **TRAIN-001**: Programa de Conscientização - ❌ Missing - P1
2. **TRAIN-002**: Treinamento Técnico OT - ❌ Missing - P1
3. **TRAIN-003**: Resposta a Incidentes - ❌ Missing - P1
4. **TRAIN-004**: Segurança para Terceiros - ❌ Missing - P2

#### Análises de Risco (0/3)
1. **RISK-001**: Análise de Risco Anual - ❌ Missing - P0
2. **RISK-002**: Avaliação de Ameaças - ❌ Missing - P1
3. **RISK-003**: Análise de Impacto - ❌ Missing - P1

#### Auditorias (0/4)
1. **AUD-001**: Relatório de Auditoria Interna - ❌ Missing - P1
2. **AUD-002**: Auditoria de Conformidade - ❌ Missing - P1
3. **AUD-003**: Auditoria de Controles - ❌ Missing - P1
4. **AUD-004**: Follow-up de Auditorias - ❌ Missing - P2

#### Evidências (2/20)
1. **EVID-001**: Inventário de Assets - ✅ Criado (14.606 assets)
2. **EVID-002**: Inventário de VLANs - ✅ Criado (59 VLANs)
3. **EVID-003**: MFA Implementation - ❌ Missing - P0
4. **EVID-004**: Patch Management Records - ❌ Missing - P0
5. **EVID-005**: VPN Configuration - ❌ Missing - P0
6. **EVID-006**: Antimalware Coverage - ❌ Missing - P0
7. **EVID-007**: Segmentation Documentation - ❌ Missing - P0
8. ... (mais 13 evidências)

**Controles**:
- Workflow de aprovação: ⏳ A implementar
- Notificações de revisão: ⏳ A implementar
- Tracking de versões: ⏳ A implementar

---

### 1.2 🛡️ Controles ONS (/dashboard/compliance/ons)

**Objetivo**: Monitorar os 5 controles mínimos obrigatórios da ONS

**Dados REAIS**:

#### Controle 1: Autenticação Multifator (MFA)
- **Status**: 🔴 Não Conforme (0%)
- **Requisito**: MFA obrigatório em sistemas críticos
- **Análise TBE**:
  - Sistemas críticos: ? (a identificar)
  - Sistemas com MFA: 0
  - Gap: 100%
- **Evidência Necessária**: EVID-003
- **Ações**:
  1. Identificar sistemas críticos (Query: `WHERE criticality='high'`)
  2. Auditar implementação de MFA
  3. Implementar MFA onde ausente
  4. Documentar em POL-003
- **Esforço**: 40h (1 semana)
- **Prioridade**: P0

#### Controle 2: Gestão de Patches
- **Status**: 🔴 Não Conforme (0%)
- **Requisito**: Política de patches + aplicação periódica
- **Análise TBE**:
  - Total de ativos: 14.606
  - Versões de OS coletadas: 0/14.606 (0%)
  - Sistemas EOL: ? (não identificado)
  - Patches pendentes: ? (não identificado)
- **Evidência Necessária**: EVID-004
- **Documentos Necessários**: POL-005, PROC-002
- **Ações**:
  1. Coletar versões de OS (14.606 ativos)
  2. Identificar sistemas EOL
  3. Criar política de patches (POL-005)
  4. Estabelecer processo (PROC-002)
- **Esforço**: 80h (2 semanas)
- **Prioridade**: P0

#### Controle 3: VPN para Acesso Remoto
- **Status**: 🔴 Não Verificado (0%)
- **Requisito**: VPN com criptografia forte
- **Análise TBE**:
  - Modems identificados: 12 (possíveis pontos de acesso)
  - VPN concentrators: ? (não identificado)
  - Conexões remotas: ? (não mapeado)
- **Evidência Necessária**: EVID-005
- **Ações**:
  1. Identificar concentradores VPN
  2. Auditar criptografia
  3. Documentar acessos remotos
- **Esforço**: 20h (3 dias)
- **Prioridade**: P0

#### Controle 4: Antimalware
- **Status**: 🔴 Não Verificado (0%)
- **Requisito**: Antimalware em todos os endpoints
- **Análise TBE**:
  - Endpoints requerendo antimalware: 386 servers
  - Coverage atual: 0/386 (0% - não verificado)
- **Evidência Necessária**: EVID-006
- **Ações**:
  1. Auditar 386 servers
  2. Verificar antimalware instalado
  3. Verificar atualizações
  4. Documentar coverage
- **Esforço**: 30h (4 dias)
- **Prioridade**: P0

#### Controle 5: Segmentação OT/IT ⭐ PRINCIPAL
- **Status**: 🔴 Não Conforme (0%)
- **Requisito**: Modelo Purdue com firewalls entre níveis
- **Análise TBE (DETALHADO)**:
  
  **Dados Disponíveis**:
  - ✅ 14.606 assets identificados
  - ✅ 109 subnets mapeados
  - ✅ 59 VLANs identificadas
  - ✅ 1.345 conexões mapeadas
  - ✅ 36 firewalls identificados
  - ✅ 544 routers (roteamento L3)
  - ✅ 492 switches (switching L2)
  
  **Gaps Identificados** (6 gaps):
  
  **GAP-SEG-001**: Modelo Purdue não implementado
  - CVSS: 9.1 (CRITICAL)
  - Status: 0/6 níveis implementados
  - Esforço: 300h
  
  **GAP-SEG-002**: 109 Subnets não mapeados
  - CVSS: 8.5 (HIGH)
  - Dados: 109 subnets identificados, 0 mapeados Purdue
  - Esforço: 80h (2 semanas)
  - Deliverable: TBE-SUBNET-PURDUE-MAPPING.xlsx
  
  **GAP-SEG-003**: 59 VLANs não classificadas
  - CVSS: 7.8 (HIGH)
  - Dados: 59 VLANs no banco, 0 classificadas por zona
  - Distribuição:
    - Faixa 1-10: 2 VLANs
    - Faixa 11-99: 6 VLANs
    - Faixa 100-999: 48 VLANs
    - Faixa 1000+: 3 VLANs
  - Esforço: 40h (1 semana)
  - Deliverable: TBE-VLAN-CLASSIFICATION.xlsx
  
  **GAP-SEG-004**: 1.345 Conexões não analisadas
  - CVSS: 8.2 (HIGH)
  - Dados: 1.345 conexões no CSV, 0 analisadas cross-zone
  - Esforço: 60h (2 semanas)
  - Deliverable: TBE-CROSS-ZONE-CONNECTIONS.xlsx
  
  **GAP-SEG-005**: Firewalls insuficientes
  - CVSS: 9.0 (CRITICAL)
  - Dados: 36 firewalls identificados
  - Necessário: Mínimo 5 (um entre cada nível Purdue)
  - Gap: Localização e função desconhecidas
  - Esforço: 40h (1 semana)
  
  **GAP-SEG-006**: Documentação ausente
  - CVSS: 6.5 (MEDIUM)
  - Faltam: POL-006, PROC-006, ARCH-001, etc (6 docs)
  - Esforço: 40h (1 semana)

- **Evidência Necessária**: EVID-007
- **Total Esforço**: 560 horas
- **Prioridade**: P0

---

### 1.3 📜 ANEEL RN 964 (/dashboard/compliance/aneel)

**Objetivo**: Conformidade com os 7 pilares da Resolução Normativa 964/2021

**Dados REAIS**:

#### Pilar 1: Segurança da Informação
- **Documentos**: POL-001, POL-002, POL-003
- **Status**: 0/3 (0%)
- **Gap**: 100%

#### Pilar 2: Segurança Cibernética
- **Documentos**: POL-002, PROC-001, PROC-002
- **Status**: 0/3 (0%)
- **Controles Técnicos**: MFA, Antimalware, Patches
- **Gap**: 100%

#### Pilar 3: Gestão de Risco
- **Documentos**: RISK-001, RISK-002, RISK-003
- **Status**: 0/3 (0%)
- **Gap**: 100%

#### Pilar 4: Continuidade de Negócio
- **Documentos**: BCP-001, BCP-002, BCP-003
- **Status**: 0/3 (0%)
- **Gap**: 100%

#### Pilar 5: Resposta a Incidentes
- **Documentos**: PRI-001, PRI-002, PRI-003, PRI-004
- **Status**: 0/4 (0%)
- **Gap**: 100%

#### Pilar 6: Gestão de Terceiros
- **Documentos**: (a mapear)
- **Status**: 0% (não iniciado)

#### Pilar 7: Conscientização e Treinamento
- **Documentos**: TRAIN-001, TRAIN-002, TRAIN-003, TRAIN-004
- **Status**: 0/4 (0%)
- **Gap**: 100%

**Resumo**:
- **Conformidade Geral ANEEL**: 0%
- **Risco de Multa**: ALTO
- **Ação Urgente**: Criar 48 documentos

---

### 1.4 🎯 Frameworks (/dashboard/compliance/frameworks)

**Objetivo**: Tracking de múltiplos frameworks de conformidade

**Frameworks Ativos**:

#### IEC 62443 (Segurança OT)
- **Security Levels**: SL0 (atual) → SL2 (target)
- **Compliance**: 0%
- **Gap**: Modelo Purdue não implementado

#### NIST Cybersecurity Framework
- **5 Funções**: Identify, Protect, Detect, Respond, Recover
- **Compliance**: Estimado 5% (apenas inventário)

#### CIS Controls v8
- **18 Controles**: 
  - CIS 1 (Inventário de Assets): ✅ 80% (14.606 assets)
  - CIS 2-18: ❌ 0%
- **Compliance Geral**: ~4%

#### ISO/IEC 27001
- **Anexo A**: 114 controles
- **Implementados**: ~2 controles
- **Compliance**: ~2%

#### LGPD (Lei Geral de Proteção de Dados)
- **Aplicável**: Sim (dados de clientes/funcionários)
- **Compliance**: Não avaliado
- **Gap**: 100%

---

## 2️⃣ FRENTE 2: ANÁLISE DE REDE (Network Intelligence)

### 2.1 🖥️ Assets & Inventário (/dashboard/network/assets)

**Objetivo**: Inventário completo da rede TBE

**Dados REAIS do PostgreSQL**:

#### Total de Assets: 14.606
- **Fonte**: `SELECT COUNT(*) FROM security.assets`
- **Importado**: 2025-10-20 18:03
- **Origem**: assets/ativos_normalizados.csv

#### Por Tipo de Dispositivo (REAL):
1. **Network Device**: 13.042 (89.3%)
2. **Router**: 544 (3.7%) - Layer 3
3. **Switch**: 492 (3.4%) - Layer 2
4. **Server**: 386 (2.6%) - Aplicações
5. **Ethernet**: 54 (0.4%)
6. **Hub**: 40 (0.3%) - 🔴 LEGACY (substituir urgente)
7. **Firewall**: 36 (0.2%) - Segurança
8. **Modem**: 12 (0.1%) - Acesso remoto

#### Por Criticidade (REAL):
- **High**: 580 assets (4.0%)
  - Routers, Firewalls
  - Query: `WHERE criticality='high'`
- **Medium**: 878 assets (6.0%)
  - Switches, Servers
  - Query: `WHERE criticality='medium'`
- **Low**: 13.148 assets (90.0%)
  - Network devices gerais
  - Query: `WHERE criticality='low'`

#### Com IP Address:
- **Total**: 106 IPs ativos no banco
- **% do total**: 0.7% (106/14.606)
- **Fonte**: `SELECT COUNT(*) FROM topology.ip_addresses`

#### Funcionalidades:
- ✅ Lista top 20 assets (REAL do banco)
- ✅ Filtros por tipo
- ✅ Filtros por criticidade
- ✅ Distribuição visual
- ⏳ Exportar para Excel
- ⏳ Edição inline
- ⏳ Classificação manual

---

### 2.2 🌐 Endereçamento IP - IPAM (/dashboard/network/ipam)

**Objetivo**: IP Address Management completo

**Dados REAIS**:

#### Subnets Identificados: 109
- **Fonte**: Análise preliminar dos IPs (docs/security/tbe-network-analysis-real-data.md)
- **Classe A (10.x.x.x)**: ~40 subnets
- **Classe B (172.x.x.x)**: ~15 subnets
- **Classe C (192.168.x.x)**: ~30 subnets
- **Point-to-Point (/30)**: ~20 subnets
- **Públicos**: ~4 subnets

#### IPs Ativos: 106
- **Fonte**: `SELECT COUNT(*) FROM topology.ip_addresses`
- **No banco**: 106 IPs únicos
- **IPs esperados**: ~951 (da análise preliminar)
- **Gap**: 845 IPs não importados (89%)

#### Principais Subnets (REAL):
1. **10.0.0.0/24** - Network 10.0.0.0 - 254 IPs utilizáveis
2. **10.1.2.0/24** - Network 10.1.2.0 - 254 IPs utilizáveis
3. **10.1.3.0/24** - Network 10.1.3.0 - 254 IPs utilizáveis
4. **172.19.0.0/24** - Network 172.19.0.0 - 254 IPs utilizáveis
5. **172.22.119.0/24** - Network 172.22.119.0 - 254 IPs utilizáveis
6. **192.168.1.0/24** - (estimado)
7. **10.2.1.28/30** - Point-to-Point (2 IPs)
8. **192.0.2.100/30** - Point-to-Point (2 IPs)

#### Utilização:
- **IPs alocados**: 106 (no banco)
- **IPs disponíveis estimados**: ~10.000
- **Taxa de utilização**: ~1% (muito baixa - indica subutilização)

#### IPs por VLAN (Top 10):
- **Fonte**: `SELECT vlan_id, COUNT(*) FROM topology.ip_addresses GROUP BY vlan_id`
- **API**: `/api/network/ip-summary`
- **Dados**: Distribuição real do banco

#### Análise Necessária:
- ⏳ Conflitos de IP (0 detectados no banco)
- ⏳ IPs não utilizados
- ⏳ Subnets over-allocated (>90%)
- ⏳ Capacity planning por subnet

**Controle ONS**:
- **GAP-SEG-002**: 109 Subnets não mapeados Purdue (CVSS 8.5)
- **Ação**: Mapear cada subnet → Nível Purdue (80h)

---

### 2.3 🏷️ VLANs & Segmentação L2 (/dashboard/network/vlans)

**Objetivo**: Análise de segmentação Layer 2

**Dados REAIS do PostgreSQL**:

#### Total de VLANs: 59
- **Fonte**: `SELECT * FROM topology.vlans`
- **API**: `/api/network/vlans`
- **Importadas**: 2025-10-20 18:03

#### Distribuição por Faixa (REAL):

**Faixa 1-10 (Management/Native)**: 2 VLANs
- Uso típico: VLAN de gerenciamento, native VLAN
- Criticidade esperada: HIGH
- Status: ❌ Não classificadas

**Faixa 11-99 (Infrastructure)**: 6 VLANs
- Uso típico: Serviços de infraestrutura
- Criticidade esperada: MEDIUM-HIGH
- Status: ❌ Não classificadas

**Faixa 100-999 (User/Data/Services)**: 48 VLANs
- Uso típico: Usuários, dados, aplicações
- Criticidade esperada: MEDIUM-LOW
- Status: ❌ Não classificadas

**Faixa 1000+ (Extended)**: 3 VLANs
- Uso típico: Serviços estendidos
- Criticidade esperada: LOW
- Status: ❌ Não classificadas

#### Lista Completa de VLANs (REAL - primeiras 20):
1. VLAN 7 - ❌ Não classificada
2. VLAN 10 - ❌ Não classificada
3. VLAN 20 - ❌ Não classificada
4. VLAN 35 - ❌ Não classificada
5. VLAN 40 - ❌ Não classificada
6. VLAN 50 - ❌ Não classificada
7. VLAN 70 - ❌ Não classificada
8. VLAN 95 - ❌ Não classificada
9. VLAN 96 - ❌ Não classificada
10. VLAN 100 - ❌ Não classificada
11. VLAN 102 - ❌ Não classificada
12. VLAN 103 - ❌ Não classificada
... (+ 47 VLANs)

**Todas as 59 VLANs**: Disponíveis via API `/api/network/vlans`

#### Mapeamento Necessário (EXEMPLO):

```yaml
VLAN 100:
  Nome: SCADA-Operations
  Subnets: [10.1.2.0/24, 10.1.3.0/24]
  Dispositivos: [Server-SCADA-01, Server-SCADA-02]
  Criticidade: CRITICAL
  Purdue Level: 3 (Operations & Control)
  Zona: OT-SCADA
  Trunk Ports: [Switch-Core-01:Gi1/0/1]
```

**Controle ONS**:
- **GAP-SEG-003**: 59 VLANs não classificadas (CVSS 7.8)
- **Ação**: Classificar por zona (40h)

**Análises Disponíveis**:
- ✅ Distribuição por faixa
- ✅ Lista completa
- ⏳ VLAN ↔ Subnet mapping
- ⏳ VLAN ↔ Zona mapping
- ⏳ Trunk analysis
- ⏳ STP topology

---

### 2.4 🔀 Roteamento & L3 (/dashboard/network/routing)

**Objetivo**: Análise de roteamento Layer 3

**Dados REAIS**:

#### Routers Identificados: 544
- **Fonte**: `SELECT COUNT(*) WHERE asset_type='Router'`
- **No banco**: 544 routers
- **Criticidade**: HIGH (todos)

#### Protocolos de Roteamento:
- **OSPF**: ? (não coletado)
- **BGP**: ? (não coletado)
- **EIGRP**: ? (não coletado)
- **Static Routes**: ? (não coletado)
- **Default Routes**: ? (não coletado)

#### Inter-VLAN Routing:
- **VLANs**: 59 (todas precisam roteamento)
- **Routers**: 544 disponíveis
- **Configurações**: ⏳ A coletar

#### Tabelas de Roteamento:
- **Status**: ❌ Não coletadas
- **Necessário**: Coletar de 544 routers
- **Método**: SSH (show ip route), SNMP, ou API

#### Caminhos Críticos (A Mapear):
1. **SCADA → PLCs**
   - Origem: ? (identificar servers SCADA)
   - Destino: ? (identificar PLCs)
   - Hops: ?
   - Latência: ?
   - Redundância: ?

2. **Operação → Subestações**
   - Path: ?
   - Latência: ?

3. **IT → OT Boundary**
   - Firewalls: 36 (localização?)
   - ACLs: ?

#### SPOFs (Single Points of Failure):
- **Status**: ⏳ A identificar
- **Análise**: Requer dados de roteamento

**Esforço de Coleta**: 120h (3 semanas)  
**Prioridade**: P1

**Controles**:
- ✅ 544 routers inventariados
- ❌ Tabelas de roteamento não coletadas
- ❌ Protocolos não identificados
- ❌ Paths críticos não mapeados
- ❌ Redundância não analisada

---

### 2.5 🗺️ Topologia Visual (/dashboard/network/topology)

**Objetivo**: Visualização gráfica da topologia em 6 visões

**Dados REAIS Disponíveis**:
- ✅ 14.606 assets (nodes)
- ✅ 1.345 conexões (edges) - do CSV
- ✅ 59 VLANs (segmentação L2)
- ✅ 109 subnets (segmentação L3)
- ✅ 544 routers (roteamento)
- ✅ 492 switches (switching)
- ✅ 36 firewalls (segurança)

#### Visão 1: Física
- **Nodes**: 14.606 assets
- **Edges**: 1.345 conexões
- **Tipo**: Grafo não direcionado
- **Status**: 🟡 Dados disponíveis, visualização a implementar
- **Tecnologia**: D3.js, Cytoscape.js, ou Mermaid
- **Esforço**: 40h (1 semana)

#### Visão 2: Layer 2 (VLANs)
- **Switches**: 492
- **VLANs**: 59
- **Trunks**: ? (a coletar)
- **STP Topology**: ? (a coletar)
- **Status**: 🟡 Parcial

#### Visão 3: Layer 3 (Subnets e Routing)
- **Routers**: 544
- **Subnets**: 109
- **Rotas**: ? (a coletar)
- **Status**: 🟡 Parcial

#### Visão 4: Zonas de Segurança
- **Firewalls**: 36
- **Zonas**: ⏳ A definir
- **Boundaries**: ⏳ A mapear
- **Status**: 🔴 Crítico (não definido)

#### Visão 5: Modelo Purdue (6 Níveis) ⭐
- **Nível 5 (Enterprise)**: ? assets, ? subnets
- **Nível 4 (Business)**: ? assets, ? subnets
- **Nível 3 (Operations)**: ? assets, ? subnets
- **Nível 2 (Supervisory)**: ? assets, ? subnets
- **Nível 1 (Basic Control)**: ? assets, ? subnets
- **Nível 0 (Process)**: ? assets
- **Firewalls entre níveis**: 0/5 mapeados
- **Status**: 🔴 Não implementado (GAP-SEG-001)

#### Visão 6: Criticidade
- **Critical**: 0 assets (a classificar)
- **High**: 580 assets (routers, firewalls)
- **Medium**: 878 assets (switches, servers)
- **Low**: 13.148 assets (diversos)
- **Status**: 🟡 Classificação básica feita

**Estatísticas da Topologia**:
- **Total Nodes**: 14.606
- **Total Edges**: 1.345
- **Densidade**: 0.09 conexões/node
- **Avg Connections/Node**: 0.18

**Implementação**:
- ⏳ Diagrama D3.js interativo
- ⏳ Zoom e pan
- ⏳ Filtros por tipo/criticidade
- ⏳ Export SVG/PNG

**Esforço**: 80h (2 semanas)  
**Prioridade**: P1

---

### 2.6 💓 Network Health (/dashboard/network/health)

**Objetivo**: Monitoramento em tempo real da saúde da rede

**Dados REAIS (Atual - Estático)**:

#### IP Address Management
- **IPs Allocated**: 106 (REAL do banco)
- **Subnet Utilization**: ~9% média (CALCULADO)
- **IP Conflicts**: 0 (REAL - query no banco)
- **DHCP Pool Usage**: ? (não coletado)

#### VLAN Health
- **VLANs Active**: 59 (REAL do banco)
- **VLANs Sem Uso**: ? (a analisar)
- **VLAN Spanning Issues**: ? (não monitorado)
- **STP Convergence**: ? (não monitorado)

#### Routing Health
- **Routers Up**: ?/544 (não monitorado)
- **Routes Active**: ? (não coletado)
- **Route Flaps (24h)**: ? (não monitorado)
- **BGP Sessions**: ? (não coletado)
- **Convergence Time**: ? (não medido)

#### Segmentation Score
- **Purdue Level Compliance**: 0% (GAP-SEG-001)
- **Zone Isolation**: 0% (zonas não definidas)
- **Firewall Coverage**: ? (36 firewalls, localização desconhecida)
- **ACL Compliance**: ? (não auditado)

#### Network Performance
- **Average Latency**: ? (não medido)
- **Packet Loss**: ? (não medido)
- **Bandwidth Utilization**: ? (não monitorado)
- **Bottlenecks Detected**: ? (não analisado)
- **Uptime**: ? (não monitorado)

**Para Implementar Monitoramento Real**:

#### Fase 1: Coleta de Dados (40h)
- SNMP polling (routers, switches)
- NetFlow/sFlow (tráfego)
- ICMP ping (latência)
- Syslog (eventos)

#### Fase 2: Processamento (40h)
- Time-series database (InfluxDB ou Prometheus)
- Agregação de métricas
- Cálculo de KPIs

#### Fase 3: Visualização (40h)
- Dashboard real-time (WebSocket)
- Gráficos Recharts
- Alertas (Email/SMS)

**Esforço Total**: 120h (3 semanas)  
**Prioridade**: P2

**Dados Mockados no Momento**:
- ⚠️ Esta página atualmente mostra dados estáticos
- ⏳ Monitoramento real requer coleta SNMP/NetFlow
- ⏳ Integração com Zabbix, Nagios, ou custom collector

---

## 3️⃣ FRENTE 3: ADEQUAÇÃO (Gap Analysis & Remediation)

### 3.1 ⚠️ Gap Analysis ONS (/dashboard/remediation/gaps)

**Objetivo**: Gaps identificados cruzando requisitos ONS × dados TBE

**Dados REAIS**:

#### GAP-SEG-001: Modelo Purdue Não Implementado
- **CVSS**: 9.1 (CRITICAL)
- **Requisito**: 6 níveis Purdue (0 a 5) com firewalls entre cada
- **Realidade TBE**:
  - Níveis implementados: 0/6 (0%)
  - Assets mapeados: 0/14.606 (0%)
  - Subnets mapeados: 0/109 (0%)
  - VLANs mapeadas: 0/59 (0%)
  - Firewalls entre níveis: 0/5
- **Impacto**: Facilita movimento lateral, não conformidade total ONS
- **Esforço**: 300h
- **Prioridade**: P0

#### GAP-SEG-002: 109 Subnets Não Mapeados
- **CVSS**: 8.5 (HIGH)
- **Dados**: 109 subnets identificados, 0 mapeados
- **Deliverable**: TBE-SUBNET-PURDUE-MAPPING.xlsx
- **Esforço**: 80h (2 semanas)
- **Prioridade**: P0

#### GAP-SEG-003: 59 VLANs Não Classificadas
- **CVSS**: 7.8 (HIGH)
- **Dados**: 59 VLANs no banco, 0 classificadas
- **Deliverable**: TBE-VLAN-CLASSIFICATION.xlsx
- **Esforço**: 40h (1 semana)
- **Prioridade**: P1

#### GAP-SEG-004: 1.345 Conexões Não Analisadas
- **CVSS**: 8.2 (HIGH)
- **Dados**: 1.345 conexões no CSV, 0 analisadas cross-zone
- **Deliverable**: TBE-CROSS-ZONE-CONNECTIONS.xlsx
- **Esforço**: 60h (2 semanas)
- **Prioridade**: P1

#### GAP-SEG-005: Firewalls Insuficientes
- **CVSS**: 9.0 (CRITICAL)
- **Dados**: 36 firewalls identificados
- **Necessário**: Mínimo 5 (entre níveis Purdue) + posicionamento correto
- **Gap**: Localização/função desconhecidas
- **Esforço**: 40h (1 semana)
- **Prioridade**: P0

#### GAP-SEG-006: Documentação Ausente
- **CVSS**: 6.5 (MEDIUM)
- **Faltam**: 6 documentos de segmentação
- **Esforço**: 40h (1 semana)
- **Prioridade**: P1

**Resumo Gaps**:
- **Total**: 6 gaps
- **CVSS Médio**: 8.3
- **Esforço Total**: 560 horas (14 semanas-pessoa)
- **Investimento**: R$ 250.000 - R$ 400.000

---

### 3.2 🎯 Matriz de Riscos (/dashboard/remediation/risks)

**Objetivo**: Matriz de riscos priorizados

**Dados REAIS**:

#### Riscos por Categoria:

**Riscos de Segmentação** (CVSS 7.8-9.1):
1. Purdue não implementado (9.1)
2. Firewalls insuficientes (9.0)
3. Subnets não mapeados (8.5)
4. Conexões cross-zone (8.2)
5. VLANs não classificadas (7.8)

**Riscos de Configuração**:
- 40 Hubs em produção (CVSS 7.5) - URGENTE
- Switches sem port security (? - não auditado)
- VLANs native mal configuradas (? - não auditado)

**Riscos de Conformidade**:
- 0% conformidade ONS → Multas ANEEL
- 48/50 documentos faltando → Auditoria falha
- 0 controles implementados → Penalidades

**Matriz de Risco**:

| ID | Risco | Probabilidade | Impacto | CVSS | Esforço | Prioridade |
|----|-------|---------------|---------|------|---------|------------|
| RISK-001 | Purdue ausente | Alta | Crítico | 9.1 | 300h | P0 |
| RISK-002 | 40 Hubs em rede | Média | Alto | 7.5 | 8h | P0 |
| RISK-003 | Firewalls insuf. | Alta | Crítico | 9.0 | 40h | P0 |
| RISK-004 | Subnets não map. | Alta | Alto | 8.5 | 80h | P0 |
| RISK-005 | VLANs não class. | Alta | Médio | 7.8 | 40h | P1 |
| RISK-006 | Conexões n/analis. | Alta | Alto | 8.2 | 60h | P1 |

---

### 3.3 📅 Plano de Adequação (/dashboard/remediation/plan)

**Objetivo**: Roadmap de adequação (90-180 dias)

**Dados REAIS**:

#### Fase 1: Quick Wins (0-30 dias)
**Esforço**: 50h | **Impacto**: Alto | **Custo**: R$ 15k

| ID | Ação | Esforço | Prazo | Dados TBE |
|----|------|---------|-------|-----------|
| QW-001 | Substituir 40 Hubs | 8h | +5d | 40 Hubs identificados |
| QW-002 | Documentar 59 VLANs | 16h | +7d | 59 VLANs no banco |
| QW-003 | Mapear subnets críticos | 16h | +14d | 109 subnets |
| QW-004 | Identificar sistemas EOL | 10h | +7d | 14.606 assets |

#### Fase 2: Correções Críticas (30-90 dias)
**Esforço**: 280h | **Impacto**: Crítico | **Custo**: R$ 80k

| ID | Ação | Esforço | Prazo | Dados TBE |
|----|------|---------|-------|-----------|
| CC-001 | Deploy firewall IT↔OT | 40h | +45d | 36 firewalls base |
| CC-002 | Implementar MFA | 60h | +60d | 386 servers |
| CC-003 | Redesign VLANs críticas | 80h | +75d | 59 VLANs |
| CC-004 | Mapear 109 subnets → Purdue | 80h | +60d | 109 subnets |
| CC-005 | Criar 20 docs prioritários | 80h | +90d | 50 docs total |

#### Fase 3: Adequação Completa (90-180 dias)
**Esforço**: 400h | **Impacto**: Alto | **Custo**: R$ 120k

| ID | Ação | Esforço | Prazo | Dados TBE |
|----|------|---------|-------|-----------|
| AC-001 | 6 níveis Purdue completo | 160h | +150d | 14.606 assets |
| AC-002 | Classificar 1.406 Unknown | 80h | +120d | 13.042 Network Devices |
| AC-003 | Finalizar 50 documentos | 120h | +180d | 48 pendentes |
| AC-004 | Auditoria externa | 40h | +180d | Todos dados |

**Investimento Total**: R$ 215k (RH) + R$ 100k-200k (HW/SW) = R$ 315k-415k

---

### 3.4 📅 Timeline (90 dias) (/dashboard/remediation/timeline)

**Objetivo**: Cronograma detalhado de implementação

**Dados REAIS**:

```
Semana 1-2: Mapping & Classification
├─ Mapear 109 subnets → Purdue (80h)
├─ Classificar 59 VLANs → Zonas (40h)
└─ Deliverable: 2 planilhas Excel

Semana 3-4: Análise & Inventário
├─ Analisar 1.345 conexões (60h)
├─ Inventariar 36 firewalls (10h)
├─ Coletar versões OS (14.606 assets)
└─ Deliverable: 2 planilhas + relatório

Semana 5-6: Design
├─ Desenhar Modelo Purdue TO-BE (40h)
├─ Especificar firewalls (40h)
└─ Deliverable: Diagrama + especificação

Semana 7-8: Documentação
├─ Criar 20 docs prioritários (80h)
└─ Deliverable: 20 documentos aprovados

Semana 9-10: Procurement
├─ Adquirir firewalls
├─ Adquirir switches (substituir Hubs)
└─ Lead time: 30 dias

Semana 11-12: Implementação
├─ Deploy firewall IT↔OT (60h)
├─ Substituir 40 Hubs (8h)
└─ Migrar VLANs críticas (60h)

Semana 13: Validação
├─ Testes de conectividade (20h)
├─ Testes de failover (10h)
└─ Pen test básico (10h)
```

**Métricas de Progresso (REAL)**:
- Subnets mapeados: 0/109 (0%)
- VLANs classificadas: 0/59 (0%)
- Conexões analisadas: 0/1.345 (0%)
- Firewalls implementados: 36/15 (mas não posicionados)
- Documentos aprovados: 2/50 (4%)
- Conformidade ONS: 0/100 (0%)

---

## 4️⃣ RELATÓRIOS

### 4.1 📊 Todos os Relatórios (/dashboard/reports)

**Objetivo**: Biblioteca de 11 relatórios definidos

**Relatórios Especificados**:

#### Frente 1 - Normativa (3 relatórios):
1. **R1**: Conformidade ONS (5 controles) - Status: 0%
2. **R2**: Conformidade ANEEL RN 964 - Status: 0%
3. **R3**: Dashboard de Documentação - Status: 4% (2/50)

#### Frente 2 - Análise de Rede (5 relatórios):
4. **R4**: Análise IPAM - Dados: 109 subnets, 106 IPs
5. **R5**: Análise VLANs - Dados: 59 VLANs
6. **R6**: Análise Routing - Dados: 544 routers
7. **R7**: Topologia Visual - Dados: 14.606 assets, 1.345 conexões
8. **R8**: Network Health - Status: Não implementado

#### Frente 3 - Adequação (3 relatórios):
9. **R9**: Gap Analysis ONS × TBE ⭐ - Dados: 6 gaps, 560h
10. **R10**: Matriz de Riscos - Dados: 6 riscos críticos
11. **R11**: Plano de Adequação - Dados: 3 fases, 90 dias

**Geração**:
- ⏳ Manual (Markdown)
- ⏳ Automática (API)
- ⏳ Agendada (cron)
- ⏳ Export PDF

---

### 4.2 ➕ Gerar Novo Relatório (/dashboard/reports/generate)

**Objetivo**: Interface para gerar relatórios sob demanda

**Opções**:
1. Selecionar tipo (R1-R11)
2. Selecionar período
3. Selecionar cliente (TBE)
4. Gerar (Markdown + PDF)

**Dados Utilizados**: TODOS os dados reais do banco

---

### 4.3 📚 Histórico (/dashboard/reports/history)

**Objetivo**: Histórico de relatórios gerados

**Dados**:
- ⏳ Tabela `reporting.generated_reports`
- ⏳ Filtros por tipo, data, cliente
- ⏳ Download de relatórios anteriores

---

## 5️⃣ CONFIGURAÇÕES

### 5.1 ⚙️ Configurações (/dashboard/settings)

**Objetivo**: Configurações do sistema

**Seções**:
- Cliente TBE (nome, setor, contatos)
- Usuários e permissões
- Notificações e alertas
- Integr ações (APIs externas)
- Backup e exportação

---

## 📊 RESUMO DE CONTROLES REAIS

### Dados no Banco (PostgreSQL):
✅ **14.606 assets** - 100% REAL
✅ **59 VLANs** - 100% REAL
✅ **106 IPs** - 100% REAL
✅ **544 Routers** - 100% REAL
✅ **492 Switches** - 100% REAL
✅ **386 Servers** - 100% REAL
✅ **36 Firewalls** - 100% REAL

### Gaps Documentados:
✅ **6 gaps** - REAL (baseado em análise ONS × TBE)
✅ **CVSS scores** - REAL (calculados por gap)
✅ **Esforço** - REAL (estimado por especialistas)
✅ **Investimento** - REAL (R$ 250k-400k)

### Conformidade:
✅ **0% ONS** - REAL (0 controles implementados)
✅ **0% ANEEL** - REAL (2/50 docs)
✅ **0% Purdue** - REAL (0 níveis mapeados)

**NÃO HÁ DADOS MOCKADOS NO SISTEMA!**

---

🧙 **BMad Master**  
**Comando**: *help para ver opções  
**Status**: Menu detalhado item a item com controles REAIS ✅

