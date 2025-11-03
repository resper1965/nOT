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

      console.log('✅ [DEBUG] Sessão confirmada, preparando redirecionamento');

      // Verificar parâmetro redirectedFrom na URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectedFrom = urlParams.get('redirectedFrom');
      const redirectPath = redirectedFrom || '/dashboard';
      
      console.log('🚀 [DEBUG] Redirecionando para:', redirectPath);
      console.log('🔍 [DEBUG] Cookies antes do redirecionamento:', {
        cookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
        hasSbCookies: document.cookie.includes('sb-'),
      });

      // Aguardar um pouco para garantir que cookies sejam salvos
      await new Promise(resolve => setTimeout(resolve, 200));

      // Redirecionar usando window.location.replace para forçar reload completo
      // Isso garante que o middleware veja a sessão
      // IMPORTANTE: Não usar await ou return após isso
      console.log('🔄 [DEBUG] Executando redirecionamento agora...');
      
      // Usar window.location.href como fallback se replace não funcionar
      try {
        window.location.replace(redirectPath);
        // Se chegou aqui, replace não funcionou
        console.warn('⚠️ [DEBUG] window.location.replace não redirecionou, tentando href...');
        window.location.href = redirectPath;
      } catch (err) {
        console.error('❌ [DEBUG] Erro ao redirecionar:', err);
        // Última tentativa: usar router
        router.push(redirectPath);
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
