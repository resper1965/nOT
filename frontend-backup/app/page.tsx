import { NessGRCLogo, GRCBadge } from "@/components/layout/ness-grc-logo";
import { Button } from "@/components/ui/button";
import { Shield, Activity, AlertTriangle, Database } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-950/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NessGRCLogo size="md" variant="full" />
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>Entrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <GRCBadge />
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Governança e{" "}
              <span className="text-gradient-ness">Conformidade</span>
              <br />
              para redes OT
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Plataforma completa de GRC para setor elétrico: gestão de documentação regulatória,
              análise de riscos e conformidade ANEEL RN 964/2021 + ONS.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="glow-ness">
                Acessar Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                Documentação
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness">
              <Activity className="w-10 h-10 text-brand-cyan mb-4 icon-ness" />
              <h3 className="text-lg font-semibold mb-2">Análise de Topologia</h3>
              <p className="text-sm text-gray-400">
                Mapeamento completo da infraestrutura de rede com identificação
                de zonas de segurança e ativos críticos.
              </p>
            </div>

            <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness">
              <AlertTriangle className="w-10 h-10 text-orange-500 mb-4 icon-ness" />
              <h3 className="text-lg font-semibold mb-2">
                Detecção de Vulnerabilidades
              </h3>
              <p className="text-sm text-gray-400">
                Identificação de CVEs, misconfigurations e vetores de ataque
                com priorização baseada em CVSS.
              </p>
            </div>

            <div className="surface-1 p-6 rounded-lg border border-gray-800 card-hover-ness">
              <Database className="w-10 h-10 text-purple-500 mb-4 icon-ness" />
              <h3 className="text-lg font-semibold mb-2">Proteção de Dados</h3>
              <p className="text-sm text-gray-400">
                Análise de caminhos de exfiltração e conformidade com LGPD,
                IEC 62443 e frameworks de segurança.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© 2025</span>
              <span className="ness-wordmark">
                ness<span className="ness-wordmark-dot">.</span>
              </span>
              <span>Todos os direitos reservados.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-brand-cyan transition-ness">
                Privacidade
              </Link>
              <Link href="/terms" className="hover:text-brand-cyan transition-ness">
                Termos
              </Link>
              <Link href="/docs" className="hover:text-brand-cyan transition-ness">
                Documentação
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
