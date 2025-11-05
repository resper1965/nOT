# Stack Tecnológica - ness. OT GRC

**Versão**: 2.0  
**Data**: 2025-01-04  
**Status**: ✅ Atualizado - Reflete Estado Atual

---

## 📋 Visão Geral

O **ness. OT GRC** utiliza uma arquitetura **Supabase-first** com Next.js, eliminando a necessidade de um backend separado (Python/FastAPI). Toda a lógica de backend é gerenciada via Supabase (PostgreSQL, Auth, Storage, Edge Functions) e Next.js API Routes.

---

## 🎨 Frontend Stack

### Core Framework

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Next.js** | 15.1.0 | React framework com SSR/SSG | App Router, Server Components, API Routes integradas |
| **React** | 19.0.0 | Biblioteca UI | Versão mais recente, melhor performance |
| **TypeScript** | 5.3.3 | Type safety | Strict mode, garantia de qualidade de código |

### Styling & UI

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Tailwind CSS** | 4.0.0 | Utility-first CSS | ness. design system, desenvolvimento rápido |
| **Shadcn/ui** | Latest | Component library | Radix UI primitives, acessibilidade WCAG AA |
| **Lucide React** | 0.344.0 | Ícones | Monocolor, stroke 1.5, alinhado ao design ness. |

### Forms & Validation

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **React Hook Form** | 7.50.1 | Gerenciamento de formulários | Performance, validação declarativa |
| **Zod** | 3.22.4 | Schema validation | Type-safe, runtime validation |

### Data & State

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Tanstack Table** | 8.11.3 | Tabelas de dados | Paginação, filtros, sorting avançado |
| **Zustand** | 4.5.0 | State management | Leve, simples, sem boilerplate |
| **Recharts** | 2.12.0 | Visualização de dados | Gráficos de compliance, KPIs |

### Utilities

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Sonner** | 1.7.1 | Notificações toast | UX moderna, não intrusiva |
| **next-themes** | 0.4.6 | Theme management | Dark mode, persistência |
| **nextjs-toploader** | 3.7.15 | Loading indicator | Feedback visual de navegação |

### File Handling

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **react-dropzone** | 14.2.0 | Upload de arquivos | Drag & drop, múltiplos arquivos |
| **pdf-parse** | 1.1.1 | Parsing de PDF | Extração de texto de evidências |
| **mammoth** | 1.6.0 | Conversão DOCX | Conversão de documentos Word |
| **turndown** | 7.1.3 | HTML to Markdown | Conversão de documentos para MD |

### Package Manager & Runtime

- **Package Manager**: `pnpm` (≥8.0.0)
- **Node Version**: ≥20.0.0
- **Build Tool**: Next.js Turbopack (built-in)

---

## 🗄️ Backend & Database Stack

### Arquitetura: Supabase-First

**Decisão Arquitetural**: Eliminação de backend separado (FastAPI/Python). Todo backend é gerenciado via:

1. **Supabase PostgreSQL** - Database principal
2. **Supabase Edge Functions** - Serverless functions (TypeScript/Deno)
3. **Next.js API Routes** - API REST endpoints
4. **Supabase Auth** - Autenticação e autorização
5. **Supabase Storage** - Armazenamento de arquivos

### Database

| Tecnologia | Versão | Propósito | Justificativa |
|------------|--------|-----------|---------------|
| **Supabase PostgreSQL** | 15+ | Database principal | Managed PostgreSQL, RLS, realtime |
| **pgvector** | Latest | Vector database | Semantic search, AI embeddings (futuro) |

### API Layer

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Next.js API Routes** | REST endpoints | Server-side, tipado, integrado com frontend |
| **Supabase Client** | `@supabase/supabase-js@2.39.3` | Cliente oficial, autenticação automática |
| **Supabase SSR** | `@supabase/ssr@0.1.0` | Server-side rendering seguro |

### Serverless Functions

| Tecnologia | Runtime | Propósito | Justificativa |
|------------|---------|-----------|---------------|
| **Supabase Edge Functions** | Deno (TypeScript) | Serverless functions | Integração Wazuh, Zabbix, RMM, AI agent |

**Edge Functions Implementadas**:
- `ingest_wazuh` - Ingestão de eventos do Wazuh
- `ingest_zabbix` - Ingestão de métricas do Zabbix
- `ingest_rmm` - Ingestão de dados de RMM (patch, inventory)
- `agent_evaluate` - Agente AI para avaliação de compliance

### Authentication & Authorization

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Supabase Auth** | Autenticação | JWT, OAuth, magic links, RLS policies |
| **Row Level Security (RLS)** | Autorização | Segurança a nível de linha no banco |

