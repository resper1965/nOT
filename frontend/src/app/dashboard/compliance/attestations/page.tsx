'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileSignature, CheckCircle2, Clock, AlertTriangle, Plus, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AttestationDialog } from '@/components/compliance/AttestationDialog'

interface Attestation {
  id: string
  owner_id: string
  scope: 'control' | 'assessment' | 'installation' | 'framework'
  scope_id: string
  statement: string
  signed_at: string | null
  signature_hash: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  scope_info?: {
    id: string
    control_code?: string
    control_title?: string
    assessment_date?: string
    framework_name?: string
  } | null
}

export default function AttestationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [attestations, setAttestations] = useState<Attestation[]>([])
  const [stats, setStats] = useState({ total: 0, signed: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttestations()
  }, [])

  const loadAttestations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compliance/attestations')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setAttestations(data.attestations || [])
      setStats(data.statistics || { total: 0, signed: 0, pending: 0 })
    } catch (error) {
      console.error('Error loading attestations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadAttestations()
  }

  const scopeLabels = {
    control: 'Controle',
    assessment: 'Avaliação',
    installation: 'Instalação',
    framework: 'Framework',
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Attestations Digitais</h1>
          <p className='text-muted-foreground'>
            Termos assinados por responsáveis por controles, avaliações e instalações
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Nova Attestation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <FileSignature className='h-4 w-4 text-[#00ade8]' />
              </div>
              Total
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Attestations criadas</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-green-500/10 p-1.5'>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </div>
              Assinadas
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.signed}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Attestations assinadas</span>
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
            <span className='text-xs text-muted-foreground'>Aguardando assinatura</span>
          </CardFooter>
        </Card>
      </div>

      {/* Attestations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attestations</CardTitle>
          <CardDescription>
            Gerencie attestations e suas assinaturas digitais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : attestations.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <FileSignature className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhuma attestation encontrada</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeira Attestation
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Declaração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinada em</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attestations.map((attestation) => (
                  <TableRow key={attestation.id}>
                    <TableCell>
                      <div>
                        <Badge variant='outline' className='mb-1'>
                          {scopeLabels[attestation.scope]}
                        </Badge>
                        {attestation.scope_info && (
                          <div className='text-sm text-muted-foreground mt-1'>
                            {attestation.scope_info.control_code || 
                             attestation.scope_info.framework_name || 
                             'N/A'}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='max-w-md'>
                        <p className='text-sm line-clamp-2'>
                          {attestation.statement}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {attestation.signed_at ? (
                        <Badge variant='outline' className='bg-green-500/10 text-green-500 border-green-500/30'>
                          <CheckCircle2 className='w-3 h-3 mr-1' />
                          Assinada
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='bg-yellow-500/10 text-yellow-500 border-yellow-500/30'>
                          <Clock className='w-3 h-3 mr-1' />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {attestation.signed_at ? (
                        <div className='text-sm'>
                          {new Date(attestation.signed_at).toLocaleDateString('pt-BR')}
                          <div className='text-xs text-muted-foreground'>
                            {new Date(attestation.signed_at).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Link href={`/dashboard/compliance/attestations/${attestation.id}`}>
                        <Button variant='ghost' size='sm'>
                          <Eye className='w-4 h-4 mr-1' />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <AttestationDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />
    </div>
  )
}

