# ⚙️ Configurar Variáveis de Ambiente no Vercel

**Data:** 2025-11-02  
**Credenciais fornecidas:** Supabase

---

## ✅ Credenciais Recebidas

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s
```

---

## 🔧 Configuração via CLI Vercel

### Opção 1: Via CLI (Automatizado)

Execute os seguintes comandos:

```bash
cd /home/resper/TBE-OT/frontend

# Production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Digite: https://bingfdowmvyfeffieujk.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Digite: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s

vercel env add NEXT_PUBLIC_USE_SUPABASE production
# Digite: true

# Preview (mesmas credenciais)
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add NEXT_PUBLIC_USE_SUPABASE preview

# Development (mesmas credenciais)
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add NEXT_PUBLIC_USE_SUPABASE development
```

---

### Opção 2: Via Dashboard (Mais Fácil)

1. **Acesse:** https://vercel.com/nessbr-projects/frontend/settings/environment-variables

2. **Adicione variáveis:**

   **Variável 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://bingfdowmvyfeffieujk.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variável 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbmdmZG93bXZ5ZmVmZmlldWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODM1OTksImV4cCI6MjA3NzU1OTU5OX0.hEFPraqRRlXeeXoir6oV2m90sX6HFgiPpVdB4qFEV5s`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variável 3:**
   - Name: `NEXT_PUBLIC_USE_SUPABASE`
   - Value: `true`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **Save**

---

## 🔐 Service Role Key (Opcional)

**⚠️ Importante:** Para operações server-side que precisam de privilégios elevados (bypass RLS), você também pode adicionar:

**Variável (Opcional):**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: (obter em: Dashboard Supabase → Settings → API → service_role key)
- Environments: ✅ Production, ✅ Preview, ✅ Development
- **⚠️ NUNCA expor no frontend!**

**Como obter:**
1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/settings/api
2. Copie **service_role** key (secret)
3. Adicione no Vercel

---

## ✅ Verificar Configuração

```bash
cd /home/resper/TBE-OT/frontend
vercel env ls
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL          Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY    Production, Preview, Development
NEXT_PUBLIC_USE_SUPABASE         Production, Preview, Development
```

---

## 🚀 Após Configurar

1. **Variáveis configuradas** ✅
2. **Deploy automático** será disparado no próximo push
3. **Ou faça redeploy manual:**
   - https://vercel.com/nessbr-projects/frontend/deployments
   - Clique em "Redeploy" no deployment mais recente

---

## 📋 Checklist

- [x] Credenciais Supabase recebidas
- [ ] Variáveis configuradas no Vercel (Production)
- [ ] Variáveis configuradas no Vercel (Preview)
- [ ] Variáveis configuradas no Vercel (Development)
- [ ] Service Role Key adicionada (opcional)
- [ ] Deploy realizado/testado

---

**Próximo passo:** Configurar variáveis no Vercel e fazer deploy!

