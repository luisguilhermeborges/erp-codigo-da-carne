import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

const CartaoStatus = ({ titulo, total, cor }) => {
  // CONFIGURAÇÃO DINÂMICA: Define as cores baseadas na "prop" enviada pelo App.jsx.
  const estilos = {
    azul: "bg-blue-600 text-white shadow-blue-200",
    verde: "bg-emerald-500 text-white shadow-emerald-200",
    branco: "bg-white text-slate-800 border border-slate-100"
  };

  return (
    <div className={`${estilos[cor] || estilos.branco} p-10 rounded-[3rem] shadow-xl transition-transform hover:scale-[1.02] duration-300`}>
      <div className="flex justify-between items-start mb-8">
        {/* ÍCONE: Muda de acordo com a cor/contexto. */}
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
          {cor === 'verde' ? <CheckCircle2 size={24} /> : <Activity size={24} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Tempo Real</span>
      </div>
      
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">{titulo}</h3>
        <p className="text-5xl font-black tracking-tighter">{total}</p>
      </div>
    </div>
  );
};

export default CartaoStatus;