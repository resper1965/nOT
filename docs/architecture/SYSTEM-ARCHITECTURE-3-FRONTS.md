# ness. OT GRC - Arquitetura das 3 Frentes

**Sistema**: ness. OT GRC  
**Arquiteto**: Winston  
**Data**: 2025-01-20  
**Cliente Piloto**: TBE (3.907 ativos, 109 subnets, 59 VLANs)

---

## 🎯 As 3 Frentes do Sistema

### ✅ FRENTE 1: NORMATIVA (Compliance)
Gestão de 50 documentos obrigatórios + conformidade regulatória

### 🌐 FRENTE 2: ANÁLISE DE REDE (Network Intelligence)
Análise profunda: IP, routing, topology, VLANs, performance

### 🔧 FRENTE 3: ADEQUAÇÃO (Gap Analysis & Remediation)
Cruzamento: Requisitos ONS × Realidade da Rede → Plano de Ação

**Os dados TBE são DADOS INGERIDOS (cliente), não parte integral do sistema**

---

## 📊 Modelo de Dados Multi-Tenant

```sql
-- Cliente (multi-tenancy)
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    client_name VARCHAR(255),
    client_code VARCHAR(50) UNIQUE,
    industry VARCHAR(100),
    created_at TIMESTAMP
);

-- TBE como primeiro cliente
INSERT INTO clients VALUES (
    uuid_generate_v4(),
    'TBE - Transmissora Brasileira de Energia',
    'TBE',
    'Setor Elétrico',
    NOW()
);

-- Todas as tabelas têm client_id
ALTER TABLE security.assets ADD COLUMN client_id UUID REFERENCES clients(id);
ALTER TABLE topology.ip_addresses ADD COLUMN client_id UUID;
-- etc...
```

**Dados TBE**:
- 3.907 ativos → `security.assets WHERE client_id='TBE'`
- 109 subnets → `topology.ip_subnets WHERE client_id='TBE'`
- 59 VLANs → `topology.vlans WHERE client_id='TBE'`

---

## 📋 Relatórios Definidos (11 Relatórios)

### FRENTE 1: Normativa (3 Relatórios)

#### R1. Relatório de Conformidade ONS
- 5 controles mínimos vs. rede TBE
- Status por controle
- Evidências
- Gap analysis

#### R2. Relatório ANEEL RN 964/2021
- 7 pilares de conformidade
- Documentos: 2/50 (4%)
- Ações prioritárias

#### R3. Dashboard de Documentação
- 50 docs: status tracking
- Alertas de revisão
- Workflow de aprovação

---

### FRENTE 2: Análise de Rede (5 Relatórios)

#### R4. Análise de Endereçamento IP (IPAM)
**Dados**: 109 subnets, 951 IPs

**Conteúdo**:
- Mapa completo de subnets
- Utilização por subnet
- Conflitos de IP
- IPs não utilizados
- Capacity planning

#### R5. Análise de VLANs
**Dados**: 59 VLANs

**Conteúdo**:
- Inventário completo
- VLAN → Subnet mapping
- VLAN → Zona mapping
- Trunk analysis
- Otimizações

#### R6. Análise de Roteamento
**Dados**: 249 routers, 1.345 conexões

**Conteúdo**:
- Protocolos de roteamento
- Tabelas de roteamento
- Trace de paths críticos
- Redundância
- Otimizações

#### R7. Topologia Visual (Mapas)
**Dados**: 3.907 ativos, 1.345 conexões

**Visões**:
- Física (dispositivos + links)
- Layer 2 (VLANs + switches)
- Layer 3 (subnets + routing)
- Segurança (zonas + firewalls)
- Purdue (6 níveis)

#### R8. Network Health Dashboard
**Dados**: Tempo real

**Métricas**:
- IP utilization
- VLAN health
- Routing health
- Performance
- Uptime

---

### FRENTE 3: Adequação (3 Relatórios)

#### R9. Gap Analysis ONS × TBE
**Cruza**: Requisitos ONS + Dados TBE

**Estrutura**:
```
Controle 5 ONS: Segmentação OT/IT

REQUISITO:
  • Modelo Purdue implementado
  • Firewalls entre níveis
  • VLANs por criticidade
  
REALIDADE TBE:
  • 109 subnets SEM mapeamento Purdue
  • 59 VLANs SEM classificação
  • 9 firewalls (vs. mínimo 6 para Purdue)
  • 1.345 conexões não analisadas
  
GAP:
  • Modelo Purdue: NÃO IMPLEMENTADO
  • Segmentação: INSUFICIENTE
  • Documentação: AUSENTE
  
RISCO: CRÍTICO (CVSS 9.1)

AÇÕES:
  1. Mapear 109 subnets → Purdue (80h)
  2. Classificar 59 VLANs (40h)
  3. Analisar 1.345 conexões cross-zone (60h)
  4. Especificar 6+ firewalls adicionais (40h)
  5. Criar plano de segmentação (80h)
```

#### R10. Matriz de Riscos de Rede
**Cruza**: Vulnerabilidades + Topologia + Conformidade

#### R11. Plano de Adequação Priorizado
**Cruza**: Gaps + Riscos → Roadmap

**Fases**:
- Fase 1 (0-30d): Quick wins
- Fase 2 (30-90d): Críticos
- Fase 3 (90-180d): Adequação completa

---

## 📂 Estrutura de Pastas para Relatórios

```
docs/
├── reports/                    # Relatórios gerados
│   ├── compliance/             # Frente 1
│   │   ├── RPT-ONS-2025-01.md
│   │   ├── RPT-ANEEL-2025-01.md
│   │   └── RPT-DOCS-STATUS.md
│   │
│   ├── network/                # Frente 2
│   │   ├── RPT-IPAM-2025-01.md
│   │   ├── RPT-VLAN-2025-01.md
│   │   ├── RPT-ROUTING-2025-01.md
│   │   ├── RPT-TOPOLOGY-MAP.md
│   │   └── RPT-HEALTH-DASHBOARD.json
│   │
│   └── remediation/            # Frente 3
│       ├── RPT-GAP-ANALYSIS-2025-01.md
│       ├── RPT-RISK-MATRIX-2025-01.md
│       └── RPT-ACTION-PLAN-2025-01.md
│
└── clients/                    # Dados por cliente
    └── tbe/
        ├── assets/             # Cópia dos assets ingeridos
        ├── analysis/           # Análises específicas TBE
        └── reports/            # Relatórios específicos TBE
```

---

**Status**: Arquitetura definida  
**Próximo**: Implementar geração de relatórios automáticos
