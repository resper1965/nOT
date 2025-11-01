# 🚀 Guia Completo de Deploy no Vercel - ness. OT GRC

**Data**: 2025-11-01  
**Status**: ✅ Pronto para Deploy

---

## 📋 Pré-requisitos

- ✅ Conta no Vercel: https://vercel.com
- ✅ Projeto Supabase configurado
- ✅ Código commitado no GitHub
- ✅ Variáveis de ambiente do Supabase

---

## 🔴 PASSO 1: Configurar Variáveis de Ambiente no Vercel

### 1.1 Acessar Configurações do Projeto

1. **Acesse o Dashboard Vercel**:
   - URL: https://vercel.com/nessbr-projects/frontend/settings/environment-variables
   - Ou: Dashboard → Seu Projeto → Settings → Environment Variables

### 1.2 Adicionar Variáveis de Ambiente

Adicione as seguintes variáveis para **Production**, **Preview** e **Development**:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s

# Supabase Configuration (Optional - Service Role Key for server-side only)
# WARNING: Only use this for server-side operations, never expose in client!
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Feature Flags
NEXT_PUBLIC_USE_SUPABASE=true

# API Backend (Optional - Fallback)
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**⚠️ Importante**:
- ✅ Adicione para **todos os ambientes** (Production, Preview, Development)
- ✅ Substitua os valores pelas suas credenciais reais
- ✅ **NUNCA** commite variáveis de ambiente no código

### 1.3 Verificar Variáveis Configuradas

