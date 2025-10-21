# ness. OT GRC - Brownfield Architecture Document

> **Governance, Risk & Compliance Platform for Operational Technology Networks**

**Document Type**: Brownfield Architecture (Current State)  
**Version**: 1.0  
**Date**: 2025-01-20  
**Status**: Living Document  
**Classification**: CONFIDENCIAL - Interno

---

## 📋 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-20 | 1.0 | Initial brownfield documentation | BMad Master |

---

## 🎯 Executive Summary

### Project Overview

**ness. OT GRC** é uma plataforma GRC (Governance, Risk & Compliance) especializada para redes de Tecnologia Operacional (OT) do setor elétrico brasileiro.

**Nome do Produto**: ness. OT GRC  
**Tagline**: Governance, Risk & Compliance for Operational Technology Networks  
**Setor**: Energia Elétrica (Infraestrutura Crítica Nacional)  
**Regulação**: ANEEL RN 964/2021 + ONS  

### Project Purpose

Gerenciar conformidade regulatória e segurança cibernética de redes OT através de:

1. **Governance**: Gestão de 50+ documentos obrigatórios (políticas, procedimentos, planos)
2. **Risk**: Análise de vulnerabilidades, ameaças e riscos cibernéticos  
3. **Compliance**: Conformidade com ANEEL RN 964/2021, ONS, IEC 62443, NIST CSF, LGPD

### Current Project State

**Status**: 🟡 Desenvolvimento Inicial (Fase 1)  
**Início**: 2025-01-20  
**Componentes Criados**: Backend schema, Frontend base, Documentação regulatória  
**Componentes Pendentes**: UI completo, Integração, Features GRC  

---

## 🏗️ High-Level Architecture

### System Architecture (Current State)

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Next.js 15 Frontend (React 19 + TypeScript)   │    │
│  │  • Governance Dashboard                         │    │
│  │  • Risk Management UI                           │    │
│  │  • Compliance Tracking                          │    │
│  │  • Document Management                          │    │
│  │  • Port: 3000                                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└───────────────────────┬──────────────────────────────────┘
                        │ REST API
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  FastAPI Backend (Python 3.11)                  │    │
│  │  • REST API endpoints                           │    │
│  │  • Business logic                               │    │
│  │  • Workflows de aprovação                       │    │
│  │  • Port: 8000                                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└───────────────────────┬──────────────────────────────────┘
                        │ SQL Queries
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                             │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │   Redis      │  │ File Storage │  │
│  │   16         │  │     7        │  │   (Local)    │  │
│  │              │  │              │  │              │  │
│  │ • security   │  │ • Cache      │  │ • Documents  │  │
│  │ • topology   │  │ • Sessions   │  │ • Evidence   │  │
│  │ • compliance │  │              │  │ • Uploads    │  │
│  │ • audit      │  │              │  │              │  │
│  │              │  │              │  │              │  │
│  │ Port: 5432   │  │ Port: 6379   │  │ Volume mount │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Deployment Architecture (Current State)

**Status**: 🐳 Docker Compose Local  
**Ambiente**: Desenvolvimento (Docker Desktop)  
**Produção**: Não configurado ainda  

```yaml
Services:
  • frontend       (ness-ot-grc-frontend)   :3000
  • backend        (ness-ot-grc-backend)    :8000
  • postgres       (ness-ot-grc-db)         :5432
  • pgadmin        (ness-ot-grc-pgadmin)    :5050
  • redis          (ness-ot-grc-redis)      :6379

Networks:
  • ness_ot_grc_network (bridge)

Volumes:
  • ness_ot_grc_postgres_data
  • ness_ot_grc_pgadmin_data
  • ness_ot_grc_redis_data
```

---

## 📦 Tech Stack Details

### Frontend Stack

| Category | Technology | Version | Purpose | Notes |
|----------|-----------|---------|---------|-------|
| **Framework** | Next.js | 15.1.0 | React framework | App Router (não Pages Router) |
| **Runtime** | React | 19.0.0 | UI library | Versão mais recente |
| **Language** | TypeScript | 5.3.3 | Type safety | Strict mode enabled |
| **Styling** | Tailwind CSS | 4.0.0 | Utility-first CSS | ness. design system |
| **UI Components** | Shadcn/ui | Latest | Component library | Radix UI primitives |
| **Icons** | Lucide React | 0.344.0 | Icon library | Monocolor, stroke 1.5 |
| **Forms** | React Hook Form | 7.50.1 | Form management | + Zod validation |
| **Validation** | Zod | 3.22.4 | Schema validation | |
| **Tables** | Tanstack Table | Latest | Data tables | Para listas de documentos |
| **State** | Zustand | 4.5.0 | State management | Leve e simples |
| **URL State** | Nuqs | 1.17.1 | URL state manager | Type-safe |
| **Charts** | Recharts | 2.12.0 | Data visualization | Gráficos de compliance |

**Package Manager**: pnpm (≥8.0.0)  
**Node Version**: ≥20.0.0  

**Estrutura Atual**:
```
frontend/
├── app/
│   ├── layout.tsx          ✅ Root layout (fonts, metadata)
│   ├── page.tsx            ✅ Landing page
│   └── globals.css         ✅ Design system ness.
├── components/
│   ├── ui/
│   │   └── button.tsx      ✅ Button component
│   └── layout/
│       ├── ness-logo.tsx   ✅ Logo original (deprecated)
│       └── ness-grc-logo.tsx ✅ Logo OT GRC (novo)
├── lib/
│   └── utils.ts            ✅ Utility functions
├── features/               📁 Estrutura criada (vazio)
├── styles/                 📁 Estrutura criada (vazio)
├── types/                  📁 Estrutura criada (vazio)
├── package.json            ✅ Configurado
├── tailwind.config.ts      ✅ Paleta ness. completa
├── tsconfig.json           ✅ Path aliases @/*
├── next.config.ts          ✅ Configuração Next.js
├── Dockerfile.dev          ✅ Container dev
├── .env.example            ✅ Template
├── .env.local              ✅ Config local
├── README.md               ✅ Documentação
└── IMPLEMENTATION-GUIDE.md ✅ Guia de implementação
```

**Status de Implementação Frontend**: ~20% (base criada, features pendentes)

### Backend Stack

| Category | Technology | Version | Purpose | Notes |
|----------|-----------|---------|---------|-------|
| **Framework** | FastAPI | 0.109.0 | API REST | Async support |
| **Server** | Uvicorn | 0.27.0 | ASGI server | Com reload |
| **Language** | Python | 3.11 | Backend language | |
| **Database** | PostgreSQL | 16 | Primary DB | Alpine image |
| **ORM** | SQLAlchemy | 2.0.25 | Database ORM | Async support |
| **Migrations** | Alembic | 1.13.1 | DB migrations | Não iniciado ainda |
| **Cache** | Redis | 7 | Cache/Sessions | Alpine image |
| **Validation** | Pydantic | 2.5.3 | Data validation | Settings v2 |
| **Auth** | python-jose | 3.3.0 | JWT tokens | Não implementado |

**Estrutura Atual**:
```
backend/
├── main.py                 ✅ API principal (básico)
├── requirements.txt        ✅ Dependências
├── Dockerfile              ✅ Container
└── [MISSING]
    ├── models/             ❌ SQLAlchemy models
    ├── routes/             ❌ API endpoints
    ├── services/           ❌ Business logic
    ├── schemas/            ❌ Pydantic schemas
    └── core/               ❌ Config, auth, db
```

**Status de Implementação Backend**: ~10% (skeleton criado, implementação pendente)

### Database Stack

| Component | Technology | Version | Purpose | Status |
|-----------|-----------|---------|---------|--------|
| **RDBMS** | PostgreSQL | 16 | Primary database | ✅ Schema criado |
| **Management** | pgAdmin | 4 Latest | Visual admin | ✅ Configurado |
| **Schemas** | 4 schemas | - | Data organization | ✅ Definido |

**Database Schemas**:
```sql
1. security.*       -- Ativos, vulnerabilidades, incidentes, vazamentos
   • assets (dispositivos de rede)
   • vulnerabilities (CVEs, CVSS)
   • incidents (incidentes cibernéticos)
   • data_leakage_paths (caminhos de exfiltração)

2. topology.*       -- Topologia de rede OT
   • network_zones (zonas de segurança)
   • network_connections (conectividade)

3. compliance.*     -- GRC e documentação regulatória
   • frameworks (ANEEL, ONS, IEC 62443, etc)
   • controls (controles de segurança)
   • assessments (avaliações de conformidade)
   • control_results (resultados)
   • document_categories (9 categorias)
   • required_documents (50 docs obrigatórios)
   • document_status (tracking de docs)
   • document_versions (versionamento)
   • document_approvals (workflow)
   • document_review_schedule (agendamento)

4. audit.*          -- Auditoria e rastreabilidade
   • activity_log (log de auditoria)
```

