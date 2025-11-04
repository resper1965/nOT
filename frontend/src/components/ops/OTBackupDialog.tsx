'use client'

import { useState, useEffect } from 'react'
import { HardDrive, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface OTBackupDialogProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  defaultAssetId?: string
}

export function OTBackupDialog({
  isOpen,
  onClose,
  onComplete,
  defaultAssetId,
}: OTBackupDialogProps) {
  const [assetId, setAssetId] = useState<string>(defaultAssetId || '')
  const [backupType, setBackupType] = useState<string>('')
  const [backupLocation, setBackupLocation] = useState('')
  const [backupMethod, setBackupMethod] = useState('')
  const [frequency, setFrequency] = useState<string>('')
  const [nextBackupDate, setNextBackupDate] = useState('')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadAssets()
      if (defaultAssetId) {
        setAssetId(defaultAssetId)
      }
    } else {
      // Reset quando fechar
      setAssetId('')
      setBackupType('')
      setBackupLocation('')
      setBackupMethod('')
      setFrequency('')
      setNextBackupDate('')
      setError(null)
    }
  }, [isOpen, defaultAssetId])

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

    if (!assetId) {
      setError('Ativo é obrigatório')
      setLoading(false)
      return
    }

    if (!backupType) {
      setError('Tipo de backup é obrigatório')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/ops/ot-backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_id: assetId,
          backup_type: backupType,
          backup_location: backupLocation.trim() || null,
          backup_method: backupMethod || null,
          frequency: frequency || null,
          next_backup_date: nextBackupDate || null,
          metadata: {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar backup')
      }

      onComplete()
    } catch (error: any) {
      console.error('Error creating OT backup:', error)
      setError(error.message || 'Erro ao criar backup OT')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <HardDrive className='w-5 h-5 text-[#00ade8]' />
            Novo Backup de Configuração OT
          </DialogTitle>
          <DialogDescription>
            Registre um backup de configuração para um ativo OT
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
                <Label htmlFor='asset_id'>
                  Ativo <span className='text-red-500'>*</span>
                </Label>
                <Select value={assetId} onValueChange={setAssetId}>
                  <SelectTrigger id='asset_id'>
                    <SelectValue placeholder='Selecione o ativo' />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.asset_name} ({asset.asset_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='backup_type'>
                  Tipo de Backup <span className='text-red-500'>*</span>
                </Label>
                <Select value={backupType} onValueChange={setBackupType}>
                  <SelectTrigger id='backup_type'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='plc'>PLC</SelectItem>
                    <SelectItem value='rtu'>RTU</SelectItem>
                    <SelectItem value='hmi'>HMI</SelectItem>
                    <SelectItem value='scada'>SCADA</SelectItem>
                    <SelectItem value='network_device'>Dispositivo de Rede</SelectItem>
                    <SelectItem value='other'>Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='backup_location'>Localização do Backup</Label>
              <Input
                id='backup_location'
                value={backupLocation}
                onChange={(e) => setBackupLocation(e.target.value)}
                placeholder='Ex: Servidor NAS /backups/plc-01/'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='backup_method'>Método de Backup</Label>
                <Input
                  id='backup_method'
                  value={backupMethod}
                  onChange={(e) => setBackupMethod(e.target.value)}
                  placeholder='Ex: USB, Network, Cloud'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='frequency'>Frequência</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id='frequency'>
                    <SelectValue placeholder='Selecione a frequência' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>Nenhuma</SelectItem>
                    <SelectItem value='daily'>Diário</SelectItem>
                    <SelectItem value='weekly'>Semanal</SelectItem>
                    <SelectItem value='monthly'>Mensal</SelectItem>
                    <SelectItem value='before_change'>Antes de Mudança</SelectItem>
                    <SelectItem value='after_change'>Após Mudança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='next_backup_date'>Próximo Backup</Label>
              <Input
                id='next_backup_date'
                type='date'
                value={nextBackupDate}
                onChange={(e) => setNextBackupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type='submit' 
              disabled={loading || !assetId || !backupType}
              className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90'
            >
              {loading ? 'Criando...' : 'Criar Backup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

