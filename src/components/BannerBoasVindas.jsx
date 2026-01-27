import React from 'react';

const BannerBoasVindas = ({ tempo, unidade, nome }) => {
  const formatarTempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <header className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black italic text-slate-800 uppercase tracking-tighter">
          Olá, {nome || 'Equipe'}! 👋
        </h1>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">
          Unidade Logada: <span className="text-blue-600">{unidade === 'TODAS' ? 'GERAL' : `ID ${unidade}`}</span>
        </p>
      </div>
      
      <div className="bg-[#0a0b1e] p-6 rounded-[2rem] text-white border border-white/5 shadow-xl">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Tempo Ativo</p>
        <p className="text-2xl font-black italic text-blue-500">{formatarTempo(tempo)}</p>
      </div>
    </header>
  );
};

export default BannerBoasVindas;