'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Package, Upload, FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Lock, Download, Trash2, Send, CheckCircle, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EvidenceArtifactUploadDialog } from '@/components/compliance/EvidenceArtifactUploadDialog'
import { EvidenceWorkflowDialog } from '@/components/compliance/EvidenceWorkflowDialog'

interface EvidencePackage {
  id: string
  package_name: string
  description: string | null
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'locked'
  control_id: string | null
  assessment_id: string | null
  hash: string
  submitted_at: string | null
  reviewed_at: string | null
  approved_at: string | null
  locked_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  control?: {
    id: string
    control_code: string
    control_title: string
  } | null
  assessment?: {
    id: string
    assessment_date: string
    status: string
  } | null
  artifacts?: Array<{
    id: string
    artifact_name: string
    artifact_type: string
    file_size: number
    mime_type: string
    uploaded_at: string
  }>
}

export default function EvidencePackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const packageId = params.id as string

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [workflowAction, setWorkflowAction] = useState<'submit' | 'review' | 'approve' | 'reject'>('submit')
  const [evidencePackage, setEvidencePackage] = useState<EvidencePackage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (packageId) {
      loadPackage()
    }
  }, [packageId])

  const loadPackage = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/compliance/evidence-packages/${packageId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setEvidencePackage(data.package)
    } catch (error: any) {
      console.error('Error loading evidence package:', error)
      setError(error.message || 'Erro ao carregar pacote')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    setIsUploadOpen(false)
    loadPackage()
  }

  const handleWorkflowClick = (action: 'submit' | 'review' | 'approve' | 'reject') => {
    setWorkflowAction(action)
    setIsWorkflowDialogOpen(true)
  }

  const handleWorkflowAction = async (action: string, rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/compliance/evidence-packages/${packageId}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejection_reason: rejectionReason }),
      })

      if (!response.ok) throw new Error('Failed to execute workflow action')
      
      await loadPackage()
    } catch (error: any) {
      console.error('Error executing workflow action:', error)
      alert('Erro ao executar ação do workflow')
      throw error
    }
  }

  const statusConfig = {
    draft: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Rascunho' },
    submitted: { icon: Upload, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Submetido' },
    reviewed: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Revisado' },
    approved: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Aprovado' },
    locked: { icon: Lock, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Bloqueado' },
  }

  if (loading) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-6'>
        <div className='text-muted-foreground'>Carregando...</div>
      </div>
    )
  }

  if (error || !evidencePackage) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-6'>
        <AlertTriangle className='w-12 h-12 text-red-500 mb-4' />
        <p className='text-lg font-medium mb-2'>Erro ao carregar pacote</p>
        <p className='text-muted-foreground mb-4'>{error || 'Pacote não encontrado'}</p>
        <Button onClick={() => router.push('/dashboard/compliance/evidence')}>
          Voltar para Pacotes
        </Button>
      </div>
    )
  }

  const statusInfo = statusConfig[evidencePackage.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/compliance/evidence')}
            >
              ← Voltar
            </Button>
            <h1 className='text-3xl font-bold tracking-tight'>{evidencePackage.package_name}</h1>
          </div>
          <p className='text-muted-foreground'>
            {evidencePackage.description || 'Pacote de evidência'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className={`${statusInfo.bg} ${statusInfo.color} border-current`}>
            <StatusIcon className='w-3 h-3 mr-1' />
            {statusInfo.label}
          </Badge>
          {evidencePackage.status === 'draft' && (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              <Upload className='w-4 h-4 mr-2' />
              Adicionar Artefato
            </Button>
          )}
        </div>
      </div>

      {/* Package Info */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Controle/Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            {evidencePackage.control ? (
              <div>
                <div className='font-medium'>{evidencePackage.control.control_code}</div>
                <div className='text-sm text-muted-foreground'>{evidencePackage.control.control_title}</div>
              </div>
            ) : evidencePackage.assessment ? (
              <div>
                <div className='font-medium'>Avaliação</div>
                <div className='text-sm text-muted-foreground'>
                  {new Date(evidencePackage.assessment.assessment_date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ) : (
              <span className='text-muted-foreground'>Não vinculado</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Hash SHA-256</CardTitle>
          </CardHeader>
          <CardContent>
            <code className='text-xs text-muted-foreground break-all'>{evidencePackage.hash}</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Datas</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div>
              <span className='text-muted-foreground'>Criado: </span>
              <span>{new Date(evidencePackage.created_at).toLocaleString('pt-BR')}</span>
            </div>
            {evidencePackage.submitted_at && (
              <div>
                <span className='text-muted-foreground'>Submetido: </span>
                <span>{new Date(evidencePackage.submitted_at).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {evidencePackage.reviewed_at && (
              <div>
                <span className='text-muted-foreground'>Revisado: </span>
                <span>{new Date(evidencePackage.reviewed_at).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {evidencePackage.approved_at && (
              <div>
                <span className='text-muted-foreground'>Aprovado: </span>
                <span>{new Date(evidencePackage.approved_at).toLocaleString('pt-BR')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reason */}
      {evidencePackage.rejection_reason && (
        <Card className='border-red-500/30 bg-red-500/5'>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-red-500 flex items-center gap-2'>
              <X className='w-4 h-4' />
              Motivo de Rejeição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>{evidencePackage.rejection_reason}</p>
          </CardContent>
        </Card>
      )}

      {/* Artifacts */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Artefatos</CardTitle>
              <CardDescription>
                {evidencePackage.artifacts?.length || 0} artefato(s) no pacote
              </CardDescription>
            </div>
            {evidencePackage.status === 'draft' && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsUploadOpen(true)}
              >
                <Upload className='w-4 h-4 mr-2' />
                Adicionar Artefato
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!evidencePackage.artifacts || evidencePackage.artifacts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <FileText className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhum artefato adicionado ainda</p>
              {evidencePackage.status === 'draft' && (
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Upload className='w-4 h-4 mr-2' />
                  Adicionar Primeiro Artefato
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Upload</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidencePackage.artifacts.map((artifact) => (
                  <TableRow key={artifact.id}>
                    <TableCell className='font-medium'>{artifact.artifact_name}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>{artifact.artifact_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {(artifact.file_size / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell>
                      {new Date(artifact.uploaded_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm'>
                        <Download className='w-4 h-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Workflow Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações do Workflow</CardTitle>
          <CardDescription>
            Gerencie o ciclo de vida do pacote de evidência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {evidencePackage.status === 'draft' && (
              <Button
                onClick={() => handleWorkflowClick('submit')}
                className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
              >
                <Send className='w-4 h-4 mr-2' />
                Submeter para Revisão
              </Button>
            )}
            {evidencePackage.status === 'submitted' && (
              <>
                <Button
                  variant='outline'
                  onClick={() => handleWorkflowClick('review')}
                >
                  <CheckCircle className='w-4 h-4 mr-2' />
                  Marcar como Revisado
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => handleWorkflowClick('reject')}
                >
                  <X className='w-4 h-4 mr-2' />
                  Rejeitar
                </Button>
              </>
            )}
            {evidencePackage.status === 'reviewed' && (
              <>
                <Button
                  onClick={() => handleWorkflowClick('approve')}
                  className='bg-green-600 hover:bg-green-700'
                >
                  <CheckCircle className='w-4 h-4 mr-2' />
                  Aprovar
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => handleWorkflowClick('reject')}
                >
                  <X className='w-4 h-4 mr-2' />
                  Rejeitar
                </Button>
              </>
            )}
            {evidencePackage.status === 'approved' && (
              <Button
                variant='outline'
                onClick={() => handleWorkflowAction('lock')}
              >
                <Lock className='w-4 h-4 mr-2' />
                Bloquear (Imutável)
              </Button>
            )}
            {evidencePackage.status === 'locked' && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Lock className='w-4 h-4' />
                Pacote bloqueado - não pode ser modificado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <EvidenceArtifactUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onComplete={handleUploadComplete}
        packageId={packageId}
      />

      {/* Workflow Dialog */}
      {evidencePackage && (
        <EvidenceWorkflowDialog
          isOpen={isWorkflowDialogOpen}
          onClose={() => setIsWorkflowDialogOpen(false)}
          onAction={handleWorkflowAction}
          currentStatus={evidencePackage.status}
          action={workflowAction}
        />
      )}
    </div>
  )
}

