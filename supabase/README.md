# 🚀 Supabase - ness. OT GRC

**Sistema**: ness. OT GRC  
**Data**: 2025-01-04  
**Versão**: 1.0

---

## 📋 Estrutura do Projeto

```
supabase/
├── migrations/
│   ├── 001_init_schema.sql          # Schemas e tabelas principais
│   ├── 002_compliance_ai.sql       # Expansão compliance com IA
│   └── 003_triggers_rls.sql        # RLS e triggers de automação
└── functions/
    ├── ingest_wazuh/               # Edge Function: Ingestão Wazuh
    │   └── index.ts
    ├── ingest_zabbix/               # Edge Function: Ingestão Zabbix
    │   └── index.ts
    ├── ingest_rmm/                  # Edge Function: Ingestão RMMs
    │   └── index.ts
    └── agent_evaluate/              # Edge Function: Agente IA
        └── index.ts
```

---

## 🚀 Setup Inicial

### 1. Instalar Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Linux (via npm)
npm install -g supabase

# Windows (via npm)
npm install -g supabase
```

### 2. Login no Supabase

```bash
supabase login
```

### 3. Inicializar Projeto

```bash
cd /home/resper/TBE-OT
supabase init
```

### 4. Conectar ao Projeto Remoto

```bash
supabase link --project-ref bingfdowmvyfeffieujk
```

### 5. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp supabase/.env.local.example supabase/.env.local

# Editar .env.local com suas chaves
nano supabase/.env.local
```

**Variáveis necessárias**:
- `SUPABASE_URL`: https://bingfdowmvyfeffieujk.supabase.co
- `SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave service role do Supabase
- `OPENAI_API_KEY`: Chave da API OpenAI (para /agent/evaluate)

---

## 📊 Aplicar Migrações

### Aplicar todas as migrações

```bash
supabase db push
```

### Aplicar migração específica

```bash
supabase migration up
```

### Verificar status das migrações

```bash
supabase migration list
```

---

## ⚡ Edge Functions

### Desenvolver localmente

```bash
# Iniciar Supabase local
supabase start

# Servir funções com variáveis de ambiente
supabase functions serve --env-file supabase/.env.local
```

### Testar Edge Functions

#### Testar ingest_wazuh

```bash
curl -X POST http://localhost:54321/functions/v1/ingest-wazuh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "tenant_id": "test-tenant-uuid",
    "source": "wazuh-production",
    "category": "security",
    "asset_ref": "192.168.1.100",
    "payload": {
      "id": "wazuh-event-123",
      "timestamp": "2025-01-04T10:00:00Z",
      "agent": {
        "id": "001",
        "name": "server-01",
        "ip": "192.168.1.100"
      },
      "rule": {
        "id": 1001,
        "description": "Root login attempt",
        "level": 12,
        "mitre": {
          "technique": "T1078",
          "tactic": "TA0008"
        }
      }
    }
  }'
```

#### Testar ingest_zabbix

```bash
curl -X POST http://localhost:54321/functions/v1/ingest-zabbix \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "tenant_id": "test-tenant-uuid",
    "source": "zabbix-production",
    "category": "availability",
    "asset_ref": "server-01",
    "payload": {
      "host": "server-01",
      "hostname": "server-01.example.com",
      "ip": "192.168.1.100",
      "availability": 99.85,
      "uptime": 86400,
      "timestamp": "2025-01-04T10:00:00Z"
    }
  }'
```

#### Testar agent_evaluate

```bash
curl -X POST http://localhost:54321/functions/v1/agent-evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "tenant_id": "test-tenant-uuid",
    "scope": "control",
    "scope_id": "control-uuid-here",
    "context": {
      "recent_events_count": 10,
      "time_window_hours": 24,
      "include_mitre": true
    }
  }'
```

---

## 🚀 Deploy

### Deploy de Migrações

```bash
supabase db push --project-ref bingfdowmvyfeffieujk
```

### Deploy de Edge Functions

```bash
# Deploy todas as funções
supabase functions deploy --project-ref bingfdowmvyfeffieujk

# Deploy função específica
supabase functions deploy ingest-wazuh --project-ref bingfdowmvyfeffieujk
supabase functions deploy ingest-zabbix --project-ref bingfdowmvyfeffieujk
supabase functions deploy ingest-rmm --project-ref bingfdowmvyfeffieujk
supabase functions deploy agent-evaluate --project-ref bingfdowmvyfeffieujk
```

### Configurar Secrets (Variáveis de Ambiente)

```bash
# Configurar secrets para Edge Functions
supabase secrets set OPENAI_API_KEY=your-openai-key --project-ref bingfdowmvyfeffieujk
supabase secrets set OPENAI_MODEL=gpt-4o --project-ref bingfdowmvyfeffieujk
```

---

## 📊 Verificar Status

### Verificar Schemas Criados

```sql
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('integration', 'security', 'compliance', 'audit')
ORDER BY schema_name;
```

### Verificar Tabelas Criadas

```sql
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema IN ('integration', 'security', 'compliance', 'audit')
ORDER BY table_schema, table_name;
```

### Verificar Edge Functions

```bash
supabase functions list --project-ref bingfdowmvyfeffieujk
```

---

## 🔍 Troubleshooting

### Erro: "relation does not exist"

- Verifique se as migrações foram aplicadas: `supabase migration list`
- Aplique as migrações: `supabase db push`

### Erro: "permission denied"

- Verifique se o RLS está configurado corretamente
- Verifique se está usando a service_role_key para operações admin

### Erro: "OpenAI API error"

- Verifique se `OPENAI_API_KEY` está configurado corretamente
- Verifique se a chave tem créditos disponíveis
- Verifique se o modelo está correto (`gpt-4o`)

---

## 📚 Documentação Adicional

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

**Próximos Passos**: Ver `.spec/ai-integration-plan.md` para plano completo de implementação

