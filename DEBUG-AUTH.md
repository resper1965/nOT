# 🔍 Debug de Autenticação - ness. OT GRC

**Data**: 2025-11-01  
**Status**: ✅ **DEBUG CONFIGURADO**

---

## ✅ Debug Adicionado

### 1. ✅ Página de Login (`sign-in`)

**Logs adicionados**:
- 🔍 Início do login (email)
- 🔍 Resultado do `signInWithPassword` (user, session, erros)
- 🔍 Cookies antes e depois de aguardar
- 🔍 Verificação de sessão após login
- 🔍 Redirecionamento para dashboard

**Onde ver**: Console do navegador (F12 → Console)

### 2. ✅ Middleware

**Logs adicionados**:
- 🔍 Pathname sendo acessado
- 🔍 Usuário autenticado ou não
- 🔍 Cookies presentes
- 🔍 Redirecionamento para sign-in (se não autenticado)

**Onde ver**: Logs do servidor (terminal ou Vercel logs)

### 3. ✅ getServerUser

**Logs adicionados**:
- 🔍 Verificação de usuário
- 🔍 Erros de autenticação (se houver)

**Onde ver**: Logs do servidor (terminal ou Vercel logs)

---

## 📋 Como Ver os Logs

### No Navegador (Console)

1. **Abrir DevTools**:
   - Pressionar `F12` ou `Ctrl+Shift+I`
   - Ou clicar com botão direito → "Inspecionar"

2. **Abrir Aba Console**:
   - Ver logs em tempo real

3. **Fazer Login**:
   - Preencher email e senha
   - Clicar em "Entrar"
   - Ver logs aparecendo no console

**Exemplo de logs**:
```
🔍 [DEBUG] Iniciando login... { email: "teste@exemplo.com" }
🔍 [DEBUG] Resultado signInWithPassword: { hasUser: true, hasSession: true, ... }
✅ [DEBUG] Login bem-sucedido: { userId: "...", email: "..." }
🔍 [DEBUG] Cookies antes de redirecionar: { sbAccessToken: "present", ... }
⏳ [DEBUG] Aguardando cookies serem salvos...
🔍 [DEBUG] Cookies após aguardar: { supabaseCookies: [...] }
🚀 [DEBUG] Redirecionando para /dashboard...
```

### No Servidor (Logs do Vercel)

1. **Acessar Vercel Dashboard**:
   - https://vercel.com/nessbr-projects/frontend/logs

2. **Ver logs em tempo real**:
   - Logs do middleware aparecerão aqui
   - Logs do getServerUser aparecerão aqui

**Exemplo de logs**:
```
🔍 [MIDDLEWARE DEBUG] { pathname: "/dashboard", hasUser: true, ... }
✅ [MIDDLEWARE DEBUG] Usuário autenticado, permitindo acesso
```

---

## 🔍 O Que Verificar nos Logs

### 1. ✅ Login Bem-Sucedido?

**Procurar por**:
```
✅ [DEBUG] Login bem-sucedido
```

**Se não aparecer**:
- ❌ Login falhou
- Verificar erro específico no log

### 2. ✅ Sessão Criada?

**Procurar por**:
```
hasSession: true
sessionToken: "..."
```

**Se `hasSession: false`**:
- ❌ Sessão não foi criada
- Possível problema: email não confirmado

### 3. ✅ Cookies Salvos?

**Procurar por**:
```
Cookies após aguardar: { supabaseCookies: [...] }
```

**Se não houver cookies Supabase**:
- ❌ Cookies não foram salvos
- Possível problema: configuração de cookies

### 4. ✅ Middleware Vê Usuário?

**Procurar por**:
```
[MIDDLEWARE DEBUG] { hasUser: true, ... }
✅ [MIDDLEWARE DEBUG] Usuário autenticado, permitindo acesso
```

**Se `hasUser: false`**:
- ❌ Middleware não vê o usuário
- Possível problema: cookies não sendo lidos

---

## 🚨 Problemas Comuns e Soluções

### Problema 1: Login bem-sucedido mas não redireciona

**Verificar nos logs**:
- ✅ Sessão foi criada?
- ✅ Cookies foram salvos?
- ✅ Redirecionamento foi chamado?

**Se tudo OK mas não redireciona**:
- Pode ser problema com `window.location.href`
- Verificar se há erro JavaScript bloqueando

### Problema 2: Redireciona mas volta para sign-in

**Verificar nos logs do middleware**:
- ✅ Middleware vê o usuário?
- ✅ Cookies estão presentes?

**Se `hasUser: false` no middleware**:
- ❌ Cookies não estão sendo lidos
- Possível problema: domínio, path, secure flags

### Problema 3: Sessão não criada

**Verificar nos logs**:
- ✅ Email confirmado?
- ✅ Usuário ativo?

**Se `hasSession: false`**:
- Verificar status do usuário no Supabase Dashboard
- Confirmar email se necessário

---

## 📊 Exemplo de Log Completo (Sucesso)

```
🔍 [DEBUG] Iniciando login... { email: "teste@exemplo.com" }
🔍 [DEBUG] Resultado signInWithPassword: {
  hasUser: true,
  hasSession: true,
  userId: "abc123...",
  userEmail: "teste@exemplo.com",
  emailConfirmed: true,
  sessionAccessToken: "present"
}
✅ [DEBUG] Login bem-sucedido: {
  userId: "abc123...",
  email: "teste@exemplo.com",
  sessionToken: "eyJhbGciOiJIUzI1...",
  sessionExpiresAt: 1733097600
}
🔍 [DEBUG] Cookies antes de redirecionar: {
  sbAccessToken: "present",
  allCookies: ["sb-bingfdowmvyfeffieujk-auth-token", ...]
}
⏳ [DEBUG] Aguardando cookies serem salvos...
🔍 [DEBUG] Cookies após aguardar: {
  sbAccessToken: "present",
  supabaseCookies: ["sb-bingfdowmvyfeffieujk-auth-token=..."]
}
🔍 [DEBUG] Usuário atual após login: {
  hasUser: true,
  userId: "abc123..."
}
🚀 [DEBUG] Redirecionando para /dashboard...
🔍 [MIDDLEWARE DEBUG] {
  pathname: "/dashboard",
  hasUser: true,
  userId: "abc123...",
  userEmail: "teste@exemplo.com",
  cookies: { hasSbCookie: true, ... }
}
✅ [MIDDLEWARE DEBUG] Usuário autenticado, permitindo acesso
```

---

## 🔗 Links Úteis

- **Vercel Logs**: https://vercel.com/nessbr-projects/frontend/logs
- **Supabase Auth Users**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users
- **Aplicação**: https://frontend-nessbr-projects.vercel.app/sign-in

---

## ⚠️ Nota Importante

**Logs de debug só aparecem em desenvolvimento** (`NODE_ENV === 'development'`).

**Em produção (Vercel)**:
- Middleware logs aparecem nos logs do Vercel
- Console logs aparecem no console do navegador

---

**Última Atualização**: 2025-11-01  
**Status**: ✅ Debug Configurado

---

**Desenvolvido com 💙 pela equipe ness.**

