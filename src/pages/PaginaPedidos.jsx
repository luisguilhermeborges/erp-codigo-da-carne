import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Trash2, ChevronDown, ChevronRight, CheckCircle, AlertCircle, X, Search, ArrowRight, Building2, Package, Briefcase } from 'lucide-react';
import { BANCO_PADRAO } from '../data/bancoPadrao';
import { api } from '../services/api';
import { getPrecos, getFiliais } from '../services/cache';

// ── Prioridade 1-3 estrelas ────────────────────────────────────────────────────
const NOME_PRIORIDADE = ['—', 'Baixa', 'Normal', 'Alta'];
const COR_PRIORIDADE  = ['transparent', '#3b82f6', '#10b981', '#ef4444'];
const Prioridade = ({ valor, onChange }) => (
  <div className="flex gap-1 p-1 rounded-xl" style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)'}}>
    {[1,2,3].map(n => (
      <button key={n} onClick={() => onChange(n === valor ? 0 : n)}
        className="px-2 py-1 rounded-[10px] text-[9px] font-black uppercase transition-all"
        style={{
          backgroundColor: n === valor ? COR_PRIORIDADE[n] : 'transparent',
          color:           n === valor ? '#fff' : 'var(--text-muted)',
          boxShadow:       n === valor ? `0 2px 8px ${COR_PRIORIDADE[n]}40` : 'none',
        }}>
        {NOME_PRIORIDADE[n]}
      </button>
    ))}
  </div>
);

// ── Extrações de hierarquia ────────────────────────────────────────────────────
// Nomes comerciais que têm prioridade sobre o grupo anatômico em tags[1]
const CORTE_COMERCIAL = new Set(['ANCHO', 'CHORIZO', 'CHUCK EYE', 'TOMAHAWK', 'PRIME STEAK']);

// Linhas/marcas que NÃO são nomes de corte
const LINHAS_MARCAS = new Set([
  'LA REINA','LA MAJESTAD','CODIGO SERIES','FSW','FRIBOI','OUTRAS MARCAS',
  'CDC','WAGYU','GUIDARA','LD','NAT','COCAMAR','RICO','SPECIALLI','CANEIROSUL',
  'FRICASA','ALCATRA','RESERVA','PREMIUM','STEAK','PECA','PRETA','AZUL','RED',
  'TEMPERADO','TEMPERADA','DESOSSADA','RECHEADA','INTEIRO','FATIADO',
]);

// Palavras que indicam finalidade (buscadas em toda a lista de tags)
const FINALIDADE_MAP = [
  { key:'CHURRASCO',  match: ['CHURRASCO'] },
  { key:'DIA A DIA',  match: ['DIA A DIA'] },
  { key:'HAMBURGUER', match: ['HAMBURGUER','BURGUER'] },
  { key:'PETISCO',    match: ['PETISCO','TORRESMO'] },
  { key:'KIT',        match: ['KIT BURGUER','KIT'] },
];

const extrairFinalidade = (tags = []) => {
  for (const { key, match } of FINALIDADE_MAP) {
    if (match.some(m => tags.includes(m))) return key;
  }
  return 'GERAL';
};

const extrairCorte = (tags = []) => {
  // Prioridade 1: nome comercial explícito em qualquer posição
  for (const c of CORTE_COMERCIAL) {
    if (tags.includes(c)) return c;
  }
  // Prioridade 2: tags[1] se não for marca/linha
  if (tags[1] && !LINHAS_MARCAS.has(tags[1])) return tags[1];
  // Prioridade 3: próxima tag que não seja marca
  for (let i = 2; i < tags.length; i++) {
    if (!LINHAS_MARCAS.has(tags[i])) return tags[i];
  }
  return 'OUTROS';
};

// Categorias de uso/consumo
const CATS_USO_CONSUMO = new Set(['USO/CONSUMO','LIMPEZA','ESCRITORIO','DESCARTAVEL','EMBALAGEM']);

