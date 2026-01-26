import React from 'react';

const WelcomeBanner = () => (
  <div className="bg-[#0a0b1e] rounded-[3rem] p-10 mb-10 flex justify-between items-center shadow-2xl border border-white/5 relative overflow-hidden">
    <div className="z-10">
      <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo, <span className="text-blue-500">Código da Carne</span></h1>
      <p className="text-slate-400 text-sm font-medium">Gestão de Inventário e Pedidos entre Unidades</p>
    </div>
    <div className="bg-blue-600/10 border border-blue-500/20 py-2 px-6 rounded-2xl z-10">
      <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Sistema Ativo</span>
    </div>
  </div>
);
export default WelcomeBanner;