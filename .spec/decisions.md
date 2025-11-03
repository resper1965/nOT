# Architecture Decision Records (ADRs) - ness. OT GRC

**Última Atualização**: 2025-01-03

## ADR-001: Migração para Supabase
**Data**: 2024-12-15  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Desenvolvimento

### Contexto
O projeto original usava FastAPI + PostgreSQL local. Havia necessidade de:
- Deploy simplificado
- Autenticação integrada
- Storage para documentos
- Escalabilidade

### Decisão
Migrar completamente para **Supabase** (PostgreSQL gerenciado + Auth + Storage).

### Consequências
**Positivas:**
- ✅ Deploy simplificado (Vercel + Supabase)
- ✅ Auth integrado (Supabase Auth com PKCE flow)
- ✅ Storage integrado (Supabase Storage)
- ✅ RLS nativo (Row Level Security)
- ✅ Backups automáticos
- ✅ Connection pooling automático
- ✅ Real-time subscriptions disponíveis

**Negativas:**
- ⚠️ Vendor lock-in (Supabase)
- ⚠️ Limitações de customização (vs PostgreSQL raw)
- ⚠️ Custo pode aumentar com escala
- ⚠️ Dependência de serviço externo

### Alternativas Consideradas
1. **Firebase** - Rejeitado (NoSQL, não adequado para dados relacionais)
2. **PlanetScale** - Rejeitado (MySQL, não PostgreSQL)
3. **Neon** - Rejeitado (apenas PostgreSQL, sem Auth/Storage)
4. **Supabase** - ✅ Escolhido (PostgreSQL + Auth + Storage)

---

## ADR-002: Next.js API Routes vs FastAPI
**Data**: 2024-12-20  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Desenvolvimento

### Contexto
Precisávamos de API para queries Supabase. FastAPI era opcional mas adicionava complexidade de deploy.

### Decisão
Usar **Next.js API Routes** como principal, manter FastAPI como opcional/fallback apenas para processamento pesado.

### Consequências
**Positivas:**
- ✅ Arquitetura simplificada (tudo em Next.js)
- ✅ Deploy único (Vercel)
- ✅ Menos infraestrutura
- ✅ Menos latência (serverless edge functions)
- ✅ TypeScript compartilhado (frontend + backend)

**Negativas:**
- ⚠️ Limitações para processamento pesado (edge functions têm limites)
- ⚠️ Timeout de 10s no Vercel Hobby (60s no Pro)
- ⚠️ Menos flexibilidade que FastAPI para casos complexos

### Alternativas Consideradas
1. **Apenas FastAPI** - Rejeitado (complexidade de deploy)
2. **Apenas Next.js API Routes** - ✅ Escolhido (simplicidade)
3. **Híbrido** - Considerado (FastAPI para processamento pesado, mantido como opcional)

---

## ADR-003: Document Upload com Conversão para Markdown
**Data**: 2025-01-03  
**Status**: ⏳ Em Implementação  
**Autor**: Equipe de Desenvolvimento

### Contexto
Usuários precisam fazer upload de documentos (PDF, DOCX, DOC, TXT) e editá-los na plataforma. Documentos binários não são editáveis diretamente.

### Decisão
Converter documentos para **Markdown** automaticamente após upload, preservando o documento original no Supabase Storage.

### Consequências
**Positivas:**
- ✅ Documentos editáveis (Markdown é texto)
- ✅ Preservação do original (Storage)
- ✅ Versionamento facilitado (Markdown é diff-friendly)
- ✅ Compatível com Git (versionamento)
- ✅ Fácil de processar (texto simples)

**Negativas:**
- ⚠️ Complexidade de conversão (PDF, DOCX → MD)
- ⚠️ Possível perda de formatação (tabelas, imagens, etc.)
- ⚠️ Dependência de bibliotecas de conversão (pdf-parse, mammoth)
- ⚠️ Processamento pesado (pode ser lento)

### Alternativas Consideradas
1. **Manter documentos binários** - Rejeitado (não editáveis)
2. **HTML em vez de Markdown** - Rejeitado (mais verboso, menos limpo)
3. **Markdown** - ✅ Escolhido (padrão, editável, versionável)

### Implementação
- Biblioteca `pdf-parse` para PDF
- Biblioteca `mammoth` para DOCX
- Biblioteca `turndown` para HTML (se necessário)
- Frontmatter YAML para metadados
- Armazenamento em `compliance.documents.markdown_content` (TEXT)

---

## ADR-004: Autenticação com Supabase Auth (PKCE)
**Data**: 2024-12-15  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Desenvolvimento

### Contexto
Precisávamos de autenticação segura. Supabase Auth oferece PKCE flow (Proof Key for Code Exchange) que é mais seguro que auth code flow tradicional.

### Decisão
Usar **Supabase Auth com PKCE flow** para autenticação.

