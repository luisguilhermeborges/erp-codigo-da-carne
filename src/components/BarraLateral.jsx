import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  MoveRight, 
  LogOut 
} from 'lucide-react';

const BarraLateral = ({ setTelaAtiva, telaAtiva, user, onLogout }) => {
  const menus = [
    { id: 'dashboard', rotulo: 'Painel', icone: LayoutDashboard, permissao: ['master', 'adm', 'comercial', 'estoque'] },
    { id: 'fazer-pedido', rotulo: 'Fazer Pedido', icone: ShoppingCart, permissao: ['master', 'adm', 'comercial'] },
    { id: 'atender-pedidos', rotulo: 'Atender Pedidos', icone: CheckSquare, permissao: ['master', 'adm', 'estoque'] },
    { id: 'transferencia-avulsa', rotulo: 'Transferência Avulsa', icone: MoveRight, permissao: ['master', 'adm', 'estoque', 'comercial'] },
    { id: 'relatorios', rotulo: 'Relatórios', icone: BarChart3, permissao: ['master', 'adm', 'comercial', 'estoque'] },
    { id: 'gestao', rotulo: 'Gestão', icone: Settings, permissao: ['master', 'adm'] },
  ];

  const menusPermitidos = menus.filter(m => m.permissao.includes(user.cargo));

  return (
    <aside className="w-80 bg-[#0a0b1e] text-white p-8 flex flex-col min-h-screen border-r border-white/5">
      <div className="mb-16">
        <h2 className="text-xl font-black italic text-blue-500 tracking-tighter uppercase">Código da Carne</h2>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
          {user.unidade === 'TODAS' ? 'Administração Geral' : `Unidade ${user.unidade}`}
        </p>
      </div>

      <nav className="flex-1 space-y-3">
        {menusPermitidos.map(item => (
          <button
            key={item.id}
            onClick={() => setTelaAtiva(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              telaAtiva === item.id ? 'bg-blue-600 shadow-xl text-white' : 'text-slate-500 hover:text-white'
            }`}
          >
            <item.icone size={18} />
            {item.rotulo}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="px-6">
          <p className="text-[10px] font-black text-slate-200 uppercase leading-none">{user.nome}</p>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{user.cargo}</p>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
};

export default BarraLateral;