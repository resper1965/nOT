# ness. OT GRC - Especificação do Projeto

**Última Atualização**: 2025-11-01  
**Versão**: 1.0.0  
**Status**: ✅ **EM PRODUÇÃO**

## 📋 Visão Geral

**ness. OT GRC** é a primeira plataforma brasileira especializada em **Governance, Risk and Compliance (GRC)** para redes de **Tecnologia Operacional (OT)** do setor elétrico.

**URL de Produção**: https://frontend-nessbr-projects.vercel.app

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
- **ANEEL RN 964/2021**: Framework completo implementado (7 pilares)
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

## 📊 Arquitetura

### Stack Tecnológica (Atual)

#### Frontend
- **Framework**: Next.js 15.1.0 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.3.3
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.0
- **Autenticação**: Supabase Auth (PKCE flow)
- **i18n**: next-intl 3.0.0 (pt, en, es)
- **Design System**: ness. (dark-first, Montserrat, #00ADE8)

#### Backend
- **Framework**: FastAPI (Python) - Opcional
- **Database**: PostgreSQL 16 (via Supabase)
- **Cache**: Redis 7 - Opcional
- **API**: RESTful - Fallback opcional

#### Infraestrutura
- **Deploy**: Vercel (Frontend) ✅ **PRODUÇÃO**
- **Database**: Supabase (PostgreSQL gerenciado) ✅ **PRODUÇÃO**
- **URL Produção**: https://frontend-nessbr-projects.vercel.app
- **Containerização**: Docker Compose (desenvolvimento local)

### Estrutura do Projeto

```
TBE-OT/
├── frontend/                    # Next.js 15 + React 19
│   ├── src/
│   │   ├── app/                 # App Router (Next.js 15)
│   │   │   ├── (dashboard)/     # Dashboard routes
│   │   │   │   ├── overview/    # Dashboard overview (4 slots paralelos)
│   │   │   │   ├── compliance/  # Módulo Compliance
│   │   │   │   │   ├── aneel/   # Conformidade ANEEL
│   │   │   │   │   ├── ons/     # Controles ONS
│   │   │   │   │   ├── frameworks/ # Frameworks
│   │   │   │   │   └── documents/ # Documentos
│   │   │   │   ├── network/     # Módulo Rede
│   │   │   │   │   ├── assets/ # Ativos
│   │   │   │   │   ├── topology/ # Topologia
│   │   │   │   │   ├── vlans/   # VLANs
│   │   │   │   │   ├── ipam/    # IP Management
│   │   │   │   │   ├── routing/ # Roteamento
│   │   │   │   │   └── health/  # Health monitoring
│   │   │   │   ├── remediation/ # Módulo Adequação
│   │   │   │   │   ├── risks/   # Riscos
│   │   │   │   │   ├── gaps/    # Gaps
│   │   │   │   │   ├── plan/    # Plano
│   │   │   │   │   └── timeline/ # Timeline
│   │   │   │   ├── reports/    # Relatórios
│   │   │   │   │   ├── generate/ # Gerar
│   │   │   │   │   └── history/  # Histórico
│   │   │   │   └── settings/   # Configurações
│   │   │   ├── sign-in/        # Autenticação
│   │   │   ├── sign-up/        # Registro
│   │   │   └── page.tsx        # Landing page
│   │   ├── components/
│   │   │   ├── layout/          # Layout components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── branding/        # Branding (ness. wordmark, locale switcher)
│   │   │   └── features/        # Feature components
│   │   ├── lib/
│   │   │   ├── supabase.ts      # Supabase client (client-side)
│   │   │   ├── supabase-server.ts # Server-side Supabase
│   │   │   ├── supabase-admin.ts # Admin client (service role)
│   │   │   ├── api.ts           # API helpers (fallback FastAPI)
│   │   │   ├── api-supabase.ts  # Supabase queries
│   │   │   ├── branding/        # Branding utilities
│   │   │   └── i18n/            # i18n config
│   │   └── middleware.ts        # Auth middleware
│   ├── messages/                # i18n translations
│   │   ├── pt.json
│   │   ├── en.json
│   │   └── es.json
│   ├── vercel.json              # Vercel config
│   └── package.json
├── backend/                     # FastAPI (Python) - Opcional
│   ├── api/
│   ├── main.py
│   └── requirements.txt
├── database/                    # PostgreSQL schemas
│   └── init/
│       ├── 01-init.sql          # Schema principal
│       ├── 02-compliance-documents.sql # Documentos
│       └── 03-network-topology-schema.sql # Topologia
├── migration/                   # Migração Supabase
│   ├── supabase-migration.sql  # Script completo
│   └── fix-policies.sql         # Correção RLS
├── docs/                        # Documentação
├── .spec/                       # Especificações (Spec Kit)
│   ├── config.toml
│   ├── project.md
│   ├── architecture.md
│   ├── requirements.md
│   └── README.md
└── docker-compose.yml
```

**Total**: 24 páginas do dashboard implementadas

## 🔐 Autenticação e Segurança

- **Autenticação**: Supabase Auth ✅ **IMPLEMENTADO**
  - PKCE flow (enhanced security)
  - Session persistence
  - Auto refresh tokens
  - Email/Password auth
- **Autorização**: Row Level Security (RLS) no Supabase ✅ **CONFIGURADO**
  - RLS habilitado nas tabelas principais
  - Políticas para usuários autenticados
  - Service role para operações admin (server-side apenas)
- **MFA**: Suportado via Supabase (configurável)
- **Sessões**: Gerenciadas pelo Supabase
- **Middleware**: Proteção de rotas implementada ✅

## 📊 Dashboard e Rotas (24 Páginas)

### Overview
- `/dashboard/overview` - Dashboard principal (4 slots paralelos)

### Compliance (5 páginas)
- `/dashboard/compliance/aneel` - Conformidade ANEEL RN 964/2021
- `/dashboard/compliance/ons` - Controles ONS (5 mínimos)
- `/dashboard/compliance/frameworks` - Frameworks (IEC, NIST, ISO, etc)
- `/dashboard/compliance/documents` - Gestão de documentos

### Network (6 páginas)
- `/dashboard/network/assets` - Inventário de ativos
- `/dashboard/network/topology` - Topologia de rede
- `/dashboard/network/vlans` - Gestão de VLANs
- `/dashboard/network/ipam` - IP Address Management
- `/dashboard/network/routing` - Análise de roteamento
- `/dashboard/network/health` - Monitoramento de saúde

### Remediation (4 páginas)
- `/dashboard/remediation/risks` - Gestão de riscos
- `/dashboard/remediation/gaps` - Gap analysis
- `/dashboard/remediation/plan` - Plano de adequação
- `/dashboard/remediation/timeline` - Timeline de remediação

### Reports (3 páginas)
- `/dashboard/reports` - Relatórios
- `/dashboard/reports/generate` - Gerar relatórios
- `/dashboard/reports/history` - Histórico

### Settings
- `/dashboard/settings` - Configurações

## 📈 Métricas e Monitoramento

- **Uptime**: 99.99% (obrigatório para OT)
- **Latência**: < 100ms para operações críticas
- **Disponibilidade**: 24/7
- **Deploy**: Automático via GitHub → Vercel ✅

## 🔗 Integrações

- **Supabase**: Database, Auth, Storage ✅ **PRODUÇÃO**
  - URL: https://bingfdowmvyfeffieujk.supabase.co
  - Database migrado e funcionando
  - Auth configurado e funcionando
  - RLS configurado
- **Vercel**: Deploy e CDN ✅ **PRODUÇÃO**
  - URL: https://frontend-nessbr-projects.vercel.app
  - Deploy automático via GitHub
  - Variáveis de ambiente configuradas
- **GitHub**: Versionamento ✅
  - Repo: https://github.com/resper1965/nOT
- **Docker**: Ambiente de desenvolvimento (opcional)

## 🗄️ Database Schema (Supabase)

### Schemas Implementados (4)

1. **`security`** - Segurança
   - `assets` - Ativos de rede
   - `vulnerabilities` - Vulnerabilidades
   - `incidents` - Incidentes
   - `data_leakage_paths` - Caminhos de vazamento

2. **`topology`** - Topologia de Rede
   - `network_zones` - Zonas de rede
   - `network_connections` - Conexões
   - `ip_subnets` - Sub-redes IP
   - `ip_addresses` - Endereços IP
   - `vlans` - VLANs

3. **`compliance`** - Conformidade
   - `frameworks` - Frameworks (ANEEL, ONS, IEC, NIST, ISO)
   - `controls` - Controles
   - `ons_controls` - Controles ONS
   - `documents` - Documentos
   - `document_categories` - Categorias (9 categorias)
   - `required_documents` - Documentos obrigatórios (50+)
   - `document_status` - Status de documentos
   - `assessments` - Avaliações
   - `control_results` - Resultados de controles

4. **`audit`** - Auditoria
   - `activity_log` - Log de atividades

### Views e Funções
- Views para dashboards e relatórios
- Triggers para `updated_at` automático
- Funções para atualização de timestamps

## 📝 Documentação Adicional

- `README.md` - Visão geral completa
- `SUPABASE-INTEGRATION.md` - Integração Supabase detalhada
- `VERCEL-DEPLOY-GUIDE.md` - Guia de deploy Vercel
- `MIGRACAO-CONCLUIDA.md` - Status da migração
- `DEBUG-AUTH.md` - Debug de autenticação
- `SPEC-KIT-STATUS.md` - Status do Spec Kit
- `docs/` - Documentação técnica detalhada

## ✅ Status Atual

- ✅ **Frontend**: Deployado na Vercel
- ✅ **Database**: Migrado para Supabase
- ✅ **Auth**: Supabase Auth funcionando
- ✅ **RLS**: Configurado e ativo
- ✅ **24 Páginas**: Dashboard completo
- ✅ **50+ Documentos**: Mapeados e rastreáveis
- ✅ **4 Schemas**: Database completo
- ✅ **Service Role**: Configurado para operações admin

