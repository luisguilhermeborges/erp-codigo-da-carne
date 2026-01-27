import React, { useState, useMemo } from 'react';
import { Search, Package, ShoppingCart, Tag, Calendar, User } from 'lucide-react';

const PaginaRelatorios = ({ user }) => {
  const [pesquisa, setPesquisa] = useState('');
  
  const historico = useMemo(() => {
    return JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
  }, []);

  const dadosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return historico.filter(reg => {
      const matchCabecalho = 
        reg.id.toString().toLowerCase().includes(termo) ||
        reg.usuario.toLowerCase().includes(termo) ||
        reg.data.toLowerCase().includes(termo) ||
        (reg.tipo && reg.tipo.toLowerCase().includes(termo));

      const matchItens = reg.itens.some(i => 
        i.nome.toLowerCase().includes(termo) || 
        i.codigo.toLowerCase().includes(termo) ||
        (i.motivo && i.motivo.toLowerCase().includes(termo))
      );

      return matchCabecalho || matchItens;
    });
  }, [pesquisa, historico]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Relatórios de Gestão</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Histórico Geral de Movimentações</p>
      </header>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Pesquisar por Item, Motivo, Data, Tipo, ID ou Usuário..."
          className="flex-1 bg-transparent border-none focus:ring-0 font-black text-xs uppercase"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {dadosFiltrados.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center opacity-30">
            <Package size={48} className="mx-auto mb-4" />
            <p className="font-black uppercase text-xs">Nenhum registro encontrado</p>
          </div>
        ) : (
          dadosFiltrados.map((reg) => (
            <div key={reg.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className={`p-3 rounded-2xl ${reg.tipo === 'TRANSFERENCIA_AVULSA' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                    {reg.tipo === 'TRANSFERENCIA_AVULSA' ? <Tag size={20} /> : <ShoppingCart size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{reg.id}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${reg.tipo === 'TRANSFERENCIA_AVULSA' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {reg.tipo || 'PEDIDO LOJA'}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase">{reg.cliente}</h3>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <Calendar size={12} />
                    <p className="text-[10px] font-black uppercase">{reg.data}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-slate-600">
                    <User size={12} />
                    <p className="text-xs font-black uppercase">{reg.usuario}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reg.itens.map((prod, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase">{prod.nome}</p>
                      {prod.motivo && (
                        <span className="text-[8px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                          Motivo: {prod.motivo}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-blue-600">{prod.qtd}x</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaginaRelatorios;