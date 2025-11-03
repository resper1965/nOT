# 🎯 Próximos Passos - ness. OT GRC

**Data**: 2025-01-03  
**Status Atual**: ✅ Correções de segurança e views aplicadas

## ⚡ Passos Imediatos (Urgente)

### 1. Executar Scripts SQL no Supabase ⚠️

**Antes de fazer deploy, execute estes scripts no Supabase:**

#### 1.1. Criar Views no Schema Public
- **Arquivo**: `supabase-create-views.sql`
- **O que faz**: Cria views no schema `public` para expor tabelas dos schemas customizados
- **Por quê**: Supabase PostgREST não acessa diretamente schemas customizados
- **Como**: 
  1. Acesse https://supabase.com/dashboard
  2. Selecione seu projeto
  3. Vá para **SQL Editor**
  4. Cole o conteúdo de `supabase-create-views.sql`
  5. Execute o script (Run)

#### 1.2. Corrigir Avisos de Segurança
- **Arquivo**: `supabase-fix-security-warnings.sql`
- **O que faz**: Corrige funções com `search_path` mutável
- **Por quê**: Resolve avisos do Supabase Linter sobre segurança
- **Como**: 
  1. No SQL Editor do Supabase
  2. Cole o conteúdo de `supabase-fix-security-warnings.sql`
  3. Execute o script (Run)

#### 1.3. Habilitar Leaked Password Protection
- **O que fazer**: Habilitar no Dashboard do Supabase
- **Por quê**: Protege contra uso de senhas comprometidas
- **Como**: 
  1. Dashboard > **Authentication** > **Settings**
  2. Security > **Password Security**
  3. Habilitar **"Leaked Password Protection"**
  4. Salvar

**📋 Checklist:**
- [ ] Views criadas no schema public
- [ ] Funções SQL corrigidas (search_path)
- [ ] Leaked Password Protection habilitado

---

## 🚀 Depois dos Scripts SQL

### 2. Fazer Build e Deploy na Vercel

Após executar os scripts SQL no Supabase:

```bash
# 1. Fazer commit das mudanças (se houver)
git add -A
git commit -m "fix: atualizações finais"
git push origin feature/ness-theme-migration

# 2. Fazer deploy na Vercel
vercel deploy --prod --yes
```

**📋 Checklist:**
- [ ] Scripts SQL executados no Supabase
- [ ] Build na Vercel bem-sucedido
- [ ] Deploy em produção concluído
- [ ] Testar APIs funcionando

---

## 📋 Próxima Feature Prioritária

### 3. Editor Markdown Completo (P0 - Crítico)

**Status**: ⏳ Planejado  
**Prazo**: Jan 2025  
**Esforço**: 40 horas (2 semanas)

#### O que implementar:

1. **Editor Markdown com Preview** (20h)
   - Split view: editor à esquerda, preview à direita
   - Biblioteca: `@uiw/react-md-editor` ou `react-markdown` + `react-syntax-highlighter`
   - Preview em tempo real

2. **Auto-save** (10h)
   - Auto-save a cada 30 segundos
   - Usar `useDebounce` e `useEffect`
   - Indicador visual de salvamento

3. **Save Manual** (5h)
   - Save manual (Ctrl+S)
   - Feedback visual de sucesso/erro

4. **Histórico de Versões** (5h)
   - Visualizar histórico de versões
   - Comparar versões (diff)
   - Recuperar versões anteriores

#### Arquivos a criar/modificar:

```
frontend/src/
├── components/compliance/
│   ├── DocumentMarkdownEditor.tsx      # Editor principal
│   ├── MarkdownPreview.tsx              # Preview renderizado
│   └── VersionHistory.tsx                # Histórico de versões
├── app/api/documents/[id]/
│   └── versions/
│       └── route.ts                      # API para versões
└── app/dashboard/compliance/documents/[id]/
    └── edit/
        └── page.tsx                      # Página de edição
```

**📋 Checklist:**
- [ ] Editor Markdown com preview
- [ ] Auto-save implementado
- [ ] Save manual funcionando
- [ ] Histórico de versões visual
- [ ] API para versões criada

---

## 🔄 Melhorias Planejadas (P1 - Alto)

### 4. Geração de Relatórios PDF (Fev 2025)
- Geração de relatórios em PDF
- Templates customizáveis
- Exportação CSV/Excel

### 5. Melhorias UX/UI (Mar 2025)
- Toast notifications
- Loading states consistentes
- Skeleton loaders
- Acessibilidade WCAG AA

### 6. Performance Optimization (Mar 2025)
- Cache de queries (React Query)
- Code splitting
- Lazy loading

---

## 📊 Status Atual do Projeto

### ✅ Implementado (100%)
- ✅ Frontend Next.js 15 + React 19
- ✅ 24 páginas do dashboard
- ✅ Autenticação Supabase
- ✅ Database schema completo (4 schemas, 20+ tabelas)
- ✅ Upload de documentos (70% completo)
- ✅ Conversão para Markdown (70% completo)
- ✅ Design system ness.
- ✅ i18n (pt, en, es)

### ⏳ Em Implementação (70%)
- ⏳ Upload de documentos (70%)
- ⏳ Conversão para Markdown (70%)
- ⏳ Editor Markdown (0% - próximo passo)

### 📋 Planejado (Backlog)
- 📋 Editor Markdown completo (P0)
- 📋 Relatórios PDF (P1)
- 📋 Monitoramento Real (P2)
- 📋 AI Gap Analysis (P3)

---

## 🎯 Prioridades Imediatas

1. **URGENTE**: Executar scripts SQL no Supabase
   - Views no schema public
   - Correções de segurança
   - Habilitar Leaked Password Protection

2. **CRÍTICO**: Fazer build e deploy na Vercel
   - Testar se APIs funcionam após views criadas
   - Verificar se erros 500 foram resolvidos

3. **ALTO**: Implementar Editor Markdown
   - Próxima feature prioritária (P0)
   - Bloqueia uso completo da feature de upload

---

## 📝 Notas Importantes

- **Scripts SQL**: Execute no Supabase antes de fazer deploy
- **Views**: Necessárias para que APIs funcionem corretamente
- **Segurança**: Funções SQL devem ter `search_path` definido
- **Editor Markdown**: Próxima feature crítica para completar upload de documentos

---

**Próximo Passo Recomendado**: Executar `supabase-create-views.sql` e `supabase-fix-security-warnings.sql` no Supabase, depois fazer build e deploy na Vercel.

