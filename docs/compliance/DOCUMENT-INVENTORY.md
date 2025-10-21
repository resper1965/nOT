# 📚 Inventário de Documentação Obrigatória - ness. OT GRC

## ANEEL RN 964/2021 + ONS + IEC 62443

**Total de Documentos Obrigatórios**: 39  
**Total de Documentos Recomendados**: 11  
**Total Geral**: 50 documentos

---

## 📊 Status Geral de Conformidade

| Categoria | Total | Criados | Missing | % Completo |
|-----------|-------|---------|---------|------------|
| **POL** - Políticas | 6 | 0 | 6 | 0% |
| **PROC** - Procedimentos | 6 | 0 | 6 | 0% |
| **PRI** - Planos Resposta | 4 | 0 | 4 | 0% |
| **BCP** - Continuidade | 3 | 0 | 3 | 0% |
| **TRAIN** - Treinamentos | 4 | 0 | 4 | 0% |
| **RISK** - Análise Risco | 3 | 0 | 3 | 0% |
| **AUD** - Auditorias | 4 | 0 | 4 | 0% |
| **INC** - Incidentes | 4 | 0 | 4 | 0% |
| **EVID** - Evidências | 5 | 2 | 3 | 40% |
| **TOTAL** | **39** | **2** | **37** | **5%** |

---

## 📋 CATEGORIA POL - Políticas (6 documentos)

### POL-001: Política de Segurança Cibernética ⭐ CRÍTICO
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 3º)  
**Frequência**: Anual  
**Responsável**: CISO  
**Aprovação**: Conselho de Administração  
**Retenção**: 10 anos  
**Esforço Estimado**: 80 horas  

**Descrição**: Política corporativa master de segurança cibernética

**Conteúdo Obrigatório**:
- Escopo e objetivos
- Princípios de segurança
- Papéis e responsabilidades
- Classificação de dados
- Controles técnicos
- Gestão de incidentes
- Treinamento e conscientização
- Métricas e indicadores
- Revisão e atualização

**Localização**: `docs/policies/POL-001-politica-seguranca-cibernetica.md`

---

### POL-002: Política de Classificação de Dados
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 4º)  
**Frequência**: Anual  
**Responsável**: CISO  
**Aprovação**: Diretoria  
**Retenção**: 10 anos  
**Esforço Estimado**: 40 horas  

**Descrição**: Critérios e procedimentos para classificação de dados

**Níveis de Classificação**:
1. Público
2. Interno
3. Confidencial
4. Secreto
5. Ultrassecreto

**Localização**: `docs/policies/POL-002-classificacao-dados.md`

---

### POL-003: Política de Controle de Acesso
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 + ONS)  
**Frequência**: Anual  
**Responsável**: CISO  
**Aprovação**: Diretoria  
**Retenção**: 10 anos  
**Esforço Estimado**: 32 horas  

**Conteúdo**:
- Autenticação (MFA obrigatório)
- Autorização (RBAC)
- Gestão de identidades
- Contas privilegiadas
- Revisão de acessos

**Localização**: `docs/policies/POL-003-controle-acesso.md`

---

### POL-004: Política de Uso Aceitável
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: CISO  
**Aprovação**: Diretoria  
**Retenção**: 10 anos  
**Esforço Estimado**: 24 horas  

**Localização**: `docs/policies/POL-004-uso-aceitavel.md`

---

### POL-005: Política de Gestão de Patches
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ONS Rotina Operacional)  
**Frequência**: Semestral  
**Responsável**: TI Manager  
**Aprovação**: CISO  
**Retenção**: 5 anos  
**Esforço Estimado**: 24 horas  

**Conteúdo**:
- Cronograma de patches
- Testes em ambiente isolado
- Janelas de manutenção
- Rollback procedures
- Patches para sistemas legados

**Localização**: `docs/policies/POL-005-gestao-patches.md`

---

