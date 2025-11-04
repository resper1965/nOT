# 🔧 Solução: Frameworks Não Aparecem na Versão em Produção

## 🎯 Problema Identificado

Os frameworks não estão aparecendo na aplicação em produção porque:

1. ✅ **API Route corrigida** - A API route estava usando o cliente errado do Supabase
2. ❌ **Frameworks não cadastrados** - Os scripts SQL não foram executados no Supabase de produção
3. ❌ **Views não criadas** - As views do schema `public` podem não estar criadas no Supabase de produção

## ✅ Correções Aplicadas

### 1. API Route Corrigida
- **Arquivo**: `frontend/src/app/api/compliance/frameworks/route.ts`
- **Mudança**: Troquei `getAdminSupabaseClient` por `createServerClient`
- **Status**: ✅ Commitado e deployado

### 2. Build e Deploy
- **Status**: ✅ Deploy em andamento
- **URL**: https://ngrcot-c9501h09l-nessbr-projects.vercel.app

## 🔧 Ações Necessárias no Supabase de Produção

### Passo 1: Criar Views no Schema Public

Execute o script `supabase-create-views.sql` no Supabase Dashboard:

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: **ngrcot**
3. Vá em **SQL Editor**
4. Execute o script `supabase-create-views.sql`

**Importante**: Este script cria as views `public.frameworks` e `public.controls` que permitem o acesso via Supabase PostgREST.

### Passo 2: Cadastrar Frameworks

Execute o script `supabase-insert-frameworks.sql` no Supabase Dashboard:

1. No **SQL Editor**, execute o script `supabase-insert-frameworks.sql`
2. Isso cadastrará os 7 frameworks:
   - NIST Cybersecurity Framework (CSF) 2.0
   - ISO/IEC 27001
   - ISO/IEC 27002
   - ISO/IEC 27019
   - NIST SP 800-82
   - NIST SP 800-53
   - IEC 62443

### Passo 3: Mapear Controles (Opcional)

Execute o script `supabase-map-frameworks-controls.sql` no Supabase Dashboard:

1. No **SQL Editor**, execute o script `supabase-map-frameworks-controls.sql`
2. Isso mapeará ~61 controles principais para os frameworks

## 📋 Scripts SQL Necessários

Execute na seguinte ordem:

1. **`supabase-create-views.sql`** - Cria as views no schema `public`
2. **`supabase-insert-frameworks.sql`** - Insere os frameworks
3. **`supabase-map-frameworks-controls.sql`** - Mapeia os controles (opcional)

## ✅ Verificação

Após executar os scripts, verifique se os frameworks aparecem:

1. Acesse: `https://ngrcot.vercel.app/dashboard/compliance/frameworks`
2. Você deve ver os 7 frameworks listados
3. Clique em um framework para ver seus controles

### Query de Verificação no Supabase

Execute esta query no SQL Editor para verificar:

```sql
-- Verificar se os frameworks foram cadastrados
SELECT 
  framework_name,
  version,
  description
FROM compliance.frameworks
ORDER BY framework_name;

-- Verificar se as views foram criadas
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN ('frameworks', 'controls');
```

## 🚨 Troubleshooting

### Erro: "relation 'public.frameworks' does not exist"
- **Causa**: A view não foi criada
- **Solução**: Execute `supabase-create-views.sql`

### Erro: "relation 'compliance.frameworks' does not exist"
- **Causa**: A tabela não existe ou o schema não foi criado
- **Solução**: Execute o script `supabase-complete-schema.sql` primeiro

### Frameworks aparecem mas não têm controles
- **Causa**: Os controles não foram mapeados
- **Solução**: Execute `supabase-map-frameworks-controls.sql`

### API retorna array vazio
- **Causa**: Problema de permissões ou views não criadas
- **Solução**: Verifique se as views têm permissões GRANT SELECT para `authenticated` e `anon`

## 📝 Resumo

**Status Atual**:
- ✅ API route corrigida e deployada
- ❌ Views não criadas no Supabase de produção
- ❌ Frameworks não cadastrados no Supabase de produção
- ❌ Controles não mapeados no Supabase de produção

**Próximos Passos**:
1. Execute os scripts SQL no Supabase Dashboard
2. Aguarde o deploy concluir
3. Verifique se os frameworks aparecem na aplicação

---

**Data**: 2025-01-04  
**Sistema**: ness. OT GRC  
**Status**: ⏳ Aguardando execução dos scripts SQL no Supabase

