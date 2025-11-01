# 🚀 Guia de Deploy na Vercel - ness. OT GRC

**Data**: 2025-01-27  
**Status**: Configurado e pronto para deploy

---

## ✅ Configuração Concluída

### Arquivos Criados/Modificados

1. **`frontend/package.json`** ✅
   - Adicionado `@supabase/supabase-js@^2.39.3`

2. **`frontend/src/lib/supabase.ts`** ✅
   - Cliente Supabase configurado
   - Suporte para client-side e server-side

3. **`frontend/src/lib/api-supabase.ts`** ✅
   - Funções helper para usar Supabase diretamente

4. **`frontend/src/lib/api.ts`** ✅
   - Atualizado para usar variável de ambiente `NEXT_PUBLIC_API_URL`

5. **`frontend/vercel.json`** ✅
   - Configuração para deploy na Vercel

6. **`frontend/env.example.txt`** ✅
   - Variáveis de ambiente do Supabase adicionadas

7. **`SUPABASE-INTEGRATION.md`** ✅
   - Documentação completa da integração

---

## 📦 Instalação

### 1. Instalar Dependências

```bash
cd frontend
npm install
# ou
pnpm install
```

Isso instalará automaticamente o `@supabase/supabase-js` que foi adicionado ao `package.json`.

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cd frontend
cp env.example.txt .env.local
```

Edite `.env.local` e adicione suas credenciais:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API (opcional - se usar FastAPI externo)
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Clerk (já configurado)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## 🚀 Deploy na Vercel

### Opção 1: Via Vercel Dashboard

1. **Acesse**: https://vercel.com
2. **Conecte repositório**: `https://github.com/resper1965/nOT`
3. **Configure**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (detecta automaticamente)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)

4. **Adicione variáveis de ambiente**:
   - Settings > Environment Variables
   - Adicione todas as variáveis do `.env.local`
   - Configure para Production, Preview e Development

5. **Deploy**: Clique em "Deploy"

### Opção 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório frontend
cd frontend

# Fazer login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

---

## 🔧 Configuração no Vercel Dashboard

### Environment Variables

No Vercel Dashboard, vá em **Settings > Environment Variables** e adicione:

| Variável | Tipo | Ambiente | Descrição |
|----------|------|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | All | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | All | Chave pública Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | All | Chave privada Supabase (server-side) |
| `NEXT_PUBLIC_API_URL` | Plain | All | URL do backend FastAPI (se usar) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Plain | All | Chave pública Clerk |
| `CLERK_SECRET_KEY` | Secret | All | Chave secreta Clerk |

**Importante**: 
- Variáveis `NEXT_PUBLIC_*` são expostas no frontend
- `SUPABASE_SERVICE_ROLE_KEY` e `CLERK_SECRET_KEY` são segredos (nunca expor no frontend)

---

## ✅ Checklist de Deploy

Antes de fazer deploy:

- [ ] Dependências instaladas (`npm install`)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Projeto Supabase criado
- [ ] Schema do banco migrado para Supabase
- [ ] Testar conexão local com Supabase
- [ ] Verificar build local (`npm run build`)
- [ ] Verificar se não há erros de TypeScript (`npm run type-check`)

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"

**Solução**: Instale as dependências:
```bash
cd frontend
npm install
```

### Erro: "Supabase environment variables not configured"

**Solução**: Adicione as variáveis de ambiente:
- Local: No arquivo `.env.local`
- Vercel: No Dashboard > Settings > Environment Variables

### Erro de Build na Vercel

**Solução**: 
1. Verifique se o **Root Directory** está configurado como `frontend`
2. Verifique os logs de build na Vercel
3. Teste o build localmente primeiro: `npm run build`

### Erro de Conexão com Supabase

**Solução**:
1. Verifique se as credenciais estão corretas
2. Verifique se o projeto Supabase está ativo
3. Verifique se o IP não está bloqueado (Supabase pode ter restrições de IP)

---

## 📚 Próximos Passos

Após o deploy bem-sucedido:

1. **Migrar banco de dados para Supabase**
   - Exportar schema atual
   - Importar no Supabase
   - Ver `SUPABASE-INTEGRATION.md` para detalhes

2. **Configurar Supabase Storage**
   - Criar bucket para documentos
   - Configurar políticas de acesso

3. **Opcional: Migrar backend para Edge Functions**
   - Criar Edge Functions para lógica customizada
   - Reduzir dependência do FastAPI backend

---

## 🔗 Links Úteis

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

**Desenvolvido com 💙 pela equipe ness.**

