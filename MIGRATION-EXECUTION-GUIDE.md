# 🚀 Guia de Execução - Migração para Supabase

**Data**: 2025-11-01  
**Status**: Pronto para execução

---

## 📋 Checklist Pré-Migração

- [x] Scripts de migração criados
- [x] Queries Supabase implementadas
- [x] API atualizada com fallback
- [x] Documentação criada

---

## 🔴 ETAPA 1: Instalar next-intl (5 min)

### Opção 1: Via Script (Recomendado)

```bash
cd frontend
./scripts/install-next-intl.sh
```

### Opção 2: Manualmente

```bash
cd frontend
npm install next-intl@^3.0.0
```

**Verificar Instalação**:
```bash
grep "next-intl" package.json
```

**Status Esperado**: ✅ `"next-intl": "^3.0.0"` no package.json

---

## 🔴 ETAPA 2: Migrar Schema para Supabase (1-2h)

### Passo 1: Exportar Schema Local

```bash
# Executar script de migração
./scripts/migrate-to-supabase.sh
```

**O que o script faz**:
1. ✅ Verifica se Docker está rodando
2. ✅ Verifica se container do banco existe
3. ✅ Exporta schema completo do PostgreSQL
4. ✅ Cria arquivo otimizado para Supabase
5. ✅ Adiciona configuração de RLS automaticamente

**Arquivos Criados**:
- `migration/schema-complete.sql` - Schema completo exportado
- `migration/schema-structure.sql` - Estrutura apenas
- `migration/supabase-migration.sql` - **Arquivo otimizado para Supabase** ⭐

### Passo 2: Importar no Supabase SQL Editor

1. **Acessar SQL Editor**:
   - URL: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql
   - Ou: Dashboard → SQL Editor → New Query

2. **Abrir arquivo de migração**:
   ```bash
   # Visualizar conteúdo
   cat migration/supabase-migration.sql
   ```

3. **Copiar e Colar no SQL Editor**:
   - Copiar todo o conteúdo de `migration/supabase-migration.sql`
   - Colar no SQL Editor do Supabase
   - Revisar o script antes de executar

4. **Executar Script**:
   - Clicar em "Run" ou pressionar `Ctrl+Enter`
   - Aguardar execução (pode levar alguns minutos)

### Passo 3: Verificar Migração

Execute estas queries no SQL Editor para verificar:

```sql
-- Verificar schemas criados
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('security', 'topology', 'compliance', 'audit');

-- Verificar tabelas criadas
SELECT schemaname, COUNT(*) as table_count
FROM pg_tables
WHERE schemaname IN ('security', 'topology', 'compliance', 'audit')
GROUP BY schemaname;

-- Verificar estrutura de uma tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'security' 
  AND table_name = 'assets'
ORDER BY ordinal_position;

-- Verificar RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname IN ('security', 'topology', 'compliance', 'audit')
  AND rowsecurity = true
ORDER BY schemaname, tablename;
```

**Resultado Esperado**:
- ✅ 4 schemas criados (security, topology, compliance, audit)
- ✅ 40+ tabelas criadas
- ✅ RLS habilitado nas tabelas principais
- ✅ Políticas de segurança criadas

### Passo 4: Configurar Políticas Adicionais (Opcional)

Se precisar de políticas mais específicas:

```sql
-- Política para usuários verem apenas seus dados
CREATE POLICY "Users can view own documents"
ON compliance.documents
FOR SELECT
USING (auth.uid() = created_by_id);

-- Repetir para outras tabelas conforme necessário
```

---

## 🔴 ETAPA 3: Configurar Variáveis de Ambiente

### Frontend (.env.local)

```bash
# Já configurado em .env.local
NEXT_PUBLIC_SUPABASE_URL=https://bingfdowmvyfeffieujk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_USE_SUPABASE=true  # Usar Supabase como padrão
```

**Verificar Configuração**:
```bash
cat frontend/.env.local
```

### Vercel (Produção)

1. Acesse: https://vercel.com/nessbr-projects/frontend/settings/environment-variables
2. Adicione/Verifique:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_USE_SUPABASE=true`

---

## 🔴 ETAPA 4: Testar Conexão

### Teste 1: Conexão Básica

```bash
# No diretório do projeto
cd frontend

# Testar conexão (criar arquivo de teste temporário)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('security.assets').select('count', { count: 'exact', head: true })
  .then(({ count }) => console.log('✅ Conexão OK! Assets:', count))
  .catch(err => console.error('❌ Erro:', err.message));
"
```

### Teste 2: Queries no Frontend

Criar página de teste temporária:

```typescript
// frontend/src/app/test-supabase/page.tsx
import { getAssetsStatsFromSupabase } from '@/lib/api-supabase';

export default async function TestSupabase() {
  try {
    const stats = await getAssetsStatsFromSupabase();
    return (
      <div className="p-4">
        <h1>✅ Conexão Supabase Funcionando!</h1>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-4">
        <h1>❌ Erro na Conexão</h1>
        <pre>{error.message}</pre>
      </div>
    );
  }
}
```

Acessar: http://localhost:3002/test-supabase

---

## ✅ Verificação Final

### Checklist Completo

- [ ] next-intl instalado
- [ ] Schema migrado para Supabase
- [ ] Schemas criados (security, topology, compliance, audit)
- [ ] Tabelas criadas (40+ tabelas)
- [ ] RLS configurado
- [ ] Políticas de segurança criadas
- [ ] Variáveis de ambiente configuradas
- [ ] Conexão testada e funcionando
- [ ] Queries Supabase retornando dados

### Testar Dashboards

1. **Overview Dashboard**:
   - Acessar: http://localhost:3002/dashboard/overview
   - Verificar se dados aparecem

2. **Network Dashboard**:
   - Acessar: http://localhost:3002/dashboard/network/assets
   - Verificar se assets aparecem

3. **Compliance Dashboard**:
   - Acessar: http://localhost:3002/dashboard/compliance/documents
   - Verificar se documentos aparecem

---

## 🚨 Troubleshooting

### Erro: Schema não existe

**Solução**:
```sql
-- Criar schemas manualmente
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS topology;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS audit;
```

### Erro: Tabela não encontrada

**Verificar**:
- Schema correto: `schema.table`
- Tabela existe: `SELECT * FROM information_schema.tables WHERE table_schema = 'security';`

### Erro: Permissão negada

**Solução**:
- Verificar RLS habilitado
- Verificar políticas de segurança criadas
- Verificar se usuário está autenticado

### Erro: Conexão falhou

**Verificar**:
- Variáveis de ambiente configuradas
- URL e Key corretos
- Supabase está acessível

---

## 📚 Próximos Passos Após Migração

1. **Importar Dados** (Opcional):
   - Exportar dados do PostgreSQL local
   - Importar no Supabase via SQL Editor ou Table Editor

2. **Testar Funcionalidades**:
   - Dashboards
   - Consultas
   - Filtros e paginação

3. **Configurar Storage**:
   - Criar bucket para documentos
   - Implementar upload de arquivos

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk
- **SQL Editor**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql
- **Table Editor**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/editor
- **Storage**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/storage/buckets
- **Logs**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/logs

---

**Última Atualização**: 2025-11-01  
**Status**: ✅ Pronto para execução

---

**Desenvolvido com 💙 pela equipe ness.**

