import React from 'react';
import { LayoutDashboard, ShoppingCart, CheckSquare, LogOut } from 'lucide-react';

const BarraLateral = ({ setTelaAtiva, telaAtiva }) => {
  const menus = [
    { id: 'dashboard', rotulo: 'Painel Principal', icone: LayoutDashboard },
    { id: 'fazer-pedido', rotulo: 'Fazer Pedido', icone: ShoppingCart },
    { id: 'atender-pedidos', rotulo: 'Atender Pedidos', icone: CheckSquare },
  ];

  return (
    <aside className="w-80 bg-[#0a0b1e] text-white p-8 flex flex-col hidden lg:flex border-r border-white/5">
      <div className="mb-16">
        <h2 className="text-xl font-black tracking-tighter flex items-center gap-3 italic">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          CÓDIGO DA CARNE
        </h2>
      </div>

      <nav className="flex-1 space-y-3">
        {menus.map(item => (
          <button
            key={item.id}
            onClick={() => setTelaAtiva(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              telaAtiva === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <item.icone size={18} />
            {item.rotulo}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest">
        <LogOut size={18} /> Sair
      </button>
    </aside>
  );
};

export default BarraLateral;