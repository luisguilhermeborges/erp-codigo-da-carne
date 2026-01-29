import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Tag, 
  Calendar, 
  User, 
  Filter,
  X
} from 'lucide-react';

const PaginaRelatorios = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [historico, setHistorico] = useState([]);

  // Carrega o histórico do localStorage com segurança
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    setHistorico(dados);
  }, []);

  // Lógica de filtro avançada e "blindada" contra erros (Crash Fix)
  const dadosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();

    return historico.filter(reg => {
      if (!reg) return false;

      // 1. Filtro por Tipo de Operação
      const matchesTipo = filtroTipo === 'TODOS' || reg.tipo === filtroTipo;

      // 2. Filtro por Data (verifica se a data do registro contém o que foi digitado)
      const matchesData = !filtroData || (reg.data && reg.data.includes(filtroData));

      // 3. Pesquisa Geral (ID, Cliente, Usuário ou Itens)
      const matchTexto = 
        (reg.id?.toString().toLowerCase().includes(termo)) ||
        (reg.cliente?.toLowerCase().includes(termo)) ||
        (reg.usuario?.toLowerCase().includes(termo)) ||
        (reg.itens?.some(i => 
          i.nome?.toLowerCase().includes(termo) || 
          i.codigo?.toString().toLowerCase().includes(termo)
        ));

      return matchesTipo && matchesData && matchTexto;
    });
  }, [pesquisa, filtroData, filtroTipo, historico]);

  const limparFiltros = () => {
    setPesquisa('');
    setFiltroData('');
    setFiltroTipo('TODOS');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Relatórios</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Histórico de movimentações de estoque</p>
        </div>
        <button 
          onClick={limparFiltros}
          className="text-[9px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
        >
          Limpar Filtros
        </button>
      </header>

      {/* PAINEL DE FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        {/* Pesquisa Geral */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Pesquisa Geral</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Search size={16} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="ID, CLIENTE OU ITEM..."
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro por Data */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Filtrar por Data (Ex: 29/01)</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Calendar size={16} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="DD/MM/AAAA"
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro por Tipo */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Tipo de Movimento</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Filter size={16} className="text-slate-300" />
            <select 
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="TODOS">TODOS OS TIPOS</option>
              <option value="PEDIDO_LOJA">PEDIDO DE LOJA</option>
              <option value="TRANSFERENCIA_AVULSA">TRANSFERÊNCIA / RETORNO</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE RESULTADOS */}
      <div className="space-y-4">
        {dadosFiltrados.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center opacity-30 border-2 border-dashed">
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
                        {reg.tipo === 'TRANSFERENCIA_AVULSA' ? 'Transferência' : 'Pedido'}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase leading-none mt-1">{reg.cliente}</h3>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">{reg.data}</p>
                  <p className="text-xs font-black text-slate-600 uppercase italic">Por: {reg.usuario || reg.solicitante}</p>
                </div>
              </div>

              {/* Grid de Itens */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reg.itens?.map((prod, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase">{prod.nome}</p>
                      {prod.motivo && (
                        <span className="text-[8px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">
                          {prod.motivo}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-blue-600">
                      {/* Lógica de exibição de peso com segurança contra nulos */}
                      {(Number(prod.qtd) || 0).toFixed(prod.unidade === 'kg' ? 3 : 0)} {prod.unidade}
                    </span>
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