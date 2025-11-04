'use client'

import { useState } from 'react'
import { FileText, Download, FileDown, FileSpreadsheet, File } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ReportsPage() {
  const [generatingAneel, setGeneratingAneel] = useState(false)
  const [generatingOns, setGeneratingOns] = useState(false)

  const handleGenerateAneel = async (format: 'json' | 'pdf' | 'csv') => {
    setGeneratingAneel(true)
    try {
      const response = await fetch(`/api/compliance/reports/aneel?format=${format}`)
      if (!response.ok) throw new Error('Failed to generate report')
      
      if (format === 'json') {
        const data = await response.json()
        // Download JSON
        const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aneel-report-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        const csv = await response.text()
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv; charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aneel-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // Para PDF, vamos abrir em nova aba e usar print-to-PDF do navegador
        const html = await response.text()
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.onload = () => {
            setTimeout(() => {
              newWindow.print()
            }, 500)
          }
        }
        // Alternativa: usar window.print() direto
        // window.open(url, '_blank')?.print()
      }
    } catch (error) {
      console.error('Error generating ANEEL report:', error)
      alert('Erro ao gerar relatório ANEEL')
    } finally {
      setGeneratingAneel(false)
    }
  }

  const handleGenerateOns = async (format: 'json' | 'pdf' | 'csv') => {
    setGeneratingOns(true)
    try {
      const response = await fetch(`/api/compliance/reports/ons?format=${format}`)
      if (!response.ok) throw new Error('Failed to generate report')
      
      if (format === 'json') {
        const data = await response.json()
        // Download JSON
        const blob = new Blob([JSON.stringify(data.report, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ons-report-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        const csv = await response.text()
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv; charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ons-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // Para PDF, vamos abrir em nova aba e usar print-to-PDF do navegador
        const html = await response.text()
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.onload = () => {
            setTimeout(() => {
              newWindow.print()
            }, 500)
          }
        }
      }
    } catch (error) {
      console.error('Error generating ONS report:', error)
      alert('Erro ao gerar relatório ONS')
    } finally {
      setGeneratingOns(false)
    }
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 p-6'>
      {/* Header Section */}
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Relatórios Regulatórios</h1>
        <p className='text-muted-foreground'>
          Relatórios prontos para auditor/regulador - ANEEL RN 964/2021 e ONS RO-CB.BR.01
        </p>
      </div>

      {/* Reports Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* ANEEL Report */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <FileText className='w-5 h-5 text-[#00ade8]' />
              <CardTitle>Relatório ANEEL RN 964/2021</CardTitle>
            </div>
            <CardDescription>
              Status por controle, evidência, responsável, última revisão e exceções
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Gere relatório completo de conformidade com ANEEL RN 964/2021 incluindo:
              </p>
              <ul className='text-sm text-muted-foreground list-disc list-inside space-y-1'>
                <li>Status de cada controle</li>
                <li>Evidências vinculadas</li>
                <li>Responsáveis e últimas revisões</li>
                <li>Exceções aprovadas</li>
              </ul>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                onClick={() => handleGenerateAneel('json')}
                disabled={generatingAneel}
                variant='outline'
                size='sm'
              >
                <Download className='w-4 h-4 mr-2' />
                {generatingAneel ? 'Gerando...' : 'JSON'}
              </Button>
              <Button
                onClick={() => handleGenerateAneel('pdf')}
                disabled={generatingAneel}
                variant='outline'
                size='sm'
              >
                <FileDown className='w-4 h-4 mr-2' />
                {generatingAneel ? 'Gerando...' : 'PDF'}
              </Button>
              <Button
                onClick={() => handleGenerateAneel('csv')}
                disabled={generatingAneel}
                variant='outline'
                size='sm'
              >
                <FileSpreadsheet className='w-4 h-4 mr-2' />
                {generatingAneel ? 'Gerando...' : 'CSV'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ONS Report */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <FileText className='w-5 h-5 text-[#00ade8]' />
              <CardTitle>Relatório ONS RO-CB.BR.01</CardTitle>
            </div>
            <CardDescription>
              Checklist detalhado por planta/instalação com status de cada controle
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Gere relatório completo de conformidade com ONS RO-CB.BR.01 incluindo:
              </p>
              <ul className='text-sm text-muted-foreground list-disc list-inside space-y-1'>
                <li>Checklist por instalação</li>
                <li>Status de cada controle ONS</li>
                <li>Evidências e exceções</li>
                <li>Timeline de conformidade</li>
              </ul>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                onClick={() => handleGenerateOns('json')}
                disabled={generatingOns}
                variant='outline'
                size='sm'
              >
                <Download className='w-4 h-4 mr-2' />
                {generatingOns ? 'Gerando...' : 'JSON'}
              </Button>
              <Button
                onClick={() => handleGenerateOns('pdf')}
                disabled={generatingOns}
                variant='outline'
                size='sm'
              >
                <FileDown className='w-4 h-4 mr-2' />
                {generatingOns ? 'Gerando...' : 'PDF'}
              </Button>
              <Button
                onClick={() => handleGenerateOns('csv')}
                disabled={generatingOns}
                variant='outline'
                size='sm'
              >
                <FileSpreadsheet className='w-4 h-4 mr-2' />
                {generatingOns ? 'Gerando...' : 'CSV'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>
              <strong>JSON:</strong> Exportação completa em formato JSON para análise e processamento.
            </p>
            <p>
              <strong>PDF:</strong> Relatório formatado pronto para impressão. Use a função de impressão do navegador para salvar como PDF.
            </p>
            <p>
              <strong>CSV:</strong> Dados tabulares para análise em planilhas (Excel, Google Sheets).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