**Views Criadas**:
- `security.dashboard_summary` - KPIs de segurança
- `security.vulnerability_summary_by_asset` - Vulns por ativo
- `compliance.status_overview` - Status de compliance
- `compliance.compliance_dashboard` - Dashboard compliance
- `compliance.missing_documents` - Docs faltantes
- `compliance.documents_needing_review` - Docs precisando revisão
- `compliance.compliance_by_regulation` - Compliance por norma

**Status**: ✅ 100% (schema completo e funcional)

---

## 📂 Project Structure (Detailed)

### Complete Directory Tree

```
TBE-OT/  (ness. OT GRC)
│
├── assets/                          # Dados de entrada
│   ├── Topologia_TBE_full.json     ✅ 13.280 objetos (1GB+)
│   ├── Topologia_TBE_extracted_xml.zip
│   └── Topologia Geral da rede de supervisão TBE.vsdx
│
├── backend/                         # FastAPI Backend
│   ├── main.py                      ✅ API básica (3 endpoints)
│   ├── requirements.txt             ✅ 20 dependências
│   ├── Dockerfile                   ✅ Python 3.11-slim
│   └── [TODO] Estrutura completa MVC
│
├── database/                        # PostgreSQL Init Scripts
│   └── init/
│       ├── 01-init.sql              ✅ Schema principal (300+ linhas)
│       └── 02-compliance-documents.sql ✅ GRC schema (500+ linhas)
│
├── frontend/                        # Next.js 15 Frontend
│   ├── app/
│   │   ├── layout.tsx               ✅ Root layout
│   │   ├── page.tsx                 ✅ Landing page
│   │   ├── globals.css              ✅ Design system (200+ linhas)
│   │   └── (dashboard)/             ❌ TODO
│   │       ├── governance/
│   │       ├── risk/
│   │       ├── compliance/
│   │       └── documents/
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx           ✅ Component base
│   │   └── layout/
│   │       ├── ness-logo.tsx        🟡 Deprecated
│   │       └── ness-grc-logo.tsx    ✅ Logo oficial
│   ├── features/                    📁 Estrutura (vazio)
│   ├── lib/
│   │   └── utils.ts                 ✅ Utils
│   ├── package.json                 ✅ Configurado
│   ├── tailwind.config.ts           ✅ ness. design system
│   ├── tsconfig.json                ✅ TS config
│   ├── next.config.ts               ✅ Next config
│   ├── Dockerfile.dev               ✅ Container dev
│   └── .env.local                   ✅ Config local
│
├── docs/                            # Documentação do Projeto
│   ├── security/                    # Análise de Segurança
│   │   ├── README.md                ✅ Guia do projeto
│   │   ├── PROJECT-INDEX.md         ✅ Índice completo
│   │   ├── ONS-REQUIREMENTS.md      ✅ Requisitos ONS (310 linhas)
│   │   ├── ANEEL-RN-964-2021.md     ✅ RN 964/2021 detalhada
│   │   ├── TBE-OT-SECURITY-ASSESSMENT.md ✅ Avaliação crítica
│   │   └── topology-analysis-preliminary.md ✅ Análise inicial
│   │
│   ├── compliance/                  # Docs de Conformidade
│   │   └── DOCUMENT-INVENTORY.md    ✅ 50 docs mapeados
│   │
│   ├── policies/                    📁 Estrutura (vazio) - 6 docs pendentes
│   ├── procedures/                  📁 Estrutura (vazio) - 6 docs pendentes
│   ├── incidents/                   📁 Estrutura (vazio) - 4 docs pendentes
│   ├── training/                    📁 Estrutura (vazio) - 4 docs pendentes
│   ├── audits/                      📁 Estrutura (vazio) - 4 docs pendentes
│   ├── evidence/                    📁 Estrutura (vazio) - 5 docs pendentes
│   │
│   ├── bmad-agents/                 # BMAD Agents
│   │   └── network-security-analyst.md ✅ SecOps Agent
│   │
│   ├── bmad-workflows/              # BMAD Workflows
│   │   └── network-vulnerability-analysis.yaml ✅ 11 etapas
│   │
│   ├── bmad-tasks/                  # BMAD Tasks
│   │   ├── analyze-network-topology.md ✅
│   │   ├── detect-data-leakage.md      ✅
│   │   ├── scan-vulnerabilities.md     ✅
│   │   └── assess-compliance.md        ✅
│   │
│   ├── bmad-templates/              # BMAD Templates
│   │   ├── security-assessment-tmpl.yaml   ✅
│   │   ├── vulnerability-report-tmpl.yaml  ✅
│   │   └── threat-model-tmpl.yaml          ✅
│   │
│   ├── PROJETO-SEGURANCA-TBE.md     ✅ Sumário executivo
│   └── BROWNFIELD-ARCHITECTURE.md   ✅ Este documento
│
├── bmad/                            # BMAD Core (Original)
│   └── .bmad-core/
│       ├── agents/                  # Agentes padrão BMAD
│       ├── workflows/               # Workflows padrão
│       ├── tasks/                   # Tasks padrão
│       └── core-config.yaml         ✅
│
├── analyze_topology.py              ✅ Script Python análise
├── docker-compose.yml               ✅ Stack completa
├── README.md                        ✅ README principal
└── PROJECT-COMPLETE-OVERVIEW.md     ✅ Overview geral
```

**Total de Arquivos Criados**: 40+  
**Total de Linhas de Código**: ~8.000  
**Total de Documentação**: ~15.000 palavras  

---

## 🎨 Design System ness. (Implementation Details)

### Brand Identity

**Wordmark**:
```tsx
ness<span className="text-[#00ADE8]">.</span> OT GRC
```

**Componentes de Logo**:
1. `NessGRCLogo` - Logo completo com ícone Shield
2. `NessGRCWordmark` - Apenas texto
3. `GRCBadge` - Badge para UI

**Uso**:
```tsx
import { NessGRCLogo, NessGRCWordmark, GRCBadge } from '@/components/layout/ness-grc-logo';

// Full logo
<NessGRCLogo size="md" variant="full" showIcon={true} />

// Compact
<NessGRCWordmark size="lg" />

// Badge
<GRCBadge />
```

### Color Palette (Implementation)

**CSS Variables** (`globals.css`):
```css
:root {
  /* ness. brand */
  --brand-cyan: #00ADE8;
  --brand-cyan-dark: #0090C4;
  --brand-cyan-light: #33BDEF;
  
  /* Grayscale - Cool Grays */
  --gray-950: #0B0C0E;  /* Main background */
  --gray-900: #111317;  /* Surface 1 */
  --gray-850: #151820;  /* Surface 2 */
  --gray-800: #1B2030;  /* Surface 3 */
  --gray-50:  #EEF1F6;  /* Text */
  
  /* Shadcn/ui HSL variants */
  --background: 222 15% 5%;      /* #0B0C0E */
  --foreground: 223 33% 95%;     /* #EEF1F6 */
  --primary: 195 100% 46%;       /* #00ADE8 */
  --card: 222 13% 8%;            /* #111317 */
  /* ... outros ... */
}
```

**Tailwind Classes**:
```tsx
className="bg-gray-950"          // Background
className="surface-1"            // Elevated surface (#111317)
className="text-brand-cyan"      // Brand color
className="text-gradient-ness"   // Gradient effect
```

### Typography

**Fonts Loaded**:
```tsx
// app/layout.tsx
const montserrat = Montserrat({ weights: [300,400,500,600,700] })
const jetbrainsMono = JetBrains_Mono({ weights: [400,500,600] })

// CSS Variables
--font-montserrat: 'Montserrat', sans-serif
--font-jetbrains-mono: 'JetBrains Mono', monospace
```

**Usage**:
```tsx
className="font-sans"   // Montserrat
className="font-mono"   // JetBrains Mono
```

### Animations & Transitions

**Timing Function**: `cubic-bezier(0.2, 0.8, 0.2, 1)`  
**Durations**:
- Fast: 120ms
- Normal: 180ms
- Slow: 240ms

**Classes**:
```tsx
className="transition-ness"       // 180ms
className="transition-ness-fast"  // 120ms
className="transition-ness-slow"  // 240ms
className="animate-fade-in"       // Fade in animation
```

### Accessibility

**Standards**: WCAG AA  
**Focus States**: Ring 2px cyan com offset  

