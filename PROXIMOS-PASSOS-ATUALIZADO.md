# 🎯 Próximos Passos - ness. OT GRC

**Data**: 2025-11-01  
**Status**: Integração ness-theme concluída, pronto para evolução

---

## 🔴 PRIORIDADE 1: Imediato (Esta Semana)

### 1. ✅ Finalizar Integração ness-theme

**Status**: 95% completo - pendente instalação de dependência

**Ação necessária**:
```bash
cd frontend
npm install next-intl
```

**Arquivos criados** (prontos para uso):
- ✅ i18n configurado (pt/en/es)
- ✅ Componentes de branding refinados
- ✅ Supabase otimizado
- ✅ Locale switcher component

**Tempo estimado**: 5 minutos

---

### 2. 🔄 Migrar Schema para Supabase

**Objetivo**: Ter dados reais no Supabase para dashboards funcionarem

**Passos**:
1. Exportar schema do PostgreSQL local:
   ```bash
   docker exec ness-ot-grc-db pg_dump -U ness_admin -d ness_ot_grc \
     --schema-only --no-owner --no-privileges > schema.sql
   ```

2. Importar no Supabase SQL Editor:
   - Acesse: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql
   - Cole e execute o conteúdo de `schema.sql`

3. Verificar migração:
   ```sql
   SELECT schema_name FROM information_schema.schemata 
   WHERE schema_name IN ('security', 'topology', 'compliance', 'audit');
   ```

4. Configurar RLS nas tabelas principais

**Documentação completa**: `MIGRATION-GUIDE.md`

**Tempo estimado**: 1-2 horas

---

### 3. 🔌 Conectar Frontend ao Supabase

**Objetivo**: Fazer dashboards funcionarem com dados reais

**Passos**:
1. Atualizar `frontend/src/lib/api-supabase.ts` com queries reais
2. Substituir chamadas mock por queries Supabase
3. Testar cada dashboard:
   - Overview Dashboard
   - Compliance Dashboard
   - Network Dashboard
   - Remediation Dashboard

**Arquivos a atualizar**:
- `frontend/src/lib/api-supabase.ts` - Implementar queries reais
- Componentes dos dashboards - Usar dados do Supabase

**Tempo estimado**: 2-3 horas

---

## 🟡 PRIORIDADE 2: Importante (Próximas 2 Semanas)

### 4. 📤 Implementar Upload de Documentos

**Objetivo**: Permitir upload via Supabase Storage

**Passos**:
1. Criar bucket no Supabase Storage:
   - Nome: `compliance-documents`
   - Público: Não
   - Políticas: Apenas usuários autenticados

2. Criar componente de upload:
   ```tsx
   // frontend/src/components/documents/upload-document.tsx
   - Usar Supabase Storage API
   - Preview de documentos
   - Versionamento
   ```

3. Integrar com página de documentos:
   - `/dashboard/compliance/documents`

**Tempo estimado**: 4-6 horas

---

### 5. 🔔 Sistema de Notificações

**Objetivo**: Alertas para documentos próximos ao vencimento