### Consequências
**Positivas:**
- ✅ Segurança melhorada (PKCE previne code interception)
- ✅ Integração nativa com Supabase
- ✅ Session management automático
- ✅ Refresh tokens automáticos
- ✅ Suporte a MFA (configurável)

**Negativas:**
- ⚠️ Dependência de Supabase Auth
- ⚠️ Limitações de customização

### Alternativas Consideradas
1. **NextAuth.js** - Rejeitado (mais complexo, menos integrado)
2. **Clerk** - Rejeitado (custo adicional, menos integrado)
3. **Supabase Auth** - ✅ Escolhido (nativo, gratuito até certo ponto)

---

## ADR-005: Client-side vs Server-side Supabase Client
**Data**: 2024-12-20  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Desenvolvimento

### Contexto
Supabase oferece dois tipos de clientes:
- `@supabase/supabase-js` - Client-side (localStorage)
- `@supabase/ssr` - Server-side (HTTP cookies)

### Decisão
Usar **`@supabase/ssr`** para autenticação (HTTP cookies) e **`@supabase/supabase-js`** apenas para operações client-side não críticas.

### Consequências
**Positivas:**
- ✅ Session persistence via HTTP cookies (melhor para SSR)
- ✅ Segurança melhorada (cookies são httpOnly)
- ✅ Compatível com Next.js middleware
- ✅ Funciona com SSR/SSG

**Negativas:**
- ⚠️ Mais complexo que client-side simples
- ⚠️ Requer configuração de cookies

### Alternativas Consideradas
1. **Apenas client-side** - Rejeitado (localStorage não funciona bem com SSR)
2. **Apenas server-side** - ✅ Escolhido (melhor para Next.js)
3. **Híbrido** - Considerado (implementado parcialmente)

---

## ADR-006: Row Level Security (RLS) no Supabase
**Data**: 2024-12-15  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Desenvolvimento

### Contexto
Precisávamos de segurança de dados. Supabase oferece RLS (Row Level Security) nativo.

### Decisão
Habilitar **RLS em todas as tabelas** e usar **Service Role** apenas para operações admin server-side.

### Consequências
**Positivas:**
- ✅ Segurança de dados nativa
- ✅ Políticas declarativas (SQL)
- ✅ Proteção automática (não precisa lembrar de verificar em cada query)
- ✅ Service Role para operações admin (bypasses RLS)

**Negativas:**
- ⚠️ Políticas RLS podem ser complexas
- ⚠️ Debugging mais difícil
- ⚠️ Performance pode ser afetada (mas mínimo)

### Alternativas Consideradas
1. **Sem RLS** - Rejeitado (inseguro)
2. **RLS com Service Role** - ✅ Escolhido (segurança + flexibilidade)
3. **Apenas Service Role** - Rejeitado (sem segurança granular)

---

## ADR-007: Design System ness. (Dark-First)
**Data**: 2024-11-20  
**Status**: ✅ Aprovado e Implementado  
**Autor**: Equipe de Design

### Contexto
Precisávamos de um design system consistente. O setor de OT/energia geralmente usa interfaces escuras (operadores trabalham em ambientes escuros).

### Decisão
Criar design system **ness.** com **dark-first** approach, usando **Montserrat** como fonte principal e **#00ADE8** como cor primária.

### Consequências
**Positivas:**
- ✅ Consistência visual
- ✅ Melhor para ambientes escuros (setor OT)
- ✅ Reduz fadiga visual
- ✅ Branding consistente

**Negativas:**
- ⚠️ Pode não ser ideal para todos os usuários
- ⚠️ Modo claro pode precisar de ajustes

### Alternativas Consideradas
1. **Light-first** - Rejeitado (não adequado para setor OT)
2. **Dark-first** - ✅ Escolhido (adequado para setor OT)
3. **Both modes** - Considerado (implementado parcialmente)

---

## 📋 Template para Novos ADRs

```markdown
## ADR-XXX: [Título da Decisão]
**Data**: YYYY-MM-DD  
**Status**: [Proposta | Aprovado | Rejeitado | Deprecated]  
**Autor**: [Nome]

### Contexto
[Descreva o contexto e o problema que precisa ser resolvido]

### Decisão
[Descreva a decisão tomada]

### Consequências
**Positivas:**
- ✅ [Consequência positiva]

**Negativas:**
- ⚠️ [Consequência negativa]

### Alternativas Consideradas
1. **[Alternativa 1]** - [Razão da rejeição]
2. **[Alternativa 2]** - ✅ Escolhido
3. **[Alternativa 3]** - Considerado
```

---

**Como usar este arquivo:**
1. Documente decisões arquiteturais importantes aqui
2. Use o template acima para novos ADRs
3. Atualize o status quando a decisão for implementada ou deprecada
4. Referencie ADRs em specs de features quando relevante

