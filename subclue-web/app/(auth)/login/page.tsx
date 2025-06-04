// app/(auth)/login/page.tsx
'use client';

import {
  useState,
  useEffect,
  type FormEvent,   // ✅ tipo do evento
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const {
    signInWithPassword,    // ← alterado aqui
    supabase,
    isLoading,
    serverSessionError,
    setServerSessionError,
  } = useAuth();

  const [tipo,  setTipo]  = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [localErro, setLocalErro] = useState('');

  /* exibe erro vindo do contexto */
  useEffect(() => {
    if (serverSessionError) setLocalErro(serverSessionError);
  }, [serverSessionError]);

  /* ------------------ login e-mail/senha ------------------ */
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErro('');
    if (serverSessionError) setServerSessionError(null);

    if (!email || !senha) {
      setLocalErro('E-mail e senha são obrigatórios.');
      return;
    }

    await signInWithPassword(email, senha);  // ← alterado aqui
    // redirecionamento / erro são tratados pelo AuthContext
  };

  /* ------------------ login social ------------------ */
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLocalErro('');
    if (serverSessionError) setServerSessionError(null);

    if (!supabase) {
      setLocalErro('Erro ao iniciar login social: cliente não disponível.');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });

    if (error) setServerSessionError(`Erro com ${provider}: ${error.message}`);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)_1fr] items-start gap-8 lg:gap-0 pt-12 md:pt-24">
      {/* coluna da esquerda */}
      <div className="hidden lg:flex flex-col justify-start items-end px-6 pt-0 text-right h-full">
        <div className="max-w-xs">
          <h2 className="text-4xl xl:text-5xl font-extrabold mb-4 text-[#1d3557]">
            Que Bom Ver Você!
          </h2>
          <p className="text-lg xl:text-xl font-medium text-[#1d3557] leading-relaxed">
            Faça o seu login<br />
            e aproveite todas as<br />
            vantagens do Subclue.
          </p>
        </div>
      </div>

      {/* coluna central */}
      <div className="flex flex-col items-center w-full px-4">
        <div className="w-full max-w-md bg-white/95 rounded-xl shadow-xl p-6 sm:p-8 z-10">
          {/* botão Cliente/Empresa */}
          <div className="flex mb-6 justify-center gap-3">
            {(['cliente', 'empresa'] as const).map(t => (
              <button
                key={t}
                type="button"
                className={`flex-1 py-2.5 px-4 rounded-md font-bold border text-xs sm:text-sm transition
                  ${tipo === t
                    ? 'bg-[#25c5b7] text-white border-[#25c5b7]'
                    : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
                onClick={() => setTipo(t)}
                disabled={isLoading}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* erros */}
          {(localErro || serverSessionError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-center text-sm">
              {localErro || serverSessionError}
            </div>
          )}

          {/* login social */}
          <div className="flex flex-col gap-3 mb-5">
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <FcGoogle size={20} /> Continuar com Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <FaApple size={18} /> Continuar com Apple
            </button>
          </div>

          {/* separador */}
          <div className="flex items-center gap-2 mb-5">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-semibold uppercase">ou</span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* formulário */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleLogin}
            autoComplete="off"
          >
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] disabled:bg-gray-50"
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] disabled:bg-gray-50"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#1d3557] hover:bg-[#163152] text-white rounded-md py-2.5 mt-2 font-bold text-sm transition disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          {/* links extras */}
          <div className="text-center mt-5">
            <Link
              href="/recuperar-senha"
              className="text-gray-500 hover:text-[#25c5b7] underline text-xs sm:text-sm font-medium"
            >
              Esqueci minha senha
            </Link>
          </div>
          <div className="text-center mt-2 text-xs sm:text-sm">
            <span className="text-gray-600">Não tem conta? </span>
            <Link
              href="/cadastro"
              className="text-[#1d3557] hover:text-[#25c5b7] underline font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>

      {/* coluna direita – ilustração */}
      <div className="hidden lg:flex items-end justify-start h-full pt-0">
        <Image
          src="/illustrations/hm_seja_bem_vindo_web.png"
          alt="Ilustração de login"
          width={800}
          height={800}
          priority
          style={{
            objectFit: 'contain',
            maxWidth: '1100px',
            maxHeight: '1100px',
            width: 'auto',
            height: '85vh',
            marginRight: '-450px',
          }}
        />
      </div>
    </div>
  );
}
