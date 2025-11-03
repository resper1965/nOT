# 🎯 Como "Alimentar" o Spec-Kit para Entender o Projeto

## 📚 Visão Geral

O **Spec-Kit** é uma ferramenta de **Spec-Driven Development** que mantém especificações em sincronia com o código. Para que ele entenda o projeto por completo e possa ajudá-lo a continuar o desenvolvimento, você precisa "alimentá-lo" com informações estruturadas.

## 🗂️ Estrutura Atual do Spec-Kit

```
.spec/
├── config.toml              # Configuração (Cursor AI Agent)
├── project.md              # ✅ Visão geral do projeto
├── requirements.md          # ✅ Requisitos funcionais/não-funcionais
├── architecture.md          # ✅ Arquitetura do sistema
├── document-upload-conversion.md  # ✅ Feature específica
└── README.md               # ✅ Documentação do Spec-Kit
```

## 🎯 Estratégias para "Alimentar" o Spec-Kit

### 1. **Documentar o Estado Atual do Projeto**

#### ✅ O que já está feito:
- `.spec/project.md` - Visão geral do projeto ✅
- `.spec/architecture.md` - Arquitetura técnica ✅
- `.spec/requirements.md` - Requisitos funcionais ✅

#### 🔄 O que precisa ser expandido:

**1.1. Criar `.spec/current-state.md`** - Estado atual detalhado

```markdown
# Estado Atual do Projeto - ness. OT GRC

## ✅ Implementado (100%)

### Frontend
- [x] Next.js 15 + React 19
- [x] 24 páginas do dashboard
- [x] Autenticação Supabase
- [x] Integração com Supabase Database
- [x] Design system ness.
- [x] i18n (pt, en, es)

### Backend
- [x] Supabase PostgreSQL (4 schemas)
- [x] Next.js API Routes
- [x] Row Level Security (RLS)
- [x] Supabase Storage

### Features
- [x] Gestão de documentos (50+ obrigatórios)
- [x] Análise de rede OT (6 páginas)
- [x] Gestão de riscos (4 páginas)
- [x] Conformidade regulatória (5 páginas)
- [x] Upload de documentos (em implementação)
- [x] Conversão para Markdown (em implementação)

## ⏳ Em Implementação

### Document Upload & Conversion
- [x] Schema do banco atualizado
- [x] API Routes criadas
- [x] Componente de upload
- [ ] Editor Markdown
- [ ] Visualização de documentos
- [ ] Versionamento

## 📋 Planejado (Backlog)

### Fase 1: Completar Document Upload
- [ ] Editor Markdown com preview
- [ ] Auto-save
- [ ] Histórico de versões
- [ ] Download de documentos

### Fase 2: Relatórios
- [ ] Geração de PDF
- [ ] Exportação CSV/Excel
- [ ] Templates de relatórios

### Fase 3: Monitoramento Real
- [ ] SNMP polling
- [ ] NetFlow/sFlow
- [ ] Network Health em tempo real
```

### 2. **Documentar Intenções Futuras**

#### ✅ Criar `.spec/roadmap.md` - Roadmap detalhado

```markdown
# Roadmap - ness. OT GRC

## Q1 2025 - Document Management

### Jan 2025
- [ ] Completar upload de documentos
- [ ] Editor Markdown com preview
- [ ] Auto-save e versionamento
- [ ] Visualização de documentos

### Fev 2025
- [ ] Geração de relatórios PDF
- [ ] Exportação CSV/Excel
- [ ] Templates de relatórios

## Q2 2025 - Real-time Monitoring

### Mar 2025
- [ ] SNMP polling implementation
- [ ] NetFlow/sFlow integration
- [ ] Time-series database (InfluxDB)

### Abr 2025
- [ ] Network Health em tempo real
- [ ] Alertas e notificações
- [ ] Dashboard executivo

## Q3 2025 - Advanced Features

### Mai 2025
- [ ] AI-powered gap analysis
- [ ] Automated remediation suggestions
- [ ] Compliance scoring

## Prioridades
1. **P0 (Crítico)**: Completar Document Upload
2. **P1 (Alto)**: Relatórios PDF
3. **P2 (Médio)**: Monitoramento Real
4. **P3 (Baixo)**: Features avançadas
```

### 3. **Documentar Decisões Arquiteturais**

#### ✅ Criar `.spec/decisions.md` - ADRs (Architecture Decision Records)

