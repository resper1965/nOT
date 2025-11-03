# Upload e Conversão de Documentos - Especificação

## 📋 Visão Geral

Sistema de upload de documentos obrigatórios na seção **Normativa / Documentos Obrigatórios** (`/dashboard/compliance/documents`) que:

1. **Recebe documentos** em formatos diversos (PDF, DOC, DOCX, etc)
2. **Preserva o documento original** no Supabase Storage
3. **Converte automaticamente para Markdown** (formato maleável e editável)
4. **Armazena ambas as versões** (original + markdown) no banco de dados
5. **Permite edição do Markdown** diretamente na plataforma

## 🎯 Objetivos

### Objetivo Principal
Permitir que usuários façam upload de seus documentos existentes e ter uma versão editável em Markdown para facilitar atualizações e revisões.

### Benefícios
- ✅ Preserva documentos originais (auditoria)
- ✅ Versão editável em Markdown (maleável)
- ✅ Fácil atualização de conteúdo
- ✅ Rastreamento de mudanças (via versionamento)
- ✅ Busca full-text no conteúdo Markdown

## ✅ Requisitos Funcionais

### RF01: Upload de Documentos

**Descrição**: Sistema deve permitir upload de documentos em múltiplos formatos.

**Formatos Suportados**:
- PDF (`.pdf`)
- Word (`.doc`, `.docx`)
- Texto (`.txt`)
- Markdown (`.md`) - já formatado

**Restrições**:
- Tamanho máximo: 10MB por documento
- Tipos MIME válidos apenas
- Validação de extensão antes de upload

**Ações do Usuário**:
- Clicar em "Upload Documento" na página `/dashboard/compliance/documents`
- Selecionar arquivo do sistema
- Visualizar preview antes de confirmar
- Confirmar upload

### RF02: Preservação do Documento Original

**Descrição**: Sistema deve armazenar o documento original exatamente como foi enviado.

**Armazenamento**:
- **Supabase Storage**: Bucket `documents` 
- **Estrutura**: `documents/{user_id}/{document_id}/original/{filename}`
- **Metadados**:
  - Nome original do arquivo
  - Tipo MIME
  - Tamanho em bytes
  - Hash SHA-256 (integridade)
  - Data de upload
  - Usuário que fez upload

**Banco de Dados**:
- Tabela: `compliance.documents`
- Campos:
  - `id` - UUID do documento
  - `storage_path` - Caminho no Supabase Storage (original)
  - `original_filename` - Nome original
  - `file_type` - Tipo MIME
  - `file_size` - Tamanho em bytes
  - `file_hash` - SHA-256 hash

### RF03: Conversão para Markdown

**Descrição**: Sistema deve converter automaticamente documentos para formato Markdown.

**Conversão por Tipo**:

1. **PDF → Markdown**:
   - Usar biblioteca: `pdf-parse` ou `pdfjs-dist`
   - Extrair texto preservando estrutura
   - Converter formatação básica (títulos, listas, parágrafos)
   - Preservar links se existirem

2. **DOCX → Markdown**:
   - Usar biblioteca: `mammoth` ou `docx`
   - Converter formatação (bold, italic, headings)
   - Preservar listas e tabelas
   - Converter imagens para referências `![alt](url)`

3. **DOC → Markdown**:
   - Usar biblioteca: `mammoth` (suporta DOC via conversão)
   - Similar ao DOCX, com limitações

4. **TXT → Markdown**:
   - Aplicar formatação mínima
   - Preservar estrutura de parágrafos
   - Converter quebras de linha

5. **MD → Markdown**:
   - Já está em Markdown, apenas validar e armazenar

**Qualidade da Conversão**:
- Preservar títulos e hierarquia (H1, H2, H3)
- Preservar listas (ordenadas e não-ordenadas)
- Preservar parágrafos e quebras de linha
- Tentar preservar formatação (bold, italic)
- Adicionar metadados YAML frontmatter no início do Markdown

