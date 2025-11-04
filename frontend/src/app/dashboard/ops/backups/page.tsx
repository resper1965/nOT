'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HardDrive, Plus, Eye, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OTBackupDialog } from '@/components/ops/OTBackupDialog'

interface OTBackup {
  id: string
  asset_id: string
  backup_type: string
  backup_location: string | null
  backup_method: string | null
  frequency: string | null
  last_backup_date: string | null
  next_backup_date: string | null
  last_restore_test_date: string | null
  restore_test_result: string | null
  created_at: string
  asset?: {
    id: string
    asset_name: string
    asset_type: string
  } | null
}

export default function OTBackupsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [backups, setBackups] = useState<OTBackup[]>([])
  const [stats, setStats] = useState({ total: 0, overdue: 0, due_soon: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ops/ot-backups')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setBackups(data.backups || [])
      setStats(data.statistics || { total: 0, overdue: 0, due_soon: 0 })
    } catch (error) {
      console.error('Error loading OT backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadBackups()
  }

  const isOverdue = (nextBackupDate: string | null) => {
    if (!nextBackupDate) return false
    return new Date(nextBackupDate) < new Date()
  }

  const isDueSoon = (nextBackupDate: string | null) => {
    if (!nextBackupDate) return false
    const daysUntilDue = Math.ceil((new Date(nextBackupDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 7 && daysUntilDue > 0
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Backups de Configuração OT</h1>
          <p className='text-muted-foreground'>
            Registro de backups de configuração (PLC/RTU/HMI) e testes de restauração
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Novo Backup
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <HardDrive className='h-4 w-4 text-[#00ade8]' />
              </div>
              Total
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Backups OT</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-red-500/10 p-1.5'>
                <AlertTriangle className='h-4 w-4 text-red-500' />
              </div>
              Vencidos
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.overdue}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Backups vencidos</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                <Clock className='h-4 w-4 text-yellow-500' />
              </div>
              Próximos
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.due_soon}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Próximos 7 dias</span>
          </CardFooter>
        </Card>
      </div>

      {/* Backups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Backups de Configuração</CardTitle>
          <CardDescription>
            Gerencie backups e testes de restauração
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : backups.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <HardDrive className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhum backup encontrado</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeiro Backup
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Último Backup</TableHead>
                  <TableHead>Próximo Backup</TableHead>
                  <TableHead>Teste de Restauração</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => {
                  const overdue = isOverdue(backup.next_backup_date)
                  const dueSoon = isDueSoon(backup.next_backup_date)
                  
                  return (
                    <TableRow key={backup.id}>
                      <TableCell>
                        {backup.asset ? (
                          <div>
                            <div className='font-medium'>{backup.asset.asset_name}</div>
                            <div className='text-xs text-muted-foreground'>{backup.asset.asset_type}</div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{backup.backup_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {backup.backup_location ? (
                          <div className='text-sm'>{backup.backup_location}</div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.frequency ? (
                          <Badge variant='outline'>{backup.frequency}</Badge>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.last_backup_date ? (
                          <div className='text-sm'>
                            {new Date(backup.last_backup_date).toLocaleDateString('pt-BR')}
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.next_backup_date ? (
                          <div className='text-sm'>
                            {new Date(backup.next_backup_date).toLocaleDateString('pt-BR')}
                            {overdue && (
                              <Badge variant='destructive' className='ml-2'>Vencido</Badge>
                            )}
                            {dueSoon && !overdue && (
                              <Badge variant='outline' className='ml-2 bg-yellow-500/10 text-yellow-500'>Próximo</Badge>
                            )}
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.restore_test_result ? (
                          <Badge 
                            variant='outline' 
                            className={backup.restore_test_result === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                          >
                            {backup.restore_test_result === 'success' ? 'Sucesso' : backup.restore_test_result}
                          </Badge>
                        ) : (
                          <span className='text-muted-foreground'>Não testado</span>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Link href={`/dashboard/ops/backups/${backup.id}`}>
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
      <OTBackupDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />
    </div>
  )
}

