import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'

export default function DocumentsPage() {
  const documents = [
    { id: 'POL-001', name: 'Política de Segurança da Informação', category: 'Política', status: 'missing', priority: 'P0' },
    { id: 'POL-002', name: 'Política de Segurança Cibernética OT', category: 'Política', status: 'missing', priority: 'P0' },
    { id: 'POL-003', name: 'Política de Controle de Acesso', category: 'Política', status: 'missing', priority: 'P0' },
    { id: 'PROC-001', name: 'Procedimento de Gestão de Incidentes', category: 'Procedimento', status: 'missing', priority: 'P0' },
    { id: 'PROC-002', name: 'Procedimento de Gestão de Patches', category: 'Procedimento', status: 'missing', priority: 'P0' },
    { id: 'BCP-001', name: 'Plano de Continuidade de Negócio', category: 'Plano', status: 'missing', priority: 'P1' },
  ]

  const statusIcon = {
    approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    draft: <Clock className="w-4 h-4 text-yellow-500" />,
    review: <AlertTriangle className="w-4 h-4 text-orange-500" />,
    missing: <XCircle className="w-4 h-4 text-red-500" />,
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Documentos Obrigatórios</h1>
          <p className='text-muted-foreground'>
            50 documentos exigidos por ANEEL RN 964/2021 + ONS
          </p>
        </div>
        <button className='px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 transition-all font-medium'>
          Criar Novo Documento
        </button>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Total</div>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold'>50</div>
          <div className='text-xs text-muted-foreground'>Documentos obrigatórios</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Faltando</div>
            <XCircle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>48</div>
          <div className='text-xs text-muted-foreground'>96% pendentes</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Em Revisão</div>
            <Clock className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='mt-2 text-2xl font-bold'>0</div>
          <div className='text-xs text-muted-foreground'>Aguardando aprovação</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Aprovados</div>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-green-500'>2</div>
          <div className='text-xs text-muted-foreground'>4% completo</div>
        </div>
      </div>

      {/* Documents Table */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Lista de Documentos</h2>
        </div>
        <div className='p-4'>
          <div className='space-y-2'>
            {documents.map((doc) => (
              <div key={doc.id} className='flex items-center justify-between p-3 rounded-lg border hover:border-brand-cyan/50 transition-all cursor-pointer'>
                <div className='flex items-center gap-3'>
                  {statusIcon[doc.status as keyof typeof statusIcon]}
                  <div>
                    <div className='font-medium'>{doc.id}: {doc.name}</div>
                    <div className='text-xs text-muted-foreground'>{doc.category}</div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <span className={`text-xs px-2 py-1 rounded ${
                    doc.priority === 'P0' ? 'bg-red-500/10 text-red-500' :
                    doc.priority === 'P1' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {doc.priority}
                  </span>
                  <span className='text-xs text-red-500 uppercase font-medium'>{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

