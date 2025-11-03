import { CheckCircle2, XCircle, Clock, AlertTriangle, Shield, Activity } from 'lucide-react'
import { getOnsControls } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Controles ONS</h1>
        <p className='text-muted-foreground'>
          5 controles mínimos de segurança baseados na análise real da rede
        </p>
      </div>

      {/* Stats Cards - Design Moderno */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                  <Shield className='h-4 w-4 text-[#00ade8]' />
                </div>
                Total
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Controles ONS</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-green-500/30 bg-gradient-to-br from-green-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-green-500/10 p-1.5'>
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                </div>
                Aprovados
              </CardDescription>
              <Badge variant='outline' className='border-green-500/50 text-green-500 bg-green-500/10 text-xs'>
                {stats.compliance_rate}%
              </Badge>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-green-500'>
              {stats.approved}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-green-500 font-medium'>Compliance</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-red-500/10 p-1.5'>
                  <AlertTriangle className='h-4 w-4 text-red-500' />
                </div>
                Críticos
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {stats.critical}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-red-500 font-medium'>Requer ação imediata</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                  <Clock className='h-4 w-4 text-yellow-500' />
                </div>
                Em Progresso
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-yellow-500'>
              {stats.in_progress}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-yellow-500 font-medium'>Implementação em andamento</span>
          </CardFooter>
        </Card>
      </div>

      {/* Controls List - Design Moderno */}
      <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
        <CardHeader className='border-b border-border/50'>
          <CardTitle className='flex items-center gap-2'>
            <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
              <Shield className='h-4 w-4 text-[#00ade8]' />
            </div>
            Status dos Controles ONS
          </CardTitle>
          <CardDescription className='mt-1.5'>
            Baseado na análise real da infraestrutura
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-3'>
            {controls.map((control: any) => (
              <div 
                key={control.id} 
                className='group flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:border-[#00ade8]/50 hover:bg-muted/50'
              >
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
                    <div className='text-sm font-semibold'>{control.completion}%</div>
                    <div className='relative h-2 w-20 overflow-hidden rounded-full bg-muted'>
                      <div 
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                          control.completion >= 100 ? 'from-green-500 to-emerald-500' :
                          control.completion >= 50 ? 'from-yellow-500 to-orange-500' :
                          'from-red-500 to-orange-500'
                        } transition-all duration-500 shadow-sm`}
                        style={{ width: `${control.completion}%` }}
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' />
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant='outline' 
                    className={`text-xs uppercase font-medium ${
                      control.status === 'approved' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                      control.status === 'missing' || control.status === 'critical' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                      'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                    }`}
                  >
                    {control.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
