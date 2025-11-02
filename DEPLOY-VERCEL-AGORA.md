# 🚀 Deploy na Vercel - AGORA

**Data:** 2025-11-02  
**Branch:** `feature/ness-theme-migration`  
**Status:** Pronto para deploy

---

## ⚡ Deploy Rápido

### Opção 1: Deploy via GitHub (Recomendado)

O Vercel está configurado para fazer deploy automático quando você faz push.

**Já feito:** ✅ Push para `feature/ness-theme-migration`

**Próximo passo:**
1. Acesse: https://vercel.com/nessbr-projects
2. O Vercel deve criar um **Preview Deployment** automaticamente
3. Aguarde o build (2-5 minutos)

### Opção 2: Deploy via CLI Vercel

```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login na Vercel
vercel login

# Deploy
cd /home/resper/TBE-OT
vercel

# Seguir instruções:
# - Link to existing project? Yes
# - Project name? frontend
# - Directory? frontend
# - Override settings? No
```

### Opção 3: Deploy Manual via Dashboard

1. Acesse: https://vercel.com/nessbr-projects/frontend/deployments
2. Clique em **"Create Deployment"**
3. Selecione branch: `feature/ness-theme-migration`
4. Configure:
   - Root Directory: `frontend`
   - Framework: `Next.js`
5. Clique **"Deploy"**

---

## ✅ Variáveis de Ambiente Necessárias

Certifique-se que estas variáveis estão configuradas no Vercel:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s

# Feature Flags
NEXT_PUBLIC_USE_SUPABASE=true

# Backend API (Opicional)
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Para adicionar:**
1. Acesse: https://vercel.com/nessbr-projects/frontend/settings/environment-variables
2. Clique **"Add New"**
3. Adicione cada variável para **Production, Preview, Development**

---

## 🔍 Verificar Deploy

### Após o Deploy

1. **Acesse**: https://vercel.com/nessbr-projects/frontend/deployments
2. **Verifique logs**:
   - ✅ Build successful
   - ✅ No errors
   - ✅ Variables loaded

3. **URLs disponíveis:**
   - **Production**: https://frontend-pawz6kwnj-nessbr-projects.vercel.app
   - **Preview**: URL única por branch

### Testar Aplicação

1. Acesse a URL do preview deployment
2. Navegue pelas páginas:
   - ✅ `/` - Landing page
   - ✅ `/dashboard/overview` - Dashboard
   - ✅ `/dashboard/compliance` - Compliance
   - ✅ `/dashboard/network` - Network

---

## 📊 Build Local (Para Testar Antes)

### Se quiser testar localmente primeiro:

```bash
cd /home/resper/TBE-OT/frontend

# Instalar dependências
npm install

# Build
npm run build

# Iniciar
npm start
```

**URL local:** http://localhost:3000

---

## 🎯 Próximos Passos

### Após Deploy Bem-Sucedido

1. **Testar Preview Deployment**
   - ✅ Verificar layout novo
   - ✅ Verificar navegação
   - ✅ Verificar Supabase

2. **Criar Pull Request para Merge**
   - Acesse: https://github.com/resper1965/nOT/pull/new/feature/ness-theme-migration
   - Adicione descrição
   - Request review

3. **Merge para Production**
   - Após validação
   - Merge para `master`
   - Deploy automático na produção

---

## 📋 Checklist Rápido

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Push realizado para GitHub
- [ ] Vercel criou preview deployment
- [ ] Build bem-sucedido
- [ ] Aplicação testada no preview
- [ ] Layout novo funcionando
- [ ] Navegação funcionando
- [ ] Supabase conectado

---

**Pronto para deploy!** 🚀

