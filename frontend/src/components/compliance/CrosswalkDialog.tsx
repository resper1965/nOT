'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, AlertCircle, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'

interface CrosswalkDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  defaultSourceControlId?: string
}

export function CrosswalkDialog({
  isOpen,
  onClose,
  onComplete,
  defaultSourceControlId,
}: CrosswalkDialogProps) {
  const [sourceFrameworkId, setSourceFrameworkId] = useState<string>('')
  const [sourceControlId, setSourceControlId] = useState<string>(defaultSourceControlId || '')
  const [targetFrameworkId, setTargetFrameworkId] = useState<string>('')
  const [targetControlId, setTargetControlId] = useState<string>('')
  const [mappingType, setMappingType] = useState<'exact' | 'partial' | 'related'>('related')
  const [confidence, setConfidence] = useState<number[]>([1.0])
  const [frameworks, setFrameworks] = useState<any[]>([])
  const [sourceControls, setSourceControls] = useState<any[]>([])
  const [targetControls, setTargetControls] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar frameworks quando o diálogo abrir
  useEffect(() => {
    if (isOpen) {
      loadFrameworks()
    }
  }, [isOpen])

  // Carregar controles quando o framework de origem mudar
  useEffect(() => {
    if (isOpen && sourceFrameworkId) {
      loadControls(sourceFrameworkId, 'source')
    }
  }, [isOpen, sourceFrameworkId])

  // Carregar controles quando o framework de destino mudar
  useEffect(() => {
    if (isOpen && targetFrameworkId) {
      loadControls(targetFrameworkId, 'target')
    }
  }, [isOpen, targetFrameworkId])

  // Buscar sugestões quando o controle de origem for selecionado
  useEffect(() => {
    if (isOpen && sourceControlId && targetFrameworkId) {
      loadSuggestions()
    }
  }, [isOpen, sourceControlId, targetFrameworkId])

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

  const loadControls = async (frameworkId: string, type: 'source' | 'target') => {
    try {
      // TODO: Criar endpoint para listar controles por framework
      // Por enquanto, usar endpoint de frameworks e filtrar
      if (type === 'source') {
        setSourceControls([])
      } else {
        setTargetControls([])
      }
    } catch (error) {
      console.error('Error loading controls:', error)
    }
  }

  const loadSuggestions = async () => {
    if (!sourceControlId || !targetFrameworkId) return

    try {
      const response = await fetch(
        `/api/compliance/crosswalk/suggest?source_control_id=${sourceControlId}&target_framework_id=${targetFrameworkId}`
      )
      if (!response.ok) return
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!sourceFrameworkId || !sourceControlId) {
      setError('Framework e controle de origem são obrigatórios')
      setLoading(false)
      return
    }

    if (!targetFrameworkId || !targetControlId) {
      setError('Framework e controle de destino são obrigatórios')
      setLoading(false)
      return
    }

    if (sourceFrameworkId === targetFrameworkId && sourceControlId === targetControlId) {
      setError('Origem e destino não podem ser iguais')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/compliance/crosswalk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_framework_id: sourceFrameworkId,
          source_control_id: sourceControlId,
          target_framework_id: targetFrameworkId,
          target_control_id: targetControlId,
          mapping_type: mappingType,
          confidence: confidence[0],
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar mapeamento')
      }

      // Reset form
      setSourceFrameworkId('')
      setSourceControlId('')
      setTargetFrameworkId('')
      setTargetControlId('')
      setMappingType('related')
      setConfidence([1.0])
      setError(null)
      setSuggestions([])

      onComplete()
    } catch (error: any) {
      console.error('Error creating crosswalk mapping:', error)
      setError(error.message || 'Erro ao criar mapeamento de crosswalk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ArrowLeftRight className='w-5 h-5 text-[#00ade8]' />
            Novo Mapeamento de Crosswalk
          </DialogTitle>
          <DialogDescription>
            Crie um mapeamento entre controles de diferentes frameworks para reaproveitar evidências
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

            {/* Source Framework and Control */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Framework de Origem <span className='text-red-500'>*</span></Label>
                <Select value={sourceFrameworkId} onValueChange={setSourceFrameworkId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o framework de origem' />
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
                <Label>Controle de Origem <span className='text-red-500'>*</span></Label>
                <Select value={sourceControlId} onValueChange={setSourceControlId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o controle de origem' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    {/* TODO: Carregar controles dinamicamente */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Arrow */}
            <div className='flex items-center justify-center py-2'>
              <ArrowLeftRight className='w-6 h-6 text-muted-foreground' />
            </div>

            {/* Target Framework and Control */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Framework de Destino <span className='text-red-500'>*</span></Label>
                <Select value={targetFrameworkId} onValueChange={setTargetFrameworkId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o framework de destino' />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks
                      .filter(fw => fw.id !== sourceFrameworkId)
                      .map((fw) => (
                        <SelectItem key={fw.id} value={fw.id}>
                          {fw.framework_code} - {fw.framework_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Controle de Destino <span className='text-red-500'>*</span></Label>
                <Select value={targetControlId} onValueChange={setTargetControlId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o controle de destino' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    {/* TODO: Carregar controles dinamicamente */}
                  </SelectContent>
                </Select>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2'>
                    <Sparkles className='w-4 h-4 text-[#00ade8]' />
                    Sugestões de IA
                  </Label>
                  <div className='space-y-2 p-3 rounded-lg bg-muted'>
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-accent'
                        onClick={() => setTargetControlId(suggestion.target_control.id)}
                      >
                        <div className='flex-1'>
                          <div className='font-medium text-sm'>
                            {suggestion.target_control.control_code}
                          </div>
                          <div className='text-xs text-muted-foreground line-clamp-1'>
                            {suggestion.target_control.control_title}
                          </div>
                        </div>
                        <Badge variant='outline' className='ml-2'>
                          {(suggestion.similarity_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mapping Type and Confidence */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Tipo de Mapeamento</Label>
                <Select value={mappingType} onValueChange={(v: any) => setMappingType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='exact'>Exato</SelectItem>
                    <SelectItem value='partial'>Parcial</SelectItem>
                    <SelectItem value='related'>Relacionado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Confiança: {(confidence[0] * 100).toFixed(0)}%</Label>
                <Slider
                  value={confidence}
                  onValueChange={setConfidence}
                  min={0}
                  max={1}
                  step={0.01}
                  className='w-full'
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
              disabled={loading || !sourceFrameworkId || !sourceControlId || !targetFrameworkId || !targetControlId}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Mapeamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

