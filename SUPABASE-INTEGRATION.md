# 🔗 Integração Supabase - ness. OT GRC

**Data**: 2025-01-27  
**Status**: Configurado para integração

---

## 📋 Visão Geral

Este documento descreve a integração do Supabase no projeto **ness. OT GRC**, permitindo deploy na Vercel com banco de dados gerenciado.

---

## 🎯 Objetivos da Integração

1. **PostgreSQL Gerenciado**: Substituir container PostgreSQL por Supabase
2. **Deploy na Vercel**: Frontend Next.js 15 na Vercel
3. **Backend Flexível**: Opção de usar Supabase Edge Functions ou FastAPI externo
4. **Storage**: Armazenar documentos de compliance no Supabase Storage
5. **Real-time**: Subscriptions para atualizações em tempo real

---

## 📦 Arquitetura Proposta

```
┌─────────────────────────────────────────────┐
│     VERCEL - Frontend Next.js 15            │
│     - Clerk Auth                            │
│     - Supabase Client                       │
└──────────────┬──────────────────────────────┘
               │
               ├─► Supabase PostgreSQL
               │   - Schemas: public, security, topology, compliance, audit
               │   - Connection pooling automático
               │   - Backups automáticos
               │
               ├─► Supabase Storage
               │   - Documentos de compliance
               │   - Evidências
               │   - Versionamento
               │
               ├─► Supabase Edge Functions (opcional)
               │   - Lógica customizada
               │   - Processamento pesado
               │
               └─► FastAPI Backend (opcional)
                   - Análise de rede complexa
                   - Processamento de dados pesado
```

---

## 🔧 Configuração

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: Chave pública (pode ser exposta no frontend)
   - **Service Role Key**: Chave privada (apenas server-side)

### 2. Configurar Variáveis de Ambiente

Adicione no arquivo `.env.local` (local) e no Vercel Dashboard (produção):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (opcional)
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Clerk Auth (manter existente)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### 3. Migrar Schema do PostgreSQL

1. **Exportar schema atual**:
   ```bash
   pg_dump -h localhost -p 5434 -U ness_admin -d ness_ot_grc --schema-only > schema.sql
   ```

2. **Importar no Supabase**:
   - Via SQL Editor no Dashboard do Supabase
   - Ou via CLI:
     ```bash
     supabase db push
     ```

### 4. Atualizar Conexões no Backend

**Opção A: Usar Supabase Connection String**

Atualize `backend/api/*.py` para usar connection string do Supabase:

```python
import os
import psycopg2
from urllib.parse import urlparse

# Supabase connection string
DATABASE_URL = os.getenv('SUPABASE_DB_URL')  # postgresql://postgres:[password]@[host]:5432/postgres

DB_CONFIG = {
    'host': urlparse(DATABASE_URL).hostname,
    'port': urlparse(DATABASE_URL).port or 5432,
    'database': urlparse(DATABASE_URL).path[1:],
    'user': urlparse(DATABASE_URL).username,
    'password': urlparse(DATABASE_URL).password,
    'sslmode': 'require'  # Supabase requer SSL
}
```

**Opção B: Usar Supabase Client no Frontend**

Para queries simples, use diretamente o Supabase client no frontend (ver `src/lib/api-supabase.ts`).

---

## 📚 Uso do Supabase Client

### Exemplo: Query Simples

```typescript
import { supabase } from '@/lib/supabase';

// Buscar VLANs
const { data, error } = await supabase
  .from('topology.vlans')
  .select('*')
  .eq('purdue_level', 2)
  .order('vlan_id');

if (error) {
  console.error('Erro ao buscar VLANs:', error);
}
```

### Exemplo: RPC (Stored Procedures)

```typescript
// Chamar função do PostgreSQL
const { data, error } = await supabase
  .rpc('get_network_stats');
```

### Exemplo: Real-time Subscriptions

```typescript
// Escutar mudanças em tempo real
const channel = supabase
  .channel('compliance-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'compliance',
    table: 'documents'
  }, (payload) => {
    console.log('Documento atualizado:', payload.new);
  })
  .subscribe();
```

### Exemplo: Storage

