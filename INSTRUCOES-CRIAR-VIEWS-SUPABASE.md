# Instruções: Criar Views no Supabase

## Problema

O Supabase PostgREST não acessa diretamente tabelas em schemas customizados (`compliance`, `topology`, `security`, `audit`). Para resolver isso, precisamos criar **views no schema `public`** que apontam para as tabelas nos schemas customizados.

## Solução

Execute o script SQL `supabase-create-views.sql` no Supabase para criar as views necessárias.

## Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (`bingfdowmvyfeffieujk`)
3. Vá para **SQL Editor** (no menu lateral)

### 2. Executar o Script SQL

1. Copie o conteúdo do arquivo `supabase-create-views.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** (ou pressione `Ctrl+Enter`)

### 3. Verificar se as Views Foram Criadas

Execute esta query no SQL Editor para verificar:

```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN (
  'documents', 'frameworks', 'controls', 'ons_controls',
  'ip_subnets', 'ip_addresses', 'vlans', 'network_connections',
  'assets', 'vulnerabilities', 'incidents', 'data_leakage_paths',
  'activity_log'
);
```

Você deve ver todas as views listadas.

## O que o Script Faz

O script `supabase-create-views.sql`:

1. **Cria views no schema `public`** que apontam para as tabelas nos schemas customizados:
   - `compliance.documents` → `public.documents`
   - `compliance.frameworks` → `public.frameworks`
   - `topology.vlans` → `public.vlans`
   - `topology.ip_subnets` → `public.ip_subnets`
   - `security.assets` → `public.assets`
   - E todas as outras tabelas necessárias

2. **Concede permissões** para `authenticated` e `anon` acessarem as views

## Depois de Executar o Script

Após executar o script, as APIs devem funcionar corretamente, pois:

- ✅ As views expõem as tabelas dos schemas customizados via PostgREST
- ✅ As permissões foram configuradas corretamente
- ✅ O código foi atualizado para usar apenas os nomes das tabelas (sem o schema)

## Verificação

Após executar o script, teste as APIs:

1. `/api/assets/stats` - Deve retornar estatísticas de assets
2. `/api/remediation/gaps` - Deve retornar gaps identificados
3. `/api/compliance/documents` - Deve retornar documentos de compliance
4. `/api/documents/upload` - Deve permitir upload de documentos

## Nota Importante

⚠️ **IMPORTANTE**: Execute o script SQL no Supabase **ANTES** de fazer o deploy novamente, caso contrário as APIs continuarão falhando com erro 404/500.

