'use client';
import { useState, useEffect } from 'react';
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
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking');

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    console.log('🔍 [DEBUG] ========== PÁGINA SIGN-IN CARREGADA ==========');
    console.log('🔍 [DEBUG] URL atual:', window.location.href);
    console.log('🔍 [DEBUG] Cookies disponíveis:', {
      allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
      hasSbCookies: document.cookie.includes('sb-'),
      sbCookies: document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.trim().split('=')[0]),
    });
    
    let isChecking = true;
    
    const checkAuth = async () => {
      try {
        console.log('🔍 [DEBUG] Iniciando verificação de autenticação...');
        
        // Verificar sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔍 [DEBUG] Resultado getSession():', {
          hasSession: !!session,
          hasAccessToken: !!session?.access_token,
          sessionExpiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          error: sessionError ? {
            message: sessionError.message,
            name: sessionError.name,
          } : null,
          cookiesAgora: document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.trim().split('=')[0]),
        });

        // Verificar usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('🔍 [DEBUG] Resultado getUser():', {
          hasUser: !!user,
          userId: user?.id,
          userEmail: user?.email,
          emailConfirmed: !!user?.email_confirmed_at,
          error: userError ? {
            message: userError.message,
            name: userError.name,
            status: userError.status,
          } : null,
        });

        // Se há sessão e usuário, redirecionar para dashboard
        if (session && user) {
          console.log('✅ [DEBUG] ========== USUÁRIO JÁ AUTENTICADO ==========');
          console.log('✅ [DEBUG] Sessão válida:', {
            userId: user.id,
            email: user.email,
            accessToken: session.access_token.substring(0, 20) + '...',
          });
          
          setAuthStatus('authenticated');
          
          // Verificar parâmetro redirectedFrom na URL
          const urlParams = new URLSearchParams(window.location.search);
          const redirectedFrom = urlParams.get('redirectedFrom');
          const redirectPath = redirectedFrom || '/dashboard';
          
          console.log('🚀 [DEBUG] Preparando redirecionamento para:', redirectPath);
          console.log('🚀 [DEBUG] Usando window.location.href para garantir redirecionamento');
          
          // Usar window.location.href para garantir redirecionamento completo
          // Aguardar um pouco para garantir que logs apareçam
          setTimeout(() => {
            console.log('🚀 [DEBUG] Executando redirecionamento AGORA...');
            window.location.href = redirectPath;
          }, 1000);
        } else {
          console.log('❌ [DEBUG] ========== USUÁRIO NÃO AUTENTICADO ==========');
          console.log('❌ [DEBUG] Motivo:', {
            hasSession: !!session,
            hasUser: !!user,
            sessionError: sessionError?.message,
            userError: userError?.message,
          });
          setAuthStatus('not-authenticated');
        }
      } catch (err: any) {
        console.error('❌ [DEBUG] Erro ao verificar autenticação:', err);
        console.error('❌ [DEBUG] Stack:', err.stack);
        setAuthStatus('not-authenticated');
      } finally {
        isChecking = false;
      }
    };

    checkAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [DEBUG] ========== MUDANÇA DE ESTADO DE AUTENTICAÇÃO ==========');
      console.log('🔄 [DEBUG] Evento:', event);
      console.log('🔄 [DEBUG] Sessão:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      });

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ [DEBUG] ========== USUÁRIO AUTENTICADO VIA LISTENER ==========');
        setAuthStatus('authenticated');
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirectedFrom = urlParams.get('redirectedFrom');
        const redirectPath = redirectedFrom || '/dashboard';
        
        console.log('🚀 [DEBUG] Redirecionando via listener para:', redirectPath);
        
        setTimeout(() => {
          console.log('🚀 [DEBUG] Executando redirecionamento via listener AGORA...');
          window.location.href = redirectPath;
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        console.log('❌ [DEBUG] Usuário desautenticado via listener');
        setAuthStatus('not-authenticated');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 [DEBUG] Token atualizado via listener');
      }
    });

    return () => {
      console.log('🔍 [DEBUG] Limpando listeners...');
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('🔍 [DEBUG] Iniciando login...', { email });

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔍 [DEBUG] Resultado signInWithPassword:', {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        error: signInError ? {
          message: signInError.message,
          status: signInError.status,
        } : null,
      });

      if (signInError) {
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

      if (!data?.user || !data?.session) {
        console.error('❌ [DEBUG] Login falhou - sem usuário ou sessão:', {
          hasUser: !!data?.user,
          hasSession: !!data?.session,
        });
        setError('Erro ao criar sessão. Tente novamente.');
        setLoading(false);
        return;
      }

      console.log('✅ [DEBUG] Login bem-sucedido:', {
        userId: data.user.id,
        email: data.user.email,
        sessionToken: data.session.access_token.substring(0, 20) + '...',
      });

      // Verificar sessão atual
      const { data: currentUser, error: getUserError } = await supabase.auth.getUser();
      if (getUserError || !currentUser?.user) {
        console.error('❌ [DEBUG] Erro ao verificar usuário:', getUserError);
        setError('Erro ao verificar sessão. Tente novamente.');
        setLoading(false);
        return;
      }

      // Verificar sessão persistida
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('❌ [DEBUG] Sessão não persistida');
        setError('Erro ao salvar sessão. Tente novamente.');
        setLoading(false);
        return;
      }

      console.log('✅ [DEBUG] ========== LOGIN BEM-SUCEDIDO ==========');
      console.log('✅ [DEBUG] Sessão confirmada, preparando redirecionamento');

      // Verificar parâmetro redirectedFrom na URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectedFrom = urlParams.get('redirectedFrom');
      const redirectPath = redirectedFrom || '/dashboard';
      
      console.log('🚀 [DEBUG] Redirecionando para:', redirectPath);
      console.log('🔍 [DEBUG] Cookies antes do redirecionamento:', {
        cookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
        hasSbCookies: document.cookie.includes('sb-'),
        sbCookies: document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.trim()),
      });

      // Aguardar um pouco para garantir que cookies sejam salvos
      console.log('⏳ [DEBUG] Aguardando cookies serem salvos...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar cookies novamente
      console.log('🔍 [DEBUG] Cookies após aguardar:', {
        cookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
        hasSbCookies: document.cookie.includes('sb-'),
        sbCookies: document.cookie.split(';').filter(c => c.includes('sb-')).map(c => c.trim()),
      });

      // Verificar sessão uma última vez
      const { data: finalSession } = await supabase.auth.getSession();
      console.log('🔍 [DEBUG] Sessão final antes de redirecionar:', {
        hasSession: !!finalSession?.session,
        hasAccessToken: !!finalSession?.session?.access_token,
      });

      // Usar window.location.href para garantir redirecionamento completo
      // Isso força um reload completo e garante que o middleware veja a sessão
      console.log('🚀 [DEBUG] Executando redirecionamento AGORA com window.location.href...');
      
      // Não usar try/catch aqui, apenas redirecionar
      window.location.href = redirectPath;
      
    } catch (err: any) {
      console.error('❌ [DEBUG] Erro capturado:', err);
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (authStatus === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="w-full max-w-md space-y-8 px-4 text-center">
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

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
