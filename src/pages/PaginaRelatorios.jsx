import React from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const PaginaRelatorios = ({ pedidos }) => {
  const atendidos = pedidos.filter(p => p.status === 'Atendido');

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase italic">Relatórios de Saída</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Análise de itens solicitados vs itens entregues</p>
      </div>

      <div className="space-y-6">
        {atendidos.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
            <FileText className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-xs">Nenhum relatório disponível</p>
          </div>
        ) : (
          atendidos.map(p => (
            <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase">Pedido {p.id}</span>
                  <h3 className="font-bold text-slate-800">{p.data} às {p.horario}</h3>
                </div>
                <div className="bg-green-100 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Atendido
                </div>
              </div>
              
              <table className="w-full text-left">
                <thead className="text-[9px] font-black text-slate-400 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4">Produto</th>
                    <th className="px-8 py-4">Solicitado</th>
                    <th className="px-8 py-4">Entregue</th>
                    <th className="px-8 py-4">Diferença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {p.items.map(item => {
                    const diff = (item.qtdAtendida || 0) - (item.qtdSolicitada || 0);
                    return (
                      <tr key={item.id} className="text-xs font-bold text-slate-600">
                        <td className="px-8 py-4 uppercase">{item.name}</td>
                        <td className="px-8 py-4">{item.qtdSolicitada} {item.unit}</td>
                        <td className="px-8 py-4">{item.qtdAtendida} {item.unit}</td>
                        <td className={`px-8 py-4 ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-blue-500' : 'text-slate-300'}`}>
                          {diff === 0 ? 'Sem faltas' : `${diff > 0 ? '+' : ''}${diff.toFixed(2)} ${item.unit}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaginaRelatorios;