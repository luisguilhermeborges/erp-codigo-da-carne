import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';

const GestaoFiliais = () => {
  const [filiais, setFiliais] = useState(['000 - PRODUÇÃO', '001 - CENTRO', '002 - ALPHAVILLE', '003 - GLEBA']);

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase text-slate-800">Unidades de Negócio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filiais.map((un, idx) => (
          <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center font-black text-xs uppercase text-slate-700">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-500" />
              {un}
            </div>
            <button className="text-red-300 hover:text-red-500"><Trash2 size={16}/></button>
          </div>
        ))}
        <button className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase hover:bg-slate-50 transition-all">
          <Plus size={16}/> Adicionar Unidade
        </button>
      </div>
    </div>
  );
};

export default GestaoFiliais;