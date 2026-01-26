import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import CartaoStatus from './components/CartaoStatus';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [pedidos, setPedidos] = useState(() => {
    const salvo = localStorage.getItem('cdc_pedidos_v2');
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('cdc_pedidos_v2', JSON.stringify(pedidos));
  }, [pedidos]);

  const adicionarPedido = (novoPedido) => {
    const pedidoComId = { ...novoPedido, id: Date.now(), status: 'Aberto' };
    setPedidos([pedidoComId, ...pedidos]);
    setTelaAtiva('dashboard');
  };

  const atenderPedido = (id) => {
    setPedidos(pedidos.map(p => p.id === id ? { ...p, status: 'Atendido' } : p));
  };

  const totalAbertos = pedidos.filter(p => p.status === 'Aberto').length;
  const totalAtendidos = pedidos.filter(p => p.status === 'Atendido').length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <BarraLateral setTelaAtiva={setTelaAtiva} telaAtiva={telaAtiva} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {telaAtiva === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <BannerBoasVindas />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CartaoStatus titulo="Pedidos em Aberto" total={totalAbertos} cor="azul" />
              <CartaoStatus titulo="Pedidos Atendidos" total={totalAtendidos} cor="verde" />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Movimentação Recente</h3>
              {pedidos.length === 0 ? (
                <p className="text-slate-300 text-sm italic">Sem atividades hoje.</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {pedidos.slice(0, 5).map(p => (
                    <div key={p.id} className="py-5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${p.status === 'Aberto' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <p className="text-sm font-bold text-slate-700 uppercase">Pedido #{p.id.toString().slice(-4)}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${p.status === 'Aberto' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {telaAtiva === 'fazer-pedido' && <PaginaPedidos onSalvarPedido={adicionarPedido} />}
        {telaAtiva === 'atender-pedidos' && <PaginaAtendimento pedidos={pedidos} onAtender={atenderPedido} />}
      </main>
    </div>
  );
}

export default App;