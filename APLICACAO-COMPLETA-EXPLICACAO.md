# 📚 Explicação Completa: Aplicação ness. OT GRC

**Data:** 2025-11-02  
**Projeto:** ness. OT GRC - Aplicação Completa

---

## 🎯 Visão Geral da Aplicação

**ness. OT GRC** é uma aplicação completa de **Governance, Risk & Compliance (GRC)** para redes **Operational Technology (OT)** do setor elétrico.

**Aplicação = TODO o repositório**, não apenas o frontend!

---

## 📦 Estrutura Completa da Aplicação

### 1. **Frontend** (Next.js 15 + React 19)

**Localização:** `frontend/`

**O que é:**
- Interface web completa
- Dashboard GRC (Governance, Risk, Compliance)
- Gestão documental
- Visualização de dados

**Tecnologias:**
- Next.js 15.1.0 (App Router)
- React 19.0.0
- TypeScript 5.3.3
- Tailwind CSS v4
- Shadcn/ui
- Supabase Auth
- Recharts

**Estrutura:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout root
│   │   ├── page.tsx                 # Landing page
│   │   └── dashboard/
│   │       ├── layout.tsx            # ✅ Layout migrado (ness-theme)
│   │       ├── overview/            # Dashboard principal
│   │       ├── compliance/          # Módulo Normativa
│   │       ├── network/             # Módulo Análise de Rede
│   │       ├── remediation/         # Módulo Adequação
│   │       ├── reports/              # Relatórios
│   │       └── settings/            # Configurações
│   └── components/
│       ├── dashboard/               # ✅ Componentes migrados
│       │   ├── sidebar.tsx          # ✅ Menu lateral
│       │   ├── header.tsx           # ✅ Cabeçalho
│       │   └── dashboard-layout.tsx # ✅ Layout base
│       └── ui/                      # Componentes Shadcn
├── lib/
│   ├── supabase.ts                  # Cliente Supabase
│   └── utils.ts                     # Utilitários
├── package.json
├── vercel.json                       # Config Vercel
└── Dockerfile.prod                  # Build produção
```

**Migração realizada:**
- ✅ Layout migrado para template ness-theme
- ✅ Sidebar, Header, DashboardLayout criados
- ✅ 100% funcionalidades preservadas

---

### 2. **Backend** (FastAPI + Python)

**Localização:** `backend/`

**O que é:**
- API REST completa
- Lógica de negócio
- Processamento de dados
- Integração com database

**Tecnologias:**
- FastAPI (Python 3.11)
- SQLAlchemy (ORM)
- Pydantic (validação)
- PostgreSQL (via SQLAlchemy)
- Redis (cache/sessions)

**Estrutura:**
```
backend/
├── main.py                          # API principal
├── api/
│   └── v1/                          # Endpoints API
├── models/                          # SQLAlchemy models
├── services/                        # Lógica de negócio
├── schemas/                         # Pydantic schemas
├── requirements.txt                 # Dependências Python
└── Dockerfile                       # Build Docker
```

**Endpoints principais:**
- `/` - Health check
- `/api/v1/security/summary` - Resumo de segurança
- `/docs` - Swagger UI
- `/redoc` - ReDoc

**Scripts Python:**
- `analyze_topology.py` - Análise de topologia
- `import_tbe_simple.py` - Importação de dados TBE
- `parse_routing_tables.py` - Análise de roteamento
- `classify_vlans_purdue.py` - Classificação Purdue
- `reclassify_criticality.py` - Reclassificação de criticidade

---

### 3. **Database** (PostgreSQL 16)

**Localização:** `database/`

**O que é:**
- Banco de dados principal
- 4 schemas especializados
- 40+ tabelas
- Views e triggers

**Schemas:**

1. **`security.*`** - Segurança
   - `assets` - Ativos de rede
   - `vulnerabilities` - Vulnerabilidades
   - `incidents` - Incidentes
   - `threats` - Ameaças

2. **`topology.*`** - Topologia
   - `ip_subnets` - Subredes IP
   - `ip_addresses` - Endereços IP
   - `vlans` - VLANs
   - `connections` - Conexões

3. **`compliance.*`** - Conformidade
   - `frameworks` - Frameworks (ANEEL, ONS, IEC 62443)
   - `controls` - Controles
   - `documents` - Documentos obrigatórios
   - `evidence` - Evidências

4. **`audit.*`** - Auditoria
   - `logs` - Logs de sistema
   - `changes` - Mudanças rastreadas

**Estrutura:**
```
database/
└── init/
    ├── 01-init.sql                  # Schema principal (300+ linhas)
    └── 02-compliance-documents.sql  # Compliance schema (500+ linhas)
