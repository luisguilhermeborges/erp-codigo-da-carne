import React, { useState } from 'react';
import { Users, MapPin, ShieldCheck, Beef } from 'lucide-react';
import GestaoEstoque from './Gestao/GestaoEstoque';
import GestaoUsuarios from './Gestao/GestaoUsuarios';

const PaginaGestao = () => {
  const [abaAtiva, setAbaAtiva] = useState('estoque');

  const abas = [
    { id: 'estoque', rotulo: 'Estoque / Produtos', icone: Beef },
    { id: 'usuarios', rotulo: 'Usuários / Equipe', icone: Users },
    { id: 'filiais', rotulo: 'Filiais / Lojas', icone: MapPin },
    { id: 'permissoes', rotulo: 'Poder / Níveis', icone: ShieldCheck },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <header>
        <h2 className="text-3xl font-black uppercase italic text-slate-800">Módulo Gestão</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Controlo centralizado do sistema</p>
      </header>

      <div className="flex gap-4 border-b border-slate-100 pb-2">
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-[10px] font-black uppercase transition-all ${
              abaAtiva === aba.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400'
            }`}
          >
            <aba.icone size={16} />
            {aba.rotulo}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[500px]">
        {abaAtiva === 'estoque' && <GestaoEstoque />}
        {abaAtiva === 'usuarios' && <GestaoUsuarios />}
        {/* Adicionar GestaoFiliais e GestaoPermissoes conforme necessário */}
      </div>
    </div>
  );
};

export default PaginaGestao;