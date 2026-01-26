import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, PackageCheck, Calendar, Trash2 } from 'lucide-react';

const PaginaRelatorios = () => {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    setHistorico(dados);
  }, []);

  const limparHistorico = () => {
    if (window.confirm("Deseja apagar todos os registros de relatórios?")) {
      localStorage.removeItem('historico_pedidos');
      setHistorico([]);
    }
  };

  // Cálculos rápidos
  const totalFaturado = historico.reduce((acc, p) => acc + p.totalFinal, 0);
  const totalFaltas = historico.reduce((acc, p) => acc + p.itens.filter(i => i.status === 'FALTA').length, 0);
  const totalExcessos = historico.reduce((acc, p) => acc + p.itens.filter(i => i.status === 'EXCESSO').length, 0);

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Relatórios e Performance</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consolidado de saídas e conferências</p>
        </div>
        <button onClick={limparHistorico} className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition-colors">
          <Trash2 size={14}/> Limpar Registros
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Movimentado</p>
            <h3 className="text-2xl font-black text-slate-800">R$ {totalFaturado.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-2xl w-fit"><PackageCheck size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Pedidos Finalizados</p>
            <h3 className="text-2xl font-black text-slate-800">{historico.length}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl w-fit"><AlertCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Itens em Falta</p>
            <h3 className="text-2xl font-black text-slate-800">{totalFaltas}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl w-fit"><Calendar size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total de Excessos</p>
            <h3 className="text-2xl font-black text-slate-800">{totalExcessos}</h3>
          </div>
        </div>
      </div>

      {/* Tabela de Detalhes */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-700">Histórico de Movimentação</h4>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="px-8 py-5">ID / Data</th>
              <th className="px-8 py-5">Unidade</th>
              <th className="px-8 py-5">Status dos Itens</th>
              <th className="px-8 py-5 text-right">Valor Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {historico.length === 0 ? (
              <tr><td colSpan="4" className="p-20 text-center text-slate-300 font-black uppercase text-xs">Nenhum dado registrado</td></tr>
            ) : (
              historico.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-black text-blue-600 mb-1">#{p.id}</p>
                    <p className="text-xs font-bold text-slate-500">{p.dataAtendimento}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-800 uppercase">{p.cliente}</td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      {p.itens.some(i => i.status === 'FALTA') && <span className="text-[8px] font-black bg-red-100 text-red-600 px-2 py-1 rounded">COM FALTAS</span>}
                      {p.itens.some(i => i.status === 'EXCESSO') && <span className="text-[8px] font-black bg-orange-100 text-orange-600 px-2 py-1 rounded">COM EXCESSOS</span>}
                      {!p.itens.some(i => i.status !== 'OK') && <span className="text-[8px] font-black bg-green-100 text-green-600 px-2 py-1 rounded">100% OK</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-slate-800">R$ {p.totalFinal.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaginaRelatorios;