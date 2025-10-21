# 📊 Templates de Relatórios - ness. OT GRC

**Sistema**: ness. OT GRC  
**Arquiteto**: Winston  
**Baseado em**: Normativas ONS + Dados Reais TBE

---

## R9. GAP ANALYSIS ONS × TBE (Relatório Estrela ⭐)

### Metadados
**Código**: RPT-GAP-ONS-TBE  
**Cliente**: TBE  
**Período**: Mensal  
**Geração**: Automática (cruza requisitos + dados reais)

---

## CONTROLE 5 ONS: SEGMENTAÇÃO OT/IT (Detalhamento Completo)

### 📋 REQUISITO ONS

**Controle 5**: Segmentação de rede OT/IT  
**Base Legal**: ONS Rotina Operacional de Segurança Cibernética  
**Framework**: Modelo Purdue (ISA-95 / IEC 62443)  
**Obrigatoriedade**: MANDATÓRIA para infraestrutura crítica

**Especificação**:
```
1. Implementar 6 níveis Purdue (0 a 5)
2. Firewall entre cada nível
3. VLANs por zona de criticidade
4. Subnets dedicados por nível
5. Whitelist de conexões cross-zone
6. Monitoramento de tráfego entre zonas
7. Documentação de segmentação
```

**Compliance**: IEC 62443-3-2 (Security Levels)

---

### 📊 DADOS REAIS TBE (Inventário)

**Coletado em**: 2025-01-20  
**Fonte**: ativos_normalizados.csv + conexoes_origem_destino.csv

#### Dados Disponíveis

| Recurso | Quantidade | Status |
|---------|------------|--------|
| Ativos totais | 3.907 | ✅ Inventariado |
| Subnets | 109 | ✅ Identificados |
| VLANs | 59 | ✅ Identificadas |
| Conexões | 1.345 | ✅ Mapeadas |
| Routers | 249 | ✅ Identificados |
| Switches | 244 | ✅ Identificados |
| Firewalls | 9 | ✅ Identificados |
| Servers | 177 | ✅ Identificados |

#### Distribuição de Subnets (109 subnets)

**Por Classe**:
- Classe A (10.x.x.x): ~40 subnets
- Classe B (172.x.x.x): ~15 subnets  
- Classe C (192.x.x.x): ~30 subnets
- Point-to-Point (/30): ~20 subnets
- Públicos: ~4 subnets

**Taxa de Utilização**:
- IPs alocados: 951
- IPs disponíveis estimados: ~10.000
- Taxa média: ~9%

#### VLANs (59 VLANs)

**Por Faixa**:
| Faixa | Quantidade | Uso Esperado |
|-------|------------|--------------|
| 1-10 | 2 VLANs | Management/Native |
| 11-99 | 6 VLANs | Infrastructure |
| 100-999 | 48 VLANs | User/Data/Services |
| 1000+ | 3 VLANs | Extended |

**Status**: ❌ SEM classificação por criticidade  
**Status**: ❌ SEM mapeamento para zonas

---

### 🔍 GAP ANALYSIS DETALHADO

#### Gap 1: Modelo Purdue NÃO Implementado

**REQUISITO ONS**:
```
Nível 5 (Enterprise) ←─[Firewall]─→ Nível 4 (Business)
Nível 4 (Business)   ←─[Firewall]─→ Nível 3 (Operations)
Nível 3 (Operations) ←─[Firewall]─→ Nível 2 (Supervisory)
Nível 2 (Supervisory)←─[Firewall]─→ Nível 1 (Basic Control)
Nível 1 (Basic Ctrl) ←─[Firewall]─→ Nível 0 (Process)
```

**REALIDADE TBE**:
```
109 subnets SEM mapeamento Purdue
59 VLANs SEM classificação de nível
3.907 ativos SEM classificação Purdue
```

**GAP**: ❌ Modelo Purdue NÃO implementado  
**Status**: 🔴 0% de conformidade  
**CVSS**: 9.1 (CRITICAL)  
**Impacto**: 
- Facilita movimento lateral de atacantes
- Não conformidade total ONS Controle 5
- Falha em atender IEC 62443-3-2
- Risco para infraestrutura crítica nacional

---

#### Gap 2: Subnets Não Mapeados (109 subnets)

**Análise Necessária**:

Para CADA um dos 109 subnets:
1. Identificar que dispositivos estão no subnet
2. Classificar criticidade dos dispositivos
3. Atribuir nível Purdue ao subnet
4. Validar se subnet está na VLAN correta

**Exemplo de Mapeamento Esperado**:

```yaml
Subnet: 10.1.2.0/24
  IPs: 10.1.2.1-254
  VLAN: VLAN 100
  Dispositivos: [Server-SCADA-01, Server-SCADA-02, ...]
  Criticidade: CRITICAL
  Purdue Level: 3 (Operations & Control)
  Zona: OT-SCADA
  Firewall para zona superior: FW-03 (10.1.1.1)
  Firewall para zona inferior: FW-04 (10.1.3.1)
  ACL: permit tcp 10.2.x.x any eq 102 (SCADA port)
```

**Esforço Estimado**: 
- 80 horas (2 semanas)
- 109 subnets × ~45min/subnet

**Deliverable**: 
- `TBE-SUBNET-PURDUE-MAPPING.xlsx`
- Colunas: Subnet, VLAN, Devices, Criticality, Purdue Level, Zone

---

#### Gap 3: VLANs Não Classificadas (59 VLANs)

**Análise Necessária**:

Para CADA uma das 59 VLANs:
1. Listar subnets na VLAN
2. Listar dispositivos na VLAN
3. Determinar criticidade da VLAN
4. Atribuir zona de segurança
5. Mapear para nível Purdue

**Exemplo de Classificação Esperada**:

```yaml
VLAN: 100
  Name: SCADA-Operations
  Subnets: [10.1.2.0/24, 10.1.3.0/24]
  Devices: 45 devices (Servers, HMIs)
  Criticality: CRITICAL
  Purdue Level: 3 (Operations)
  Security Zone: OT-SCADA
  Allowed ingress: VLAN 95 (Supervisory)
  Allowed egress: VLAN 50 (Engineering)
  Trunk ports: [Switch-Core-01:Gi1/0/1, Switch-Core-02:Gi1/0/1]
```

**Esforço Estimado**: 
- 40 horas (1 semana)
- 59 VLANs × ~40min/VLAN

**Deliverable**: 
- `TBE-VLAN-CLASSIFICATION.xlsx`
- Colunas: VLAN ID, Name, Subnets, Devices, Criticality, Purdue Level, Zone

---

#### Gap 4: Conexões Cross-Zone Não Analisadas (1.345 conexões)

**REQUISITO ONS**:
- Whitelist de conexões entre zonas
- Justificativa para cada cross-zone connection
- Protocolo, porta, origem, destino documentados

**REALIDADE TBE**:
- 1.345 conexões mapeadas
- ❌ NÃO analisadas quanto a cross-zone
- ❌ NÃO documentadas
- ❌ NÃO justificadas

**Análise Necessária**:

Para CADA conexão:
1. Identificar zona origem
2. Identificar zona destino
3. Se cross-zone → classificar
4. Validar necessidade
5. Documentar protocolo/porta
6. Criar ACL entry

**Exemplo de Conexão Cross-Zone**:

```yaml
Connection: CONN-0542
  Source: Server-ERP-01 (10.5.1.10)
  Source Zone: IT-Enterprise (Nível 5)
  Destination: Server-MES-01 (10.3.1.10)
  Destination Zone: OT-Business (Nível 4)
  Protocol: HTTPS
  Port: 443
  Criticality: HIGH
  Cross-Zone: YES
  Justification: "ERP precisa buscar dados de produção do MES"
  Firewall: FW-IT-OT-01
  ACL: permit tcp host 10.5.1.10 host 10.3.1.10 eq 443
  Approved by: CISO + Plant Manager
  Review date: 2025-06-20
```

**Esforço Estimado**: 
- 60 horas (2 semanas)
- 1.345 conexões × ~2.5min/conexão (média)

**Deliverable**: 
- `TBE-CROSS-ZONE-CONNECTIONS.xlsx`
- Whitelist aprovada

---

#### Gap 5: Firewalls Insuficientes (9 firewalls vs. 5-6 mínimo)

**REQUISITO ONS**: 
Firewall entre cada nível Purdue = mínimo 5 firewalls

**REALIDADE TBE**:
- 9 firewalls identificados
- ❌ Localização desconhecida
- ❌ Função desconhecida (entre quais níveis?)
- ❌ Configuração não auditada

**Análise Necessária**:

1. **Inventariar 9 firewalls**:
   - Marca/modelo
   - Localização (física + lógica)
   - Interfaces e IPs
   - Zonas conectadas
   - Regras configuradas

2. **Gap Analysis**:
   - Firewall Nível 5↔4: [FW-ID] ou ❌ MISSING
   - Firewall Nível 4↔3: [FW-ID] ou ❌ MISSING
   - Firewall Nível 3↔2: [FW-ID] ou ❌ MISSING
   - Firewall Nível 2↔1: [FW-ID] ou ❌ MISSING
   - Firewall Nível 1↔0: [FW-ID] ou ❌ MISSING

3. **Sizing de Firewalls Necessários**:
   - Throughput requerido (Gbps)
   - Sessions simultâneas
   - IPS/IDS required?
   - VPN capability?

**Esforço Estimado**: 
- 40 horas (1 semana)
  - 10h: Inventariar 9 firewalls
  - 20h: Gap analysis
  - 10h: Sizing de novos firewalls

**Deliverable**: 
- `TBE-FIREWALL-INVENTORY.xlsx`
- `TBE-FIREWALL-GAP-ANALYSIS.md`
- `TBE-FIREWALL-REQUIREMENTS.md`

---

#### Gap 6: Documentação Ausente

**REQUISITO ONS**: Documentar segmentação

**REALIDADE TBE**:
❌ Diagrama de rede atualizado  
❌ Modelo Purdue documentado  
❌ Matriz de zonas de segurança  
❌ Whitelist de conexões  
❌ Procedimento de segmentação  
❌ Política de segmentação  

**Documentos Necessários**:

1. **POL-006**: Política de Segmentação de Rede
2. **PROC-006**: Procedimento de Segmentação
3. **ARCH-001**: Arquitetura de Rede (Purdue)
4. **DIAGRAM-001**: Diagrama de Segmentação
5. **MATRIX-001**: Matriz de Zonas de Segurança
6. **WHITELIST-001**: Conexões Cross-Zone Aprovadas

**Esforço**: 40 horas (1 semana)

---

### 📊 RESUMO DE GAPS - CONTROLE 5

| Gap ID | Descrição | Dado TBE | Requisito ONS | Conformidade | CVSS | Esforço |
|--------|-----------|----------|---------------|--------------|------|---------|
| GAP-SEG-001 | Modelo Purdue não implementado | 0/6 níveis | 6 níveis | 0% | 9.1 | 300h |
| GAP-SEG-002 | 109 subnets não mapeados | 0/109 | 109/109 | 0% | 8.5 | 80h |
| GAP-SEG-003 | 59 VLANs não classificadas | 0/59 | 59/59 | 0% | 7.8 | 40h |
| GAP-SEG-004 | 1.345 conexões não analisadas | 0/1345 | 1345/1345 | 0% | 8.2 | 60h |
| GAP-SEG-005 | Firewalls insuficientes | 9/[N] | [N]/[N] | ? | 9.0 | 40h |
| GAP-SEG-006 | Documentação ausente | 0/6 docs | 6/6 | 0% | 6.5 | 40h |

**TOTAL ESFORÇO**: 560 horas (14 semanas-pessoa) = **3,5 meses com 1 pessoa** ou **1,7 meses com 2 pessoas**

**RISCO AGREGADO**: 🔴 CRÍTICO (CVSS 9.1)

**STATUS GERAL CONTROLE 5**: 🔴 NÃO CONFORME (0%)

---

### 🎯 PLANO DE ADEQUAÇÃO - CONTROLE 5 (90 dias)

#### FASE 1: ASSESSMENT & MAPPING (Dias 1-30)

**Sprint 1 (Semanas 1-2)**:
- [ ] Mapear 109 subnets → Purdue Levels (80h)
  - Owner: Network Team Lead
  - Tool: Excel/Python script
  - Output: TBE-SUBNET-PURDUE-MAPPING.xlsx

- [ ] Classificar 59 VLANs → Security Zones (40h)
  - Owner: Network Team + Security
  - Tool: Excel
  - Output: TBE-VLAN-CLASSIFICATION.xlsx

**Sprint 2 (Semanas 3-4)**:
- [ ] Inventariar 9 firewalls (10h)
  - Owner: Network Engineer
  - Method: SSH + show run
  - Output: TBE-FIREWALL-INVENTORY.xlsx

- [ ] Analisar 1.345 conexões cross-zone (60h)
  - Owner: Security Analyst
  - Tool: Python script (analyze_connections.py)
  - Output: TBE-CROSS-ZONE-CONNECTIONS.xlsx

**Deliverables Fase 1**:
- ✅ 4 planilhas de mapping
- ✅ Gap analysis completo
- ✅ Modelo Purdue AS-IS documentado
- ✅ Identificação de firewalls necessários

---

#### FASE 2: DESIGN & SPECIFICATION (Dias 31-60)

**Sprint 3 (Semanas 5-6)**:
- [ ] Desenhar Modelo Purdue TO-BE (40h)
  - Owner: Network Architect (Winston)
  - Tool: Draw.io + Lucidchart
  - Output: Diagrama Purdue TO-BE

- [ ] Especificar firewalls adicionais (40h)
  - Owner: Security Architect
  - Vendor: [A definir - Palo Alto, Fortinet, Cisco?]
  - Sizing: Throughput, sessions, features
  - Output: TBE-FIREWALL-REQUIREMENTS.md

**Sprint 4 (Semanas 7-8)**:
- [ ] Redesign de VLANs críticas (60h)
  - Owner: Network Team
  - Method: Criar plano de migração
  - Output: TBE-VLAN-MIGRATION-PLAN.md

- [ ] Criar documentação (40h)
  - POL-006, PROC-006, ARCH-001, etc
  - Owner: CISO + Architect
  - Output: 6 documentos

**Deliverables Fase 2**:
- ✅ Modelo Purdue TO-BE
- ✅ Especificação de firewalls
- ✅ Plano de migração de VLANs
- ✅ 6 documentos de segmentação

---

#### FASE 3: IMPLEMENTAÇÃO (Dias 61-90)

**Sprint 5 (Semanas 9-10)**:
- [ ] Adquirir e instalar firewalls (80h + lead time)
  - Procurement: 30 dias
  - Instalação física: 2 dias
  - Configuração básica: 3 dias
  - Owner: Network Team + Vendor

**Sprint 6 (Semanas 11-12)**:
- [ ] Implementar segmentação Nível 4↔5 (IT↔OT) (60h)
  - Primeiro firewall: IT-OT boundary
  - Criticidade: MÁXIMA
  - Método: Change management rigoroso
  - Rollback plan: Obrigatório

- [ ] Migrar VLANs críticas (60h)
  - Janela de manutenção: OFF-PEAK
  - Testing: Obrigatório
  - Validação: Conectividade + performance

**Sprint 7 (Semanas 13)**:
- [ ] Validação e testes (40h)
  - Teste de conectividade
  - Teste de performance
  - Teste de failover
  - Penetration test básico

