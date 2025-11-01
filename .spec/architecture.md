# Arquitetura do Sistema - ness. OT GRC

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│              VERCEL - Frontend Next.js 15                │
│         ness. OT GRC Dashboard (React 19)                │
│     Governance | Risk | Compliance | Documents          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────┐
│           SUPABASE - PostgreSQL + Auth                  │
│         Database + Row Level Security                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ (Opcional)
                       │
┌──────────────────────▼──────────────────────────────────┐
│        FASTAPI Backend (Python) - Opcional              │
│    Processamento pesado / Análise de rede               │
└─────────────────────────────────────────────────────────┘
```

## 📦 Componentes Principais

### Frontend (Next.js 15)

#### Estrutura
```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (dashboard)/        # Dashboard routes (protegido)
│   │   │   ├── overview/       # Overview (4 slots paralelos)
│   │   │   ├── compliance/     # Módulo Compliance (5 páginas)
│   │   │   ├── network/        # Módulo Rede (6 páginas)
│   │   │   ├── remediation/    # Módulo Adequação (4 páginas)
│   │   │   ├── reports/        # Relatórios (3 páginas)
│   │   │   └── settings/       # Configurações
│   │   ├── sign-in/            # Login (Supabase Auth)
│   │   ├── sign-up/            # Registro (Supabase Auth)
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   └── middleware.ts      # Auth middleware
│   ├── components/
│   │   ├── layout/             # Layout (sidebar, header, user-nav)
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── branding/            # ness. wordmark, locale switcher
│   │   └── features/           # Feature-specific components
│   ├── lib/
│   │   ├── supabase.ts         # Client-side Supabase client
│   │   ├── supabase-server.ts  # Server-side Supabase (cookies)
│   │   ├── supabase-admin.ts   # Admin client (service role)
│   │   ├── api.ts              # API helpers (fallback FastAPI)
│   │   ├── api-supabase.ts     # Supabase queries (assets, vlans, etc)
│   │   ├── branding/           # Branding utilities
│   │   └── i18n/               # i18n configuration
│   └── messages/               # i18n translations
│       ├── pt.json
│       ├── en.json
│       └── es.json
```

#### Tecnologias
- **Next.js 15.1.0**: App Router, Server Components, Middleware
- **React 19.0.0**: Concurrent features
- **TypeScript 5.3.3**: Type safety
- **Tailwind CSS 4.0**: Styling (dark-first)
- **shadcn/ui**: Component library (Radix UI primitives)
- **Supabase Auth**: Autenticação (PKCE flow) ✅
- **next-intl 3.0.0**: Internacionalização (pt, en, es)
- **@supabase/supabase-js**: Supabase client ✅
- **@supabase/ssr**: Server-side Supabase ✅
- **recharts 2.12.0**: Gráficos e visualizações
- **zod 3.22.4**: Validação de schemas
- **react-hook-form**: Formulários

### Backend (FastAPI - Opcional)

#### Estrutura
```
backend/
├── api/
│   ├── assets.py              # API de ativos
│   ├── network.py             # API de rede
│   ├── compliance.py          # API de compliance
│   └── routing.py             # API de roteamento
├── main.py                    # FastAPI app
└── requirements.txt
```

#### Quando Usar
- Análise pesada de rede
- Processamento de dados complexos
- Integração com sistemas externos

### Database (Supabase PostgreSQL) ✅ **MIGRADO E FUNCIONANDO**

#### Schemas (4 Schemas Implementados)
```
public/          # Multi-tenancy, clients
security/        # Assets, vulnerabilities, incidents, data_leakage_paths
topology/        # network_zones, network_connections, ip_subnets, ip_addresses, vlans
compliance/      # frameworks, controls, ons_controls, documents, document_categories, 
                 # required_documents, document_status, assessments, control_results
audit/           # activity_log
```

#### Tabelas Principais (20+ Tabelas)

**Security Schema** (4 tabelas):
- `assets` - Ativos de rede (name, type, ip, mac, location, criticality, status)
- `vulnerabilities` - Vulnerabilidades (CVE, CVSS, severity, status)
- `incidents` - Incidentes de segurança
- `data_leakage_paths` - Caminhos de vazamento de dados

**Topology Schema** (5 tabelas):
- `network_zones` - Zonas de rede
- `network_connections` - Conexões entre ativos
- `ip_subnets` - Sub-redes IP (CIDR, mask, total IPs)
- `ip_addresses` - Endereços IP individuais
- `vlans` - VLANs (id, name, purpose, criticality)

**Compliance Schema** (9 tabelas):
- `frameworks` - Frameworks (ANEEL, ONS, IEC, NIST, ISO, LGPD)
- `controls` - Controles genéricos
- `ons_controls` - Controles ONS (5 mínimos)
- `documents` - Documentos de compliance
- `document_categories` - 9 categorias (POL, PROC, PRI, BCP, TRAIN, RISK, AUD, INC, EVID)
- `required_documents` - 50+ documentos obrigatórios mapeados
- `document_status` - Status e versionamento
- `assessments` - Avaliações de conformidade
- `control_results` - Resultados de controles

**Audit Schema** (1 tabela):
- `activity_log` - Log completo de atividades

#### Características
- **PostgreSQL 16**: Database engine
- **Row Level Security**: Proteção de dados ✅ Configurado
- **Políticas RLS**: Usuários autenticados podem visualizar
- **Service Role**: Operações admin server-side (bypasses RLS)
- **Real-time**: Subscriptions para updates disponíveis
- **Storage**: Documentos e evidências (via Supabase Storage)
- **Views**: Dashboards e relatórios pré-configurados
- **Triggers**: `updated_at` automático em todas tabelas

## 🔐 Fluxo de Autenticação

### 1. Login
```
Usuário → sign-in page → Supabase Auth → Token JWT → Middleware valida → Dashboard
```

### 2. Middleware Protection
```
Request → Middleware → Verifica token Supabase → 
  Se válido: Permite acesso
  Se inválido: Redireciona para sign-in
