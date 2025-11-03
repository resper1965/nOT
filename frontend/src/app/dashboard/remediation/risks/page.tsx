import { AlertTriangle, TrendingUp, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic'

async function getRisksData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/remediation/risks`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch risks');
    return res.json();
  } catch (error) {
    console.error('Error fetching risks:', error);
    return {
      risk_matrix: {},
      risk_levels: { critical: 0, high: 0, medium: 0, low: 0 },
      asset_criticality: { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 },
      vulnerability_distribution: { critical: 0, high: 0, medium: 0, low: 0 },
      top_risks: [],
      total_vulnerabilities: 0,
      total_assets: 0,
    };
  }
}

export default async function RisksMatrixPage() {
  const data = await getRisksData();
  const {
    risk_matrix,
    risk_levels,
    asset_criticality,
    vulnerability_distribution,
    top_risks,
    total_vulnerabilities,
    total_assets,
  } = data;

  // Risk matrix visualization (5x5)
  const impactLevels = ['very_low', 'low', 'medium', 'high', 'critical'];
  const likelihoodLevels = ['very_low', 'low', 'medium', 'high', 'very_high'];

  const getRiskColor = (impact: string, likelihood: string) => {
    const key = `${impact}-${likelihood}`;
    const count = risk_matrix[key] || 0;
    
    if (count === 0) return 'bg-gray-900 border-gray-800';
    
    // Critical risk (top-right)
    if ((impact === 'critical' || impact === 'high') && (likelihood === 'very_high' || likelihood === 'high')) {
      return 'bg-red-500/30 border-red-500/50';
    }
    
    // High risk
    if ((impact === 'critical' || impact === 'high') && likelihood === 'medium') {
      return 'bg-orange-500/30 border-orange-500/50';
    }
    if (impact === 'medium' && (likelihood === 'very_high' || likelihood === 'high')) {
      return 'bg-orange-500/30 border-orange-500/50';
    }
    
    // Medium risk
    if ((impact === 'medium' || impact === 'low') && likelihood === 'medium') {
      return 'bg-yellow-500/30 border-yellow-500/50';
    }
    
    // Low risk
    return 'bg-green-500/30 border-green-500/50';
  };

  const getRiskLabel = (impact: string, likelihood: string) => {
    const key = `${impact}-${likelihood}`;
    const count = risk_matrix[key] || 0;
    return count > 0 ? count : '';
  };

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Matriz de Riscos</h1>
          <p className='text-muted-foreground'>
            Visualização de riscos por impacto e probabilidade
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

      {/* Risk Levels Overview */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Riscos Críticos</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className='text-2xl font-bold text-red-500'>{risk_levels.critical}</div>
          <div className='text-xs text-muted-foreground'>Requer ação imediata</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Riscos Altos</div>
            <AlertTriangle className='h-4 w-4 text-orange-500' />
          </div>
          <div className='text-2xl font-bold text-orange-500'>{risk_levels.high}</div>
          <div className='text-xs text-muted-foreground'>Prioridade alta</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Riscos Médios</div>
            <TrendingUp className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='text-2xl font-bold text-yellow-500'>{risk_levels.medium}</div>
          <div className='text-xs text-muted-foreground'>Monitoramento contínuo</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-sm font-medium text-muted-foreground'>Riscos Baixos</div>
            <Shield className='h-4 w-4 text-green-500' />
          </div>
          <div className='text-2xl font-bold text-green-500'>{risk_levels.low}</div>
          <div className='text-xs text-muted-foreground'>Aceitável</div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className='rounded-lg border bg-card p-6'>
        <h2 className='text-xl font-semibold mb-4'>Matriz de Riscos (Impacto × Probabilidade)</h2>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border border-gray-800 p-2 text-xs text-muted-foreground'></th>
                {impactLevels.map((impact) => (
                  <th
                    key={impact}
                    className='border border-gray-800 p-2 text-xs font-medium text-muted-foreground'
                  >
                    {impact === 'very_low' ? 'Muito Baixo' :
                     impact === 'low' ? 'Baixo' :
                     impact === 'medium' ? 'Médio' :
                     impact === 'high' ? 'Alto' : 'Crítico'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {likelihoodLevels.reverse().map((likelihood) => (
                <tr key={likelihood}>
                  <td className='border border-gray-800 p-2 text-xs font-medium text-muted-foreground'>
                    {likelihood === 'very_low' ? 'Muito Baixa' :
                     likelihood === 'low' ? 'Baixa' :
                     likelihood === 'medium' ? 'Média' :
                     likelihood === 'high' ? 'Alta' : 'Muito Alta'}
                  </td>
                  {impactLevels.map((impact) => {
                    const key = `${impact}-${likelihood}`;
                    const count = risk_matrix[key] || 0;
                    return (
                      <td
                        key={key}
                        className={`border border-gray-800 p-3 text-center font-bold ${getRiskColor(impact, likelihood)}`}
                      >
                        {count > 0 ? (
                          <div>
                            <div className='text-2xl'>{count}</div>
                            <div className='text-xs text-muted-foreground'>riscos</div>
                          </div>
                        ) : (
                          <span className='text-gray-600'>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 text-xs text-muted-foreground'>
          <p>Legenda: Celulas sombreadas indicam riscos identificados. Quanto mais à direita e acima, maior o risco.</p>
        </div>
      </div>

      {/* Asset Criticality & Vulnerability Distribution */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold mb-4'>Distribuição de Vulnerabilidades</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Críticas</span>
              <span className='text-lg font-bold text-red-500'>{vulnerability_distribution.critical}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Altas</span>
              <span className='text-lg font-bold text-orange-500'>{vulnerability_distribution.high}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Médias</span>
              <span className='text-lg font-bold text-yellow-500'>{vulnerability_distribution.medium}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Baixas</span>
              <span className='text-lg font-bold text-green-500'>{vulnerability_distribution.low}</span>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-800'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Total</span>
                <span className='text-xl font-bold'>{total_vulnerabilities}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold mb-4'>Criticidade de Assets</h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Críticos</span>
              <span className='text-lg font-bold text-red-500'>{asset_criticality.critical}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Altos</span>
              <span className='text-lg font-bold text-orange-500'>{asset_criticality.high}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Médios</span>
              <span className='text-lg font-bold text-yellow-500'>{asset_criticality.medium}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Baixos</span>
              <span className='text-lg font-bold text-green-500'>{asset_criticality.low}</span>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-800'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Total</span>
                <span className='text-xl font-bold'>{total_assets.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Risks */}
      {top_risks.length > 0 && (
        <div className='rounded-lg border bg-card p-6'>
          <h3 className='text-lg font-semibold mb-4'>Top 10 Riscos (por CVSS)</h3>
          <div className='space-y-2'>
            {top_risks.map((risk: any, index: number) => (
              <div
                key={risk.id || index}
                className='flex items-center justify-between p-3 rounded-lg bg-gray-900'
              >
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-mono text-muted-foreground'>#{index + 1}</span>
                  <span className='text-sm'>
                    CVSS {risk.cvss_score?.toFixed(1) || 'N/A'} - {risk.severity || 'Unknown'}
                  </span>
                </div>
                <div className={`text-sm font-bold ${
                  risk.cvss_score >= 9.0 ? 'text-red-500' :
                  risk.cvss_score >= 7.0 ? 'text-orange-500' :
                  risk.cvss_score >= 4.0 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {risk.severity?.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