```css
.focus-ness {
  @apply focus-visible:outline-none 
         focus-visible:ring-2 
         focus-visible:ring-brand-cyan 
         focus-visible:ring-offset-2 
         focus-visible:ring-offset-background;
}
```

**Icons**: Sempre stroke 1.5, monocromáticos

```tsx
<Icon className="icon-ness" /> // Aplica stroke-[1.5]
```

---

## 🗄️ Database Schema (Detailed)

### Schema: `security`

#### Table: `assets`
**Purpose**: Inventário de ativos de rede (dispositivos OT/IT)

**Columns**:
```sql
id                UUID PRIMARY KEY
asset_name        VARCHAR(255) NOT NULL
asset_type        VARCHAR(100) NOT NULL      -- Router, Switch, SCADA, etc
ip_address        INET
mac_address       MACADDR
location          VARCHAR(255)
criticality       VARCHAR(20)                -- critical|high|medium|low
status            VARCHAR(20) DEFAULT 'active'
metadata          JSONB                      -- Dados flexíveis
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

**Indexes**:
- `idx_assets_type` ON asset_type
- `idx_assets_criticality` ON criticality
- `idx_assets_status` ON status

**Trigger**: `update_updated_at_column()` - Atualiza timestamp automaticamente

---

#### Table: `vulnerabilities`
**Purpose**: Registro de vulnerabilidades identificadas

**Columns**:
```sql
id                UUID PRIMARY KEY
asset_id          UUID REFERENCES assets(id)
cve_id            VARCHAR(50)                -- CVE-2023-XXXXX
title             VARCHAR(500) NOT NULL
description       TEXT
severity          VARCHAR(20)                -- critical|high|medium|low
cvss_score        DECIMAL(3,1)              -- 0.0 a 10.0
cvss_vector       VARCHAR(100)              -- CVSS:3.1/AV:N/AC:L...
exploit_available BOOLEAN DEFAULT false
status            VARCHAR(20) DEFAULT 'open' -- open|in_progress|resolved|accepted|false_positive
discovered_at     TIMESTAMP
resolved_at       TIMESTAMP
remediation_notes TEXT
metadata          JSONB
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

**Indexes**: severity, status, cve_id, asset_id

---

#### Table: `incidents`
**Purpose**: Incidentes de segurança cibernética (ANEEL RN 964/2021 Art. 7º)

**Columns**:
```sql
id                UUID PRIMARY KEY
title             VARCHAR(500) NOT NULL
description       TEXT
severity          VARCHAR(20)                -- Níveis 1-5
status            VARCHAR(20) DEFAULT 'open'
affected_assets   UUID[]                     -- Array de asset IDs
incident_type     VARCHAR(100)               -- ransomware, data_breach, etc
detected_at       TIMESTAMP
resolved_at       TIMESTAMP
resolution_notes  TEXT
metadata          JSONB
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

**Uso**: Registro obrigatório conforme ANEEL. Notificação em 24h para incidentes Nível 4-5.

---

#### Table: `data_leakage_paths`
**Purpose**: Caminhos de exfiltração de dados identificados

**Columns**:
```sql
id                UUID PRIMARY KEY
source_asset_id   UUID REFERENCES assets(id)
destination_type  VARCHAR(100)               -- internet, cloud, removable_media
risk_level        VARCHAR(20)                -- critical|high|medium|low
data_type         VARCHAR(100)               -- pii, credentials, scada_data
protocol          VARCHAR(50)                -- HTTP, FTP, SMB, etc
encrypted         BOOLEAN DEFAULT false
status            VARCHAR(20) DEFAULT 'active'
description       TEXT
recommendations   TEXT
metadata          JSONB
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

---

### Schema: `compliance`

#### Table: `frameworks`
**Purpose**: Frameworks regulatórios aplicáveis

**Pre-populated Data**:
1. LGPD - Lei Geral de Proteção de Dados
2. IEC62443 - Industrial Automation Security
3. NIST_CSF - NIST Cybersecurity Framework
4. ISO27001 - Information Security Management
5. CIS - CIS Controls v8

---

#### Table: `required_documents`
**Purpose**: Registro master de 50 documentos obrigatórios

**Populated**: 39 documentos obrigatórios mapeados

**Categorias**:
- POL (Políticas): 6 docs
- PROC (Procedimentos): 6 docs
- PRI (Planos Resposta): 4 docs
- BCP (Continuidade): 3 docs
- TRAIN (Treinamentos): 4 docs
- RISK (Análise Risco): 3 docs
- AUD (Auditorias): 4 docs
- INC (Incidentes): 4 docs
- EVID (Evidências): 5 docs

**Columns Key**:
```sql
document_code         VARCHAR(50) UNIQUE  -- POL-001, PROC-002, etc
document_name         VARCHAR(500)
regulatory_reference  VARCHAR(500)        -- ANEEL RN 964/2021 Art. 3º
mandatory             BOOLEAN
frequency             VARCHAR(50)         -- once, annual, quarterly, etc
responsible_role      VARCHAR(100)        -- CISO, TI Manager, etc
approval_required_by  VARCHAR(100)        -- Conselho, Diretoria, etc
retention_years       INTEGER
```

---

#### Table: `document_status`
**Purpose**: Tracking de status de cada documento

**Status Possíveis**:
- `missing` - Documento não criado
- `draft` - Em elaboração
- `under_review` - Em revisão
- `approved` - Aprovado
- `published` - Publicado e vigente
- `expired` - Vencido (precisa revisão)
- `archived` - Arquivado

**Workflow**:
```
missing → draft → under_review → approved → published
                                    ↓
                                  expired → under_review (ciclo)
```

---

## 🔧 Tools and Scripts

### analyze_topology.py

**Purpose**: Parser e análise do arquivo JSON de topologia Visio  
**Language**: Python 3  
**Input**: `assets/Topologia_TBE_full.json` (1GB+)  
**Output**: `docs/security/topology-analysis-preliminary.md`  

**Functionality**:
- Parse de JSON complexo (masters + pages + shapes)
- Categorização automática de dispositivos
- Estatísticas de rede
- Identificação de dispositivos de segurança
- Geração de relatório markdown

**Execution**:
```bash
python3 analyze_topology.py
```

**Resultado Atual**:
- ✅ Executado com sucesso
- 31 tipos de dispositivos identificados
- 13.280 objetos mapeados
- Relatório markdown gerado

**Limitação**: Análise superficial. Precisa análise profunda de conexões e IPs.

---

## 📊 Data Flow (Current Implementation)

### Data Sources

1. **Topology Data**:
   - Source: `assets/Topologia_TBE_full.json`
   - Format: JSON (Visio export)
   - Size: ~1GB
   - Processing: `analyze_topology.py`
   - Storage: PostgreSQL `topology.*` tables

2. **Vulnerability Data**:
   - Source: Manual input (futuro: scanners integrados)
   - Storage: PostgreSQL `security.vulnerabilities`
   - Display: Frontend tables

3. **Compliance Documents**:
   - Source: File uploads
   - Storage: File system + PostgreSQL metadata
   - Versioning: `compliance.document_versions`

4. **Audit Logs**:
   - Source: Application events
   - Storage: PostgreSQL `audit.activity_log`
   - Retention: Conforme classificação

### Data Flow Diagram (Planned)

```
┌─────────────────┐
│  File Upload    │ → Topology JSON, Documents, Evidence
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Python Scripts                     │
│  • analyze_topology.py              │
│  • vulnerability_scanner.py (TODO)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  FastAPI Backend                    │
│  • Data validation (Pydantic)       │
│  • Business logic                   │
│  • Compliance workflows             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  • Persistent storage               │
│  • Compliance tracking              │
│  • Audit logs                       │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Next.js Frontend                   │
│  • Dashboards                       │
│  • Document management              │
│  • Reports                          │
└─────────────────────────────────────┘
```

---

## 🎯 Features Implementation Status

### Module: Governance

**Status**: 🔴 0% (Não iniciado)

**Features Planned**:
- [ ] Dashboard executivo
- [ ] Gestão de políticas (6 políticas)
- [ ] Workflow de aprovação (draft → review → approved)
- [ ] Estrutura organizacional (CISO, CSIRT, SOC)
- [ ] KPIs de maturidade GRC

**Files to Create**:
```
features/governance/
├── components/
│   ├── governance-dashboard.tsx
│   ├── policy-card.tsx
│   ├── approval-workflow.tsx
│   └── org-structure.tsx
├── hooks/
│   └── use-governance-data.ts
└── types/
    └── governance.types.ts
```

---

### Module: Risk Management

**Status**: 🟡 20% (Análise inicial feita)