```markdown
# Architecture Decision Records (ADRs)

## ADR-001: Migração para Supabase
**Data**: 2024-12-15
**Status**: ✅ Aprovado e Implementado

### Contexto
Projeto original usava FastAPI + PostgreSQL local. Necessidade de deploy simples e escalável.

### Decisão
Migrar para Supabase (PostgreSQL gerenciado + Auth + Storage).

### Consequências
- ✅ Deploy simplificado (Vercel + Supabase)
- ✅ Auth integrado (Supabase Auth)
- ✅ Storage integrado (Supabase Storage)
- ✅ RLS nativo (Row Level Security)
- ⚠️ Vendor lock-in (Supabase)
- ⚠️ Limitações de customização

## ADR-002: Next.js API Routes vs FastAPI
**Data**: 2024-12-20
**Status**: ✅ Aprovado e Implementado

### Contexto
Precisávamos de API para queries Supabase. FastAPI era opcional mas adicionava complexidade.

### Decisão
Usar Next.js API Routes como principal, manter FastAPI como opcional/fallback.

### Consequências
- ✅ Arquitetura simplificada (tudo em Next.js)
- ✅ Deploy único (Vercel)
- ✅ Menos infraestrutura
- ⚠️ Limitações para processamento pesado (edge functions têm limites)

## ADR-003: Document Upload com Conversão para Markdown
**Data**: 2025-01-03
**Status**: ⏳ Em Implementação

### Contexto
Usuários precisam fazer upload de documentos (PDF, DOCX) e editá-los na plataforma.

### Decisão
Converter documentos para Markdown automaticamente após upload, preservando original.

### Consequências
- ✅ Documentos editáveis (Markdown é texto)
- ✅ Preservação do original (Storage)
- ✅ Versionamento facilitado (Markdown é diff-friendly)
- ⚠️ Complexidade de conversão (PDF, DOCX → MD)
- ⚠️ Possível perda de formatação
```

### 4. **Documentar Features por Módulo**

#### ✅ Criar specs detalhadas por módulo:

**`.spec/modules/compliance.md`**
```markdown
# Módulo Compliance - Especificação

## Visão Geral
Módulo de conformidade regulatória (ANEEL, ONS, IEC, NIST, ISO).

## Páginas Implementadas
- `/dashboard/compliance/aneel` - Conformidade ANEEL RN 964/2021
- `/dashboard/compliance/ons` - Controles ONS (5 mínimos)
- `/dashboard/compliance/frameworks` - Frameworks (IEC, NIST, ISO)
- `/dashboard/compliance/documents` - Gestão de documentos

## APIs
- `GET /api/compliance/documents` - Lista documentos
- `POST /api/documents/upload` - Upload de documentos
- `POST /api/documents/[id]/convert` - Conversão para Markdown
- `GET /api/documents/[id]/markdown` - Obter Markdown
- `PUT /api/documents/[id]/markdown` - Atualizar Markdown

## Database
- `compliance.frameworks` - Frameworks cadastrados
- `compliance.documents` - Documentos
- `compliance.document_versions` - Versões de documentos
- `compliance.required_documents` - 50+ documentos obrigatórios

## Status
- ✅ Gestão de documentos: 90% implementado
- ⏳ Upload e conversão: 70% implementado
- ⏳ Editor Markdown: 50% implementado
- 📋 Visualização: 0% (planejado)
```

**`.spec/modules/network.md`**
```markdown
# Módulo Network - Especificação

## Visão Geral
Análise de rede OT, topologia, VLANs, IPAM, roteamento.

## Páginas Implementadas
- `/dashboard/network/assets` - Inventário de ativos
- `/dashboard/network/topology` - Topologia visual
- `/dashboard/network/vlans` - Gestão de VLANs
- `/dashboard/network/ipam` - IP Address Management
- `/dashboard/network/routing` - Análise de roteamento
- `/dashboard/network/health` - Monitoramento de saúde

## APIs
- `GET /api/assets/stats` - Estatísticas de assets
- `GET /api/network/topology` - Topologia de rede
- `GET /api/network/vlans` - Lista de VLANs

## Database
- `topology.ip_subnets` - Sub-redes IP
- `topology.vlans` - VLANs
- `topology.network_zones` - Zonas de rede
- `security.assets` - Ativos de rede

## Status
- ✅ Inventário: 100% implementado
- ✅ Topologia: 100% implementado
- ⏳ Monitoramento real: 0% (planejado)
```

## 📝 Como "Contar" Suas Intenções para o Spec-Kit

### Método 1: Atualizar Specs Existentes

```bash
# Atualizar project.md com novas informações
uvx --from git+https://github.com/github/spec-kit.git specify update project

# O Spec-Kit vai analisar o código e sugerir atualizações
# Você pode editar o arquivo gerado para adicionar suas intenções
```

**Exemplo**: Editar `.spec/project.md` e adicionar:

```markdown
## 🎯 Próximos Passos (Q1 2025)

### Jan 2025
- [ ] Completar Editor Markdown com preview em tempo real
- [ ] Implementar auto-save (a cada 30 segundos)
- [ ] Criar histórico de versões visual
- [ ] Adicionar download de documentos originais

### Fev 2025
- [ ] Geração de relatórios PDF
- [ ] Exportação CSV/Excel
- [ ] Templates de relatórios customizáveis
```

