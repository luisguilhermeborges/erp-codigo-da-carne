import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, Send } from 'lucide-react';

const PaginaTransferenciaAvulsa = ({ user }) => {
  const [busca, setBusca] = useState('');
  const [itensTransferencia, setItensTransferencia] = useState([]);
  const [catalogoProdutos, setCatalogoProdutos] = useState([]);
  
  const MOTIVOS = [
    'Sem etiqueta', 'Sem vácuo', 'Mal cheiro', 'Perto da validade', 
    'Solicitação para venda', 'Embalagem errada', 'Produto sem identificação', 'Sem preço'
  ];

  // Carrega os produtos do LocalStorage
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('produtos_erp') || '[]');
    setCatalogoProdutos(dados);
  }, []);

  const adicionarItem = (produto) => {
    // REMOVIDO: A trava de "if (existe) return" para permitir duplicatas
    
    // REGRA: Cada entrada ganha um 'idUnico' para podermos editar linhas repetidas separadamente
    setItensTransferencia([...itensTransferencia, { 
      ...produto, 
      idUnico: `${produto.codigo}-${Date.now()}`, // Identificador único da linha
      qtd: 0, 
      motivo: 'Sem etiqueta' 
    }]);
    setBusca('');
  };

  const atualizarItem = (idUnico, campo, valor) => {
    const num = Number(valor);
    setItensTransferencia(prev => prev.map(i => 
      i.idUnico === idUnico ? { ...i, [campo]: Math.max(0, num) } : i
    ));
  };

  const finalizarTransferencia = () => {
    const itensValidos = itensTransferencia.filter(i => i.qtd > 0);
    if (itensValidos.length === 0) return alert("Insira as quantidades antes de enviar.");

    const novaTransferencia = {
      id: `TR-${Math.floor(Math.random() * 9000) + 1000}`,
      cliente: `TRANSFERÊNCIA: ${user.unidade} > 000`,
      unidadeOrigem: user.unidade,
      destino: '000',
      usuario: user.nome,
      data: new Date().toLocaleString(),
      tipo: 'TRANSFERENCIA_AVULSA',
      status: 'Pendente',
      itens: itensValidos,
      total: 0 
    };

    const fila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
    localStorage.setItem('fila_pedidos', JSON.stringify([...fila, novaTransferencia]));

    alert(`✅ Transferência enviada com sucesso!`);
    setItensTransferencia([]);
  };

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <header>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">Transferência Avulsa / Retorno</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Permitido adicionar múltiplos motivos para o mesmo item
          </p>
        </header>

        {/* Busca */}
        <div className="relative">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
            <Search className="text-slate-300" />
            <input 
              type="text" 
              placeholder="PESQUISAR ITEM PARA ADICIONAR..." 
              className="w-full border-none focus:ring-0 text-xs font-black uppercase"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          {busca.length > 1 && (
            <div className="absolute top-20 left-0 w-full bg-white border border-slate-100 rounded-[24px] shadow-2xl z-50 p-4 max-h-60 overflow-y-auto">
              {catalogoProdutos
                .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toString().includes(busca))
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

        {/* Tabela */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="p-8">Produto</th>
                <th className="p-8 text-center">Quantidade (0,000)</th>
                <th className="p-8">Motivo do Retorno</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {itensTransferencia.map((item) => (
                <tr key={item.idUnico} className="hover:bg-slate-50/50">
                  <td className="p-8">
                    <p className="text-sm font-black text-slate-800 uppercase">{item.nome}</p>
                    <span className="text-[10px] font-bold text-blue-500">{item.codigo}</span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-center bg-slate-100 rounded-xl p-1 w-fit mx-auto border border-slate-200">
                      <button onClick={() => atualizarItem(item.idUnico, 'qtd', item.qtd - 1)} className="p-2 hover:text-blue-600"><Minus size={14}/></button>
                      <input 
                        type="number" 
                        step="0.001"
                        className="w-24 text-center bg-transparent font-black text-xs border-none p-0 text-blue-600"
                        value={item.qtd}
                        onChange={(e) => atualizarItem(item.idUnico, 'qtd', e.target.value)}
                      />
                      <button onClick={() => atualizarItem(item.idUnico, 'qtd', item.qtd + 1)} className="p-2 hover:text-blue-600"><Plus size={14}/></button>
                    </div>
                  </td>
                  <td className="p-8">
                    <select 
                      className="bg-orange-50 text-orange-700 p-3 rounded-xl font-black text-[10px] uppercase border-none w-full"
                      value={item.motivo}
                      onChange={(e) => atualizarItem(item.idUnico, 'motivo', e.target.value)}
                    >
                      {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => setItensTransferencia(itensTransferencia.filter(i => i.idUnico !== item.idUnico))} className="text-red-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo */}
      <div className="w-[420px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl border border-white/5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-blue-400 italic">Resumo do Envio</h2>
          <div className="space-y-4 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {itensTransferencia.map(item => (
              <div key={item.idUnico} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase leading-tight">{item.nome}</p>
                  <p className="text-[8px] font-bold text-orange-400 uppercase">{item.motivo}</p>
                </div>
                <p className="text-xs font-black text-blue-400">
                  {item.qtd.toFixed(item.unidade === 'kg' ? 3 : 0)} {item.unidade}
                </p>
              </div>
            ))}
          </div>
          <button 
            onClick={finalizarTransferencia}
            disabled={itensTransferencia.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-500 py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] transition-all"
          >
            Enviar à Produção
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaTransferenciaAvulsa;