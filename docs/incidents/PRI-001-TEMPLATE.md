# PRI-001: Plano de Resposta a Incidentes Cibernéticos

**Status**: 🔴 TEMPLATE - CRÍTICO  
**Versão**: 0.1  
**Data**: 2025-01-20  
**Responsável**: CSIRT Lead (A designar)  
**Aprovação**: Conselho de Administração  
**Classificação**: SECRETO  
**Regulação**: ANEEL RN 964/2021 Art. 6º

---

## 1. INTRODUÇÃO

### 1.1 Objetivo
Estabelecer procedimentos estruturados para prevenção, detecção, resposta e recuperação de incidentes de segurança cibernética.

### 1.2 Escopo
Este plano aplica-se a todos incidentes cibernéticos que afetem:
- Sistemas de TI corporativos
- Sistemas de OT (SCADA, PLCs, RTUs)
- Redes de comunicação
- Dados e informações corporativas

---

## 2. ESTRUTURA DO CSIRT

### 2.1 Composição

#### CSIRT Lead
**Nome**: [A DESIGNAR]  
**Email**: [EMAIL]  
**Celular 24x7**: [TELEFONE]  
**Responsabilidades**:
- Coordenar resposta a incidentes
- Reportar à Diretoria
- Notificar ANEEL/ONS
- Conduzir RCA

#### CSIRT Members
| Nome | Papel | Especialidade | Contato 24x7 |
|------|-------|---------------|--------------|
| [NOME 1] | Analyst | Network/Firewall | [TEL] |
| [NOME 2] | Analyst | SCADA/OT | [TEL] |
| [NOME 3] | Analyst | Forensics | [TEL] |
| [NOME 4] | TI Lead | Infrastructure | [TEL] |

### 2.2 Escalação

```
Level 1: SOC Analyst → Detecção e triagem
    ↓ (se não resolver em 1h)
Level 2: CSIRT → Análise e contenção
    ↓ (se Nível 3+)
Level 3: CISO → Coordenação estratégica
    ↓ (se Nível 4-5)
Level 4: CEO + Conselho → Decisões críticas
    ↓ (se Nível 5)
Level 5: ANEEL/ONS/GSI → Notificação regulatória
```

---

## 3. CLASSIFICAÇÃO DE INCIDENTES

### Nível 1: Informativo
**Características**:
- Eventos de segurança sem impacto
- Tentativas bloqueadas
- Falsos positivos após análise

**Exemplos**:
- Port scanning bloqueado
- Login failures normais
- Antimalware bloqueou malware conhecido

**Ação**: Logging apenas, sem escalação

---

### Nível 2: Baixo
**Características**:
- Incidente contido localmente
- Sem impacto operacional
- Remediação simples

**Exemplos**:
- Malware em endpoint isolado
- Phishing identificado e contido
- Configuração incorreta sem exploração

**Ação**: CSIRT investiga, resolve internamente

---

### Nível 3: Médio
**Características**:
- Impacto limitado
- Requer contenção ativa
- Múltiplos sistemas podem estar envolvidos

**Exemplos**:
- Comprometimento de workstation
- Tentativa de lateral movement detectada
- Vulnerabilidade crítica explorada (sem sucesso)

**Ação**: CSIRT + CISO, contenção imediata

---

### Nível 4: Alto ⚠️ NOTIFICAÇÃO OBRIGATÓRIA 24H
**Características**:
- Impacto significativo
- Múltiplos sistemas afetados
- Potencial impacto em operação

**Exemplos**:
- Ransomware em sistemas corporativos
- Comprometimento de servidor crítico
- Tentativa de acesso a sistemas SCADA

**Ação**: 
1. CSIRT full activation
2. CISO + CEO notification
3. **ANEEL notification em 24h**
4. Contenção máxima

---

### Nível 5: Crítico 🔴 NOTIFICAÇÃO OBRIGATÓRIA 24H
**Características**:
- Impacto em operação do SIN
- Sistemas SCADA/OT comprometidos
- Risco a infraestrutura crítica nacional

**Exemplos**:
- Ataque bem-sucedido a sistemas SCADA
- Perda de controle operacional
- Exfiltração de dados críticos do SIN
- Impacto em fornecimento de energia

**Ação**:
1. CSIRT + CISO + CEO + Conselho
2. **ANEEL notification em 24h**
3. **ONS notification em 24h**
4. **GSI notification em 24h**
5. **CTIR Gov notification**
6. Ativação BCP/DRP
7. Comunicação externa coordenada

---

## 4. FASES DE RESPOSTA A INCIDENTES

### FASE 1: PREPARAÇÃO

#### 1.1 Antes do Incidente
- [ ] CSIRT constituído e treinado
- [ ] Ferramentas de resposta disponíveis
- [ ] Playbooks documentados
- [ ] Contatos atualizados
- [ ] Simulações executadas

