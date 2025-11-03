'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink, Upload } from 'lucide-react'
import { getComplianceDocuments } from '@/lib/api'
import { DocumentUploadDialog } from '@/components/compliance/DocumentUploadDialog'

export default function DocumentsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, missing: 0, approved: 0, draft: 0, review: 0, completion_rate: 0 })
  const [frameworks, setFrameworks] = useState({ aneel: 0, ons: 0, iec: 0 })
  const [loading, setLoading] = useState(true)

  // Carregar documentos
  useEffect(() => {
    setLoading(true)
    getComplianceDocuments()
      .then((complianceData) => {
        setDocuments(complianceData.documents || [])
        setStats(complianceData.stats || { total: 0, missing: 0, approved: 0, draft: 0, review: 0, completion_rate: 0 })
        setFrameworks(complianceData.frameworks || { aneel: 0, ons: 0, iec: 0 })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleUploadComplete = (documentId: string) => {
    // Recarregar documentos após upload
    getComplianceDocuments()
      .then((complianceData) => {
        setDocuments(complianceData.documents || [])
        setStats(complianceData.stats || stats)
        setFrameworks(complianceData.frameworks || frameworks)
      })
      .catch(() => {
        // Erro silencioso
      })
  }

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
        <button 
          onClick={() => setIsUploadOpen(true)}
          className='px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 transition-all font-medium flex items-center gap-2'
        >
          <Upload className='w-4 h-4' />
          Upload Documento
        </button>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Total</div>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold'>{stats.total}</div>
          <div className='text-xs text-muted-foreground'>Documentos obrigatórios</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Faltando</div>
            <XCircle className='h-4 w-4 text-red-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-red-500'>{stats.missing}</div>
          <div className='text-xs text-muted-foreground'>{((stats.missing / stats.total) * 100).toFixed(1)}% pendentes</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Em Revisão</div>
            <Clock className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-yellow-500'>{stats.review}</div>
          <div className='text-xs text-muted-foreground'>Aguardando aprovação</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Aprovados</div>
            <CheckCircle2 className='h-4 w-4 text-green-500' />
          </div>
          <div className='mt-2 text-2xl font-bold text-green-500'>{stats.approved}</div>
          <div className='text-xs text-muted-foreground'>{stats.completion_rate}% completo</div>
        </div>
      </div>

      {/* Framework Breakdown */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>ANEEL RN 964/2021</div>
            <ExternalLink className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold text-orange-500'>{frameworks.aneel}</div>
          <div className='text-xs text-muted-foreground'>Requisitos regulatórios</div>
        </div>
        
        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>Controles ONS</div>
            <ExternalLink className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold text-blue-500'>{frameworks.ons}</div>
          <div className='text-xs text-muted-foreground'>Controles de segurança</div>
        </div>

        <div className='rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-muted-foreground'>IEC 62443</div>
            <ExternalLink className='h-4 w-4 text-muted-foreground' />
          </div>
          <div className='mt-2 text-2xl font-bold text-purple-500'>{frameworks.iec}</div>
          <div className='text-xs text-muted-foreground'>Padrão internacional</div>
        </div>
      </div>

      {/* Documents Table */}
      <div className='rounded-lg border bg-card'>
        <div className='p-4 border-b'>
          <h2 className='text-lg font-semibold'>Lista de Documentos</h2>
        </div>
        <div className='p-4'>
          <div className='space-y-2'>
            {documents.map((doc: any) => (
              <Link
                key={doc.id}
                href={doc.conversion_status === 'completed' ? `/dashboard/compliance/documents/${doc.id}/edit` : '#'}
                className='flex items-center justify-between p-3 rounded-lg border hover:border-brand-cyan/50 transition-all cursor-pointer'
              >
                <div className='flex items-center gap-3 flex-1'>
                  {statusIcon[doc.status as keyof typeof statusIcon]}
                  <div className='flex-1'>
                    <div className='font-medium'>{doc.id}: {doc.name || doc.original_filename || 'Documento'}</div>
                    <div className='text-xs text-muted-foreground'>{doc.category || ''} • {doc.framework || ''}</div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {doc.description || doc.original_filename || 'Sem descrição'}
                      {doc.conversion_status === 'completed' && (
                        <span className='ml-2 text-green-500'>• Editável</span>
                      )}
                      {doc.conversion_status === 'pending' && (
                        <span className='ml-2 text-orange-500'>• Convertendo...</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <div className={`text-xs px-2 py-1 rounded ${
                      doc.priority === 'P0' ? 'bg-red-500/10 text-red-500' :
                      doc.priority === 'P1' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {doc.priority}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>{doc.deadline}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                    doc.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    doc.status === 'missing' ? 'bg-red-500/10 text-red-500' :
                    doc.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-orange-500/10 text-orange-500'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}

