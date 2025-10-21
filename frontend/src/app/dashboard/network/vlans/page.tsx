import { Wifi, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { getVLANs, getNetworkTopology } from '@/lib/api'

export default async function VLANsPage() {
  const vlansData = await getVLANs().catch(() => ({ vlans: [], total: 0 }));
  const topology = await getNetworkTopology().catch(() => ({ vlans: 0 }));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Análise de VLANs</h1>
          <p className='text-muted-foreground'>
            {topology.vlans || 0} VLANs identificadas - Segmentação Layer 2
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Total de VLANs</div>
            <Wifi className='h-5 w-5 text-brand-cyan' />
          </div>
          <div className='text-3xl font-bold'>{topology.vlans || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Identificadas na rede</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Classificadas</div>
            <CheckCircle2 className='h-5 w-5 text-orange-500' />
          </div>
          <div className='text-3xl font-bold text-orange-500'>0</div>
          <div className='text-xs text-orange-500 mt-1'>0% classificadas por zona</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Mapeadas Purdue</div>
          <div className='text-3xl font-bold text-red-500'>0</div>
          <div className='text-xs text-red-500 mt-1'>Nenhum nível atribuído</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Gap Analysis</div>
          <div className='text-3xl font-bold text-red-500'>100%</div>
          <div className='text-xs text-red-500 mt-1'>Todas precisam classificação</div>
        </div>
      </div>

      {/* Gap Alert */}
      <div className='rounded-lg border border-red-500/20 bg-red-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <AlertTriangle className='w-6 h-6 text-red-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-red-500'>GAP-SEG-003: 59 VLANs Não Classificadas (CVSS 7.8)</h3>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Requisito ONS</strong>: VLANs devem ser mapeadas para zonas de segurança (OT-Critical, OT-Operations, IT-Enterprise, etc.)
              conforme Modelo Purdue.
            </p>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Realidade TBE</strong>: {topology.vlans || 0} VLANs identificadas mas NENHUMA está classificada por zona ou nível Purdue.
            </p>
            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all text-sm font-medium'>
                Iniciar Classificação (40h de esforço)
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-red-500 transition-all text-sm'>
                Ver Gap Completo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VLANs Distribution */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Distribuição de VLANs por Faixa</h2>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            {[
              { range: '1-10', count: vlansData.vlans?.filter((v: any) => v.id >= 1 && v.id <= 10).length || 0, usage: 'Management/Native' },
              { range: '11-99', count: vlansData.vlans?.filter((v: any) => v.id >= 11 && v.id <= 99).length || 0, usage: 'Infrastructure' },
              { range: '100-999', count: vlansData.vlans?.filter((v: any) => v.id >= 100 && v.id <= 999).length || 0, usage: 'User/Data' },
              { range: '1000+', count: vlansData.vlans?.filter((v: any) => v.id >= 1000).length || 0, usage: 'Extended' },
            ].map((item) => (
              <div key={item.range} className='p-4 rounded-lg border'>
                <div className='text-sm text-muted-foreground mb-2'>{item.range}</div>
                <div className='text-3xl font-bold mb-1'>{item.count}</div>
                <div className='text-xs text-muted-foreground'>{item.usage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VLANs Table */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Lista de VLANs ({vlansData.total || 0} total)</h2>
        </div>
        <div className='p-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
            {vlansData.vlans?.map((vlan: any) => (
              <div 
                key={vlan.id} 
                className='p-3 rounded-lg border hover:border-brand-cyan/50 transition-all cursor-pointer'
              >
                <div className='font-bold text-brand-cyan'>{vlan.name}</div>
                <div className='text-xs text-muted-foreground mt-1'>
                  {vlan.criticality ? (
                    <span className='capitalize'>{vlan.criticality}</span>
                  ) : (
                    <span className='text-orange-500'>Não classificada</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <Wifi className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-orange-500'>Ação Necessária: Classificar VLANs</h3>
            <p className='text-sm text-muted-foreground mb-3'>
              Para atender o Controle 5 ONS (Segmentação OT/IT), as {topology.vlans || 0} VLANs precisam ser:
            </p>
            <ul className='text-sm text-muted-foreground space-y-1 mb-4 ml-4'>
              <li>• Classificadas por zona de segurança (OT-Critical, OT-Operations, IT-Enterprise, DMZ, etc)</li>
              <li>• Mapeadas para níveis do Modelo Purdue (0 a 5)</li>
              <li>• Atribuídas com criticidade (Critical, High, Medium, Low)</li>
              <li>• Documentadas com purpose e descrição</li>
            </ul>
            <p className='text-sm text-muted-foreground mb-4'>
              <strong>Esforço estimado</strong>: 40 horas (1 semana) | <strong>Prioridade</strong>: P1 (Alta)
            </p>
            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all text-sm font-medium'>
                Iniciar Wizard de Classificação
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-all text-sm'>
                Exportar para Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
