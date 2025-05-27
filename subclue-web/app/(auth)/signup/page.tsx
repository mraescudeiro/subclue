'use client';

import SignupSuccessModal from '@/components/SignupSuccessModal';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [userType, setUserType] = useState<'cliente' | 'empresa'>('cliente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfTouched, setCpfTouched] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const [dataNasc, setDataNasc] = useState('');

  const [responsavel, setResponsavel] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cnpjError, setCnpjError] = useState('');
  const [telefone, setTelefone] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (!supabase) {
      console.error('[SignupPage] useEffect: Instância do Supabase NÃO está disponível!');
    }
  }, []);

  const validateCpf = (value: string) => {
    if (!value) return "O CPF é obrigatório";
    if (!cpfValidator.isValid(value)) return "CPF inválido";
    return '';
  };
  const validateCnpj = (value: string) => {
    if (!value) return "O CNPJ é obrigatório";
    if (!/^\d{14}$/.test(value.replace(/\D/g, ""))) return "CNPJ inválido";
    return '';
  };
  const validateSenha = (s1: string, s2: string) => {
    if (!s1) return "Senha obrigatória";
    if (s1.length < 6) return "A senha deve ter ao menos 6 caracteres";
    if (s1 !== s2) return "As senhas não conferem";
    return '';
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCpf(value);
    if (cpfTouched) setCpfError(validateCpf(value));
  };
  const handleCpfBlur = () => {
    setCpfTouched(true);
    setCpfError(validateCpf(cpf));
  };
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCnpj(value);
    setCnpjError(validateCnpj(value));
  };

  // Salva dados no localStorage antes do social login (manter se usar depois)
  const saveUserDataToStorage = () => {
    if (userType === 'empresa') {
      localStorage.setItem('userType', 'empresa');
      localStorage.setItem('nomeEmpresa', nomeEmpresa);
      localStorage.setItem('responsavel', responsavel);
      localStorage.setItem('cnpj', cnpj);
      localStorage.setItem('telefone', telefone);
      localStorage.setItem('website', website);
    } else {
      localStorage.setItem('userType', 'cliente');
      localStorage.setItem('nome', nome);
      localStorage.setItem('cpf', cpf);
      localStorage.setItem('dataNasc', dataNasc);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setFormError('');
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        }
      });
    } catch (error: any) {
      setFormError('Erro ao autenticar com ' + provider + ': ' + (error?.message || error));
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    let valid = true;
    if (userType === 'cliente') {
      if (!nome) {
        setFormError('O nome completo é obrigatório para clientes.');
        valid = false;
      }
      const cpfErr = validateCpf(cpf);
      setCpfError(cpfErr);
      if (cpfErr) valid = false;
    } else {
      if (!responsavel) {
        setFormError('O nome do responsável é obrigatório para empresas.');
        valid = false;
      }
      if (!nomeEmpresa) {
        setFormError('O nome da empresa é obrigatório.');
        valid = false;
      }
      const cnpjErr = validateCnpj(cnpj);
      setCnpjError(cnpjErr);
      if (cnpjErr) valid = false;
    }

    if (!email) {
      setFormError('O e-mail é obrigatório.');
      valid = false;
    }
    const senhaErr = validateSenha(senha, senha2);
    setSenhaError(senhaErr);
    if (senhaErr) valid = false;

    if (!valid) {
      if (valid === false && formError === '') {
        setFormError('Por favor, corrija os erros no formulário.');
      }
      return;
    }

    setIsLoading(true);

    try {
      // Só envie para user_metadata campos aceitos pelo Supabase!
      let userDataForMeta: Record<string, string | undefined> = {};
      if (userType === 'cliente') {
        userDataForMeta = {
          nome_completo: nome,
          cpf,
          data_nascimento: dataNasc,
          tipo_usuario: 'cliente',
        };
      } else {
        userDataForMeta = {
          nome_responsavel: responsavel,
          nome_empresa: nomeEmpresa,
          cnpj,
          telefone,
          website,
          tipo_usuario: 'empresa',
        };
      }

      // Opção apenas se campos válidos (Evite enviar undefined!)
      const filteredUserMeta: Record<string, string> = {};
      for (const key in userDataForMeta) {
        const val = userDataForMeta[key];
        if (typeof val === 'string' && val.trim() !== '') {
          filteredUserMeta[key] = val;
        }
      }

      // Envia o user_metadata como options.data (seguro)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: filteredUserMeta,
        }
      });

      if (signUpError) {
        setFormError(`[${signUpError.status || '??'}] Erro ao criar usuário: ${signUpError.message}`);
        setIsLoading(false);
        console.error('[SignupPage] Supabase signUp error:', signUpError);
        return;
      }

      // Usuário criado: verifica se exige confirmação
      if (signUpData.user && !signUpData.session) {
        setSuccessMessage(
          `Cadastro iniciado! Um link de confirmação foi enviado para ${email}. Verifique sua caixa de entrada (e spam) para ativar sua conta.`
        );
        setModalOpen(true);
        setIsLoading(false);
        return;
      }

      // Sessão ativa: cadastro imediato (normalmente quando email confirmation está desativado)
      if (signUpData.user && signUpData.session) {
        setSuccessMessage('Cadastro realizado com sucesso! (Sessão ativa imediatamente)');
        setModalOpen(true);
        setIsLoading(false);
        return;
      }

      setFormError('[??] Ocorreu uma situação inesperada durante o cadastro. Tente novamente.');
      setIsLoading(false);

    } catch (e: any) {
      setFormError('[EXCEPTION] ' + (e?.message || String(e)));
      setIsLoading(false);
      console.error('[SignupPage] Exceção inesperada:', e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f8fb] flex flex-col">
      <div className="flex-1 w-full flex items-center justify-center">
        <div
          className="w-full max-w-[1280px] px-2 grid grid-cols-1 lg:grid-cols-[minmax(100px,350px)_1fr_350px] items-start gap-0"
          style={{ minHeight: 150, marginTop: 20 }}
        >
          <div className="flex flex-col justify-start items-center lg:items-end px-0 pt-2">
            <div className="max-w-[280px] text-center lg:text-right">
              <h2 className="text-5xl font-extrabold mb-3 text-[#1d3557]">Ótimo!</h2>
              <p className="text-xl font-medium text-[#1d3557] leading-relaxed">
                Preencha seus dados<br />
                e em minutos você já<br />
                poderá fazer sua<br />
                primeira assinatura.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center min-h-[700px] pt-4">
            <div className="w-full max-w-[500px] bg-white bg-opacity-95 rounded-xl shadow-xl px-6 py-8 z-10">
              <div className="flex mb-6 justify-center gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md font-bold border transition
                    ${userType === 'cliente'
                      ? 'bg-[#25c5b7] text-white border-[#25c5b7]'
                      : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-100'}`}
                  onClick={() => setUserType('cliente')}
                  disabled={isLoading}
                >
                  Você é um cliente
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md font-bold border transition
                    ${userType === 'empresa'
                      ? 'bg-[#25c5b7] text-white border-[#25c5b7]'
                      : 'bg-white border-gray-300 text-[#1d3557] hover:bg-gray-100'}`}
                  onClick={() => setUserType('empresa')}
                  disabled={isLoading}
                >
                  Você é uma empresa
                </button>
              </div>
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-center text-sm">
                  {formError}
                </div>
              )}
              {successMessage && !modalOpen && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-center text-sm">
                  {successMessage}
                </div>
              )}
              <div className="flex flex-col gap-3 mb-5">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 w-full font-medium hover:bg-gray-100 transition"
                  onClick={() => { saveUserDataToStorage(); handleSocialLogin('google'); }}
                  disabled={isLoading}
                >
                  <FcGoogle size={22} />
                  Continuar com Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 w-full font-medium hover:bg-gray-100 transition"
                  onClick={() => { saveUserDataToStorage(); handleSocialLogin('apple'); }}
                  disabled={isLoading}
                >
                  <FaApple size={22} className="text-black" />
                  Continuar com Apple
                </button>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <span className="flex-1 h-px bg-gray-200"></span>
                <span className="text-gray-400 text-sm font-semibold">ou cadastre-se com e-mail</span>
                <span className="flex-1 h-px bg-gray-200"></span>
              </div>
              <form className="flex flex-col gap-2" onSubmit={handleSubmit} autoComplete="off">
                {userType === 'cliente' ? (
                  <>
                    <input type="text" placeholder="NOME COMPLETO" value={nome} onChange={e => setNome(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" autoComplete="name" disabled={isLoading}/>
                    <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} onBlur={handleCpfBlur} maxLength={14} className={`rounded-md border px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 font-medium ${cpfError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-[#25c5b7]'}`} autoComplete="off" inputMode="numeric" disabled={isLoading}/>
                    {cpfError && (<span className="text-red-500 text-xs ml-1 mb-2">{cpfError}</span>)}
                    <input type="date" placeholder="dd/mm/aaaa" value={dataNasc} onChange={e => setDataNasc(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" style={{ color: "#1d3557" }} disabled={isLoading}/>
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="NOME DO RESPONSÁVEL" value={responsavel} onChange={e => setResponsavel(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" autoComplete="off" disabled={isLoading}/>
                    <input type="text" placeholder="NOME DA EMPRESA" value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" autoComplete="organization" disabled={isLoading}/>
                    <input type="text" placeholder="CNPJ" value={cnpj} onChange={handleCnpjChange} maxLength={18} className={`rounded-md border px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 font-medium ${cnpjError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-[#25c5b7]'}`} autoComplete="off" inputMode="numeric" disabled={isLoading}/>
                    {cnpjError && (<span className="text-red-500 text-xs ml-1 mb-2">{cnpjError}</span>)}
                    <input type="text" placeholder="TELEFONE" value={telefone} onChange={e => setTelefone(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" autoComplete="tel" disabled={isLoading}/>
                    <input type="url" placeholder="WEBSITE (opcional)" value={website} onChange={e => setWebsite(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium" autoComplete="url" disabled={isLoading}/>
                  </>
                )}
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium"
                  autoComplete="email"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="SENHA"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="CONFIRMAR SENHA"
                  value={senha2}
                  onChange={e => setSenha2(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#25c5b7] font-medium"
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {senhaError && (<span className="text-red-500 text-xs ml-1 mb-2">{senhaError}</span>)}

                <button type="submit" className="bg-[#1d3557] hover:bg-[#163152] text-white rounded-md py-2 mt-2 w-full font-bold transition text-sm" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "CRIAR MINHA CONTA"}
                </button>
              </form>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end justify-end min-h-[540px] pr-9 pt-1">
            <Image
              src="/illustrations/Group%203306.png"
              alt="Ilustração de cadastro"
              width={700}
              height={700}
              style={{
                objectFit: "contain",
                maxHeight: 1100,
                maxWidth: 1100,
                marginTop: 0,
                marginRight: -250,
              }}
              priority
            />
          </div>
        </div>
      </div>
      <SignupSuccessModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSuccessMessage('');
        }}
        message={successMessage}
      />
    </div>
  );
}