No Vercel Dashboard, você deve ver:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_USE_SUPABASE=true`

---

## 🔴 PASSO 2: Configurar Projeto no Vercel

### 2.1 Importar Projeto (Se ainda não importado)

1. **Acesse**: https://vercel.com/new
2. **Conecte seu repositório GitHub**: `resper1965/nOT`
3. **Configure o projeto**:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (ou deixe padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

### 2.2 Configurações de Build (Opcional)

Se o projeto não detectar automaticamente, configure:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

**Nota**: O `vercel.json` já está configurado com essas opções.

---

## 🔴 PASSO 3: Deploy Inicial

### 3.1 Deploy Automático via Git

1. **Faça push das alterações**:
   ```bash
   git add .
   git commit -m "feat: Configure Vercel deployment with Supabase"
   git push origin main
   ```

2. **Vercel fará deploy automaticamente** quando você fizer push

### 3.2 Deploy Manual (Alternativa)

1. **Acesse**: https://vercel.com/nessbr-projects/frontend/deployments
2. **Clique em "Redeploy"** ou **"Create Deployment"**
3. **Aguarde o build** (2-5 minutos)

---

## 🔴 PASSO 4: Verificar Deploy

### 4.1 Verificar Build Logs

1. **Acesse**: https://vercel.com/nessbr-projects/frontend/deployments
2. **Clique no deployment mais recente**
3. **Verifique os logs**:
   - ✅ Build deve concluir com sucesso
   - ✅ Sem erros de compilação
   - ✅ Variáveis de ambiente carregadas

### 4.2 Verificar URL de Deploy

Após o deploy, você terá uma URL:
- **Production**: https://frontend-pawz6kwnj-nessbr-projects.vercel.app
- **Preview**: URL única para cada branch

### 4.3 Testar Aplicação

1. **Acesse a URL de produção**
2. **Verifique páginas principais**:
   - ✅ `/` - Landing page
   - ✅ `/sign-in` - Página de login
   - ✅ `/dashboard/overview` - Dashboard principal

---

## 🔴 PASSO 5: Configurar Domínio Customizado (Opcional)

### 5.1 Adicionar Domínio

1. **Acesse**: https://vercel.com/nessbr-projects/frontend/settings/domains
2. **Adicione seu domínio**: Ex: `app.ness.com`
3. **Configure DNS** conforme instruções do Vercel

---

## ✅ Checklist de Deploy

### Antes do Deploy
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Código commitado no GitHub
- [ ] Build local funcionando (`npm run build`)
- [ ] Testes locais passando

### Durante o Deploy
- [ ] Build concluído com sucesso
- [ ] Sem erros de compilação
- [ ] Variáveis de ambiente carregadas
- [ ] URL de deploy gerada

### Após o Deploy
- [ ] Aplicação acessível na URL
- [ ] Landing page funcionando
- [ ] Login funcionando (Supabase Auth)
- [ ] Dashboards carregando dados
- [ ] Sem erros no console do browser

---

## 🚨 Troubleshooting

### Erro: Build Failed

**Causa comum**: Dependências ou variáveis de ambiente

**Solução**:
1. Verificar logs do build no Vercel
2. Verificar se todas as dependências estão no `package.json`
3. Verificar variáveis de ambiente configuradas

### Erro: Environment Variables Missing

**Solução**:
1. Verificar se variáveis estão configuradas
2. Verificar se estão aplicadas para o ambiente correto (Production/Preview)
3. Fazer redeploy após adicionar variáveis

### Erro: Supabase Connection Failed

**Solução**:
1. Verificar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Verificar se Supabase está acessível
3. Verificar RLS (Row Level Security) nas tabelas

### Erro: Page Not Found (404)

**Solução**:
1. Verificar rotas em `app/` directory
2. Verificar `next.config.ts`
3. Verificar middleware não está bloqueando rotas

### Erro: Build Timeout

**Solução**:
1. Otimizar bundle size
2. Verificar dependências pesadas
3. Usar `output: 'standalone'` apenas para Docker, não para Vercel

---

## 📊 Configuração Atual

### Arquivos de Configuração

- ✅ `frontend/vercel.json` - Configuração Vercel
- ✅ `frontend/next.config.ts` - Configuração Next.js otimizada
- ✅ `frontend/package.json` - Dependências e scripts

### Estrutura de Deploy

```
TBE-OT/
├── frontend/              # Root directory no Vercel
│   ├── .next/            # Build output
│   ├── src/              # Código fonte
│   ├── package.json      # Dependências
│   └── vercel.json       # Config Vercel
└── scripts/              # Scripts auxiliares
```

---

## 🔗 Links Úteis

### Vercel
- **Dashboard**: https://vercel.com/nessbr-projects/frontend
- **Deployments**: https://vercel.com/nessbr-projects/frontend/deployments
- **Settings**: https://vercel.com/nessbr-projects/frontend/settings
- **Environment Variables**: https://vercel.com/nessbr-projects/frontend/settings/environment-variables
- **Logs**: https://vercel.com/nessbr-projects/frontend/logs

### Supabase
- **Dashboard**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk
- **SQL Editor**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql
- **API Docs**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/api

### GitHub
- **Repositório**: https://github.com/resper1965/nOT
- **Actions**: https://github.com/resper1965/nOT/actions

---

## 🎯 Próximos Passos Após Deploy

1. **Migrar Schema para Supabase**:
   - Seguir `MIGRATION-EXECUTION-GUIDE.md`
   - Importar schema no Supabase SQL Editor

2. **Testar Funcionalidades**:
   - Autenticação Supabase
   - Dashboards com dados reais
   - Queries Supabase funcionando

3. **Configurar Storage**:
   - Criar bucket no Supabase Storage
   - Implementar upload de documentos

---

## 📝 Comandos Úteis

### Verificar Deploy Localmente

```bash
# Build local
cd frontend
npm run build

# Testar produção localmente
npm run start
```

### Debugging no Vercel

```bash
# Ver logs de produção
vercel logs

# Abrir aplicação localmente com variáveis do Vercel
vercel dev
```

---

**Última Atualização**: 2025-11-01  
**Status**: ✅ Pronto para Deploy

---

**Desenvolvido com 💙 pela equipe ness.**