```

**Dados processados:**
- 3.907 ativos mapeados
- 109 subnets identificadas
- 59 VLANs mapeadas
- 1.345 conexões analisadas

---

### 4. **Docker Compose** (Infraestrutura Completa)

**Localização:** `docker-compose.yml` (raiz)

**O que é:**
- Stack completa containerizada
- 5 serviços orquestrados
- Volumes persistentes
- Network isolada

**Serviços:**

1. **PostgreSQL** (porta 5434)
   - Database: `ness_ot_grc`
   - User: `ness_admin`
   - Auto-init via `database/init/`

2. **pgAdmin** (porta 5050)
   - Interface gráfica para PostgreSQL
   - Email: `admin@ness.local`

3. **Backend FastAPI** (porta 8001)
   - API REST
   - Hot reload em desenvolvimento
   - Swagger em `/docs`

4. **Frontend Next.js** (porta 3002)
   - Interface web
   - Hot reload em desenvolvimento

5. **Redis** (porta 6381)
   - Cache
   - Sessions
   - Message queue (futuro)

**Comandos:**
```bash
# Subir tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

### 5. **Documentação** (BMAD Framework)

**Localização:** `docs/`

**O que é:**
- Framework BMAD (AI-driven)
- Agentes especializados
- Workflows estruturados
- Tasks executáveis
- Templates de relatórios

**Estrutura:**
```
docs/
├── bmad-agents/
│   └── network-security-analyst.md  # Agente SecOps
├── bmad-workflows/
│   └── network-vulnerability-analysis.yaml
├── bmad-tasks/
│   ├── analyze-network-topology.md
│   ├── detect-data-leakage.md
│   ├── scan-vulnerabilities.md
│   └── assess-compliance.md
├── bmad-templates/
│   ├── security-assessment-tmpl.yaml
│   ├── vulnerability-report-tmpl.yaml
│   └── threat-model-tmpl.yaml
├── architecture/
│   └── SYSTEM-ARCHITECTURE-3-FRONTS.md
├── compliance/
│   ├── ANEEL-RN-964-2021.md
│   └── ONS-REQUIREMENTS.md
└── security/
    └── tbe-network-analysis-real-data.md
```

**Agente BMAD:**
- **Network Security Analyst**
- 9 comandos especializados
- Frameworks: NIST, MITRE ATT&CK, IEC 62443

---

### 6. **Scripts e Assets**

**Localização:** Raiz e `scripts/`

**Scripts Python:**
- `analyze_topology.py` - Análise de topologia TBE
- `import_tbe_simple.py` - Importação de dados
- `parse_routing_tables.py` - Análise de roteamento

**Assets:**
- `assets/Topologia_TBE_full.json` - Dados TBE (1GB+)
- 13.280 objetos mapeados
- 3.907 ativos catalogados

---

## 🏗️ Arquitetura Completa

### Arquitetura Local (Docker)

```
┌─────────────────────────────────────┐
│   FRONTEND - Next.js 15             │
│   ness. OT GRC Dashboard            │
│   Porta: 3002                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   BACKEND - FastAPI (Python)        │
│   API REST + Business Logic         │
│   Porta: 8001                       │
└──────────────┬──────────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
     ▼         ▼         ▼
┌─────────┐ ┌────────┐ ┌────────┐
│PostgreSQL│ │ Redis │ │ Files │
│ Porta:  │ │Porta: │ │Storage│
│  5434   │ │ 6381  │ │ Local │
└─────────┘ └────────┘ └────────┘
```

