import { Shield, Globe, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'

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
  if (name.includes('IEC')) return 'purple';
  if (name.includes('NIST')) return 'blue';
  if (name.includes('ISO')) return 'green';
  if (name.includes('CIS')) return 'orange';
  return 'gray';
};

export default async function FrameworksPage() {
  const data = await getFrameworksData();
  const { frameworks, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-500/10';
      case 'partial': return 'text-yellow-500 bg-yellow-500/10';
      case 'missing': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
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
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Frameworks de Segurança</h1>
          <p className='text-muted-foreground'>
            Padrões internacionais e frameworks de segurança cibernética
          </p>
        </div>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Shield className='w-4 h-4' />
          <span>Padrões internacionais</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Frameworks</div>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold'>{frameworks.length}</div>
          <div className='text-xs text-muted-foreground'>Padrões mapeados</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Implementados</div>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-green-500'>{stats.implemented}</div>
          <div className='text-xs text-muted-foreground'>{frameworks.length > 0 ? Math.round((stats.implemented / frameworks.length) * 100) : 0}% completo</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Parciais</div>
            <AlertTriangle className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-yellow-500'>{stats.partial}</div>
          <div className='text-xs text-muted-foreground'>
            {frameworks.filter((f: any) => f.status === 'partial').map((f: any) => f.name).join(', ') || 'Nenhum'}
          </div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Não implementados</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>{stats.missing}</div>
          <div className='text-xs text-muted-foreground'>
            {frameworks.filter((f: any) => f.status === 'missing').map((f: any) => f.name).join(', ') || 'Nenhum'}
          </div>
        </div>
      </div>

      {/* Frameworks List */}
      {frameworks.length === 0 ? (
        <div className='rounded-lg border bg-card p-12 text-center'>
          <AlertTriangle className='w-12 h-12 mx-auto mb-4 text-orange-500' />
          <p className='text-lg font-medium text-muted-foreground mb-2'>Nenhum framework cadastrado</p>
          <p className='text-sm text-muted-foreground'>Nenhum framework disponível no momento.</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {frameworks.map((framework: any) => {
            const Icon = getFrameworkIcon(framework.name);
            const color = getFrameworkColor(framework.name);
            return (
              <div key={framework.id || framework.name} className='rounded-lg border bg-card p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className={`p-2 rounded-lg bg-${color}-500/10`}>
                      <Icon className={`w-5 h-5 text-${color}-500`} />
                    </div>
                    <div>
                      <h3 className='font-semibold'>{framework.name}</h3>
                      <p className='text-sm text-muted-foreground'>{framework.category || 'Internacional'}</p>
                    </div>
                  </div>
                  <ExternalLink className='w-4 h-4 text-muted-foreground' />
                </div>
              
              <p className='text-sm text-muted-foreground mb-4'>{framework.description}</p>
              
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Status</span>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(framework.status)}`}>
                    {getStatusText(framework.status)}
                  </span>
                </div>
                
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Compliance</span>
                  <span className='text-sm font-medium'>{framework.compliance || 0}%</span>
                </div>
                
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div 
                    className={`bg-${color}-500 h-2 rounded-full transition-all`}
                    style={{ width: `${framework.compliance || 0}%` }}
                  ></div>
                </div>
                
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{framework.compliance || 0} de {framework.requirements || 0} requisitos</span>
                  <span>{(framework.requirements || 0) - (framework.compliance || 0)} pendentes</span>
                </div>
              </div>
              
              <div className='mt-4 pt-4 border-t'>
                <button className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  framework.status === 'missing' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : framework.status === 'partial'
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}>
                  {framework.status === 'missing' ? 'Implementar Framework' :
                   framework.status === 'partial' ? 'Continuar Implementação' :
                   'Ver Detalhes'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  )
}
