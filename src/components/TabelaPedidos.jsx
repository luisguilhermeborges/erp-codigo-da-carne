import React from 'react';
import { Trash2, Search, PackageOpen } from 'lucide-react';

const TabelaPedidos = ({ itens, nomeEstoque, aoExcluir, termoBusca, setTermoBusca }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
    {/* CABEÇALHO DA TABELA: Contém o filtro de busca. */}
    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">
          Estoque: <span className="text-blue-600">{nomeEstoque}</span>
        </h3>
      </div>
      
      {/* BUSCA INTERNA: Permite filtrar os itens da tabela rapidamente. */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Pesquisar na lista..."
          className="w-full bg-slate-50 pl-11 pr-4 py-3 rounded-2xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black">
          <tr>
            <th className="px-10 py-5">Produto / Corte</th>
            <th className="px-10 py-5">Peso Atual</th>
            <th className="px-10 py-5 text-center">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {itens.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-10 py-20 text-center">
                <PackageOpen className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Estoque vazio ou não encontrado</p>
              </td>
            </tr>
          ) : (
            itens.map(i => (
              <tr key={i.id} className="text-xs hover:bg-blue-50/30 transition-colors group">
                <td className="px-10 py-5 font-bold text-slate-700 uppercase">{i.nome}</td>
                <td className="px-10 py-5 text-slate-500 font-medium">{i.qtd} kg</td>
                <td className="px-10 py-5 text-center">
                  <button 
                    onClick={() => aoExcluir(i.id)} 
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Remover do inventário"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default TabelaPedidos;