**Features Implemented**:
- [x] Script de análise de topologia
- [x] Documentação de requisitos
- [x] Database schema

**Features Pending**:
- [ ] UI de gestão de vulnerabilidades
- [ ] Risk register interface
- [ ] Matriz de riscos visual
- [ ] Integração com scanners
- [ ] Dashboard de riscos

**Files to Create**:
```
features/risk/
├── components/
│   ├── vulnerability-table.tsx
│   ├── vulnerability-detail.tsx
│   ├── risk-matrix.tsx
│   ├── cvss-calculator.tsx
│   └── risk-dashboard.tsx
├── actions/
│   └── vulnerability-actions.ts
├── schemas/
│   └── vulnerability.schema.ts
└── types/
    └── risk.types.ts
```

---

### Module: Compliance

**Status**: 🟡 30% (Schema completo, UI pendente)

**Features Implemented**:
- [x] Database schema compliance completo
- [x] 50 documentos obrigatórios mapeados
- [x] Views de compliance dashboard
- [x] Tracking de status de documentos

**Features Pending**:
- [ ] UI de gestão de documentos
- [ ] Upload e versionamento
- [ ] Workflow de aprovação visual
- [ ] Dashboard de conformidade
- [ ] Alertas de revisão
- [ ] Export de relatórios

**Files to Create**:
```
features/compliance/
├── components/
│   ├── compliance-dashboard.tsx
│   ├── document-list.tsx
│   ├── document-upload.tsx
│   ├── document-viewer.tsx
│   ├── framework-status.tsx
│   ├── gap-analysis.tsx
│   └── approval-workflow-ui.tsx
├── actions/
│   └── document-actions.ts
├── schemas/
│   └── document.schema.ts
└── types/
    └── compliance.types.ts
```

---

### Module: Document Management

**Status**: 🔴 0% (Schema pronto, implementação pendente)

**Database Ready**: ✅ 100%  
**Backend API**: ❌ 0%  
**Frontend UI**: ❌ 0%  

**Features Needed**:
- [ ] Upload de documentos (multi-file)
- [ ] Versionamento automático
- [ ] Assinatura digital (hash SHA-256)
- [ ] Workflow de aprovação multi-nível
- [ ] Busca e filtros
- [ ] Download e preview
- [ ] Alertas de expiração
- [ ] Audit trail completo

---

## 🚨 Technical Debt & Known Issues

### Critical Issues

#### 1. Backend Not Implemented
**Severity**: 🔴 CRÍTICO  
**Impact**: Aplicação não funcional

**Current State**:
- Apenas 3 endpoints básicos (`/`, `/health`, `/api/v1/security/summary`)
- Retorna dados mockados
- Sem integração com PostgreSQL

**Required**:
- Implementar SQLAlchemy models
- Criar routers FastAPI
- Implementar business logic
- Auth e autorização
- Integração com Redis

**Effort**: 3-4 semanas

---

#### 2. Frontend Incomplete
**Severity**: 🔴 ALTA  
**Impact**: Sem interface funcional

**Current State**:
- Apenas landing page funcional
- Componentes UI base (Button apenas)
- Sem dashboard pages
- Sem features modules implementados

**Required**:
- Criar 30+ componentes Shadcn/ui
- Implementar Sidebar + Header
- Criar todas as páginas dashboard
- Implementar features (governance, risk, compliance)
- Integração com API

**Effort**: 4-6 semanas

---

#### 3. No Authentication
**Severity**: 🟡 ALTA  
**Impact**: Sem controle de acesso

**Current State**: Nenhum sistema de auth

**Options**:
1. NextAuth.js (recomendado)
2. Clerk (pago)
3. Auth0 (pago)

**Required**:
- Implementar provider
- Login/Logout pages
- Session management
- RBAC (roles: Admin, CISO, Auditor, Viewer)

**Effort**: 1 semana

---

#### 4. 37 Documentos Regulatórios Faltantes
**Severity**: 🔴 CRÍTICA (Compliance)  
**Impact**: Não conformidade ANEEL RN 964/2021

**Current State**:
- Apenas 2/39 docs criados (EVID-001 draft, EVID-002 partial)
- Estrutura de pastas criada
- Templates disponíveis

**Required**: Criar 37 documentos obrigatórios

**Effort**: 12 semanas-pessoa (estimado 2.000 horas)

---

### Medium Priority Issues

#### 5. Docker Compose URLs Inconsistentes
**Severity**: 🟡 MÉDIA  
**Impact**: Variáveis de ambiente incorretas

**Issue**: Algumas referências ainda dizem `ness_secops` em vez de `ness_ot_grc`

**Fix Required**:
```yaml
# docker-compose.yml linhas 53 e 77
# Trocar ness_secops → ness_ot_grc
```

**Effort**: 5 minutos

---

#### 6. No Testing Infrastructure
**Severity**: 🟡 MÉDIA  
**Impact**: Qualidade de código

**Current State**: Sem testes

**Required**:
- Jest/Vitest para frontend
- Pytest para backend
- Integration tests
- E2E tests (Playwright)

**Effort**: 2 semanas

---

### Low Priority Issues

#### 7. No CI/CD
**Severity**: 🟢 BAIXA  
**Impact**: Deploy manual

**Current State**: Sem pipeline

**Required**: GitHub Actions ou GitLab CI

**Effort**: 3-4 dias

---

## 🔌 Integration Points

### External Services (Planned)

| Service | Purpose | Status | Integration Type |
|---------|---------|--------|------------------|
| **Vulnerability Scanners** | CVE detection | ❌ Não integrado | REST API |
| **SIEM** | Security monitoring | ❌ Não integrado | Syslog/API |
| **CTIR Gov** | Notificação incidentes | ❌ Não integrado | Email/Portal |
| **ANEEL Portal** | Submissão de docs | ❌ Não integrado | Portal web |

### Internal Integration Points

**Frontend ↔ Backend**:
- Protocol: REST API (JSON)
- Base URL: `http://localhost:8000`
- Auth: JWT (quando implementado)
- CORS: Configurado para localhost:3000

**Backend ↔ Database**:
- Protocol: PostgreSQL wire protocol
- ORM: SQLAlchemy (async)
- Connection Pool: 10 connections
- URL: `postgresql://ness_admin:***@postgres:5432/ness_ot_grc`

**Backend ↔ Redis**:
- Protocol: Redis protocol
- Client: redis-py
- Usage: Cache + Sessions
- URL: `redis://redis:6379`

---

## 🛠️ Development Workflow (Current State)

### Local Development Setup

**Prerequisites**:
- Docker Desktop installed
- pnpm ≥8.0.0 (para frontend sem Docker)
- Python 3.11 (para scripts)

**Quick Start**:
```bash
# 1. Clone/Navigate
cd /home/resper/TBE-OT

# 2. Start Docker stack
docker-compose up -d

# 3. Access services
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# pgAdmin:   http://localhost:5050
```

**Alternative (Without Docker)**:
```bash
# Frontend
cd frontend
pnpm install
pnpm dev

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Build Process

**Frontend**:
```bash
cd frontend
pnpm build         # Next.js build
pnpm start         # Production server
```

**Backend**:
```bash
# Production usa gunicorn (não configurado ainda)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Environment Variables

**Frontend** (`.env.local`):
```env
DATABASE_URL=postgresql://ness_admin:***@localhost:5432/ness_ot_grc
NEXT_PUBLIC_API_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=***
NODE_ENV=development
```

**Backend** (via docker-compose):
```env
DATABASE_URL=postgresql://ness_admin:***@postgres:5432/ness_ot_grc
PYTHONUNBUFFERED=1
API_PORT=8000
```

---

## 📚 Regulatory Documentation (Detailed)

### ANEEL RN 964/2021 - Implementation

**Document**: `docs/security/ANEEL-RN-964-2021.md` (400+ linhas)

**Content**:
1. Obrigações principais (7 pilares)
2. Política de Segurança Cibernética (requisitos)
3. Classificação de Dados (5 níveis)
4. Medidas Técnicas (7 categorias)
5. Cultura de Segurança (treinamentos)
6. Gestão de Incidentes (5 níveis)
7. Notificação (prazos e destinatários)
8. Indicadores e KPIs
9. Penalidades
10. Checklist de conformidade

**Key Requirements Mapped**:
- 📜 Política master aprovada por Conselho ✅ Mapeado, ❌ Não criado
- 🏢 CISO designado formalmente ❌ Não designado
- 📊 Classificação de dados ✅ Níveis definidos, ❌ Não aplicado
- 🛡️ Controles técnicos ✅ Listados, ❌ Não implementados
- 🎓 Programa de treinamento ✅ Estruturado, ❌ Não executado
- 🚨 PRI documentado ✅ Template criado, ❌ Não preenchido
- 📈 KPIs definidos ✅ Listados, ❌ Não coletados

