'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wrench, Plus, Eye, Clock, CheckCircle2, XCircle, AlertTriangle, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OTChangeDialog } from '@/components/ops/OTChangeDialog'

interface OTChange {
  id: string
  change_number: string
  change_title: string
  description: string | null
  asset_id: string | null
  change_type: string | null
  priority: string
  status: string
  requested_by: string | null
  requested_at: string
  scheduled_window_start: string | null
  scheduled_window_end: string | null
  created_at: string
  asset?: {
    id: string
    asset_name: string
    asset_type: string
  } | null
}

export default function OTChangesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [changes, setChanges] = useState<OTChange[]>([])
  const [stats, setStats] = useState({ total: 0, requested: 0, approved: 0, in_progress: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChanges()
  }, [])

  const loadChanges = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ops/ot-changes')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setChanges(data.changes || [])
      setStats(data.statistics || { total: 0, requested: 0, approved: 0, in_progress: 0 })
    } catch (error) {
      console.error('Error loading OT changes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadChanges()
  }

  const statusConfig: Record<string, { icon: any, color: string, bg: string, label: string }> = {
    requested: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Solicitada' },
    risk_assessment: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Análise de Risco' },
    approved: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Aprovada' },
    scheduled: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Agendada' },
    in_progress: { icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Em Execução' },
    completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Concluída' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rejeitada' },
    cancelled: { icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Cancelada' },
  }

  const priorityConfig: Record<string, { color: string, bg: string, label: string }> = {
    low: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Baixa' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Média' },
    high: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Alta' },
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Crítica' },
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Gestão de Mudanças OT</h1>
          <p className='text-muted-foreground'>
            Fluxo completo: solicitação → análise risco cyber → janela → execução → verificação
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Nova Mudança
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <Wrench className='h-4 w-4 text-[#00ade8]' />
              </div>
              Total
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mudanças OT</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                <Clock className='h-4 w-4 text-yellow-500' />
              </div>
              Solicitadas
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.requested}
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
            <span className='text-xs text-muted-foreground'>Mudanças aprovadas</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-purple-500/10 p-1.5'>
                <Wrench className='h-4 w-4 text-purple-500' />
              </div>
              Em Execução
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.in_progress}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mudanças em execução</span>
          </CardFooter>
        </Card>
      </div>

      {/* Changes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mudanças OT</CardTitle>
          <CardDescription>
            Gerencie mudanças em sistemas operacionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : changes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Wrench className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhuma mudança encontrada</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeira Mudança
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Janela</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((change) => {
                  const statusInfo = statusConfig[change.status] || statusConfig.requested
                  const StatusIcon = statusInfo.icon
                  const priorityInfo = priorityConfig[change.priority] || priorityConfig.medium
                  
                  return (
                    <TableRow key={change.id}>
                      <TableCell className='font-medium'>{change.change_number}</TableCell>
                      <TableCell>
                        <div className='font-medium'>{change.change_title}</div>
                        {change.description && (
                          <div className='text-xs text-muted-foreground line-clamp-1 mt-1'>
                            {change.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {change.asset ? (
                          <div>
                            <div className='font-medium'>{change.asset.asset_name}</div>
                            <div className='text-xs text-muted-foreground'>{change.asset.asset_type}</div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {change.change_type ? (
                          <Badge variant='outline'>{change.change_type}</Badge>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className={`${priorityInfo.bg} ${priorityInfo.color} border-current`}>
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className={`${statusInfo.bg} ${statusInfo.color} border-current`}>
                          <StatusIcon className='w-3 h-3 mr-1' />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {change.scheduled_window_start && change.scheduled_window_end ? (
                          <div className='text-sm'>
                            <div>{new Date(change.scheduled_window_start).toLocaleDateString('pt-BR')}</div>
                            <div className='text-xs text-muted-foreground'>
                              {new Date(change.scheduled_window_start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(change.scheduled_window_end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Link href={`/dashboard/ops/changes/${change.id}`}>
                          <Button variant='ghost' size='sm'>
                            <Eye className='w-4 h-4 mr-1' />
                            Ver
                          </Button>
                        </Link>
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
      <OTChangeDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />
    </div>
  )
}

