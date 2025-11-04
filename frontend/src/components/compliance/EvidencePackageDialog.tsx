'use client'

import { useState, useEffect } from 'react'
import { X, Package, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EvidencePackageDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function EvidencePackageDialog({
  isOpen,
  onClose,
  onComplete,
}: EvidencePackageDialogProps) {
  const [packageName, setPackageName] = useState('')
  const [description, setDescription] = useState('')
  const [controlId, setControlId] = useState<string>('')
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [controls, setControls] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar controles e avaliações
  useEffect(() => {
    if (isOpen) {
      loadControls()
      loadAssessments()
    }
  }, [isOpen])

  const loadControls = async () => {
    try {
      const response = await fetch('/api/compliance/frameworks')
      if (!response.ok) return
      
      const data = await response.json()
      // Simplificar: obter todos os controles
      // Em produção, fazer uma query específica para controles
      setControls([])
    } catch (error) {
      console.error('Error loading controls:', error)
    }
  }

  const loadAssessments = async () => {
    try {
      // TODO: Criar endpoint para assessments
      setAssessments([])
    } catch (error) {
      console.error('Error loading assessments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!packageName.trim()) {
      setError('Nome do pacote é obrigatório')
      setLoading(false)
      return
    }

    if (!controlId && !assessmentId) {
      setError('É necessário vincular a um controle ou avaliação')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/compliance/evidence-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_name: packageName.trim(),
          description: description.trim() || null,
          control_id: controlId || null,
          assessment_id: assessmentId || null,
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pacote')
      }

      // Reset form
      setPackageName('')
      setDescription('')
      setControlId('')
      setAssessmentId('')
      setError(null)

      onComplete()
    } catch (error: any) {
      console.error('Error creating evidence package:', error)
      setError(error.message || 'Erro ao criar pacote de evidência')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='w-5 h-5 text-[#00ade8]' />
            Novo Pacote de Evidência
          </DialogTitle>
          <DialogDescription>
            Crie um novo pacote para agrupar múltiplos artefatos de evidência
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
              <Label htmlFor='package_name'>
                Nome do Pacote <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='package_name'
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder='Ex: Evidências ONS-05 - Monitoramento de Disponibilidade'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Descrição</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Descrição opcional do pacote de evidência...'
                rows={3}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='control_id'>Vincular a Controle</Label>
                <Select value={controlId} onValueChange={setControlId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um controle' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    {/* TODO: Carregar controles dinamicamente */}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='assessment_id'>Vincular a Avaliação</Label>
                <Select value={assessmentId} onValueChange={setAssessmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione uma avaliação' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhuma</SelectItem>
                    {/* TODO: Carregar avaliações dinamicamente */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='text-xs text-muted-foreground'>
              <p>Nota: É necessário vincular o pacote a um controle ou avaliação.</p>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type='submit' 
              disabled={loading}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Pacote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