### POL-006: Política de Backup e Recuperação
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: TI Manager  
**Aprovação**: CISO  
**Retenção**: 10 anos  
**Esforço Estimado**: 32 horas  

**Localização**: `docs/policies/POL-006-backup-recuperacao.md`

---

## 📋 CATEGORIA PROC - Procedimentos (6 documentos)

### PROC-001: Procedimento de Gestão de Vulnerabilidades
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 + IEC 62443)  
**Frequência**: Anual  
**Responsável**: Security Team  
**Aprovação**: CISO  
**Esforço Estimado**: 40 horas  

**Localização**: `docs/procedures/PROC-001-gestao-vulnerabilidades.md`

---

### PROC-002: Procedimento de Controle de Mudanças
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ONS + ANEEL)  
**Frequência**: Anual  
**Responsável**: Change Manager  
**Aprovação**: Diretoria Operacional  
**Esforço Estimado**: 32 horas  

**Localização**: `docs/procedures/PROC-002-controle-mudancas.md`

---

### PROC-003: Procedimento de Hardening de Sistemas
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (IEC 62443 + CIS Benchmarks)  
**Frequência**: Anual  
**Responsável**: Security Team  
**Aprovação**: CISO  
**Esforço Estimado**: 48 horas  

**Conteúdo**:
- Windows Server hardening
- Linux hardening
- Network device hardening
- SCADA/HMI hardening
- CIS Benchmarks aplicáveis

**Localização**: `docs/procedures/PROC-003-hardening-sistemas.md`

---

### PROC-004: Procedimento de Gestão de Logs
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 5º)  
**Frequência**: Anual  
**Responsável**: SOC Team  
**Aprovação**: CISO  
**Esforço Estimado**: 32 horas  

**Localização**: `docs/procedures/PROC-004-gestao-logs.md`

---

### PROC-005: Procedimento de Segmentação de Rede
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ONS + IEC 62443)  
**Frequência**: Anual  
**Responsável**: Network Team  
**Aprovação**: CISO  
**Esforço Estimado**: 48 horas  

**Conteúdo**:
- Modelo Purdue implementation
- VLANs por zona
- Firewall rules
- DMZ configuration

**Localização**: `docs/procedures/PROC-005-segmentacao-rede.md`

---

### PROC-006: Procedimento de Acesso Remoto
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ONS Rotina Operacional)  
**Frequência**: Anual  
**Responsável**: Network Team  
**Aprovação**: CISO  
**Esforço Estimado**: 24 horas  

**Localização**: `docs/procedures/PROC-006-acesso-remoto.md`

---

## 📋 CATEGORIA PRI - Planos de Resposta a Incidentes (4 documentos)

### PRI-001: Plano de Resposta a Incidentes Cibernéticos ⭐ CRÍTICO
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 6º)  
**Frequência**: Anual  
**Responsável**: CSIRT Lead  
**Aprovação**: Conselho de Administração  
**Retenção**: 10 anos  
**Esforço Estimado**: 80 horas  

**Fases do PRI**:
1. Preparação
2. Detecção e Análise
3. Contenção
4. Erradicação
5. Recuperação
6. Lições Aprendidas

**Localização**: `docs/incidents/PRI-001-plano-resposta-incidentes.md`

---

### PRI-002: Playbook de Resposta a Ransomware
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: CSIRT Lead  
**Aprovação**: CISO  
**Esforço Estimado**: 32 horas  

**Localização**: `docs/incidents/PRI-002-playbook-ransomware.md`

---

### PRI-003: Playbook de Resposta a Vazamento de Dados
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (LGPD + ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: CSIRT Lead + DPO  
**Aprovação**: CISO  
**Esforço Estimado**: 32 horas  

**Localização**: `docs/incidents/PRI-003-playbook-vazamento-dados.md`

---

### PRI-004: Procedimento de Notificação de Incidentes
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 7º)  
**Frequência**: Anual  
**Responsável**: CSIRT Lead  
**Aprovação**: CISO  
**Retenção**: 10 anos  
**Esforço Estimado**: 16 horas  

