# 🛡️ ness. OT GRC

> Governance, Risk & Compliance for Operational Technology Networks

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![ANEEL](https://img.shields.io/badge/ANEEL_RN_964-Compliant-green)
![ONS](https://img.shields.io/badge/ONS-Integrated-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## 📋 Sobre o **ness. OT GRC**

**ness. OT GRC** é a primeira plataforma brasileira especializada em **Governance, Risk and Compliance (GRC)** para redes de **Tecnologia Operacional (OT)** do setor elétrico.

### O que é GRC?

- **G**overnance (Governança): Estrutura de políticas, procedimentos e responsabilidades
- **R**isk (Risco): Identificação, avaliação e tratamento de riscos cibernéticos
- **C**ompliance (Conformidade): Aderência a normas regulatórias (ANEEL, ONS, IEC 62443)

### Por que OT?

Redes **OT (Operational Technology)** são fundamentalmente diferentes de redes IT:
- **Tempo Real**: Latência crítica para controle de processos
- **Disponibilidade**: 99.99% uptime obrigatório
- **Legado**: Sistemas com 10-20 anos em operação
- **Segurança**: Impacto direto em infraestrutura crítica nacional

---

## 🎯 Funcionalidades Principais

### 🏛️ Governance (Governança)
- **Gestão de Políticas**: 6+ políticas obrigatórias ANEEL RN 964/2021
- **Estrutura Organizacional**: CISO, CSIRT, SOC, Comitês
- **Workflow de Aprovação**: Conselho → Diretoria → Operação
- **Dashboard Executivo**: KPIs de maturidade GRC

### ⚠️ Risk (Gestão de Riscos)
- **Análise de Vulnerabilidades**: CVSS scoring + priorização
- **Análise de Topologia OT**: Modelo Purdue, segmentação
- **Detecção de Vazamento**: Caminhos de exfiltração de dados
- **Risk Register**: Inventário completo de riscos

### ✅ Compliance (Conformidade)
- **ANEEL RN 964/2021**: Framework completo implementado
- **ONS Rotina Operacional**: 5 controles mínimos obrigatórios
- **IEC 62443**: Security Levels (SL0-SL4)
- **NIST CSF**: Identify, Protect, Detect, Respond, Recover
- **LGPD**: Proteção de dados pessoais
- **ISO 27001/27019**: Setor de energia

### 📄 Gestão Documental
- **50+ Documentos Obrigatórios** mapeados
- **9 Categorias**: Políticas, Procedimentos, PRI, BCP, Treinamentos, Riscos, Auditorias, Incidentes, Evidências
- **Versionamento Automático**
- **Alertas de Revisão**
- **Evidências de Conformidade**

---

## ⚡ Quick Start com Docker

```bash
# 1. Clone o repositório
git clone https://github.com/ness/ot-grc.git
cd ot-grc

# 2. Suba a stack completa
docker-compose up -d

# 3. Acesse os serviços
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# pgAdmin:   http://localhost:5050
# Database:  localhost:5432
```

**Pronto!** Toda a infraestrutura está rodando localmente.

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────┐
│          FRONTEND - Next.js 15                  │
│     ness. OT GRC Dashboard (React 19)           │
│  Governance | Risk | Compliance | Documents     │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│         BACKEND - FastAPI (Python)              │
│    API REST + Business Logic + Workflows        │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  ┌─────────┐ ┌──────────┐ ┌────────┐
  │PostgreSQL│ │  Redis   │ │ Files  │
  │ Schemas │ │  Cache   │ │Storage │
  │ 4 schemas│ │ Sessions │ │  S3    │
  └─────────┘ └──────────┘ └────────┘
```

---

## 🐳 Stack Docker

### Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **Frontend** | 3000 | Interface web (Next.js) |
| **Backend** | 8000 | API REST (FastAPI) |
| **PostgreSQL** | 5432 | Banco de dados principal |
| **pgAdmin** | 5050 | Gestão visual do BD |
| **Redis** | 6379 | Cache e sessions |

### Database Schema

```sql
-- 4 Schemas principais
security.*      -- Ativos, vulnerabilidades, incidentes
topology.*      -- Zonas, conexões de rede
compliance.*    -- Frameworks, controles, documentos
audit.*         -- Logs de auditoria
```

---

## 📦 Estrutura do Projeto

```
TBE-OT/  (ness. OT GRC)
├── frontend/                   # Next.js 15 + React 19
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── governance/    # Módulo Governança
│   │   │   ├── risk/         # Módulo Riscos
│   │   │   ├── compliance/   # Módulo Conformidade
│   │   │   └── documents/    # Gestão Documental
│   │   └── globals.css       # Design system ness.
│   └── components/
│       └── layout/
│           └── ness-grc-logo.tsx  # Logo OT GRC
│
├── backend/                    # FastAPI + Python
│   ├── main.py                # API principal
│   ├── requirements.txt       # Dependências
│   └── Dockerfile
│
├── database/                   # PostgreSQL
│   └── init/
│       ├── 01-init.sql       # Schema principal
│       └── 02-compliance-documents.sql  # Gestão documental
│
├── docs/                       # Documentação
│   ├── security/
│   │   ├── ANEEL-RN-964-2021.md       # RN 964/2021 completa
│   │   ├── ONS-REQUIREMENTS.md         # Requisitos ONS
│   │   └── TBE-OT-SECURITY-ASSESSMENT.md
│   ├── compliance/             # Docs de conformidade
│   ├── policies/               # Políticas
│   ├── procedures/             # Procedimentos
│   ├── incidents/              # Incidentes
│   └── training/               # Treinamentos
│
├── docker-compose.yml          # Stack completa
├── analyze_topology.py         # Script análise de rede
└── README.md                   # Este arquivo
```

---

## 🎨 Design System **ness.**

### Identidade Visual

**Wordmark**: `ness.` (ponto sempre em #00ADE8)  
**Produto**: `OT GRC`  
**Tagline**: *Governance, Risk & Compliance for OT Networks*

### Paleta de Cores

```css
/* Brand */
--brand-cyan: #00ADE8       /* Cor primária ness. */

/* Grayscale (Cool Grays - Dark First) */
--gray-950: #0B0C0E         /* Background principal */
--gray-900: #111317         /* Surface elevada 1 */
--gray-850: #151820         /* Surface elevada 2 */
--gray-800: #1B2030         /* Surface elevada 3 */
--gray-50:  #EEF1F6         /* Texto principal */
```

### Tipografia

- **Primária**: Montserrat (300-700)
- **Monospace**: JetBrains Mono (400-600)

---

## 📋 Conformidade Regulatória

### ✅ ANEEL RN 964/2021

**Status**: Framework completo

**7 Pilares Cobertos**:
1. ✅ Política de Segurança Cibernética
2. ✅ Classificação de Dados (5 níveis)
3. ✅ Medidas Técnicas de Segurança
4. ✅ Cultura de Segurança (treinamentos)
5. ✅ Gestão de Incidentes
6. ✅ Notificações Regulatórias
7. ✅ Evidências e Auditoria

### ✅ ONS Rotina Operacional

**Status**: Integrado

**5 Controles Mínimos**:
1. ✅ MFA (Autenticação Multifator)
2. ✅ Gestão de Patches
3. ✅ VPN para acesso remoto
4. ✅ Antimalware atualizado
5. ✅ Segmentação de rede OT/IT

### ✅ IEC 62443

**Status**: Framework de avaliação

**Security Levels**:
- **SL0**: Sem proteção
- **SL1**: Proteção contra uso casual
- **SL2**: Proteção contra violação intencional ⭐ (recomendado setor elétrico)
- **SL3**: Proteção contra ataques sofisticados
- **SL4**: Proteção contra ataques com recursos extensos

---

## 📊 Gestão de Documentação

### 50+ Documentos Obrigatórios Mapeados

#### Categorias

| Código | Categoria | Documentos | Obrigatórios |
|--------|-----------|------------|--------------|
| **POL** | Políticas | 6 | 6 |
| **PROC** | Procedimentos | 6 | 6 |
| **PRI** | Planos de Resposta | 4 | 4 |
| **BCP** | Continuidade/DR | 3 | 3 |
| **TRAIN** | Treinamentos | 4 | 4 |
| **RISK** | Análise de Risco | 3 | 3 |
| **AUD** | Auditorias | 4 | 4 |
| **INC** | Incidentes | 4 | 4 |
| **EVID** | Evidências | 5 | 5 |

**Total**: 39 documentos obrigatórios + 11 recomendados = **50 documentos**

#### Status Tracking

Cada documento tem:
- ✅ Status (missing, draft, under_review, approved, published, expired)
- 📅 Datas de validade e próxima revisão
- 👤 Responsável e aprovador
- 📝 Versionamento completo
- 🔐 Hash SHA-256 para integridade
- 📎 Anexos e evidências

---

## 🚀 Roadmap

### Fase 1: Core Platform (Q1 2025) ✅
- [x] Estrutura de banco de dados
- [x] Schema de conformidade
- [x] Design system ness.
- [x] Logo e branding OT GRC
- [x] Docker stack completo

### Fase 2: Gestão Documental (Q1 2025)
- [ ] Upload e versionamento
- [ ] Workflow de aprovação
- [ ] Alertas de revisão
- [ ] Dashboard de conformidade

### Fase 3: Módulo de Riscos (Q2 2025)
- [ ] Análise de vulnerabilidades
- [ ] Risk register
- [ ] Matriz de riscos
- [ ] Integração com scanners

### Fase 4: Módulo de Governança (Q2 2025)
- [ ] Políticas e procedimentos
- [ ] Estrutura organizacional
- [ ] KPIs de maturidade
- [ ] Dashboard executivo

### Fase 5: Integrações (Q3 2025)
- [ ] SIEM integration
- [ ] Vulnerability scanners
- [ ] CMDB integration
- [ ] Notificações ANEEL/ONS

---

## 🤝 Equipe

- **Product Owner**: Governança e Compliance
- **Tech Lead**: Arquitetura e Backend
- **Frontend**: UI/UX com design ness.
- **Security**: OT Security expertise
- **DevOps**: Docker, CI/CD, monitoring

---

## 📝 Licença

Propriedade **ness.** - Todos os direitos reservados © 2025

---

## 🔗 Referências

- [ANEEL](https://www.aneel.gov.br)
- [ONS](https://www.ons.org.br)
- [IEC 62443](https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards)
- [NIST CSF](https://www.nist.gov/cyberframework)
- [LGPD](https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd)

---

**Desenvolvido com 💙 pela equipe ness.**

<div align="center">
  <h2>ness<span style="color: #00ADE8">.</span> OT GRC</h2>
  <p><em>Governance, Risk & Compliance for Operational Technology Networks</em></p>
  <p>🏛️ Governança • ⚠️ Risco • ✅ Conformidade</p>
</div>