---

### ONS Requirements - Implementation

**Document**: `docs/security/ONS-REQUIREMENTS.md` (310 linhas)

**Content**:
1. Rotina Operacional de Segurança Cibernética
2. 5 Controles Mínimos Obrigatórios
3. Modelo Purdue (ISA-95) detalhado
4. IEC 62443 framework
5. NIST CSF aplicação
6. NERC CIP (referência)
7. Checklists de conformidade

**5 Controles Mínimos ONS**:
1. MFA ❌ Não verificado na rede TBE
2. Patches ❌ Não verificado
3. VPN ❌ Não verificado  
4. Antimalware ❌ Não verificado
5. Segmentação OT/IT 🔴 NÃO CONFORME (crítico)

**Conformidade Atual ONS**: 0%

---

### Security Assessment - TBE Network

**Document**: `docs/security/TBE-OT-SECURITY-ASSESSMENT.md` (600+ linhas)

**Analysis Results**:

**Riscos Críticos Identificados**:
1. Segmentação Inadequada (CVSS 9.1) 🔴
2. Hub em rede crítica (CVSS 7.5) 🔴
3. Insuficiência de firewalls (CVSS 8.2) 🔴
4. Wireless em ambiente OT (CVSS 6.8) 🟡
5. Sistemas legados (CVSS 6.5) 🟡

**Modelo Purdue Status**:
- Nível 5 (Corporativo): ❌ Não identificado
- Nível 4 (Supervisão): ⚠️ Parcial
- Nível 3 (HMI/SCADA): ⚠️ Parcial
- Nível 2 (Controle): ❌ PLCs não identificados
- Nível 1 (Básico): ❌ RTUs não identificados
- Nível 0 (Processo): ❌ Sensores não identificados
- DMZ: ❌ Não identificada
- Firewalls entre níveis: ❌ Não identificados

**Conclusão**: Modelo Purdue NÃO IMPLEMENTADO

---

## 🗂️ Document Management System

### Compliance Document Structure

**Total Documents Mapped**: 50  
**Mandatory**: 39  
**Recommended**: 11  
**Created**: 2  
**Missing**: 37  
**Compliance**: 5%  

### Document Categories (9)

#### 1. POL - Políticas (6 documentos)
**Status**: 0/6 (0%)

| Code | Document | Responsible | Approval | Status |
|------|----------|-------------|----------|--------|
| POL-001 | Política Segurança Cibernética | CISO | Conselho | 🔴 Missing |
| POL-002 | Classificação de Dados | CISO | Diretoria | 🔴 Missing |
| POL-003 | Controle de Acesso | CISO | Diretoria | 🔴 Missing |
| POL-004 | Uso Aceitável | CISO | Diretoria | 🔴 Missing |
| POL-005 | Gestão de Patches | TI Mgr | CISO | 🔴 Missing |
| POL-006 | Backup e Recuperação | TI Mgr | CISO | 🔴 Missing |

**Effort**: 232 horas total

---

#### 2. PROC - Procedimentos (6 documentos)  
**Status**: 0/6 (0%)

| Code | Document | Responsible | Approval | Status |
|------|----------|-------------|----------|--------|
| PROC-001 | Gestão Vulnerabilidades | Security | CISO | 🔴 Missing |
| PROC-002 | Controle de Mudanças | Change Mgr | Diretoria Op | 🔴 Missing |
| PROC-003 | Hardening Sistemas | Security | CISO | 🔴 Missing |
| PROC-004 | Gestão de Logs | SOC | CISO | 🔴 Missing |
| PROC-005 | Segmentação Rede | Network | CISO | 🔴 Missing |
| PROC-006 | Acesso Remoto | Network | CISO | 🔴 Missing |

**Effort**: 224 horas total

---

#### 3. PRI - Planos de Resposta (4 documentos)
**Status**: 0/4 (0%)

| Code | Document | Responsible | Approval | Status |
|------|----------|-------------|----------|--------|
| PRI-001 | Plano Resposta Incidentes | CSIRT Lead | Conselho | 🔴 Missing |
| PRI-002 | Playbook Ransomware | CSIRT Lead | CISO | 🔴 Missing |
| PRI-003 | Playbook Vazamento Dados | CSIRT+DPO | CISO | 🔴 Missing |
| PRI-004 | Notificação Incidentes | CSIRT Lead | CISO | 🔴 Missing |

**Effort**: 160 horas total

---

#### 4. BCP - Continuidade (3 documentos)
**Status**: 0/3 (0%)

| Code | Document | Responsible | Approval | Status |
|------|----------|-------------|----------|--------|
| BCP-001 | Plano Continuidade | BCM Mgr | Conselho | 🔴 Missing |
| BCP-002 | Plano DR | TI Mgr | Diretoria | 🔴 Missing |
| BCP-003 | BIA (Impact Analysis) | BCM Mgr | Diretoria | 🔴 Missing |

**Effort**: 260 horas total

---

#### 5. TRAIN - Treinamentos (4 documentos)
**Status**: 0/4 (0%)

| Code | Document | Frequency | Status |
|------|----------|-----------|--------|
| TRAIN-001 | Programa Conscientização | Anual | 🔴 Missing |
| TRAIN-002 | Treinamento Técnico OT | Semestral | 🔴 Missing |
| TRAIN-003 | Simulação Incidentes | Trimestral | 🔴 Missing |
| TRAIN-004 | Evidências Treinamento | Contínuo | 🔴 Missing |

**Effort**: 156 horas total

---

#### 6. RISK - Análise de Risco (3 documentos)
**Status**: 0/3 (0%)

| Code | Document | Frequency | Status |
|------|----------|-----------|--------|
| RISK-001 | Análise de Risco | Anual | 🔴 Missing |
| RISK-002 | Risk Register | Contínuo | 🔴 Missing |
| RISK-003 | Plano Tratamento | Anual | 🔴 Missing |

**Effort**: 300 horas total

---

#### 7. AUD - Auditorias (4 documentos)
**Status**: 0/4 (0%)

| Code | Document | Frequency | Status |
|------|----------|-----------|--------|
| AUD-001 | Plano Anual Auditoria | Anual | 🔴 Missing |
| AUD-002 | Relatórios Auditoria Interna | Contínuo | 🔴 Missing |
| AUD-003 | Relatórios Auditoria Externa | Anual | 🔴 Missing |
| AUD-004 | Ações Corretivas | Contínuo | 🔴 Missing |

**Effort**: 120+ horas total

---

#### 8. INC - Incidentes (4 documentos)
**Status**: 0/4 (0%)

| Code | Document | Urgency | Status |
|------|----------|---------|--------|
| INC-001 | Relatórios Incidentes | 24h para críticos | 🔴 Missing |
| INC-002 | Notificações ANEEL | 24h obrigatório | 🔴 Missing |
| INC-003 | Análise Causa Raiz | Por incidente | 🔴 Missing |
| INC-004 | Lições Aprendidas | Por incidente | 🔴 Missing |

**Effort**: Variável (8-80h por incidente)

---

#### 9. EVID - Evidências (5 documentos)
**Status**: 2/5 (40%)

| Code | Document | Status | Notes |
|------|----------|--------|-------|
| EVID-001 | Inventário de Ativos | 🟡 Draft | Análise preliminar completa |
| EVID-002 | Varredura Vulnerabilidades | 🟡 Partial | Estrutura criada |
| EVID-003 | Logs Controle Acesso | 🔴 Missing | Sistema não implementado |
| EVID-004 | Patches Aplicados | 🔴 Missing | Sistema não implementado |
| EVID-005 | Testes Backup | 🔴 Missing | Não executados |

**Effort**: Contínuo (após implementação)

---

## 🎯 BMAD Method Integration

### BMAD Agents Created

#### SecOps - Network Security Analyst
**File**: `docs/bmad-agents/network-security-analyst.md`  
**Purpose**: Agente especializado em análise de segurança OT  
**Commands**: 9 comandos (`*analyze-topology`, `*detect-data-leakage`, etc)  
**Status**: ✅ Completo

---

### BMAD Workflows

#### Network Vulnerability Analysis
**File**: `docs/bmad-workflows/network-vulnerability-analysis.yaml`  
**Etapas**: 11  
**Agents**: network-security-analyst  
**Status**: ✅ Completo