**Destinatários**:
- ANEEL (24h para incidentes críticos)
- ONS (conforme severidade)
- GSI (Gabinete de Segurança Institucional)
- CTIR Gov (Centro de Tratamento de Incidentes)

**Localização**: `docs/incidents/PRI-004-notificacao-incidentes.md`

---

## 📋 CATEGORIA BCP - Continuidade e DR (3 documentos)

### BCP-001: Plano de Continuidade de Negócios ⭐ CRÍTICO
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: BCM Manager  
**Aprovação**: Conselho de Administração  
**Retenção**: 10 anos  
**Esforço Estimado**: 120 horas  

**Localização**: `docs/compliance/BCP-001-plano-continuidade-negocios.md`

---

### BCP-002: Plano de Recuperação de Desastres (DRP)
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: TI Manager  
**Aprovação**: Diretoria  
**Retenção**: 10 anos  
**Esforço Estimado**: 80 horas  

**Localização**: `docs/compliance/BCP-002-plano-recuperacao-desastres.md`

---

### BCP-003: Análise de Impacto no Negócio (BIA)
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Semestral  
**Responsável**: BCM Manager  
**Aprovação**: Diretoria  
**Retenção**: 5 anos  
**Esforço Estimado**: 60 horas  

**Localização**: `docs/compliance/BCP-003-analise-impacto-negocios.md`

---

## 📋 CATEGORIA TRAIN - Treinamentos (4 documentos)

### TRAIN-001: Programa de Conscientização em Segurança
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 8º)  
**Frequência**: Anual  
**Responsável**: CISO  
**Aprovação**: Diretoria RH  
**Esforço Estimado**: 60 horas  

**Localização**: `docs/training/TRAIN-001-programa-conscientizacao.md`

---

### TRAIN-002: Treinamento Técnico OT Security
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL + IEC 62443)  
**Frequência**: Semestral  
**Responsável**: Security Team Lead  
**Aprovação**: CISO  
**Esforço Estimado**: 80 horas  

**Localização**: `docs/training/TRAIN-002-treinamento-tecnico-ot.md`

---

### TRAIN-003: Simulação de Resposta a Incidentes
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Trimestral  
**Responsável**: CSIRT Lead  
**Aprovação**: CISO  
**Esforço Estimado**: 16 horas por simulação  

**Localização**: `docs/training/TRAIN-003-simulacao-incidentes.md`

---

### TRAIN-004: Evidências de Treinamento
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Contínua  
**Responsável**: RH/Training  
**Aprovação**: CISO  
**Esforço Estimado**: Contínuo  

**Conteúdo**:
- Registros de participação
- Avaliações de conhecimento
- Certificados emitidos
- Taxa de conclusão
- Resultados de simulações

**Localização**: `docs/training/TRAIN-004-evidencias-treinamento.md`

---

## 📋 CATEGORIA RISK - Análise de Risco (3 documentos)

### RISK-001: Análise de Risco de Segurança Cibernética ⭐ CRÍTICO
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: Risk Manager  
**Aprovação**: Diretoria  
**Retenção**: 5 anos  
**Esforço Estimado**: 120 horas  

**Metodologia**: ISO 27005 + NIST SP 800-30

**Localização**: `docs/compliance/RISK-001-analise-risco-cibernetico.md`

---

### RISK-002: Registro de Riscos (Risk Register)
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Contínua  
**Responsável**: Risk Manager  
**Aprovação**: CISO  
**Esforço Estimado**: Contínuo  

**Localização**: `docs/compliance/RISK-002-registro-riscos.md`

---

### RISK-003: Plano de Tratamento de Riscos
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: Risk Manager  
**Aprovação**: Diretoria  
**Esforço Estimado**: 60 horas  

**Estratégias**: Mitigar, Aceitar, Transferir, Evitar

**Localização**: `docs/compliance/RISK-003-plano-tratamento-riscos.md`

---

## 📋 CATEGORIA AUD - Auditorias (4 documentos)

