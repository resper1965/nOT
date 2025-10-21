import { Shield, Globe, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'

export default function FrameworksPage() {
  const frameworks = [
    {
      name: 'IEC 62443',
      description: 'Série de padrões internacionais para segurança de sistemas industriais',
      status: 'partial',
      compliance: 15,
      requirements: 45,
      category: 'Internacional',
      color: 'purple',
      icon: Globe
    },
    {
      name: 'NIST Cybersecurity Framework',
      description: 'Framework de segurança cibernética do NIST',
      status: 'missing',
      compliance: 0,
      requirements: 23,
      category: 'Internacional',
      color: 'blue',
      icon: Shield
    },
    {
      name: 'ISO 27001',
      description: 'Sistema de Gestão de Segurança da Informação',
      status: 'missing',
      compliance: 0,
      requirements: 114,
      category: 'Internacional',
      color: 'green',
      icon: CheckCircle2
    },
    {
      name: 'CIS Controls',
      description: 'Controles de Segurança Críticos do CIS',
      status: 'missing',
      compliance: 0,
      requirements: 18,
      category: 'Internacional',
      color: 'orange',
      icon: AlertTriangle
    }
  ];

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
          <div className='mt-2 text-2xl font-bold text-green-500'>0</div>
          <div className='text-xs text-muted-foreground'>0% completo</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Parciais</div>
            <AlertTriangle className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-yellow-500'>1</div>
          <div className='text-xs text-muted-foreground'>IEC 62443</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Não implementados</div>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>3</div>
          <div className='text-xs text-muted-foreground'>NIST, ISO, CIS</div>
        </div>
      </div>

      {/* Frameworks List */}
      <div className='grid gap-4 md:grid-cols-2'>
        {frameworks.map((framework) => {
          const Icon = framework.icon;
          return (
            <div key={framework.name} className='rounded-lg border bg-card p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className={`p-2 rounded-lg bg-${framework.color}-500/10`}>
                    <Icon className={`w-5 h-5 text-${framework.color}-500`} />
                  </div>
                  <div>
                    <h3 className='font-semibold'>{framework.name}</h3>
                    <p className='text-sm text-muted-foreground'>{framework.category}</p>
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
                  <span className='text-sm font-medium'>{framework.compliance}%</span>
                </div>
                
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div 
                    className={`bg-${framework.color}-500 h-2 rounded-full transition-all`}
                    style={{ width: `${framework.compliance}%` }}
                  ></div>
                </div>
                
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{framework.compliance} de {framework.requirements} requisitos</span>
                  <span>{framework.requirements - framework.compliance} pendentes</span>
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

      {/* Implementation Priority */}
      <div className='rounded-lg border border-orange-500/20 bg-orange-500/5 p-6'>
        <div className='flex items-start gap-4'>
          <AlertTriangle className='w-6 h-6 text-orange-500 flex-shrink-0 mt-1' />
          <div>
            <h3 className='font-semibold mb-2 text-orange-500'>Prioridade de Implementação</h3>
            <p className='text-sm text-muted-foreground mb-3'>
              <strong>Recomendação:</strong> Focar primeiro no IEC 62443 (já parcialmente implementado) 
              e depois expandir para NIST Cybersecurity Framework.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <div className='font-medium mb-2'>1. IEC 62443 (Prioridade Alta)</div>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li>• Já 15% implementado</li>
                  <li>• Específico para OT/ICS</li>
                  <li>• Alinhado com ANEEL RN 964</li>
                </ul>
              </div>
              <div>
                <div className='font-medium mb-2'>2. NIST Cybersecurity Framework</div>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li>• Framework mais abrangente</li>
                  <li>• Complementa IEC 62443</li>
                  <li>• Reconhecido internacionalmente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
