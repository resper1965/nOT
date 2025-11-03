# 📘 Guia Completo: GitHub Spec-Kit para ness. OT GRC

## 🎯 O que é o Spec-Kit?

O **GitHub Spec-Kit** é uma ferramenta que ajuda a manter especificações de arquitetura e requisitos em sincronia com o código, permitindo desenvolvimento orientado por especificações (Spec-Driven Development).

## ✅ Status Atual do Projeto

O projeto **ness. OT GRC** já está configurado com Spec-Kit:

```
.spec/
├── config.toml        ✅ Configuração (Cursor AI Agent)
├── project.md         ✅ Especificação geral do projeto
├── requirements.md    ✅ Requisitos funcionais e não-funcionais
├── architecture.md    ✅ Arquitetura do sistema
└── README.md          ✅ Documentação do Spec-Kit
```

## 🚀 Como Usar o Spec-Kit para Continuar o Desenvolvimento

### 1. Atualizar Especificações Existentes

Quando você implementar novas features, atualize as specs:

```bash
# Atualizar arquitetura após mudanças
uvx --from git+https://github.com/github/spec-kit.git specify update architecture

# Atualizar requisitos após novas funcionalidades
uvx --from git+https://github.com/github/spec-kit.git specify update requirements

# Atualizar especificação geral do projeto
uvx --from git+https://github.com/github/spec-kit.git specify update project
```

### 2. Criar Especificações para Novas Features

#### Exemplo: Criar Spec para Feature "Gap Analysis ONS"

```bash
# Criar nova spec
uvx --from git+https://github.com/github/spec-kit.git specify create gap-analysis-ons
```

Isso criará `.spec/gap-analysis-ons.md` que você pode preencher:

```markdown
# Gap Analysis ONS - Especificação

## Visão Geral
Sistema de análise de gaps de conformidade com Controle 5 ONS (Segmentação OT/IT).

## Requisitos
- Identificar gaps de segmentação Purdue
- Calcular CVSS scores para gaps críticos
- Gerar plano de adequação automático

## Arquitetura
- API Route: `/api/remediation/gaps`
- Database: `compliance.gaps` (se necessário)
- Frontend: `/dashboard/remediation/gaps`

## Implementação
[Descreva a implementação]
```

### 3. Validar Especificações

Antes de fazer commit, valide as specs:

```bash
# Validar todas as especificações
uvx --from git+https://github.com/github/spec-kit.git specify validate

# Listar todas as especificações
uvx --from git+https://github.com/github/spec-kit.git specify list
```

### 4. Usar Specs como Documentação Viva

#### Workflow Recomendado:

1. **Antes de implementar uma feature:**
   ```bash
   # Criar ou atualizar spec
   uvx --from git+https://github.com/github/spec-kit.git specify create nome-da-feature
   ```

2. **Durante o desenvolvimento:**
   - Consulte `.spec/architecture.md` para entender a arquitetura
   - Consulte `.spec/requirements.md` para requisitos
   - Atualize a spec conforme necessário

3. **Após implementar:**
   ```bash
   # Atualizar spec com o que foi implementado
   uvx --from git+https://github.com/github/spec-kit.git specify update nome-da-feature
   ```

4. **Antes de fazer commit:**
   ```bash
   # Validar specs
   uvx --from git+https://github.com/github/spec-kit.git specify validate
   ```

## 📝 Exemplos Práticos

### Exemplo 1: Adicionar Nova API Route

**Passo 1**: Criar spec
```bash
uvx --from git+https://github.com/github/spec-kit.git specify create api-compliance-assessments
```

**Passo 2**: Editar `.spec/api-compliance-assessments.md`:
```markdown
# API Compliance Assessments

## Endpoint
`GET /api/compliance/assessments`

## Requisitos
- Retornar lista de avaliações de conformidade
- Filtrar por framework (ANEEL, ONS, IEC)
- Ordenar por data de avaliação

## Implementação
- Arquivo: `frontend/src/app/api/compliance/assessments/route.ts`
- Query: Supabase `compliance.assessments`
- Autenticação: Middleware protegido
```

**Passo 3**: Atualizar arquitetura
```bash
uvx --from git+https://github.com/github/spec-kit.git specify update architecture
```

### Exemplo 2: Adicionar Nova Página

**Passo 1**: Criar spec
```bash
uvx --from git+https://github.com/github/spec-kit.git specify create dashboard-compliance-assessments
```

**Passo 2**: Editar `.spec/dashboard-compliance-assessments.md`:
```markdown
# Dashboard Compliance Assessments

## Rota
`/dashboard/compliance/assessments`

## Funcionalidades
- Lista de avaliações
- Filtros por framework
- Gráficos de conformidade
- Exportação de relatórios

## Componentes
- `AssessmentList` - Lista de avaliações
- `AssessmentFilters` - Filtros
- `ComplianceChart` - Gráfico de conformidade
```

