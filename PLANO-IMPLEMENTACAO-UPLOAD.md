# 📋 Plano de Implementação: Upload e Conversão de Documentos

## 🎯 Objetivo

Implementar sistema de upload de documentos na seção **Normativa / Documentos Obrigatórios** (`/dashboard/compliance/documents`) que:

1. Recebe documentos em vários formatos (PDF, DOC, DOCX, TXT, MD)
2. Preserva o documento original no Supabase Storage
3. Converte automaticamente para Markdown
4. Permite edição do Markdown na plataforma

## 📚 Especificação Completa

Consulte `.spec/document-upload-conversion.md` para especificação detalhada.

## 🚀 Fases de Implementação

### Fase 1: Preparação (1 dia)

#### 1.1 Configurar Supabase Storage

```bash
# Via Supabase Dashboard ou CLI
# Criar bucket 'documents'
# Configurar políticas RLS
```

**Políticas RLS**:
- Usuários autenticados podem fazer upload para `{user_id}/`
- Usuários podem baixar apenas seus próprios documentos
- Service role pode acessar tudo (para conversão)

#### 1.2 Atualizar Schema do Banco

```sql
-- Adicionar colunas necessárias
ALTER TABLE compliance.documents ADD COLUMN IF NOT EXISTS 
  original_filename VARCHAR(500),
  file_type VARCHAR(100),
  file_size BIGINT,
  file_hash VARCHAR(64),
  markdown_content TEXT,
  markdown_path TEXT,
  conversion_status VARCHAR(50) DEFAULT 'pending',
  conversion_error TEXT,
  converted_at TIMESTAMP;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_documents_conversion_status 
  ON compliance.documents(conversion_status);
CREATE INDEX IF NOT EXISTS idx_documents_file_hash 
  ON compliance.documents(file_hash);
```

#### 1.3 Instalar Dependências

```bash
cd frontend

# Dependências Frontend
pnpm add react-markdown remark-gfm react-dropzone
pnpm add -D @types/react-syntax-highlighter

# Dependências Backend (API Routes)
pnpm add pdf-parse mammoth turndown js-yaml
```

### Fase 2: Upload de Documentos (2-3 dias)

#### 2.1 Criar Componente de Upload

**Arquivo**: `frontend/src/components/compliance/DocumentUploadDialog.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'

interface DocumentUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (documentId: string) => void
}

export function DocumentUploadDialog({ isOpen, onClose, onUploadComplete }: DocumentUploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (files) => {
      if (files.length > 0) {
        setSelectedFile(files[0])
      }
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      onUploadComplete(data.document_id)
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload de Documento</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-brand-cyan bg-brand-cyan/10' : 'border-gray-700'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Solte o arquivo aqui'
              : 'Arraste um arquivo ou clique para selecionar'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Formatos: PDF, DOC, DOCX, TXT, MD (máx 10MB)
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-brand-cyan h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Enviando...</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Enviando...' : 'Fazer Upload'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-900"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### 2.2 Criar API Route de Upload

**Arquivo**: `frontend/src/app/api/documents/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obter arquivo do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Validar tipo MIME
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Ler arquivo e calcular hash
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')

    // Upload para Supabase Storage
    const storagePath = `${user.id}/${crypto.randomUUID()}/original/${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Criar registro no banco de dados
    const { data: document, error: dbError } = await supabase
      .from('compliance.documents')
      .insert({
        original_filename: file.name,
        file_type: file.type,
        file_size: file.size,
        file_hash: hash,
        storage_path: storagePath,
        conversion_status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Tentar remover arquivo do storage em caso de erro
      await supabase.storage.from('documents').remove([storagePath])
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Iniciar conversão (assíncrono)
    // Chamar API de conversão ou processar em background
    fetch(`${request.nextUrl.origin}/api/documents/${document.id}/convert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    }).catch(err => {
      console.error('Conversion trigger error:', err)
      // Não falhar o upload se a conversão falhar
    })

    return NextResponse.json({
      document_id: document.id,
      status: 'uploaded',
      message: 'Upload successful, conversion in progress',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Fase 3: Conversão para Markdown (3-4 dias)

#### 3.1 Criar API Route de Conversão

**Arquivo**: `frontend/src/app/api/documents/[id]/convert/route.ts`

Implementar conversores para cada tipo de arquivo (ver especificação completa).

### Fase 4: Editor Markdown (2-3 dias)

#### 4.1 Criar Componente Editor

**Arquivo**: `frontend/src/components/compliance/DocumentMarkdownEditor.tsx`

### Fase 5: Integração na Página de Documentos (1 dia)

#### 5.1 Adicionar Botão de Upload

Atualizar `frontend/src/app/dashboard/compliance/documents/page.tsx`

## ✅ Checklist

- [ ] Configurar Supabase Storage bucket `documents`
- [ ] Atualizar schema `compliance.documents`
- [ ] Instalar dependências
- [ ] Criar componente `DocumentUploadDialog`
- [ ] Criar API route `/api/documents/upload`
- [ ] Testar upload de diferentes formatos
- [ ] Implementar conversão PDF → Markdown
- [ ] Implementar conversão DOCX → Markdown
- [ ] Implementar conversão DOC → Markdown
- [ ] Implementar conversão TXT → Markdown
- [ ] Criar componente `DocumentMarkdownEditor`
- [ ] Criar API route `/api/documents/[id]/markdown`
- [ ] Integrar upload na página de documentos
- [ ] Testar fluxo completo
- [ ] Adicionar tratamento de erros
- [ ] Adicionar loading states
- [ ] Adicionar notificações

## 📝 Notas

- Conversão pode ser lenta para arquivos grandes → processar assincronamente
- Mostrar status de conversão ao usuário
- Permitir cancelamento de conversão (opcional)
- Implementar retry em caso de falha

---

**Consulte**: `.spec/document-upload-conversion.md` para especificação completa

