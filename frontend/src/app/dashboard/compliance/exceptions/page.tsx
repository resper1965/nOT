'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Clock, XCircle, Plus, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExceptionDialog } from '@/components/compliance/ExceptionDialog'

interface ControlException {
  id: string
  control_id: string
  framework_id: string
  exception_reason: string
  justification: string
  approved_by: string | null
  approved_at: string | null
  expires_at: string | null
  risk_residual: 'low' | 'medium' | 'high' | 'critical' | null
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  rejection_reason: string | null
  created_at: string
  control?: {
    id: string
    control_code: string
    control_title: string
  } | null
  framework?: {
    id: string
    framework_name: string
    framework_code: string
  } | null
}

export default function ExceptionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [exceptions, setExceptions] = useState<ControlException[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, expired: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExceptions()
  }, [])

  const loadExceptions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compliance/exceptions')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setExceptions(data.exceptions || [])
      setStats(data.statistics || { total: 0, pending: 0, approved: 0, expired: 0 })
    } catch (error) {
      console.error('Error loading exceptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadExceptions()
  }

  const handleWorkflowAction = async (exceptionId: string, action: string, rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/compliance/exceptions/${exceptionId}/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejection_reason: rejectionReason }),
      })

      if (!response.ok) throw new Error('Failed to execute workflow action')
      
      await loadExceptions()
    } catch (error) {
      console.error('Error executing workflow action:', error)
      alert('Erro ao executar ação do workflow')
    }
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Pendente' },
    approved: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Aprovada' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rejeitada' },
    expired: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Expirada' },
  }

  const riskConfig = {
    low: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Baixo' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Médio' },
    high: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Alto' },
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Crítico' },
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Exceções de Controles</h1>
          <p className='text-muted-foreground'>
            Gerencie exceções aprovadas pelo Gestor do ARCiber
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Nova Exceção
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <AlertCircle className='h-4 w-4 text-[#00ade8]' />
              </div>
              Total
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Exceções</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                <Clock className='h-4 w-4 text-yellow-500' />
              </div>
              Pendentes
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.pending}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Aguardando aprovação</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-green-500/10 p-1.5'>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </div>
              Aprovadas
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.approved}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Exceções aprovadas</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-gray-500/30 bg-gradient-to-br from-gray-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-gray-500/10 p-1.5'>
                <AlertCircle className='h-4 w-4 text-gray-500' />
              </div>
              Expiradas
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.expired}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Exceções expiradas</span>
          </CardFooter>
        </Card>
      </div>

      {/* Exceptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exceções de Controles</CardTitle>
          <CardDescription>
            Gerencie exceções aprovadas e suas justificativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : exceptions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <AlertCircle className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhuma exceção encontrada</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeira Exceção
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Controle</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Risco Residual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exceptions.map((exception) => {
                  const statusInfo = statusConfig[exception.status]
                  const StatusIcon = statusInfo.icon
                  const riskInfo = exception.risk_residual ? riskConfig[exception.risk_residual] : null
                  
                  return (
                    <TableRow key={exception.id}>
                      <TableCell>
                        {exception.control ? (
                          <div>
                            <div className='font-medium'>{exception.control.control_code}</div>
                            <div className='text-xs text-muted-foreground line-clamp-1'>
                              {exception.control.control_title}
                            </div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {exception.framework ? (
                          <div>
                            <div className='font-medium'>{exception.framework.framework_code}</div>
                            <div className='text-xs text-muted-foreground'>
                              {exception.framework.framework_name}
                            </div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='max-w-md'>
                          <p className='text-sm line-clamp-2'>
                            {exception.exception_reason}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {riskInfo ? (
                          <Badge variant='outline' className={`${riskInfo.bg} ${riskInfo.color} border-current`}>
                            {riskInfo.label}
                          </Badge>
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
                        {exception.expires_at ? (
                          <div className='text-sm'>
                            {new Date(exception.expires_at).toLocaleDateString('pt-BR')}
                            {new Date(exception.expires_at) < new Date() && (
                              <Badge variant='destructive' className='ml-2'>Expirada</Badge>
                            )}
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          {exception.status === 'pending' && (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleWorkflowAction(exception.id, 'approve')}
                              >
                                Aprovar
                              </Button>
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => {
                                  const reason = prompt('Motivo da rejeição:')
                                  if (reason) {
                                    handleWorkflowAction(exception.id, 'reject', reason)
                                  }
                                }}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          <Link href={`/dashboard/compliance/exceptions/${exception.id}`}>
                            <Button variant='ghost' size='sm'>
                              <Eye className='w-4 h-4 mr-1' />
                              Ver
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

      {/* Create Dialog */}
      <ExceptionDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />
    </div>
  )
}

