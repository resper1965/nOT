# 🚀 Guia Completo: Deploy Vercel + Supabase - ness. OT GRC

**Data:** 2025-11-02  
**Aplicação:** Completa (Frontend + Backend + Database)

---

## 📋 Visão Geral

Este guia detalha o deploy completo da aplicação **ness. OT GRC** usando:
- ✅ **Frontend**: Vercel (Next.js 15)
- ✅ **Database**: Supabase PostgreSQL
- ✅ **Backend**: API Routes do Next.js (no Vercel)
- ✅ **Storage**: Supabase Storage
- ✅ **Auth**: Supabase Auth

---

## 🔧 PASSO 1: Configurar Supabase

### 1.1 Criar Projeto no Supabase

1. **Acesse:** https://supabase.com
2. **Crie novo projeto:**
   - Nome: `ness-ot-grc`
   - Região: Escolha mais próxima
   - Database Password: **Guardar bem!**
3. **Anotar credenciais:**
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: Chave pública
   - Service Role Key: Chave privada (Dashboard → Settings → API)

---

### 1.2 Migrar Schema para Supabase

1. **Acesse SQL Editor:**
   - Dashboard → SQL Editor → New Query

2. **Execute o script de migração:**
   - Arquivo: `supabase-migration.sql` (raiz do projeto)
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Execute (Ctrl/Cmd + Enter)

3. **Verificar sucesso:**
   - Verifique se schemas foram criados: `security`, `topology`, `compliance`, `audit`
   - Verifique se tabelas foram criadas

**✅ Schema migrado!**

---

### 1.3 Configurar Supabase Storage

1. **Criar buckets:**
   - Dashboard → Storage → Create bucket
   - Buckets a criar:
     - `compliance-documents` (public: false)
     - `evidence` (public: false)
     - `reports` (public: false)

2. **Configurar políticas (opcional):**
   - Por enquanto deixar padrão (permitir autenticados)

---

## 🔧 PASSO 2: Configurar Variáveis de Ambiente

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

# Backend API (Opcional - se usar FastAPI externo)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**⚠️ Importante:**
- ✅ `NEXT_PUBLIC_*` = Pode ser exposto no frontend
- ❌ `SUPABASE_SERVICE_ROLE_KEY` = **NUNCA** expor no frontend (apenas server-side)

---

## 🔧 PASSO 3: Verificar API Routes

### 3.1 API Routes Criadas

As seguintes API routes foram criadas:

```
frontend/src/app/api/
├── health/
│   └── route.ts                    # GET /api/health
├── assets/
│   ├── route.ts                    # GET /api/assets
│   └── stats/
│       └── route.ts               # GET /api/assets/stats
├── network/
│   ├── topology/
│   │   └── route.ts               # GET /api/network/topology
│   └── vlans/
│       └── route.ts               # GET /api/network/vlans
└── compliance/
    └── documents/
        └── route.ts               # GET /api/compliance/documents
```

**✅ API Routes prontas!**

---

## 🔧 PASSO 4: Commit e Push

### 4.1 Adicionar Arquivos

```bash
cd /home/resper/TBE-OT

# Adicionar arquivos criados
git add supabase-migration.sql
git add frontend/src/app/api/
git add DEPLOY-COMPLETO-VERCEL-SUPABASE.md
git add GUIA-DEPLOY-COMPLETO.md

# Commit
git commit -m "feat: deploy completo Vercel + Supabase com API Routes"

# Push
git push origin feature/ness-theme-migration
```

---

## 🔧 PASSO 5: Deploy na Vercel

### 5.1 Deploy Automático

O Vercel **detecta automaticamente** o push e faz deploy.

**Verificar:**
- Dashboard: https://vercel.com/nessbr-projects/frontend/deployments
- Aguarde build (2-5 minutos)

### 5.2 Deploy Manual (Se Necessário)

1. **Acesse:** https://vercel.com/nessbr-projects/frontend/deployments/new
2. **Configure:**
   - Branch: `feature/ness-theme-migration`
   - Root Directory: `frontend`
3. **Deploy**

---

## ✅ PASSO 6: Verificar Deploy

### 6.1 Testar Endpoints

```bash
# Health Check
curl https://frontend-nessbr-projects.vercel.app/api/health

# Assets Stats
curl https://frontend-nessbr-projects.vercel.app/api/assets/stats

# Network Topology
curl https://frontend-nessbr-projects.vercel.app/api/network/topology

# VLANs
curl https://frontend-nessbr-projects.vercel.app/api/network/vlans

# Compliance Documents
curl https://frontend-nessbr-projects.vercel.app/api/compliance/documents
```

### 6.2 Verificar Frontend

1. **Acesse:** https://frontend-nessbr-projects.vercel.app
2. **Teste:**
   - Landing page carrega
   - Login funciona (Supabase Auth)
   - Dashboard carrega
   - Dados aparecem nas páginas

---

## 📊 Checklist Final

### Pré-Deploy
- [x] Projeto criado no Supabase
- [x] Schema migrado (`supabase-migration.sql`)
- [x] Variáveis de ambiente configuradas no Vercel
- [x] API Routes criadas
- [x] Supabase Storage configurado (opcional)

### Deploy
- [ ] Commit realizado
- [ ] Push para GitHub
- [ ] Deploy automático detectado
- [ ] Build bem-sucedido

### Pós-Deploy
- [ ] Health check funcionando
- [ ] API endpoints funcionando
- [ ] Frontend carregando
- [ ] Supabase conectado
- [ ] Dados aparecendo

---

## 🔍 Troubleshooting

### Erro: "Cannot find module '@/lib/supabase'"

**Solução:**
- Verificar se `frontend/src/lib/supabase.ts` existe
- Verificar imports nas API routes

### Erro: "Missing Supabase credentials"

**Solução:**
- Verificar variáveis de ambiente no Vercel
- Verificar se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas

### Erro: "relation does not exist"

**Solução:**
- Verificar se schema foi migrado no Supabase
- Verificar se tabelas existem: Dashboard → Database → Tables

### Erro: "permission denied for schema"

**Solução:**
- Verificar se schemas foram criados: `security`, `topology`, `compliance`, `audit`
- Verificar permissões no Supabase

---

## 🎯 Próximos Passos

1. ✅ **Deploy completo** realizado
2. ⏳ **Migrar dados existentes** (se tiver)
3. ⏳ **Configurar RLS** (Row Level Security) em produção
4. ⏳ **Configurar backups** automáticos no Supabase
5. ⏳ **Configurar monitoring** (Vercel Analytics, Supabase Logs)

---

## 📚 Documentação

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## ✅ Conclusão

**Deploy completo configurado!**

- ✅ Schema PostgreSQL migrado para Supabase
- ✅ API Routes criadas no Next.js
- ✅ Variáveis de ambiente prontas
- ✅ Pronto para deploy

**Próximo:** Commit, push e deploy automático!

---

**Desenvolvido pela equipe ness.** ⚡