**Deliverables Fase 3**:
- ✅ Firewall IT↔OT implementado
- ✅ VLANs críticas migradas
- ✅ Conectividade validada
- ✅ Performance baseline estabelecida

**Conformidade ao final Fase 3**: 🟡 40% (IT↔OT segmentado)

---

### 📈 MÉTRICAS DE PROGRESSO

#### KPIs de Adequação

| Métrica | Baseline | Target | Status Atual |
|---------|----------|--------|--------------|
| Subnets mapeados Purdue | 0/109 | 109/109 | 0/109 (0%) |
| VLANs classificadas | 0/59 | 59/59 | 0/59 (0%) |
| Conexões analisadas | 0/1345 | 1345/1345 | 0/1345 (0%) |
| Firewalls implementados | 9/?? | [N]/[N] | 9/?? |
| Documentos aprovados | 0/6 | 6/6 | 0/6 (0%) |
| Conformidade Controle 5 | 0% | 100% | 0% |

#### Timeline

```
Semana:  1  2  3  4  5  6  7  8  9 10 11 12 13
         [---FASE 1---][---FASE 2---][---FASE 3---]
Mapping  ████████
Análise      ████████
Design               ████████
Docs                     ████████
Deploy                           ████████████
Test                                       ████
```

---

### 💰 INVESTIMENTO ESTIMADO

#### Recursos Humanos (560 horas)

| Função | Horas | Rate (R$/h) | Custo |
|--------|-------|-------------|-------|
| Network Architect | 120h | R$ 250 | R$ 30.000 |
| Network Engineer | 200h | R$ 180 | R$ 36.000 |
| Security Analyst | 120h | R$ 200 | R$ 24.000 |
| CISO | 40h | R$ 350 | R$ 14.000 |
| Documentação | 80h | R$ 150 | R$ 12.000 |
| **TOTAL RH** | 560h | - | **R$ 116.000** |

#### Hardware/Software

| Item | Qtd | Custo Unit | Custo Total |
|------|-----|------------|-------------|
| Firewall Next-Gen (mid-range) | [N-9] | R$ 80.000 | R$ [X] |
| Licenças firewall (3 anos) | [N-9] | R$ 30.000 | R$ [X] |
| Switches gerenciáveis (backup) | 5 | R$ 15.000 | R$ 75.000 |
| Consultoria externa (vendor) | 80h | R$ 300 | R$ 24.000 |
| **TOTAL HW/SW** | - | - | **R$ [X + 99.000]** |

#### TOTAL INVESTIMENTO

**Estimativa conservadora**: R$ 250.000 - R$ 400.000  
(Depende de quantos firewalls adicionais necessários)

---

### 🚨 RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Downtime durante migração | Média | Alto | Change management + rollback plan |
| Firewalls bloquearem tráfego legítimo | Alta | Crítico | Testing extensivo + rollback |
| Lead time de procurement > 30d | Alta | Médio | Iniciar procurement imediatamente |
| Falta de pessoal qualificado | Média | Alto | Contratar consultoria externa |
| Descoberta de mais gaps | Alta | Médio | Buffer de 20% no orçamento |

---

### ✅ CRITÉRIOS DE SUCESSO

Controle 5 será considerado CONFORME quando:

1. ✅ 6 níveis Purdue implementados e documentados
2. ✅ Firewalls entre cada nível operacionais
3. ✅ 109/109 subnets mapeados e documentados
4. ✅ 59/59 VLANs classificadas
5. ✅ 1.345/1.345 conexões analisadas
6. ✅ Whitelist de conexões cross-zone aprovada
7. ✅ 6 documentos de segmentação aprovados
8. ✅ Auditoria externa validar conformidade

**Meta**: 🟢 100% conformidade Controle 5 ONS em 180 dias

---

**Relatório**: RPT-GAP-ONS-TBE  
**Seção**: Controle 5 (Segmentação)  
**Status**: Gap Analysis Completo  
**Próximo**: Iniciar Fase 1 (Assessment)

