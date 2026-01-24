import React from 'react';
import { LayoutDashboard, ShoppingCart, BarChart3, LogOut, Package } from 'lucide-react';

const Sidebar = ({ setView, activeView }) => (
  <aside className="w-72 bg-[#0a0b1e] text-slate-400 flex flex-col p-6 h-screen sticky top-0 shadow-2xl z-50">
    <div className="flex items-center gap-4 mb-14 px-2">
      <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-900/20"><Package size={24} /></div>
      <div>
        <h1 className="text-white font-black text-lg tracking-tighter leading-none uppercase">Código</h1>
        <h2 className="text-blue-500 font-bold text-xs tracking-[0.3em] uppercase">da Carne</h2>
      </div>
    </div>
    <nav className="flex-1 space-y-3">
      <button 
        onClick={() => setView('dashboard')}
        className={`flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-xs font-black uppercase tracking-widest transition-all ${activeView === 'dashboard' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'hover:bg-white/5 hover:text-white'}`}
      >
        <LayoutDashboard size={20}/> Dashboard
      </button>
      <button 
        onClick={() => setView('pedidos')}
        className={`flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-xs font-black uppercase tracking-widest transition-all ${activeView === 'pedidos' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'hover:bg-white/5 hover:text-white'}`}
      >
        <ShoppingCart size={20}/> Pedidos
      </button>
      <button className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-xs font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
        <BarChart3 size={20}/> Relatórios
      </button>
    </nav>
    <div className="pt-6 border-t border-white/5">
      <button className="flex items-center gap-4 px-5 py-4 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 w-full rounded-2xl transition-all">
        <LogOut size={20}/> Sair
      </button>
    </div>
  </aside>
);

export default Sidebar;