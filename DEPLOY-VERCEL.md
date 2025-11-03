# 🚀 Deploy na Vercel - Projeto nGRCOT

**Instruções para criar projeto na Vercel via Dashboard (Recomendado)**

---

## ⚠️ Importante: Use o Dashboard da Vercel

A forma mais simples e recomendada é usar o Dashboard da Vercel para criar o projeto. A CLI do Vercel requer autenticação interativa e configuração manual.

---

## 🚀 Passos para Criar Projeto na Vercel

### 1. Acessar Vercel Dashboard

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. No dashboard, clique em **"Add New..."** → **"Project"**

### 2. Importar Repositório

1. Procure pelo repositório: `resper1965/nOT`
2. Clique em **"Import"**

### 3. Configurar Projeto

**Project Name:**
- ✅ Digite: `ngrcot`
- (A Vercel vai ajustar para: `ngrcot` automaticamente)

**Root Directory:**
- ✅ Clique em **"Edit"** ao lado de "Root Directory"
- ✅ Configure como: `frontend`
- ✅ Salve

**Framework Preset:**
- ✅ Deve detectar: **Next.js** automaticamente

**Build Command:**
- ✅ Padrão: `npm run build` (manter assim)

**Output Directory:**
- ✅ Padrão: `.next` (manter assim)

**Install Command:**
- ✅ Padrão: `npm install` (manter assim)

### 4. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, clique em **"Add"** para cada uma:

#### Variável 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://bingfdowmvyfeffieujk.supabase.co`
- ✅ Marque: **Production**, **Preview**, **Development**

#### Variável 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s`
- ✅ Marque: **Production**, **Preview**, **Development**

### 5. Selecionar Branch

**Production Branch:**
- ✅ Selecione: `feature/ness-theme-migration` (ou a branch que você preferir)

### 6. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (pode levar 2-5 minutos)
3. Acompanhe o progresso nos logs

---

## ✅ Após o Deploy

### URL do Projeto

Você receberá uma URL similar a:
- `https://ngrcot.vercel.app` ou
- `https://ngrcot-[hash].vercel.app`

### Testar

1. Acesse a URL fornecida
2. Verifique se a aplicação carrega
3. Teste as funcionalidades básicas

---

## 🔧 Alternativa: Via Vercel CLI (Avançado)

Se preferir usar a CLI, execute:

```bash
cd /home/resper/TBE-OT/frontend
npx vercel login
npx vercel --name ngrcot
```

**Mas recomendo usar o Dashboard** - é mais simples e visual! ✅

---

## 📝 Checklist

- [ ] Login na Vercel (https://vercel.com)
- [ ] Importar repositório `resper1965/nOT`
- [ ] Nome do projeto: `ngrcot`
- [ ] Root Directory: `frontend`
- [ ] Variáveis de ambiente configuradas (2 variáveis)
- [ ] Branch selecionada
- [ ] Deploy iniciado
- [ ] Build completado
- [ ] Aplicação acessível na URL

---

**Pronto para criar o projeto na Vercel!** 🚀

Use o Dashboard da Vercel - é o método mais simples e confiável!

