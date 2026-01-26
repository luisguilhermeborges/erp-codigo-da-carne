import React from 'react';
import { LayoutDashboard, ShoppingCart, CheckSquare, LogOut } from 'lucide-react';

const Sidebar = ({ setView, activeView }) => {
  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fazer-pedido', label: 'Fazer Pedido', icon: ShoppingCart },
    { id: 'atender-pedidos', label: 'Atender Pedidos', icon: CheckSquare },
  ];

  return (
    <aside className="w-80 bg-[#0a0b1e] text-white p-8 flex flex-col hidden lg:flex border-r border-white/5">
      <div className="mb-16">
        <h2 className="text-xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          CÓDIGO DA CARNE
        </h2>
      </div>

      <nav className="flex-1 space-y-3">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              activeView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest">
        <LogOut size={18} /> Sair do Sistema
      </button>
    </aside>
  );
};

export default Sidebar;