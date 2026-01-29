import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  XCircle, 
  Package 
} from 'lucide-react';

const PaginaAtendimento = ({ user }) => {
  const [fila, setFila] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia] = useState([]);
  const [catalogoProdutos, setCatalogoProdutos] = useState([]);
  const [buscaExtra, setBuscaExtra] = useState('');

  // Carrega o catálogo para permitir adicionar itens extras que não estavam no pedido
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('produtos_erp') || '[]');
    setCatalogoProdutos(dados);
  }, []);

  // Monitoriza a fila de pedidos
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

  // Prepara a conferência ao selecionar um pedido
  useEffect(() => {
    if (pedidoSelecionado) {
      setItensConferencia(pedidoSelecionado.itens.map(item => ({
        ...item,
        qtdSolicitada: Number(item.qtd),
        qtdEnviada: 0, // Inicia em zero para obrigar a conferência real
        atendido: true
      })));
    }
  }, [pedidoSelecionado]);

  const atualizarQtd = (codigo, nova) => {
    const valor = Number(nova);
    setItensConferencia(prev => prev.map(i => 
      i.codigo === codigo ? { ...i, qtdEnviada: Math.max(0, valor) } : i
    ));
  };

  const adicionarItemExtra = (produto) => {
    if (itensConferencia.find(i => i.codigo === produto.codigo)) return alert("Item já na lista!");
    setItensConferencia([...itensConferencia, { 
      ...produto, 
      qtdSolicitada: 0, 
      qtdEnviada: 0, 
      atendido: true,
      extra: true 
    }]);
    setBuscaExtra('');
  };

  const finalizarAtendimento = () => {
    const historico = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    const registroFinal = {
      ...pedidoSelecionado,
      itens: itensConferencia.filter(i => i.atendido),
      status: 'Finalizado',
      dataAtendimento: new Date().toLocaleString(),
      atendidoPor: user.nome
    };
    localStorage.setItem('historico_pedidos', JSON.stringify([registroFinal, ...historico]));
    
    const novaFila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]').filter(p => p.id !== pedidoSelecionado.id);
    localStorage.setItem('fila_pedidos', JSON.stringify(novaFila));
    
    setFila(novaFila);
    setPedidoSelecionado(null);
    alert("Atendimento finalizado com sucesso!");
  };

  return (
    <div className="flex gap-8 animate-in fade-in">
      {/* Fila de Pedidos */}
      <div className="w-80 space-y-4">
        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Pedidos Pendentes</h2>
        <div className="space-y-3">
          {fila.length === 0 ? (
            <div className="p-10 text-center opacity-20"><p className="text-[8px] font-black uppercase">Fila Vazia</p></div>
          ) : (
            fila.map(p => (
              <button key={p.id} onClick={() => setPedidoSelecionado(p)} className={`w-full p-6 rounded-[24px] border text-left transition-all ${pedidoSelecionado?.id === p.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white hover:border-blue-200'}`}>
                <p className="text-[8px] font-black uppercase opacity-60">#{p.id}</p>
                <p className="text-xs font-black uppercase leading-tight">{p.cliente}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de Conferência */}
      <div className="flex-1">
        {pedidoSelecionado ? (
          <div className="space-y-6">
            <header className="bg-white p-8 rounded-[32px] border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-slate-800">Conferência de Carga</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{pedidoSelecionado.cliente}</p>
              </div>
              <button onClick={finalizarAtendimento} className="px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase shadow-lg shadow-blue-500/20">Finalizar e Despachar</button>
            </header>

            {/* Adicionar Extra */}
            <div className="relative">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                <Search className="text-blue-500" size={18} />
                <input type="text" placeholder="ADICIONAR ITEM EXTRA À CARGA..." className="w-full border-none focus:ring-0 text-xs font-black uppercase" value={buscaExtra} onChange={(e) => setBuscaExtra(e.target.value)} />
              </div>
              {buscaExtra.length > 1 && (
                <div className="absolute top-16 left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-4 max-h-60 overflow-y-auto">
                  {catalogoProdutos.filter(p => p.nome.toLowerCase().includes(buscaExtra.toLowerCase())).map(p => (
                    <button key={p.codigo} onClick={() => adicionarItemExtra(p)} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl flex justify-between">
                      <span className="text-xs font-black uppercase">{p.nome}</span>
                      <Plus size={16}/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabela de Conferência */}
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                  <tr>
                    <th className="p-8">Status</th>
                    <th className="p-8">Produto</th>
                    <th className="p-8 text-center">Pedido</th>
                    <th className="p-8 text-center">Enviado (Peso/Qtd)</th>
                    <th className="p-8">Alertas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {itensConferencia.map(item => (
                    <tr key={item.codigo} className={!item.atendido ? 'opacity-40 grayscale' : ''}>
                      <td className="p-8">
                        <button onClick={() => setItensConferencia(itensConferencia.map(i => i.codigo === item.codigo ? {...i, atendido: !i.atendido} : i))}>
                          {item.atendido ? <CheckCircle className="text-green-500" size={24}/> : <XCircle className="text-slate-300" size={24}/>}
                        </button>
                      </td>
                      <td className="p-8">
                        <p className="font-black uppercase text-sm">{item.nome}</p>
                        {item.extra && <span className="text-[8px] font-black bg-purple-100 text-purple-600 px-2 py-0.5 rounded uppercase">Item Extra</span>}
                      </td>
                      <td className="p-8 text-center font-black text-xs text-slate-400">
                        {item.qtdSolicitada.toFixed(item.unidade === 'kg' ? 3 : 0)} {item.unidade}
                      </td>
                      <td className="p-8">
                        <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto border border-slate-200">
                          <button onClick={() => atualizarQtd(item.codigo, Number(item.qtdEnviada) - 1)} className="p-2 hover:text-blue-600"><Minus size={14}/></button>
                          <input 
                            type="number" 
                            step={item.unidade === 'kg' ? "1.000" : "1"}
                            className="w-24 text-center bg-transparent font-black text-xs border-none p-0 text-blue-600"
                            value={item.qtdEnviada}
                            onChange={(e) => atualizarQtd(item.codigo, e.target.value)}
                          />
                          <button onClick={() => atualizarQtd(item.codigo, Number(item.qtdEnviada) + 1)} className="p-2 hover:text-blue-600"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="p-8">
                        {item.qtdEnviada > item.qtdSolicitada && item.qtdSolicitada > 0 && (
                          <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase animate-pulse">
                            <AlertTriangle size={14}/> Excesso de Carga
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[40px] border-2 border-dashed opacity-40 p-20 text-center">
            <Package size={48} className="text-slate-300 mb-4" />
            <p className="font-black uppercase text-slate-400 text-xs tracking-widest">Selecione um pedido na fila lateral para iniciar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAtendimento;