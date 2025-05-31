'use client';

import Link from 'next/link';

// Mock de dados para simular a home (troque por fetch depois)
const TEC_OFERTA = {
  titulo: 'iPhone 14 Pro Max 256gb',
  preco: 'R$ 39,90 | 12x',
  img: '/iphone-pro-max.png', // troque pelo caminho real depois
  selo: 'ANUAL',
  badge: '12 ENTREGAS',
};

const OFERTAS = [
  {
    titulo: 'Roupa de cama completa',
    preco: 'R$ 39,90 | 12x',
    img: '/roupa-cama.png',
    selo: 'ANUAL',
    badge: '12 ENTREGAS',
  },
  {
    titulo: 'Telefone celular Novo todo ano',
    preco: 'R$ 39,90 | 12x',
    img: '/celular.png',
    selo: 'ANUAL',
    badge: '12 ENTREGAS',
  },
  {
    titulo: 'Banho e tosa Mensal',
    preco: 'R$ 39,90 | 12x',
    img: '/banho-tosa.png',
    selo: 'ANUAL',
    badge: '12 ENTREGAS',
  },
  {
    titulo: 'Clássicos de Literatura',
    preco: 'R$ 39,90 | 12x',
    img: '/classicos.png',
    selo: 'ANUAL',
    badge: '12 ENTREGAS',
  },
  {
    titulo: 'Dia de princesa Cabelo e Maquiagem',
    preco: 'R$ 39,90 | 12x',
    img: '/princesa.png',
    selo: 'ANUAL',
    badge: '12 ENTREGAS',
  },
];

// Repita para mais blocos conforme sua necessidade

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f8fb] w-full pb-10">
      {/* BANNER HERO (carrossel fake por enquanto) */}
      <section className="w-full flex justify-center pt-8">
        <div className="relative w-full max-w-[1300px] h-[270px] rounded-2xl overflow-hidden flex bg-[#6840e2] shadow-xl">
          {/* Imagem e elementos do banner */}
          <div className="flex-1 flex items-center justify-between p-10">
            {/* Texto à esquerda */}
            <div className="flex flex-col justify-center h-full gap-4 z-10">
              <span className="text-lg font-bold text-white/80">SEGUNDA EU COMEÇO</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                ENCONTRE TUDO <br /> PRO SEU PRÓXIMO TREINO
              </h1>
              <div className="flex gap-2 mt-2">
                <span className="bg-[#3a2d9f] text-white font-bold rounded-xl px-4 py-2 text-base">ATÉ 60% OFF</span>
                <span className="bg-[#23d16b] text-white font-bold rounded-full px-4 py-2 text-base flex items-center gap-1">ENTREGA ⚡FULL</span>
              </div>
            </div>
            {/* Imagens à direita */}
            <div className="flex items-end gap-5">
              {/* Exemplo de imagens */}
              <img src="/chuteira.png" alt="Chuteira" className="w-32 drop-shadow-lg" />
              <img src="/badminton.png" alt="Badminton" className="w-16" />
              <img src="/luva-boxe.png" alt="Boxe" className="w-20" />
              <img src="/bike.png" alt="Bicicleta" className="w-28" />
            </div>
          </div>
          {/* Disclaimer */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/70">
            Entrega em até 48 horas válida para produtos FULL, em compras feitas até às 11h, de segunda-feira a sábado. Consulte as condições em www.mercadolivre.com.br/envios-full
          </div>
        </div>
      </section>

      {/* TEC-OFERTA DO DIA */}
      <section className="flex justify-center mt-12">
        <div className="w-full max-w-[1300px]">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tec-Oferta do Dia */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 max-w-[340px]">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Tec-Oferta do dia</h2>
              <div className="flex flex-col items-center">
                <img src={TEC_OFERTA.img} alt={TEC_OFERTA.titulo} className="w-48 mb-4" />
                <span className="font-semibold text-gray-900">{TEC_OFERTA.titulo}</span>
                <span className="font-bold text-[#6840e2] text-xl mt-1">{TEC_OFERTA.preco}</span>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#23d16b] text-white text-xs font-bold rounded px-2">{TEC_OFERTA.selo}</span>
                  <span className="bg-[#e3e3e3] text-[#6840e2] text-xs font-bold rounded px-2">{TEC_OFERTA.badge}</span>
                </div>
              </div>
            </div>
            {/* Ofertas do Dia */}
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Ofertas do dia</h2>
              <div className="flex gap-4 overflow-x-auto">
                {OFERTAS.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-md p-4 min-w-[180px] flex flex-col items-center">
                    <img src={item.img} alt={item.titulo} className="w-24 h-24 object-contain mb-2" />
                    <span className="text-sm font-semibold text-gray-800 text-center">{item.titulo}</span>
                    <span className="font-bold text-[#6840e2] mt-1">{item.preco}</span>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-[#23d16b] text-white text-xs font-bold rounded px-2">{item.selo}</span>
                      <span className="bg-[#e3e3e3] text-[#6840e2] text-xs font-bold rounded px-2">{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSINATURAS MAIS VENDIDAS + FILTROS */}
      <section className="flex justify-center mt-12">
        <div className="w-full max-w-[1300px]">
          <h2 className="text-2xl font-bold text-[#6840e2] mb-6 text-center">Confira as assinaturas mais vendidas!</h2>
          {/* Filtros */}
          <div className="flex justify-end gap-3 mb-4">
            {['BIMESTRAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'].map(filtro => (
              <button key={filtro} className="bg-white text-[#6840e2] font-semibold px-4 py-2 rounded-lg border border-[#e6e6e6] hover:bg-[#6840e2] hover:text-white transition">
                {filtro}
              </button>
            ))}
          </div>
          {/* Cards assinaturas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Mock: repita conforme o necessário */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
                <img src="/assinatura.png" alt={`Assinatura ${i}`} className="w-20 h-20 object-contain mb-2" />
                <span className="font-semibold text-gray-800 text-center">Nome da assinatura {i}</span>
                <span className="font-bold text-[#6840e2] mt-1">R$ 39,90 | 12x</span>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#23d16b] text-white text-xs font-bold rounded px-2">ANUAL</span>
                  <span className="bg-[#e3e3e3] text-[#6840e2] text-xs font-bold rounded px-2">12 ENTREGAS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

