// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '@/lib/contexts/AuthContext'; // Usando o AuthContext

export default function LoginPage() {
  const router = useRouter();
  // Obtendo tudo do AuthContext
  const { signInWithPasswordFlow, supabase, isLoading, serverSessionError, setServerSessionError } = useAuth();

  const [tipo, setTipo] = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [localErro, setLocalErro] = useState(''); // Para erros de validação do formulário

  useEffect(() => { // Adicionado para observar serverSessionError
    if (serverSessionError) {
      console.log("[LoginPage] Error from AuthContext received:", serverSessionError);
      // Você pode optar por setar localErro aqui também se quiser unificar a exibição
      // setLocalErro(serverSessionError);
    }
  }, [serverSessionError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErro('');
    if (serverSessionError) setServerSessionError(null); // Limpa erro anterior do contexto

    if (!email || !senha) {
      setLocalErro('E-mail e senha são obrigatórios.');
      return;
    }

    console.log(`[LoginPage] Attempting login with email: ${email}`);
    // CORREÇÃO APLICADA AQUI:
    // Apenas chamamos a função. Ela não retorna { data, error } diretamente.
    // O AuthContext cuidará de atualizar os estados isLoading e serverSessionError.
    await signInWithPasswordFlow(email, senha);
    // A lógica de redirecionamento pós-login bem-sucedido já está no AuthContext
    // (if (window.location.pathname === '/login' || window.location.pathname === '/cadastro') router.push('/');)
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLocalErro('');
    if (serverSessionError) setServerSessionError(null);

    console.log(`[LoginPage] Attempting social login with ${provider}`);
    // Usa o cliente supabase do AuthContext
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });

    if (error) {
      setServerSessionError(`Erro com ${provider}: ${error.message}`);
      console.error(`[LoginPage] Social login error (${provider}):`, error.message);
    }
    // O redirecionamento OAuth e o onAuthStateChange no AuthContext cuidam do resto.
  };

 return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)_1fr] items-start gap-8 lg:gap-0 pt-12 md:pt-24">
      <div className="hidden lg:flex flex-col justify-start items-end px-6 pt-0 text-right h-full">
        <div className="max-w-xs mt-0">
          <h2 className="text-4xl xl:text-5xl font-extrabold mb-4 text-[#1d3557]">Que Bom Ver Você!</h2>
          <p className="text-lg xl:text-xl font-medium text-[#1d3557] leading-relaxed">
            Faça o seu login<br />
            e aproveite todas as<br />
            vantagens do Subclue.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center w-full px-4 pt-0">
        <div className="w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-xl p-6 sm:p-8 z-10 mt-0">
          <div className="flex mb-6 justify-center gap-3">
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-md font-bold border text-xs sm:text-sm transition-all duration-150 ease-in-out ${tipo === 'cliente' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
              onClick={() => setTipo('cliente')}
              disabled={isLoading}
            >
              Cliente
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-md font-bold border text-xs sm:text-sm transition-all duration-150 ease-in-out ${tipo === 'empresa' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
              onClick={() => setTipo('empresa')}
              disabled={isLoading}
            >
              Empresa
            </button>
          </div>

          {(localErro || serverSessionError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-center text-sm">
              {localErro || serverSessionError}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <FcGoogle size={20} /> Continuar com Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <FaApple size={20} className="text-black" /> Continuar com Apple
            </button>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="text-gray-400 text-xs font-semibold uppercase">ou</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin} autoComplete="off">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2.5 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium disabled:bg-gray-50"
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2.5 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium disabled:bg-gray-50"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-[#1d3557] hover:bg-[#163152] text-white rounded-md py-2.5 mt-2 w-full font-bold transition text-sm disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link href="/recuperar-senha" className="text-gray-500 hover:text-[#25c5b7] underline text-xs sm:text-sm font-medium">
              Esqueci minha senha
            </Link>
          </div>
          <div className="text-center mt-2">
            <span className="text-gray-600 text-xs sm:text-sm">Não tem conta? </span>
            <Link href="/cadastro" className="text-[#1d3557] hover:text-[#25c5b7] underline text-xs sm:text-sm font-medium">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-end justify-start h-full pr-0 md:pr-4 lg:pr-0 pt-0">
        <Image
          src="/illustrations/hm_seja_bem_vindo_web.png"
          alt="Ilustração de login"
          width={800}
          height={800}
          style={{
            objectFit: 'contain',
            maxWidth: '1100px',   
            maxHeight: '1100px',
            width: 'auto',       
            height: '85vh',
            marginRight: '-450px', 
          }}
          priority
        />
      </div>
    </div>
  );
}