### File Storage

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Supabase Storage** | Armazenamento de arquivos | Buckets, CDN, RLS policies para arquivos |

**Buckets Configurados**:
- `evidence` - Pacotes de evidência (PDFs, logs, prints)

---

## 🚀 Deployment Stack

### Frontend Deployment

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Vercel** | Hosting e CI/CD | Deploy automático via Git, edge functions, preview deployments |

### Database & Backend

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Supabase Cloud** | Managed PostgreSQL, Auth, Storage | Fully managed, backups automáticos, escalabilidade |
| **Neon Database** | PostgreSQL online | Usado para todos os ambientes (dev, staging, prod) |

### CI/CD

| Tecnologia | Propósito | Justificativa |
|------------|-----------|---------------|
| **Vercel Git Integration** | Deploy automático | Deploy em cada push, preview deployments |
| **Supabase CLI** | Migrations e Edge Functions | Versionamento de schema, deploy de functions |

---

## 📦 Database Schema

### Schemas Principais

1. **`public`** - Tabelas públicas (clients, users)
2. **`security`** - Assets, vulnerabilidades, incidentes, findings
3. **`topology`** - Topologia de rede (zones, connections, routing_tables)
4. **`compliance`** - Frameworks, controls, assessments, evidence_packages, attestations, crosswalk, exceptions
5. **`integration`** - Eventos de sistemas externos (Wazuh, Zabbix, RMM)
6. **`audit`** - Logs de auditoria e rastreabilidade
7. **`ops`** - Mudanças OT, backups, baselines

---

## 🔧 Development Tools

### Code Quality

| Tecnologia | Propósito |
|------------|-----------|
| **ESLint** | Linting JavaScript/TypeScript |
| **Prettier** | Formatação de código |
| **TypeScript** | Type checking |

### Version Control

| Tecnologia | Propósito |
|------------|-----------|
| **Git** | Versionamento |
| **GitHub** | Repositório remoto |

---

## 🎯 Decisões Arquiteturais Importantes

### 1. Supabase-First Architecture

**Decisão**: Eliminar backend FastAPI/Python separado.

**Motivos**:
- Redução de complexidade (menos serviços para gerenciar)
- RLS nativo no banco de dados
- Edge Functions serverless para lógica de backend
- Auth integrado sem configuração adicional
- Storage integrado com RLS

**Trade-offs**:
- ✅ Menos infraestrutura para gerenciar
- ✅ Deploy mais simples
- ✅ Custo reduzido (sem servidor backend separado)
- ⚠️ Edge Functions limitadas a Deno (não Python)
- ⚠️ Algumas operações complexas podem requerer Edge Functions

### 2. Next.js API Routes vs. Edge Functions

**Decisão**: Usar Next.js API Routes para lógica de negócio, Edge Functions para integrações externas.

**Motivos**:
- API Routes: Tipadas com TypeScript, integradas com frontend, deploy junto
- Edge Functions: Melhor para webhooks, integrações assíncronas, eventos externos

### 3. Neon Database para Todos os Ambientes

**Decisão**: Usar Neon online database para dev, staging e prod.

**Motivos**:
- Consistência entre ambientes
- Sem necessidade de PostgreSQL local
- Backups automáticos
- Escalabilidade

---

## 📊 Status de Implementação

### ✅ Implementado

- [x] Frontend Next.js 15 completo
- [x] Supabase PostgreSQL configurado
- [x] Supabase Auth integrado
- [x] Supabase Storage configurado
- [x] Edge Functions básicas (ingest_wazuh, ingest_zabbix, ingest_rmm)
- [x] Next.js API Routes para compliance
- [x] Deploy Vercel configurado

### 🚧 Em Desenvolvimento

- [ ] Edge Function `agent_evaluate` (AI compliance agent)
- [ ] Integração completa com Wazuh/Zabbix/RMM
- [ ] Vector database para semantic search
- [ ] Migrations automatizadas

### 📅 Planejado

- [ ] Multi-tenant architecture
- [ ] SSO (Single Sign-On)
- [ ] Webhooks para sistemas externos
- [ ] Real-time subscriptions (Supabase Realtime)

---

## 🔄 Migrações e Versionamento

### Database Migrations

- **Ferramenta**: Supabase Migrations (`supabase/migrations/`)
- **Formato**: SQL puro
- **Versionamento**: Sequencial (001, 002, 003...)

### Edge Functions

- **Ferramenta**: Supabase CLI
- **Deploy**: `supabase functions deploy <function-name>`
- **Runtime**: Deno (TypeScript)

---

## 📚 Recursos e Documentação

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)

---

**Última atualização**: 2025-01-04  
**Mantido por**: Equipe ness. OT GRC
