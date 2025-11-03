import { AlertTriangle, CheckCircle2, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

async function getGapsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/remediation/gaps`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch gaps');
    return res.json();
  } catch (error) {
    console.error('Error fetching gaps:', error);
    return {
      gaps: [],
      stats: {
        total_gaps: 0,
        critical_gaps: 0,
        high_gaps: 0,
        avg_cvss: 0,
        total_effort_hours: 0,
        total_effort_weeks: 0,
        risk_level: 'low',
      },
      network_data: {
        total_assets: 0,
        total_subnets: 0,
        mapped_subnets: 0,
        total_vlans: 0,
        classified_vlans: 0,
        total_connections: 0,
        total_firewalls: 0,
      },
    };
  }
}

export default async function GapAnalysisPage() {
  const data = await getGapsData();
  const { gaps, stats, network_data } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getCvssColor = (cvss: number) => {
    if (cvss >= 9.0) return 'text-red-500';
    if (cvss >= 7.0) return 'text-orange-500';
    if (cvss >= 4.0) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Gap Analysis ONS</h1>
          <p className='text-muted-foreground'>
            Análise de gaps entre requisitos ONS e realidade da rede
          </p>
        </div>
        <Link
          href='/dashboard/remediation'
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          Voltar
        </Link>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Total de Gaps</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className='text-2xl font-bold text-red-500'>{stats.total_gaps}</div>
          <div className='text-xs text-muted-foreground'>
            {stats.critical_gaps} críticos, {stats.high_gaps} altos
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>CVSS Médio</div>
            <AlertTriangle className='h-4 w-4 text-orange-500' />
          </div>
          <div className={`text-2xl font-bold ${getCvssColor(stats.avg_cvss)}`}>
            {stats.avg_cvss.toFixed(1)}
          </div>
          <div className='text-xs text-muted-foreground'>{stats.risk_level}</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Esforço Total</div>
            <Clock className='h-4 w-4 text-blue-500' />
          </div>
          <div className='text-2xl font-bold'>{stats.total_effort_hours}h</div>
          <div className='text-xs text-muted-foreground'>{stats.total_effort_weeks} semanas-pessoa</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Risco Agregado</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className={`text-2xl font-bold ${getCvssColor(stats.avg_cvss)}`}>
            {stats.risk_level === 'critical' ? 'Crítico' :
             stats.risk_level === 'high' ? 'Alto' :
             stats.risk_level === 'medium' ? 'Médio' : 'Baixo'}
          </div>
          <div className='text-xs text-muted-foreground'>Controle 5 ONS</div>
        </div>
      </div>

      {/* Network Data Context */}
      <div className='rounded-lg border bg-card p-4'>
        <h2 className='text-lg font-semibold mb-3'>Contexto da Rede</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div>
            <div className='text-muted-foreground'>Total de Assets</div>
            <div className='text-xl font-bold'>{network_data.total_assets.toLocaleString('pt-BR')}</div>
          </div>
          <div>
            <div className='text-muted-foreground'>Subnets</div>
            <div className='text-xl font-bold'>{network_data.total_subnets}</div>
            <div className='text-xs text-muted-foreground'>
              {network_data.mapped_subnets} mapeados Purdue
            </div>
          </div>
          <div>
            <div className='text-muted-foreground'>VLANs</div>
            <div className='text-xl font-bold'>{network_data.total_vlans}</div>
            <div className='text-xs text-muted-foreground'>
              {network_data.classified_vlans} classificadas
            </div>
          </div>
          <div>
            <div className='text-muted-foreground'>Firewalls</div>
            <div className='text-xl font-bold'>{network_data.total_firewalls}</div>
            <div className='text-xs text-muted-foreground'>
              {network_data.total_connections} conexões
            </div>
          </div>
        </div>
      </div>

      {/* Gaps List */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4'>Gaps Identificados</h2>
        {gaps.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            <CheckCircle2 className='w-12 h-12 mx-auto mb-4 text-green-500' />
            <p className='text-lg font-medium'>Nenhum gap identificado</p>
            <p className='text-sm mt-2'>A rede está em conformidade com os requisitos ONS.</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {gaps.map((gap: any) => (
              <div
                key={gap.id}
                className={`rounded-lg border p-4 ${getStatusColor(gap.status)}`}
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='text-sm font-mono text-muted-foreground'>{gap.id}</span>
                      <h3 className='font-semibold text-lg'>{gap.name}</h3>
                    </div>
                    <p className='text-sm text-muted-foreground mb-2'>{gap.description}</p>
                    <div className='text-xs text-muted-foreground'>{gap.details}</div>
                  </div>
                  <div className='flex items-center gap-4 ml-4'>
                    <div className='text-right'>
                      <div className='text-xs text-muted-foreground mb-1'>CVSS</div>
                      <div className={`text-lg font-bold ${getCvssColor(gap.cvss)}`}>
                        {gap.cvss}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs text-muted-foreground mb-1'>Esforço</div>
                      <div className='text-sm font-semibold'>{gap.effort_hours}h</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mt-3'>
                  <div className='flex items-center justify-between text-xs text-muted-foreground mb-1'>
                    <span>Progresso</span>
                    <span>
                      {gap.current_value || 0} / {gap.target_value || 0} {gap.unit || ''}
                    </span>
                  </div>
                  <div className='w-full bg-gray-800 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all ${
                        gap.status === 'critical' ? 'bg-red-500' :
                        gap.status === 'high' ? 'bg-orange-500' :
                        gap.status === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{
                        width: `${gap.target_value > 0 ? ((gap.current_value || 0) / gap.target_value) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {gaps.length > 0 && (
        <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
          <div className='flex items-start gap-4'>
            <AlertTriangle className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
            <div className='flex-1'>
              <h3 className='font-semibold mb-2 text-orange-500'>Ações Recomendadas</h3>
              <p className='text-sm text-muted-foreground mb-4'>
                {stats.total_gaps} gaps identificados requerem ação imediata. 
                Esforço total estimado: <strong>{stats.total_effort_hours} horas</strong> ({stats.total_effort_weeks} semanas-pessoa).
              </p>
              <div className='flex gap-3'>
                <Link href='/dashboard/remediation/plan'>
                  <button className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all text-sm font-medium'>
                    Ver Plano de Adequação
                  </button>
                </Link>
                <Link href='/dashboard/remediation/risks'>
                  <button className='px-4 py-2 border border-gray-700 rounded-md hover:border-orange-500 transition-all text-sm'>
                    Ver Matriz de Riscos
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
