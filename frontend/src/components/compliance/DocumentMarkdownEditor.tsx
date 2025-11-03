'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Eye, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DocumentMarkdownEditorProps {
  documentId: string
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  onCancel?: () => void
}

export function DocumentMarkdownEditor({
  documentId,
  initialContent = '',
  onSave,
  onCancel,
}: DocumentMarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  // Auto-save a cada 30 segundos quando o conteúdo mudar
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    if (content !== initialContent && content.trim().length > 0) {
      const timer = setTimeout(() => {
        handleAutoSave()
      }, 30000) // 30 segundos

      setAutoSaveTimer(timer)
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [content])

  const handleAutoSave = useCallback(async () => {
    if (isSaving || content === initialContent) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const response = await fetch(`/api/documents/${documentId}/markdown`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setSaveStatus('saved')
      setLastSaved(new Date())
      
      // Reset status após 3 segundos
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Auto-save error:', error)
      setSaveStatus('error')
      
      setTimeout(() => {
        setSaveStatus('idle')
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }, [content, documentId, initialContent, isSaving])

  const handleManualSave = async () => {
    if (isSaving || content === initialContent) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const response = await fetch(`/api/documents/${documentId}/markdown`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      if (onSave) {
        await onSave(content)
      }

      setSaveStatus('saved')
      setLastSaved(new Date())
      
      // Reset status após 3 segundos
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
      
      setTimeout(() => {
        setSaveStatus('idle')
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            {showPreview ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Editar' : 'Preview'}
          </button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Salvando...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>Salvo {lastSaved ? `às ${formatTime(lastSaved)}` : ''}</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>Erro ao salvar</span>
              </>
            )}
            {saveStatus === 'idle' && content !== initialContent && (
              <span className="text-orange-500">Alterações não salvas</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-900 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={isSaving || content === initialContent}
            className="px-4 py-1.5 text-sm bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex overflow-hidden">
        {showPreview ? (
          // Preview Mode
          <div className="flex-1 overflow-y-auto p-6 bg-card">
            <div className="prose prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-brand-cyan max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Nenhum conteúdo*'}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          // Editor Mode
          <div className="flex-1 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-6 bg-transparent border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Digite o conteúdo em Markdown aqui..."
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t bg-card text-xs text-muted-foreground flex items-center justify-between">
        <div>
          {content.length} caracteres • {content.split('\n').length} linhas
        </div>
        <div>
          Auto-save a cada 30s {content !== initialContent && '• Alterações pendentes'}
        </div>
      </div>
    </div>
  )
}

