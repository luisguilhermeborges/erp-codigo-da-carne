import React, { useState } from 'react';
import { PRODUCT_DATABASE } from '../data/produtos';
import { CheckCircle2, Search, Plus, Package, ArrowLeft, ScanBarcode } from 'lucide-react';

const PaginaAtendimento = ({ pedidos, onFinalizarAtendimento }) => {
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensEmAtendimento, setItensEmAtendimento] = useState([]);
  const [buscaExtra, setBuscaExtra] = useState('');

  // FUNÇÃO: Inicia a conferência de um pedido
  const iniciarAtendimento = (pedido) => {
    setPedidoSelecionado(pedido);
    // Criamos uma cópia dos itens com campo "atendido" zerado ou igual ao solicitado (opcional)
    const itens = pedido.items.map(i => ({ ...i, qtdSolicitada: i.qtdPedido, qtdAtendida: 0 }));
    setItensEmAtendimento(itens);
  };

  // FUNÇÃO: Atualiza a quantidade atendida (manual ou bipagem)
  const atualizarAtendido = (id, valor) => {
    setItensEmAtendimento(prev => prev.map(item => 
      item.id === id ? { ...item, qtdAtendida: parseFloat(valor) || 0 } : item
    ));
  };

  // FUNÇÃO: Adiciona item extra que não estava no pedido original
  const adicionarItemExtra = (produto) => {
    const existe = itensEmAtendimento.find(i => i.id === produto.id);
    if (existe) {
      alert("Item já está na lista. Apenas ajuste a quantidade.");
    } else {
      setItensEmAtendimento([...itensEmAtendimento, { ...produto, qtdSolicitada: 0, qtdAtendida: 1 }]);
    }
    setBuscaExtra('');
  };

  // LÓGICA DE BIPAGEM: Se o usuário digitar o código EAN/Código no campo de busca extra
  const aoBipar = (e) => {
    if (e.key === 'Enter') {
      const produto = PRODUCT_DATABASE.find(p => p.code === buscaExtra);
      if (produto) {
        adicionarItemExtra(produto);
      }
    }
  };

  if (!pedidoSelecionado) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-black uppercase italic">Fila de Atendimento</h1>
        <div className="grid gap-4">
          {pedidos.filter(p => p.status === 'Aberto').map(p => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase">Pedido {p.id}</span>
                <h4 className="font-bold text-slate-800">{p.items.length} itens • {p.horario}</h4>
              </div>
              <button onClick={() => iniciarAtendimento(p)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase">Atender</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <button onClick={() => setPedidoSelecionado(null)} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
        <ArrowLeft size={14}/> Voltar para lista
      </button>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Conferindo {pedidoSelecionado.id}</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bipe o EAN ou digite a quantidade real entregue</p>
        </div>
        <button 
          onClick={() => onFinalizarAtendimento(pedidoSelecionado.id, itensEmAtendimento)}
          className="bg-green-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] shadow-xl shadow-green-100"
        >
          Finalizar e Despachar
        </button>
      </div>

      {/* CAMPO DE BIPAGEM / ADIÇÃO EXTRA */}
      <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl text-white">
        <label className="text-[10px] font-black uppercase tracking-widest mb-4 block">Bipar EAN ou Adicionar Item Extra</label>
        <div className="relative">
          <ScanBarcode className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300" />
          <input 
            type="text"
            placeholder="Digite o código ou nome do produto..."
            className="w-full bg-white/10 border-2 border-white/20 p-5 pl-16 rounded-2xl outline-none focus:border-white transition-all text-white placeholder:text-white/40"
            value={buscaExtra}
            onChange={(e) => setBuscaExtra(e.target.value)}
            onKeyDown={aoBipar}
          />
        </div>
        {/* Sugestões de busca extra */}
        {buscaExtra.length > 2 && (
          <div className="mt-4 bg-white rounded-2xl p-2 space-y-1">
            {PRODUCT_DATABASE.filter(p => p.name.toLowerCase().includes(buscaExtra.toLowerCase()) || p.code.includes(buscaExtra))
              .slice(0, 3).map(p => (
                <button key={p.id} onClick={() => adicionarItemExtra(p)} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-slate-800 text-xs font-bold uppercase flex justify-between">
                  {p.name} <span className="text-blue-600">Adicionar</span>
                </button>
            ))}
          </div>
        )}
      </div>

      {/* GRID DE CONFERÊNCIA (ESTILO FAZER PEDIDO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {itensEmAtendimento.map(item => (
          <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-black text-slate-800 uppercase leading-tight">{item.name}</h4>
              <span className="text-[10px] font-black text-slate-300">#{item.code}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Solicitado</p>
                <p className="text-xl font-black text-slate-800">{item.qtdSolicitada} <small className="text-[10px] uppercase">{item.unit}</small></p>
              </div>
              <div className={`p-4 rounded-2xl border-2 transition-all ${item.qtdAtendida >= item.qtdSolicitada ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Atendido</p>
                <input 
                  type="number"
                  className="w-full bg-transparent font-black text-xl outline-none text-slate-800"
                  value={item.qtdAtendida}
                  onChange={(e) => atualizarAtendido(item.id, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginaAtendimento;