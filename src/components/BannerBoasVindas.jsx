import React from 'react';

const BannerBoasVindas = () => {
  // LÓGICA DE HORÁRIO: Poderia ser adicionada aqui uma saudação dinâmica (Bom dia/Boa tarde).
  return (
    <div className="bg-[#0a0b1e] p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
      {/* DECORAÇÃO: Elemento visual de fundo para dar profundidade ao design. */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
          Olá, <span className="text-blue-500">Equipe</span>
        </h1>
        <p className="text-blue-200/60 text-sm font-bold uppercase tracking-[0.4em] max-w-md leading-relaxed">
          Bem-vindo ao centro de controle operacional Código da Carne.
        </p>
      </div>
    </div>
  );
};

export default BannerBoasVindas;