**Passos**:
1. Criar tabela de notificações:
   ```sql
   CREATE TABLE compliance.notifications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id),
     type TEXT NOT NULL,
     message TEXT NOT NULL,
     read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. Implementar lógica de alertas (cron job ou edge function)
3. Criar componente de notificações no frontend
4. Integrar com sistema de eventos

**Tempo estimado**: 3-4 horas

---

### 6. ✅ Workflow de Aprovação

**Objetivo**: Sistema de aprovação de documentos (Conselho → Diretoria → Operação)

**Passos**:
1. Criar tabela de workflow:
   ```sql
   CREATE TABLE compliance.approval_workflow (
     id UUID PRIMARY KEY,
     document_id UUID REFERENCES compliance.documents(id),
     status TEXT, -- 'pending', 'approved', 'rejected'
     approver_role TEXT,
     comments TEXT,
     created_at TIMESTAMP
   );
   ```

2. Implementar estados de aprovação
3. Criar interface de aprovação no frontend
4. Integrar com notificações

**Tempo estimado**: 6-8 horas

---

## 🟢 PRIORIDADE 3: Melhorias (Próximo Mês)

### 7. ⚡ Real-time Updates

**Objetivo**: Dashboards atualizarem em tempo real

**Passos**:
1. Configurar Supabase Realtime (já configurado no cliente)
2. Criar subscriptions nos dashboards:
   ```typescript
   supabase
     .channel('compliance-documents')
     .on('postgres_changes', { event: '*', schema: 'compliance', table: 'documents' }, 
       (payload) => {
         // Atualizar dados do dashboard
       })
     .subscribe();
   ```

3. Atualizar componentes quando houver mudanças

**Tempo estimado**: 3-4 horas

---

### 8. 📄 Exportação de Relatórios

**Objetivo**: Gerar PDFs de relatórios de compliance

**Passos**:
1. Escolher biblioteca: `@react-pdf/renderer` ou `puppeteer`
2. Criar templates de relatórios
3. Implementar geração de PDF
4. Adicionar botão de exportação nos dashboards

**Tempo estimado**: 6-8 horas

---

### 9. 🧪 Testes

**Objetivo**: Cobertura de testes para garantir qualidade

**Passos**:
1. Configurar Vitest ou Jest
2. Testes unitários para componentes críticos
3. Testes de integração para APIs Supabase
4. Testes E2E para fluxos principais

**Tempo estimado**: 10-15 horas

---

## 📊 Roadmap Visual

```
Esta Semana:
├─ ✅ Finalizar integração ness-theme (5 min)
├─ 🔄 Migrar schema para Supabase (1-2h)
└─ 🔌 Conectar frontend ao Supabase (2-3h)

Próxima Semana:
├─ 📤 Upload de documentos (4-6h)
├─ 🔔 Sistema de notificações (3-4h)
└─ ✅ Workflow de aprovação (início) (6-8h)

Semana 3-4:
├─ ✅ Workflow de aprovação (completo)
├─ ⚡ Real-time updates (3-4h)
└─ 📄 Exportação de relatórios (6-8h)

Próximo Mês:
├─ 🧪 Testes (10-15h)
├─ 🚀 Otimizações
└─ 📱 Melhorias de UX
```

---

## ✅ Checklist Resumido

### Esta Semana
- [ ] Instalar `next-intl` (5 min)
- [ ] Migrar schema para Supabase (1-2h)
- [ ] Configurar RLS no Supabase (30 min)
- [ ] Conectar frontend ao Supabase (2-3h)
- [ ] Testar dashboards com dados reais (1h)

### Próximas 2 Semanas
- [ ] Criar bucket Supabase Storage
- [ ] Implementar upload de documentos (4-6h)
- [ ] Sistema de notificações (3-4h)
- [ ] Workflow de aprovação - Fase 1 (6-8h)

### Próximo Mês
- [ ] Workflow de aprovação - Completo
- [ ] Real-time updates (3-4h)
- [ ] Exportação de relatórios (6-8h)
- [ ] Testes básicos (10-15h)

---

## 🛠️ Links Úteis

### Supabase
- **Dashboard**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk
- **SQL Editor**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/sql
- **Storage**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/storage/buckets
- **Auth**: https://supabase.com/dashboard/project/bingfdowmvyfeffieujk/auth/users

### Vercel
- **Dashboard**: https://vercel.com/nessbr-projects/frontend
- **Deployments**: https://vercel.com/nessbr-projects/frontend/deployments

### GitHub
- **Repositório**: https://github.com/resper1965/nOT
- **Actions**: https://github.com/resper1965/nOT/actions

---

## 📝 Notas Importantes

1. **Instalação next-intl**: Precisa ser feita manualmente quando tiver permissões de npm
2. **Migração Schema**: Pode ser feita via SQL Editor do Supabase (mais fácil)
3. **RLS**: Configurar políticas de segurança antes de popular dados sensíveis
4. **Testing**: Começar com testes básicos e expandir gradualmente

---

**Última Atualização**: 2025-11-01  
**Próxima Revisão**: 2025-11-08

---

**Desenvolvido com 💙 pela equipe ness.**

