'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Upload, FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Lock, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EvidencePackageDialog } from '@/components/compliance/EvidencePackageDialog'
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
}

export default function EvidencePackagesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [selectedPackageStatus, setSelectedPackageStatus] = useState<'draft' | 'submitted' | 'reviewed' | 'approved' | 'locked'>('draft')
  const [workflowAction, setWorkflowAction] = useState<'submit' | 'review' | 'approve' | 'reject'>('submit')
  const [packages, setPackages] = useState<EvidencePackage[]>([])
  const [stats, setStats] = useState({ total: 0, draft: 0, submitted: 0, approved: 0 })
  const [loading, setLoading] = useState(true)

  // Carregar pacotes de evidência
  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compliance/evidence-packages')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setPackages(data.packages || [])
      setStats(data.statistics || { total: 0, draft: 0, submitted: 0, approved: 0 })
    } catch (error) {
      console.error('Error loading evidence packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadPackages()
  }

  const handleUploadClick = (packageId: string) => {
    setSelectedPackageId(packageId)
    setIsUploadOpen(true)
  }

  const handleUploadComplete = () => {
    setIsUploadOpen(false)
    setSelectedPackageId(null)
    loadPackages()
  }

  const handleWorkflowClick = (packageId: string, status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'locked', action: 'submit' | 'review' | 'approve' | 'reject') => {
    setSelectedPackageId(packageId)
    setSelectedPackageStatus(status)
    setWorkflowAction(action)
    setIsWorkflowDialogOpen(true)
  }

  const handleWorkflowAction = async (action: string, rejectionReason?: string) => {
    if (!selectedPackageId) return
    
    try {
      const response = await fetch(`/api/compliance/evidence-packages/${selectedPackageId}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejection_reason: rejectionReason }),
      })

      if (!response.ok) throw new Error('Failed to execute workflow action')
      
      await loadPackages()
      setIsWorkflowDialogOpen(false)
      setSelectedPackageId(null)
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

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Pacotes de Evidência</h1>
          <p className='text-muted-foreground'>
            Agrupe múltiplos artefatos (PDF, logs, prints, export SIEM) sob um pacote de evidência
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Novo Pacote
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                  <Package className='h-4 w-4 text-[#00ade8]' />
                </div>
                Total
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Pacotes de evidência</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                <Clock className='h-4 w-4 text-yellow-500' />
              </div>
              Rascunho
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.draft}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Aguardando submissão</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-blue-500/10 p-1.5'>
                <Upload className='h-4 w-4 text-blue-500' />
              </div>
              Submetido
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.submitted}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Aguardando revisão</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-green-500/10 p-1.5'>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </div>
              Aprovado
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.approved}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Pacotes aprovados</span>
          </CardFooter>
        </Card>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pacotes de Evidência</CardTitle>
          <CardDescription>
            Gerencie pacotes de evidência e seus artefatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : packages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Package className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhum pacote de evidência encontrado</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeiro Pacote
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Controle/Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => {
                  const statusInfo = statusConfig[pkg.status]
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className='font-medium'>{pkg.package_name}</div>
                        {pkg.description && (
                          <div className='text-sm text-muted-foreground mt-1'>
                            {pkg.description.substring(0, 60)}
                            {pkg.description.length > 60 && '...'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.control ? (
                          <div>
                            <div className='font-medium'>{pkg.control.control_code}</div>
                            <div className='text-sm text-muted-foreground'>{pkg.control.control_title}</div>
                          </div>
                        ) : pkg.assessment ? (
                          <div>
                            <div className='font-medium'>Avaliação</div>
                            <div className='text-sm text-muted-foreground'>
                              {new Date(pkg.assessment.assessment_date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className={`${statusInfo.bg} ${statusInfo.color} border-current`}>
                          <StatusIcon className='w-3 h-3 mr-1' />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(pkg.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          {pkg.status === 'draft' && (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleUploadClick(pkg.id)}
                              >
                                <Upload className='w-4 h-4 mr-1' />
                                Upload
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowClick(pkg.id, pkg.status, 'submit')}
                              >
                                Submeter
                              </Button>
                            </>
                          )}
                          {pkg.status === 'submitted' && (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowClick(pkg.id, pkg.status, 'review')}
                              >
                                Revisar
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowClick(pkg.id, pkg.status, 'reject')}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {pkg.status === 'reviewed' && (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowClick(pkg.id, pkg.status, 'approve')}
                              >
                                Aprovar
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowClick(pkg.id, pkg.status, 'reject')}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {pkg.status === 'approved' && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleWorkflowAction(pkg.id, 'lock')}
                            >
                              Bloquear
                            </Button>
                          )}
                          <Link href={`/dashboard/compliance/evidence/${pkg.id}`}>
                            <Button variant='ghost' size='sm'>
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EvidencePackageDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />

      {selectedPackageId && (
        <EvidenceArtifactUploadDialog
          isOpen={isUploadOpen}
          onClose={() => {
            setIsUploadOpen(false)
            setSelectedPackageId(null)
          }}
          onComplete={handleUploadComplete}
          packageId={selectedPackageId}
        />
      )}

      {/* Workflow Dialog */}
      {selectedPackageId && (
        <EvidenceWorkflowDialog
          isOpen={isWorkflowDialogOpen}
          onClose={() => {
            setIsWorkflowDialogOpen(false)
            setSelectedPackageId(null)
          }}
          onAction={handleWorkflowAction}
          currentStatus={selectedPackageStatus}
          action={workflowAction}
        />
      )}
    </div>
  )
}