**Workflow Steps**:
1. project_scope_definition
2. topology_analysis
3. asset_inventory
4. threat_modeling
5. vulnerability_scanning
6. data_leakage_analysis
7. access_control_review
8. compliance_assessment
9. risk_prioritization
10. remediation_planning
11. security_assessment_report

---

### BMAD Tasks (4)

| Task | File | Status |
|------|------|--------|
| Analyze Network Topology | analyze-network-topology.md | ✅ |
| Detect Data Leakage | detect-data-leakage.md | ✅ |
| Scan Vulnerabilities | scan-vulnerabilities.md | ✅ |
| Assess Compliance | assess-compliance.md | ✅ |

---

### BMAD Templates (3)

| Template | File | Sections |
|----------|------|----------|
| Security Assessment | security-assessment-tmpl.yaml | 14 sections |
| Vulnerability Report | vulnerability-report-tmpl.yaml | 12 sections |
| Threat Model | threat-model-tmpl.yaml | 11 sections |

---

## 🔐 Security & Compliance Framework

### Regulatory Compliance Matrix

| Framework | Version | Applicability | Implementation | Compliance % |
|-----------|---------|---------------|----------------|--------------|
| **ANEEL RN 964/2021** | 2021 | ⭐ Obrigatório | 🟡 Schema criado | 5% |
| **ONS Rotina** | Current | ⭐ Obrigatório | 🔴 Não implementado | 0% |
| **IEC 62443** | 4.0 | ⭐ Obrigatório | 🟡 Framework mapeado | 10% |
| **NIST CSF** | 2.0 | 🟢 Recomendado | 🟡 Framework mapeado | 10% |
| **ISO 27001** | 2022 | 🟢 Recomendado | 🔴 Não iniciado | 0% |
| **ISO 27019** | 2017 | 🟢 Recomendado | 🔴 Não iniciado | 0% |
| **LGPD** | 2018 | ⭐ Obrigatório | 🔴 Não iniciado | 0% |
| **CIS Controls** | v8 | 🟢 Recomendado | 🔴 Não iniciado | 0% |

**Overall Compliance**: 5%  
**Status**: 🔴 NÃO CONFORME  

---

## 🚧 Implementation Roadmap (Realistic Effort)

### Phase 1: Foundation (CURRENT) - Weeks 1-2 ✅ COMPLETO
**Status**: 100%

- [x] Project structure
- [x] Database schema (2 init scripts, 800+ linhas SQL)
- [x] Docker compose stack
- [x] Frontend skeleton
- [x] Backend skeleton
- [x] Design system ness.
- [x] Regulatory documentation (ANEEL, ONS)
- [x] 50 documentos mapeados
- [x] BMAD agents/workflows/tasks

---

### Phase 2: Backend API - Weeks 3-6 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 4 semanas  

**Tasks**:
- [ ] SQLAlchemy models (todas as tabelas)
- [ ] Alembic migrations
- [ ] FastAPI routers
  - [ ] `/api/v1/governance/*`
  - [ ] `/api/v1/risk/*`
  - [ ] `/api/v1/compliance/*`
  - [ ] `/api/v1/documents/*`
- [ ] Business logic services
- [ ] Pydantic schemas (request/response)
- [ ] Auth & authorization (JWT)
- [ ] File upload handling
- [ ] Redis integration
- [ ] Error handling
- [ ] API documentation (OpenAPI)

**Deliverables**:
```
backend/
├── main.py
├── core/
│   ├── config.py
│   ├── database.py
│   └── security.py
├── models/
│   ├── asset.py
│   ├── vulnerability.py
│   ├── compliance.py
│   └── document.py
├── routes/
│   ├── governance.py
│   ├── risk.py
│   ├── compliance.py
│   └── documents.py
├── services/
│   ├── asset_service.py
│   ├── vulnerability_service.py
│   ├── compliance_service.py
│   └── document_service.py
└── schemas/
    ├── asset.py
    ├── vulnerability.py
    ├── compliance.py
    └── document.py
```

---

### Phase 3: Frontend Core UI - Weeks 7-10 ⏳ PENDENTE
**Status**: 10%  
**Effort**: 4 semanas  

**Tasks**:
- [ ] Criar 30+ componentes Shadcn/ui
  - [ ] Card, Table, Dialog, Dropdown
  - [ ] Tabs, Badge, Progress, Tooltip
  - [ ] Form components (Input, Select, Checkbox, etc)
  - [ ] Data Table com sorting/filtering
- [ ] Layout completo
  - [ ] Sidebar navigation
  - [ ] Header/TopBar
  - [ ] Dashboard layout
  - [ ] Mobile responsive
- [ ] Páginas base
  - [ ] Dashboard home
  - [ ] Governance overview
  - [ ] Risk overview
  - [ ] Compliance overview
- [ ] State management (Zustand stores)
- [ ] API client integration

**Deliverables**:
```
components/ui/
├── card.tsx
├── table.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── tabs.tsx
├── badge.tsx
├── progress.tsx
├── tooltip.tsx
├── form.tsx
├── input.tsx
├── select.tsx
└── [20+ more]

components/layout/
├── sidebar.tsx
├── header.tsx
├── dashboard-layout.tsx
└── mobile-nav.tsx
```

---

### Phase 4: Governance Module - Weeks 11-13 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 3 semanas  

**Features**:
- [ ] Dashboard executivo
- [ ] Gestão de políticas
  - [ ] Lista de políticas
  - [ ] Criação/edição
  - [ ] Workflow de aprovação
  - [ ] Versionamento
- [ ] Estrutura organizacional
- [ ] KPIs e métricas

**Pages**:
```
app/(dashboard)/governance/
├── page.tsx                      # Dashboard
├── policies/
│   ├── page.tsx                  # Lista
│   ├── [id]/page.tsx            # Detalhe/Edit
│   └── new/page.tsx             # Nova política
├── structure/
│   └── page.tsx                  # Org structure
└── metrics/
    └── page.tsx                  # KPIs
```

---

### Phase 5: Risk Module - Weeks 14-17 ⏳ PENDENTE
**Status**: 20%  
**Effort**: 4 semanas  

**Features**:
- [ ] Dashboard de riscos
- [ ] Gestão de vulnerabilidades
  - [ ] Tabela com filtros (Tanstack Table)
  - [ ] CRUD vulnerabilidades
  - [ ] CVSS calculator
  - [ ] Tracking de remediação
- [ ] Risk register
- [ ] Matriz de riscos
- [ ] Análise de topologia (visualização)
- [ ] Detecção de vazamento

**Pages**:
```
app/(dashboard)/risk/
├── page.tsx                      # Dashboard
├── vulnerabilities/
│   ├── page.tsx                  # Tabela
│   ├── [id]/page.tsx            # Detalhe
│   └── new/page.tsx             # Registro manual
├── topology/
│   └── page.tsx                  # Visualização rede
├── register/
│   └── page.tsx                  # Risk register
└── matrix/
    └── page.tsx                  # Risk matrix
```

---

### Phase 6: Compliance Module - Weeks 18-21 ⏳ PENDENTE
**Status**: 30%  
**Effort**: 4 semanas  

**Features**:
- [ ] Dashboard de conformidade
- [ ] Gestão de frameworks
  - [ ] Status por framework (ANEEL, ONS, IEC, etc)
  - [ ] Gap analysis visual
  - [ ] Roadmap de adequação
- [ ] Gestão de controles
- [ ] Assessments periódicos

**Pages**:
```
app/(dashboard)/compliance/
├── page.tsx                      # Dashboard geral
├── aneel-rn-964/
│   └── page.tsx                  # ANEEL específico
├── ons/
│   └── page.tsx                  # ONS específico
├── iec-62443/
│   └── page.tsx                  # IEC 62443 + SL assessment
├── frameworks/
│   └── page.tsx                  # Todos frameworks
└── gap-analysis/
    └── page.tsx                  # Gap analysis
```

---

### Phase 7: Document Management - Weeks 22-26 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 5 semanas  

**Features**:
- [ ] Upload de documentos
- [ ] Versionamento automático
- [ ] Workflow de aprovação visual
- [ ] Visualizador de documentos (PDF, DOC, MD)
- [ ] Busca full-text
- [ ] Filtros avançados
- [ ] Download/Export
- [ ] Alertas de expiração
- [ ] Assinatura digital
- [ ] Audit trail

**Pages**:
```
app/(dashboard)/documents/
├── page.tsx                      # Lista principal
├── [category]/
│   └── page.tsx                  # Por categoria
├── [id]/
│   ├── page.tsx                  # Visualizador
│   ├── versions/page.tsx         # Histórico
│   └── approvals/page.tsx        # Workflow
├── upload/
│   └── page.tsx                  # Upload multi-file
└── search/
    └── page.tsx                  # Busca avançada
```

