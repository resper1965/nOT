'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { DocumentMarkdownEditor } from '@/components/compliance/DocumentMarkdownEditor'

export default function DocumentEditPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [document, setDocument] = useState<any>(null)
  const [markdownContent, setMarkdownContent] = useState<string>('')

  useEffect(() => {
    if (!documentId) return

    // Buscar documento e markdown
    Promise.all([
      fetch(`/api/documents/${documentId}`).then((res) => res.json()),
      fetch(`/api/documents/${documentId}/markdown`).then((res) => res.json()),
    ])
      .then(([docData, markdownData]) => {
        if (docData.error) {
          setError(docData.error)
          return
        }

        setDocument(docData)
        setMarkdownContent(markdownData.content || '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading document:', err)
        setError('Erro ao carregar documento')
        setLoading(false)
      })
  }, [documentId])

  const handleSave = async (content: string) => {
    // Recarregar página após salvar (opcional)
    // window.location.reload()
  }

  const handleCancel = () => {
    router.push('/dashboard/compliance/documents')
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
        <p className="text-muted-foreground">Carregando documento...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-red-500">{error}</p>
        <Link
          href="/dashboard/compliance/documents"
          className="px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 transition-all font-medium"
        >
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/compliance/documents"
            className="p-2 rounded hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">
              {document?.original_filename || 'Editar Documento'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {document?.conversion_status === 'completed' ? 'Markdown editável' : 'Aguardando conversão...'}
            </p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {document?.conversion_status === 'completed' ? (
          <DocumentMarkdownEditor
            documentId={documentId}
            initialContent={markdownContent}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
            <div className="text-center">
              <p className="font-medium mb-2">Aguardando conversão</p>
              <p className="text-sm text-muted-foreground">
                O documento está sendo convertido para Markdown. Isso pode levar alguns segundos.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Status: {document?.conversion_status || 'pending'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border rounded-md hover:bg-gray-900 transition-colors text-sm"
            >
              Atualizar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

