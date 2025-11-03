# ⚙️ Configurar Variáveis de Ambiente - AGORA

**Data:** 2025-11-02  
**Status:** ✅ Credenciais Supabase recebidas

---

## ✅ Credenciais Recebidas

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s
```

---

## 🎯 Configurar no Vercel Dashboard (Recomendado)

### Passo a Passo

1. **Acesse:** https://vercel.com/nessbr-projects/frontend/settings/environment-variables

2. **Clique em "Add New"**

3. **Adicione Variável 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://bingfdowmvyfeffieujk.supabase.co`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Save**

4. **Clique em "Add New" novamente**

5. **Adicione Variável 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Save**

6. **Clique em "Add New" novamente**

7. **Adicione Variável 3:**
   - **Name:** `NEXT_PUBLIC_USE_SUPABASE`
   - **Value:** `true`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Save**

---

## 🔐 Service Role Key (Opcional)

Se precisar de operações server-side com privilégios elevados:

1. **Obter Service Role Key:**
   - Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/settings/api
   - Copie **service_role** key (secret)

2. **Adicionar no Vercel:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (cole a service_role key)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **⚠️ NUNCA expor no frontend!**

---

## ✅ Verificar

Após adicionar, você deve ver:

```
NEXT_PUBLIC_SUPABASE_URL          Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY     Production, Preview, Development
NEXT_PUBLIC_USE_SUPABASE         Production, Preview, Development
[OPCIONAL] SUPABASE_SERVICE_ROLE_KEY  Production, Preview, Development
```

---

## 🚀 Próximo: Fazer Deploy

### Opção 1: Deploy Automático

Após configurar variáveis:
1. **Faça um novo push** (ou aguarde deploy automático)
2. **Vercel detecta** e faz deploy com novas variáveis

### Opção 2: Redeploy Manual

1. **Acesse:** https://vercel.com/nessbr-projects/frontend/deployments
2. **Clique no deployment mais recente**
3. **Clique em "Redeploy"**
4. **Selecione:** "Use existing Build Cache" (ou não, conforme preferir)
5. **Redeploy**

---

## ✅ Checklist

- [x] Credenciais Supabase recebidas
- [ ] Variável `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] Variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] Variável `NEXT_PUBLIC_USE_SUPABASE` configurada
- [ ] Variável `SUPABASE_SERVICE_ROLE_KEY` configurada (opcional)
- [ ] Deploy realizado/testado

---

## 🔍 Verificar Schema no Supabase

**Antes do deploy, verifique se o schema foi migrado:**

1. **Acesse:** https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql/new

2. **Verifique se schemas existem:**
   ```sql
   SELECT schema_name 
   FROM information_schema.schemata 
   WHERE schema_name IN ('security', 'topology', 'compliance', 'audit');
   ```

3. **Se não existirem, execute:**
   - Abra o arquivo: `supabase-migration.sql` (raiz do projeto)
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Execute

---

**Próximo:** Configure as variáveis no Vercel e faça deploy! 🚀

