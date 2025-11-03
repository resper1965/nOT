# 🚀 Deploy Completo: Vercel + Supabase - ness. OT GRC

**Data:** 2025-11-02  
**Aplicação:** Completa (Frontend + Backend + Database)

---

## 🎯 Objetivo

Fazer deploy completo da aplicação **ness. OT GRC** usando:
- **Frontend**: Vercel (Next.js 15)
- **Database**: Supabase PostgreSQL
- **Backend**: API Routes do Next.js (Vercel) + Supabase Edge Functions
- **Storage**: Supabase Storage (documentos)
- **Auth**: Supabase Auth

---

## 📊 Arquitetura de Deploy

```
┌─────────────────────────────────────────────────┐
│          VERCEL - Frontend Next.js 15            │
│          ness. OT GRC Dashboard                  │
│                                                  │
│  • App Router (pages)                           │
│  • API Routes (/api/*)                          │
│  • Server Components                            │
│  • Server Actions                               │
└──────────────┬──────────────────────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
     ▼         ▼         ▼
┌──────────┐ ┌─────────┐ ┌──────────┐
│Supabase  │ │Supabase │ │Supabase  │
│PostgreSQL│ │  Auth   │ │ Storage  │
│          │ │         │ │          │
│• security │ │• Login │ │• Docs    │
│• topology │ │• Signup│ │• Files   │
│• compliance│ │• JWT  │ │• Backup  │
│• audit    │ │        │ │          │
└──────────┘ └─────────┘ └──────────┘
     │
     ▼
┌─────────────────────────────────────┐
│   Supabase Edge Functions           │
│   (Processamento pesado opcional)  │
│   • Análise de rede                 │
│   • Processamento de dados          │
│   • Webhooks                        │
└─────────────────────────────────────┘
```

---

## 🔧 Passo 1: Configurar Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Crie novo projeto:
   - **Nome**: `ness-ot-grc`
   - **Região**: Escolha mais próxima (US East, US West, EU West, etc.)
   - **Database Password**: Guarde bem!
3. Anote:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: Chave pública (pode expor no frontend)
   - **Service Role Key**: Chave privada (apenas server-side)
   - **Database Password**: Senha do PostgreSQL

---

### 1.2 Migrar Schema do PostgreSQL

**Objetivo:** Migrar os 4 schemas (security, topology, compliance, audit) do PostgreSQL local para Supabase.

#### Passo 1: Exportar Schema Local

```bash
# Se PostgreSQL local estiver rodando via Docker
docker exec ness-ot-grc-db pg_dump -U ness_admin -d ness_ot_grc \
  --schema-only \
  --no-owner \
  --no-privileges \
  > schema-migration.sql
```

#### Passo 2: Preparar Schema para Supabase

O Supabase precisa de algumas adaptações:

1. **Schemas personalizados**: Supabase usa principalmente o schema `public`, mas podemos manter schemas customizados
2. **Extensions**: Já disponíveis (`uuid-ossp`, `pgcrypto`)
3. **RLS (Row Level Security)**: Configurar depois

**Criar arquivo de migração:**

```bash
# Criar arquivo preparado para Supabase
cat > supabase-migration.sql << 'EOF'
-- ness. OT GRC - Supabase Migration
-- Adaptado para Supabase PostgreSQL

-- Enable extensions (já disponíveis no Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;

-- (Copiar conteúdo de database/init/01-init.sql)
-- (Copiar conteúdo de database/init/02-compliance-documents.sql)

-- Configurar RLS (opcional, por enquanto desabilitado)
-- ALTER TABLE security.assets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON security.assets FOR SELECT USING (true);
EOF
```

#### Passo 3: Importar no Supabase

1. **Via Dashboard:**
   - Acesse: https://supabase.com/dashboard/project/[project-id]/sql/new
   - Cole o SQL de migração
   - Execute

2. **Via CLI (se tiver):**
   ```bash
   supabase db push < supabase-migration.sql
   ```

#### Passo 4: Migrar Dados (Opcional)

Se tiver dados locais para migrar:

```bash
# Exportar dados
docker exec ness-ot-grc-db pg_dump -U ness_admin -d ness_ot_grc \
  --data-only \
  --column-inserts \
  > data-migration.sql

# Importar via SQL Editor no Supabase Dashboard
```

---

## 🔧 Passo 2: Configurar Variáveis de Ambiente

### 2.1 Variáveis no Vercel

**Acesse:** https://vercel.com/nessbr-projects/frontend/settings/environment-variables

**Adicione para Production, Preview e Development:**

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Feature Flags
NEXT_PUBLIC_USE_SUPABASE=true

# Backend API (Opcional - se usar FastAPI separado)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**⚠️ Importante:**
- ✅ `NEXT_PUBLIC_*` = Pode ser exposto no frontend
- ❌ `SUPABASE_SERVICE_ROLE_KEY` = **NUNCA** expor no frontend (apenas server-side)

