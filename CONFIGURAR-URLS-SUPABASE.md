# 🔧 Configurar URLs do Supabase para Produção na Vercel

**Configuração de URLs do Supabase apenas para produção na Vercel**

---

## 📋 URLs que Precisam ser Configuradas

### 1. Site URL

**O que é:** URL padrão de redirecionamento após autenticação

**URL de Produção:**
```
https://ngrcot-*.vercel.app
```
ou sua URL específica da Vercel

**Como encontrar sua URL:**
```bash
cd frontend
vercel ls
```

---

### 2. Redirect URLs

**O que é:** URLs permitidas para redirecionamento após autenticação

**URLs para adicionar:**

#### Produção Vercel (Recomendado - cobre todas as URLs):
```
https://*.vercel.app/**
```

#### Produção específica do projeto (opcional):
```
https://ngrcot-*.vercel.app/**
```

**Importante:** Use wildcards (`*`) para aceitar qualquer subdomínio da Vercel:
- `https://*.vercel.app/**` cobre todas as URLs da Vercel
- Isso é necessário porque a Vercel gera URLs diferentes para cada deploy

---

## 🔧 Passos para Configurar

### 1. Acessar Configuração do Supabase

1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/url-configuration
2. Faça login no Supabase Dashboard

### 2. Configurar Site URL

1. Na seção **"Site URL"**
2. Remova qualquer referência a `http://localhost:3000` se existir
3. Configure com sua URL de produção da Vercel:
   ```
   https://ngrcot-*.vercel.app
   ```
   ou use sua URL específica:
   ```
   https://ngrcot-gp7yrm50l-nessbr-projects.vercel.app
   ```
4. Clique em **"Save changes"**

### 3. Configurar Redirect URLs

1. Na seção **"Redirect URLs"**
2. Clique em **"Add URL"**
3. Adicione cada URL uma por uma:

   **URL 1 (Produção - todas as URLs Vercel - RECOMENDADO):**
   ```
   https://*.vercel.app/**
   ```
   
   **URL 2 (Produção - específica do projeto - OPCIONAL):**
   ```
   https://ngrcot-*.vercel.app/**
   ```

4. Clique em **"Save changes"** após cada URL

---

## ✅ Verificação

Após configurar, teste:

1. Acesse sua URL de produção na Vercel
2. Tente fazer login
3. Verifique se o redirecionamento funciona corretamente

Se houver erro de redirecionamento, verifique:
- Se as URLs estão configuradas corretamente
- Se há espaços ou caracteres extras nas URLs
- Se o wildcard `*` está funcionando

---

## 📝 Notas Importantes

### Wildcards no Supabase

- `https://*.vercel.app/**` permite qualquer subdomínio `.vercel.app`
- O `**` no final permite qualquer caminho após o domínio
- Útil para aceitar diferentes URLs de deploy da Vercel

### Domínio Personalizado

Se você tiver um domínio personalizado na Vercel (ex: `ness.ot.grc.com`):
- Adicione também: `https://ness.ot.grc.com/**`
- Configure como Site URL principal

---

## 🐛 Troubleshooting

### Erro: "Invalid redirect URL"

**Problema:** URL não está na lista de Redirect URLs permitidas

**Solução:**
1. Verifique se a URL exata está na lista
2. Adicione wildcards se necessário: `https://*.vercel.app/**`
3. Certifique-se de incluir `/**` no final

### Redirecionamento não funciona

**Problema:** Após login, usuário não é redirecionado corretamente

**Solução:**
1. Verifique Site URL no Supabase
2. Verifique se Redirect URLs incluem a URL correta
3. Limpe cookies do navegador e tente novamente
4. Verifique se a URL da Vercel está nas Redirect URLs permitidas

---

## 📋 Resumo da Configuração

**Site URL:**
```
https://ngrcot-*.vercel.app
```

**Redirect URLs (mínimo necessário):**
```
https://*.vercel.app/**
```

**Isso é suficiente para funcionar em produção na Vercel!** ✅
