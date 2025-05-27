'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });

    // LOG DETALHADO PARA DEBUG!
    console.log('==== RESPOSTA LOGIN SUPABASE ====');
    console.log('data:', data);
    console.log('error:', error);

    setLoading(false);

    if (error || !data?.user) {
      setErro(error?.message || 'Email ou senha inválidos!');
    } else {
      // Redireciona SEMPRE para o callback (login tradicional e social), 
      // que centraliza a experiência e o reload
      router.push('/auth/callback');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setErro('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      setErro('Erro ao iniciar login social: ' + error.message);
      setLoading(false);
    }
    // Não precisa de mais nada: OAuth já vai mandar pro /auth/callback
  };

  return (
    <div className="w-full max-w-[1280px] px-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)_1fr] items-start gap-8 lg:gap-0 pt-12 md:pt-24">
      {/* Coluna Promocional - esquerda */}
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

      {/* Formulário de Login - centro */}
      <div className="flex flex-col justify-start items-center w-full px-4 pt-0">
        <div className="w-full max-w-md bg-white bg-opacity-95 rounded-xl shadow-xl p-6 sm:p-8 z-10 mt-0">

          <div className="flex mb-6 justify-center gap-3">
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-bold border transition-all duration-150 ease-in-out w-1/2 ${tipo === 'cliente' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
              onClick={() => setTipo('cliente')}
              disabled={loading}
            >
              Cliente
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-bold border transition-all duration-150 ease-in-out w-1/2 ${tipo === 'empresa' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
              onClick={() => setTipo('empresa')}
              disabled={loading}
            >
              Empresa
            </button>
          </div>

          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-center text-sm">
              {erro}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-5">
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <FcGoogle size={22} /> Continuar com Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
            >
              <FaApple size={22} className="text-black" /> Continuar com Apple
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
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2.5 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium disabled:bg-gray-50"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-[#1d3557] hover:bg-[#163152] text-white rounded-md py-2.5 mt-2 w-full font-bold transition text-sm disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <div className="text-center mt-5">
            <a href="/signup" className="text-[#1d3557] hover:text-[#25c5b7] underline text-sm font-medium">Não tem conta? Cadastre-se</a>
          </div>
          <div className="text-center mt-2">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs">Esqueci minha senha</a>
          </div>
        </div>
      </div>

      {/* Ilustração - direita */}
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
            marginRight: '-200px',
          }}
          priority
        />
      </div>
    </div>
  );
}
