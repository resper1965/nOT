# 🚀 Guia: Criar Projeto na Vercel

**Deploy completo da aplicação ness. OT GRC na Vercel**

---

## 📋 Pré-requisitos

- ✅ Conta na Vercel (https://vercel.com)
- ✅ Conta no GitHub (repositório já existe)
- ✅ Conta no Supabase (banco de dados criado)
- ✅ Credenciais do Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚀 Passo 1: Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login (use GitHub para conectar)

---

## 🚀 Passo 2: Importar Projeto

### Opção A: Importar do GitHub (Recomendado)

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Se conectou com GitHub, verá seus repositórios
3. Procure por: `resper1965/nOT`
4. Clique em **"Import"**

### Opção B: Via CLI

```bash
cd /home/resper/TBE-OT
npm install -g vercel
vercel login
vercel
```

---

## 🚀 Passo 3: Configurar Projeto

### 3.1 Configurações Básicas

Na tela de configuração do projeto:

**Project Name:**
- Sugestão: `ness-ot-grc` ou `not-grc`

**Root Directory:**
- ✅ Configure como: `frontend`
- Isso indica que o projeto Next.js está na pasta `frontend/`

**Framework Preset:**
- ✅ Deve detectar automaticamente: **Next.js**

**Build Command:**
- ✅ Padrão: `npm run build` (deve funcionar)
- Se necessário: `cd frontend && npm run build`

**Output Directory:**
- ✅ Padrão: `.next` (deve funcionar)
- Se necessário: `frontend/.next`

**Install Command:**
- ✅ Padrão: `npm install` (deve funcionar)
- Se necessário: `cd frontend && npm install`

---

## 🚀 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Variáveis do Supabase

Na tela de configuração, vá para **"Environment Variables"** e adicione:

#### Produção (Production)

```
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s
```

#### Preview (Previews)

Mesmas variáveis acima - marque também para **"Preview"**

#### Development (Development)

Mesmas variáveis acima - marque também para **"Development"**

### 4.2 Outras Variáveis (se necessário)

Se houver outras variáveis de ambiente no projeto, adicione também.

---

## 🚀 Passo 5: Configurar Branch

### 5.1 Branch de Deploy

- **Production Branch:** `main` ou `master` (ou a branch que você preferir)
- **Preview Branches:** Todas as branches (padrão)

**Importante:** 
- Se seu código está na branch `feature/ness-theme-migration`, você pode:
  - Fazer merge para `main` primeiro, ou
  - Mudar a branch de produção temporariamente, ou
  - Fazer deploy da branch atual como preview primeiro

---

## 🚀 Passo 6: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build
3. Acompanhe o progresso no log

---

## ✅ Pós-Deploy

### Verificar Deploy

1. Após o deploy concluir, você receberá uma URL:
   - Exemplo: `https://ness-ot-grc.vercel.app`
2. Acesse a URL para testar
3. Verifique se a aplicação carrega corretamente

### Verificar Logs (se houver erros)

1. No dashboard da Vercel
2. Clique no deploy
3. Aba **"Build Logs"** ou **"Runtime Logs"**

---

## 🔧 Configurações Adicionais Recomendadas

### 1. Custom Domain (Opcional)

1. Settings → Domains
2. Adicione seu domínio personalizado

### 2. Environment Variables Globais

Você pode configurar variáveis globais para todos os projetos:
- Team Settings → Environment Variables

### 3. Build Settings Avançadas

Se necessário ajustar:
- Settings → General → Build & Development Settings

---

## 🐛 Troubleshooting

### Erro: "Build failed"

**Solução:**
- Verifique os logs do build
- Confirme que `Root Directory` está como `frontend`
- Verifique se `package.json` está na pasta `frontend/`

### Erro: "Module not found"

**Solução:**
- Verifique se todas as dependências estão em `package.json`
- Execute `npm install` localmente para testar

### Erro: "Environment variables missing"

**Solução:**
- Verifique se todas as variáveis foram adicionadas
- Confirme que estão marcadas para o ambiente correto (Production/Preview/Development)

### Erro: "Failed to connect to Supabase"

**Solução:**
- Verifique as credenciais do Supabase
- Confirme que as variáveis começam com `NEXT_PUBLIC_` (necessário para client-side)
- Teste as credenciais localmente primeiro

---

## 📊 Checklist de Deploy

- [ ] Conta Vercel criada
- [ ] Projeto importado do GitHub
- [ ] Root Directory configurado como `frontend`
- [ ] Variáveis de ambiente do Supabase configuradas
  - [ ] Production
  - [ ] Preview
  - [ ] Development
- [ ] Branch de produção configurada
- [ ] Deploy executado
- [ ] Aplicação acessível na URL fornecida
- [ ] Testes básicos realizados

---

## 🎯 Resultado Esperado

Após o deploy bem-sucedido:

- ✅ Aplicação Next.js disponível na URL da Vercel
- ✅ Conexão com Supabase funcionando
- ✅ Autenticação operacional
- ✅ Páginas carregando corretamente

---

## 📝 URLs Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bingfdowmvyfeffieujk
- **GitHub Repository:** https://github.com/resper1965/nOT

---

**Pronto para fazer deploy na Vercel!** 🚀

Se encontrar algum problema, verifique os logs do build ou me avise!

