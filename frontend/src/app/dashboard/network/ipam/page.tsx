import { Globe, TrendingUp, AlertCircle, Activity } from 'lucide-react'
import { getIPSummary, getNetworkTopology } from '@/lib/api'

export const dynamic = 'force-dynamic';

async function getIPAMData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/network/ipam`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch IPAM data');
    return res.json();
  } catch (error) {
    console.error('Error fetching IPAM data:', error);
    return {
      statistics: {
        total_subnets: 0,
        total_ips: 0,
        total_usable_ips: 0,
        total_allocated_ips: 0,
        average_utilization_percent: 0,
        total_conflicts: 0,
        subnets_without_purdue: 0,
      },
      subnets: [],
      by_vlan: [],
      conflicts: [],
      subnets_without_purdue: [],
    };
  }
}

export default async function IPAMPage() {
  const ipSummary = await getIPSummary().catch(() => ({ total_ips: 0, by_vlan: [] }));
  const topology = await getNetworkTopology().catch(() => ({ subnets: 0, ips: 0 }));
  const ipamData = await getIPAMData();
  
  const stats = ipamData.statistics || {};

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div>
        <h1 className='text-3xl font-bold'>Análise IPAM - IP Address Management</h1>
        <p className='text-muted-foreground'>
          {stats.total_subnets || 0} subnets identificados | {stats.total_ips || 0} IPs ativos
        </p>
      </div>

      {/* Stats Principais */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Subnets</div>
            <Globe className='h-5 w-5 text-brand-cyan' />
          </div>
          <div className='text-3xl font-bold'>{stats.total_subnets || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Identificados no banco</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>IPs Ativos</div>
            <Activity className='h-5 w-5 text-green-500' />
          </div>
          <div className='text-3xl font-bold'>{stats.total_ips || 0}</div>
          <div className='text-xs text-muted-foreground mt-1'>Endereços IP únicos</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Utilização Média</div>
          <div className='text-3xl font-bold'>{stats.average_utilization_percent || 0}%</div>
          <div className='text-xs text-muted-foreground mt-1'>
            {stats.total_allocated_ips || 0} / {stats.total_usable_ips || 0} IPs utilizáveis
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='text-sm font-medium text-muted-foreground mb-2'>Conflitos</div>
          <div className={`text-3xl font-bold ${stats.total_conflicts > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {stats.total_conflicts || 0}
          </div>
          <div className={`text-xs mt-1 ${stats.total_conflicts > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {stats.total_conflicts > 0 ? 'Conflitos detectados' : 'Nenhum detectado'}
          </div>
        </div>
      </div>

      {/* Gap Analysis - Subnets */}
      <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <AlertCircle className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-orange-500'>
              GAP-SEG-002: {stats.subnets_without_purdue || 0} Subnets Não Mapeados para Níveis Purdue (CVSS 8.5)
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
              <strong>Esforço</strong>: 80 horas (2 semanas) | <strong>Deliverable</strong>: SUBNET-PURDUE-MAPPING.xlsx
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
          {ipamData.subnets && ipamData.subnets.length > 0 ? (
            <>
              <div className='space-y-2 text-sm'>
                {ipamData.subnets.map((subnet: any) => {
                  // Determine IP class from CIDR
                  const getIPClass = (cidr: string) => {
                    if (cidr.startsWith('10.') || cidr.startsWith('172.') || cidr.startsWith('192.168.')) {
                      if (cidr.includes('/30') || cidr.includes('/31')) return 'P2P';
                      if (cidr.startsWith('10.')) return 'A';
                      if (cidr.startsWith('172.')) return 'B';
                      if (cidr.startsWith('192.168.')) return 'C';
                    }
                    return 'Outros';
                  };

                  const ipClass = getIPClass(subnet.subnet_cidr);
                  const networkAddr = subnet.network_address || subnet.subnet_cidr.split('/')[0];
                  
                  return (
                    <div key={subnet.subnet_cidr} className='flex items-center justify-between p-3 rounded-lg border hover:border-brand-cyan/50 transition-all'>
                      <div className='flex items-center gap-4'>
                        <div className='font-mono font-bold text-brand-cyan'>{subnet.subnet_cidr}</div>
                        <div className='text-muted-foreground text-xs'>Network: {networkAddr}</div>
                      </div>
                      <div className='flex items-center gap-6'>
                        <div className='text-xs'>
                          <span className='text-muted-foreground'>IPs:</span>{' '}
                          <span className='font-medium'>{subnet.allocated_ips || 0}/{subnet.usable_ips || 0}</span>
                          {subnet.utilization_percent !== undefined && (
                            <span className='text-muted-foreground ml-1'>({subnet.utilization_percent}%)</span>
                          )}
                        </div>
                        <div className='text-xs'>
                          <span className='text-muted-foreground'>Classe:</span>{' '}
                          <span className='font-medium'>{ipClass}</span>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            subnet.purdue_level ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {subnet.purdue_level ? 'Mapeado' : 'Não mapeado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className='mt-4 text-center text-xs text-muted-foreground'>
                Mostrando {Math.min(ipamData.subnets.length, 10)} de {stats.total_subnets || 0} subnets • 
                <button className='ml-2 text-brand-cyan hover:underline'>Ver todos os {stats.total_subnets || 0} subnets</button>
              </div>
            </>
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              <p>Nenhum subnet encontrado no banco de dados.</p>
              <p className='text-xs mt-2'>Execute o script de importação de dados para popular a base.</p>
            </div>
          )}
        </div>
      </div>

      {/* IPs by VLAN */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>IPs por VLAN (Top 10)</h2>
        </div>
        <div className='p-4'>
          {ipamData.by_vlan && ipamData.by_vlan.length > 0 ? (
            <div className='space-y-2'>
              {ipamData.by_vlan.map((item: any, idx: number) => (
                <div key={idx} className='flex items-center justify-between p-3 rounded-lg border'>
                  <div className='font-medium'>{item.vlan_name || `VLAN ${item.vlan_id}`}</div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm text-muted-foreground'>{item.count} IPs</span>
                    <div className='w-32 bg-gray-800 rounded-full h-2'>
                      <div 
                        className='bg-brand-cyan h-2 rounded-full transition-all'
                        style={{ width: `${(item.count / (stats.total_ips || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              <p>Nenhum IP mapeado por VLAN encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