---

### Phase 8: Analytics & Reporting - Weeks 27-29 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 3 semanas  

**Features**:
- [ ] Recharts integration
- [ ] Dashboards executivos
- [ ] Export de relatórios (PDF, CSV, Excel)
- [ ] Gráficos customizados
- [ ] Filtros de período
- [ ] Comparações temporais

---

### Phase 9: Testing & QA - Weeks 30-32 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 3 semanas  

**Tasks**:
- [ ] Unit tests (backend)
- [ ] Unit tests (frontend)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Security testing

---

### Phase 10: Production Deployment - Weeks 33-34 ⏳ PENDENTE
**Status**: 0%  
**Effort**: 2 semanas  

**Tasks**:
- [ ] Production Docker setup
- [ ] Reverse proxy (Nginx/Traefik)
- [ ] SSL/TLS certificates
- [ ] CI/CD pipeline
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Backup automation
- [ ] Disaster recovery procedures

---

## 📊 Effort Summary

| Phase | Weeks | Status | Progress |
|-------|-------|--------|----------|
| 1. Foundation | 2 | ✅ Completo | 100% |
| 2. Backend API | 4 | ⏳ Pendente | 0% |
| 3. Frontend Core | 4 | ⏳ Pendente | 10% |
| 4. Governance | 3 | ⏳ Pendente | 0% |
| 5. Risk | 4 | ⏳ Pendente | 20% |
| 6. Compliance | 4 | ⏳ Pendente | 30% |
| 7. Documents | 5 | ⏳ Pendente | 0% |
| 8. Analytics | 3 | ⏳ Pendente | 0% |
| 9. Testing | 3 | ⏳ Pendente | 0% |
| 10. Deployment | 2 | ⏳ Pendente | 0% |
| **TOTAL** | **34 semanas** | **Em Andamento** | **15%** |

**Timeline**: 8 meses (1 desenvolvedor full-time)  
**Ou**: 4 meses (2 desenvolvedores)  
**Ou**: 2 meses (4 desenvolvedores)  

---

## 🎯 Critical Path Items

### Must-Have for MVP (Minimum Viable Product)

**Prazo**: 8 semanas  
**Equipe**: 2 pessoas  

1. ✅ Database schema (Completo)
2. ⏳ Backend API básico (4 semanas)
   - CRUD assets
   - CRUD vulnerabilities
   - CRUD documents (upload simples)
   - Auth básico
3. ⏳ Frontend essencial (4 semanas)
   - UI components necessários
   - Layout (Sidebar + Header)
   - 3 páginas principais (Governance, Risk, Compliance)
   - Document upload básico

**MVP Feature Set**:
- Upload de inventário de ativos (EVID-001)
- Registro manual de vulnerabilidades
- Upload de documentos obrigatórios
- Dashboard simples de conformidade
- Relatório básico de missing documents

---

## 🔧 Deployment & DevOps

### Current State: Local Docker

**Compose File**: `docker-compose.yml` (117 linhas)

**Services Configuration**:

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: ness_ot_grc
    POSTGRES_USER: ness_admin
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./database/init:/docker-entrypoint-initdb.d  # Auto-init SQL
  healthcheck: pg_isready every 10s

backend:
  build: ./backend (Dockerfile)
  command: uvicorn --reload
  volumes:
    - ./backend:/app     # Hot reload
    - ./assets:/app/assets
    - ./docs:/app/docs
  depends_on:
    postgres: condition healthy

frontend:
  build: ./frontend (Dockerfile.dev)
  command: npm run dev
  volumes:
    - ./frontend:/app   # Hot reload
    - /app/node_modules # Prevent overwrite
    - /app/.next
```

**Networks**: bridge (`ness_ot_grc_network`)  
**Volumes**: 3 persistent volumes  

---

### Production Deployment (Planned)

**Target**: VPS com Portainer  
**Orchestration**: Docker Compose (production variant)  
**Reverse Proxy**: Traefik (via Portainer, auto SSL)  
**Domains**:
- Frontend: `otgrc.ness.com.br` (planned)
- API: `api-otgrc.ness.com.br` (planned)

**Production Changes Needed**:
- [ ] Multi-stage Dockerfile (otimizado)
- [ ] Environment separation
- [ ] Secrets management
- [ ] Backup automation
- [ ] Monitoring stack
- [ ] Log aggregation

---

## 📝 Configuration Management

### Frontend Configuration Files

**package.json**:
- name: `ness-ot-grc`
- version: `1.0.0`
- engines: node ≥20, pnpm ≥8
- 24 dependencies
- 14 devDependencies

**tsconfig.json**:
- strict: true
- paths: `@/*` alias
- jsx: preserve
- module: esnext

**tailwind.config.ts**:
- ness. colors extended
- ness. animations
- ness. transitions
- Custom utilities

**next.config.ts**:
- reactStrictMode: true
- typescript errors: not ignored
- eslint: not ignored during build

---

### Backend Configuration Files

**requirements.txt**: 20 packages
- FastAPI ecosystem
- PostgreSQL (psycopg2-binary, SQLAlchemy)
- Redis (redis, hiredis)
- Security (python-jose, passlib)
- Validation (Pydantic)
- Data (pandas, numpy)

**Dockerfile**:
- Base: python:3.11-slim
- System deps: gcc, postgresql-client
- Working dir: /app
- Port: 8000
- Command: uvicorn with reload

---

### Database Configuration

**Init Scripts** (Auto-run on first start):
1. `01-init.sql` - Schema principal
2. `02-compliance-documents.sql` - Compliance schema + seed data

**Connection Details**:
```
Host: localhost (ou postgres em Docker)
Port: 5432
Database: ness_ot_grc
User: ness_admin
Password: ness_secure_pass_2025
```

**pgAdmin Access**:
```
URL: http://localhost:5050
Email: admin@ness.local
Password: ness_admin_2025
```

---

## 🎓 Knowledge Base & Documentation

### Regulatory Documentation (6 files)

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| ONS-REQUIREMENTS.md | 310 | Requisitos ONS + IEC 62443 | ✅ |
| ANEEL-RN-964-2021.md | 400+ | RN 964/2021 detalhada | ✅ |
| TBE-OT-SECURITY-ASSESSMENT.md | 600+ | Avaliação rede TBE | ✅ |
| DOCUMENT-INVENTORY.md | 800+ | 50 docs mapeados | ✅ |
| topology-analysis-preliminary.md | 139 | Análise inicial | ✅ |
| PROJECT-INDEX.md | 400+ | Índice completo | ✅ |

**Total**: ~2.650 linhas de documentação regulatória

---

### Technical Documentation (8+ files)

| File | Purpose | Status |
|------|---------|--------|
| README.md (root) | Overview do projeto | ✅ |
| frontend/README.md | Docs do frontend | ✅ |
| frontend/IMPLEMENTATION-GUIDE.md | Guia implementação | ✅ |
| PROJECT-COMPLETE-OVERVIEW.md | Overview completo | ✅ |
| BROWNFIELD-ARCHITECTURE.md | Este documento | ✅ |

---

### BMAD Documentation (11 files)

**Agents**: 1 (network-security-analyst.md)  
**Workflows**: 1 (network-vulnerability-analysis.yaml)  
**Tasks**: 4 (analyze, detect, scan, assess)  
**Templates**: 3 (security-assessment, vulnerability-report, threat-model)  
**Data**: 2 (security-frameworks.md, network-security-standards.md - TODO)  

**Total BMAD Lines**: ~1.500

---

## 🔄 Workflows and Business Logic

### Document Approval Workflow

**States**:
```
Draft → Under Review → Pending Approval → Approved → Published
                            ↓
                        Rejected → Draft
```

**Roles**:
- Creator: Cria documento
- Reviewer: Revisa tecnicamente
- Approver: Aprovação final (conforme doc)
  - CISO
  - Diretoria
  - Conselho de Administração

**Database Tables**:
- `compliance.document_status` - Estado atual
- `compliance.document_approvals` - Workflow steps
- `compliance.document_versions` - Histórico

**Implementation**: ❌ Backend logic não implementado

---

### Vulnerability Management Workflow

**States**:
```
Identified → Assessed → Prioritized → Remediation → Validation → Closed
```

**Priority Calculation**:
```python
# Pseudo-code
risk_score = cvss_score * asset_criticality * exploit_available_multiplier
priority = P0 if risk_score > 9.0
           P1 if risk_score > 7.0
           P2 if risk_score > 4.0
           else P3
```

**SLA por Prioridade** (ONS guideline):
- P0 (Critical): 7 dias
- P1 (High): 30 dias
- P2 (Medium): 90 dias
- P3 (Low): 180 dias

**Implementation**: ❌ Não implementado

---

### Incident Response Workflow

**Classification** (ANEEL RN 964/2021):
```
Level 1: Informativo      → Internal handling
Level 2: Baixo            → Internal handling
Level 3: Médio            → CSIRT activation
Level 4: Alto             → ANEEL notification 24h
Level 5: Crítico          → ANEEL + ONS + GSI notification 24h
```

**Phases**:
1. Detection → Alert
2. Analysis → Classification
3. Containment → Isolation
4. Eradication → Root cause fix
5. Recovery → Restore operations
6. Lessons Learned → Documentation

**Notification Flow**:
```
Incident Detected
    ↓
Classification (Level 1-5)
    ↓
If Level 4-5:
    ├→ ANEEL (24h)
    ├→ ONS (24h)
    ├→ GSI (24h)
    └→ CTIR Gov (24h)
    ↓
Preliminary Report (72h)
    ↓
Final Report (30 days)
```

**Database**: `security.incidents` + `compliance.document_status` (INC-001, INC-002)

**Implementation**: ❌ Workflow não implementado

---

## 🔍 Code Patterns and Conventions

### Frontend Patterns

#### Component Structure
```tsx
// Pattern usado
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  // ... other props
}

export function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* Content */}
    </div>
  );
}
```

#### Naming Conventions
- Components: PascalCase (`NessGRCLogo`)
- Files: kebab-case (`ness-grc-logo.tsx`)
- Functions: camelCase (`formatDate`)
- Constants: UPPER_CASE (`API_BASE_URL`)
- Types: PascalCase (`NessGRCLogoProps`)

#### Class Names Pattern
```tsx
// Always use Tailwind utilities
className="bg-gray-950 text-gray-50 border border-gray-800"

