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
│   ├── app/                    # App Router
│   │   ├── (dashboard)/        # Dashboard routes
│   │   │   ├── compliance/     # Módulo Compliance
│   │   │   ├── network/        # Módulo Rede
│   │   │   └── remediation/    # Módulo Adequação
│   │   ├── sign-in/            # Autenticação
│   │   └── sign-up/            # Registro
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # shadcn/ui components
│   │   └── features/          # Feature components
│   └── lib/
│       ├── supabase.ts        # Supabase client
│       ├── supabase-server.ts # Server-side Supabase
│       └── api.ts             # API helpers
```

#### Tecnologias
- **Next.js 15**: App Router, Server Components, Middleware
- **React 19**: Concurrent features
- **TypeScript**: Type safety
- **Tailwind CSS 4.0**: Styling
- **shadcn/ui**: Component library
- **Supabase Auth**: Autenticação

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

### Database (Supabase PostgreSQL)

#### Schemas
```
public/          # Multi-tenancy, clients
security/        # Assets, vulnerabilities, incidents
topology/        # IP subnets, VLANs, connections
compliance/      # Frameworks, controls, documents
audit/           # Logs, changes
```

#### Características
- **PostgreSQL 16**: Database engine
- **Row Level Security**: Proteção de dados
- **Real-time**: Subscriptions para updates
- **Storage**: Documentos e evidências

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
```

### Query Server-Side
```
Server Component → getServerSupabaseClient() → Supabase Server Client → 
  Database → Response (sem expor tokens)
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

### Frontend (Vercel)
- Deploy automático via GitHub
- Edge Functions para serverless
- CDN global

### Database (Supabase)
- Managed PostgreSQL
- Backups automáticos
- Connection pooling

### Backend (Opcional)
- Railway, Render, Fly.io
- Docker containers
- Auto-scaling

