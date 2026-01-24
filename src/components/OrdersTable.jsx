import React from 'react';
import { Trash2, Search } from 'lucide-react';

const OrdersTable = ({ items, stockName, onDelete, searchTerm, setSearchTerm }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
        <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">
          Inventário: <span className="text-blue-600">{stockName}</span>
        </h3>
      </div>
      <div className="relative w-full md:w-72">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Filtrar estoque..."
          className="w-full bg-slate-50 pl-11 pr-4 py-3 rounded-2xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black">
          <tr>
            <th className="px-10 py-5">Produto</th>
            <th className="px-10 py-5">Qtd (kg)</th>
            <th className="px-10 py-5">Status</th>
            <th className="px-10 py-5 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map(i => (
            <tr key={i.id} className="text-xs hover:bg-blue-50/30 transition-colors">
              <td className="px-10 py-5 font-bold text-slate-700 uppercase">{i.name}</td>
              <td className="px-10 py-5 text-slate-500 font-medium">{i.qty}kg</td>
              <td className="px-10 py-5">
                <span className={`px-2 py-1 rounded-md font-black uppercase text-[9px] ${
                  i.status === 'Baixo Estoque' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  {i.status}
                </span>
              </td>
              <td className="px-10 py-5 text-center">
                <button onClick={() => onDelete(i.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
export default OrdersTable;