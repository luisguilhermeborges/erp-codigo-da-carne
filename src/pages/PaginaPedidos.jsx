import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Trash2, ChevronDown, ChevronRight, CheckCircle, AlertCircle, Star, X, Search, SlidersHorizontal, ArrowRight, Building2, Package, Briefcase } from 'lucide-react';
import { BANCO_PADRAO } from '../data/bancoPadrao';
import { api } from '../services/api';
import { getPrecos, getFiliais } from '../services/cache';

const Prioridade = ({ valor, onChange }) => (
  <div className="flex gap-0.5">
    {[1,2,3].map(n => (
      <button key={n} onClick={() => onChange(n === valor ? 0 : n)}
        style={{ color: n <= valor ? '#f59e0b' : 'var(--border-bright)', transition:'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
        onMouseLeave={e => { e.currentTarget.style.color = n <= valor ? '#f59e0b' : 'var(--border-bright)'; }}>
        <Star size={15} fill={n <= valor ? '#f59e0b' : 'none'} />
      </button>
    ))}
  </div>
);

const ORDEM_CATS = ["CHURRASCO","DIA A DIA","HAMBURGUER","KIT BURGUER","BEBIDA","MERCEARIA","ACESSÓRIO","USO/CONSUMO"];
const SUBCATS = {
  "CHURRASCO":   ["BOVINO","PICANHA","MAMINHA","CHORIZO","ANCHO","COSTELA","SHORT RIB","FRALDA","FRALDA RED","T BONE","CUPIM","FLAT IRON","ENTRANHA","DENVER","CAPA DE FILE","PEITO","ASSADO DE TIRAS","TOMAHAWK","PRIME RIB","SUINO","CORDEIRO","LINGUIÇA","ESPETINHO","FRANGO","WAGYU"],
  "DIA A DIA":   ["BOVINO","FRANGO","SUINO","PEIXE","ACOMPANHAMENTO","CHURRASCO"],
  "HAMBURGUER":  ["GERAL","WAGYU","SUINO"],
  "KIT BURGUER": ["GERAL","COMPONENTE","PAO"],
  "BEBIDA":      ["CERVEJA","REFRIGERANTE","AGUA"],
  "MERCEARIA":   ["TEMPERO","MOLHO","SALGADINHO","PAO","QUEIJO","AZEITE","ACOMPANHAMENTO","CHURRASCO","GERAL"],
  "ACESSÓRIO":   ["GRELHA","ESPETO","CARVAO","LENHA","FACA","ACENDEDOR","EMBALAGEM","VESTUARIO","CHURRASQUEIRA","GERAL"],
  "USO/CONSUMO": ["LIMPEZA", "ESCRITORIO", "EMBALAGEM", "DESCARTAVEL", "GERAL"],
};
const SUBCATS_VISIVEIS = 5;

const PaginaPedidos = ({ user }) => {
  const [estoque, setEstoque]                     = useState([]);
  const [carrinho, setCarrinho]                   = useState([]);
  const [pesquisa, setPesquisa]                   = useState('');
  const [catFiltro, setCatFiltro]                 = useState('TODAS');
  const [subFiltro, setSubFiltro]                 = useState('TODAS');
  const [todasFiliais, setTodasFiliais]           = useState([]);
  const [filialOrigem, setFilialOrigem]           = useState('');   // de onde sai
  const [filialDestino, setFilialDestino]         = useState('');   // para onde vai
  const [categoriasAbertas, setCategoriasAbertas] = useState([]);
  const [aviso, setAviso]                         = useState({ show:false, titulo:'', msg:'', tipo:'sucesso' });
  const [enviando, setEnviando]                   = useState(false);
  const [modalSub, setModalSub]                   = useState(false);
  const [buscaSub, setBuscaSub]                   = useState('');
  const [alertaPrioridade, setAlertaPrioridade]   = useState(false);
  const [tipoPedido, setTipoPedido]               = useState('REVENDA'); // REVENDA ou USO_CONSUMO

  const cargo    = user?.cargo?.toLowerCase();
  const isMulti  = cargo === 'master' || cargo === 'adm'; // pode escolher origem
  const isComercial = cargo === 'comercial';

  useEffect(() => {
    if (!user) return;
    const carregar = async () => {
      const filiais = await getFiliais();
      setTodasFiliais(filiais);

      // Se não é multi-filial, origem é a filial do usuário
      if (!isMulti && user.unidades?.length > 0) {
        setFilialOrigem(user.unidades[0]);
      }

      const precos = await getPrecos();
      const lista = Object.entries(BANCO_PADRAO).map(([nome, v]) => {
        const cod = String(v.codigo ?? '').trim();
        return { id:cod, codigo:cod, nome, preco:precos[cod]??0, unidade:v.unidade, categoria:v.categoria, tags:v.tags||[v.categoria] };
      });
      setEstoque(lista.filter(p => p.preco > 0));
    };
    carregar();
  }, [user]);

  useEffect(() => { setSubFiltro('TODAS'); }, [catFiltro]);

  const idsNoCarrinho = useMemo(() => new Set(carrinho.map(i => i.id)), [carrinho]);

  const toggleItem = (prod) => {
    if (idsNoCarrinho.has(prod.id)) {
      setCarrinho(prev => prev.filter(i => i.id !== prod.id));
    } else {
      setCarrinho(prev => [...prev, { ...prod, prioridade: 0 }]);
    }
  };

  const produtosPorCategoria = useMemo(() => estoque.reduce((acc, p) => {
    if (pesquisa && !p.nome.toLowerCase().includes(pesquisa.toLowerCase())) return acc;
    const cat = p.categoria || "OUTROS";
    if (catFiltro !== 'TODAS' && cat !== catFiltro) return acc;
    const sub = (p.tags && p.tags[1]) ? p.tags[1] : "GERAL";
    if (subFiltro !== 'TODAS' && sub !== subFiltro) return acc;
    if (!acc[cat]) acc[cat] = {};
    if (!acc[cat][sub]) acc[cat][sub] = [];
    acc[cat][sub].push(p);
    return acc;
  }, {}), [estoque, pesquisa, catFiltro, subFiltro]);

  const subcatsDisponiveis = useMemo(() => {
    if (catFiltro === 'TODAS') return [];
    const ordem = SUBCATS[catFiltro] || [];
    const existentes = new Set(estoque.filter(p => p.categoria === catFiltro).map(p => p.tags?.[1] || 'GERAL'));
    return ordem.filter(s => existentes.has(s));
  }, [catFiltro, estoque]);

  const subcatsFiltradas = buscaSub
    ? subcatsDisponiveis.filter(s => s.toLowerCase().includes(buscaSub.toLowerCase()))
    : subcatsDisponiveis;

  // Filiais disponíveis como destino (todas exceto a origem)
  const filiaisDestino = todasFiliais.filter(f => f.nome !== filialOrigem);
  // Filiais disponíveis como origem (para multi-filiais)
  const filiaisOrigem = isMulti
    ? todasFiliais
    : todasFiliais.filter(f => (user?.unidades||[]).includes(f.nome));

  const catsDisponiveis = ORDEM_CATS.filter(c => 
    estoque.some(p => p.categoria === c) &&
    (tipoPedido === 'REVENDA' ? c !== 'USO/CONSUMO' : c === 'USO/CONSUMO')
  );
  const buscaAtiva      = pesquisa.trim().length > 0;
  const isCatAberta     = (cat)    => buscaAtiva || categoriasAbertas.includes(cat);
  const isSubAberta     = (subKey) => buscaAtiva || categoriasAbertas.includes(subKey);
  const semPrioridade   = carrinho.filter(i => !i.prioridade || i.prioridade === 0);

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
        itens:         carrinho,
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

  const pedidoValido = filialOrigem && filialDestino && filialOrigem !== filialDestino && carrinho.length > 0;

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

      {/* Modal prioridade */}
      {alertaPrioridade && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[40px] shadow-2xl w-full max-w-md p-10 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)'}}>
            <Star size={64} className="mx-auto mb-4" style={{color:'#f59e0b'}}/>
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

      {/* Modal subcategorias */}
      {modalSub && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}} onClick={()=>setModalSub(false)}>
          <div className="rounded-[32px] shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-sm" style={{color:'var(--text-primary)'}}>Subcategorias — {catFiltro}</h3>
              <button onClick={()=>setModalSub(false)} style={{color:'var(--text-muted)'}}><X size={18}/></button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{backgroundColor:'var(--bg-elevated)',borderColor:'var(--border)'}}>
              <Search size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
              <input autoFocus value={buscaSub} onChange={e=>setBuscaSub(e.target.value)}
                placeholder="Buscar subcategoria..." className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full"
                style={{color:'var(--text-primary)'}}/>
            </div>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
              <button style={chip(subFiltro==='TODAS')} onClick={()=>{setSubFiltro('TODAS');setModalSub(false);setBuscaSub('');}}>
                Todas ({estoque.filter(p=>p.categoria===catFiltro).length})
              </button>
              {subcatsFiltradas.map(s => {
                const count = estoque.filter(p=>p.categoria===catFiltro&&(p.tags?.[1]||'GERAL')===s).length;
                return (
                  <button key={s} style={chip(subFiltro===s)} onClick={()=>{setSubFiltro(s);setModalSub(false);setBuscaSub('');}}>
                    {s} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── LISTA DE PRODUTOS ── */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4" style={{color:'var(--text-primary)'}}>Realizar Pedido</h2>

        {/* Toggle Tipo Pedido */}
        <div className="flex bg-[var(--bg-elevated)] p-1.5 rounded-[20px] mb-4" style={{ border: '1px solid var(--border)' }}>
          <button onClick={() => { setTipoPedido('REVENDA'); setCatFiltro('TODAS'); setSubFiltro('TODAS'); }} 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all" 
            style={{ backgroundColor: tipoPedido === 'REVENDA' ? 'var(--accent)' : 'transparent', color: tipoPedido === 'REVENDA' ? '#fff' : 'var(--text-muted)', boxShadow: tipoPedido === 'REVENDA' ? '0 4px 12px var(--accent-glow)' : 'none' }}>
            <Package size={16} /> Produtos (Revenda)
          </button>
          <button onClick={() => { setTipoPedido('USO_CONSUMO'); setCatFiltro('TODAS'); setSubFiltro('TODAS'); }} 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-black uppercase transition-all" 
            style={{ backgroundColor: tipoPedido === 'USO_CONSUMO' ? 'var(--accent)' : 'transparent', color: tipoPedido === 'USO_CONSUMO' ? '#fff' : 'var(--text-muted)', boxShadow: tipoPedido === 'USO_CONSUMO' ? '0 4px 12px var(--accent-glow)' : 'none' }}>
            <Briefcase size={16} /> Uso / Consumo
          </button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-3 p-4 rounded-[24px] border-2" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border-bright)'}}>
          <Search size={18} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <input className="flex-1 bg-transparent border-none outline-none font-bold text-xs uppercase"
            style={{color:'var(--text-primary)'}} placeholder="Buscar produto..."
            value={pesquisa} onChange={e=>setPesquisa(e.target.value)}/>
          {pesquisa && <button onClick={()=>setPesquisa('')} style={{color:'var(--text-muted)'}}><X size={16}/></button>}
        </div>

        {/* Filtros categoria */}
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center'}}>
          <button style={chip(catFiltro==='TODAS')} onClick={()=>setCatFiltro('TODAS')}>Todas</button>
          {catsDisponiveis.map(cat => (
            <button key={cat} style={chip(catFiltro===cat)} onClick={()=>setCatFiltro(catFiltro===cat?'TODAS':cat)}>{cat}</button>
          ))}
          {(pesquisa||catFiltro!=='TODAS') && (
            <button onClick={()=>{setPesquisa('');setCatFiltro('TODAS');setSubFiltro('TODAS');}}
              style={{...chip(false),borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.08)',color:'#ef4444',display:'flex',alignItems:'center',gap:'0.25rem'}}>
              <X size={10}/> Limpar
            </button>
          )}
        </div>

        {/* Filtros subcategoria */}
        {catFiltro !== 'TODAS' && subcatsDisponiveis.length > 0 && (
          <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',alignItems:'center',paddingLeft:'0.75rem',borderLeft:'2px solid var(--accent)'}}>
            <button style={chip(subFiltro==='TODAS','#475569')} onClick={()=>setSubFiltro('TODAS')}>Todas</button>
            {subcatsDisponiveis.slice(0, SUBCATS_VISIVEIS).map(s => (
              <button key={s} style={chip(subFiltro===s,'#475569')} onClick={()=>setSubFiltro(subFiltro===s?'TODAS':s)}>{s}</button>
            ))}
            {subcatsDisponiveis.length > SUBCATS_VISIVEIS && (
              <button onClick={()=>{setModalSub(true);setBuscaSub('');}} style={{...chip(false),display:'flex',alignItems:'center',gap:'0.3rem'}}>
                <SlidersHorizontal size={10}/> +{subcatsDisponiveis.length - SUBCATS_VISIVEIS} mais
              </button>
            )}
            {subFiltro !== 'TODAS' && (
              <button onClick={()=>setSubFiltro('TODAS')} style={{...chip(false),borderColor:'rgba(239,68,68,0.3)',backgroundColor:'rgba(239,68,68,0.08)',color:'#ef4444',display:'flex',alignItems:'center',gap:'0.25rem'}}>
                <X size={10}/> {subFiltro}
              </button>
            )}
          </div>
        )}

        {carrinho.length > 0 && (
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase'}}>
            <div style={{width:8,height:8,borderRadius:'50%',backgroundColor:'var(--accent)'}}/>
            Item adicionado — clique para remover
          </div>
        )}

        {/* Accordion categorias */}
        <div className="space-y-3">
          {ORDEM_CATS.filter(cat => 
            produtosPorCategoria[cat] && 
            (tipoPedido === 'REVENDA' ? cat !== 'USO/CONSUMO' : cat === 'USO/CONSUMO')
          ).map(categoria => {
            const subcats   = produtosPorCategoria[categoria];
            const catAberta = isCatAberta(categoria);
            const total     = Object.values(subcats).reduce((a,b)=>a+b.length,0);
            return (
              <div key={categoria} className="rounded-[28px] border overflow-hidden" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
                <button onClick={()=>setCategoriasAbertas(prev=>prev.includes(categoria)?prev.filter(c=>c!==categoria):[...prev,categoria])}
                  className="w-full flex items-center justify-between p-5 transition-all" style={{color:'var(--text-primary)'}}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black uppercase tracking-widest">{categoria}</span>
                    <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{total}</span>
                  </div>
                  {catAberta ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                </button>
                {catAberta && (
                  <div className="px-4 pb-4 space-y-3">
                    {Object.entries(subcats).sort((a,b)=>b[1].length-a[1].length).map(([subcat,itens]) => {
                      const subKey    = `${categoria}__${subcat}`;
                      const subAberta = isSubAberta(subKey);
                      return (
                        <div key={subcat} className="rounded-[20px] border overflow-hidden" style={{borderColor:'var(--border)',backgroundColor:'var(--bg-surface)'}}>
                          <button onClick={()=>setCategoriasAbertas(prev=>prev.includes(subKey)?prev.filter(c=>c!==subKey):[...prev,subKey])}
                            className="w-full flex items-center justify-between px-5 py-3 transition-all" style={{color:'var(--text-secondary)'}}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                            <div className="flex items-center gap-2">
                              <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em'}}>{subcat}</span>
                              <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 6px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>{itens.length}</span>
                            </div>
                            {subAberta ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                          </button>
                          {subAberta && (
                            <div className="p-3 pt-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {itens.map(prod => {
                                const noCarrinho = idsNoCarrinho.has(prod.id);
                                return (
                                  <button key={prod.id} onClick={()=>toggleItem(prod)}
                                    className="p-3 rounded-[16px] border text-left transition-all w-full"
                                    style={{backgroundColor:noCarrinho?'rgba(59,130,246,0.08)':'var(--bg-card)',borderColor:noCarrinho?'var(--accent)':'var(--border)',cursor:'pointer',boxShadow:noCarrinho?'0 0 0 1px var(--accent)':'none'}}
                                    onMouseEnter={e=>{if(!noCarrinho){e.currentTarget.style.backgroundColor='var(--bg-elevated)';e.currentTarget.style.borderColor='var(--accent)';}}}
                                    onMouseLeave={e=>{if(!noCarrinho){e.currentTarget.style.backgroundColor='var(--bg-card)';e.currentTarget.style.borderColor='var(--border)';}}}
                                  >
                                    <div className="flex justify-between items-center gap-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:noCarrinho?'var(--accent-bright)':'var(--text-primary)',lineHeight:1.3}}>{prod.nome}</h4>
                                        <p style={{fontSize:'0.7rem',fontWeight:800,color:noCarrinho?'var(--accent)':'var(--accent-bright)',marginTop:2}}>{Number(prod.preco).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p>
                                      </div>
                                      <div style={{width:26,height:26,borderRadius:'0.5rem',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:noCarrinho?'var(--accent)':'var(--bg-elevated)',border:noCarrinho?'none':'1px solid var(--border)',transition:'all 0.15s'}}>
                                        {noCarrinho
                                          ? <CheckCircle size={14} color="#fff"/>
                                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{color:'var(--text-muted)'}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
          {ORDEM_CATS.every(cat => !produtosPorCategoria[cat] || (tipoPedido === 'REVENDA' && cat === 'USO/CONSUMO') || (tipoPedido === 'USO_CONSUMO' && cat !== 'USO/CONSUMO')) && (
            <div className="py-20 text-center opacity-30">
              <Search size={40} className="mx-auto mb-3" style={{color:'var(--text-muted)'}}/>
              <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* ── CARRINHO ── */}
      <div className="w-full xl:w-[390px] rounded-[44px] shadow-2xl overflow-hidden xl:sticky top-0 xl:h-[calc(100vh-64px)] flex flex-col"
        style={{backgroundColor:'var(--bg-surface)',border:'1px solid var(--border)'}}>

        {/* ── TOPO FIXO ── */}
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

          {/* Rota origem → destino */}
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'0.4rem',alignItems:'center'}}>
            {/* Origem */}
            <div>
              <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3,display:'flex',alignItems:'center',gap:3}}>
                <Building2 size={9}/> Origem
              </p>
              {isMulti ? (
                <select value={filialOrigem} onChange={e=>{setFilialOrigem(e.target.value);setFilialDestino('');}}
                  className="w-full p-2 rounded-xl text-[10px] font-bold uppercase outline-none"
                  style={{backgroundColor:'var(--bg-elevated)',color:filialOrigem?'var(--text-primary)':'var(--text-muted)',border:`1px solid ${filialOrigem?'var(--accent)':'var(--border)'}`}}>
                  <option value="">Selecionar...</option>
                  {todasFiliais.map(f=><option key={f.id||f._id} value={f.nome}>{f.nome}</option>)}
                </select>
              ) : (
                <div className="p-2 rounded-xl text-[10px] font-black uppercase" style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-primary)'}}>
                  {filialOrigem || user?.unidades?.[0] || '—'}
                </div>
              )}
            </div>

            {/* Seta */}
            <div style={{display:'flex',justifyContent:'center',paddingTop:16}}>
              <ArrowRight size={16} style={{color:'var(--accent-bright)'}}/>
            </div>

            {/* Destino */}
            <div>
              <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginBottom:3,display:'flex',alignItems:'center',gap:3}}>
                <Building2 size={9}/> Destino
              </p>
              <select value={filialDestino} onChange={e=>setFilialDestino(e.target.value)}
                className="w-full p-2 rounded-xl text-[10px] font-bold uppercase outline-none"
                style={{backgroundColor:'var(--bg-elevated)',color:filialDestino?'var(--text-primary)':'var(--text-muted)',border:`1px solid ${filialDestino?'var(--accent)':'var(--border)'}`}}>
                <option value="">Selecionar...</option>
                {filiaisDestino.map(f=><option key={f.id||f._id} value={f.nome}>{f.nome}</option>)}
              </select>
            </div>
          </div>

          {/* Aviso prioridade pendente */}
          {semPrioridade.length > 0 && carrinho.length > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)'}}>
              <Star size={11} style={{color:'#f59e0b',flexShrink:0}}/>
              <p style={{fontSize:'0.6rem',fontWeight:700,color:'#d97706',textTransform:'uppercase'}}>
                {semPrioridade.length} {semPrioridade.length===1?'item':'itens'} sem prioridade
              </p>
            </div>
          )}

          {/* ── BOTÃO CONFIRMAR — SÓ AQUI NO TOPO ── */}
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
            {!filialOrigem || !filialDestino ? 'Selecione Origem e Destino' : carrinho.length === 0 ? 'Carrinho Vazio' : 'Confirmar Pedido'}
          </button>
        </div>

        {/* Itens do carrinho */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar">
          {carrinho.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl border" style={{backgroundColor:'var(--bg-elevated)',borderColor:item.prioridade?'var(--border)':'rgba(245,158,11,0.3)'}}>
              <div className="flex justify-between items-start mb-1.5">
                <h5 className="text-[10px] font-black uppercase flex-1 leading-tight pr-2" style={{color:'var(--text-primary)'}}>{item.nome}</h5>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;