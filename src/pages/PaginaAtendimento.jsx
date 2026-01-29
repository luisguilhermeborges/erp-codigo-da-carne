import React, { useState, useEffect } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { 
  CheckCircle, 
  Package, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  XCircle,
  ArrowRight
} from 'lucide-react';

const PaginaAtendimento = ({ user }) => {
  const [fila, setFila] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia] = useState([]);
  const [buscaExtra, setBuscaExtra] = useState('');

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

  useEffect(() => {
    if (pedidoSelecionado) {
      const itensIniciais = pedidoSelecionado.itens.map(item => ({
        ...item,
        qtdSolicitada: Number(item.qtd),
        qtdEnviada: Number(item.qtd),
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

  const adicionarItemExtra = (produto) => {
    if (itensConferencia.find(i => i.codigo === produto.codigo)) return alert("Item já na lista!");
    setItensConferencia([...itensConferencia, { 
      ...produto, 
      qtdSolicitada: 0, 
      qtdEnviada: produto.unidade === 'kg' ? 4.000 : 1, // Começa com 4,000 kg
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
    alert("Atendimento Finalizado!");
  };

  return (
    <div className="flex gap-8 animate-in fade-in">
      <div className="w-80 space-y-4">
        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Fila de Espera</h2>
        <div className="space-y-3">
          {fila.map(p => (
            <button key={p.id} onClick={() => setPedidoSelecionado(p)} className={`w-full p-6 rounded-[24px] border text-left transition-all ${pedidoSelecionado?.id === p.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-white'}`}>
              <p className="text-[8px] font-black uppercase opacity-60">#{p.id}</p>
              <p className="text-xs font-black uppercase">{p.cliente}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {pedidoSelecionado ? (
          <div className="space-y-6">
            <header className="bg-white p-8 rounded-[32px] border border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black italic uppercase">Conferindo {pedidoSelecionado.id}</h2>
              <button onClick={finalizarAtendimento} className="px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase shadow-lg">Finalizar Carga</button>
            </header>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <Search className="text-blue-500" size={18} />
              <input type="text" placeholder="ADICIONAR ITEM EXTRA..." className="w-full border-none focus:ring-0 text-xs font-black uppercase" value={buscaExtra} onChange={(e) => setBuscaExtra(e.target.value)} />
              {buscaExtra.length > 1 && (
                <div className="absolute top-60 left-auto w-[500px] bg-white border rounded-2xl shadow-2xl z-50 p-4">
                  {categoriasProdutos.flatMap(c => c.itens).filter(p => p.nome.toLowerCase().includes(buscaExtra.toLowerCase())).map(p => (
                    <button key={p.codigo} onClick={() => adicionarItemExtra(p)} className="w-full text-left p-4 hover:bg-blue-50 rounded-xl flex justify-between">
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
                  <tr><th className="p-8">Status</th><th className="p-8">Produto</th><th className="p-8 text-center">Pedido</th><th className="p-8 text-center">Enviado</th><th className="p-8">Alerta</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {itensConferencia.map(item => (
                    <tr key={item.codigo} className={!item.atendido ? 'opacity-40 grayscale' : ''}>
                      <td className="p-8">
                        <button onClick={() => setItensConferencia(itensConferencia.map(i => i.codigo === item.codigo ? {...i, atendido: !i.atendido} : i))}>
                          {item.atendido ? <CheckCircle className="text-green-500" size={24}/> : <XCircle className="text-slate-300" size={24}/>}
                        </button>
                      </td>
                      <td className="p-8"><p className="text-sm font-black uppercase">{item.nome}</p></td>
                      <td className="p-8 text-center font-black text-xs text-slate-400">
                        {Number(item.qtdSolicitada).toFixed(item.unidade === 'kg' ? 3 : 0)} {item.unidade}
                      </td>
                      <td className="p-8">
                        <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto">
                          <button onClick={() => atualizarQtdConferencia(item.codigo, Number(item.qtdEnviada) - 1)} className="p-2"><Minus size={14}/></button>
                          <input 
                            type="number" 
                            step={item.unidade === 'kg' ? "1.000" : "1"}
                            className="w-20 text-center bg-transparent font-black text-xs border-none p-0"
                            value={item.qtdEnviada}
                            onChange={(e) => atualizarQtdConferencia(item.codigo, e.target.value)}
                          />
                          <button onClick={() => atualizarQtdConferencia(item.codigo, Number(item.qtdEnviada) + 1)} className="p-2"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="p-8">
                        {item.qtdEnviada > item.qtdSolicitada && item.qtdSolicitada > 0 && (
                          <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase"><AlertTriangle size={14}/> Acima do Pedido</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-50 rounded-[40px] border-2 border-dashed opacity-40 p-20">
            <p className="font-black uppercase text-slate-400">Selecione um pedido na fila</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAtendimento;