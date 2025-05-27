'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SignupSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignupSuccessModal({ open, onClose }: SignupSuccessModalProps) {
  const router = useRouter();

  if (!open) return null;

  // Redireciona para a home ao clicar em "Entrar"
  const handleEntrar = () => {
    onClose(); // fecha o modal
    router.push('/'); // Redireciona para a home. Troque para '/login' se preferir
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-[#f4f8fb] rounded-3xl shadow-2xl max-w-xl w-[95vw] p-10 border border-[#e6e6e6] flex flex-col md:flex-row items-center relative">
        {/* Conteúdo à esquerda */}
        <div className="flex-2 flex flex-col justify-center">
          <h2 className="text-[#1d3557] text-4xl font-extrabold mb-3 leading-none">
            Cadastro realizado
            <br />
            com sucesso!
          </h2>
          <p className="text-[#1d3557] text-xl mb-6 font-medium">
            Navegue e conheça um
            <br />
            novo mundo de possibilidades.
          </p>
          <button
            className="bg-[#1d3557] text-white font-bold rounded-lg px-6 w-60 py-2 mt-0 text-lg shadow hover:bg-[#163152] transition"
            onClick={handleEntrar}
          >
            Entrar
          </button>
        </div>

        {/* Ilustração à direita */}
        <div className="ml-0 md:ml-8 mt-8 md:mt-0 flex-1 flex justify-center">
          <Image
            src="/illustrations/sucess_modal2_man.png"
            alt="Cadastro realizado"
            width={220}
            height={220}
            priority
            className="bg-transparent"
            style={{
              objectFit: 'contain',
              minWidth: 220,
              maxWidth: 240,
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
}
