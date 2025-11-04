'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeftRight, Plus, Eye, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrosswalkDialog } from '@/components/compliance/CrosswalkDialog'

interface CrosswalkMapping {
  id: string
  source_framework_id: string
  source_control_id: string
  target_framework_id: string
  target_control_id: string
  mapping_type: 'exact' | 'partial' | 'related'
  confidence: number
  created_at: string
  source_framework?: {
    id: string
    framework_name: string
    framework_code: string
  } | null
  source_control?: {
    id: string
    control_code: string
    control_title: string
  } | null
  target_framework?: {
    id: string
    framework_name: string
    framework_code: string
  } | null
  target_control?: {
    id: string
    control_code: string
    control_title: string
  } | null
}

export default function CrosswalkPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [crosswalks, setCrosswalks] = useState<CrosswalkMapping[]>([])
  const [stats, setStats] = useState({ total: 0, exact: 0, partial: 0, related: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCrosswalks()
  }, [])

  const loadCrosswalks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compliance/crosswalk')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setCrosswalks(data.crosswalks || [])
      setStats(data.statistics || { total: 0, exact: 0, partial: 0, related: 0 })
    } catch (error) {
      console.error('Error loading crosswalks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplete = () => {
    setIsCreateOpen(false)
    loadCrosswalks()
  }

  const mappingTypeConfig = {
    exact: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Exato' },
    partial: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Parcial' },
    related: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Relacionado' },
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Mapa Cruzado (Crosswalk)</h1>
          <p className='text-muted-foreground'>
            Mapeamento de controles equivalentes entre frameworks para reaproveitamento de evidências
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Novo Mapeamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                <ArrowLeftRight className='h-4 w-4 text-[#00ade8]' />
              </div>
              Total
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mapeamentos</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-green-500/10 p-1.5'>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </div>
              Exato
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.exact}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mapeamentos exatos</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-orange-500/10 p-1.5'>
                <AlertTriangle className='h-4 w-4 text-orange-500' />
              </div>
              Parcial
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.partial}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mapeamentos parciais</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <CardHeader className='relative pb-3'>
            <CardDescription className='flex items-center gap-2 text-xs font-medium'>
              <div className='rounded-lg bg-blue-500/10 p-1.5'>
                <Info className='h-4 w-4 text-blue-500' />
              </div>
              Relacionado
            </CardDescription>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.related}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Mapeamentos relacionados</span>
          </CardFooter>
        </Card>
      </div>

      {/* Crosswalk Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mapeamentos de Crosswalk</CardTitle>
          <CardDescription>
            Gerencie mapeamentos entre controles de diferentes frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-muted-foreground'>Carregando...</div>
            </div>
          ) : crosswalks.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <ArrowLeftRight className='w-12 h-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground mb-4'>Nenhum mapeamento encontrado</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeiro Mapeamento
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Framework Origem</TableHead>
                  <TableHead>Controle Origem</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Framework Destino</TableHead>
                  <TableHead>Controle Destino</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Confiança</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crosswalks.map((mapping) => {
                  const typeInfo = mappingTypeConfig[mapping.mapping_type]
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {mapping.source_framework?.framework_code || 'N/A'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {mapping.source_framework?.framework_name || '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {mapping.source_control?.control_code || 'N/A'}
                          </div>
                          <div className='text-xs text-muted-foreground line-clamp-1'>
                            {mapping.source_control?.control_title || '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ArrowRight className='w-4 h-4 text-muted-foreground' />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {mapping.target_framework?.framework_code || 'N/A'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {mapping.target_framework?.framework_name || '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {mapping.target_control?.control_code || 'N/A'}
                          </div>
                          <div className='text-xs text-muted-foreground line-clamp-1'>
                            {mapping.target_control?.control_title || '-'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className={`${typeInfo.bg} ${typeInfo.color} border-current`}>
                          <TypeIcon className='w-3 h-3 mr-1' />
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          {(mapping.confidence * 100).toFixed(0)}%
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Link href={`/dashboard/compliance/crosswalk/${mapping.id}`}>
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
      <CrosswalkDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onComplete={handleCreateComplete}
      />
    </div>
  )
}

