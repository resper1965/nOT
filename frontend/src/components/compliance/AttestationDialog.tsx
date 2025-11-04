'use client'

import { useState, useEffect } from 'react'
import { FileSignature, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface AttestationDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  defaultScope?: 'control' | 'assessment' | 'installation' | 'framework'
  defaultScopeId?: string
}

export function AttestationDialog({
  isOpen,
  onClose,
  onComplete,
  defaultScope,
  defaultScopeId,
}: AttestationDialogProps) {
  const [scope, setScope] = useState<string>(defaultScope || '')
  const [scopeId, setScopeId] = useState<string>(defaultScopeId || '')
  const [statement, setStatement] = useState('')
  const [controls, setControls] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar controles e avaliações quando o escopo mudar
  useEffect(() => {
    if (isOpen && scope === 'control') {
      loadControls()
    } else if (isOpen && scope === 'assessment') {
      loadAssessments()
    }
  }, [isOpen, scope])

  // Preencher campos padrão quando o diálogo abrir
  useEffect(() => {
    if (isOpen) {
      if (defaultScope) {
        setScope(defaultScope)
      }
      if (defaultScopeId) {
        setScopeId(defaultScopeId)
      }
    } else {
      // Reset quando fechar
      setScope('')
      setScopeId('')
      setStatement('')
      setError(null)
    }
  }, [isOpen, defaultScope, defaultScopeId])

  const loadControls = async () => {
    try {
      // TODO: Criar endpoint para listar controles
      setControls([])
    } catch (error) {
      console.error('Error loading controls:', error)
    }
  }

  const loadAssessments = async () => {
    try {
      // TODO: Criar endpoint para listar avaliações
      setAssessments([])
    } catch (error) {
      console.error('Error loading assessments:', error)
    }
  }

  const getDefaultStatement = (scope: string): string => {
    const statements = {
      control: 'Eu, abaixo assinado, declaro que sou responsável pelo controle especificado e confirmo que todos os requisitos foram atendidos conforme os padrões regulatórios aplicáveis.',
      assessment: 'Eu, abaixo assinado, declaro que sou responsável pela avaliação especificada e confirmo que a avaliação foi conduzida de acordo com os procedimentos estabelecidos.',
      installation: 'Eu, abaixo assinado, declaro que sou responsável pela instalação especificada e confirmo que todos os requisitos de segurança e conformidade foram atendidos.',
      framework: 'Eu, abaixo assinado, declaro que sou responsável pelo framework especificado e confirmo que todos os requisitos foram implementados e estão em conformidade.',
    }
    return statements[scope as keyof typeof statements] || ''
  }

  const handleScopeChange = (newScope: string) => {
    setScope(newScope)
    setScopeId('')
    if (newScope) {
      setStatement(getDefaultStatement(newScope))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!scope) {
      setError('Escopo é obrigatório')
      setLoading(false)
      return
    }

    if (!scopeId) {
      setError('ID do escopo é obrigatório')
      setLoading(false)
      return
    }

    if (!statement.trim()) {
      setError('Declaração é obrigatória')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/compliance/attestations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: scope,
          scope_id: scopeId,
          statement: statement.trim(),
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar attestation')
      }

      // Reset form
      setScope('')
      setScopeId('')
      setStatement('')
      setError(null)

      onComplete()
    } catch (error: any) {
      console.error('Error creating attestation:', error)
      setError(error.message || 'Erro ao criar attestation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileSignature className='w-5 h-5 text-[#00ade8]' />
            Nova Attestation Digital
          </DialogTitle>
          <DialogDescription>
            Crie uma nova attestation para confirmar responsabilidade sobre um controle, avaliação ou instalação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            {error && (
              <div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm'>
                <AlertCircle className='w-4 h-4' />
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='scope'>
                Escopo <span className='text-red-500'>*</span>
              </Label>
              <Select value={scope} onValueChange={handleScopeChange}>
                <SelectTrigger id='scope'>
                  <SelectValue placeholder='Selecione o escopo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='control'>Controle</SelectItem>
                  <SelectItem value='assessment'>Avaliação</SelectItem>
                  <SelectItem value='installation'>Instalação</SelectItem>
                  <SelectItem value='framework'>Framework</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scope && (
              <div className='space-y-2'>
                <Label htmlFor='scope_id'>
                  {scope === 'control' && 'ID do Controle'}
                  {scope === 'assessment' && 'ID da Avaliação'}
                  {scope === 'installation' && 'ID da Instalação'}
                  {scope === 'framework' && 'ID do Framework'}
                  <span className='text-red-500'>*</span>
                </Label>
                {scope === 'control' && (
                  <Select value={scopeId} onValueChange={setScopeId}>
                    <SelectTrigger id='scope_id'>
                      <SelectValue placeholder='Selecione o controle' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Nenhum</SelectItem>
                      {/* TODO: Carregar controles dinamicamente */}
                    </SelectContent>
                  </Select>
                )}
                {scope === 'assessment' && (
                  <Select value={scopeId} onValueChange={setScopeId}>
                    <SelectTrigger id='scope_id'>
                      <SelectValue placeholder='Selecione a avaliação' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Nenhuma</SelectItem>
                      {/* TODO: Carregar avaliações dinamicamente */}
                    </SelectContent>
                  </Select>
                )}
                {(scope === 'installation' || scope === 'framework') && (
                  <Input
                    id='scope_id'
                    value={scopeId}
                    onChange={(e) => setScopeId(e.target.value)}
                    placeholder='Digite o UUID do escopo'
                    required
                  />
                )}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='statement'>
                Declaração <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='statement'
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder='Digite a declaração de responsabilidade...'
                rows={6}
                required
              />
              <p className='text-xs text-muted-foreground'>
                Esta declaração será assinada digitalmente e não poderá ser alterada após a assinatura.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type='submit' 
              disabled={loading || !scope || !scopeId || !statement.trim()}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Attestation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

