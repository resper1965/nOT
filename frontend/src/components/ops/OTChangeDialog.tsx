'use client'

import { useState, useEffect } from 'react'
import { Wrench, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface OTChangeDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function OTChangeDialog({
  isOpen,
  onClose,
  onComplete,
}: OTChangeDialogProps) {
  const [changeTitle, setChangeTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assetId, setAssetId] = useState<string>('')
  const [changeType, setChangeType] = useState<string>('')
  const [priority, setPriority] = useState<string>('medium')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadAssets()
    } else {
      // Reset quando fechar
      setChangeTitle('')
      setDescription('')
      setAssetId('')
      setChangeType('')
      setPriority('medium')
      setError(null)
    }
  }, [isOpen])

  const loadAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      if (!response.ok) return
      
      const data = await response.json()
      setAssets(data.assets || [])
    } catch (error) {
      console.error('Error loading assets:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!changeTitle.trim()) {
      setError('Título da mudança é obrigatório')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/ops/ot-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          change_title: changeTitle.trim(),
          description: description.trim() || null,
          asset_id: assetId || null,
          change_type: changeType || null,
          priority: priority,
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar mudança')
      }

      onComplete()
    } catch (error: any) {
      console.error('Error creating OT change:', error)
      setError(error.message || 'Erro ao criar mudança OT')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Wrench className='w-5 h-5 text-[#00ade8]' />
            Nova Mudança OT
          </DialogTitle>
          <DialogDescription>
            Crie uma nova solicitação de mudança em sistemas operacionais
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
              <Label htmlFor='change_title'>
                Título da Mudança <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='change_title'
                value={changeTitle}
                onChange={(e) => setChangeTitle(e.target.value)}
                placeholder='Ex: Atualização de firmware PLC-01'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Descrição</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Descreva detalhadamente a mudança a ser realizada...'
                rows={4}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='asset_id'>Ativo</Label>
                <Select value={assetId} onValueChange={setAssetId}>
                  <SelectTrigger id='asset_id'>
                    <SelectValue placeholder='Selecione o ativo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.asset_name} ({asset.asset_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='change_type'>Tipo de Mudança</Label>
                <Select value={changeType} onValueChange={setChangeType}>
                  <SelectTrigger id='change_type'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhum</SelectItem>
                    <SelectItem value='hardware'>Hardware</SelectItem>
                    <SelectItem value='software'>Software</SelectItem>
                    <SelectItem value='configuration'>Configuração</SelectItem>
                    <SelectItem value='network'>Rede</SelectItem>
                    <SelectItem value='other'>Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='priority'>Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id='priority'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Baixa</SelectItem>
                  <SelectItem value='medium'>Média</SelectItem>
                  <SelectItem value='high'>Alta</SelectItem>
                  <SelectItem value='critical'>Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type='submit' 
              disabled={loading || !changeTitle.trim()}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Mudança'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

