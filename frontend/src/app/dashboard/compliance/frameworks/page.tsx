import { Shield, Globe, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic'

async function getFrameworksData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/compliance/frameworks`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch frameworks');
    return res.json();
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    return {
      frameworks: [],
      stats: {
        total: 0,
        implemented: 0,
        partial: 0,
        missing: 0,
      },
    };
  }
}

// Map framework names to icons
const getFrameworkIcon = (name: string) => {
  if (name.includes('IEC')) return Globe;
  if (name.includes('NIST')) return Shield;
  if (name.includes('ISO')) return CheckCircle2;
  if (name.includes('CIS')) return AlertTriangle;
  return Shield;
};

// Map framework names to colors
const getFrameworkColor = (name: string) => {
  if (name.includes('IEC')) return { color: 'purple', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500' };
  if (name.includes('NIST')) return { color: 'blue', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500' };
  if (name.includes('ISO')) return { color: 'green', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500' };
  if (name.includes('CIS')) return { color: 'orange', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500' };
  return { color: 'gray', gradient: 'from-gray-500 to-slate-500', bg: 'bg-gray-500' };
};

export default async function FrameworksPage() {
  const data = await getFrameworksData();
  const { frameworks, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'border-green-500/50 text-green-500 bg-green-500/10';
      case 'partial': return 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10';
      case 'missing': return 'border-red-500/50 text-red-500 bg-red-500/10';
      default: return 'border-gray-500/50 text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Implementado';
      case 'partial': return 'Parcial';
      case 'missing': return 'Não implementado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6 pt-0'>
      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Frameworks de Segurança</h1>
        <p className='text-muted-foreground'>
          Padrões internacionais e frameworks de segurança cibernética
        </p>
      </div>

      {/* Overview Stats - Design Moderno */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                  <Shield className='h-4 w-4 text-[#00ade8]' />
                </div>
                Frameworks
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {frameworks.length}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Padrões mapeados</span>
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
                Implementados
              </CardDescription>
              <Badge variant='outline' className='border-green-500/50 text-green-500 bg-green-500/10 text-xs'>
                {frameworks.length > 0 ? Math.round((stats.implemented / frameworks.length) * 100) : 0}%
              </Badge>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-green-500'>
              {stats.implemented}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-green-500 font-medium'>Completo</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-yellow-500/10 p-1.5'>
                  <AlertTriangle className='h-4 w-4 text-yellow-500' />
                </div>
                Parciais
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-yellow-500'>
              {stats.partial}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-yellow-500 font-medium'>Em progresso</span>
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
                Não implementados
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {stats.missing}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-red-500 font-medium'>Pendentes</span>
          </CardFooter>
        </Card>
      </div>

      {/* Frameworks List - Design Moderno */}
      {frameworks.length === 0 ? (
        <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
          <CardContent className='p-12 text-center'>
            <AlertTriangle className='w-12 h-12 mx-auto mb-4 text-orange-500' />
            <p className='text-lg font-medium text-muted-foreground mb-2'>Nenhum framework cadastrado</p>
            <p className='text-sm text-muted-foreground'>Nenhum framework disponível no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {frameworks.map((framework: any) => {
            const Icon = getFrameworkIcon(framework.name);
            const colorInfo = getFrameworkColor(framework.name);
            return (
              <Card 
                key={framework.id || framework.name} 
                className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'
              >
                <div className='absolute inset-0 bg-gradient-to-br from-{colorInfo.color}-500/5 to-transparent' />
                <CardHeader className='relative pb-3'>
                                      <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className={`rounded-lg bg-${colorInfo.color}-500/10 p-2`}>
                        <Icon className={`w-5 h-5 text-${colorInfo.color}-500`} />
                      </div>
                      <div className='flex-1'>
                        <CardTitle className='text-lg font-semibold'>{framework.name}</CardTitle>
                        <CardDescription className='mt-1'>{framework.category || 'Internacional'}</CardDescription>
                      </div>
                    </div>
                    <Link href={`/dashboard/compliance/frameworks/${framework.id}`}>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <ExternalLink className='w-4 h-4 text-muted-foreground hover:text-brand-cyan transition-colors' />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className='relative space-y-4'>
                  <p className='text-sm text-muted-foreground'>{framework.description}</p>
                  
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Status</span>
                      <Badge variant='outline' className={getStatusColor(framework.status)}>
                        {getStatusText(framework.status)}
                      </Badge>
                    </div>
                    
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Compliance</span>
                      <span className='text-sm font-semibold'>{framework.compliance || 0}%</span>
                    </div>
                    
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div 
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colorInfo.gradient} transition-all duration-500 shadow-sm`}
                        style={{ width: `${framework.compliance || 0}%` }}
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' />
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{framework.compliance || 0} de {framework.requirements || 0} requisitos</span>
                      <span>{(framework.requirements || 0) - (framework.compliance || 0)} pendentes</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='relative pt-0'>
                  <Button 
                    className={`w-full ${
                      framework.status === 'missing' 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : framework.status === 'partial'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {framework.status === 'missing' ? 'Implementar Framework' :
                     framework.status === 'partial' ? 'Continuar Implementação' :
                     'Ver Detalhes'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  )
}