**Frontmatter Gerado**:
```yaml
---
id: "DOC-001"
title: "Nome do Documento"
category: "POL"
framework: "ANEEL RN 964/2021"
version: "1.0"
uploaded_at: "2025-01-03T10:30:00Z"
uploaded_by: "user@example.com"
original_file: "documento_original.pdf"
converted_at: "2025-01-03T10:30:15Z"
---
```

### RF04: Armazenamento da Versão Markdown

**Descrição**: Sistema deve armazenar versão Markdown editável.

**Armazenamento**:
- **Supabase Storage**: Bucket `documents`
- **Estrutura**: `documents/{user_id}/{document_id}/markdown/document.md`
- **Banco de Dados**:
  - Tabela: `compliance.documents`
  - Campo: `markdown_content` (TEXT)
  - Campo: `markdown_path` (TEXT) - caminho no storage

**Estrutura do Documento Markdown**:
- Frontmatter YAML (metadados)
- Conteúdo do documento convertido
- Seções bem estruturadas
- Preservação de formatação quando possível

### RF05: Edição de Documentos Markdown

**Descrição**: Sistema deve permitir edição do conteúdo Markdown na plataforma.

**Interface**:
- Editor Markdown com preview (split view)
- Componente: Editor baseado em `react-markdown` ou similar
- Funcionalidades:
  - Syntax highlighting
  - Preview em tempo real
  - Toolbar com formatação (bold, italic, headings, lists)
  - Auto-save (salvar automaticamente a cada 30s)
  - Botão "Salvar" manual

**Validação**:
- Validar sintaxe Markdown antes de salvar
- Validar frontmatter YAML
- Validar que documento ainda existe

**Versionamento**:
- Ao salvar, criar nova versão
- Manter histórico de versões
- Mostrar diff entre versões

### RF06: Download de Versões

**Descrição**: Sistema deve permitir download tanto do original quanto do Markdown.

**Downloads Disponíveis**:
1. **Original**: Download do arquivo original exatamente como foi enviado
2. **Markdown**: Download do arquivo `.md` editado
3. **Export PDF**: Exportar Markdown editado para PDF (opcional)

## 🏗️ Arquitetura

### Frontend

#### Componentes

1. **`DocumentUploadDialog.tsx`**
   - Localização: `frontend/src/components/compliance/DocumentUploadDialog.tsx`
   - Funcionalidade: Modal/dialog para upload
   - Features:
     - Drag & drop de arquivos
     - Preview do arquivo selecionado
     - Validação de tipo e tamanho
     - Progress bar durante upload
     - Botão de confirmação

2. **`DocumentMarkdownEditor.tsx`**
   - Localização: `frontend/src/components/compliance/DocumentMarkdownEditor.tsx`
   - Funcionalidade: Editor Markdown com preview
   - Features:
     - Editor de texto (textarea ou CodeMirror)
     - Preview renderizado (react-markdown)
     - Toolbar de formatação
     - Auto-save
     - Validação em tempo real

3. **`DocumentViewer.tsx`**
   - Localização: `frontend/src/components/compliance/DocumentViewer.tsx`
   - Funcionalidade: Visualizador de documentos
   - Features:
     - Visualizar original (PDF viewer)
     - Visualizar Markdown (renderizado)
     - Alternar entre versões
     - Download de versões

#### Páginas

1. **`/dashboard/compliance/documents/upload`**
   - Nova página para upload
   - Usar `DocumentUploadDialog` ou página dedicada

2. **`/dashboard/compliance/documents/[id]/edit`**
   - Página de edição do Markdown
   - Usar `DocumentMarkdownEditor`

#### API Routes

1. **`/api/documents/upload`** (POST)
   - Receber arquivo
   - Upload para Supabase Storage (original)
   - Iniciar conversão para Markdown
   - Retornar status

2. **`/api/documents/[id]/convert`** (POST)
   - Processar conversão para Markdown
   - Upload do Markdown para Storage
   - Atualizar banco de dados

