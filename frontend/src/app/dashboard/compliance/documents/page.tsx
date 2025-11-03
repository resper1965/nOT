'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink, Upload } from 'lucide-react'
import { getComplianceDocuments } from '@/lib/api'
import { DocumentUploadDialog } from '@/components/compliance/DocumentUploadDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Documentos Obrigatórios</h1>
          <p className='text-muted-foreground'>
            50 documentos exigidos por ANEEL RN 964/2021 + ONS
          </p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className='bg-[#00ade8] text-gray-950 hover:bg-[#00ade8]/90 transition-all font-medium flex items-center gap-2'
        >
          <Upload className='w-4 h-4' />
          Upload Documento
        </Button>
      </div>

      {/* Stats Cards - Design Moderno */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-muted/20 transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-[#00ade8]/5 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
                  <FileText className='h-4 w-4 text-[#00ade8]' />
                </div>
                Total
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums'>
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Documentos obrigatórios</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-red-500/10 p-1.5'>
                  <XCircle className='h-4 w-4 text-red-500' />
                </div>
                Faltando
              </CardDescription>
              <Badge variant='outline' className='border-red-500/50 text-red-500 bg-red-500/10 text-xs'>
                {((stats.missing / stats.total) * 100).toFixed(1)}%
              </Badge>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-red-500'>
              {stats.missing}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-red-500 font-medium'>Pendentes</span>
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
                Em Revisão
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-yellow-500'>
              {stats.review}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-yellow-500 font-medium'>Aguardando aprovação</span>
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
                {stats.completion_rate}%
              </Badge>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-green-500'>
              {stats.approved}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-green-500 font-medium'>Completo</span>
          </CardFooter>
        </Card>
      </div>

      {/* Framework Breakdown - Design Moderno */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='relative overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-orange-500/10 p-1.5'>
                  <ExternalLink className='h-4 w-4 text-orange-500' />
                </div>
                ANEEL RN 964/2021
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-orange-500'>
              {frameworks.aneel}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Requisitos regulatórios</span>
          </CardFooter>
        </Card>
        
        <Card className='relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-blue-500/10 p-1.5'>
                  <ExternalLink className='h-4 w-4 text-blue-500' />
                </div>
                Controles ONS
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-blue-500'>
              {frameworks.ons}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Controles de segurança</span>
          </CardFooter>
        </Card>

        <Card className='relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-background transition-all hover:shadow-lg hover:scale-[1.02]'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent' />
          <CardHeader className='relative pb-3'>
            <div className='flex items-center justify-between'>
              <CardDescription className='flex items-center gap-2 text-xs font-medium'>
                <div className='rounded-lg bg-purple-500/10 p-1.5'>
                  <ExternalLink className='h-4 w-4 text-purple-500' />
                </div>
                IEC 62443
              </CardDescription>
            </div>
            <CardTitle className='mt-3 text-3xl font-bold tabular-nums text-purple-500'>
              {frameworks.iec}
            </CardTitle>
          </CardHeader>
          <CardFooter className='relative pt-0'>
            <span className='text-xs text-muted-foreground'>Padrão internacional</span>
          </CardFooter>
        </Card>
      </div>

      {/* Documents Table - Design Moderno */}
      <Card className='border-border/50 bg-gradient-to-br from-background to-muted/20'>
        <CardHeader className='border-b border-border/50'>
          <CardTitle className='flex items-center gap-2'>
            <div className='rounded-lg bg-[#00ade8]/10 p-1.5'>
              <FileText className='h-4 w-4 text-[#00ade8]' />
            </div>
            Lista de Documentos
          </CardTitle>
          <CardDescription className='mt-1.5'>
            {documents.length} documentos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-3'>
            {documents.map((doc: any) => (
              <Link
                key={doc.id}
                href={doc.conversion_status === 'completed' ? `/dashboard/compliance/documents/${doc.id}/edit` : '#'}
                className='group flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:border-[#00ade8]/50 hover:bg-muted/50'
              >
                <div className='flex items-center gap-3 flex-1'>
                  {statusIcon[doc.status as keyof typeof statusIcon]}
                  <div className='flex-1'>
                    <div className='font-medium'>{doc.id}: {doc.name || doc.original_filename || 'Documento'}</div>
                    <div className='text-xs text-muted-foreground mt-1'>{doc.category || ''} • {doc.framework || ''}</div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {doc.description || doc.original_filename || 'Sem descrição'}
                      {doc.conversion_status === 'completed' && (
                        <Badge variant='outline' className='ml-2 border-green-500/50 text-green-500 bg-green-500/10 text-[10px]'>
                          Editável
                        </Badge>
                      )}
                      {doc.conversion_status === 'pending' && (
                        <Badge variant='outline' className='ml-2 border-orange-500/50 text-orange-500 bg-orange-500/10 text-[10px]'>
                          Convertendo...
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <Badge 
                      variant='outline' 
                      className={`text-xs ${
                        doc.priority === 'P0' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                        doc.priority === 'P1' ? 'border-orange-500/50 text-orange-500 bg-orange-500/10' :
                        'border-gray-500/50 text-gray-500 bg-gray-500/10'
                      }`}
                    >
                      {doc.priority}
                    </Badge>
                    <div className='text-xs text-muted-foreground mt-1'>{doc.deadline}</div>
                  </div>
                  <Badge 
                    variant='outline' 
                    className={`text-xs uppercase font-medium ${
                      doc.status === 'approved' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                      doc.status === 'missing' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                      doc.status === 'draft' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                      'border-orange-500/50 text-orange-500 bg-orange-500/10'
                    }`}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
