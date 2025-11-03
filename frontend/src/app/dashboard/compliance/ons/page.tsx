import { CheckCircle2, XCircle, Clock, AlertTriangle, Shield, Activity } from 'lucide-react'
import { getOnsControls } from '@/lib/api'

export default async function OnsControlsPage() {
  const controlsData = await getOnsControls().catch(() => ({ 
    controls: [], 
    stats: { total: 0, approved: 0, missing: 0, critical: 0, in_progress: 0, compliance_rate: 0 }
  }));
  
  const { controls, stats } = controlsData;

  const statusIcon = {
    approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    missing: <XCircle className="w-4 h-4 text-red-500" />,
    critical: <AlertTriangle className="w-4 h-4 text-red-500" />,
    in_progress: <Clock className="w-4 h-4 text-yellow-500" />,
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Controles ONS</h1>
          <p className='text-muted-foreground'>
            10 controles de segurança baseados na análise real da rede
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Shield className='w-4 h-4' />
          <span>Baseado em dados reais</span>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Total</div>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold'>{stats.total}</div>
          <div className='text-xs text-muted-foreground'>Controles ONS</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Aprovados</div>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-green-500'>{stats.approved}</div>
          <div className='text-xs text-muted-foreground'>{stats.compliance_rate}% compliance</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Críticos</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>{stats.critical}</div>
          <div className='text-xs text-muted-foreground'>Requer ação imediata</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Em Progresso</div>
            <Clock className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-yellow-500'>{stats.in_progress}</div>
          <div className='text-xs text-muted-foreground'>Implementação em andamento</div>
        </div>
      </div>

      {/* Controls List */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Status dos Controles ONS</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Baseado na análise real da infraestrutura
          </p>
        </div>
        <div className='p-4'>
          <div className='space-y-3'>
            {controls.map((control: any) => (
              <div key={control.id} className='flex items-center justify-between p-4 rounded-lg border hover:border-brand-cyan/50 transition-all'>
                <div className='flex items-center gap-4 flex-1'>
                  {statusIcon[control.status as keyof typeof statusIcon]}
                  <div className='flex-1'>
                    <div className='font-medium'>{control.id}: {control.name}</div>
                    <div className='text-sm text-muted-foreground mt-1'>{control.description}</div>
                    <div className='text-xs text-muted-foreground mt-2'>
                      <strong>Evidência:</strong> {control.evidence}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>{control.completion}%</div>
                    <div className='w-20 bg-gray-200 rounded-full h-2'>
                      <div 
                        className={`h-2 rounded-full ${
                          control.completion === 100 ? 'bg-green-500' :
                          control.completion >= 50 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${control.completion}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                    control.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    control.status === 'critical' ? 'bg-red-500/10 text-red-500' :
                    control.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {control.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
