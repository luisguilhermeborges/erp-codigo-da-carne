import React, { useState, useEffect, useRef } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { Barcode, Search, Plus, Minus, PackageCheck, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaginaAtendimento = () => {
  const [pedidosFila, setPedidosFila] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferindo, setItensConferindo] = useState([]);
  const [codigoBipado, setCodigoBipado] = useState('');
  const [buscaExtra, setBuscaExtra] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const fila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
    setPedidosFila(fila);
  }, []);

  const iniciarAtendimento = (pedido) => {
    setPedidoSelecionado(pedido);
    setItensConferindo(pedido.itens.map(i => ({ ...i, qtdSolicitada: i.qtd, qtdConferida: 0 })));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const atualizarQtd = (codigo, valor) => {
    const n = Math.max(0, Number(valor));
    setItensConferindo(prev => prev.map(i => i.codigo === codigo ? {...i, qtdConferida: n} : i));
  };

  const handleBipar = (e) => {
    if (e.key === 'Enter' && codigoBipado) {
      const codigo = codigoBipado.toUpperCase();
      const existe = itensConferindo.find(i => i.codigo === codigo);
      if (existe) {
        atualizarQtd(codigo, existe.qtdConferida + 1);
      } else {
        const prod = categoriasProdutos.flatMap(c => c.itens).find(p => p.codigo === codigo);
        if (prod) setItensConferindo([...itensConferindo, {...prod, qtdSolicitada: 0, qtdConferida: 1}]);
      }
      setCodigoBipado('');
    }
  };

  const finalizarAtendimento = () => {
    const excesso = itensConferindo.some(i => i.qtdConferida > i.qtdSolicitada);
    if (excesso && !window.confirm("⚠️ Você está enviando mais que o solicitado. Confirmar?")) return;

    // GERAR DADOS PARA O RELATÓRIO
    const resumoAtendimento = {
      id: pedidoSelecionado.id,
      dataAtendimento: new Date().toLocaleString(),
      cliente: pedidoSelecionado.cliente || "Unidade Externa",
      totalOriginal: pedidoSelecionado.total,
      totalFinal: itensConferindo.reduce((acc, i) => acc + (i.preco * i.qtdConferida), 0),
      itens: itensConferindo.map(i => ({
        nome: i.nome,
        codigo: i.codigo,
        solicitado: i.qtdSolicitada,
        enviado: i.qtdConferida,
        status: i.qtdConferida > i.qtdSolicitada ? 'EXCESSO' : (i.qtdConferida < i.qtdSolicitada ? 'FALTA' : 'OK')
      }))
    };

    // Salvar no Histórico (Cache de Relatórios)
    const historico = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    localStorage.setItem('historico_pedidos', JSON.stringify([resumoAtendimento, ...historico]));

    // Limpar Fila
    const novaFila = pedidosFila.filter(p => p.id !== pedidoSelecionado.id);
    localStorage.setItem('fila_pedidos', JSON.stringify(novaFila));
    
    alert("✅ Atendimento finalizado e enviado para os relatórios!");
    setPedidosFila(novaFila);
    setPedidoSelecionado(null);
  };

  if (!pedidoSelecionado) {
    return (
      <div className="space-y-6 animate-in">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Fila de Atendimento</h2>
        <div className="grid grid-cols-2 gap-4">
          {pedidosFila.length === 0 ? <p className="text-slate-400 font-bold uppercase text-xs">Nenhum pedido pendente...</p> : 
            pedidosFila.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex justify-between items-center hover:border-blue-500 transition-all shadow-sm">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase">Pedido #{p.id}</p>
                  <h3 className="font-black text-slate-800 uppercase">Solicitação de Unidade</h3>
                  <p className="text-xs text-slate-400 font-bold">{p.itens.length} itens aguardando conferência</p>
                </div>
                <button onClick={() => iniciarAtendimento(p)} className="bg-[#0a0b1e] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">Atender</button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8 animate-in">
      <div className="flex-1 space-y-6">
        <button onClick={() => setPedidoSelecionado(null)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase hover:text-slate-800 transition-colors">
          <ArrowLeft size={14}/> Voltar para Fila
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-8 rounded-[40px] border-2 border-blue-500 flex items-center gap-6 shadow-sm">
            <Barcode size={32} className="text-blue-600" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">Bipar Código</p>
              <input ref={inputRef} type="text" placeholder="AGUARDANDO LEITURA..." value={codigoBipado} onChange={e => setCodigoBipado(e.target.value)} onKeyDown={handleBipar} className="w-full border-none focus:ring-0 text-xl font-black uppercase outline-none bg-transparent" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center gap-6 shadow-sm">
            <Search size={32} className="text-slate-300" />
            <div className="flex-1 relative">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Pesquisar Extra</p>
              <input type="text" placeholder="ADICIONAR ITEM..." value={buscaExtra} onChange={e => setBuscaExtra(e.target.value)} className="w-full border-none focus:ring-0 text-sm font-black uppercase outline-none bg-transparent" />
              {buscaExtra && (
                <div className="absolute top-16 left-0 w-full bg-white border rounded-2xl shadow-xl z-50 p-2">
                  {categoriasProdutos.flatMap(c => c.itens).filter(p => p.nome.toLowerCase().includes(buscaExtra.toLowerCase())).slice(0, 5).map(p => (
                    <button key={p.codigo} onClick={() => { setItensConferindo([...itensConferindo, {...p, qtdSolicitada: 0, qtdConferida: 1}]); setBuscaExtra(''); }} className="w-full text-left p-3 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase">{p.nome}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr><th className="p-8">Produto</th><th className="p-8 text-center">Solicitado</th><th className="p-8 text-center">Conferido</th><th className="p-8 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensConferindo.map(item => (
                <tr key={item.codigo}>
                  <td className="p-8"><p className="text-sm font-black text-slate-800 uppercase leading-tight">{item.nome}</p><span className="text-[10px] font-bold text-blue-500">{item.codigo}</span></td>
                  <td className="p-8 text-center font-bold text-slate-400">{item.qtdSolicitada}</td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1">
                        <button onClick={() => atualizarQtd(item.codigo, item.qtdConferida - 1)} className="p-1 hover:text-blue-500 transition-colors"><Minus size={14}/></button>
                        <input type="number" value={item.qtdConferida} onChange={e => atualizarQtd(item.codigo, e.target.value)} className="w-10 text-center text-xs font-black bg-transparent border-none focus:ring-0" />
                        <button onClick={() => atualizarQtd(item.codigo, item.qtdConferida + 1)} className="p-1 hover:text-blue-500 transition-colors"><Plus size={14}/></button>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    {item.qtdConferida > item.qtdSolicitada ? <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-2 py-1 rounded">EXCESSO</span> : (item.qtdConferida < item.qtdSolicitada ? <span className="text-[9px] font-black bg-red-100 text-red-600 px-2 py-1 rounded">FALTA</span> : <span className="text-[9px] font-black bg-green-100 text-green-600 px-2 py-1 rounded">OK</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[400px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-10"><PackageCheck className="text-blue-500" /><h2 className="text-xs font-black uppercase tracking-widest">Resumo Saída</h2></div>
          <div className="space-y-6 max-h-[450px] overflow-y-auto mb-8 custom-scrollbar">
            {itensConferindo.map(item => (
              <div key={item.codigo} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider">{item.nome}</p>
                  <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1 w-fit">
                    <button onClick={() => atualizarQtd(item.codigo, item.qtdConferida - 1)} className="p-1 hover:text-blue-500 transition-colors"><Minus size={12}/></button>
                    <input type="number" value={item.qtdConferida} readOnly className="w-10 text-center text-[11px] font-black text-blue-400 bg-transparent border-none p-0" />
                    <button onClick={() => atualizarQtd(item.codigo, item.qtdConferida + 1)} className="p-1 hover:text-blue-500 transition-colors"><Plus size={12}/></button>
                  </div>
                </div>
                <button onClick={() => atualizarQtd(item.codigo, 0)} className="text-red-500/30 hover:text-red-500 ml-4"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
          <button onClick={finalizarAtendimento} className="w-full bg-blue-600 py-5 rounded-3xl font-black uppercase text-[11px] shadow-xl active:scale-95 transition-all">Finalizar e Despachar</button>
        </div>
      </div>
    </div>
  );
};

export default PaginaAtendimento;