```typescript
// Upload de documento
const { data, error } = await supabase.storage
  .from('compliance-documents')
  .upload(`documento-${Date.now()}.pdf`, file);

// Download de documento
const { data, error } = await supabase.storage
  .from('compliance-documents')
  .getPublicUrl('documento.pdf');
```

---

## 🚀 Deploy na Vercel

### 1. Configurar Variáveis de Ambiente

No Vercel Dashboard:
1. Vá em **Settings > Environment Variables**
2. Adicione todas as variáveis do `.env.example.txt`
3. Configure para **Production**, **Preview** e **Development**

### 2. Conectar Repositório

1. **Settings > Git**
2. Conecte o repositório GitHub: `https://github.com/resper1965/nOT`
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Deploy

O deploy será automático após push no GitHub, ou faça deploy manual:

```bash
vercel --prod
```

---

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ **NEXT_PUBLIC_***: Podem ser expostas no frontend
- ❌ **SUPABASE_SERVICE_ROLE_KEY**: NUNCA expor no frontend (usar apenas server-side)
- ❌ **CLERK_SECRET_KEY**: NUNCA expor no frontend

### Row Level Security (RLS)

Configure RLS no Supabase para proteger dados:

```sql
-- Exemplo: Permitir apenas usuários autenticados
ALTER TABLE compliance.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
ON compliance.documents
FOR SELECT
USING (auth.uid() = user_id);
```

---

## 📊 Comparação: Supabase vs Backend FastAPI

| Operação | Supabase | FastAPI Backend |
|----------|----------|-----------------|
| Queries simples | ✅ Recomendado | ⚠️ Overhead |
| Queries complexas | ⚠️ SQL direto | ✅ Python/ORM |
| Processamento pesado | ❌ Edge Functions limitado | ✅ Recomendado |
| Real-time | ✅ Nativo | ❌ WebSockets manual |
| Storage | ✅ Nativo | ❌ Requer S3/externo |
| Migrations | ✅ Dashboard/CLI | ⚠️ Alembic manual |

**Recomendação**: Use Supabase para queries simples e storage, FastAPI para processamento complexo.

---

## 🔄 Migração Gradual

### Fase 1: Setup (✅ Concluído)
- [x] Instalar `@supabase/supabase-js`
- [x] Criar `lib/supabase.ts`
- [x] Configurar variáveis de ambiente
- [x] Criar `vercel.json`

### Fase 2: Migração de Dados
- [ ] Exportar schema do PostgreSQL atual
- [ ] Importar no Supabase
- [ ] Migrar dados existentes

### Fase 3: Atualizar Código
- [ ] Migrar queries simples para Supabase client
- [ ] Manter FastAPI apenas para processamento pesado
- [ ] Configurar Supabase Storage para documentos

### Fase 4: Edge Functions (Opcional)
- [ ] Migrar rotas simples do FastAPI para Edge Functions
- [ ] Deploy das Edge Functions

### Fase 5: Real-time
- [ ] Implementar subscriptions para dashboards
- [ ] Atualizações em tempo real de compliance

---

## 📝 Arquivos Criados/Modificados

### Novos Arquivos
- `frontend/src/lib/supabase.ts` - Cliente Supabase
- `frontend/src/lib/api-supabase.ts` - Funções API usando Supabase
- `frontend/vercel.json` - Configuração Vercel
- `SUPABASE-INTEGRATION.md` - Esta documentação

### Arquivos Modificados
- `frontend/package.json` - Adicionado `@supabase/supabase-js`
- `frontend/env.example.txt` - Variáveis de ambiente do Supabase
- `frontend/src/lib/api.ts` - Suporte a variável de ambiente

---

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase + Vercel Integration](https://vercel.com/integrations/supabase)

---

## ✅ Checklist de Deploy

Antes de fazer deploy na Vercel:

- [ ] Projeto criado no Supabase
- [ ] Schema migrado para Supabase
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Testar conexão localmente com Supabase
- [ ] Verificar se todas as queries funcionam
- [ ] Configurar RLS se necessário
- [ ] Fazer deploy de teste na Vercel
- [ ] Verificar logs do Vercel após deploy

---

**Desenvolvido com 💙 pela equipe ness.**

