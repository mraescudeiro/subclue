'use client';

import { useState, useEffect } from 'react'; // useEffect is imported but not used in the provided code. It can be removed if not needed.
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Link is used for "Cadastre-se" and "Esqueci minha senha"
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
// Changed to use createClientComponentClient as per our previous discussions for client-side Supabase
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
// Icons import is removed as the provided JSX doesn't use Icons.spinner or Icons.eye/eyeOff
// If you re-add those features, you'll need: import { Icons } from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  // Initialize Supabase client using createClientComponentClient
  const supabase = createClientComponentClient<Database>();
  const [tipo, setTipo] = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  // showPassword state and toggleShowPassword function are not included
  // as the provided JSX for the password input does not have a show/hide button.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    
    console.log('==== RESPOSTA LOGIN SUPABASE (Email/Senha) ====');
    console.log('data:', data);
    console.log('error:', error);
    
    setLoading(false);

    if (error || !data?.user) {
      setErro(error?.message || 'Email ou senha inválidos!');
    } else {
      router.push('/'); // Redireciona para a raiz após login bem-sucedido
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setErro('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { 
        // Ensuring redirectTo uses window.location.origin safely
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
      }
    });
    if (error) {
        setErro('Erro ao iniciar login social: ' + error.message);
        setLoading(false);
    }
  };

  return (
    // User's original layout structure
    // For a full-page background and vertical centering of the entire content block,
    // this div might need to be wrapped by another div with min-h-screen, flex, items-center, justify-center, and the page background color.
    // The pt-12 md:pt-24 provides top padding.
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(400px,500px)_1fr] items-start gap-8 lg:gap-0 pt-12 md:pt-24"> 

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
              className={`flex-1 py-2.5 px-4 rounded-md font-bold border text-xs sm:text-sm transition-all duration-150 ease-in-out ${tipo === 'cliente' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
              onClick={() => setTipo('cliente')}
              disabled={loading}
            >
              Cliente
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 rounded-md font-bold border text-xs sm:text-sm transition-all duration-150 ease-in-out ${tipo === 'empresa' ? 'bg-[#25c5b7] text-white border-[#25c5b7]' : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-50'}`}
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
              className="flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <FcGoogle size={20} /> Continuar com Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 sm:gap-3 border border-gray-300 rounded-lg px-4 py-2.5 w-full font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70 text-xs sm:text-sm"
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
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
              disabled={loading}
            />
            <input // Password input without show/hide functionality as per user's provided code
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
              {/* Spinner icon removed as it was not in the user's provided button content */}
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </form>

          <div className="text-center mt-5">
            {/* Changed href to "#" for "Esqueci minha senha" as it's a common placeholder */}
            <Link href="#" className="text-gray-500 hover:text-[#25c5b7] underline text-xs sm:text-sm font-medium">
                Esqueci minha senha
            </Link>
          </div>
          <div className="text-center mt-2">
            <span className="text-gray-600 text-xs sm:text-sm">Não tem conta? </span>
            <Link href="/signup" className="text-[#1d3557] hover:text-[#25c5b7] underline text-xs sm:text-sm font-medium">
                Cadastre-se
            </Link>
          </div>
        </div>
      </div>

      {/* Ilustração - direita */}
      <div className="hidden lg:flex flex-col items-end justify-start h-full pr-0 md:pr-4 lg:pr-0 pt-0"> 
        <Image
          src="/illustrations/hm_seja_bem_vindo_web.png" // Ensure this path is correct
          alt="Ilustração de login"
          width={800} 
          height={800} 
          style={{ 
            objectFit: 'contain', 
            maxWidth: '1100px',  
            maxHeight: '1100px', 
            width: 'auto',      
            height: '85vh', 
            marginRight: '-450px', // This negative margin might need adjustment depending on the parent layout
          }}
          priority
        />
      </div>
    </div>
  );
}
