import React from 'react';
import { CheckCircle, Clock, Package } from 'lucide-react';

const PaginaAtendimento = ({ pedidos, onAtender }) => {
  const pedidosAbertos = pedidos.filter(p => p.status === 'Aberto');

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Atender Pedidos</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Fila de produção ativa</p>
      </div>

      {pedidosAbertos.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 border border-dashed border-slate-200 text-center">
          <Package className="text-slate-300 mx-auto mb-6" size={48} />
          <h3 className="text-lg font-bold text-slate-400 uppercase">Nenhum pedido pendente</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {pedidosAbertos.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6 flex-1">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Pedido #{pedido.id.toString().slice(-4)}</h4>
                  <p className="text-xs text-slate-400 font-medium">{pedido.items.length} itens selecionados</p>
                </div>
              </div>
              <button 
                onClick={() => onAtender(pedido.id)}
                className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-3 shadow-lg shadow-green-100"
              >
                <CheckCircle size={16} /> Finalizar Atendimento
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginaAtendimento;