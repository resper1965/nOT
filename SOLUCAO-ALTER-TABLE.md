# 🔧 Solução: Coluna purdue_level não existe

**Erro:** `ERROR: 42703: column "purdue_level" does not exist`

---

## ✅ Problema Resolvido

**Causa:** A tabela pode ter sido criada parcialmente em uma execução anterior sem a coluna `purdue_level`. O `CREATE TABLE IF NOT EXISTS` não adiciona colunas faltantes.

**Solução:** Adicionados comandos `ALTER TABLE` com verificação para garantir que a coluna existe antes de criar índices.

---

## 🔧 Alterações Realizadas

### Tabela `topology.ip_subnets`

**Antes:**
```sql
CREATE INDEX IF NOT EXISTS idx_subnets_purdue ON topology.ip_subnets(purdue_level);
```

**Depois:**
```sql
-- Add purdue_level column if table exists without it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'topology' AND table_name = 'ip_subnets')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'topology' AND table_name = 'ip_subnets' AND column_name = 'purdue_level')
    THEN
        ALTER TABLE topology.ip_subnets ADD COLUMN purdue_level INTEGER CHECK (purdue_level BETWEEN 0 AND 5);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_subnets_purdue ON topology.ip_subnets(purdue_level);
```

### Tabela `topology.vlans`

**Mesma solução aplicada** para garantir que a coluna `purdue_level` existe antes de criar o índice.

---

## ✅ Arquivo Corrigido

- **Arquivo:** `supabase-migration.sql`
- **Status:** ✅ Pronto para executar novamente

---

## 🚀 Próximo Passo

**Execute novamente o script no Supabase SQL Editor:**

1. Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql/new
2. Copie o conteúdo de `supabase-migration.sql` (já corrigido)
3. Cole no SQL Editor
4. Execute

**✅ Agora deve funcionar mesmo se as tabelas já existirem parcialmente!**

---

## 🔍 Alternativa: Limpar e Recriar

Se ainda houver problemas, você pode limpar e recriar tudo:

```sql
-- Limpar schemas (CUIDADO: apaga todos os dados!)
DROP SCHEMA IF EXISTS security CASCADE;
DROP SCHEMA IF EXISTS topology CASCADE;
DROP SCHEMA IF EXISTS compliance CASCADE;
DROP SCHEMA IF EXISTS audit CASCADE;

-- Depois executar o script completo novamente
```

**⚠️ Isso apagará todos os dados! Use apenas se não houver dados importantes.**

---

**Correção aplicada!** ✅

