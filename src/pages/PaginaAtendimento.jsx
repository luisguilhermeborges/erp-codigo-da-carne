import React, { useState, useEffect } from 'react';
import { CheckCircle, Search, Package, XCircle } from 'lucide-react';

const PaginaAtendimento = ({ user }) => {
  const [fila, setFila] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia] = useState([]);

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
      setItensConferencia(pedidoSelecionado.itens.map(item => ({
        ...item,
        qtdSolicitada: Number(item.qtd),
        qtdEnviada: item.qtd, 
        atendido: true
      })));
    }
  }, [pedidoSelecionado]);

  const finalizarAtendimento = () => {
    if (!window.confirm("Confirmar a conferência desta carga?")) return;
    
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
    alert("✅ Atendimento finalizado! Pronto para exportação em Relatórios.");
  };

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      {/* Fila Lateral */}
      <div className="w-80 space-y-4">
        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Cargas na Fila</h2>
        <div className="space-y-3">
          {fila.map(p => (
            <button key={p.id} onClick={() => setPedidoSelecionado(p)} className={`w-full p-6 rounded-[28px] border text-left transition-all ${pedidoSelecionado?.id === p.id ? 'bg-blue-600 text-white shadow-xl border-blue-600' : 'bg-white hover:border-blue-200 shadow-sm'}`}>
              <p className="text-[8px] font-black uppercase opacity-60">#{p.id} • {p.data}</p>
              <p className="text-xs font-black uppercase leading-tight">{p.cliente}</p>
            </button>
          ))}
          {fila.length === 0 && <div className="p-10 text-center opacity-20 italic text-[10px] font-black uppercase">Fila Vazia</div>}
        </div>
      </div>

      {/* Área de Conferência */}
      <div className="flex-1">
        {pedidoSelecionado ? (
          <div className="space-y-6">
            <header className="bg-white p-8 rounded-[40px] border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <h2 className="text-2xl font-black italic uppercase text-slate-800 leading-none">Conferência de Saída</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{pedidoSelecionado.cliente}</p>
              </div>
              <button onClick={finalizarAtendimento} className="px-8 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Finalizar e Enviar</button>
            </header>

            <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                  <tr>
                    <th className="p-8">Status</th>
                    <th className="p-8">Produto</th>
                    <th className="p-8 text-center">Pedido</th>
                    <th className="p-8 text-center">Conferido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {itensConferencia.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-8">
                        <button onClick={() => setItensConferencia(itensConferencia.map((i, k) => k === idx ? {...i, atendido: !i.atendido} : i))}>
                          {item.atendido ? <CheckCircle className="text-green-500" size={24}/> : <XCircle className="text-slate-200" size={24}/>}
                        </button>
                      </td>
                      <td className="p-8">
                        <p className="font-black uppercase text-sm text-slate-800">{item.nome}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Cód: {item.codigo}</p>
                      </td>
                      <td className="p-8 text-center font-black text-xs text-slate-400">{item.qtd} {item.unidade}</td>
                      <td className="p-8">
                        <input 
                          type="number" 
                          className="w-24 text-center bg-slate-50 rounded-xl font-black text-xs p-3 text-blue-600 border-none shadow-inner focus:ring-2 focus:ring-blue-500" 
                          value={item.qtdEnviada} 
                          onChange={(e) => setItensConferencia(itensConferencia.map((i, k) => k === idx ? {...i, qtdEnviada: e.target.value} : i))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[60px] border-4 border-dashed opacity-30 p-20 text-center">
            <Package size={64} className="mb-6" />
            <p className="font-black uppercase text-xs tracking-[0.3em]">Selecione uma carga na fila lateral</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAtendimento;