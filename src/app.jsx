import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WelcomeBanner from './components/WelcomeBanner';
import StatusCard from './components/StatusCard';
import OrdersPage from './pages/OrdersPage';
import FulfillOrdersPage from './pages/FulfillOrdersPage';

function App() {
  const [view, setView] = useState('dashboard');
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cdc_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cdc_orders_v2', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newOrder) => {
    const orderWithId = { ...newOrder, id: Date.now(), status: 'Aberto' };
    setOrders([orderWithId, ...orders]);
    setView('dashboard');
  };

  const fulfillOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Atendido' } : o));
  };

  const openCount = orders.filter(o => o.status === 'Aberto').length;
  const fulfilledCount = orders.filter(o => o.status === 'Atendido').length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar setView={setView} activeView={view} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <WelcomeBanner />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StatusCard title="Pedidos em Aberto" count={openCount} color="blue" />
              <StatusCard title="Pedidos Atendidos" count={fulfilledCount} color="green" />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Atividades Recentes</h3>
              {orders.length === 0 ? (
                <p className="text-slate-300 text-sm italic">Nenhuma atividade registrada hoje.</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="py-5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'Aberto' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Pedido #{order.id.toString().slice(-4)}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${order.status === 'Aberto' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'fazer-pedido' && <OrdersPage onSaveOrder={addOrder} />}
        {view === 'atender-pedidos' && <FulfillOrdersPage orders={orders} onFulfill={fulfillOrder} />}
      </main>
    </div>
  );
}

export default App;