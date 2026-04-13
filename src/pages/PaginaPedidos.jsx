import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Trash2, ChevronDown, ChevronRight, CheckCircle, AlertCircle, X, Search, SlidersHorizontal, ArrowRight, Building2, Package, Briefcase, Plus, Minus } from 'lucide-react';
import { BANCO_PADRAO } from '../data/bancoPadrao';
import { api } from '../services/api';
import { getPrecos, getFiliais } from '../services/cache';

const NOME_PRIORIDADE = ['—', 'Baixa', 'Normal', 'Alta'];
const COR_PRIORIDADE = ['transparent', '#3b82f6', '#10b981', '#ef4444'];
const Prioridade = ({ valor, onChange }) => (
  <div className="flex gap-1 p-1 rounded-xl" style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)'}}>
    {[1,2,3].map(n => (
      <button key={n} onClick={() => onChange(n === valor ? 0 : n)}
        className="px-2 py-1 rounded-[10px] text-[9px] font-black uppercase transition-all"
        style={{ 
          backgroundColor: n === valor ? COR_PRIORIDADE[n] : 'transparent', 
          color: n === valor ? '#fff' : 'var(--text-muted)',
          boxShadow: n === valor ? `0 2px 8px ${COR_PRIORIDADE[n]}40` : 'none'
        }}>
        {NOME_PRIORIDADE[n]}
      </button>
    ))}
  </div>
);

// ── Linhas/Marcas reconhecidas ──────────────────────────────────────────────
const LINHAS = ['LA REINA', 'LA MAJESTAD', 'CODIGO SERIES', 'FSW', 'OUTRAS MARCAS', 'CDC', 'DIA A DIA'];
const LINHAS_ORDER = ['LA REINA', 'LA MAJESTAD', 'CODIGO SERIES', 'FSW', 'CDC', 'OUTRAS MARCAS', 'DIA A DIA'];

// Detecta a linha/marca de um produto a partir de suas tags
const detectarLinha = (tags = []) => {
  for (const l of LINHAS) {
    if (tags.some(t => t === l)) return l;
  }
  return 'OUTRAS MARCAS';
};

// Extrai o corte (nome do grupo) de um produto
// Para categoria BOVINO: tags[1] é o corte (PICANHA, ANCHO, CHORIZO…)
// Para outras categorias: usa a categoria ou tags[0]
const extrairCorte = (item) => {
  const tags = item.tags || [];
  const cat = item.categoria || '';
  // Se tiver corte explícito nas tags (tag[1] que não é linha)
  if (tags.length >= 2 && !LINHAS.includes(tags[1])) {
    return tags[1];
  }
  return cat;
};

// Unidade padrão por categoria
const unidadePorCategoria = (cat) => {
  const pesos = ['BOVINO','FRANGO','SUINO','LINGUICA','CORDEIRO','PESCADOS'];
  return pesos.some(c => cat?.toUpperCase().includes(c) || cat === c) ? 'KG' : 'UN';
};

// Categorias de uso/consumo para separar
const CATS_USO_CONSUMO = ['USO/CONSUMO','LIMPEZA','ESCRITORIO','DESCARTAVEL','EMBALAGEM'];