**Passo 3**: Atualizar requirements
```bash
uvx --from git+https://github.com/github/spec-kit.git specify update requirements
```

## 🔄 Manutenção das Especificações

### Atualizações Regulares

1. **Após cada sprint/milestone:**
   ```bash
   # Atualizar todas as specs principais
   uvx --from git+https://github.com/github/spec-kit.git specify update architecture
   uvx --from git+https://github.com/github/spec-kit.git specify update requirements
   uvx --from git+https://github.com/github/spec-kit.git specify update project
   ```

2. **Ao adicionar novas dependências:**
   - Atualize `.spec/architecture.md` com a nova tecnologia
   - Atualize `.spec/requirements.md` se necessário

3. **Ao mudar estrutura do banco:**
   - Atualize `.spec/architecture.md` com o novo schema
   - Documente mudanças em migration notes

## 📚 Estrutura Recomendada de Specs

### Para Cada Feature Média/Grande

```
.spec/
├── features/
│   ├── gap-analysis.md        # Gap Analysis ONS
│   ├── risk-matrix.md         # Matriz de Riscos
│   ├── compliance-reports.md  # Relatórios de Compliance
│   └── network-health.md      # Monitoramento de Rede
```

### Para Cada Módulo Principal

```
.spec/
├── modules/
│   ├── compliance-module.md   # Módulo Compliance
│   ├── network-module.md       # Módulo Rede
│   ├── remediation-module.md   # Módulo Remediação
│   └── reports-module.md      # Módulo Relatórios
```

## 🎯 Comandos Úteis

### Comandos Principais

```bash
# Inicializar (já feito)
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai cursor-agent

# Criar nova spec
uvx --from git+https://github.com/github/spec-kit.git specify create <nome>

# Atualizar spec existente
uvx --from git+https://github.com/github/spec-kit.git specify update <nome>

# Listar todas as specs
uvx --from git+https://github.com/github/spec-kit.git specify list

# Validar todas as specs
uvx --from git+https://github.com/github/spec-kit.git specify validate

# Ver ajuda
uvx --from git+https://github.com/github/spec-kit.git specify --help
```

### Comandos para Manutenção

```bash
# Atualizar arquitetura após mudanças
uvx --from git+https://github.com/github/spec-kit.git specify update architecture

# Atualizar requisitos após novas funcionalidades
uvx --from git+https://github.com/github/spec-kit.git specify update requirements

# Atualizar projeto geral
uvx --from git+https://github.com/github/spec-kit.git specify update project
```

## 💡 Dicas de Uso

### 1. Mantenha as Specs Atualizadas

**✅ FAÇA:**
- Atualize specs após implementar features
- Documente decisões arquiteturais importantes
- Mantenha specs em sincronia com o código

**❌ NÃO FAÇA:**
- Deixe specs desatualizadas por muito tempo
- Documente implementações que não existem ainda
- Ignore validações de specs

### 2. Use Specs como Referência

**Para Desenvolvedores:**
- Consulte `.spec/architecture.md` antes de implementar
- Use `.spec/requirements.md` para entender requisitos
- Siga padrões documentados

**Para IA (Cursor/COPILOT):**
- As specs servem como contexto para assistentes de IA
- Mantenha specs detalhadas e bem estruturadas
- Use markdown claro e objetivo

### 3. Integre com Workflow de Desenvolvimento

**Workflow Sugerido:**

1. **Planejamento:**
   - Criar/atualizar spec para feature
   - Documentar requisitos e arquitetura

2. **Desenvolvimento:**
   - Consultar specs durante desenvolvimento
   - Atualizar specs conforme necessário

3. **Revisão:**
   - Validar specs antes de commit
   - Garantir que specs refletem implementação

4. **Documentação:**
   - Usar specs como documentação oficial
   - Compartilhar specs com equipe

## 🔗 Links Úteis

- [Documentação Oficial Spec-Kit](https://github.github.com/spec-kit/)
- [Repositório GitHub](https://github.com/github/spec-kit)
- [Documentação do Projeto](../README.md)
- [Arquitetura Atual](.spec/architecture.md)

## 📋 Checklist de Manutenção

Use este checklist regularmente:

- [ ] Validar todas as specs (`specify validate`)
- [ ] Atualizar arquitetura após mudanças estruturais
- [ ] Atualizar requisitos após novas funcionalidades
- [ ] Criar specs para novas features grandes
- [ ] Remover specs de features descontinuadas
- [ ] Revisar specs antes de releases maiores

---

**Configurado para**: ness. OT GRC  
**Agente de IA**: Cursor  
**Última atualização**: 2025-01-03