// Use cn() para conditional
className={cn(
  'base classes',
  condition && 'conditional-classes',
  className  // Allow override
)}

// Use ness. custom classes
className="surface-1 transition-ness focus-ness"
```

---

### Backend Patterns (Planned)

#### API Route Structure
```python
# Pattern a ser usado
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(prefix="/api/v1/governance", tags=["governance"])

@router.get("/policies", response_model=List[PolicySchema])
async def list_policies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    # Business logic
    pass
```

#### Service Layer Pattern
```python
# services/policy_service.py
class PolicyService:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_policy(self, policy_data: PolicyCreate) -> Policy:
        # Business logic
        pass
    
    async def get_policies(self, filters: PolicyFilters) -> List[Policy]:
        # Business logic
        pass
```

---

## 🚀 Getting Started (Developer Onboarding)

### For New Developers

#### Step 1: Environment Setup
```bash
# Prerequisites
- Docker Desktop installed
- Git configured
- IDE (VS Code recommended)

# Clone
git clone [repo-url]
cd TBE-OT
```

#### Step 2: Start Development Environment
```bash
# Easy mode (Docker)
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f frontend
```

#### Step 3: Access Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs (Swagger)
- pgAdmin: http://localhost:5050

#### Step 4: Database Exploration
```bash
# Via pgAdmin (http://localhost:5050)
Email: admin@ness.local
Password: ness_admin_2025

# Add server:
Host: postgres
Port: 5432
Database: ness_ot_grc
Username: ness_admin
Password: ness_secure_pass_2025

# Via psql
docker exec -it ness-ot-grc-db psql -U ness_admin -d ness_ot_grc
```

#### Step 5: Explore Codebase
**Start Here**:
1. Read `README.md`
2. Read this document (`BROWNFIELD-ARCHITECTURE.md`)
3. Explore `frontend/app/page.tsx` (landing page)
4. Check `database/init/01-init.sql` (schema)
5. Review `docs/compliance/DOCUMENT-INVENTORY.md` (requirements)

---

## 📖 Appendix

### A. Useful Commands

#### Docker Commands
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f [service]

# Shell into container
docker exec -it ness-ot-grc-backend bash
docker exec -it ness-ot-grc-frontend sh

# Database backup
docker exec ness-ot-grc-db pg_dump -U ness_admin ness_ot_grc > backup.sql

# Database restore
docker exec -i ness-ot-grc-db psql -U ness_admin ness_ot_grc < backup.sql
```

#### Frontend Commands
```bash
cd frontend

# Development
pnpm dev
pnpm build
pnpm start

# Quality
pnpm lint
pnpm format
pnpm type-check
```

#### Backend Commands
```bash
cd backend

# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Create migration (quando Alembic configurado)
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

#### Database Commands
```bash
# Connect
psql -h localhost -U ness_admin -d ness_ot_grc

# Useful queries
SELECT * FROM compliance.compliance_dashboard;
SELECT * FROM compliance.missing_documents;
SELECT * FROM security.dashboard_summary;

# Check document status
SELECT 
  dc.category_name,
  COUNT(*) as total,
  COUNT(CASE WHEN ds.status IN ('approved','published') THEN 1 END) as compliant
FROM compliance.required_documents rd
JOIN compliance.document_categories dc ON rd.category_id = dc.id
LEFT JOIN compliance.document_status ds ON rd.id = ds.required_document_id
WHERE rd.mandatory = true
GROUP BY dc.category_name;
```

---

### B. File Locations Quick Reference

**Configuration**:
- Docker: `/docker-compose.yml`
- Frontend: `/frontend/package.json`, `/frontend/tsconfig.json`, `/frontend/tailwind.config.ts`
- Backend: `/backend/requirements.txt`
- Database: `/database/init/*.sql`

**Source Code**:
- Frontend Pages: `/frontend/app/`
- Frontend Components: `/frontend/components/`
- Backend API: `/backend/main.py`
- Scripts: `/analyze_topology.py`

**Documentation**:
- Regulatory: `/docs/security/*.md`
- Compliance: `/docs/compliance/*.md`
- BMAD: `/docs/bmad-*/*.md`
- Architecture: `/docs/BROWNFIELD-ARCHITECTURE.md` (this file)

**Data**:
- Topology: `/assets/Topologia_TBE_full.json`
- Documents: `/docs/policies/`, `/docs/procedures/`, etc (empty, awaiting upload)

---

### C. Troubleshooting

#### Problem: Docker containers not starting

**Solution**:
```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart [service]

# Full restart
docker-compose down
docker-compose up -d --build
```

#### Problem: Database connection refused

**Check**:
1. PostgreSQL container running: `docker ps | grep postgres`
2. Health check: `docker-compose ps`
3. Port available: `netstat -an | grep 5432`

**Fix**:
```bash
docker-compose restart postgres
```

#### Problem: Frontend hot reload not working

**Solution**:
```bash
# In docker-compose.yml, verify volumes:
volumes:
  - ./frontend:/app
  - /app/node_modules  # Important!
  - /app/.next

# Restart
docker-compose restart frontend
```

---

### D. References and Resources

**ANEEL**:
- [ANEEL Website](https://www.aneel.gov.br)
- [RN 964/2021](https://www.aneel.gov.br/resolucoes-normativas)

**ONS**:
- [ONS Website](https://www.ons.org.br)
- [Procedimentos de Rede](https://www.ons.org.br/paginas/sobre-o-sin/procedimentos-de-rede)

**Technical Standards**:
- [IEC 62443](https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards)
- [NIST CSF](https://www.nist.gov/cyberframework)
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html)

**Development**:
- [Next.js 15 Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com)

---

## 🎯 Success Criteria

### Technical Success
- ✅ Database schema completo e funcional
- ✅ Design system ness. implementado
- ✅ Docker stack funcionando localmente
- ⏳ Backend API 100% funcional
- ⏳ Frontend 100% funcional
- ⏳ Testes com 80%+ coverage
- ⏳ Performance Lighthouse >90

### Compliance Success
- ✅ 50 documentos obrigatórios mapeados
- ⏳ 39 documentos obrigatórios criados
- ⏳ ANEEL RN 964/2021 100% conforme
- ⏳ ONS 5 controles implementados
- ⏳ IEC 62443 SL2 atingido

### Business Success
- ⏳ Redução tempo de compliance de 6 meses → 2 meses
- ⏳ Visibilidade 100% de documentação
- ⏳ Automação de alertas de revisão
- ⏳ Relatórios executivos automáticos

---

**Document End**

**Version**: 1.0  
**Date**: 2025-01-20  
**Next Review**: 2025-02-20  
**Classification**: CONFIDENCIAL - Interno ness.  
**Total Lines**: 1.000+  
**Mantainer**: ness. OT GRC Team
