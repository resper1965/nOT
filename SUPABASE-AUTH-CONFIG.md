# 🔐 Configuração de Autenticação Supabase - ness. OT GRC

**Data**: 2025-11-01  
**Status**: ⚠️ **AJUSTES NECESSÁRIOS**

---

## 🔍 Problema: Usuário Não Consegue Fazer Login

**Situação**: Usuário existe no Supabase mas não consegue fazer login.

**Possíveis Causas**:
1. ⚠️ Email não confirmado (Supabase pode exigir confirmação)
2. ⚠️ Senha incorreta
3. ⚠️ Usuário desabilitado
4. ⚠️ Configuração de autenticação muito restritiva

---

## ✅ Verificar e Configurar no Supabase Dashboard

### 1. Verificar Status do Usuário

**Acesse**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users

**Verificar**:
- ✅ Email confirmado? (`Email Confirmed` deve ser `true`)
- ✅ Usuário habilitado? (`User Active` deve ser `true`)
- ✅ Última senha definida recente?

### 2. Configurar Autenticação por Email

**Acesse**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/providers

**Configurações Importantes**:

#### 🔴 DESABILITAR Confirmação de Email (para desenvolvimento/teste)

1. **Auth → Email Templates → Confirm signup**
   - Pode desabilitar temporariamente para testes

2. **Auth → Settings → Email Auth**
   - **"Enable email confirmations"**: ❌ **DESABILITAR** (para testes)
   - Isso permite login sem confirmar email

#### ✅ Ou Confirmar Email Manualmente

**No Dashboard → Auth → Users**:
1. Selecionar usuário
2. Clicar em **"Actions"** → **"Confirm user"**
3. Ou editar e marcar **"Email Confirmed"** como `true`

### 3. Redefinir Senha do Usuário

**No Dashboard → Auth → Users**:
1. Selecionar usuário
2. Clicar em **"Actions"** → **"Send password reset email"**
3. Ou editar e definir nova senha manualmente

### 4. Habilitar Usuário

**No Dashboard → Auth → Users**:
1. Selecionar usuário
2. Verificar se **"User Active"** está marcado
3. Se não, editar e habilitar

---

## 🚀 Solução Rápida: Desabilitar Confirmação de Email

### Passo 1: Acessar Configurações

**URL**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/providers

### Passo 2: Configurar Email Auth

1. Clicar em **"Email"** provider
2. Na seção **"Settings"**:
   - **"Confirm email"**: ❌ **OFF** (desabilitar)
   - **"Secure email change"**: Opcional

### Passo 3: Salvar e Testar

1. Salvar configurações
2. Tentar fazer login novamente

---

## 🔧 Verificar Usuário Manualmente

### Via Supabase Dashboard

**URL**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users

**Verificar cada usuário**:
- ✅ **Email Confirmed**: `true`
- ✅ **User Active**: `true`
- ✅ **Last Sign In**: Data recente (ou null se nunca logou)

### Confirmar Email Manualmente

1. **Dashboard → Auth → Users**
2. Selecionar usuário
3. Clicar em **"..."** → **"Send confirmation email"**
   - Ou marcar **"Email Confirmed"** manualmente

---

## 📝 Criar Usuário de Teste

### Via Dashboard

1. **Dashboard → Auth → Users → "Add user"**
2. Preencher:
   - **Email**: `teste@exemplo.com`
   - **Password**: `senha123`
   - **Email Confirmed**: ✅ Marcar
   - **User Active**: ✅ Marcar
3. Salvar

### Via SQL (se preferir)

```sql
-- Criar usuário de teste (via Supabase SQL Editor)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste@exemplo.com',
  crypt('senha123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Marcar email como confirmado
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'teste@exemplo.com';
```

**⚠️ Nota**: Criar usuário via SQL é mais complexo. Recomendo usar o Dashboard.

---

## 🔒 Segurança Recomendada

### Para Produção

- ✅ **Habilitar confirmação de email**
- ✅ **Exigir senha forte**
- ✅ **Habilitar MFA** (opcional)
- ✅ **Rate limiting** configurado

### Para Desenvolvimento/Teste

- ⚠️ **Desabilitar confirmação de email** (temporariamente)
- ⚠️ **Permitir senhas simples** (temporariamente)

---

## 📋 Checklist de Troubleshooting

- [ ] Verificar se usuário existe no Supabase Dashboard
- [ ] Verificar se email está confirmado
- [ ] Verificar se usuário está ativo
- [ ] Verificar configuração de confirmação de email
- [ ] Testar com usuário novo (criado via Dashboard)
- [ ] Verificar logs de autenticação no Supabase
- [ ] Verificar se há mensagens de erro específicas no console

---

## 🔗 Links Úteis

- **Auth Users**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users
- **Auth Providers**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/providers
- **Auth Settings**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/settings
- **Auth Logs**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/logs

---

## 🚨 Ação Imediata Recomendada

**Para resolver rapidamente**:

1. **Acesse**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users
2. **Selecione o usuário** que não consegue fazer login
3. **Verifique**:
   - ✅ Email Confirmed: `true`
   - ✅ User Active: `true`
4. **Se email não confirmado**: Marque manualmente ou envie email de confirmação
5. **Se senha incorreta**: Redefina a senha
6. **Teste login novamente**

---

**Última Atualização**: 2025-11-01  
**Status**: ⚠️ Verificação Necessária

---

**Desenvolvido com 💙 pela equipe ness.**

