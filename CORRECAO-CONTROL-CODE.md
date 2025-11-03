# 🔧 Correção: Coluna control_code não existe

**Erro:** `ERROR: 42703: column "control_code" does not exist`

---

## ✅ Problema Resolvido

**Causa:** A tabela `compliance.controls` pode ter sido criada parcialmente em uma execução anterior sem a coluna `control_code`. O `CREATE TABLE IF NOT EXISTS` não adiciona colunas faltantes.

**Solução:** Adicionado bloco `DO $$ ... END $$` que verifica se a tabela existe e, se a coluna não existir, adiciona antes de criar o índice.

---

## 🔧 Alteração Realizada

### Tabela `compliance.controls`

**Antes:**
```sql
CREATE INDEX IF NOT EXISTS idx_controls_code ON compliance.controls(control_code);
```

**Depois:**
```sql
-- Add control_code column if table exists without it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'compliance' AND table_name = 'controls')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'compliance' AND table_name = 'controls' AND column_name = 'control_code')
    THEN
        ALTER TABLE compliance.controls ADD COLUMN control_code VARCHAR(100);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_controls_code ON compliance.controls(control_code);
```

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

**✅ Agora deve funcionar mesmo se a tabela já existir parcialmente!**

---

**Correção aplicada!** ✅

