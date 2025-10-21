import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function PgAdminPage() {
  const { userId } = await auth();
  
  // Verificar se o usuário está autenticado
  if (!userId) {
    redirect('/sign-in');
  }

  // Aqui você pode adicionar lógica adicional para verificar se o usuário é admin
  // Por exemplo, verificando roles/metadata do Clerk
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">pgAdmin - Administração do Banco de Dados</h1>
            <p className="text-sm text-muted-foreground">
              Ferramenta de administração PostgreSQL protegida por autenticação
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Database: <span className="font-mono text-brand-cyan">ness_ot_grc</span>
            </div>
            <a 
              href="/dashboard" 
              className="px-4 py-2 bg-brand-cyan text-gray-950 rounded-md hover:bg-brand-cyan/90 transition-all font-medium"
            >
              Voltar ao Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* pgAdmin iframe */}
      <div className="flex-1 relative">
        <iframe
          src="http://localhost:5050"
          className="absolute inset-0 w-full h-full border-0"
          title="pgAdmin"
        />
      </div>

      {/* Info Box */}
      <div className="bg-card border-t p-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Conectado</span>
          </div>
          <div className="text-muted-foreground">
            <strong>Host:</strong> postgres:5432
          </div>
          <div className="text-muted-foreground">
            <strong>User:</strong> ness_user
          </div>
          <div className="text-muted-foreground">
            <strong>Database:</strong> ness_ot_grc
          </div>
        </div>
      </div>
    </div>
  );
}

