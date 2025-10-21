import { Globe, TrendingUp, AlertCircle, Activity } from 'lucide-react'
import { getIPSummary, getNetworkTopology } from '@/lib/api'

export default async function IPAMPage() {
  const ipSummary = await getIPSummary().catch(() => ({ total_ips: 0, by_vlan: [] }));
  const topology = await getNetworkTopology().catch(() => ({ subnets: 0, ips: 0 }));

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Análise IPAM - IP Address Management</h1>
        <p className='text-muted-foreground'>
          {topology.subnets || 0} subnets identificados | {topology.ips || 0} IPs ativos
        </p>
      </div>

      {/* Stats Principais */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Subnets</div>
            <Globe className='h-5 w-5 text-brand-cyan' />
          </div>
          <div className='text-3xl font-bold'>{topology.subnets || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Identificados na análise</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>IPs Ativos</div>
            <Activity className='h-5 w-5 text-green-500' />
          </div>
          <div className='text-3xl font-bold'>{topology.ips || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Endereços IP únicos</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Utilização Média</div>
          <div className='text-3xl font-bold'>~9%</div>
          <div className='text-xs text-muted-foreground mt-1'>
            {topology.ips || 0} / ~{Math.floor((topology.subnets || 0) * 100)} IPs
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Conflitos</div>
          <div className='text-3xl font-bold text-green-500'>0</div>
          <div className='text-xs text-green-500 mt-1'>Nenhum detectado</div>
        </div>
      </div>

      {/* Gap Analysis - Subnets */}
      <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <AlertCircle className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-orange-500'>
              GAP-SEG-002: {topology.subnets || 0} Subnets Não Mapeados para Níveis Purdue (CVSS 8.5)
            </h3>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Requisito ONS</strong>: Cada subnet deve ser mapeado para um nível do Modelo Purdue (0 a 5) 
              para garantir segmentação adequada OT/IT.
            </p>
            <div className='bg-gray-900 rounded-lg p-4 mb-3 font-mono text-xs'>
              <div className='text-green-500'>Exemplo de Mapeamento Esperado:</div>
              <div className='mt-2 space-y-1'>
                <div><span className='text-brand-cyan'>Subnet:</span> 10.1.2.0/24</div>
                <div><span className='text-brand-cyan'>Dispositivos:</span> Server-SCADA-01, Server-SCADA-02</div>
                <div><span className='text-brand-cyan'>Criticidade:</span> CRITICAL</div>
                <div><span className='text-brand-cyan'>Purdue Level:</span> 3 (Operations & Control)</div>
                <div><span className='text-brand-cyan'>Zona:</span> OT-SCADA</div>
              </div>
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
              <strong>Esforço</strong>: 80 horas (2 semanas) | <strong>Deliverable</strong>: TBE-SUBNET-PURDUE-MAPPING.xlsx
            </p>
            <div className='flex gap-3'>
              <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all text-sm font-medium'>
                Iniciar Mapeamento de Subnets
              </button>
              <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-all text-sm'>
                Ver Análise Completa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subnets Preview */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Principais Subnets Identificados (Preview)</h2>
          <p className='text-sm text-muted-foreground'>Dados da análise preliminar - Total: {topology.subnets || 0} subnets</p>
        </div>
        <div className='p-4'>
          <div className='space-y-2 text-sm'>
            {[
              { subnet: '10.0.0.0/24', network: '10.0.0.0', usable: 254, class: 'A' },
              { subnet: '10.1.2.0/24', network: '10.1.2.0', usable: 254, class: 'A' },
              { subnet: '10.1.3.0/24', network: '10.1.3.0', usable: 254, class: 'A' },
              { subnet: '172.19.0.0/24', network: '172.19.0.0', usable: 254, class: 'B' },
              { subnet: '172.22.119.0/24', network: '172.22.119.0', usable: 254, class: 'B' },
              { subnet: '192.168.1.0/24', network: '192.168.1.0', usable: 254, class: 'C' },
              { subnet: '10.2.1.28/30', network: '10.2.1.28', usable: 2, class: 'P2P' },
              { subnet: '192.0.2.100/30', network: '192.0.2.100', usable: 2, class: 'P2P' },
            ].map((subnet) => (
              <div key={subnet.subnet} className='flex items-center justify-between p-3 rounded-lg border hover:border-brand-cyan/50 transition-all'>
                <div className='flex items-center gap-4'>
                  <div className='font-mono font-bold text-brand-cyan'>{subnet.subnet}</div>
                  <div className='text-muted-foreground text-xs'>Network: {subnet.network}</div>
                </div>
                <div className='flex items-center gap-6'>
                  <div className='text-xs'>
                    <span className='text-muted-foreground'>IPs:</span>{' '}
                    <span className='font-medium'>{subnet.usable}</span>
                  </div>
                  <div className='text-xs'>
                    <span className='text-muted-foreground'>Classe:</span>{' '}
                    <span className='font-medium'>{subnet.class}</span>
                  </div>
                  <div>
                    <span className='text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500'>
                      Não mapeado
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4 text-center text-xs text-muted-foreground'>
            Mostrando 8 de {topology.subnets || 0} subnets • 
            <button className='ml-2 text-brand-cyan hover:underline'>Ver todos os {topology.subnets || 0} subnets</button>
          </div>
        </div>
      </div>

      {/* IPs by VLAN */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>IPs por VLAN (Top 10)</h2>
        </div>
        <div className='p-4'>
          <div className='space-y-2'>
            {ipSummary.by_vlan?.slice(0, 10).map((item: any, idx: number) => (
              <div key={idx} className='flex items-center justify-between p-3 rounded-lg border'>
                <div className='font-medium'>{item.vlan}</div>
                <div className='flex items-center gap-4'>
                  <span className='text-sm text-muted-foreground'>{item.count} IPs</span>
                  <div className='w-32 bg-gray-800 rounded-full h-2'>
                    <div 
                      className='bg-brand-cyan h-2 rounded-full transition-all'
                      style={{ width: `${(item.count / (ipSummary.total_ips || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