### AUD-001: Plano Anual de Auditoria
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: Audit Manager  
**Aprovação**: Conselho de Administração  
**Esforço Estimado**: 40 horas  

**Localização**: `docs/audits/AUD-001-plano-anual-auditoria.md`

---

### AUD-002: Relatórios de Auditoria Interna
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Contínua  
**Responsável**: Audit Team  
**Aprovação**: Audit Manager  
**Esforço Estimado**: 40 horas por auditoria  

**Localização**: `docs/audits/AUD-002-relatorios-auditoria-interna.md`

---

### AUD-003: Relatórios de Auditoria Externa
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Anual  
**Responsável**: External Auditor  
**Aprovação**: Conselho de Administração  
**Esforço Estimado**: N/A (terceirizado)  

**Localização**: `docs/audits/AUD-003-relatorios-auditoria-externa.md`

---

### AUD-004: Plano de Ações Corretivas
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Contínua  
**Responsável**: Process Owner  
**Aprovação**: CISO  
**Esforço Estimado**: Contínuo  

**Localização**: `docs/audits/AUD-004-acoes-corretivas.md`

---

## 📋 CATEGORIA INC - Incidentes (4 documentos)

### INC-001: Relatórios de Incidentes Cibernéticos
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 7º)  
**Frequência**: Contínua  
**Responsável**: CSIRT  
**Aprovação**: CISO  
**Retenção**: 10 anos  
**Esforço Estimado**: 8-40 horas por incidente  

**Localização**: `docs/incidents/INC-001-relatorios-incidentes.md`

---

### INC-002: Notificações à ANEEL
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 7º)  
**Frequência**: Conforme necessário  
**Responsável**: CISO  
**Aprovação**: CEO  
**Retenção**: 10 anos  
**Prazo**: 24 horas (incidentes críticos)  

**Localização**: `docs/incidents/INC-002-notificacoes-aneel.md`

---

### INC-003: Análise de Causa Raiz (RCA)
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Por incidente significativo  
**Responsável**: CSIRT Lead  
**Aprovação**: CISO  
**Esforço Estimado**: 40-80 horas por RCA  

**Localização**: `docs/incidents/INC-003-analise-causa-raiz.md`

---

### INC-004: Lições Aprendidas
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Por incidente  
**Responsável**: CSIRT Lead  
**Aprovação**: CISO  
**Esforço Estimado**: 8 horas por documento  

**Localização**: `docs/incidents/INC-004-licoes-aprendidas.md`

---

## 📋 CATEGORIA EVID - Evidências (5 documentos)

### EVID-001: Inventário de Ativos
**Status**: 🟡 **DRAFT** (análise preliminar completa)  
**Obrigatório**: Sim (ANEEL RN 964/2021 + ONS)  
**Frequência**: Contínua  
**Responsável**: Asset Manager  
**Aprovação**: CISO  
**Esforço Estimado**: 200 horas (inicial) + contínuo  

**Status Atual**: Análise preliminar com 31 tipos de dispositivos identificados

**Localização**: `docs/evidence/EVID-001-inventario-ativos.md`

---

### EVID-002: Relatórios de Varredura de Vulnerabilidades
**Status**: 🟡 **PARTIAL** (estrutura criada, sem execução)  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Mensal  
**Responsável**: Security Team  
**Aprovação**: CISO  
**Esforço Estimado**: 16 horas/mês  

**Localização**: `docs/evidence/EVID-002-varredura-vulnerabilidades.md`

---

### EVID-003: Logs de Controle de Acesso
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021 Art. 5º)  
**Frequência**: Contínua  
**Responsável**: SOC Team  
**Aprovação**: CISO  
**Retenção**: 5 anos  

**Localização**: `docs/evidence/EVID-003-logs-controle-acesso.md`

---

### EVID-004: Evidências de Patches Aplicados
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ONS + ANEEL)  
**Frequência**: Contínua  
**Responsável**: TI Team  
**Aprovação**: TI Manager  
**Retenção**: 3 anos  

**Localização**: `docs/evidence/EVID-004-patches-aplicados.md`

---

### EVID-005: Testes de Backup e Restauração
**Status**: 🔴 **MISSING**  
**Obrigatório**: Sim (ANEEL RN 964/2021)  
**Frequência**: Trimestral  
**Responsável**: TI Team  
**Aprovação**: TI Manager  
**Retenção**: 5 anos  

**Localização**: `docs/evidence/EVID-005-testes-backup.md`

---

## 🎯 Priorização de Criação de Documentos

### Prioridade P0 - URGENTE (Criar Esta Semana)

1. **POL-001**: Política de Segurança Cibernética (80h)
2. **PRI-001**: Plano de Resposta a Incidentes (80h)
3. **EVID-001**: Inventário de Ativos (200h - em andamento)
4. **BCP-001**: Plano de Continuidade (120h)

**Total P0**: 480 horas (12 semanas-pessoa)

### Prioridade P1 - ALTA (Criar em 30 dias)

5. **POL-002**: Classificação de Dados (40h)
6. **POL-003**: Controle de Acesso (32h)
7. **PROC-005**: Segmentação de Rede (48h)
8. **PRI-004**: Notificação de Incidentes (16h)
9. **RISK-001**: Análise de Risco (120h)

**Total P1**: 256 horas (6 semanas-pessoa)

### Prioridade P2 - MÉDIA (Criar em 90 dias)

10-20. Demais procedimentos e políticas

**Total P2**: 400 horas (10 semanas-pessoa)

### Prioridade P3 - BAIXA (Criar em 180 dias)

21-39. Documentos de suporte e evidências contínuas

---

## 📊 Esforço Total Estimado

**Total de Horas**: ~2.000 horas  
**Equivalente**: 50 semanas de trabalho de 1 pessoa  
**Ou**: 12 semanas com equipe de 4 pessoas  
**Ou**: 6 meses com equipe dedicada de 2 pessoas

---

## ✅ Templates Disponíveis

Todos os templates estão disponíveis em:
- `docs/bmad-templates/security-assessment-tmpl.yaml`
- `docs/bmad-templates/vulnerability-report-tmpl.yaml`
- `docs/bmad-templates/threat-model-tmpl.yaml`
- `docs/bmad-templates/compliance-report-tmpl.yaml`

---

## 🔄 Workflow de Criação de Documentos

```
1. DRAFT
   ↓ (Responsável cria documento)
2. UNDER_REVIEW
   ↓ (Revisão por pares)
3. PENDING_APPROVAL
   ↓ (Aprovador designado revisa)
4. APPROVED
   ↓ (Documento aprovado)
5. PUBLISHED
   ↓ (Documento em vigor)
6. [Ciclo de revisão conforme frequência]
7. EXPIRED (se não revisado)
   ↓
   Volta para UNDER_REVIEW
```

---

## 📅 Cronograma de Revisões

### Revisões Anuais
- Todas as políticas (POL-*)
- Planos de resposta (PRI-*)
- Plano de continuidade (BCP-001/002)
- Análise de risco (RISK-001)

### Revisões Semestrais
- Política de patches (POL-005)
- Treinamento técnico (TRAIN-002)
- BIA (BCP-003)

### Revisões Trimestrais
- Simulações (TRAIN-003)
- Testes de backup (EVID-005)

### Revisões Mensais
- Varredura de vulnerabilidades (EVID-002)

### Contínuo
- Inventário de ativos (EVID-001)
- Risk register (RISK-002)
- Logs e evidências (EVID-003/004)
- Treinamentos (TRAIN-004)
- Incidentes (INC-*)
- Auditorias (AUD-002/004)

---

**Documento**: DOC-INV-001  
**Versão**: 1.0  
**Data**: 2025-01-20  
**Próxima Revisão**: 2025-04-20  
**Responsável**: ness. OT GRC Team  
**Classificação**: Interno
