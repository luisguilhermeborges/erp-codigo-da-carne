import React, { useState } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { Search, Plus, Minus, Trash2, Send, AlertTriangle, ArrowRight } from 'lucide-react';

const PaginaTransferenciaAvulsa = ({ user }) => {
  const [busca, setBusca] = useState('');
  const [itensTransferencia, setItensTransferencia] = useState([]);
  
  const MOTIVOS = ['Sem etiqueta', 'Sem vácuo', 'Mal cheiro', 'Perto da validade', 'Solicitação para venda', 'Embalagem errada', 'Produto sem identificação', 'Sem preço'];

  const adicionarItem = (produto) => {
    if (itensTransferencia.find(i => i.codigo === produto.codigo)) return;
    // Inicializa kg com 4,000 e un com 1
    setItensTransferencia([...itensTransferencia, { ...produto, qtd: produto.unidade === 'kg' ? 4.000 : 1, motivo: 'Sem etiqueta' }]);
    setBusca('');
  };

  const atualizarItem = (codigo, campo, valor) => {
    setItensTransferencia(prev => prev.map(i => i.codigo === codigo ? { ...i, [campo]: valor } : i));
  };

  const finalizarTransferencia = () => {
    if (itensTransferencia.length === 0) return alert("Adicione itens!");
    const novaTR = {
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
    localStorage.setItem('fila_pedidos', JSON.stringify([...fila, novaTR]));
    alert("Transferência enviada!");
    setItensTransferencia([]);
  };

  return (
    <div className="flex gap-8 animate-in fade-in">
      <div className="flex-1 space-y-6">
        <header><h2 className="text-2xl font-black uppercase italic">Transferência Avulsa / Retorno</h2></header>

        <div className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center gap-4 shadow-sm">
          <Search className="text-slate-300" />
          <input type="text" placeholder="PESQUISAR ITEM..." className="w-full border-none focus:ring-0 text-xs font-black uppercase" value={busca} onChange={(e) => setBusca(e.target.value)} />
          {busca.length > 1 && (
            <div className="absolute top-40 w-[600px] bg-white border rounded-2xl shadow-2xl z-50 p-4">
              {categoriasProdutos.flatMap(c => c.itens).filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())).map(p => (
                <button key={p.codigo} onClick={() => adicionarItem(p)} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl flex justify-between">
                  <span className="text-xs font-black uppercase">{p.nome}</span>
                  <Plus size={16}/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr><th className="p-8">Produto</th><th className="p-8 text-center">Quantidade</th><th className="p-8">Motivo</th><th className="p-8"></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensTransferencia.map(item => (
                <tr key={item.codigo}>
                  <td className="p-8"><p className="text-sm font-black uppercase">{item.nome}</p></td>
                  <td className="p-8">
                    <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto border border-slate-200">
                      <button onClick={() => atualizarItem(item.codigo, 'qtd', Number(item.qtd) - 1)} className="p-2"><Minus size={14}/></button>
                      <input 
                        type="number" 
                        step={item.unidade === 'kg' ? "1.000" : "1"}
                        className="w-20 text-center bg-transparent font-black text-xs border-none p-0"
                        value={item.qtd}
                        onChange={(e) => atualizarItem(item.codigo, 'qtd', e.target.value)}
                      />
                      <button onClick={() => atualizarItem(item.codigo, 'qtd', Number(item.qtd) + 1)} className="p-2"><Plus size={14}/></button>
                    </div>
                  </td>
                  <td className="p-8">
                    <select className="bg-orange-50 text-orange-700 p-3 rounded-xl font-black text-[10px] uppercase border-none w-full" value={item.motivo} onChange={(e) => atualizarItem(item.codigo, 'motivo', e.target.value)}>
                      {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-8"><button onClick={() => setItensTransferencia(itensTransferencia.filter(i => i.codigo !== item.codigo))}><Trash2 className="text-red-300" size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[420px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl">
          <h2 className="text-xs font-black uppercase tracking-widest mb-10">Resumo Retorno</h2>
          <div className="space-y-4 mb-10">
            {itensTransferencia.map(item => (
              <div key={item.codigo} className="flex justify-between items-center border-b border-white/5 pb-4 text-xs font-black uppercase">
                <span>{item.nome}</span>
                <span className="text-blue-400">{Number(item.qtd).toFixed(item.unidade === 'kg' ? 3 : 0)} {item.unidade}</span>
              </div>
            ))}
          </div>
          <button onClick={finalizarTransferencia} disabled={itensTransferencia.length === 0} className="w-full bg-orange-600 hover:bg-orange-500 py-6 rounded-[24px] font-black uppercase shadow-xl transition-all">Enviar à Produção</button>
        </div>
      </div>
    </div>
  );
};

export default PaginaTransferenciaAvulsa;