### Método 2: Criar Specs para Novas Features

```bash
# Criar spec para nova feature
uvx --from git+https://github.com/github/spec-kit.git specify create feature-name

# Isso criará .spec/feature-name.md
# Edite o arquivo com suas intenções
```

**Exemplo**: `.spec/markdown-editor.md`

```markdown
# Markdown Editor - Especificação

## Visão Geral
Editor de Markdown com preview em tempo real para edição de documentos convertidos.

## Requisitos
- Preview em tempo real (split view)
- Auto-save a cada 30 segundos
- Save manual (Ctrl+S)
- Histórico de versões
- Suporte a frontmatter YAML

## Componentes
- `DocumentMarkdownEditor.tsx` - Editor principal
- `MarkdownPreview.tsx` - Preview renderizado
- `VersionHistory.tsx` - Histórico de versões

## APIs
- `GET /api/documents/[id]/markdown` - Obter conteúdo
- `PUT /api/documents/[id]/markdown` - Salvar conteúdo
- `GET /api/documents/[id]/versions` - Listar versões
- `GET /api/documents/[id]/versions/[version]` - Obter versão específica

## Status
- ⏳ Planejado para Jan 2025
- Prioridade: P0 (Crítico)
```

### Método 3: Usar Comentários no Código

O Spec-Kit pode analisar comentários no código. Adicione comentários estruturados:

```typescript
// TODO: Implementar preview em tempo real
// TODO: Adicionar auto-save a cada 30 segundos
// TODO: Criar histórico de versões visual
// TODO: Adicionar suporte a frontmatter YAML

/**
 * @spec markdown-editor
 * @status in-progress
 * @priority P0
 * @description Editor de Markdown com preview em tempo real
 * @requirements
 * - Preview em tempo real (split view)
 * - Auto-save a cada 30 segundos
 * - Save manual (Ctrl+S)
 * - Histórico de versões
 */
export function DocumentMarkdownEditor() {
  // ...
}
```

### Método 4: Criar Arquivo de Intenções

Crie `.spec/intentions.md`:

```markdown
# Intenções e Planos Futuros

## 🎯 Próximas Features

### 1. Editor Markdown Completo
**Prioridade**: P0 (Crítico)
**Prazo**: Jan 2025
**Status**: ⏳ Planejado

**O que queremos:**
- Editor de Markdown com preview em tempo real
- Auto-save a cada 30 segundos
- Save manual (Ctrl+S)
- Histórico de versões visual
- Suporte a frontmatter YAML

**Por quê:**
- Usuários precisam editar documentos convertidos
- Markdown é editável e versionável
- Preview em tempo real melhora UX

**Como:**
- Usar biblioteca `react-markdown` ou `@uiw/react-md-editor`
- Implementar auto-save com `useDebounce`
- Criar API para versionamento
- Adicionar componente de histórico

### 2. Geração de Relatórios PDF
**Prioridade**: P1 (Alto)
**Prazo**: Fev 2025
**Status**: 📋 Planejado

**O que queremos:**
- Geração de relatórios em PDF
- Templates customizáveis
- Exportação de dados para CSV/Excel
- Agendamento de relatórios

**Por quê:**
- Clientes precisam de relatórios para auditorias
- PDF é padrão para documentos formais
- Exportação facilita análise de dados

**Como:**
- Usar `react-pdf` ou `puppeteer` para geração
- Criar templates em Markdown/HTML
- Implementar exportação CSV/Excel
- Adicionar agendamento de relatórios

## 🔄 Melhorias Planejadas

### Performance
- [ ] Implementar cache de queries Supabase
- [ ] Otimizar bundle size (code splitting)
- [ ] Adicionar lazy loading de componentes

### UX
- [ ] Melhorar feedback de upload
- [ ] Adicionar loading states
- [ ] Implementar toast notifications

### Segurança
- [ ] Adicionar validação de arquivos no upload
- [ ] Implementar rate limiting
- [ ] Adicionar verificação de integridade (SHA-256)
```

## 🔄 Workflow Recomendado

### Semanalmente:

1. **Atualizar Estado Atual**
   ```bash
   # Atualizar project.md com status atual
   uvx --from git+https://github.com/github/spec-kit.git specify update project
   ```

2. **Revisar Intenções**
   - Editar `.spec/intentions.md` com novas ideias
   - Priorizar features planejadas
   - Atualizar roadmap

3. **Documentar Decisões**
   - Adicionar novos ADRs em `.spec/decisions.md`
   - Documentar decisões arquiteturais importantes

### Antes de Implementar Nova Feature:

