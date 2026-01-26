import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const FormularioEstoque = ({ estoqueAtivo, aoAdicionar }) => {
  const [produto, setProduto] = useState('');
  const [qtd, setQtd] = useState('');

  const manipularSubmissao = (e) => {
    e.preventDefault();
    if(!produto || !qtd || qtd <= 0) return;
    aoAdicionar({ nome: produto, qtd: parseFloat(qtd).toFixed(2), unidade: estoqueAtivo });
    setProduto(''); 
    setQtd('');
  };

  return (
    <form onSubmit={manipularSubmissao} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Corte</label>
        <input 
          type="text" 
          className="bg-slate-50 p-4 rounded-2xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          value={produto} 
          onChange={e => setProduto(e.target.value)} 
          required 
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso Entrada (kg)</label>
        <input 
          type="number" 
          step="0.01" 
          className="bg-slate-50 p-4 rounded-2xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          value={qtd} 
          onChange={e => setQtd(e.target.value)} 
          required 
        />
      </div>
      <div className="flex items-end">
        <button type="submit" className="w-full bg-blue-600 text-white font-black h-[52px] rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95">
          <PlusCircle size={18}/> Registrar Entrada
        </button>
      </div>
    </form>
  );
};

export default FormularioEstoque;