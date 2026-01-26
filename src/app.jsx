import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WelcomeBanner from './components/WelcomeBanner';
import StatusCard from './components/StatusCard';
import OrdersPage from './pages/OrdersPage';
// Nota: Crie um componente simples para a tabela de pedidos ou use o OrdersTable adaptado

function App() {
  const [view, setView] = useState('dashboard');
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cdc_orders_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cdc_orders_v1', JSON.stringify(orders));
  }, [orders]);

  const openOrders = orders.filter(o => o.status === 'Aberto');
  const fulfilledOrders = orders.filter(o => o.status === 'Atendido');

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar setView={setView} activeView={view} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <WelcomeBanner />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StatusCard title="Pedidos em Aberto" count={openOrders.length} color="blue" />
              <StatusCard title="Pedidos Atendidos" count={fulfilledOrders.length} color="green" />
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Monitor de Pedidos</h2>
              {/* Tabela de Pedidos em Aberto */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
                <h3 className="text-xs font-black text-blue-600 uppercase mb-4">Aguardando Atendimento</h3>
                {openOrders.length === 0 ? <p className="text-slate-400 text-sm">Nenhum pedido aberto.</p> : (
                  <ul className="divide-y divide-slate-50">
                    {openOrders.map(order => (
                      <li key={order.id} className="py-4 text-sm text-slate-600">Pedido #{order.id.toString().slice(-4)} - {order.customer || 'Balcão'}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'fazer-pedido' && (
          <OrdersPage onSaveOrder={(newOrder) => setOrders([...orders, { ...newOrder, status: 'Aberto', id: Date.now() }])} />
        )}

        {view === 'atender-pedidos' && (
          <div className="max-w-7xl mx-auto">
             <h1 className="text-2xl font-black text-slate-800 mb-8 uppercase">Atender Pedidos</h1>
             {/* Lógica para listar pedidos e mudar status para 'Atendido' */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;