'use client';

import { Shield, Network, FileText, TrendingUp, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ade8] flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-950" />
              </div>
              <div>
                <h1 className="text-2xl font-medium tracking-tight">
                  <span className="text-white">ness</span>
                  <span className="text-[#00ade8]">.</span>
                </h1>
                <p className="text-xs text-gray-400">OT GRC Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <button className="px-6 py-2 bg-[#00ade8] text-gray-950 rounded-lg hover:bg-[#00ade8]/90 transition-all font-medium text-sm">
                  Entrar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-12 pb-16">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    <span className="text-white">Governance, Risk & Compliance</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ade8] to-cyan-400">
                      para Redes OT
                    </span>
                  </h1>
                  
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Plataforma completa de segurança cibernética para o setor elétrico. 
                    Análise automatizada de vulnerabilidades, compliance regulatório e 
                    modelo Purdue para segmentação de redes industriais.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Link href="/sign-in">
                      <button className="px-8 py-4 bg-[#00ade8] text-gray-950 rounded-lg hover:bg-[#00ade8]/90 transition-all font-semibold text-lg shadow-xl shadow-[#00ade8]/20">
                        Acessar Plataforma
                      </button>
                    </Link>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ade8]/10 border border-[#00ade8]/20">
                      <Lock className="w-4 h-4 text-[#00ade8]" />
                      <span className="text-sm text-[#00ade8] font-medium">Compliance ANEEL RN 964/2021</span>
                    </div>
                  </div>
                </div>

          {/* Right: Auth Box */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[#00ade8] blur-[120px] opacity-20 rounded-full"></div>
            
            {/* Auth Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Acesso Seguro</h2>
                <p className="text-sm text-gray-400">
                  Faça login para acessar o painel de GRC
                </p>
              </div>

              <div className="space-y-4">
                <Link href="/sign-in">
                  <button className="w-full px-6 py-4 bg-[#00ade8] text-gray-950 rounded-lg hover:bg-[#00ade8]/90 transition-all font-semibold text-base shadow-lg shadow-[#00ade8]/20">
                    Entrar
                  </button>
                </Link>

                {/* Security Badge */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Protegido com autenticação multi-fator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 pb-12">
              <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#00ade8]/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#00ade8]/10 flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-[#00ade8]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Análise de Rede</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Mapeamento automático de topologia, VLANs, roteamento Layer 3 e 
              análise de vulnerabilidades com NetworkX. Identificação automática de 
              dispositivos, conexões e análise de fluxo de tráfego.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#00ade8]/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#00ade8]/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#00ade8]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Compliance</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conformidade com ANEEL RN 964/2021, Controles ONS e frameworks 
              internacionais (IEC 62443, NIST, ISO 27001). Gestão de documentos 
              de compliance e auditoria automatizada.
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#00ade8]/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#00ade8]/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#00ade8]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Modelo Purdue</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Classificação automática de VLANs em níveis Purdue (0-5), geração 
              de regras de firewall e análise de segmentação OT/IT. Mapeamento 
              de zonas de segurança e isolamento de redes críticas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © 2025 <span className="text-white font-medium">ness.</span> - OT GRC Platform
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
