'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle2, AlertCircle, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface EvidenceArtifactUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  packageId: string
}

export function EvidenceArtifactUploadDialog({
  isOpen,
  onClose,
  onComplete,
  packageId,
}: EvidenceArtifactUploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'text/csv': ['.csv'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError(null)
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('Arquivo muito grande. Tamanho máximo: 50MB')
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Tipo de arquivo não suportado')
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

      const response = await fetch(`/api/compliance/evidence-packages/${packageId}/artifacts`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload')
      }

      setProgress(100)
      setUploadStatus('completed')

      // Reset após 1 segundo
      setTimeout(() => {
        setSelectedFile(null)
        setProgress(0)
        setUploadStatus('idle')
        onComplete()
      }, 1000)
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Erro ao fazer upload do artefato')
      setUploadStatus('error')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null)
      setProgress(0)
      setUploadStatus('idle')
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='w-5 h-5 text-[#00ade8]' />
            Adicionar Artefato
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo para adicionar ao pacote de evidência
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {error && (
            <div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm'>
              <AlertCircle className='w-4 h-4' />
              {error}
            </div>
          )}

          {uploadStatus === 'completed' && (
            <div className='flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm'>
              <CheckCircle2 className='w-4 h-4' />
              Artefato adicionado com sucesso!
            </div>
          )}

          {!selectedFile && uploadStatus === 'idle' && (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragActive 
                  ? 'border-[#00ade8] bg-[#00ade8]/5' 
                  : 'border-border hover:border-[#00ade8]/50 hover:bg-[#00ade8]/5'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
              <p className='text-sm font-medium mb-1'>
                {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
              </p>
              <p className='text-xs text-muted-foreground'>
                PDF, DOC, DOCX, TXT, MD, imagens, JSON, XML, CSV (máx. 50MB)
              </p>
            </div>
          )}

          {selectedFile && uploadStatus === 'idle' && (
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-4 rounded-lg bg-muted'>
                <File className='w-8 h-8 text-[#00ade8]' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{selectedFile.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSelectedFile(null)}
                  disabled={uploading}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Uploading...</span>
                <span className='font-medium'>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose} disabled={uploading}>
            {uploadStatus === 'completed' ? 'Fechar' : 'Cancelar'}
          </Button>
          {selectedFile && uploadStatus === 'idle' && (
            <Button 
              onClick={handleUpload}
              disabled={uploading}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {uploading ? 'Enviando...' : 'Fazer Upload'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