3. **`/api/documents/[id]/markdown`** (GET/PUT)
   - GET: Retornar conteúdo Markdown
   - PUT: Salvar conteúdo Markdown editado

4. **`/api/documents/[id]/download`** (GET)
   - Download do arquivo original
   - Query param: `?type=original|markdown`

### Backend (API Routes Next.js)

#### Estrutura de Arquivos

```
frontend/src/app/api/documents/
├── upload/
│   └── route.ts              # Upload de arquivo
├── [id]/
│   ├── convert/
│   │   └── route.ts          # Conversão para Markdown
│   ├── markdown/
│   │   └── route.ts          # GET/PUT conteúdo Markdown
│   ├── download/
│   │   └── route.ts          # Download de versões
│   └── route.ts               # CRUD do documento
```

#### Processo de Upload e Conversão

```
1. Usuário faz upload
   ↓
2. /api/documents/upload
   - Validar arquivo (tipo, tamanho)
   - Upload para Supabase Storage (original)
   - Criar registro em compliance.documents
   - Retornar document_id
   ↓
3. /api/documents/[id]/convert (assíncrono ou webhook)
   - Baixar arquivo original do Storage
   - Converter para Markdown (biblioteca específica)
   - Upload do Markdown para Storage
   - Atualizar compliance.documents:
     - markdown_content (texto completo)
     - markdown_path (caminho no storage)
     - conversion_status ('pending' | 'completed' | 'failed')
   ↓
4. Notificar usuário (opcional)
   - Status de conversão
   - Link para editar Markdown
```

### Database Schema

#### Tabela: `compliance.documents` (atualizada)

**Campos Adicionais Necessários**:

```sql
ALTER TABLE compliance.documents ADD COLUMN IF NOT EXISTS 
  original_filename VARCHAR(500),
  file_type VARCHAR(100),
  file_size BIGINT,
  file_hash VARCHAR(64),  -- SHA-256
  markdown_content TEXT,
  markdown_path TEXT,
  conversion_status VARCHAR(50) DEFAULT 'pending',
  conversion_error TEXT,
  converted_at TIMESTAMP;
```

**Índices**:
```sql
CREATE INDEX IF NOT EXISTS idx_documents_conversion_status 
  ON compliance.documents(conversion_status);
CREATE INDEX IF NOT EXISTS idx_documents_file_hash 
  ON compliance.documents(file_hash);
```

### Storage (Supabase Storage)

#### Bucket: `documents`

**Estrutura de Pastas**:
```
documents/
├── {user_id}/
│   ├── {document_id}/
│   │   ├── original/
│   │   │   └── {original_filename}
│   │   └── markdown/
│   │       └── document.md
│   └── {document_id_2}/
│       ├── original/
│       └── markdown/
```

**Políticas RLS**:
- Usuários autenticados podem:
  - Upload para sua própria pasta `{user_id}/`
  - Download de seus próprios documentos
  - Administradores: acesso completo

### Bibliotecas Necessárias

#### Frontend

```json
{
  "react-markdown": "^9.0.0",           // Renderizar Markdown
  "remark-gfm": "^4.0.0",               // GitHub Flavored Markdown
  "react-dropzone": "^14.2.0",           // Upload drag & drop
  "react-syntax-highlighter": "^15.5.0" // Syntax highlighting
}
```

#### Backend (API Routes)

```json
{
  "pdf-parse": "^1.1.1",                 // PDF → Text
  "mammoth": "^1.6.0",                  // DOCX → HTML/Markdown
  "turndown": "^7.1.3",                 // HTML → Markdown
  "js-yaml": "^4.1.0",                  // YAML frontmatter
  "crypto": "^1.0.1"                    // SHA-256 hash (Node.js built-in)
}
```

**Nota**: Todas essas bibliotecas devem funcionar em ambiente serverless (Vercel Edge Functions).

## 🔐 Segurança

### Upload
- Validação de tipo MIME (não confiar apenas em extensão)
- Validação de tamanho máximo (10MB)
- Scan de malware (opcional, via Supabase)
- Rate limiting (máx 10 uploads/min por usuário)

