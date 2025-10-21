# 📋 Requisitos ONS para Redes OT - Setor Elétrico Brasileiro

## Sobre a ONS

**ONS** - Operador Nacional do Sistema Elétrico

A ONS é a entidade responsável pela coordenação e controle da operação das instalações de geração e transmissão de energia elétrica no Sistema Interligado Nacional (SIN) do Brasil.

---

## 🎯 Rotina Operacional de Segurança Cibernética ONS

### Ambiente Regulado Cibernético (ARCiber)

A ONS estabeleceu normas de adequação que definem **controles mínimos de segurança** para o ARCiber, aplicáveis aos:
- Centros de operação
- Equipamentos de infraestrutura crítica
- Sistemas de supervisão e controle em tempo real
- Redes de Tecnologia Operacional (OT)

---

## 🛡️ Controles Mínimos Obrigatórios ONS

### 1. Autenticação Multifator (MFA)
- ✅ **Obrigatório** para todos os acessos aos sistemas críticos
- Múltiplos fatores de autenticação
- Proteção contra acessos não autorizados
- **Criticidade**: ALTA

### 2. Atualizações de Software (Patches)
- ✅ **Obrigatório** aplicação periódica
- Correção de vulnerabilidades conhecidas
- Gestão de patches para sistemas legados
- Janelas de manutenção planejadas
- **Criticidade**: ALTA

### 3. Redes Privadas Virtuais (VPN)
- ✅ **Obrigatório** para conexões remotas
- Criptografia de dados em trânsito
- Acesso seguro aos sistemas OT
- Isolamento de tráfego crítico
- **Criticidade**: CRÍTICA

### 4. Soluções Antimalware
- ✅ **Obrigatório** em todos os sistemas
- Proteção contra malwares e ransomware
- Atualização automática de assinaturas
- Quarentena e resposta a incidentes
- **Criticidade**: ALTA

### 5. Segmentação de Rede
- ✅ **Obrigatório** isolamento OT/IT
- Segregação por zonas de segurança
- Firewall entre segmentos
- DMZ para sistemas de borda
- **Criticidade**: CRÍTICA

---

## 📊 Características Esperadas para Redes OT - Setor Elétrico

### 1. **Arquitetura de Rede**

#### Modelo Purdue (ISA-95)
```
Nível 5: Rede Corporativa (TI)
    │
    ├─ DMZ / Zona Intermediária
    │
Nível 3-4: Supervisão e Operação (SCADA/HMI)
    │
Nível 2: Controle de Processo (PLCs)
    │
Nível 1: Controle Básico (RTUs)
    │
Nível 0: Processo Físico (Sensores/Atuadores)
```

**Requisitos**:
- ✅ Segmentação clara entre níveis
- ✅ Controle de tráfego entre zonas
- ✅ Firewall industrial em cada transição
- ✅ Inspeção profunda de pacotes (DPI)

### 2. **Sistemas em Tempo Real**

**Características Críticas**:
- ⏱️ **Latência**: < 100ms para comandos críticos
- 🔄 **Disponibilidade**: 99.99% (four nines)
- 📡 **Confiabilidade**: Sistema redundante
- 🚨 **Tolerância a Falhas**: Failover automático

**Impacto em Segurança**:
- Patches devem ser testados em ambiente isolado
- Reinicializações programadas em janelas de manutenção
- Monitoramento não pode afetar performance

### 3. **Sistemas Legados**

**Desafios Comuns**:
- 🕰️ Windows XP/7 ainda em operação
- 🔓 Protocolos não criptografados (Modbus, DNP3)
- 📡 Equipamentos sem suporte de fabricante
- 🔧 Impossibilidade de patches em alguns sistemas

**Estratégias de Mitigação**:
- Segmentação rígida de sistemas legados
- Firewall com whitelist de comunicações
- Proxy de protocolo para inspeção
- Network monitoring passivo

---

## 📐 Padrões Internacionais Aplicáveis

### 1. IEC 62443 - Industrial Automation Security

**Série de normas para segurança OT**:

#### IEC 62443-1: Requisitos Gerais
- Terminologia e conceitos
- Modelos de segurança
- Métricas e conformidade

#### IEC 62443-2: Políticas e Procedimentos
- Programa de segurança cibernética
- Gestão de patches
- Controle de mudanças
- Resposta a incidentes

#### IEC 62443-3: Requisitos de Sistema
- Requisitos de segurança por Security Level (SL)
- SL1: Proteção contra uso casual indevido
- SL2: Proteção contra violação intencional
- SL3: Proteção contra ataques sofisticados
- SL4: Proteção contra ataques com recursos extensos

#### IEC 62443-4: Requisitos de Componentes
- Desenvolvimento seguro
- Ciclo de vida de segurança
- Hardening de componentes

**Aplicação na Rede TBE**:
- ✅ Classificar sistemas por Security Level (SL)
- ✅ Implementar controles por nível
- ✅ Documentar zonas e conduits
- ✅ Avaliar conformidade IEC 62443-3-3

### 2. NIST Cybersecurity Framework

**Funções Core**:

1. **IDENTIFY (Identificar)**
   - Inventário de ativos OT
   - Mapeamento de fluxos de dados
   - Classificação por criticidade
   - Identificação de riscos

2. **PROTECT (Proteger)**
   - Controle de acesso (RBAC)
   - Segmentação de rede
   - Proteção de dados
   - Treinamento de pessoal

3. **DETECT (Detectar)**
   - Monitoramento contínuo
   - Detecção de anomalias
   - IDS/IPS industrial
   - SIEM para correlação

4. **RESPOND (Responder)**
   - Plano de resposta a incidentes
   - Comunicação e coordenação
   - Análise forense
   - Mitigação e contenção

5. **RECOVER (Recuperar)**
   - Plano de continuidade
   - Backup e restauração
   - Lições aprendidas
   - Melhorias pós-incidente

### 3. NERC CIP (North American Reliability)

**Padrões Aplicáveis** (referência internacional):

- **CIP-002**: Categorização de sistemas críticos
- **CIP-003**: Políticas de segurança
- **CIP-004**: Treinamento de pessoal
- **CIP-005**: Perímetros de segurança eletrônica
- **CIP-006**: Segurança física
- **CIP-007**: Gestão de sistemas
- **CIP-008**: Resposta a incidentes
- **CIP-009**: Recuperação de desastres
- **CIP-010**: Gestão de mudanças
- **CIP-011**: Proteção de informações

---

## 🔍 Checklist de Conformidade ONS para Análise TBE

### Controles Obrigatórios
- [ ] MFA implementado em todos os acessos críticos
- [ ] Política de patches definida e aplicada
- [ ] VPN configurada para acessos remotos
- [ ] Antimalware instalado e atualizado
- [ ] Segmentação OT/IT implementada

### Arquitetura de Rede
- [ ] Modelo Purdue implementado
- [ ] Firewall entre cada nível
- [ ] DMZ para sistemas de borda
- [ ] Redundância de componentes críticos
- [ ] Isolamento de sistemas legados

### Protocolos e Comunicações
- [ ] Protocolos industriais identificados (Modbus, DNP3, OPC, etc)
- [ ] Criptografia em protocolos que suportam (TLS)
- [ ] Whitelist de comunicações definida
- [ ] Inspeção de tráfego OT implementada

### Monitoramento e Detecção
- [ ] IDS/IPS industrial implementado
- [ ] SIEM com regras para ambiente OT
- [ ] Monitoramento de anomalias de processo
- [ ] Log centralizado e correlacionado
- [ ] Alertas em tempo real configurados

### Gestão de Identidade e Acesso
- [ ] RBAC implementado
- [ ] Princípio de menor privilégio aplicado
- [ ] Contas de serviço gerenciadas
- [ ] Revisão periódica de acessos
- [ ] Auditoria de atividades privilegiadas

### Resposta a Incidentes
- [ ] Plano de resposta documentado
- [ ] Equipe de resposta treinada
- [ ] Procedimentos de escalação definidos
- [ ] Comunicação com ONS estabelecida
- [ ] Exercícios de simulação realizados

### Continuidade de Negócio
- [ ] Plano de continuidade operacional
- [ ] Backup de configurações críticas
- [ ] Procedimentos de recovery testados
- [ ] Redundância de sistemas críticos
- [ ] Failover automático configurado

---

## 🎯 Criticidade para Setor Elétrico

### Ativos Críticos (Prioridade MÁXIMA)
1. **Sistemas SCADA** - Supervisão e controle
2. **PLCs e RTUs** - Controle de processo
3. **Relés de Proteção** - Segurança elétrica
4. **Sistemas de Telemedição** - Medição em tempo real
5. **Comunicação Critical** - Links primários

### Impacto de Comprometimento
- ⚡ **Blackout** - Interrupção de fornecimento
- 💰 **Prejuízo Financeiro** - Multas regulatórias ONS/ANEEL
- 🏢 **Reputacional** - Perda de confiança
- ⚖️ **Legal** - Responsabilização civil/criminal
- 🌍 **Social** - Impacto em população

---

## 📚 Referências Normativas

### Normas ONS
- Submódulo 2.16 - Segurança Cibernética (se aplicável)
- Rotina Operacional de Segurança Cibernética
- Procedimentos de Rede - ONS

### Normas ANEEL
- Resolução Normativa nº 964/2021 (Segurança Cibernética)

### Normas Técnicas
- IEC 62443 - Industrial Automation and Control Systems Security
- ISO/IEC 27001:2022 - Information Security Management
- ISO/IEC 27019:2017 - Energy Utility Industry
- NIST SP 800-82 Rev 3 - Guide to OT Security

### Legislação Brasileira
- LGPD - Lei 13.709/2018
- Marco Civil da Internet - Lei 12.965/2014

---

## ✅ Próximos Passos para Análise TBE

1. **Classificar ativos por criticidade ONS**
2. **Mapear conformidade com controles obrigatórios**
3. **Avaliar Security Level IEC 62443**
4. **Identificar gaps de segmentação**
5. **Priorizar remediações por impacto operacional**
6. **Documentar não-conformidades**
7. **Criar roadmap de adequação**

---

**Documento de Referência**: ONS-REQ-001  
**Versão**: 1.0  
**Data**: 2025-01-20  
**Classificação**: Restrito - Setor Elétrico  
**Aplicável a**: Rede TBE Supervisão