#### 1.2 Ferramentas Necessárias
| Ferramenta | Propósito | Status |
|------------|-----------|--------|
| SIEM | Correlação de eventos | [STATUS] |
| IDS/IPS | Detecção de intrusões | [STATUS] |
| Forensics Kit | Análise forense | [STATUS] |
| Backup system | Restauração | [STATUS] |
| Comunicação segura | Canal CSIRT | [STATUS] |

---

### FASE 2: DETECÇÃO E ANÁLISE

#### 2.1 Detecção
**Fontes de Detecção**:
- [ ] SIEM alerts
- [ ] IDS/IPS alerts
- [ ] Antimalware alerts
- [ ] User reports
- [ ] Anomaly detection
- [ ] Vulnerability scanning

#### 2.2 Triagem Inicial
**SOC Analyst Actions** (15 minutos):
1. Validar alert (não é falso positivo?)
2. Classificação preliminar (Nível 1-5)
3. Documentar em ticket
4. Escalar se Nível 2+

#### 2.3 Análise Detalhada
**CSIRT Actions** (1 hora):
1. Confirmar incidente
2. Classificar severidade (1-5)
3. Identificar sistemas afetados
4. Avaliar escopo e impacto
5. Determinar vetor de ataque
6. Coletar evidências iniciais

**Outputs**:
- Incident Report ID: INC-YYYY-NNNN
- Classification: Level 1-5
- Affected systems: Lista
- Impact assessment: [DESCRIÇÃO]

---

### FASE 3: CONTENÇÃO

#### 3.1 Contenção de Curto Prazo (Imediata)
**Objetivo**: Limitar danos imediatos

**Actions**:
- [ ] Isolar sistemas afetados (network isolation)
- [ ] Bloquear IPs maliciosos
- [ ] Desabilitar contas comprometidas
- [ ] Preservar evidências
- [ ] Documentar ações tomadas

**OT Considerations**:
- ⚠️ NÃO desligar sistemas críticos sem aprovação Operação
- ⚠️ Coordenar com Centro de Operação
- ⚠️ Considerar impacto em processo físico

#### 3.2 Contenção de Longo Prazo
**Objetivo**: Correção temporária enquanto erradicação é preparada

**Actions**:
- [ ] Aplicar patches emergenciais
- [ ] Implementar regras de firewall
- [ ] Aumentar monitoramento
- [ ] Preparar sistemas de backup para failover

---

### FASE 4: ERRADICAÇÃO

#### 4.1 Remover Causa Raiz
**Actions**:
- [ ] Remover malware
- [ ] Eliminar backdoors
- [ ] Corrigir vulnerabilidades exploradas
- [ ] Resetar credenciais comprometidas
- [ ] Aplicar patches definitivos

#### 4.2 Validação
- [ ] Scanning pós-remediação
- [ ] Verificação de IOCs (Indicators of Compromise)
- [ ] Confirmar ausência de malware

---

### FASE 5: RECUPERAÇÃO

#### 5.1 Restauração de Sistemas
**Checklist**:
- [ ] Restaurar de backup limpo (se necessário)
- [ ] Validar integridade de sistemas
- [ ] Reconectar à rede gradualmente
- [ ] Monitoramento reforçado (48-72h)
- [ ] Retorno à operação normal

#### 5.2 Validação Operacional
- [ ] Testes funcionais
- [ ] Performance normal
- [ ] Sem indicadores de comprometimento
- [ ] Aprovação do Centro de Operação (OT)

---

### FASE 6: LIÇÕES APRENDIDAS

#### 6.1 Reunião Pós-Incidente
**Prazo**: 7 dias após resolução  
**Participantes**: CSIRT, CISO, áreas afetadas  

**Agenda**:
1. O que aconteceu?
2. O que funcionou bem?
3. O que poderia ser melhor?
4. Quais ações tomar?

#### 6.2 Documentação
**Outputs Obrigatórios**:
- [ ] INC-003: Análise de Causa Raiz (RCA)
- [ ] INC-004: Lições Aprendidas
- [ ] Atualização de playbooks
- [ ] Recomendações de melhoria

---

## 5. NOTIFICAÇÃO DE INCIDENTES

### 5.1 Notificações Internas

**Sempre Notificar**:
- CSIRT Lead (imediato)
- CISO (Nível 2+, em 30 min)
- CEO (Nível 4-5, em 1h)
- Conselho (Nível 5, em 4h)

### 5.2 Notificações Externas (conforme PRI-004)

#### Incidentes Nível 4-5: OBRIGATÓRIO

**Destinatários**:
1. **ANEEL**
   - Prazo: 24 horas
   - Meio: Portal ANEEL
   - Contato: [CONTATO ANEEL]

2. **ONS**
   - Prazo: 24 horas
   - Meio: [CANAL ONS]
   - Contato: [CONTATO ONS]

3. **GSI** (Gabinete de Segurança Institucional)
   - Prazo: 24 horas
   - Email: [EMAIL GSI]

4. **CTIR Gov**
   - Prazo: 24 horas
   - Email: atendimento@ctir.gov.br
   - Portal: https://www.ctir.gov.br

**Template de Notificação**:
```
Assunto: [CLASSIFICAÇÃO] Notificação de Incidente Cibernético - [EMPRESA]

1. Data/Hora do Incidente:
2. Classificação: Nível [4 ou 5]
3. Sistemas Afetados:
4. Impacto Operacional:
5. Ações de Contenção:
6. Status Atual:
7. Próximos Passos:
8. Contato: [CISO]
```

**Relatórios Subsequentes**:
- Preliminar: 72 horas
- Final: 30 dias

---

## 6. COMUNICAÇÃO

### 6.1 Comunicação Interna
- [ ] CSIRT usa canal seguro dedicado
- [ ] Updates de hora em hora (incidentes ativos)
- [ ] War room para incidentes Nível 4-5

### 6.2 Comunicação Externa
**Regra**: Apenas porta-voz designado

**Porta-vozes Autorizados**:
- CEO
- Diretor de Comunicação
- CISO (aspectos técnicos, com aprovação)

**Proibido**:
- Comunicação individual com imprensa
- Posts em redes sociais
- Especulação sobre causas

---

## 7. PLAYBOOKS ESPECÍFICOS

### 7.1 Ransomware (PRI-002)
[LINK PARA PLAYBOOK DETALHADO]

### 7.2 Data Breach (PRI-003)
[LINK PARA PLAYBOOK DETALHADO]

### 7.3 Ataque a SCADA
[CRIAR PLAYBOOK ESPECÍFICO]

### 7.4 DDoS
[CRIAR PLAYBOOK]

---

## 8. EVIDÊNCIAS E FORENSE

### 8.1 Coleta de Evidências
**Chain of Custody Obrigatória**

**O que coletar**:
- [ ] Memory dumps
- [ ] Disk images
- [ ] Network traffic captures (PCAPs)
- [ ] Log files
- [ ] System snapshots
- [ ] Screenshots

### 8.2 Ferramentas Forenses
- [ ] [LISTAR FERRAMENTAS]

---

## 9. EXERCÍCIOS E SIMULAÇÕES

### 9.1 Frequência
- Table-top exercises: Trimestral
- Simulação técnica: Semestral
- Full-scale exercise: Anual

### 9.2 Documentação
Todos exercícios devem ser documentados em TRAIN-003

---

## 10. MELHORIA CONTÍNUA

### 10.1 Revisão do PRI
**Triggers de Revisão**:
- Após cada incidente Nível 3+
- Mudanças regulatórias
- Mudanças na infraestrutura
- Resultados de simulações
- Revisão anual obrigatória

### 10.2 Atualização de Playbooks
Manter playbooks atualizados conforme:
- Novas ameaças identificadas
- Lições aprendidas
- Mudanças tecnológicas

---

## 11. CONTATOS DE EMERGÊNCIA

### 11.1 Internos
| Papel | Nome | Celular 24x7 | Email | Backup |
|-------|------|--------------|-------|--------|
| CSIRT Lead | [NOME] | [TEL] | [EMAIL] | [BACKUP] |
| CISO | [NOME] | [TEL] | [EMAIL] | [BACKUP] |
| CEO | [NOME] | [TEL] | [EMAIL] | [BACKUP] |
| TI Manager | [NOME] | [TEL] | [EMAIL] | [BACKUP] |
| Operação | [NOME] | [TEL] | [EMAIL] | [BACKUP] |

### 11.2 Externos
| Organização | Contato | Telefone | Email | Portal |
|-------------|---------|----------|-------|--------|
| ANEEL | [CONTATO] | [TEL] | [EMAIL] | [URL] |
| ONS | [CONTATO] | [TEL] | [EMAIL] | [URL] |
| GSI | [CONTATO] | [TEL] | [EMAIL] | [URL] |
| CTIR Gov | Atendimento | - | atendimento@ctir.gov.br | ctir.gov.br |
| Polícia Federal | [CONTATO] | [TEL] | [EMAIL] | - |

### 11.3 Vendors
| Vendor | Produto | Suporte 24x7 | Contato |
|--------|---------|--------------|---------|
| [VENDOR 1] | [PRODUTO] | [TEL] | [EMAIL] |
| [VENDOR 2] | [PRODUTO] | [TEL] | [EMAIL] |

---

## 12. APROVAÇÕES

| Papel | Nome | Assinatura | Data |
|-------|------|------------|------|
| Elaborado por | [CSIRT Lead] | | |
| Revisado por | [CISO] | | |
| Aprovado por | [Conselho] | | |

---

**⚠️ ESTE É UM TEMPLATE CRÍTICO**  
**PREENCHER URGENTEMENTE - OBRIGATÓRIO ANEEL RN 964/2021**

**Localização**: docs/incidents/PRI-001-plano-resposta-incidentes.md  
**Código DB**: PRI-001  
**Prioridade**: P0 (URGENTE)