### Armazenamento
- Row Level Security (RLS) no Supabase Storage
- Políticas: usuários só acessam seus próprios documentos
- Service role apenas para conversão server-side

### Conversão
- Processar conversão em server-side apenas
- Não expor bibliotecas de conversão no client
- Validar conteúdo convertido antes de armazenar

### Edição
- Validação de permissões antes de permitir edição
- Sanitização de Markdown antes de salvar (prevenir XSS)
- Versionamento para auditoria

## 📊 Fluxo Completo

### 1. Upload

```
Usuário → Página /dashboard/compliance/documents
       → Clica "Upload Documento"
       → Seleciona arquivo (ex: politica.pdf)
       → Confirma upload
       ↓
Frontend → POST /api/documents/upload
        → Arquivo enviado como FormData
        ↓
API Route → Validar arquivo
          → Upload para Supabase Storage (original)
          → Criar registro em compliance.documents
          → Iniciar conversão (assíncrono)
          → Retornar { document_id, status: 'uploaded' }
```

### 2. Conversão

```
API Route → /api/documents/[id]/convert
         → Baixar arquivo original do Storage
         → Detectar tipo (PDF, DOCX, etc)
         → Converter para Markdown (biblioteca específica)
         → Gerar frontmatter YAML
         → Upload do Markdown para Storage
         → Atualizar compliance.documents:
            - markdown_content
            - markdown_path
            - conversion_status: 'completed'
         → Retornar status
```

### 3. Visualização

```
Usuário → Página /dashboard/compliance/documents/[id]
       → Ver documento
       ↓
Frontend → GET /api/documents/[id]
        → Retornar dados:
           - original_path
           - markdown_content
           - conversion_status
        → Renderizar:
           - Se conversion_status === 'completed':
             → Mostrar preview do Markdown
           - Se conversion_status === 'pending':
             → Mostrar "Convertendo..."
           - Opção de ver original
```

### 4. Edição

```
Usuário → Clica "Editar" no documento
       → Abre /dashboard/compliance/documents/[id]/edit
       ↓
Frontend → GET /api/documents/[id]/markdown
        → Retornar markdown_content
        → Carregar no DocumentMarkdownEditor
        ↓
Usuário edita → Auto-save a cada 30s
             → Ou clica "Salvar"
             ↓
Frontend → PUT /api/documents/[id]/markdown
        → Enviar markdown_content editado
        ↓
API Route → Validar Markdown
          → Sanitizar conteúdo
          → Atualizar compliance.documents.markdown_content
          → Upload novo markdown para Storage (versionamento)
          → Criar entrada em document_versions
          → Retornar sucesso
```

## 🎨 Interface do Usuário

### Página de Upload

**Localização**: `/dashboard/compliance/documents/upload` ou modal na página principal

**Componentes**:
- Drag & drop zone
- Lista de arquivos selecionados
- Preview do arquivo
- Botão "Fazer Upload"
- Progress bar durante upload

**Estados**:
- `idle`: Pronto para upload
- `uploading`: Upload em progresso
- `converting`: Conversão em progresso
- `completed`: Upload e conversão completos
- `error`: Erro no upload/conversão

### Página de Edição

**Localização**: `/dashboard/compliance/documents/[id]/edit`

**Layout**:
- Split view:
  - Esquerda: Editor Markdown
  - Direita: Preview renderizado
- Toolbar acima do editor:
  - Bold, Italic, Heading, List, Link, etc
- Barra inferior:
  - Status de auto-save
  - Botão "Salvar"
  - Botão "Cancelar"
  - Botão "Visualizar Original"

## 📝 Exemplo de Conversão

### Documento Original (PDF/DOCX)

```
POLÍTICA DE SEGURANÇA CIBERNÉTICA

1. INTRODUÇÃO
Esta política estabelece diretrizes para segurança...

2. OBJETIVOS
- Proteger infraestrutura crítica
- Cumprir regulamentações
- Reduzir riscos cibernéticos
```

