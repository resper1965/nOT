'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Send, Clock, Lock, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface EvidenceWorkflowDialogProps {
  isOpen: boolean
  onClose: () => void
  onAction: (action: string, rejectionReason?: string) => void
  currentStatus: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'locked'
  action: 'submit' | 'review' | 'approve' | 'reject'
}

export function EvidenceWorkflowDialog({
  isOpen,
  onClose,
  onAction,
  currentStatus,
  action,
}: EvidenceWorkflowDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)

  const actionConfig = {
    submit: {
      title: 'Submeter para Revisão',
      description: 'Ao submeter, o pacote será enviado para revisão e não poderá mais ser editado.',
      icon: Send,
      buttonLabel: 'Submeter',
      buttonColor: 'bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90',
      requiresReason: false,
    },
    review: {
      title: 'Marcar como Revisado',
      description: 'Marque o pacote como revisado após verificar os artefatos.',
      icon: CheckCircle2,
      buttonLabel: 'Marcar como Revisado',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      requiresReason: false,
    },
    approve: {
      title: 'Aprovar Pacote',
      description: 'Aprove o pacote de evidência. Após aprovação, ele poderá ser bloqueado para tornar imutável.',
      icon: CheckCircle2,
      buttonLabel: 'Aprovar',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      requiresReason: false,
    },
    reject: {
      title: 'Rejeitar Pacote',
      description: 'Rejeite o pacote e forneça um motivo. O pacote voltará ao status de rascunho.',
      icon: XCircle,
      buttonLabel: 'Rejeitar',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      requiresReason: true,
    },
  }

  const config = actionConfig[action]
  const ActionIcon = config.icon

  const handleSubmit = async () => {
    if (action === 'reject' && !rejectionReason.trim()) {
      return
    }

    setLoading(true)
    try {
      await onAction(action, rejectionReason.trim() || undefined)
      setRejectionReason('')
      onClose()
    } catch (error) {
      console.error('Error executing workflow action:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ActionIcon className={`w-5 h-5 ${action === 'reject' ? 'text-red-500' : action === 'approve' ? 'text-green-500' : 'text-[#00ade8]'}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Workflow Status Visual */}
        <div className='py-4'>
          <div className='flex items-center justify-between'>
            {['draft', 'submitted', 'reviewed', 'approved', 'locked'].map((status, index) => {
              const isActive = status === currentStatus
              const isCompleted = ['draft', 'submitted', 'reviewed', 'approved', 'locked'].indexOf(currentStatus) > ['draft', 'submitted', 'reviewed', 'approved', 'locked'].indexOf(status)
              const isNext = action === 'submit' && status === 'submitted' ||
                           action === 'review' && status === 'reviewed' ||
                           action === 'approve' && status === 'approved'

              const statusLabels: Record<string, string> = {
                draft: 'Rascunho',
                submitted: 'Submetido',
                reviewed: 'Revisado',
                approved: 'Aprovado',
                locked: 'Bloqueado',
              }

              const statusIcons: Record<string, any> = {
                draft: Clock,
                submitted: Send,
                reviewed: AlertCircle,
                approved: CheckCircle2,
                locked: Lock,
              }

              const StatusIcon = statusIcons[status]

              return (
                <div key={status} className='flex items-center flex-1'>
                  <div className='flex flex-col items-center flex-1'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive ? 'border-[#00ade8] bg-[#00ade8]/10 text-[#00ade8]' :
                      isCompleted ? 'border-green-500 bg-green-500/10 text-green-500' :
                      isNext ? 'border-blue-500 bg-blue-500/10 text-blue-500' :
                      'border-gray-300 bg-gray-100 text-gray-400'
                    }`}>
                      <StatusIcon className='w-5 h-5' />
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      isActive ? 'font-semibold text-[#00ade8]' :
                      isCompleted ? 'text-green-500' :
                      isNext ? 'text-blue-500' :
                      'text-gray-400'
                    }`}>
                      {statusLabels[status]}
                    </span>
                  </div>
                  {index < 4 && (
                    <div className={`h-0.5 flex-1 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rejection Reason Input */}
        {action === 'reject' && (
          <div className='space-y-2'>
            <Label htmlFor='rejection_reason'>
              Motivo da Rejeição <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='rejection_reason'
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder='Descreva o motivo da rejeição...'
              rows={4}
              className='resize-none'
            />
            <p className='text-xs text-muted-foreground'>
              O pacote retornará ao status de rascunho após a rejeição.
            </p>
          </div>
        )}

        {/* Warning for submit */}
        {action === 'submit' && (
          <div className='flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20'>
            <AlertCircle className='w-4 h-4 text-yellow-500 mt-0.5' />
            <div className='text-sm text-yellow-700 dark:text-yellow-400'>
              <strong>Atenção:</strong> Após submeter, o pacote não poderá mais ser editado até ser aprovado ou rejeitado.
            </div>
          </div>
        )}

        {/* Warning for lock */}
        {action === 'lock' && (
          <div className='flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20'>
            <Lock className='w-4 h-4 text-red-500 mt-0.5' />
            <div className='text-sm text-red-700 dark:text-red-400'>
              <strong>Atenção:</strong> Após bloquear, o pacote se tornará imutável e não poderá mais ser modificado.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type='button'
            onClick={handleSubmit}
            disabled={loading || (action === 'reject' && !rejectionReason.trim())}
            className={config.buttonColor}
          >
            {loading ? 'Processando...' : config.buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

