'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileSignature, CheckCircle2, Clock, AlertTriangle, Download, ArrowLeft, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
  owner?: {
    id: string
    email: string
    name: string
  } | null
}

export default function AttestationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const attestationId = params.id as string

  const [attestation, setAttestation] = useState<Attestation | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (attestationId) {
      loadAttestation()
    }
  }, [attestationId])

  const loadAttestation = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/compliance/attestations/${attestationId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setAttestation(data.attestation)
    } catch (error: any) {
      console.error('Error loading attestation:', error)
      setError(error.message || 'Erro ao carregar attestation')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async () => {
    if (!attestation) return

    if (!confirm('Tem certeza que deseja assinar esta attestation? Esta ação não pode ser desfeita.')) {
      return
    }

    setSigning(true)
    setError(null)

    try {
      const response = await fetch(`/api/compliance/attestations/${attestationId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao assinar')
      }

      await loadAttestation()
    } catch (error: any) {
      console.error('Error signing attestation:', error)
      setError(error.message || 'Erro ao assinar attestation')
    } finally {
      setSigning(false)
    }
  }

  const scopeLabels = {
    control: 'Controle',
    assessment: 'Avaliação',
    installation: 'Instalação',
    framework: 'Framework',
  }

  if (loading) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-6'>
        <div className='text-muted-foreground'>Carregando...</div>
      </div>
    )
  }

  if (error || !attestation) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-6'>
        <AlertTriangle className='w-12 h-12 text-red-500 mb-4' />
        <p className='text-lg font-medium mb-2'>Erro ao carregar attestation</p>
        <p className='text-muted-foreground mb-4'>{error || 'Attestation não encontrada'}</p>
        <Button onClick={() => router.push('/dashboard/compliance/attestations')}>
          Voltar para Attestations
        </Button>
      </div>
    )
  }

  const isSigned = !!attestation.signed_at

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/compliance/attestations')}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar
            </Button>
            <h1 className='text-3xl font-bold tracking-tight'>Attestation Digital</h1>
          </div>
          <p className='text-muted-foreground'>
            Termo de responsabilidade e conformidade
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {isSigned ? (
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
        </div>
      </div>

      {error && (
        <Card className='border-red-500/30 bg-red-500/5'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-red-500'>
              <AlertTriangle className='w-4 h-4' />
              <span className='text-sm'>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attestation Details */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Escopo</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant='outline' className='mb-2'>
              {scopeLabels[attestation.scope]}
            </Badge>
            {attestation.scope_info && (
              <div className='mt-2 space-y-1'>
                {attestation.scope_info.control_code && (
                  <div>
                    <span className='text-sm font-medium'>Código: </span>
                    <span className='text-sm'>{attestation.scope_info.control_code}</span>
                  </div>
                )}
                {attestation.scope_info.control_title && (
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      {attestation.scope_info.control_title}
                    </span>
                  </div>
                )}
                {attestation.scope_info.framework_name && (
                  <div>
                    <span className='text-sm font-medium'>Framework: </span>
                    <span className='text-sm'>{attestation.scope_info.framework_name}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            {attestation.owner ? (
              <div className='space-y-1'>
                <div className='font-medium'>{attestation.owner.name}</div>
                <div className='text-sm text-muted-foreground'>{attestation.owner.email}</div>
              </div>
            ) : (
              <span className='text-muted-foreground'>N/A</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statement */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='w-5 h-5 text-[#00ade8]' />
            Declaração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='prose prose-sm dark:prose-invert max-w-none'>
            <p className='whitespace-pre-wrap text-sm leading-relaxed'>
              {attestation.statement}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature Details */}
      {isSigned && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='w-5 h-5 text-green-500' />
              Detalhes da Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>Assinada em</div>
                <div className='text-sm'>
                  {new Date(attestation.signed_at!).toLocaleString('pt-BR')}
                </div>
              </div>
              <div>
                <div className='text-sm font-medium text-muted-foreground mb-1'>Hash SHA-256</div>
                <code className='text-xs text-muted-foreground break-all'>
                  {attestation.signature_hash}
                </code>
              </div>
              {attestation.ip_address && (
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-1'>IP de Origem</div>
                  <div className='text-sm'>{attestation.ip_address}</div>
                </div>
              )}
              {attestation.user_agent && (
                <div>
                  <div className='text-sm font-medium text-muted-foreground mb-1'>User Agent</div>
                  <div className='text-xs text-muted-foreground break-all'>
                    {attestation.user_agent}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!isSigned && (
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>
              Assine esta attestation para confirmar sua responsabilidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleSign}
                disabled={signing}
                className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
              >
                {signing ? 'Assinando...' : 'Assinar Attestation'}
              </Button>
              <Button variant='outline' onClick={() => router.push('/dashboard/compliance/attestations')}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created Date */}
      <Card>
        <CardContent className='pt-6'>
          <div className='text-xs text-muted-foreground'>
            Criada em: {new Date(attestation.created_at).toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