### Markdown Gerado

```markdown
---
id: "POL-001"
title: "Política de Segurança Cibernética"
category: "POL"
framework: "ANEEL RN 964/2021"
version: "1.0"
uploaded_at: "2025-01-03T10:30:00Z"
uploaded_by: "admin@example.com"
original_file: "politica_seguranca.pdf"
converted_at: "2025-01-03T10:30:15Z"
---

# Política de Segurança Cibernética

## 1. Introdução

Esta política estabelece diretrizes para segurança...

## 2. Objetivos

- Proteger infraestrutura crítica
- Cumprir regulamentações
- Reduzir riscos cibernéticos
```

## ✅ Checklist de Implementação

### Fase 1: Upload
- [ ] Criar componente `DocumentUploadDialog`
- [ ] Criar API route `/api/documents/upload`
- [ ] Configurar Supabase Storage bucket `documents`
- [ ] Implementar validação de arquivos
- [ ] Testar upload de diferentes formatos

### Fase 2: Conversão
- [ ] Instalar bibliotecas de conversão
- [ ] Criar API route `/api/documents/[id]/convert`
- [ ] Implementar conversão PDF → Markdown
- [ ] Implementar conversão DOCX → Markdown
- [ ] Implementar conversão DOC → Markdown
- [ ] Implementar conversão TXT → Markdown
- [ ] Gerar frontmatter YAML
- [ ] Testar conversão de diversos documentos

### Fase 3: Armazenamento
- [ ] Atualizar schema `compliance.documents`
- [ ] Implementar upload do Markdown para Storage
- [ ] Implementar atualização do banco de dados
- [ ] Implementar versionamento

### Fase 4: Edição
- [ ] Criar componente `DocumentMarkdownEditor`
- [ ] Criar API route `/api/documents/[id]/markdown`
- [ ] Implementar auto-save
- [ ] Implementar preview em tempo real
- [ ] Implementar toolbar de formatação

### Fase 5: Visualização
- [ ] Criar componente `DocumentViewer`
- [ ] Implementar visualização do Markdown
- [ ] Implementar visualização do original
- [ ] Implementar alternância entre versões

### Fase 6: Download
- [ ] Criar API route `/api/documents/[id]/download`
- [ ] Implementar download do original
- [ ] Implementar download do Markdown
- [ ] Testar downloads

## 🔄 Versionamento

### Tabela: `compliance.document_versions`

```sql
CREATE TABLE IF NOT EXISTS compliance.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES compliance.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'original' | 'markdown'
  storage_path TEXT NOT NULL,
  content_hash VARCHAR(64), -- SHA-256
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(document_id, version_number, content_type)
);
```

**Versionamento Automático**:
- Ao salvar edição do Markdown → criar nova versão
- Manter últimas 10 versões (configurável)
- Versionamento do original preservado sempre

## 📊 Métricas e Monitoramento

### Métricas a Rastrear

1. **Upload**:
   - Taxa de sucesso de uploads
   - Tempo médio de upload
   - Tamanho médio de arquivos

2. **Conversão**:
   - Taxa de sucesso de conversão
   - Tempo médio de conversão por tipo
   - Taxa de erro por tipo de arquivo

3. **Edição**:
   - Número de edições por documento
   - Tempo médio de edição
   - Taxa de uso de auto-save vs save manual

## 🚀 Próximos Passos

1. **Implementar Fase 1 (Upload)** primeiro
2. **Testar com documentos reais** diversos formatos
3. **Iterar na qualidade da conversão** baseado em feedback
4. **Adicionar suporte para mais formatos** conforme necessário
5. **Implementar melhorias** (OCR para PDFs escaneados, etc)

---

**Status**: 📝 Especificação Completa  
**Prioridade**: Alta  
**Esforço Estimado**: 3-4 semanas  
**Dependências**: Supabase Storage configurado, bibliotecas de conversão

