'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from 'lucide-react'

interface ExceptionDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  defaultControlId?: string
  defaultFrameworkId?: string
}

export function ExceptionDialog({
  isOpen,
  onClose,
  onComplete,
  defaultControlId,
  defaultFrameworkId,
}: ExceptionDialogProps) {
  const [controlId, setControlId] = useState<string>(defaultControlId || '')
  const [frameworkId, setFrameworkId] = useState<string>(defaultFrameworkId || '')
  const [exceptionReason, setExceptionReason] = useState('')
  const [justification, setJustification] = useState('')
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined)
  const [riskResidual, setRiskResidual] = useState<'low' | 'medium' | 'high' | 'critical' | ''>('')
  const [frameworks, setFrameworks] = useState<any[]>([])
  const [controls, setControls] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar frameworks quando o diálogo abrir
  useEffect(() => {
    if (isOpen) {
      loadFrameworks()
      if (frameworkId) {
        loadControls(frameworkId)
      }
    }
  }, [isOpen, frameworkId])

  // Preencher campos padrão quando o diálogo abrir
  useEffect(() => {
    if (isOpen) {
      if (defaultFrameworkId) {
        setFrameworkId(defaultFrameworkId)
      }
      if (defaultControlId) {
        setControlId(defaultControlId)
      }
    } else {
      // Reset quando fechar
      setControlId('')
      setFrameworkId('')
      setExceptionReason('')
      setJustification('')
      setExpiresAt(undefined)
      setRiskResidual('')
      setError(null)
    }
  }, [isOpen, defaultFrameworkId, defaultControlId])

  const loadFrameworks = async () => {
    try {
      const response = await fetch('/api/compliance/frameworks')
      if (!response.ok) return
      
      const data = await response.json()
      setFrameworks(data.frameworks || [])
    } catch (error) {
      console.error('Error loading frameworks:', error)
    }
  }

  const loadControls = async (fwId: string) => {
    try {
      // TODO: Criar endpoint para listar controles por framework
      setControls([])
    } catch (error) {
      console.error('Error loading controls:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!controlId || !frameworkId) {
      setError('Controle e framework são obrigatórios')
      setLoading(false)
      return
    }

    if (!exceptionReason.trim()) {
      setError('Motivo da exceção é obrigatório')
      setLoading(false)
      return
    }

    if (!justification.trim()) {
      setError('Justificativa é obrigatória')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/compliance/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          control_id: controlId,
          framework_id: frameworkId,
          exception_reason: exceptionReason.trim(),
          justification: justification.trim(),
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          risk_residual: riskResidual || null,
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar exceção')
      }

      onComplete()
    } catch (error: any) {
      console.error('Error creating exception:', error)
      setError(error.message || 'Erro ao criar exceção')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertCircle className='w-5 h-5 text-[#00ade8]' />
            Nova Exceção de Controle
          </DialogTitle>
          <DialogDescription>
            Crie uma nova exceção para um controle que não pode ser atendido
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

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='framework_id'>
                  Framework <span className='text-red-500'>*</span>
                </Label>
                <Select value={frameworkId} onValueChange={setFrameworkId}>
                  <SelectTrigger id='framework_id'>
                    <SelectValue placeholder='Selecione o framework' />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw.id} value={fw.id}>
                        {fw.framework_code} - {fw.framework_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='control_id'>
                  Controle <span className='text-red-500'>*</span>
                </Label>
                <Select value={controlId} onValueChange={setControlId} disabled={!frameworkId}>
                  <SelectTrigger id='control_id'>
                    <SelectValue placeholder='Selecione o controle' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    {/* TODO: Carregar controles dinamicamente */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='exception_reason'>
                Motivo da Exceção <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='exception_reason'
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                placeholder='Descreva o motivo pelo qual o controle não pode ser atendido...'
                rows={3}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='justification'>
                Justificativa <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                id='justification'
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder='Justifique por que a exceção deve ser aprovada e quais são os controles compensatórios...'
                rows={4}
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='risk_residual'>Risco Residual</Label>
                <Select value={riskResidual} onValueChange={(v: any) => setRiskResidual(v)}>
                  <SelectTrigger id='risk_residual'>
                    <SelectValue placeholder='Selecione o risco' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    <SelectItem value='low'>Baixo</SelectItem>
                    <SelectItem value='medium'>Médio</SelectItem>
                    <SelectItem value='high'>Alto</SelectItem>
                    <SelectItem value='critical'>Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='expires_at'>Data de Vencimento</Label>
                <Input
                  id='expires_at'
                  type='date'
                  value={expiresAt ? expiresAt.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setExpiresAt(new Date(e.target.value))
                    } else {
                      setExpiresAt(undefined)
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type='submit' 
              disabled={loading || !controlId || !frameworkId || !exceptionReason.trim() || !justification.trim()}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Exceção'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

