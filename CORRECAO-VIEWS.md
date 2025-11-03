# 🔧 Correção: Não pode alterar colunas de VIEWs

**Erro:** `ERROR: 42P16: cannot drop columns from view`

---

## ✅ Problema Resolvido

**Causa:** As verificações `DO $$` estavam usando `information_schema.tables` sem filtrar por `table_type`. Em PostgreSQL, tanto tabelas quanto views aparecem em `information_schema.tables`, então a verificação poderia encontrar uma VIEW com o mesmo nome e tentar fazer `ALTER TABLE` nela, causando o erro.

**Solução:** Adicionado filtro `table_type = 'BASE TABLE'` em todas as verificações para garantir que apenas tabelas sejam verificadas, não views.

---

## 🔧 Alteração Realizada

### Antes
```sql
IF EXISTS (SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'topology' AND table_name = 'ip_subnets')
```

### Depois
```sql
IF EXISTS (SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'topology' 
             AND table_name = 'ip_subnets' 
             AND table_type = 'BASE TABLE')
```

---

## 📊 Verificações Corrigidas

**Total: 4 blocos DO $$** corrigidos com `table_type = 'BASE TABLE'`:

1. ✅ `topology.ip_subnets` → verificação de `purdue_level`
2. ✅ `topology.vlans` → verificação de `purdue_level`
3. ✅ `compliance.controls` → verificação de `control_code`
4. ✅ `compliance.documents` → verificação de `category`, `status`, `framework_id`

---

## ✅ Benefício

O script agora:
- ✅ **Só verifica tabelas**, não views
- ✅ **Evita erros** ao tentar alterar views
- ✅ **Mais robusto** contra conflitos de nome
- ✅ **Funciona corretamente** mesmo se existirem views com nomes similares

---

## 🚀 Próximo Passo

**Execute novamente o script no Supabase SQL Editor:**

1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql/new
2. Copie o conteúdo de `supabase-migration.sql` (já corrigido)
3. Cole no SQL Editor
4. Execute

**✅ Agora deve funcionar corretamente, distinguindo tabelas de views!**

---

**Correção aplicada!** ✅

