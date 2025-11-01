# ⚙️ Configuração Vercel - ness. OT GRC

**Quick Reference** para configurar variáveis de ambiente no Vercel.

---

## 🔐 Variáveis de Ambiente Necessárias

### Configurar no Vercel Dashboard

**URL**: https://vercel.com/nessbr-projects/frontend/settings/environment-variables

Adicione estas variáveis para **Production**, **Preview** e **Development**:

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bingfdowmvyfeffieujk.supabase.co` | ✅ Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Sim |
| `NEXT_PUBLIC_USE_SUPABASE` | `true` | ✅ Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | `sua_service_role_key` | ⚠️ Opcional |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8001` | ⚠️ Opcional |

---

## 🚀 Comandos Rápidos

### Verificar Variáveis no Vercel

```bash
# Via CLI do Vercel
vercel env ls
```

### Fazer Deploy Manual

```bash
# Deploy para produção
vercel --prod

# Deploy para preview
vercel
```

---

## ✅ Checklist Rápido

- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Push feito para GitHub (deploy automático)
- [ ] Aplicação acessível na URL do Vercel

---

**Para guia completo**: Ver `VERCEL-DEPLOY-GUIDE.md`

