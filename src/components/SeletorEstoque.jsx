import React from 'react';
import { MapPin } from 'lucide-react';

const SeletorEstoque = ({ estoqueAtivo, setEstoqueAtivo }) => (
  <div className="flex gap-3 mb-8 bg-white p-2 rounded-2xl border border-slate-100 w-fit shadow-sm">
    {['matriz', 'alphaville', 'gleba'].map(local => (
      <button 
        key={local} 
        onClick={() => setEstoqueAtivo(local)} 
        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
          estoqueAtivo === local ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
        }`}
      >
        <MapPin size={14} /> {local}
      </button>
    ))}
  </div>
);

export default SeletorEstoque;