import React from 'react';
import { CheckCircle, Clock, Package, ArrowRight } from 'lucide-react';

const FulfillOrdersPage = ({ orders, onFulfill }) => {
  const openOrders = orders.filter(o => o.status === 'Aberto');

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Atender Pedidos</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Fila de produção em tempo real</p>
      </div>

      {openOrders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 border border-dashed border-slate-200 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-400 uppercase">Nenhum pedido na fila</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {openOrders.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6 flex-1">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600">
                  <Clock size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Aberto</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase">#{order.id.toString().slice(-4)}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Pedido de {order.items.length} itens</h4>
                  <p className="text-xs text-slate-400 font-medium">{new Date(order.date).toLocaleTimeString()} - Unidade Alphaville</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex -space-x-3 overflow-hidden mr-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">
                      {item.orderQty}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => onFulfill(order.id)}
                  className="flex-1 md:flex-none bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle size={16} /> Finalizar Atendimento
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FulfillOrdersPage;