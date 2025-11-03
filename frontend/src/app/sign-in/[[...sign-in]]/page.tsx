'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Debug: Início do login
    console.log('🔍 [DEBUG] Iniciando login...', { email });

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Debug: Resultado do signInWithPassword
      console.log('🔍 [DEBUG] Resultado signInWithPassword:', {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        emailConfirmed: !!data?.user?.email_confirmed_at,
        sessionAccessToken: data?.session?.access_token ? 'present' : 'missing',
        error: signInError ? {
          message: signInError.message,
          status: signInError.status,
          name: signInError.name,
        } : null,
      });

      if (signInError) {
        // Melhorar mensagens de erro específicas
        let errorMessage = signInError.message;
        
        if (signInError.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada para confirmar seu email.';
        } else if (signInError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
        } else if (signInError.message.includes('User not found')) {
          errorMessage = 'Usuário não encontrado. Verifique se o email está correto.';
        }
        
        console.error('❌ [DEBUG] Erro no login:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        console.log('✅ [DEBUG] Login bem-sucedido:', {
          userId: data.user.id,
          email: data.user.email,
          sessionToken: data.session.access_token.substring(0, 20) + '...',
          sessionExpiresAt: data.session.expires_at,
        });

        // Verificar cookies antes de redirecionar
        console.log('🔍 [DEBUG] Cookies antes de redirecionar:', {
          sbAccessToken: document.cookie.includes('sb-') ? 'present' : 'missing',
          allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
        });

        // Aguardar um pouco para garantir que cookies sejam salvos pelo Supabase
        console.log('⏳ [DEBUG] Aguardando cookies serem salvos pelo Supabase...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar sessão atual do Supabase após aguardar
        const { data: currentUser, error: getUserError } = await supabase.auth.getUser();
        console.log('🔍 [DEBUG] Usuário atual após login (após aguardar):', {
          hasUser: !!currentUser?.user,
          userId: currentUser?.user?.id,
          error: getUserError ? getUserError.message : null,
        });

        if (getUserError || !currentUser?.user) {
          console.error('❌ [DEBUG] Erro ao verificar usuário após login:', getUserError);
          setError('Erro ao verificar sessão. Tente novamente.');
          setLoading(false);
          return;
        }

        // Verificar cookies após aguardar e confirmar usuário
        console.log('🔍 [DEBUG] Cookies após aguardar:', {
          sbAccessToken: document.cookie.includes('sb-') ? 'present' : 'missing',
          supabaseCookies: document.cookie.split(';').filter(c => c.includes('sb-')),
        });

        // Verificar se a sessão está realmente persistida
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('🔍 [DEBUG] Sessão persistida:', {
          hasSession: !!sessionData?.session,
          sessionToken: sessionData?.session?.access_token ? 'present' : 'missing',
        });

        if (!sessionData?.session) {
          console.error('❌ [DEBUG] Sessão não persistida corretamente');
          setError('Erro ao salvar sessão. Tente novamente.');
          setLoading(false);
          return;
        }

        // Verificar se há parâmetro redirectedFrom na URL para redirecionar corretamente
        const urlParams = new URLSearchParams(window.location.search);
        const redirectedFrom = urlParams.get('redirectedFrom');
        const redirectPath = redirectedFrom || '/dashboard';
        
        console.log('🚀 [DEBUG] Redirecionando para:', redirectPath);
        
        // Forçar refresh da sessão antes de redirecionar
        await supabase.auth.refreshSession();
        
        // Aguardar um pouco mais para garantir que cookies sejam salvos e sessão seja atualizada
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar sessão novamente antes de redirecionar
        const { data: finalSession } = await supabase.auth.getSession();
        console.log('🔍 [DEBUG] Sessão final antes de redirecionar:', {
          hasSession: !!finalSession?.session,
          hasAccessToken: !!finalSession?.session?.access_token,
        });
        
        if (!finalSession?.session) {
          console.error('❌ [DEBUG] Sessão não disponível antes de redirecionar');
          setError('Erro ao atualizar sessão. Tente novamente.');
          setLoading(false);
          return;
        }
        
        // Usar window.location.replace em vez de href para evitar que o navegador armazene o estado anterior
        // Isso força um reload completo e garante que o middleware veja a sessão
        window.location.replace(redirectPath);
      } else if (data.user && !data.session) {
        console.warn('⚠️ [DEBUG] Usuário existe mas sessão não foi criada:', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
        });
        // Usuário existe mas sessão não foi criada (pode precisar confirmar email)
        setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
        setLoading(false);
      } else {
        console.error('❌ [DEBUG] Caso inesperado:', {
          hasUser: !!data?.user,
          hasSession: !!data?.session,
        });
        // Caso inesperado
        setError('Erro ao criar sessão. Tente novamente.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ [DEBUG] Erro capturado:', err);
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* ness. Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-tight">
            <span className="text-foreground">ness</span>
            <span className="text-[#00ade8]">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            OT GRC - Governance, Risk & Compliance
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              className="bg-background"
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#00ade8] hover:bg-[#00ade8]/90 text-gray-950 font-medium"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/sign-up"
              className="text-[#00ade8] hover:text-[#00ade8]/80 font-medium"
            >
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Sistema protegido com autenticação multi-fator
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Powered by <span className="font-medium">ness.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