---

## 🔧 Passo 3: Criar API Routes do Next.js

**Objetivo:** Substituir endpoints do FastAPI por API Routes do Next.js na Vercel.

### 3.1 Estrutura de API Routes

```
frontend/src/app/api/
├── assets/
│   ├── route.ts              # GET /api/assets
│   ├── stats/
│   │   └── route.ts         # GET /api/assets/stats
│   └── [id]/
│       └── route.ts         # GET /api/assets/[id]
├── network/
│   ├── topology/
│   │   └── route.ts         # GET /api/network/topology
│   ├── vlans/
│   │   └── route.ts         # GET /api/network/vlans
│   └── routing/
│       └── route.ts         # GET /api/network/routing
├── compliance/
│   ├── documents/
│   │   └── route.ts         # GET /api/compliance/documents
│   └── ons/
│       └── route.ts         # GET /api/compliance/ons
└── health/
    └── route.ts             # GET /api/health
```

### 3.2 Exemplo: API Route para Assets Stats

```typescript
// frontend/src/app/api/assets/stats/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Query assets from Supabase
    const { data: assets, error } = await supabase
      .from('security.assets')
      .select('*');
    
    if (error) throw error;
    
    // Process stats
    const stats = {
      total_assets: assets?.length || 0,
      by_type: {},
      by_criticality: {},
    };
    
    assets?.forEach(asset => {
      // Count by type
      stats.by_type[asset.asset_type] = 
        (stats.by_type[asset.asset_type] || 0) + 1;
      
      // Count by criticality
      stats.by_criticality[asset.criticality] = 
        (stats.by_criticality[asset.criticality] || 0) + 1;
    });
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching assets stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets stats' },
      { status: 500 }
    );
  }
}
```

### 3.3 Criar API Routes Principais

Vou criar as API routes principais agora.

---

## 🔧 Passo 4: Configurar Supabase Storage

### 4.1 Criar Buckets

**No Dashboard do Supabase:**
1. Vá em **Storage**
2. Crie buckets:
   - `compliance-documents` (public: false)
   - `evidence` (public: false)
   - `reports` (public: false)

### 4.2 Configurar Políticas

```sql
-- Política para documentos de compliance
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'compliance-documents');

CREATE POLICY "Authenticated users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'compliance-documents');
```

---

## 🔧 Passo 5: Deploy na Vercel

### 5.1 Verificar Configuração

**Settings > General:**
- ✅ Root Directory: `frontend`
- ✅ Framework: Next.js
- ✅ Build Command: (padrão)
- ✅ Output Directory: `.next`

### 5.2 Deploy Automático

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "feat: deploy completo Vercel + Supabase"
   git push origin feature/ness-theme-migration
   ```

2. **Vercel detecta automaticamente** e faz deploy

### 5.3 Deploy Manual (Se Necessário)

1. Acesse: https://vercel.com/nessbr-projects/frontend/deployments/new
2. Configure:
   - Branch: `feature/ness-theme-migration`
   - Root Directory: `frontend`
3. Deploy

---

## 📋 Checklist de Deploy Completo

### Pré-Deploy
- [ ] Projeto criado no Supabase
- [ ] Schema migrado para Supabase
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] API Routes criadas no Next.js
- [ ] Supabase Storage configurado
- [ ] Testes locais realizados

### Deploy
- [ ] Push realizado para GitHub
- [ ] Vercel detecta deploy automático
- [ ] Build bem-sucedido
- [ ] Aplicação acessível

### Pós-Deploy
- [ ] Testar autenticação (Supabase Auth)
- [ ] Testar queries ao database
- [ ] Testar upload de documentos (Storage)
- [ ] Verificar logs do Vercel
- [ ] Verificar logs do Supabase

---

## 🔍 Verificar Deploy

### URLs Esperadas

- **Frontend**: https://frontend-nessbr-projects.vercel.app
- **API**: https://frontend-nessbr-projects.vercel.app/api/health
- **Dashboard**: https://frontend-nessbr-projects.vercel.app/dashboard

### Testes

1. **Health Check:**
   ```bash
   curl https://frontend-nessbr-projects.vercel.app/api/health
   ```

2. **Assets Stats:**
   ```bash
   curl https://frontend-nessbr-projects.vercel.app/api/assets/stats
   ```

3. **Database Connection:**
   - Acesse dashboard
   - Verifique se dados carregam
   - Verifique console do navegador

---

## 🎯 Próximos Passos

1. ✅ **Agora**: Criar API Routes principais
2. ✅ **Agora**: Configurar Supabase Storage
3. ✅ **Agora**: Fazer deploy completo
4. ⏳ **Depois**: Migrar processamento pesado para Edge Functions (opcional)
5. ⏳ **Depois**: Configurar backups automáticos
6. ⏳ **Depois**: Configurar monitoring

---

**Vamos começar criando as API Routes principais!**

