import Link from 'next/link'
import { Shield, FileText, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-brand-cyan icon-ness" />
            <div className="flex flex-col">
              <h1 className="ness-wordmark font-medium text-2xl">
                ness<span className="ness-wordmark-dot">.</span>
              </h1>
              <span className="text-gray-400 font-normal text-sm">OT GRC</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-brand-cyan transition-ness flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-brand-cyan transition-ness">Dashboard</Link>
          <span>/</span>
          <span className="text-brand-cyan">Frente 1: Normativa</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20">
              <FileText className="w-8 h-8 text-brand-cyan icon-ness" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Frente 1: Normativa</h1>
              <p className="text-gray-400">Compliance ANEEL RN 964/2021 + ONS</p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Documentos Obrigatórios</div>
            <div className="text-3xl font-bold mb-1">0<span className="text-gray-500">/50</span></div>
            <div className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              96% pendentes
            </div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Conformidade ONS</div>
            <div className="text-3xl font-bold mb-1">0%</div>
            <div className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              5 controles não conformes
            </div>
          </div>

          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Conformidade ANEEL</div>
            <div className="text-3xl font-bold mb-1">0%</div>
            <div className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              7 pilares pendentes
            </div>
          </div>
        </div>

        {/* 5 Controles ONS */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5 Controles Mínimos ONS</h2>
          <div className="space-y-3">
            {[
              { id: 1, name: 'Autenticação Multifator (MFA)', status: 'critical', progress: 0 },
              { id: 2, name: 'Gestão de Patches', status: 'critical', progress: 0 },
              { id: 3, name: 'VPN para Acesso Remoto', status: 'critical', progress: 0 },
              { id: 4, name: 'Antimalware Atualizado', status: 'critical', progress: 0 },
              { id: 5, name: 'Segmentação OT/IT (Modelo Purdue)', status: 'critical', progress: 0 },
            ].map((control) => (
              <div key={control.id} className="surface-1 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-600">#{control.id}</div>
                    <div>
                      <div className="font-semibold">{control.name}</div>
                      <div className="text-xs text-gray-500">Controle Obrigatório ONS</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500 font-medium">Não Conforme</span>
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${control.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Status */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Status de Documentos (50 Obrigatórios)</h2>
          <div className="surface-1 p-6 rounded-lg border border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">0</div>
                <div className="text-sm text-gray-400">Missing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">0</div>
                <div className="text-sm text-gray-400">Draft</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-1">0</div>
                <div className="text-sm text-gray-400">Em Revisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">0</div>
                <div className="text-sm text-gray-400">Aprovados</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Categorias:</span>
                <span className="text-gray-300">Políticas (6) • Procedimentos (6) • Planos (10) • Evidências (28)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 surface-1 p-6 rounded-lg border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2 text-orange-500">Ações Imediatas Requeridas</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Importar dados da rede TBE (3.907 ativos)</li>
                <li>• Coletar evidências dos 5 controles ONS</li>
                <li>• Iniciar criação dos 50 documentos obrigatórios</li>
                <li>• Agendar auditoria de conformidade</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <span className="ness-wordmark">ness<span className="ness-wordmark-dot">.</span></span> OT GRC - Governance, Risk & Compliance
          </div>
        </div>
      </footer>
    </div>
  )
}

