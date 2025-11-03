# ⚠️ Erro: Syntax Error ao Executar SQL

## Problema

Erro encontrado:
```
ERROR:  42601: syntax error at or near "//"
LINE 1: // API Route for Gap Analysis ONS
```

## Causa

O erro ocorre quando você copia código **TypeScript/JavaScript** (arquivos `.ts` ou `.js`) para o **SQL Editor** do Supabase.

**Comentários JavaScript/TypeScript** usam `//`:
```typescript
// API Route for Gap Analysis ONS
// Computes gaps by comparing ONS requirements with actual network data
```

**Comentários SQL** usam `--`:
```sql
-- Inserção de Frameworks de Compliance Relevantes
-- Sistema: ness. OT GRC
```

## Solução

### ✅ Use APENAS Arquivos `.sql`

Para cadastrar frameworks, use **APENAS** o arquivo SQL:

📄 **Arquivo Correto**: `supabase-insert-frameworks.sql`

### ❌ NÃO Use Estes Arquivos

- ❌ `frontend/src/app/api/remediation/gaps/route.ts` (TypeScript)
- ❌ `frontend/src/app/api/remediation/plan/route.ts` (TypeScript)
- ❌ Qualquer arquivo `.ts`, `.js`, `.tsx`, `.jsx`

## Instruções Corretas

### Passo 1: Acessar Supabase Dashboard
1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **ngrcot**
3. Clique em **SQL Editor**

### Passo 2: Copiar APENAS o Conteúdo do Arquivo SQL
1. Abra o arquivo: `supabase-insert-frameworks.sql`
2. Copie **todo o conteúdo** deste arquivo
3. Cole no **SQL Editor** do Supabase
4. Clique em **Run** (ou `Ctrl+Enter`)

### Passo 3: Verificar Execução
Você deve ver:
- ✅ Mensagem de sucesso
- ✅ Resultado mostrando os frameworks cadastrados

## Arquivos SQL Disponíveis

| Arquivo | Descrição | Uso |
|---------|-----------|-----|
| `supabase-insert-frameworks.sql` | Cadastra frameworks de compliance | ✅ Use este |
| `supabase-complete-schema.sql` | Schema completo do banco | ✅ Use para recriar todo o schema |
| `supabase-create.sql` | Criação inicial simplificada | ✅ Use para primeira criação |

## Arquivos TypeScript (NÃO usar no SQL Editor)

Estes arquivos são para o **frontend/backend**, não para SQL:

| Arquivo | Descrição |
|---------|-----------|
| `frontend/src/app/api/remediation/gaps/route.ts` | API route (TypeScript) |
| `frontend/src/app/api/remediation/plan/route.ts` | API route (TypeScript) |
| `frontend/src/app/api/remediation/risks/route.ts` | API route (TypeScript) |

**⚠️ ATENÇÃO**: Estes arquivos TypeScript são executados pelo **Next.js**, não pelo **Supabase SQL Editor**.

## Verificação

Após executar o SQL corretamente, verifique:

```sql
SELECT 
  framework_name,
  version,
  description,
  metadata->>'category' as category
FROM compliance.frameworks
ORDER BY framework_name;
```

Você deve ver os frameworks cadastrados:
- NIST Cybersecurity Framework
- ISO/IEC 27001
- ISO/IEC 27002
- ISO/IEC 27019
- NIST SP 800-82
- NIST SP 800-53

