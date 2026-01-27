import React, { useState, useEffect } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { 
  CheckCircle, 
  Package, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Trash2, 
  XCircle,
  ArrowRight
} from 'lucide-react';

const PaginaAtendimento = ({ user }) => {
  const [fila, setFila] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia] = useState([]);
  const [buscaExtra, setBuscaExtra] = useState('');

  // Carregar fila de pedidos
  useEffect(() => {
    const carregarFila = () => {
      const dados = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
      const filtrados = user.unidade === '000' || user.unidade === 'TODAS' 
        ? dados 
        : dados.filter(p => p.unidadeOrigem === user.unidade);
      setFila(filtrados);
    };

    carregarFila();
    const interval = setInterval(carregarFila, 5000);
    return () => clearInterval(interval);
  }, [user.unidade]);

  // Ao selecionar um pedido, preparamos a conferência
  useEffect(() => {
    if (pedidoSelecionado) {
      const itensIniciais = pedidoSelecionado.itens.map(item => ({
        ...item,
        qtdSolicitada: item.qtd, // Mantém o original para comparação
        qtdEnviada: item.qtd,
        atendido: true
      }));
      setItensConferencia(itensIniciais);
    }
  }, [pedidoSelecionado]);

  const atualizarQtdConferencia = (codigo, novaQtd) => {
    setItensConferencia(prev => prev.map(i => 
      i.codigo === codigo ? { ...i, qtdEnviada: Math.max(0, Number(novaQtd)) } : i
    ));
  };

  const alternarAtendimento = (codigo) => {
    setItensConferencia(prev => prev.map(i => 
      i.codigo === codigo ? { ...i, atendido: !i.atendido } : i
    ));
  };

  const adicionarItemExtra = (produto) => {
    const existe = itensConferencia.find(i => i.codigo === produto.codigo);
    if (existe) {
      alert("Este item já está na lista!");
      return;
    }
    setItensConferencia([...itensConferencia, { 
      ...produto, 
      qtdSolicitada: 0, 
      qtdEnviada: 1, 
      atendido: true,
      extra: true 
    }]);
    setBuscaExtra('');
  };

  const finalizarAtendimento = () => {
    const historico = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    
    // Filtramos apenas o que foi marcado como atendido
    const itensFinais = itensConferencia.filter(i => i.atendido);

    const registroFinal = {
      ...pedidoSelecionado,
      itens: itensFinais,
      status: 'Finalizado',
      dataAtendimento: new Date().toLocaleString(),
      atendidoPor: user.nome,
      unidadeConferência: user.unidade
    };

    localStorage.setItem('historico_pedidos', JSON.stringify([registroFinal, ...historico]));

    const novaFila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]')
      .filter(p => p.id !== pedidoSelecionado.id);
    
    localStorage.setItem('fila_pedidos', JSON.stringify(novaFila));
    setFila(novaFila);
    setPedidoSelecionado(null);
    alert("Pedido finalizado e registrado no histórico!");
  };

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      {/* LISTA LATERAL DE PEDIDOS PENDENTES */}
      <div className="w-80 space-y-4">
        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-4">Fila de Atendimento</h2>
        <div className="space-y-3">
          {fila.length === 0 ? (
            <div className="p-10 text-center opacity-20">
              <Package size={30} className="mx-auto mb-2" />
              <p className="text-[8px] font-black uppercase">Vazio</p>
            </div>
          ) : (
            fila.map(p => (
              <button 
                key={p.id} 
                onClick={() => setPedidoSelecionado(p)}
                className={`w-full p-6 rounded-[24px] border text-left transition-all ${
                  pedidoSelecionado?.id === p.id 
                  ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20 text-white' 
                  : 'bg-white border-slate-100 hover:border-blue-200'
                }`}
              >
                <p className={`text-[8px] font-black uppercase mb-1 ${pedidoSelecionado?.id === p.id ? 'text-blue-200' : 'text-slate-400'}`}>#{p.id}</p>
                <p className="text-xs font-black uppercase leading-tight">{p.cliente}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ÁREA DE CONFERÊNCIA DETALHADA */}
      <div className="flex-1">
        {pedidoSelecionado ? (
          <div className="space-y-6">
            <header className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-slate-800 tracking-tighter">Conferindo {pedidoSelecionado.id}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Origem: {pedidoSelecionado.unidadeOrigem} | Solicitante: {pedidoSelecionado.usuario}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPedidoSelecionado(null)} className="px-6 py-3 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase hover:bg-slate-200 transition-all">Cancelar</button>
                <button onClick={finalizarAtendimento} className="px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-2">
                  <CheckCircle size={14}/> Finalizar Carga
                </button>
              </div>
            </header>

            {/* ADICIONAR ITEM EXTRA */}
            <div className="relative">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <Search className="text-blue-500" size={18} />
                <input 
                  type="text" 
                  placeholder="ADICIONAR ITEM EXTRA AO PEDIDO..." 
                  className="w-full border-none focus:ring-0 text-xs font-black uppercase"
                  value={buscaExtra}
                  onChange={(e) => setBuscaExtra(e.target.value)}
                />
              </div>
              {buscaExtra.length > 1 && (
                <div className="absolute top-16 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-4 space-y-2 max-h-60 overflow-y-auto">
                  {categoriasProdutos.flatMap(c => c.itens)
                    .filter(p => p.nome.toLowerCase().includes(buscaExtra.toLowerCase()))
                    .map(p => (
                      <button key={p.codigo} onClick={() => adicionarItemExtra(p)} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl flex justify-between items-center transition-all">
                        <div>
                          <p className="text-[10px] font-black text-blue-600">{p.codigo}</p>
                          <p className="text-xs font-black text-slate-800 uppercase">{p.nome}</p>
                        </div>
                        <Plus size={16} />
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* TABELA DE ITENS EM CONFERÊNCIA */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                  <tr>
                    <th className="p-8">Status</th>
                    <th className="p-8">Produto</th>
                    <th className="p-8 text-center">Pedido</th>
                    <th className="p-8 text-center">Enviado</th>
                    <th className="p-8">Aviso / Alerta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {itensConferencia.map(item => {
                    const excesso = item.qtdEnviada > item.qtdSolicitada;
                    return (
                      <tr key={item.codigo} className={`${!item.atendido ? 'opacity-40 grayscale' : ''} transition-all`}>
                        <td className="p-8">
                          <button onClick={() => alternarAtendimento(item.codigo)}>
                            {item.atendido 
                              ? <CheckCircle className="text-green-500" size={24}/> 
                              : <XCircle className="text-slate-300" size={24}/>}
                          </button>
                        </td>
                        <td className="p-8">
                          <p className="text-sm font-black text-slate-800 uppercase leading-tight">{item.nome}</p>
                          <div className="flex gap-2 items-center">
                            <span className="text-[10px] font-bold text-blue-500">{item.codigo}</span>
                            {item.extra && <span className="text-[8px] font-black bg-purple-100 text-purple-600 px-2 py-0.5 rounded uppercase">Item Extra</span>}
                          </div>
                        </td>
                        <td className="p-8 text-center font-black text-xs text-slate-400">
                          {item.qtdSolicitada} {item.unidade}
                        </td>
                        <td className="p-8">
                          <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto border border-slate-200">
                            <button onClick={() => atualizarQtdConferencia(item.codigo, item.qtdEnviada - 1)} className="p-2 hover:text-blue-600"><Minus size={14}/></button>
                            <input 
                              type="number" 
                              className="w-12 text-center bg-transparent font-black text-xs border-none focus:ring-0 p-0"
                              value={item.qtdEnviada}
                              onChange={(e) => atualizarQtdConferencia(item.codigo, e.target.value)}
                            />
                            <button onClick={() => atualizarQtdConferencia(item.codigo, item.qtdEnviada + 1)} className="p-2 hover:text-blue-600"><Plus size={14}/></button>
                          </div>
                        </td>
                        <td className="p-8">
                          {excesso && item.qtdSolicitada > 0 && (
                            <div className="flex items-center gap-2 text-orange-500 bg-orange-50 p-3 rounded-xl border border-orange-100 animate-pulse">
                              <AlertTriangle size={16} />
                              <span className="text-[9px] font-black uppercase">Enviando mais que o solicitado</span>
                            </div>
                          )}
                          {!item.atendido && (
                            <span className="text-[9px] font-black text-red-400 uppercase">Item não será enviado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 p-20 text-center opacity-40">
            <Package size={60} className="text-slate-300 mb-6" />
            <h3 className="text-lg font-black uppercase italic text-slate-400">Selecione um pedido na fila</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Para iniciar o processo de conferência de carga</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAtendimento;