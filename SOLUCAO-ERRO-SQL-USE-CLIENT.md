# 🔧 Solução: Erro "use client" no SQL Editor

## ❌ Erro
```
ERROR:  42601: syntax error at or near ""use client""
LINE 1: "use client";
```

## 🔍 Causa
O erro ocorre quando código JavaScript/TypeScript (como `"use client"`) é copiado acidentalmente para o SQL Editor do Supabase. O PostgreSQL não entende essa diretiva do Next.js/React.

## ✅ Solução

### Opção 1: Copiar Apenas o Conteúdo SQL (Recomendado)

1. **Abra o arquivo** `supabase-map-frameworks-controls.sql` em um editor de texto puro (VS Code, Notepad++, etc.)

2. **Selecione TODO o conteúdo** do arquivo:
   - No VS Code: `Ctrl+A` (Windows/Linux) ou `Cmd+A` (Mac)
   - Certifique-se de que começa com `-- ============================================================================`
   - E termina com a query SELECT de verificação

3. **Copie APENAS o conteúdo SQL**:
   - Não copie nenhum código JavaScript/TypeScript
   - Não copie tags HTML
   - Apenas o SQL puro

4. **Cole no Supabase SQL Editor**:
   - Vá para Supabase Dashboard → SQL Editor
   - New Query
   - Cole o conteúdo
   - Execute

### Opção 2: Verificar o Arquivo Antes de Copiar

O arquivo SQL deve começar assim:
```sql
-- ============================================================================
-- Mapeamento de Controles para Frameworks de Compliance
-- Sistema: ness. OT GRC
-- Data: 2025-01-03
-- ============================================================================
```

E **NÃO deve conter**:
- ❌ `"use client"`
- ❌ `import` statements
- ❌ `export` statements
- ❌ Código TypeScript/JavaScript
- ❌ Tags HTML

### Opção 3: Usar o Comando Correto

Se você estiver usando a linha de comando, certifique-se de executar o arquivo SQL correto:

```bash
# Verificar que o arquivo é realmente SQL
file supabase-map-frameworks-controls.sql
# Deve mostrar: "ASCII text" ou "UTF-8 text"

# Executar apenas se for SQL puro
# Via psql (se configurado)
psql -h <host> -U postgres -d postgres -f supabase-map-frameworks-controls.sql
```

## 🔍 Verificação Rápida

Antes de copiar, verifique que o conteúdo começa e termina assim:

**Início correto:**
```sql
-- ============================================================================
-- Mapeamento de Controles para Frameworks de Compliance
```

**Fim correto:**
```sql
ORDER BY f.framework_name;
```

## 💡 Dica
Se você copiou o conteúdo de uma página web ou do GitHub, pode ter copiado código de exemplo junto. Sempre copie apenas o conteúdo do arquivo `.sql` diretamente.

## ✅ Após Copiar Corretamente

O script deve executar sem erros e você verá mensagens como:
```
NOTICE: Inserted NIST CSF 2.0 controls
NOTICE: Inserted ISO/IEC 27001 controls
NOTICE: Inserted ISO/IEC 27019 controls
...
NOTICE: Framework controls mapping completed!
```

## 🚨 Se o Erro Persistir

1. **Baixe o arquivo diretamente do repositório**:
   - Vá para o GitHub
   - Abra o arquivo `supabase-map-frameworks-controls.sql`
   - Clique em "Raw" para ver apenas o conteúdo
   - Copie todo o conteúdo e cole no SQL Editor

2. **Ou crie um novo arquivo SQL** no Supabase SQL Editor e copie o conteúdo linha por linha do arquivo original.