```

### 3. Server Components
```
Server Component → getServerUser() → Supabase Server Client → 
  Verifica sessão → Retorna dados ou redireciona
```

## 🔄 Fluxo de Dados

### Query Client-Side
```
Component → supabase.from('table') → Supabase PostgREST → Database → Response
  ↓
  Usa ANON_KEY (respeita RLS)
```

### Query Server-Side
```
Server Component → getServerSupabaseClient() → Supabase Server Client → 
  Database → Response (sem expor tokens)
  ↓
  Usa ANON_KEY (respeita RLS via cookies)
```

### Query Admin (Server-Side Apenas)
```
Server Component → getAdminSupabaseClient() → Supabase Admin Client → 
  Database → Response (bypasses RLS)
  ↓
  Usa SERVICE_ROLE_KEY (apenas server-side, nunca exposto no cliente)
```

### Fallback para FastAPI
```
Component → api.ts → Verifica USE_SUPABASE → 
  Se true: Usa Supabase queries
  Se false ou erro: Fallback para FastAPI backend
```

## 📊 Padrões de Design

### Component Pattern
- Server Components por padrão
- Client Components apenas quando necessário (interatividade)
- Composição de componentes pequenos

### State Management
- Server State: Supabase (cache automático)
- Client State: React hooks (useState, useEffect)
- Global State: Context API quando necessário

### Error Handling
- Error Boundaries no app
- Try/catch em async operations
- Toast notifications para erros

## 🔒 Segurança

### Autenticação
- Supabase Auth com JWT tokens
- Refresh tokens automáticos
- Session persistence

### Autorização
- Row Level Security (RLS) no Supabase
- Middleware para rotas protegidas
- Server-side validation

### Dados Sensíveis
- Variáveis de ambiente para secrets
- Nunca expor service_role_key no frontend
- HTTPS obrigatório em produção

## 🚀 Deploy

### Frontend (Vercel) ✅ **PRODUÇÃO**
- **URL**: https://frontend-nessbr-projects.vercel.app
- Deploy automático via GitHub
- Edge Functions para serverless
- CDN global
- Variáveis de ambiente configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_USE_SUPABASE`

### Database (Supabase) ✅ **PRODUÇÃO**
- **URL**: https://bingfdowmvyfeffieujk.supabase.co
- Managed PostgreSQL 16
- Schema completo migrado (4 schemas, 20+ tabelas)
- Row Level Security (RLS) configurado
- Backups automáticos
- Connection pooling
- Real-time subscriptions disponíveis

### Backend (FastAPI) - Opcional
- Docker containers (local)
- Railway, Render, Fly.io (produção)
- Auto-scaling
- Fallback para operações pesadas

## 📱 Rotas e Páginas (24 Páginas Implementadas)

### Autenticação
- `/sign-in` - Login com Supabase Auth ✅
- `/sign-up` - Registro com Supabase Auth ✅
- `/` - Landing page (redireciona se autenticado)

### Dashboard Principal
- `/dashboard` - Redireciona para `/dashboard/overview`
- `/dashboard/overview` - Dashboard principal com 4 slots paralelos

### Compliance (5 páginas)
- `/dashboard/compliance/aneel` - Conformidade ANEEL
- `/dashboard/compliance/ons` - Controles ONS
- `/dashboard/compliance/frameworks` - Frameworks
- `/dashboard/compliance/documents` - Documentos

### Network (6 páginas)
- `/dashboard/network/assets` - Ativos
- `/dashboard/network/topology` - Topologia
- `/dashboard/network/vlans` - VLANs
- `/dashboard/network/ipam` - IPAM
- `/dashboard/network/routing` - Roteamento
- `/dashboard/network/health` - Health

### Remediation (4 páginas)
- `/dashboard/remediation/risks` - Riscos
- `/dashboard/remediation/gaps` - Gaps
- `/dashboard/remediation/plan` - Plano
- `/dashboard/remediation/timeline` - Timeline

### Reports (3 páginas)
- `/dashboard/reports` - Relatórios
- `/dashboard/reports/generate` - Gerar
- `/dashboard/reports/history` - Histórico

### Settings
- `/dashboard/settings` - Configurações