1. **Criar Spec**
   ```bash
   uvx --from git+https://github.com/github/spec-kit.git specify create feature-name
   ```

2. **Documentar Requisitos**
   - Editar `.spec/feature-name.md`
   - Descrever o que, por quê, como
   - Definir APIs, componentes, database

3. **Validar Spec**
   ```bash
   uvx --from git+https://github.com/github/spec-kit.git specify validate
   ```

### Após Implementar Feature:

1. **Atualizar Spec**
   ```bash
   # Atualizar spec com o que foi implementado
   uvx --from git+https://github.com/github/spec-kit.git specify update feature-name
   ```

2. **Atualizar Estado Atual**
   - Marcar feature como concluída em `.spec/current-state.md`
   - Atualizar status em `.spec/modules/[module].md`

3. **Documentar Decisões**
   - Adicionar ADR se houver decisões arquiteturais importantes

## 📋 Checklist de Alimentação do Spec-Kit

Use este checklist para garantir que o Spec-Kit tenha informação completa:

- [ ] **Project.md** - Visão geral atualizada
- [ ] **Architecture.md** - Arquitetura técnica atualizada
- [ ] **Requirements.md** - Requisitos funcionais atualizados
- [ ] **Current-state.md** - Estado atual detalhado (criar se não existir)
- [ ] **Roadmap.md** - Roadmap de features (criar se não existir)
- [ ] **Decisions.md** - ADRs documentadas (criar se não existir)
- [ ] **Intentions.md** - Intenções futuras (criar se não existir)
- [ ] **Modules/** - Specs por módulo (criar se não existir)
- [ ] **Features/** - Specs de features específicas

## 🎯 Exemplo Prático: "Contar" sobre o Editor Markdown

### Passo 1: Criar Spec

```bash
uvx --from git+https://github.com/github/spec-kit.git specify create markdown-editor
```

### Passo 2: Editar `.spec/markdown-editor.md`

```markdown
# Markdown Editor - Especificação

## 🎯 O que queremos fazer

Criar um editor de Markdown completo com preview em tempo real para editar documentos convertidos na plataforma.

## ✅ Por quê

- Usuários precisam editar documentos após upload e conversão
- Markdown é editável e versionável
- Preview em tempo real melhora a experiência do usuário

## 🔧 Como vamos fazer

### Frontend
- Componente `DocumentMarkdownEditor.tsx`
  - Split view: editor à esquerda, preview à direita
  - Auto-save a cada 30 segundos
  - Save manual (Ctrl+S)
  - Suporte a frontmatter YAML

### Backend
- API Route `PUT /api/documents/[id]/markdown`
  - Atualizar `markdown_content` na tabela
  - Criar nova versão em `document_versions`
  - Retornar status de sucesso/erro

### Database
- Tabela `compliance.document_versions` já existe
- Campo `markdown_content` em `compliance.documents` já existe

## 📅 Prazo e Prioridade

- **Prioridade**: P0 (Crítico)
- **Prazo**: Jan 2025
- **Status**: ⏳ Planejado

## 🔗 Dependências

- [x] Upload de documentos ✅
- [x] Conversão para Markdown ✅
- [ ] Editor Markdown (este spec)
- [ ] Histórico de versões visual
```

### Passo 3: Atualizar Requirements

Editar `.spec/requirements.md`:

```markdown
### RF01: Gestão de Documentação ✅ **PARCIALMENTE IMPLEMENTADO**
- ✅ Upload de documentos
- ✅ Conversão para Markdown
- ⏳ **Editor Markdown** - Planejado (ver `.spec/markdown-editor.md`)
  - Preview em tempo real
  - Auto-save
  - Histórico de versões
```

### Passo 4: Atualizar Intentions

Editar `.spec/intentions.md`:

```markdown
## 🎯 Próximas Features

### 1. Editor Markdown Completo
**Prioridade**: P0 (Crítico)
**Prazo**: Jan 2025
**Status**: ⏳ Planejado
**Spec**: `.spec/markdown-editor.md`
```

## 🚀 Resultado

Após seguir estes passos, o Spec-Kit terá:

1. ✅ **Contexto completo** do projeto
2. ✅ **Estado atual** detalhado
3. ✅ **Intenções futuras** documentadas
4. ✅ **Roadmap** claro
5. ✅ **Decisões arquiteturais** registradas
6. ✅ **Features** especificadas

Agora, quando você usar o Cursor AI ou o Spec-Kit, ele poderá:

- Entender o estado atual do projeto
- Sugerir próximos passos baseados nas intenções
- Ajudar a implementar features planejadas
- Manter consistência arquitetural
- Documentar decisões automaticamente

---

**Próximo Passo**: Comece criando `.spec/current-state.md` e `.spec/intentions.md` para documentar o estado atual e suas intenções futuras!

