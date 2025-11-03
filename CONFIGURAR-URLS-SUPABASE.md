# 🔧 Configurar URLs do Supabase para Produção

**IMPORTANTE: Configurar URLs corretas no Supabase para funcionar na Vercel**

---

## ⚠️ Problema Atual

O `http://localhost:3000` está configurado no Supabase, mas isso é apenas para desenvolvimento local. Para produção na Vercel, você precisa configurar as URLs corretas.

---

## 📋 URLs que Precisam ser Configuradas

### 1. Site URL

**O que é:** URL padrão de redirecionamento após autenticação

**URL de Produção:**
```
https://ngrcot-*.vercel.app
```
ou
```
https://ngrcot-gp7yrm50l-nessbr-projects.vercel.app
```

**Como encontrar sua URL:**
```bash
cd frontend
vercel ls
```

---

### 2. Redirect URLs

**O que é:** URLs permitidas para redirecionamento após autenticação

**URLs para adicionar:**

#### Produção Vercel:
```
https://ngrcot-*.vercel.app/**
https://*.vercel.app/**
```

#### Desenvolvimento Local (opcional, mas recomendado):
```
http://localhost:3000/**
http://127.0.0.1:3000/**
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
2. Remova ou altere: `http://localhost:3000`
3. Adicione sua URL de produção da Vercel:
   ```
   https://ngrcot-gp7yrm50l-nessbr-projects.vercel.app
   ```
   ou use wildcard:
   ```
   https://ngrcot-*.vercel.app
   ```
4. Clique em **"Save changes"**

### 3. Configurar Redirect URLs

1. Na seção **"Redirect URLs"**
2. Clique em **"Add URL"**
3. Adicione cada URL uma por uma:

   **URL 1 (Produção - todas as URLs Vercel):**
   ```
   https://*.vercel.app/**
   ```
   
   **URL 2 (Produção - específica do projeto):**
   ```
   https://ngrcot-*.vercel.app/**
   ```
   
   **URL 3 (Desenvolvimento local - opcional):**
   ```
   http://localhost:3000/**
   ```

4. Clique em **"Save changes"** após cada URL

---

## ✅ Verificação

Após configurar, teste:

1. Acesse sua URL de produção: `https://ngrcot-*.vercel.app`
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

### Desenvolvimento vs Produção

- **Desenvolvimento:** Use `http://localhost:3000/**`
- **Produção:** Use `https://*.vercel.app/**`
- Você pode ter ambos configurados simultaneamente

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

---

**Configuração necessária para funcionar em produção!** ✅