// Ordem de exibição
const ORDEM_CATS = ['BOVINO','FRANGO','SUINO','LINGUICA','CORDEIRO','PESCADOS',
  'QUEIJO','CERVEJA','BEBIDAS','ACOMPANHAMENTO','TORRESMO','SORVETE','ACESSORIOS','DEFUMACAO'];
const ORDEM_FIN  = ['CHURRASCO','DIA A DIA','HAMBURGUER','KIT','PETISCO','GERAL'];

// ── Componente principal ───────────────────────────────────────────────────────
const PaginaPedidos = ({ user }) => {
  const [estoque, setEstoque]             = useState([]);
  const [carrinho, setCarrinho]           = useState([]);
  const [pesquisa, setPesquisa]           = useState('');
  const [catFiltro, setCatFiltro]         = useState('TODAS');
  const [finFiltro, setFinFiltro]         = useState('TODAS');
  const [todasFiliais, setTodasFiliais]   = useState([]);
  const [filialOrigem, setFilialOrigem]   = useState('');
  const [filialDestino, setFilialDestino] = useState('');
  const [abertos, setAbertos]             = useState({});   // { "CAT|FIN|CORTE": bool }
  const [aviso, setAviso]                 = useState({ show:false, titulo:'', msg:'', tipo:'sucesso' });
  const [enviando, setEnviando]           = useState(false);
  const [alertaPrio, setAlertaPrio]       = useState(false);
  const [tipoPedido, setTipoPedido]       = useState('REVENDA');
  const [mostrarCarrinhoMobile, setMostrarCarrinhoMobile] = useState(false);
  const cargo   = user?.cargo?.toLowerCase();
  const isMulti = cargo === 'master' || cargo === 'adm';
  const ORIGEM_FIXA = 'Estoque / Produção';

  useEffect(() => {
    if (!user) return;
    (async () => {
      const filiais = await getFiliais();
      setTodasFiliais(filiais);
      setFilialOrigem(ORIGEM_FIXA);
      const destAuto = user.unidade || user.unidades?.[0] || '';
      if (destAuto) setFilialDestino(destAuto);

      const precos = await getPrecos();
      const lista = Object.entries(BANCO_PADRAO).map(([nome, v]) => {
        const cod  = String(v.codigo ?? '').trim();
        const tags = v.tags || [v.categoria];
        return {
          id:         cod,
          codigo:     cod,
          nome,
          preco:      precos[cod] ?? 0,
          unidade:    v.unidade,
          categoria:  v.categoria || tags[0] || 'OUTROS',
          tags,
          finalidade: extrairFinalidade(tags),
          corte:      extrairCorte(tags),
          eUsoConsumo: CATS_USO_CONSUMO.has((v.categoria||'').toUpperCase()),
        };
      }).filter(p => p.preco > 0);
      setEstoque(lista);
    })();
  }, [user]);

  // Reset filtro de finalidade quando muda de categoria
  useEffect(() => { setFinFiltro('TODAS'); }, [catFiltro]);

  // ── Produtos filtrados ─────────────────────────────────────────────────────
  const filtrados = useMemo(() => estoque.filter(p => {
    if (tipoPedido === 'REVENDA'     && p.eUsoConsumo) return false;
    if (tipoPedido === 'USO_CONSUMO' && !p.eUsoConsumo) return false;
    if (catFiltro !== 'TODAS' && p.categoria !== catFiltro) return false;
    if (finFiltro !== 'TODAS' && p.finalidade !== finFiltro) return false;
    if (pesquisa) {
      const q = pesquisa.toLowerCase();
      if (!p.nome.toLowerCase().includes(q) &&
          !p.corte.toLowerCase().includes(q) &&
          !p.finalidade.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [estoque, tipoPedido, catFiltro, finFiltro, pesquisa]);

  // ── Hierarquia CAT → FIN → CORTE → [produtos] ─────────────────────────────
  const hierarquia = useMemo(() => {
    const h = {};
    filtrados.forEach(p => {
      const cat = p.categoria;
      const fin = p.finalidade;
      const cor = p.corte;
      if (!h[cat]) h[cat] = {};
      if (!h[cat][fin]) h[cat][fin] = {};
      if (!h[cat][fin][cor]) h[cat][fin][cor] = [];
      h[cat][fin][cor].push(p);
    });
    return h;
  }, [filtrados]);

  // Categorias e finalidades disponíveis para chips
  const catsDisponiveis = useMemo(() =>
    ORDEM_CATS.filter(c => hierarquia[c]),
  [hierarquia]);

  const finsDisponiveis = useMemo(() => {
    if (catFiltro === 'TODAS') return [];
    const catH = hierarquia[catFiltro] || {};
    const fins = Object.keys(catH);
    // Só mostra chips de finalidade se houver mais de uma
    if (fins.length <= 1) return [];
    return ORDEM_FIN.filter(f => fins.includes(f));
  }, [catFiltro, hierarquia]);

  // ── Accordion helpers ──────────────────────────────────────────────────────
  const estaAberto = (key) => pesquisa.trim().length > 0 || !!abertos[key];
  const toggle     = (key) => setAbertos(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Carrinho helpers ───────────────────────────────────────────────────────
  const idsNoCarrinho = useMemo(() => new Set(carrinho.map(i => i.id)), [carrinho]);

  const toggleItem = (prod) => {
    if (idsNoCarrinho.has(prod.id)) {
      setCarrinho(prev => prev.filter(i => i.id !== prod.id));
    } else {
      setCarrinho(prev => [...prev, { ...prod, prioridade: 0 }]);
    }
  };

  const semPrioridade = carrinho.filter(i => !i.prioridade || i.prioridade === 0);
  const pedidoValido  = filialOrigem && filialDestino && filialOrigem !== filialDestino && carrinho.length > 0;

  // ── Finalizar pedido ───────────────────────────────────────────────────────
  const finalizarPedido = async () => {
    if (!filialOrigem)  return setAviso({ show:true, titulo:'Atenção', msg:'Selecione a filial de origem.', tipo:'erro' });
    if (!filialDestino) return setAviso({ show:true, titulo:'Atenção', msg:'Selecione a filial destino.', tipo:'erro' });
    if (filialOrigem === filialDestino) return setAviso({ show:true, titulo:'Atenção', msg:'Origem e destino não podem ser iguais.', tipo:'erro' });
    if (carrinho.length === 0) return setAviso({ show:true, titulo:'Vazio', msg:'O carrinho está vazio.', tipo:'erro' });
    if (semPrioridade.length > 0) { setAlertaPrio(true); return; }

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
        itens:         carrinho,
      });
      setCarrinho([]);
      setMostrarCarrinhoMobile(false);
      setAviso({ show:true, titulo:'Sucesso!', msg:`Pedido enviado: ${filialOrigem} → ${filialDestino}`, tipo:'sucesso' });
    } catch {
      setAviso({ show:true, titulo:'Erro', msg:'Falha ao enviar pedido. Tente novamente.', tipo:'erro' });
    } finally { setEnviando(false); }
  };

  // ── Chip style ─────────────────────────────────────────────────────────────
  const chip = (ativo, cor) => ({
    padding:'0.3rem 0.85rem', borderRadius:'999px',
    border:`1px solid ${ativo?(cor||'var(--accent)'):'var(--border)'}`,
    fontSize:'0.6rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em',
    cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.15s',
    backgroundColor: ativo ? (cor||'var(--accent)') : 'var(--bg-elevated)',
    color:           ativo ? '#fff' : 'var(--text-secondary)',
    boxShadow:       ativo ? '0 2px 12px var(--accent-glow)' : 'none',
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col xl:flex-row h-full gap-6 relative">

      {/* ── Modal aviso ── */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[40px] shadow-2xl w-full max-w-md p-10 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)'}}>
            {aviso.tipo==='erro'
              ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4"/>
              : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4"/>}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-center" style={{color:'var(--text-primary)'}}>{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold uppercase text-center" style={{color:'var(--text-secondary)'}}>{aviso.msg}</p>
            <button onClick={()=>setAviso({...aviso,show:false})}
              className="mt-8 w-full py-5 rounded-2xl font-black uppercase text-xs text-white"
              style={{backgroundColor:'var(--accent)'}}>OK</button>
          </div>
        </div>
      )}

      {/* ── Modal prioridade ── */}
      {alertaPrio && (
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
              <button onClick={()=>setAlertaPrio(false)}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-xs"
                style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)'}}>
                Voltar
              </button>
              <button
                onClick={()=>{ if(semPrioridade.length===0){setAlertaPrio(false);finalizarPedido();} }}
                disabled={semPrioridade.length>0}
                className="flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white"
                style={{backgroundColor:semPrioridade.length===0?'var(--accent)':'var(--bg-elevated)',color:semPrioridade.length===0?'#fff':'var(--text-muted)'}}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ LISTA DE PRODUTOS ═══════════════════════ */}
      <div className={`flex-1 overflow-y-auto space-y-3 pr-2 pb-24 xl:pb-0 ${mostrarCarrinhoMobile ? 'hidden xl:block' : 'block'}`}>

        {/* Cabeçalho */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>
            Realizar Pedido
          </h2>
          <div className="hidden lg:flex gap-4 text-[9px] font-bold uppercase" style={{color:'var(--text-muted)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#3b82f6'}}/> Baixa</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#10b981'}}/> Normal</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'#ef4444'}}/> Alta</span>
          </div>
        </div>

        {/* Toggle tipo de pedido */}
        <div className="flex bg-[var(--bg-elevated)] p-1.5 rounded-[20px] mb-4" style={{border:'1px solid var(--border)'}}>
          <button onClick={()=>{setTipoPedido('REVENDA');setCatFiltro('TODAS');setFinFiltro('TODAS');}}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all"
            style={{backgroundColor:tipoPedido==='REVENDA'?'var(--accent)':'transparent',color:tipoPedido==='REVENDA'?'#fff':'var(--text-muted)',boxShadow:tipoPedido==='REVENDA'?'0 4px 12px var(--accent-glow)':'none'}}>
            <Package size={16}/> Produtos (Revenda)
          </button>
          <button onClick={()=>{setTipoPedido('USO_CONSUMO');setCatFiltro('TODAS');setFinFiltro('TODAS');}}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all"
            style={{backgroundColor:tipoPedido==='USO_CONSUMO'?'var(--accent)':'transparent',color:tipoPedido==='USO_CONSUMO'?'#fff':'var(--text-muted)',boxShadow:tipoPedido==='USO_CONSUMO'?'0 4px 12px var(--accent-glow)':'none'}}>
            <Briefcase size={16}/> Uso / Consumo
          </button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-3 p-4 rounded-[24px] border-2" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border-bright)'}}>
          <Search size={18} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <input className="flex-1 bg-transparent border-none outline-none font-bold text-xs uppercase"
            style={{color:'var(--text-primary)'}} placeholder="Buscar produto, corte ou categoria..."
            value={pesquisa} onChange={e=>setPesquisa(e.target.value)}/>
          {pesquisa && <button onClick={()=>setPesquisa('')} style={{color:'var(--text-muted)'}}><X size={16}/></button>}
        </div>

        {/* Chips de categoria (Nível 1) */}
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center'}}>
          <button style={chip(catFiltro==='TODAS')} onClick={()=>setCatFiltro('TODAS')}>Todas</button>
          {catsDisponiveis.map(c=>(
            <button key={c} style={chip(catFiltro===c)} onClick={()=>setCatFiltro(catFiltro===c?'TODAS':c)}>{c}</button>
          ))}
          {(pesquisa||catFiltro!=='TODAS'||finFiltro!=='TODAS') && (
            <button onClick={()=>{setPesquisa('');setCatFiltro('TODAS');setFinFiltro('TODAS');}}
              style={{...chip(false),borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.08)',color:'#ef4444',display:'flex',alignItems:'center',gap:'0.25rem'}}>
              <X size={10}/> Limpar
            </button>
          )}
        </div>

        {/* Chips de finalidade (Nível 2 — só aparece quando há múltiplas) */}
        {finsDisponiveis.length > 0 && (
          <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center',paddingLeft:'0.75rem',borderLeft:'2px solid var(--accent)'}}>
            <button style={chip(finFiltro==='TODAS','#475569')} onClick={()=>setFinFiltro('TODAS')}>Todas</button>
            {finsDisponiveis.map(f=>(
              <button key={f} style={chip(finFiltro===f,'#475569')} onClick={()=>setFinFiltro(finFiltro===f?'TODAS':f)}>{f}</button>
            ))}
          </div>
        )}

        {carrinho.length > 0 && (
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase'}}>
            <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'var(--accent)'}}/>
            Item selecionado — clique novamente para remover
          </div>
        )}

        {/* ══ ACCORDION 3 NÍVEIS ══ */}
        <div className="space-y-3">
          {(catFiltro==='TODAS' ? catsDisponiveis : [catFiltro].filter(c=>hierarquia[c])).map(cat => {
            const catH     = hierarquia[cat] || {};
            const catKey   = cat;
            const catOpen  = estaAberto(catKey);
            const catCount = Object.values(catH).flatMap(fH=>Object.values(fH)).flat().length;
            const fins     = ORDEM_FIN.filter(f => catH[f]);
            const singleFin = fins.length === 1; // oculta nível 2 se só há uma finalidade

            return (
              <div key={cat} className="rounded-[28px] border overflow-hidden"
                style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>

                {/* ── Nível 1: Categoria ── */}
                <button
                  onClick={()=>toggle(catKey)}
                  className="w-full flex items-center justify-between p-5 transition-all"
                  style={{color:'var(--text-primary)'}}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black uppercase tracking-widest">{cat}</span>
                    <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{catCount}</span>
                  </div>
                  {catOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                </button>

                {catOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {(finFiltro==='TODAS' ? fins : fins.filter(f=>f===finFiltro)).map(fin => {
                      const finH    = catH[fin] || {};
                      const finKey  = `${catKey}|${fin}`;
                      const finOpen = estaAberto(finKey);
                      const finCount= Object.values(finH).flat().length;
                      const cortes  = Object.keys(finH).sort();

                      return (
                        <div key={fin}>
                          {/* ── Nível 2: Finalidade (oculto se único) ── */}
                          {!singleFin && (
                            <button
                              onClick={()=>toggle(finKey)}
                              className="w-full flex items-center justify-between px-4 py-2.5 rounded-[18px] border transition-all"
                              style={{backgroundColor:'var(--bg-surface)',borderColor:'var(--border)',color:'var(--text-secondary)'}}
                              onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                              onMouseLeave={e=>e.currentTarget.style.backgroundColor='var(--bg-surface)'}>
                              <div className="flex items-center gap-2">
                                <span style={{fontSize:'0.62rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--accent-bright)'}}>{fin}</span>
                                <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 6px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{finCount}</span>
                              </div>
                              {finOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                            </button>
                          )}

                          {/* Conteúdo de finalidade — auto-aberto quando única */}
                          {(singleFin || finOpen) && (
                            <div className={`space-y-2 ${!singleFin ? 'mt-2 pl-3' : ''}`}>
                              {cortes.map(corte => {
                                const corteKey   = `${finKey}|${corte}`;
                                const corteOpen  = estaAberto(corteKey);
                                const produtos   = finH[corte] || [];
                                const selecionados = produtos.filter(p=>idsNoCarrinho.has(p.id)).length;

                                return (
                                  <div key={corte} className="rounded-[18px] border overflow-hidden"
                                    style={{borderColor: selecionados>0?'rgba(59,130,246,0.4)':'var(--border)',backgroundColor:'var(--bg-surface)'}}>

                                    {/* ── Nível 3: Corte ── */}
                                    <button
                                      onClick={()=>toggle(corteKey)}
                                      className="w-full flex items-center justify-between px-4 py-3 transition-all"
                                      style={{color:'var(--text-secondary)'}}
                                      onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                                      onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                                      <div className="flex items-center gap-2">
                                        <span style={{fontSize:'0.7rem',fontWeight:900,textTransform:'uppercase',letterSpacing:'0.08em',color: selecionados>0?'var(--accent-bright)':'var(--text-primary)'}}>
                                          {corte}
                                        </span>
                                        <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 6px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>
                                          {produtos.length}
                                        </span>
                                        {selecionados > 0 && (
                                          <span style={{fontSize:'0.55rem',fontWeight:800,padding:'1px 8px',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.15)',color:'var(--accent-bright)'}}>
                                            {selecionados} selecionado{selecionados>1?'s':''}
                                          </span>
                                        )}
                                      </div>
                                      {corteOpen ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}
                                    </button>

                                    {/* Produtos individuais */}
                                    {corteOpen && (
                                      <div className="p-3 pt-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {produtos.map(prod => {
                                          const noCarrinho = idsNoCarrinho.has(prod.id);
                                          return (
                                            <button key={prod.id} onClick={()=>toggleItem(prod)}
                                              className="p-3 rounded-[14px] border text-left transition-all w-full"
                                              style={{
                                                backgroundColor: noCarrinho?'rgba(59,130,246,0.08)':'var(--bg-card)',
                                                borderColor:     noCarrinho?'var(--accent)':'var(--border)',
                                                cursor:          'pointer',
                                                boxShadow:       noCarrinho?'0 0 0 1px var(--accent)':'none',
                                              }}
                                              onMouseEnter={e=>{if(!noCarrinho){e.currentTarget.style.backgroundColor='var(--bg-elevated)';e.currentTarget.style.borderColor='var(--accent)';}}}
                                              onMouseLeave={e=>{if(!noCarrinho){e.currentTarget.style.backgroundColor='var(--bg-card)';e.currentTarget.style.borderColor='var(--border)';}}}
                                            >
                                              <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-0">
                                                  <h4 style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',color:noCarrinho?'var(--accent-bright)':'var(--text-primary)',lineHeight:1.35}}>
                                                    {prod.nome}
                                                  </h4>
                                                  <div style={{display:'flex',alignItems:'center',gap:'0.3rem',marginTop:3}}>

                                                    <span style={{fontSize:'0.62rem',fontFamily:'monospace',fontWeight:700,padding:'1px 6px',borderRadius:'4px',backgroundColor:noCarrinho?'rgba(59,130,246,0.15)':'var(--bg-elevated)',color:noCarrinho?'var(--accent-bright)':'var(--text-secondary)',border:`1px solid ${noCarrinho?'rgba(59,130,246,0.3)':'var(--border)'}`}}>{prod.codigo}</span>

                                                    <span style={{fontSize:'0.52rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)'}}>{prod.unidade}</span>

                                                  </div>
                                                </div>
                                                <div style={{
                                                  width:24,height:24,borderRadius:'0.4rem',flexShrink:0,
                                                  display:'flex',alignItems:'center',justifyContent:'center',
                                                  backgroundColor: noCarrinho?'var(--accent)':'var(--bg-elevated)',
                                                  border:          noCarrinho?'none':'1px solid var(--border)',
                                                  transition:'all 0.15s',
                                                }}>
                                                  {noCarrinho
                                                    ? <CheckCircle size={13} color="#fff"/>
                                                    : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{color:'var(--text-muted)'}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                  }
                                                </div>
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {catsDisponiveis.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <Search size={40} className="mx-auto mb-3" style={{color:'var(--text-muted)'}}/>
              <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Nenhum produto encontrado</p>
            </div>
          )}
        </div>

        {/* Botão flutuante Mobile */}
        {!mostrarCarrinhoMobile && carrinho.length > 0 && (
          <div className="xl:hidden fixed bottom-6 left-0 right-0 px-6 z-[90]">
            <button onClick={() => setMostrarCarrinhoMobile(true)}
              className="w-full py-4 rounded-full font-black uppercase text-[11px] tracking-widest text-white transition-all flex justify-between items-center px-6"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 30px var(--accent-glow)' }}>
              <span>{carrinho.length} item(s) selecionado(s)</span>
              <span className="flex items-center gap-2">Avançar <ArrowRight size={16}/></span>
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════ CARRINHO ═══════════════════════════════ */}
      <div className={`w-full xl:w-[390px] rounded-[44px] shadow-2xl overflow-hidden xl:sticky top-0 xl:h-[calc(100vh-64px)] flex-col ${mostrarCarrinhoMobile ? 'fixed inset-0 z-[100] rounded-none flex' : 'hidden xl:flex'}`}
        style={{backgroundColor:'var(--bg-surface)',border:'1px solid var(--border)'}}>

        {mostrarCarrinhoMobile && (
          <div className="xl:hidden p-4 flex items-center justify-between" style={{backgroundColor:'var(--bg-elevated)', borderBottom:'1px solid var(--border)'}}>
            <h3 className="text-sm font-black uppercase tracking-tighter italic" style={{color:'var(--text-primary)'}}>Resumo do Pedido</h3>
            <button onClick={() => setMostrarCarrinhoMobile(false)} style={{padding:'8px', borderRadius:'50%', backgroundColor:'var(--bg-surface)', color:'var(--text-muted)'}}>
              <X size={20}/>
            </button>
          </div>
        )}

        {/* Topo fixo */}
        <div className="p-5 space-y-3" style={{borderBottom:'1px solid var(--border)'}}>

          {/* Cabeçalho */}
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

          {/* Aviso prioridade pendente */}
          {semPrioridade.length > 0 && carrinho.length > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)'}}>
              <AlertCircle size={11} style={{color:'#f59e0b',flexShrink:0}}/>
              <p style={{fontSize:'0.6rem',fontWeight:700,color:'#d97706',textTransform:'uppercase'}}>
                {semPrioridade.length} {semPrioridade.length===1?'item':'itens'} sem prioridade
              </p>
            </div>
          )}

          {/* Botão confirmar */}
          <button onClick={finalizarPedido} disabled={enviando}
            className="w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
            style={{
              backgroundColor: pedidoValido?'var(--accent)':'var(--bg-elevated)',
              color:           pedidoValido?'#fff':'var(--text-muted)',
              boxShadow:       pedidoValido?'0 4px 20px var(--accent-glow)':'none',
              cursor:          pedidoValido?'pointer':'default',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',
            }}>
            {enviando && <div style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>}
            {!filialDestino ? 'Selecione o Destino' : carrinho.length===0 ? 'Carrinho Vazio' : 'Confirmar Pedido'}
          </button>
        </div>

        {/* Itens do carrinho */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar">
          {carrinho.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl border"
              style={{backgroundColor:'var(--bg-elevated)',borderColor:item.prioridade?'var(--border)':'rgba(245,158,11,0.3)'}}>
              <div className="flex justify-between items-start mb-1.5">
                <h5 className="text-[10px] font-black uppercase flex-1 leading-tight pr-2" style={{color:'var(--text-primary)'}}>
                  {item.nome}
                </h5>
                <button onClick={()=>setCarrinho(carrinho.filter((_,i)=>i!==idx))}
                  style={{color:'var(--text-muted)',flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
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
          {carrinho.length===0 && (
            <div className="py-12 text-center" style={{color:'var(--text-muted)'}}>
              <ShoppingCart size={28} className="mx-auto mb-3 opacity-20"/>
              <p className="text-[10px] font-black uppercase">Carrinho vazio</p>
              <p className="text-[9px] font-bold mt-1 opacity-60">Expanda uma categoria e selecione os produtos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;