const PaginaPedidos = ({ user }) => {
  const [estoque, setEstoque]                     = useState([]);
  const [carrinho, setCarrinho]                   = useState([]);
  const [pesquisa, setPesquisa]                   = useState('');
  const [corteFiltro, setCorteFiltro]             = useState('TODOS');
  const [linhaFiltro, setLinhaFiltro]             = useState('TODAS');
  const [todasFiliais, setTodasFiliais]           = useState([]);
  const [filialOrigem, setFilialOrigem]           = useState('');
  const [filialDestino, setFilialDestino]         = useState('');
  const [cortesAbertos, setCortesAbertos]         = useState([]);
  const [aviso, setAviso]                         = useState({ show:false, titulo:'', msg:'', tipo:'sucesso' });
  const [enviando, setEnviando]                   = useState(false);
  const [alertaPrioridade, setAlertaPrioridade]   = useState(false);
  const [tipoPedido, setTipoPedido]               = useState('REVENDA');
  const [modalQtd, setModalQtd]                   = useState(null); // { corte, unidade }

  const cargo    = user?.cargo?.toLowerCase();
  const isMulti  = cargo === 'master' || cargo === 'adm';
  const ORIGEM_FIXA = 'Estoque / Produção';

  useEffect(() => {
    if (!user) return;
    const carregar = async () => {
      const filiais = await getFiliais();
      setTodasFiliais(filiais);
      setFilialOrigem(ORIGEM_FIXA);
      const destAuto = user.unidade || user.unidades?.[0] || '';
      if (destAuto) setFilialDestino(destAuto);

      const precos = await getPrecos();
      const lista = Object.entries(BANCO_PADRAO).map(([nome, v]) => {
        const cod = String(v.codigo ?? '').trim();
        return {
          id: cod, codigo: cod, nome, preco: precos[cod] ?? 0,
          unidade: v.unidade, categoria: v.categoria, tags: v.tags || [v.categoria],
          corte: extrairCorte({ tags: v.tags || [], categoria: v.categoria }),
          linha: detectarLinha(v.tags || []),
        };
      });
      setEstoque(lista);
    };
    carregar();
  }, [user]);

  useEffect(() => { setLinhaFiltro('TODAS'); }, [corteFiltro]);

  // ── Grupos de cortes disponíveis ──────────────────────────────────────────
  const isUsoConsumo = (item) =>
    CATS_USO_CONSUMO.includes(item.categoria?.toUpperCase()) ||
    (item.tags || []).some(t => CATS_USO_CONSUMO.includes(t?.toUpperCase()));

  const produtosFiltrados = useMemo(() => {
    return estoque.filter(p => {
      const pertenceAoTipo = tipoPedido === 'REVENDA' ? !isUsoConsumo(p) : isUsoConsumo(p);
      if (!pertenceAoTipo) return false;
      if (!p.preco || p.preco <= 0) return false; // só mostra com preço
      if (pesquisa && !p.nome.toLowerCase().includes(pesquisa.toLowerCase()) &&
          !p.corte.toLowerCase().includes(pesquisa.toLowerCase())) return false;
      if (corteFiltro !== 'TODOS' && p.corte !== corteFiltro) return false;
      if (linhaFiltro !== 'TODAS' && p.linha !== linhaFiltro) return false;
      return true;
    });
  }, [estoque, tipoPedido, pesquisa, corteFiltro, linhaFiltro]);

  // Cortes únicos disponíveis
  const cortesDisponiveis = useMemo(() => {
    const s = new Set(produtosFiltrados.map(p => p.corte));
    return [...s].sort();
  }, [produtosFiltrados]);

  // Linhas disponíveis para o corte selecionado
  const linhasDisponiveis = useMemo(() => {
    if (corteFiltro === 'TODOS') return [];
    const s = new Set(produtosFiltrados.filter(p => p.corte === corteFiltro).map(p => p.linha));
    return LINHAS_ORDER.filter(l => s.has(l));
  }, [corteFiltro, produtosFiltrados]);

  // Agrupado por corte → linha para exibição em accordion
  const porCorte = useMemo(() => {
    const acc = {};
    produtosFiltrados.forEach(p => {
      if (!acc[p.corte]) acc[p.corte] = {};
      if (!acc[p.corte][p.linha]) acc[p.corte][p.linha] = [];
      acc[p.corte][p.linha].push(p);
    });
    return acc;
  }, [produtosFiltrados]);

  const cortesExibidos = useMemo(() =>
    corteFiltro !== 'TODOS'
      ? cortesDisponiveis.filter(c => c === corteFiltro)
      : cortesDisponiveis
  , [corteFiltro, cortesDisponiveis]);

  const idsNoCarrinho = useMemo(() => new Set(carrinho.map(i => i.corteId || i.id)), [carrinho]);

  // Adicionar/remover corte do carrinho (item genérico)
  const toggleCorte = (corte, unidade) => {
    if (idsNoCarrinho.has(corte)) {
      setCarrinho(prev => prev.filter(i => (i.corteId || i.id) !== corte));
    } else {
      // Abre modal para definir quantidade
      setModalQtd({ corte, unidade });
    }
  };

  const confirmarQtd = (corte, unidade, qtd) => {
    if (!qtd || Number(qtd) <= 0) { setModalQtd(null); return; }
    setCarrinho(prev => [...prev, {
      id: `corte_${corte}_${Date.now()}`,
      corteId: corte,
      nome: corte,
      unidade,
      qtd: Number(qtd),
      prioridade: 0,
      isCorteGenerico: true,
    }]);
    setModalQtd(null);
  };

  const semPrioridade = carrinho.filter(i => !i.prioridade || i.prioridade === 0);
  const pedidoValido = filialOrigem && filialDestino && filialOrigem !== filialDestino && carrinho.length > 0;

  const finalizarPedido = async () => {
    if (!filialOrigem)  return setAviso({ show:true, titulo:'Atenção', msg:'Selecione a filial de origem.', tipo:'erro' });
    if (!filialDestino) return setAviso({ show:true, titulo:'Atenção', msg:'Selecione a filial destino.', tipo:'erro' });
    if (filialOrigem === filialDestino) return setAviso({ show:true, titulo:'Atenção', msg:'Origem e destino não podem ser iguais.', tipo:'erro' });
    if (carrinho.length === 0) return setAviso({ show:true, titulo:'Vazio', msg:'O carrinho está vazio.', tipo:'erro' });
    if (semPrioridade.length > 0) { setAlertaPrioridade(true); return; }

    setEnviando(true);
    try {
      await api.pedidos.criar({
        id:            Date.now(),
        filial:        filialDestino,
        cliente:       `PEDIDO: ${filialOrigem} → ${filialDestino}`,
        unidadeOrigem: filialOrigem,
        destino:       filialDestino,
        data:          new Date().toLocaleString(),
        tipo:          tipoPedido === 'USO_CONSUMO' ? 'PEDIDO_USO_CONSUMO' : 'PEDIDO_LOJA',
        status:        'Pendente',
        usuario:       user.nome,
        itens:         carrinho.map(i => ({ ...i, qtdSolicitada: i.qtd })),
      });
      setCarrinho([]);
      setAviso({ show:true, titulo:'Sucesso!', msg:`Pedido enviado: ${filialOrigem} → ${filialDestino}`, tipo:'sucesso' });
    } catch {
      setAviso({ show:true, titulo:'Erro', msg:'Falha ao enviar pedido. Tente novamente.', tipo:'erro' });
    } finally { setEnviando(false); }
  };

  const chip = (ativo, cor) => ({
    padding:'0.3rem 0.85rem', borderRadius:'999px', border:`1px solid ${ativo?(cor||'var(--accent)'):'var(--border)'}`,
    fontSize:'0.6rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em',
    cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s',
    backgroundColor: ativo ? (cor||'var(--accent)') : 'var(--bg-elevated)',
    color: ativo ? '#fff' : 'var(--text-secondary)',
    boxShadow: ativo ? '0 2px 12px var(--accent-glow)' : 'none',
  });

  return (
    <div className="flex flex-col xl:flex-row h-full gap-6 relative">

      {/* Modal aviso */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[40px] shadow-2xl w-full max-w-md p-10 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)'}}>
            {aviso.tipo==='erro' ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4"/> : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4"/>}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-center" style={{color:'var(--text-primary)'}}>{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold uppercase text-center" style={{color:'var(--text-secondary)'}}>{aviso.msg}</p>
            <button onClick={()=>setAviso({...aviso,show:false})} className="mt-8 w-full py-5 rounded-2xl font-black uppercase text-xs text-white" style={{backgroundColor:'var(--accent)'}}>OK</button>
          </div>
        </div>
      )}

      {/* Modal quantidade */}
      {modalQtd && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[40px] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)'}}>
            <Package size={48} className="mx-auto mb-4" style={{color:'var(--accent-bright)'}}/>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-center mb-1" style={{color:'var(--text-primary)'}}>{modalQtd.corte}</h3>
            <p className="text-[10px] font-bold uppercase text-center mb-6" style={{color:'var(--text-muted)'}}>Informe a quantidade solicitada ({modalQtd.unidade})</p>
            <QtdInput corte={modalQtd.corte} unidade={modalQtd.unidade} onConfirmar={confirmarQtd} onCancelar={()=>setModalQtd(null)}/>
          </div>
        </div>
      )}

      {/* Modal prioridade */}
      {alertaPrioridade && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[40px] shadow-2xl w-full max-w-md p-10 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)'}}>
            <AlertCircle size={64} className="mx-auto mb-4" style={{color:'#f59e0b'}}/>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-center" style={{color:'var(--text-primary)'}}>Classifique a Prioridade</h3>
            <p className="mt-2 text-xs font-bold uppercase text-center mb-6" style={{color:'var(--text-secondary)'}}>
              {semPrioridade.length} {semPrioridade.length===1?'item sem':'itens sem'} prioridade
            </p>
            <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
              {semPrioridade.map(i => (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-2xl" style={{backgroundColor:'var(--bg-elevated)'}}>
                  <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-primary)',flex:1,marginRight:'0.5rem',lineHeight:1.3}}>{i.nome}</span>
                  <Prioridade valor={i.prioridade||0} onChange={v=>setCarrinho(prev=>prev.map(c=>c.id===i.id?{...c,prioridade:v}:c))}/>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setAlertaPrioridade(false)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs" style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)'}}>Voltar</button>
              <button
                onClick={()=>{ if(semPrioridade.length===0){setAlertaPrioridade(false);finalizarPedido();} }}
                disabled={semPrioridade.length>0}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white"
                style={{backgroundColor:semPrioridade.length===0?'var(--accent)':'var(--bg-elevated)',color:semPrioridade.length===0?'#fff':'var(--text-muted)'}}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LISTA DE PRODUTOS ── */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>Realizar Pedido</h2>
          <div className="hidden lg:flex gap-4 text-[9px] font-bold uppercase" style={{color:'var(--text-muted)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#3b82f6'}}/> Baixa: Reposição/Estoque</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#10b981'}}/> Normal: Demanda Padrão</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#ef4444'}}/> Alta: Urgente/Falta</span>
          </div>
        </div>

        {/* Toggle Tipo Pedido */}
        <div className="flex bg-[var(--bg-elevated)] p-1.5 rounded-[20px] mb-4" style={{ border: '1px solid var(--border)' }}>
          <button onClick={() => { setTipoPedido('REVENDA'); setCorteFiltro('TODOS'); setLinhaFiltro('TODAS'); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all"
            style={{ backgroundColor: tipoPedido === 'REVENDA' ? 'var(--accent)' : 'transparent', color: tipoPedido === 'REVENDA' ? '#fff' : 'var(--text-muted)', boxShadow: tipoPedido === 'REVENDA' ? '0 4px 12px var(--accent-glow)' : 'none' }}>
            <Package size={16}/> Produtos (Revenda)
          </button>
          <button onClick={() => { setTipoPedido('USO_CONSUMO'); setCorteFiltro('TODOS'); setLinhaFiltro('TODAS'); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all"
            style={{ backgroundColor: tipoPedido === 'USO_CONSUMO' ? 'var(--accent)' : 'transparent', color: tipoPedido === 'USO_CONSUMO' ? '#fff' : 'var(--text-muted)', boxShadow: tipoPedido === 'USO_CONSUMO' ? '0 4px 12px var(--accent-glow)' : 'none' }}>
            <Briefcase size={16}/> Uso / Consumo
          </button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-3 p-4 rounded-[24px] border-2" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border-bright)'}}>
          <Search size={18} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <input className="flex-1 bg-transparent border-none outline-none font-bold text-xs uppercase"
            style={{color:'var(--text-primary)'}} placeholder="Buscar corte ou produto..."
            value={pesquisa} onChange={e=>setPesquisa(e.target.value)}/>
          {pesquisa && <button onClick={()=>setPesquisa('')} style={{color:'var(--text-muted)'}}><X size={16}/></button>}
        </div>

        {/* Filtros de corte */}
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center'}}>
          <button style={chip(corteFiltro==='TODOS')} onClick={()=>setCorteFiltro('TODOS')}>Todos</button>
          {cortesDisponiveis.map(c => (
            <button key={c} style={chip(corteFiltro===c)} onClick={()=>setCorteFiltro(corteFiltro===c?'TODOS':c)}>{c}</button>
          ))}
          {(pesquisa||corteFiltro!=='TODOS') && (
            <button onClick={()=>{setPesquisa('');setCorteFiltro('TODOS');setLinhaFiltro('TODAS');}}
              style={{...chip(false),borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.08)',color:'#ef4444',display:'flex',alignItems:'center',gap:'0.25rem'}}>
              <X size={10}/> Limpar
            </button>
          )}
        </div>

        {/* Filtros de linha (quando corte selecionado) */}
        {corteFiltro !== 'TODOS' && linhasDisponiveis.length > 0 && (
          <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center',paddingLeft:'0.75rem',borderLeft:'2px solid var(--accent)'}}>
            <button style={chip(linhaFiltro==='TODAS','#475569')} onClick={()=>setLinhaFiltro('TODAS')}>Todas as linhas</button>
            {linhasDisponiveis.map(l => (
              <button key={l} style={chip(linhaFiltro===l,'#475569')} onClick={()=>setLinhaFiltro(linhaFiltro===l?'TODAS':l)}>{l}</button>
            ))}
          </div>
        )}

        {carrinho.length > 0 && (
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase'}}>
            <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'var(--accent)'}}/>
            Corte adicionado — clique para remover
          </div>
        )}

        {/* Accordion de cortes */}
        <div className="space-y-3">
          {cortesExibidos.map(corte => {
            const linhasDoCorte = porCorte[corte] || {};
            const totalItens = Object.values(linhasDoCorte).reduce((a,b)=>a+b.length,0);
            const aberto = pesquisa.trim().length > 0 || cortesAbertos.includes(corte);
            const noCarrinho = idsNoCarrinho.has(corte);
            // Pegar unidade predominante
            const unidadeCorte = Object.values(linhasDoCorte).flat()[0]?.unidade || 'KG';

            return (
              <div key={corte} className="rounded-[28px] border overflow-hidden"
                style={{
                  backgroundColor: noCarrinho ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
                  borderColor: noCarrinho ? 'var(--accent)' : 'var(--border)',
                  boxShadow: noCarrinho ? '0 0 0 2px var(--accent)' : 'none',
                }}>
                {/* Cabeçalho do corte */}
                <div className="flex items-center gap-3 p-5">
                  {/* Botão expandir */}
                  <button onClick={()=>setCortesAbertos(prev=>prev.includes(corte)?prev.filter(c=>c!==corte):[...prev,corte])}
                    className="flex-1 flex items-center gap-3 text-left transition-all"
                    style={{color:'var(--text-primary)'}}>
                    <span className="text-sm font-black uppercase tracking-widest" style={{color: noCarrinho ? 'var(--accent-bright)' : 'var(--text-primary)'}}>{corte}</span>
                    <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{totalItens} itens · {unidadeCorte}</span>
                    {aberto ? <ChevronDown size={16} style={{marginLeft:'auto',flexShrink:0}}/> : <ChevronRight size={16} style={{marginLeft:'auto',flexShrink:0}}/>}
                  </button>

                  {/* Botão +/- corte */}
                  <button
                    onClick={() => toggleCorte(corte, unidadeCorte)}
                    className="flex-shrink-0 transition-all"
                    style={{
                      display:'flex',alignItems:'center',justifyContent:'center',
                      width:36,height:36,borderRadius:'0.75rem',
                      backgroundColor: noCarrinho ? 'var(--accent)' : 'var(--bg-elevated)',
                      border: noCarrinho ? 'none' : '1px solid var(--border)',
                      color: noCarrinho ? '#fff' : 'var(--text-muted)',
                    }}>
                    {noCarrinho
                      ? <CheckCircle size={16} color="#fff"/>
                      : <Plus size={16}/>
                    }
                  </button>
                </div>

                {/* Itens expandidos (apenas visualização das linhas disponíveis) */}
                {aberto && (
                  <div className="px-4 pb-4 space-y-2">
                    {Object.entries(linhasDoCorte).map(([linha, itens]) => (
                      <div key={linha} className="rounded-[18px] border p-3" style={{borderColor:'var(--border)',backgroundColor:'var(--bg-surface)'}}>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--accent-bright)'}}>{linha}</span>
                          <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 6px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{itens.length}</span>
                        </div>
                        <div className="space-y-1">
                          {itens.map(prod => (
                            <div key={prod.id} className="flex items-center gap-2">
                              <div style={{width:4,height:4,borderRadius:'50%',backgroundColor:'var(--text-muted)',flexShrink:0}}/>
                              <span style={{fontSize:'0.6rem',fontWeight:600,textTransform:'uppercase',color:'var(--text-secondary)',lineHeight:1.3}}>{prod.nome}</span>
                              <span style={{fontSize:'0.55rem',fontFamily:'monospace',color:'var(--text-muted)',marginLeft:'auto',flexShrink:0}}>{prod.unidade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {cortesExibidos.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <Search size={40} className="mx-auto mb-3" style={{color:'var(--text-muted)'}}/>
              <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Nenhum corte encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* ── CARRINHO ── */}
      <div className="w-full xl:w-[390px] rounded-[44px] shadow-2xl overflow-hidden xl:sticky top-0 xl:h-[calc(100vh-64px)] flex flex-col"
        style={{backgroundColor:'var(--bg-surface)',border:'1px solid var(--border)'}}>

        {/* Topo fixo */}
        <div className="p-5 space-y-3" style={{borderBottom:'1px solid var(--border)'}}>
          <div className="flex items-center gap-3">
            <ShoppingCart style={{color:'var(--accent-bright)'}} size={18}/>
            <h3 className="text-base font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>Carrinho</h3>
            {carrinho.length > 0 && (
              <span style={{marginLeft:'auto',fontSize:'0.6rem',fontWeight:800,padding:'2px 10px',borderRadius:'999px',backgroundColor:'var(--accent)',color:'#fff'}}>
                {carrinho.length} {carrinho.length===1?'item':'itens'}
              </span>
            )}
          </div>

          {/* Rota */}
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'0.4rem',alignItems:'center'}}>
            <div>
              <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3,display:'flex',alignItems:'center',gap:3}}>
                <Building2 size={9}/> Origem
              </p>
              <div className="p-2 rounded-xl text-[10px] font-black uppercase"
                style={{backgroundColor:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.3)',color:'#3b82f6'}}>
                📦 Estoque / Produção
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'center',paddingTop:16}}>
              <ArrowRight size={16} style={{color:'var(--accent-bright)'}}/>
            </div>
            <div>
              <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3,display:'flex',alignItems:'center',gap:3}}>
                <Building2 size={9}/> Destino
              </p>
              {isMulti ? (
                <select value={filialDestino} onChange={e=>setFilialDestino(e.target.value)}
                  className="w-full p-2 rounded-xl text-[10px] font-bold uppercase outline-none"
                  style={{backgroundColor:'var(--bg-elevated)',color:filialDestino?'var(--text-primary)':'var(--text-muted)',border:`1px solid ${filialDestino?'var(--accent)':'var(--border)'}`}}>
                  <option value="">Selecionar...</option>
                  {todasFiliais.map(f=><option key={f.id||f._id} value={f.nome}>{f.nome}</option>)}
                </select>
              ) : (
                <div className="p-2 rounded-xl text-[10px] font-black uppercase"
                  style={{backgroundColor:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.3)',color:'#10b981'}}>
                  🏪 {filialDestino || user?.unidade || user?.unidades?.[0] || '—'}
                </div>
              )}
            </div>
          </div>

          {semPrioridade.length > 0 && carrinho.length > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)'}}>
              <AlertCircle size={11} style={{color:'#f59e0b',flexShrink:0}}/>
              <p style={{fontSize:'0.6rem',fontWeight:700,color:'#d97706',textTransform:'uppercase'}}>
                {semPrioridade.length} {semPrioridade.length===1?'item':'itens'} sem prioridade
              </p>
            </div>
          )}

          <button onClick={finalizarPedido} disabled={enviando}
            className="w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
            style={{
              backgroundColor: pedidoValido ? 'var(--accent)' : 'var(--bg-elevated)',
              color: pedidoValido ? '#fff' : 'var(--text-muted)',
              boxShadow: pedidoValido ? '0 4px 20px var(--accent-glow)' : 'none',
              cursor: pedidoValido ? 'pointer' : 'default',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'
            }}>
            {enviando && <div style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>}
            {!filialOrigem || !filialDestino ? 'Selecione Destino' : carrinho.length === 0 ? 'Carrinho Vazio' : 'Confirmar Pedido'}
          </button>
        </div>

        {/* Itens do carrinho */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar">
          {carrinho.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl border" style={{backgroundColor:'var(--bg-elevated)',borderColor:item.prioridade?'var(--border)':'rgba(245,158,11,0.3)'}}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h5 className="text-[10px] font-black uppercase leading-tight" style={{color:'var(--text-primary)'}}>{item.nome}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Controle de quantidade */}
                    <button onClick={()=>setCarrinho(prev=>prev.map((c,i)=>i===idx?{...c,qtd:Math.max(0.5,Number(c.qtd||1)-1)}:c))}
                      style={{width:18,height:18,borderRadius:'0.3rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-surface)',color:'var(--text-muted)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer'}}>
                      <Minus size={10}/>
                    </button>
                    <span style={{fontSize:'0.75rem',fontWeight:800,color:'var(--accent-bright)',minWidth:30,textAlign:'center'}}>{item.qtd}</span>
                    <button onClick={()=>setCarrinho(prev=>prev.map((c,i)=>i===idx?{...c,qtd:Number(c.qtd||1)+1}:c))}
                      style={{width:18,height:18,borderRadius:'0.3rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-surface)',color:'var(--text-muted)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer'}}>
                      <Plus size={10}/>
                    </button>
                    <span style={{fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase'}}>{item.unidade}</span>
                  </div>
                </div>
                <button onClick={()=>setCarrinho(carrinho.filter((_,i)=>i!==idx))}
                  style={{color:'var(--text-muted)',flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  <Trash2 size={13}/>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase" style={{color:item.prioridade?'var(--text-muted)':'#f59e0b'}}>
                  {item.prioridade ? 'Prioridade:' : '⚠ Defina:'}
                </span>
                <Prioridade valor={item.prioridade||0} onChange={v=>setCarrinho(prev=>prev.map((c,i)=>i===idx?{...c,prioridade:v}:c))}/>
              </div>
            </div>
          ))}
          {carrinho.length === 0 && (
            <div className="py-12 text-center" style={{color:'var(--text-muted)'}}>
              <ShoppingCart size={28} className="mx-auto mb-3 opacity-20"/>
              <p className="text-[10px] font-black uppercase">Carrinho vazio</p>
              <p className="text-[9px] font-bold mt-2 opacity-60">Clique no + ao lado do corte para adicionar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Input de quantidade com teclado ─────────────────────────────────────────
const QtdInput = ({ corte, unidade, onConfirmar, onCancelar }) => {
  const [qtd, setQtd] = useState('');
  return (
    <div className="space-y-4">
      <input
        autoFocus
        type="number"
        min="0.5"
        step={unidade === 'KG' ? '0.5' : '1'}
        className="w-full text-center border-2 rounded-2xl py-4 font-black text-2xl outline-none bg-transparent"
        style={{borderColor:'var(--accent)',color:'var(--text-primary)'}}
        placeholder={unidade === 'KG' ? '0.0' : '0'}
        value={qtd}
        onChange={e=>setQtd(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter') onConfirmar(corte, unidade, qtd); }}
      />
      <div className="flex gap-3">
        <button onClick={onCancelar} className="flex-1 py-3 rounded-2xl font-black uppercase text-xs"
          style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)'}}>
          Cancelar
        </button>
        <button onClick={()=>onConfirmar(corte, unidade, qtd)} className="flex-1 py-3 rounded-2xl font-black uppercase text-xs text-white"
          style={{backgroundColor:'var(--accent)'}}>
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default PaginaPedidos;