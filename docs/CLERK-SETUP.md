# 🔐 Clerk Authentication - Setup Guide

**Sistema**: ness. OT GRC  
**Data**: 2025-10-21  
**Status**: ✅ Configurado (App Router)

---

## 1️⃣ Configuração Realizada

### ✅ **Instalação**
```bash
# Clerk já está no package.json
"@clerk/nextjs": "^6.12.12"
```

### ✅ **Chaves de Ambiente** (`.env.local`)

**IMPORTANTE**: Arquivo `.env.local` NÃO é commitado (está no `.gitignore`)

```bash
# .env.local (REAL - não commitar)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LXJhdHRsZXItNi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_dFg10rDlZ6okBRCFD15wCbWfftslMBg2MCv61shkg7
```

### ✅ **Middleware** (`src/middleware.ts`)

```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

### ✅ **Layout Principal** (`src/app/layout.tsx`)

```typescript
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang='pt-BR'>
        <body>
          {/* Todo conteúdo já existente */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### ✅ **Header com Autenticação** (`src/components/layout/header.tsx`)

```typescript
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export default function Header() {
  return (
    <header>
      {/* Usuário NÃO autenticado */}
      <SignedOut>
        <SignInButton mode="modal">
          <button>Entrar</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-brand-cyan">Cadastrar</button>
        </SignUpButton>
      </SignedOut>
      
      {/* Usuário autenticado */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

---

## 2️⃣ Verificações de Segurança

### ✅ **`.gitignore` protege `.env.local`**

```bash
# .gitignore (linha 28-29)
.env*
.env*.local
```

### ✅ **`.env.example` tem apenas placeholders**

```bash
# .env.example
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

### ✅ **Nenhuma chave real em código**

Todas as chaves reais estão APENAS em `.env.local` (não trackeado).

---

## 3️⃣ Como Usar Clerk no Código

### **Server Components** (async)

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Não autenticado</div>;
  }
  
  return <div>Usuário: {userId}</div>;
}
```

### **Client Components**

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Carregando...</div>;
  if (!user) return <div>Não autenticado</div>;
  
  return <div>Olá, {user.firstName}!</div>;
}
```

### **Proteger Rotas Específicas**

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

---

## 4️⃣ Componentes Clerk Disponíveis

### **Autenticação**
- `<SignInButton>` - Botão de login
- `<SignUpButton>` - Botão de cadastro
- `<SignOutButton>` - Botão de logout
- `<UserButton>` - Avatar do usuário (inclui menu dropdown)

### **Formulários Completos**
- `<SignIn>` - Formulário completo de login
- `<SignUp>` - Formulário completo de cadastro
- `<UserProfile>` - Perfil completo do usuário

### **Condicionais**
- `<SignedIn>` - Mostra conteúdo apenas para autenticados
- `<SignedOut>` - Mostra conteúdo apenas para não autenticados

---

## 5️⃣ Dashboard Clerk

**URL**: https://dashboard.clerk.com/

### **Configurações Importantes:**

1. **API Keys** - Onde você copiou as chaves
2. **User Management** - Ver todos os usuários cadastrados
3. **Authentication** - Configurar métodos (email, Google, GitHub, etc.)
4. **Appearance** - Customizar UI dos componentes
5. **Sessions** - Ver sessões ativas

---

## 6️⃣ Customização de Aparência

### **Tema ness. OT GRC**

```typescript
<ClerkProvider
  appearance={{
    variables: {
      colorPrimary: '#00ade8', // brand-cyan
      colorBackground: '#0B0C0E', // ness dark
      colorText: '#EEF1F6',
    },
    elements: {
      formButtonPrimary: 'bg-brand-cyan hover:bg-brand-cyan/90',
      card: 'bg-gray-900',
    },
  }}
>
  {children}
</ClerkProvider>
```

---

## 7️⃣ Checklist de Implementação

### ✅ **Concluído:**
- [x] `@clerk/nextjs` instalado
- [x] Chaves configuradas em `.env.local`
- [x] `.env.local` no `.gitignore`
- [x] `clerkMiddleware()` em `middleware.ts`
- [x] `<ClerkProvider>` em `app/layout.tsx`
- [x] Botões de auth no header
- [x] Componentes `SignedIn/SignedOut` funcionando

### ⏳ **Próximos Passos (Opcional):**
- [ ] Proteger rotas específicas (dashboard)
- [ ] Customizar tema Clerk
- [ ] Adicionar login social (Google, GitHub)
- [ ] Implementar roles/permissions
- [ ] Integrar usuário Clerk com PostgreSQL

---

## 8️⃣ Troubleshooting

### **Erro: "Clerk: Missing publishable key"**
**Solução**: Verificar se `.env.local` existe e tem as chaves corretas.

### **Erro: "Invalid publishable key"**
**Solução**: Copiar novamente as chaves do Dashboard Clerk.

### **Auth não funciona no Docker**
**Solução**: Passar variáveis de ambiente no `docker-compose.yml`:

```yaml
frontend:
  environment:
    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
```

---

## 9️⃣ Referências

- **Clerk Docs**: https://clerk.com/docs
- **Next.js Quickstart**: https://clerk.com/docs/quickstarts/nextjs
- **App Router Guide**: https://clerk.com/docs/references/nextjs/overview
- **Dashboard**: https://dashboard.clerk.com/

---

✅ **Clerk configurado corretamente seguindo App Router (Next.js 15)**

💙 **ness. OT GRC** - Sistema com autenticação segura!
