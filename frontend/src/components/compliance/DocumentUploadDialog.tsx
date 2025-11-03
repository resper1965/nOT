'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react'

interface DocumentUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (documentId: string) => void
}

export function DocumentUploadDialog({
  isOpen,
  onClose,
  onUploadComplete,
}: DocumentUploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'converting' | 'completed' | 'error'>('idle')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError(null)
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('Arquivo muito grande. Tamanho máximo: 10MB')
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Tipo de arquivo não suportado. Use: PDF, DOC, DOCX, TXT ou MD')
        } else {
          setError('Erro ao selecionar arquivo')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
      }
    },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)
    setProgress(0)
    setUploadStatus('uploading')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Simular progresso (em produção, usar upload real com progress tracking)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || 'Erro ao fazer upload')
      }

      const data = await response.json()
      
      setProgress(100)
      setUploadStatus('converting')
      
      // Aguardar um pouco para mostrar status de conversão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUploadStatus('completed')
      
      // Aguardar mais um pouco antes de fechar
      setTimeout(() => {
        onUploadComplete(data.document_id)
        handleClose()
      }, 1500)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Erro ao fazer upload. Tente novamente.')
      setUploadStatus('error')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null)
      setError(null)
      setProgress(0)
      setUploadStatus('idle')
      onClose()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-card border rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload de Documento</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-1 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        {!selectedFile && uploadStatus === 'idle' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.02]'
                : 'border-gray-700 hover:border-brand-cyan/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos suportados: PDF, DOC, DOCX, TXT, MD
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tamanho máximo: 10MB
            </p>
          </div>
        )}

        {/* Selected File */}
        {selectedFile && uploadStatus === 'idle' && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-brand-cyan flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Tipo desconhecido'}
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadStatus === 'uploading' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Enviando arquivo...</span>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-brand-cyan h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Conversion Status */}
        {uploadStatus === 'converting' && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
              <div>
                <p className="text-sm font-medium text-blue-500">Convertendo para Markdown...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Isso pode levar alguns segundos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {uploadStatus === 'completed' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-500">Upload e conversão concluídos!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  O documento foi processado com sucesso
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-500">Erro no upload</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {uploading ? 'Enviando...' : 'Fazer Upload'}
          </button>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 border rounded-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