### Arquitetura Produção (Vercel + Supabase)

```
┌─────────────────────────────────────┐
│   VERCEL - Frontend Next.js 15      │
│   ness. OT GRC Dashboard            │
│   https://frontend-nessbr...app     │
└──────────────┬──────────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
     ▼         ▼         ▼
┌──────────┐ ┌─────────┐ ┌──────────┐
│Supabase  │ │Supabase │ │Supabase  │
│PostgreSQL│ │  Auth   │ │ Storage  │
│          │ │         │ │          │
└──────────┘ └─────────┘ └──────────┘
     │
     ▼
┌─────────────────────────────────────┐
│   FastAPI Backend (Opcional)        │
│   Processamento pesado              │
│   VPS/Docker                        │
└─────────────────────────────────────┘
```

---

## 🚀 Deploy e Configuração

### Deploy Local (Docker)

**Para rodar a aplicação completa:**

```bash
# 1. Clone o repositório
git clone https://github.com/resper1965/nOT.git
cd TBE-OT

# 2. Suba a stack completa
docker-compose up -d

# 3. Acesse os serviços
# Frontend:  http://localhost:3002
# Backend:   http://localhost:8001/docs
# pgAdmin:  http://localhost:5050
# Database: localhost:5434
```

**O que sobe:**
- ✅ Frontend (Next.js)
- ✅ Backend (FastAPI)
- ✅ Database (PostgreSQL)
- ✅ pgAdmin (UI)
- ✅ Redis (Cache)

---

### Deploy Produção (Vercel)

**Frontend apenas (por enquanto):**

O Vercel está configurado apenas para o **frontend** porque:
1. **Vercel é uma plataforma de hospedagem para frontend**
2. Backend pode rodar em VPS separado ou usar Supabase
3. Database usa Supabase PostgreSQL

**Configuração Vercel:**
- Projeto: `frontend`
- Root Directory: `frontend`
- Framework: Next.js
- Deploy automático via GitHub

**Status:**
- ✅ Frontend deployado/aguardando deploy
- ⏳ Backend pode rodar separado (VPS/Docker)
- ✅ Database usa Supabase

---

## 📊 O Que Foi Feito na Migração

### Migração Realizada

**Apenas no Frontend:**
- ✅ Layout migrado para template ness-theme
- ✅ Sidebar, Header, DashboardLayout criados
- ✅ Visual modernizado
- ✅ 100% funcionalidades preservadas

**NÃO afetado:**
- ✅ Backend (intacto)
- ✅ Database (intacto)
- ✅ Docker Compose (intacto)
- ✅ Scripts Python (intactos)
- ✅ Documentação (intacta)

---

## ✅ Componentes da Aplicação

| Componente | Localização | Tecnologia | Status |
|------------|-------------|------------|--------|
| **Frontend** | `frontend/` | Next.js 15 | ✅ Migrado |
| **Backend** | `backend/` | FastAPI | ✅ Operacional |
| **Database** | `database/` | PostgreSQL | ✅ Configurado |
| **Docker** | `docker-compose.yml` | Docker | ✅ Pronto |
| **Docs** | `docs/` | Markdown | ✅ Completo |
| **Scripts** | Raiz | Python | ✅ Funcionando |

---

## 🎯 Resumo

**Aplicação Completa = TODO o Repositório:**

1. **Frontend** → Interface web (Next.js)
2. **Backend** → API REST (FastAPI)
3. **Database** → PostgreSQL (4 schemas)
4. **Docker** → Orquestração (5 serviços)
5. **Docs** → BMAD framework
6. **Scripts** → Análise e importação

**Migração:**
- Apenas layout do frontend
- Resto da aplicação intacto
- Vercel configurado apenas para frontend

---

**Aplicação completa e funcional!** 🚀

