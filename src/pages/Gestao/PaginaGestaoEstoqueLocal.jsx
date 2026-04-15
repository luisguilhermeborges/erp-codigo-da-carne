import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Package, Search, Filter, Calendar, Clock, AlertTriangle, 
  Trash2, RefreshCw, ChevronRight, ChevronLeft, 
  ArrowDownToLine, Tag, MapPin, Loader2
} from 'lucide-react';
import { api } from '../../services/api';

const fmt = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const PaginaGestaoEstoqueLocal = ({ user }) => {
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroUnidade, setFiltroUnidade] = useState('TODAS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filiais, setFiliais] = useState([]);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const fls = await api.filiais.buscar();
      setFiliais(fls);

      // Se for admin, carrega tudo? No backend fizemos por unidade.
      // Vou buscar da unidade do usuário logado se não for admin.
      // Mas para gestão administrativa, talvez queira ver todas.
      // Ajuste: Buscar da unidade selecionada ou de todas se for 'TODAS'
      
      const unidadeBusca = filtroUnidade === 'TODAS' ? 'TODAS' : filtroUnidade;
      
      // O backend GET /api/estoque/:unidade espera uma unidade.
      // Vou buscar todas se for admin/master.
      const data = await api.estoque.buscarPorUnidade(unidadeBusca);
      setEstoque(data);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setCarregando(false);
    }
  }, [filtroUnidade]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const excluirItem = async (id) => {
    if (!window.confirm("Deseja remover este lote do estoque?")) return;
    try {
      await api.estoque.apagar(id);
      setEstoque(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      alert("Erro ao excluir item.");
    }
  };

  const getStatusInfo = (validadeStr) => {
    if (!validadeStr) return { label: 'Sem Validade', color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const val = new Date(validadeStr + 'T12:00:00');
    const diffDias = Math.ceil((val - hoje) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return { label: 'Vencido', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <AlertTriangle size={12}/> };
    if (diffDias <= 3) return { label: `Vence em ${diffDias}d`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={12}/> };
    return { label: 'Ok', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: null };
  };

  const estoqueFiltrado = useMemo(() => {
    return estoque.filter(i => {
      const matchBusca = i.nome.toLowerCase().includes(pesquisa.toLowerCase()) || i.codigo.includes(pesquisa) || i.lote.includes(pesquisa);
      const status = getStatusInfo(i.dtValidade);
      const matchStatus = filtroStatus === 'TODOS' || 
                         (filtroStatus === 'VENCIDO' && status.label === 'Vencido') ||
                         (filtroStatus === 'ALERTA' && status.label.includes('Vence em'));
      return matchBusca && matchStatus;
    });
  }, [estoque, pesquisa, filtroStatus]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>
            Estoque Recebido
          </h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4}}>
            Gestão de Lotes, Validades e Preços de Etiqueta
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={carregarDados} className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">
            <RefreshCw size={18} className={carregando ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold uppercase mb-2 text-[var(--text-muted)]">Pesquisar Código, Nome ou Lote</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input 
                type="text" 
                value={pesquisa} 
                onChange={e => setPesquisa(e.target.value)}
                placeholder="Ex: Picanha, 022003, LOTE123..."
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-[10px] font-bold uppercase mb-2 text-[var(--text-muted)]">Unidade</label>
            <select 
              value={filtroUnidade} 
              onChange={e => setFiltroUnidade(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm font-bold outline-none cursor-pointer"
            >
              <option value="TODAS">TODAS AS UNIDADES</option>
              {filiais.map(f => (
                <option key={f._id} value={f.nome}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-[10px] font-bold uppercase mb-2 text-[var(--text-muted)]">Status Validade</label>
            <select 
              value={filtroStatus} 
              onChange={e => setFiltroStatus(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm font-bold outline-none cursor-pointer"
            >
              <option value="TODOS">TODOS</option>
              <option value="VENCIDO">VENCIDOS</option>
              <option value="ALERTA">EM ALERTA (3 DIAS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-elevated)] border-bottom border-[var(--border)]">
                <th colSpan="2" className="text-left px-6 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Item / Origem</th>
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Lote</th>
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Qtd Atual</th>
                <th className="text-right px-4 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">P. Etiqueta</th>
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Criação / Validade</th>
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Status</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase text-[var(--text-muted)]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {carregando ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <Loader2 className="animate-spin inline-block mr-2" size={24} />
                    <span className="font-bold text-[var(--text-muted)] uppercase text-xs">Carregando Estoque...</span>
                  </td>
                </tr>
              ) : estoqueFiltrado.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <Package className="inline-block mb-3 opacity-20" size={48} />
                    <p className="font-bold text-[var(--text-muted)] uppercase text-sm">Nenhum item encontrado no estoque.</p>
                  </td>
                </tr>
              ) : estoqueFiltrado.map(item => {
                const status = getStatusInfo(item.dtValidade);
                return (
                  <tr key={item._id} className="hover:bg-[var(--bg-elevated)] transition-colors group">
                    <td className="w-12 pl-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-[var(--border)]">
                        <Package size={20} className="text-[var(--accent)]" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-black uppercase text-[var(--text-primary)] leading-none mb-1">{item.nome}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[var(--accent)]">{item.codigo}</span>
                        <span className="text-[10px] font-medium text-[var(--text-muted)]">•</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          <MapPin size={10} />
                          {item.unidadeAlojamento}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                        {item.lote}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex flex-col">
                        <span className="text-sm font-black text-[var(--text-primary)]">
                          {item.qtdAtual.toFixed(item.unidadeMedida === 'KG' ? 3 : 0)}
                        </span>
                        <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase">{item.unidadeMedida}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-black text-[var(--text-primary)]">{fmt(item.precoEtiqueta)}</p>
                      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Custo Médio/Etiqueta</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-muted)]">
                          <ArrowDownToLine size={10} className="text-blue-500" />
                          {new Date(item.dtProducao + 'T12:00:00').toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-primary)]">
                          <Calendar size={10} className="text-red-500" />
                          {new Date(item.dtValidade + 'T12:00:00').toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span 
                        style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.color}30` }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight"
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => excluirItem(item._id)}
                        className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PaginaGestaoEstoqueLocal;
