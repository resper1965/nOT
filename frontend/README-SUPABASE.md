# 🔗 Configuração Supabase - ness. OT GRC

## ✅ Credenciais Configuradas

As credenciais do Supabase foram configuradas no arquivo `.env.local`:

- **URL**: `https://bingfdowmvyfeffieujk.supabase.co`
- **Anon Key**: Configurada ✅

## 🧪 Testar Conexão

### Opção 1: Via Next.js (Recomendado)

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o console do navegador (F12) e verifique se não há erros relacionados ao Supabase.

### Opção 2: Via Script de Teste

```bash
cd frontend
npx ts-node test-supabase-connection.ts
```

## 📝 Próximos Passos

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

Isso instalará o `@supabase/supabase-js` que já foi adicionado ao `package.json`.

### 2. Migrar Schema do Banco

Após confirmar a conexão, você precisará migrar o schema do PostgreSQL atual para o Supabase:

1. **Exportar schema atual**:
```bash
pg_dump -h localhost -p 5434 -U ness_admin -d ness_ot_grc --schema-only > schema.sql
```

2. **Importar no Supabase**:
   - Acesse o SQL Editor no Dashboard do Supabase
   - Cole o conteúdo do `schema.sql`
   - Execute o script

Ou use o CLI do Supabase:
```bash
supabase db push
```

### 3. Testar no Código

Você pode agora usar o cliente Supabase no seu código:

```typescript
import { supabase } from '@/lib/supabase';

// Exemplo: Buscar VLANs
const { data, error } = await supabase
  .from('topology.vlans')
  .select('*');

if (error) {
  console.error('Erro:', error);
} else {
  console.log('VLANs:', data);
}
```

## 🔐 Segurança

⚠️ **Importante**: 
- O arquivo `.env.local` está no `.gitignore` e não será commitado
- A chave `NEXT_PUBLIC_SUPABASE_ANON_KEY` é pública e pode ser exposta no frontend
- Para operações server-side, você precisará da `SUPABASE_SERVICE_ROLE_KEY` (nunca expor no frontend)

## 🚀 Deploy na Vercel

Quando fizer o deploy na Vercel, adicione estas variáveis de ambiente no Dashboard:

1. Vá em **Settings > Environment Variables**
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://bingfdowmvyfeffieujk.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave anon

Consulte o arquivo `VERCEL-SETUP.md` para mais detalhes.

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [SUPABASE-INTEGRATION.md](../SUPABASE-INTEGRATION.md) - Documentação completa

---

**Desenvolvido com 💙 pela equipe ness.**

