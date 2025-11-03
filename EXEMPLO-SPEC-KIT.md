# 🎯 Exemplo Prático: Usando Spec-Kit para Nova Feature

## 📋 Cenário: Adicionar Feature "Exportação de Relatórios PDF"

Vamos ver como usar o Spec-Kit para documentar e desenvolver essa nova feature.

### Passo 1: Criar Spec para a Feature

```bash
# Criar spec para exportação de relatórios
uvx --from git+https://github.com/github/spec-kit.git specify create export-pdf-reports
```

Isso criará `.spec/export-pdf-reports.md` (que você preencherá):

```markdown
# Exportação de Relatórios PDF - Especificação

## 📋 Visão Geral
Sistema de exportação de relatórios de compliance em formato PDF para documentos ANEEL/ONS.

## ✅ Requisitos Funcionais

### RF01: Geração de PDF
- Sistema deve gerar PDFs a partir de dados de compliance
- Sistema deve incluir logos, cabeçalhos e rodapés padronizados
- Sistema deve suportar múltiplos tipos de relatórios:
  - Relatório ANEEL (RN 964/2021)
  - Relatório ONS (Controles Mínimos)
  - Gap Analysis Report
  - Risk Assessment Report

### RF02: Template de Relatórios
- Sistema deve usar templates padronizados
- Sistema deve incluir evidências de conformidade
- Sistema deve gerar índices automáticos

### RF03: Download de Relatórios
- Sistema deve permitir download imediato
- Sistema deve salvar relatórios no Supabase Storage
- Sistema deve manter histórico de relatórios gerados

## 🏗️ Arquitetura

### Frontend
- **Componente**: `frontend/src/components/reports/PDFExportButton.tsx`
- **Página**: `/dashboard/reports/generate`
- **Biblioteca**: `react-pdf` ou `@react-pdf/renderer`

### Backend (API Route)
- **Endpoint**: `/api/reports/generate-pdf`
- **Método**: POST
- **Parâmetros**:
  - `report_type`: 'aneel' | 'ons' | 'gap-analysis' | 'risk-assessment'
  - `date_range`: { start: Date, end: Date }
  - `filters`: { framework_id?: string, compliance_status?: string }

### Storage
- **Supabase Storage**: Bucket `reports`
- **Estrutura**: `reports/{user_id}/{report_type}/{timestamp}.pdf`

## 🔐 Segurança
- Apenas usuários autenticados podem gerar relatórios
- Relatórios contêm dados sensíveis - proteger com RLS
- Validação de permissões antes de gerar

## 📊 Dados Necessários
- Dados de compliance (`compliance.assessments`)
- Documentos (`compliance.documents`)
- Gaps (`compliance.gaps`)
- Assets (`security.assets`)

## 🎨 Design
- Usar design system ness. (Montserrat, #00ADE8)
- Incluir logo ness. no cabeçalho
- Formatação profissional para documentos regulatórios
```

### Passo 2: Atualizar Requirements.md

Após criar a spec, atualize os requisitos:

```bash
# Atualizar requirements com a nova feature
uvx --from git+https://github.com/github/spec-kit.git specify update requirements
```

Isso atualizará `.spec/requirements.md` incluindo:
- Novo requisito funcional: "RF06: Exportação de Relatórios PDF"

### Passo 3: Atualizar Architecture.md

Atualize a arquitetura para incluir a nova feature:

```bash
# Atualizar arquitetura
uvx --from git+https://github.com/github/spec-kit.git specify update architecture
```

Isso atualizará `.spec/architecture.md` com:
- Nova seção sobre exportação de PDF
- Bibliotecas adicionadas (react-pdf)
- Novas rotas e componentes

### Passo 4: Implementar a Feature

Durante o desenvolvimento:

1. **Consulte a spec regularmente:**
   ```bash
   # Ler a spec
   cat .spec/export-pdf-reports.md
   ```

2. **Siga a arquitetura documentada:**
   - Crie componentes conforme especificado
   - Use as rotas e endpoints documentados
   - Siga padrões de segurança especificados

3. **Atualize a spec conforme necessário:**
   - Se descobrir mudanças necessárias durante desenvolvimento
   - Documente decisões técnicas importantes
   - Atualize arquitetura se necessário

### Passo 5: Validar Specs Após Implementação

Após implementar:

```bash
# Validar todas as specs
uvx --from git+https://github.com/github/spec-kit.git specify validate

# Atualizar spec com implementação final
uvx --from git+https://github.com/github/spec-kit.git specify update export-pdf-reports
```

### Passo 6: Commitar com Specs Atualizadas

```bash
# Adicionar specs atualizadas ao commit
git add .spec/export-pdf-reports.md
git add .spec/architecture.md
git add .spec/requirements.md

# Commit
git commit -m "feat: adiciona exportação de relatórios PDF

- Implementa geração de PDF para relatórios ANEEL/ONS
- Adiciona Supabase Storage para armazenamento
- Atualiza specs (export-pdf-reports.md)"
```

## 🔄 Workflow Completo

```
1. Planejamento
   ↓
   Criar spec: specify create export-pdf-reports
   ↓
2. Documentação
   ↓
   Preencher spec, atualizar requirements/architecture
   ↓
3. Desenvolvimento
   ↓
   Consultar specs, implementar, atualizar specs
   ↓
4. Validação
   ↓
   specify validate, revisar specs
   ↓
5. Commit
   ↓
   Commitar código + specs atualizadas
```

## 💡 Dicas

1. **Mantenha Specs Detalhadas:** Quanto mais detalhada a spec, melhor o desenvolvimento
2. **Atualize Regularmente:** Não deixe specs desatualizadas
3. **Use como Referência:** Consulte specs durante desenvolvimento
4. **Valide Antes de Commit:** Sempre valide antes de commitar
5. **Compartilhe com Equipe:** Specs são documentação oficial

---

**Próximos Passos:**
1. Escolha uma feature para desenvolver
2. Crie a spec usando `specify create`
3. Desenvolva seguindo a spec
4. Atualize specs após implementar
5. Valide e commite

