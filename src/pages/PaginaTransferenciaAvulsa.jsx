import React, { useState } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { Search, Plus, Minus, Trash2, Send, AlertTriangle, ArrowRight } from 'lucide-react';

const PaginaTransferenciaAvulsa = ({ user }) => {
  const [busca, setBusca] = useState('');
  const [itensTransferencia, setItensTransferencia] = useState([]);
  
  const MOTIVOS = [
    'Sem etiqueta', 'Sem vácuo', 'Mal cheiro', 'Perto da validade', 
    'Solicitação para venda', 'Embalagem errada', 'Produto sem identificação', 'Sem preço'
  ];

  const adicionarItem = (produto) => {
    const existe = itensTransferencia.find(i => i.codigo === produto.codigo);
    if (existe) return;
    setItensTransferencia([...itensTransferencia, { ...produto, qtd: 1, motivo: 'Sem etiqueta' }]);
    setBusca('');
  };

  const atualizarItem = (codigo, campo, valor) => {
    setItensTransferencia(prev => prev.map(i => i.codigo === codigo ? { ...i, [campo]: valor } : i));
  };

  const finalizarTransferencia = () => {
    if (itensTransferencia.length === 0) return alert("Adicione itens para transferir.");

    const novaTransferencia = {
      id: `TR-${Math.floor(Math.random() * 9000) + 1000}`,
      cliente: `TRANSFERÊNCIA: ${user.unidade} > 000`,
      unidadeOrigem: user.unidade,
      destino: '000',
      usuario: user.nome,
      data: new Date().toLocaleString(),
      tipo: 'TRANSFERENCIA_AVULSA',
      status: 'Pendente',
      itens: itensTransferencia,
      total: 0 
    };

    const fila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
    localStorage.setItem('fila_pedidos', JSON.stringify([...fila, novaTransferencia]));

    alert(`✅ Transferência ${novaTransferencia.id} enviada para a Produção!`);
    setItensTransferencia([]);
  };

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <header>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">Transferência Avulsa / Retorno</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Unidade: {user.unidade} | Destino: 000 - PRODUÇÃO
          </p>
        </header>

        <div className="relative">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
            <Search className="text-slate-300" />
            <input 
              type="text" 
              placeholder="PESQUISAR ITEM PARA RETORNO..." 
              className="w-full border-none focus:ring-0 text-xs font-black uppercase"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          {busca.length > 1 && (
            <div className="absolute top-20 left-0 w-full bg-white border border-slate-100 rounded-[24px] shadow-2xl z-50 p-4 space-y-2 max-h-60 overflow-y-auto">
              {categoriasProdutos.flatMap(c => c.itens)
                .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.includes(busca.toUpperCase()))
                .map(p => (
                  <button key={p.codigo} onClick={() => adicionarItem(p)} className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl flex justify-between items-center group transition-all">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase">{p.codigo}</p>
                      <p className="text-sm font-black text-slate-800 uppercase">{p.nome}</p>
                    </div>
                    <Plus size={18} className="text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="p-8">Produto</th>
                <th className="p-8 text-center">Quantidade</th>
                <th className="p-8">Motivo do Retorno</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensTransferencia.map(item => (
                <tr key={item.codigo} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-8">
                    <p className="text-sm font-black text-slate-800 uppercase">{item.nome}</p>
                    <span className="text-[10px] font-bold text-blue-500">{item.codigo}</span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto border border-slate-200">
                      <button onClick={() => atualizarItem(item.codigo, 'qtd', Math.max(1, Number(item.qtd) - 1))} className="p-2 hover:text-blue-600 transition-colors">
                        <Minus size={14}/>
                      </button>
                      <input 
                        type="number" 
                        className="w-12 text-center bg-transparent font-black text-xs border-none focus:ring-0 p-0"
                        value={item.qtd}
                        onChange={(e) => atualizarItem(item.codigo, 'qtd', e.target.value)}
                      />
                      <button onClick={() => atualizarItem(item.codigo, 'qtd', Number(item.qtd) + 1)} className="p-2 hover:text-blue-600 transition-colors">
                        <Plus size={14}/>
                      </button>
                    </div>
                  </td>
                  <td className="p-8">
                    <select 
                      className="bg-orange-50 text-orange-700 p-3 rounded-xl font-black text-[10px] uppercase border-none focus:ring-2 focus:ring-orange-500 w-full"
                      value={item.motivo}
                      onChange={(e) => atualizarItem(item.codigo, 'motivo', e.target.value)}
                    >
                      {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => setItensTransferencia(itensTransferencia.filter(i => i.codigo !== item.codigo))} className="text-red-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {itensTransferencia.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-20 text-center space-y-2 opacity-20">
                    <AlertTriangle size={40} className="mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhum item selecionado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[420px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-orange-600 p-2.5 rounded-xl">
              <Send size={20} />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">Resumo Retorno</h2>
          </div>
          <button 
            onClick={finalizarTransferencia}
            disabled={itensTransferencia.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-orange-500/20 transition-all"
          >
            Enviar à Produção
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaTransferenciaAvulsa;