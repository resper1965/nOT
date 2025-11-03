# Instruções: Corrigir Avisos de Segurança do Supabase Linter

## 🚨 Problemas Identificados

O Supabase Linter detectou 3 avisos de segurança:

1. **Function Search Path Mutable** (2 funções):
   - `public.update_updated_at_column` - Função tem `search_path` mutável
   - `compliance.get_next_version` - Função tem `search_path` mutável

2. **Leaked Password Protection Disabled**:
   - Proteção contra senhas vazadas está desabilitada no Supabase Auth

## ✅ Solução

### 1. Corrigir Funções com Search Path Mutável

Execute o script SQL `supabase-fix-security-warnings.sql` no Supabase para corrigir as funções.

#### Passo a Passo:

1. **Acessar o Supabase Dashboard**
   - Acesse https://supabase.com/dashboard
   - Selecione seu projeto
   - Vá para **SQL Editor** (no menu lateral)

2. **Executar o Script SQL**
   - Copie o conteúdo do arquivo `supabase-fix-security-warnings.sql`
   - Cole no SQL Editor do Supabase
   - Clique em **Run** (ou pressione `Ctrl+Enter`)

#### O que o Script Faz:

- ✅ Corrige `update_updated_at_column()`:
  - Define `SET search_path = ''` (vazio) para prevenir injeção de schema
  - Adiciona `SECURITY DEFINER` para segurança

- ✅ Corrige `compliance.get_next_version()`:
  - Define `SET search_path = compliance, pg_catalog` explicitamente
  - Adiciona `SECURITY DEFINER` para segurança

### 2. Habilitar Leaked Password Protection

Esta configuração deve ser feita **manualmente no Dashboard do Supabase**:

1. **Acessar o Dashboard**
   - Acesse https://supabase.com/dashboard
   - Selecione seu projeto
   - Vá para **Authentication** (no menu lateral)

2. **Configurar Password Security**
   - Vá para **Settings** dentro de Authentication
   - Role até **Security** > **Password Security**
   - Habilite **"Leaked Password Protection"**
   - Clique em **Save** para salvar as configurações

#### O que isso faz:

- ✅ Protege contra o uso de senhas comprometidas
- ✅ Verifica senhas contra o banco de dados HaveIBeenPwned.org
- ✅ Previne uso de senhas que foram vazadas em breaches públicos

## 🔍 Verificação

Após executar o script SQL, você pode verificar se as correções foram aplicadas:

```sql
-- Verificar configuração das funções
SELECT 
  proname as function_name,
  nspname as schema_name,
  proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE proname IN ('update_updated_at_column', 'get_next_version')
  AND nspname IN ('public', 'compliance');
```

As funções devem ter `proconfig` contendo:
- `update_updated_at_column`: `{search_path=}`
- `get_next_version`: `{search_path=compliance,pg_catalog}`

## 📋 Checklist

- [ ] Executar script `supabase-fix-security-warnings.sql` no Supabase
- [ ] Habilitar "Leaked Password Protection" no Dashboard do Supabase
- [ ] Verificar se os avisos desapareceram no Supabase Linter
- [ ] Testar se as funções ainda funcionam corretamente (triggers, versionamento)

## ⚠️ Importante

- **Não execute o script em produção** sem fazer backup primeiro
- **Teste em ambiente de desenvolvimento** antes de aplicar em produção
- **Verifique** se os triggers ainda funcionam após a correção
- **Monitore** os logs do Supabase após aplicar as correções

## 🔗 Referências

- [Supabase Database Linter](https://supabase.com/docs/guides/database/database-linter)
- [Function Search Path Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [Leaked Password Protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

