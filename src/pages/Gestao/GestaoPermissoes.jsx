import React from 'react';
import { ShieldCheck } from 'lucide-react';

const GestaoPermissoes = () => {
  const niveis = [
    { cargo: 'Master', desc: 'Acesso total e configurações de sistema' },
    { cargo: 'Administrador', desc: 'Gestão operacional e relatórios' },
    { cargo: 'Adm Estoque', desc: 'Atendimento de pedidos e transferências' },
    { cargo: 'Comercial', desc: 'Solicitação de pedidos e transferências' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black uppercase text-slate-800">Níveis de Poder</h3>
      <div className="grid grid-cols-1 gap-4">
        {niveis.map((n) => (
          <div key={n.cargo} className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex justify-between items-center">
            <div>
              <p className="font-black text-xs uppercase text-slate-800 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-600" /> {n.cargo}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{n.desc}</p>
            </div>
            <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">Configurar Regras</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestaoPermissoes;