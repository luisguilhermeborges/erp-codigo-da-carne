import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, Package, XCircle, RefreshCw, Printer, Barcode, Plus, Search, Star, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import { getFila, getEstoque } from '../services/cache';

// ── Estrelas de prioridade (só leitura na impressão, editável na conferência) ─
const EstrelasDisplay = ({ valor }) => (
  <span style={{color:'#f59e0b',letterSpacing:1}}>
    {'★'.repeat(valor)}{'☆'.repeat(5 - valor)}
  </span>
);

// ── Componente de impressão ───────────────────────────────────────────────────
const FolhaImpressao = ({ pedido, onFechar }) => {
  const itensOrdenados = [...(pedido.itens||[])].sort((a,b) => (b.prioridade||0) - (a.prioridade||0));
  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto" style={{color:'#000'}}>
      <div style={{maxWidth:800,margin:'0 auto',padding:'2rem',fontFamily:'sans-serif'}}>
        {/* Botões de controle (não imprimem) */}
        <div className="flex gap-3 mb-6 print:hidden">
          <button onClick={()=>window.print()} style={{padding:'0.75rem 1.5rem',backgroundColor:'#1e40af',color:'#fff',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',textTransform:'uppercase',cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Printer size={16}/> Imprimir
          </button>
          <button onClick={onFechar} style={{padding:'0.75rem 1.5rem',backgroundColor:'#f1f5f9',color:'#475569',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',textTransform:'uppercase',cursor:'pointer',border:'none'}}>
            Fechar
          </button>
        </div>

        {/* Cabeçalho da folha */}
        <div style={{borderBottom:'2px solid #000',paddingBottom:'1rem',marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h1 style={{fontSize:'1.5rem',fontWeight:900,textTransform:'uppercase',margin:0}}>CÓDIGO DA CARNE</h1>
              <p style={{fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',color:'#475569',margin:'0.25rem 0 0'}}>Folha de Separação de Pedido</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:'0.7rem',fontWeight:700,margin:0}}>#{pedido.idExterno}</p>
              <p style={{fontSize:'0.7rem',color:'#475569',margin:'0.15rem 0 0'}}>{pedido.data}</p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginTop:'1rem',padding:'0.75rem',backgroundColor:'#f8fafc',borderRadius:'0.5rem'}}>
            <div>
              <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'#64748b'}}>Origem: </span>
              <span style={{fontSize:'0.75rem',fontWeight:700}}>{pedido.unidadeOrigem || '—'}</span>
            </div>
            <div>
              <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'#64748b'}}>Destino: </span>
              <span style={{fontSize:'0.75rem',fontWeight:700}}>{pedido.filial || pedido.destino || '—'}</span>
            </div>
            <div>
              <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'#64748b'}}>Solicitante: </span>
              <span style={{fontSize:'0.75rem',fontWeight:700}}>{pedido.usuario || '—'}</span>
            </div>
            <div>
              <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'#64748b'}}>Total de itens: </span>
              <span style={{fontSize:'0.75rem',fontWeight:700}}>{pedido.itens?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Tabela de itens */}
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.75rem'}}>
          <thead>
            <tr style={{backgroundColor:'#1e293b',color:'#fff'}}>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'left',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem',width:30}}>#</th>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'left',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem'}}>Produto</th>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem',width:80}}>Cód.</th>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem',width:90}}>Prioridade</th>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem',width:80}}>Qtd</th>
              <th style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:700,textTransform:'uppercase',fontSize:'0.65rem',width:70}}>✓</th>
            </tr>
          </thead>
          <tbody>
            {itensOrdenados.map((item, i) => (
              <tr key={i} style={{borderBottom:'1px solid #e2e8f0',backgroundColor:i%2===0?'#fff':'#f8fafc'}}>
                <td style={{padding:'0.6rem 0.75rem',fontWeight:600,color:'#94a3b8'}}>{i+1}</td>
                <td style={{padding:'0.6rem 0.75rem'}}>
                  <p style={{fontWeight:700,textTransform:'uppercase',fontSize:'0.75rem',margin:0}}>{item.nome}</p>
                  <p style={{fontSize:'0.6rem',color:'#94a3b8',margin:'0.1rem 0 0'}}>{item.categoria}</p>
                </td>
                <td style={{padding:'0.6rem 0.75rem',textAlign:'center',fontFamily:'monospace',fontSize:'0.65rem',color:'#475569'}}>{item.codigo}</td>
                <td style={{padding:'0.6rem 0.75rem',textAlign:'center',fontSize:'0.8rem'}}>
                  <EstrelasDisplay valor={item.prioridade||0}/>
                </td>
                <td style={{padding:'0.6rem 0.75rem',textAlign:'center',fontWeight:700}}>___ {item.unidade}</td>
                <td style={{padding:'0.6rem 0.75rem',textAlign:'center'}}>
                  <div style={{width:20,height:20,border:'2px solid #000',borderRadius:3,margin:'0 auto'}}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Rodapé */}
        <div style={{marginTop:'2rem',paddingTop:'1rem',borderTop:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',fontSize:'0.65rem',color:'#94a3b8'}}>
          <span>Impresso em: {new Date().toLocaleString()}</span>
          <span>Código da Carne © 2026</span>
        </div>
      </div>

      {/* CSS de impressão */}
      <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
const PaginaAtendimento = ({ user }) => {
  const [fila, setFila]                           = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia]   = useState([]);
  const [carregando, setCarregando]               = useState(false);
  const [finalizando, setFinalizando]             = useState(false);
  const [mostrarImpressao, setMostrarImpressao]   = useState(false);

  // Leitor de código de barras
  const [modoLeitor, setModoLeitor]     = useState(false);
  const [codigoLido, setCodigoLido]     = useState('');
  const [feedbackLeitor, setFeedbackLeitor] = useState(null); // { tipo, msg }
  const inputLeitorRef                  = useRef();

  // Adicionar item extra
  const [modalAddItem, setModalAddItem] = useState(false);
  const [buscaAdd, setBuscaAdd]         = useState('');
  const [catalogoAdd, setCatalogoAdd]   = useState([]);

  // Carregar catálogo para adicionar itens
  useEffect(() => {
    getEstoque({ apenasComPreco: false }).then(setCatalogoAdd).catch(() => {});
  }, []);

  const carregarFila = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await getFila();
      const filtrados = user?.cargo === 'master' || user?.cargo === 'adm'
        ? dados
        : dados.filter(p => p.unidadeOrigem === user?.unidade || !p.unidadeOrigem);
      setFila(filtrados);
    } catch (err) {
      console.warn('Erro ao carregar fila', err);
    } finally { setCarregando(false); }
  }, [user]);

  useEffect(() => {
    carregarFila();
    const interval = setInterval(carregarFila, 8000);
    return () => clearInterval(interval);
  }, [carregarFila]);

  useEffect(() => {
    if (pedidoSelecionado) {
      const itens = [...(pedidoSelecionado.itens || [])]
        .sort((a,b) => (b.prioridade||0) - (a.prioridade||0))
        .map(item => ({ ...item, qtdSolicitada: Number(item.qtd)||1, qtdEnviada: Number(item.qtd)||1, atendido: true }));
      setItensConferencia(itens);
    }
  }, [pedidoSelecionado]);

  // ── Leitor de código de barras / EAN ─────────────────────────────────────
  const processarCodigo = useCallback((codigo) => {
    const cod = String(codigo).trim().replace(/^0+/, '');
    const idx  = itensConferencia.findIndex(i => String(i.codigo).replace(/^0+/,'') === cod);
    if (idx === -1) {
      setFeedbackLeitor({ tipo:'erro', msg:`Código ${cod} não está neste pedido` });
    } else {
      setItensConferencia(prev => prev.map((i,k) =>
        k === idx ? { ...i, atendido: true, qtdEnviada: (Number(i.qtdEnviada)||0) + 1 } : i
      ));
      setFeedbackLeitor({ tipo:'ok', msg:`✓ ${itensConferencia[idx].nome}` });
    }
    setCodigoLido('');
    setTimeout(() => setFeedbackLeitor(null), 2500);
    if (inputLeitorRef.current) inputLeitorRef.current.focus();
  }, [itensConferencia]);

  const handleLeitorKey = (e) => {
    if (e.key === 'Enter' && codigoLido.trim()) {
      processarCodigo(codigoLido);
    }
  };

  useEffect(() => {
    if (modoLeitor && inputLeitorRef.current) {
      inputLeitorRef.current.focus();
    }
  }, [modoLeitor]);

  // ── Adicionar item extra ao pedido ────────────────────────────────────────
  const adicionarItemExtra = (prod) => {
    const jaExiste = itensConferencia.find(i => i.codigo === prod.codigo);
    if (jaExiste) {
      setFeedbackLeitor({ tipo:'aviso', msg:'Item já está na lista' });
      setTimeout(() => setFeedbackLeitor(null), 2000);
      return;
    }
    setItensConferencia(prev => [...prev, {
      ...prod, qtdSolicitada: 0, qtdEnviada: 1, atendido: true, extra: true
    }]);
    setModalAddItem(false);
    setBuscaAdd('');
  };

  // ── Finalizar atendimento ─────────────────────────────────────────────────
  const finalizarAtendimento = async () => {
    if (!window.confirm("Confirmar a conferência desta carga?")) return;
    setFinalizando(true);
    try {
      await api.pedidos.finalizar(String(pedidoSelecionado.idExterno || pedidoSelecionado.id), {
        itens:           itensConferencia.filter(i => i.atendido),
        dataAtendimento: new Date().toLocaleString(),
        atendidoPor:     user.nome,
      });
      await carregarFila();
      setPedidoSelecionado(null);
      alert("✅ Atendimento finalizado!");
    } catch {
      alert("Erro ao finalizar atendimento. Tente novamente.");
    } finally { setFinalizando(false); }
  };

  const produtosBusca = buscaAdd.length > 1
    ? catalogoAdd.filter(p => p.nome.toLowerCase().includes(buscaAdd.toLowerCase()) || p.codigo.includes(buscaAdd))
    : [];

  return (
    <div className="flex gap-6 animate-in fade-in duration-500">

      {/* Impressão overlay */}
      {mostrarImpressao && pedidoSelecionado && (
        <FolhaImpressao pedido={{...pedidoSelecionado, itens:itensConferencia}} onFechar={()=>setMostrarImpressao(false)}/>
      )}

      {/* Modal adicionar item */}
      {modalAddItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[32px] shadow-2xl w-full max-w-md p-6 space-y-4" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}}>
            <div className="flex justify-between items-center">
              <h3 className="font-black uppercase text-sm" style={{color:'var(--text-primary)'}}>Adicionar Item ao Pedido</h3>
              <button onClick={()=>{setModalAddItem(false);setBuscaAdd('');}} style={{color:'var(--text-muted)'}}><XCircle size={18}/></button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{backgroundColor:'var(--bg-elevated)',borderColor:'var(--border)'}}>
              <Search size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
              <input autoFocus value={buscaAdd} onChange={e=>setBuscaAdd(e.target.value)}
                placeholder="Buscar produto ou código..." className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full"
                style={{color:'var(--text-primary)'}}/>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {produtosBusca.slice(0,15).map(p => (
                <button key={p.codigo} onClick={()=>adicionarItemExtra(p)}
                  className="w-full flex justify-between items-center p-3 rounded-2xl transition-all text-left"
                  style={{color:'var(--text-primary)'}}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                  <div>
                    <p style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase'}}>{p.nome}</p>
                    <p style={{fontSize:'0.6rem',color:'var(--text-muted)'}}>{p.codigo} · {p.categoria}</p>
                  </div>
                  <Plus size={16} style={{color:'var(--accent-bright)',flexShrink:0}}/>
                </button>
              ))}
              {buscaAdd.length > 1 && produtosBusca.length === 0 && (
                <p style={{textAlign:'center',fontSize:'0.7rem',color:'var(--text-muted)',padding:'1rem'}}>Nenhum produto encontrado</p>
              )}
              {buscaAdd.length <= 1 && (
                <p style={{textAlign:'center',fontSize:'0.7rem',color:'var(--text-muted)',padding:'1rem'}}>Digite para buscar...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FILA LATERAL ── */}
      <div className="w-72 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Cargas na Fila</h2>
          <button onClick={carregarFila} style={{color:'var(--text-muted)'}} title="Atualizar">
            <RefreshCw size={13} className={carregando ? 'animate-spin' : ''}/>
          </button>
        </div>
        <div className="space-y-2">
          {fila.map(p => {
            const ativo = pedidoSelecionado?.idExterno === p.idExterno;
            return (
              <button key={p.idExterno} onClick={()=>setPedidoSelecionado(p)}
                className="w-full p-4 rounded-[24px] border text-left transition-all"
                style={{backgroundColor:ativo?'var(--accent)':'var(--bg-card)',borderColor:ativo?'var(--accent)':'var(--border)',color:ativo?'#fff':'var(--text-primary)',boxShadow:ativo?'0 4px 20px var(--accent-glow)':'none'}}>
                <p style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',opacity:0.6}}>#{p.idExterno} · {p.data}</p>
                <p className="text-xs font-black uppercase leading-tight mt-0.5">{p.cliente||p.filial}</p>
                {p.unidadeOrigem && p.filial && (
                  <p style={{fontSize:'0.55rem',fontWeight:600,opacity:0.7,marginTop:2}}>{p.unidadeOrigem} → {p.filial}</p>
                )}
                {p.tipo === 'TRANSFERENCIA_AVULSA' && (
                  <span style={{fontSize:'0.55rem',fontWeight:700,color:ativo?'rgba(255,255,255,0.8)':'#f97316'}}>TRANSFERÊNCIA</span>
                )}
                <div style={{marginTop:4,display:'flex',gap:4,alignItems:'center'}}>
                  <Package size={10} style={{opacity:0.5}}/>
                  <span style={{fontSize:'0.55rem',opacity:0.6}}>{p.itens?.length||0} itens</span>
                </div>
              </button>
            );
          })}
          {fila.length === 0 && !carregando && (
            <div className="p-8 text-center" style={{color:'var(--text-muted)',opacity:0.3}}>
              <Package size={32} className="mx-auto mb-2"/>
              <p className="font-black uppercase text-[10px]">Fila Vazia</p>
            </div>
          )}
          {carregando && fila.length === 0 && (
            <div className="p-8 text-center opacity-30"><RefreshCw size={24} className="mx-auto animate-spin"/></div>
          )}
        </div>
      </div>

      {/* ── ÁREA DE CONFERÊNCIA ── */}
      <div className="flex-1 min-w-0">
        {pedidoSelecionado ? (
          <div className="space-y-4">

            {/* Header */}
            <header className="p-6 rounded-[32px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black italic uppercase leading-none" style={{color:'var(--text-primary)'}}>Conferência de Saída</h2>
                  <p className="text-[10px] font-bold uppercase mt-1" style={{color:'var(--text-muted)'}}>{pedidoSelecionado.cliente}</p>
                  {pedidoSelecionado.unidadeOrigem && (
                    <p style={{fontSize:'0.65rem',fontWeight:600,color:'var(--accent-bright)',marginTop:2}}>
                      {pedidoSelecionado.unidadeOrigem} → {pedidoSelecionado.filial || pedidoSelecionado.destino}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {/* Impressão */}
                  <button onClick={()=>setMostrarImpressao(true)}
                    style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1rem',borderRadius:'0.875rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-surface)'}
                    onMouseLeave={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}>
                    <Printer size={14}/> Imprimir
                  </button>
                  {/* Leitor */}
                  <button onClick={()=>setModoLeitor(!modoLeitor)}
                    style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1rem',borderRadius:'0.875rem',border:'1px solid '+(modoLeitor?'var(--accent)':'var(--border)'),backgroundColor:modoLeitor?'rgba(59,130,246,0.1)':'var(--bg-elevated)',color:modoLeitor?'var(--accent-bright)':'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}>
                    <Barcode size={14}/> {modoLeitor ? 'Leitor Ativo' : 'Leitor'}
                  </button>
                  {/* Adicionar item */}
                  <button onClick={()=>setModalAddItem(true)}
                    style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1rem',borderRadius:'0.875rem',border:'none',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px var(--accent-glow)'}}>
                    <Plus size={14}/> Adicionar Item
                  </button>
                  {/* Finalizar */}
                  <button onClick={finalizarAtendimento} disabled={finalizando}
                    style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.25rem',borderRadius:'0.875rem',border:'none',backgroundColor:'#10b981',color:'#fff',fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px rgba(16,185,129,0.3)'}}>
                    {finalizando ? <RefreshCw size={14} className="animate-spin"/> : <CheckCircle size={14}/>}
                    Finalizar
                  </button>
                </div>
              </div>

              {/* Leitor de código de barras */}
              {modoLeitor && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl border-2" style={{borderColor:'var(--accent)',backgroundColor:'rgba(59,130,246,0.05)'}}>
                    <Barcode size={18} style={{color:'var(--accent)',flexShrink:0}}/>
                    <input
                      ref={inputLeitorRef}
                      value={codigoLido}
                      onChange={e=>setCodigoLido(e.target.value)}
                      onKeyDown={handleLeitorKey}
                      placeholder="Aguardando leitura do código de barras..."
                      className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                      style={{color:'var(--text-primary)'}}
                    />
                    {codigoLido && (
                      <button onClick={()=>processarCodigo(codigoLido)} style={{padding:'0.3rem 0.75rem',borderRadius:'0.5rem',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,border:'none',cursor:'pointer'}}>
                        OK
                      </button>
                    )}
                  </div>
                  {feedbackLeitor && (
                    <div style={{padding:'0.5rem 0.875rem',borderRadius:'0.75rem',fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',
                      backgroundColor:feedbackLeitor.tipo==='ok'?'rgba(16,185,129,0.1)':feedbackLeitor.tipo==='aviso'?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)',
                      color:feedbackLeitor.tipo==='ok'?'#10b981':feedbackLeitor.tipo==='aviso'?'#f59e0b':'#ef4444',
                      border:`1px solid ${feedbackLeitor.tipo==='ok'?'rgba(16,185,129,0.3)':feedbackLeitor.tipo==='aviso'?'rgba(245,158,11,0.3)':'rgba(239,68,68,0.3)'}`}}>
                      {feedbackLeitor.msg}
                    </div>
                  )}
                </div>
              )}
            </header>

            {/* Tabela de itens */}
            <div className="rounded-[32px] border overflow-hidden" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
              <table className="w-full text-left">
                <thead style={{backgroundColor:'var(--bg-elevated)'}}>
                  <tr className="text-[10px] font-black uppercase" style={{color:'var(--text-muted)'}}>
                    <th className="p-4 w-10">✓</th>
                    <th className="p-4">Produto</th>
                    <th className="p-4 text-center w-24">Prioridade</th>
                    <th className="p-4 text-center w-28">Qtd Pedido</th>
                    <th className="p-4 text-center w-32">Qtd Enviada</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {itensConferencia.map((item, idx) => (
                    <tr key={idx} style={{borderTop:'1px solid var(--border)',backgroundColor:item.extra?'rgba(59,130,246,0.03)':item.atendido?'transparent':'rgba(239,68,68,0.03)'}}>
                      {/* Status */}
                      <td className="p-4">
                        <button onClick={()=>setItensConferencia(itensConferencia.map((i,k)=>k===idx?{...i,atendido:!i.atendido}:i))}>
                          {item.atendido
                            ? <CheckCircle className="text-green-500" size={22}/>
                            : <XCircle size={22} style={{color:'var(--text-muted)'}}/>}
                        </button>
                      </td>

                      {/* Nome */}
                      <td className="p-4">
                        <p className="font-black uppercase text-xs leading-tight" style={{color:'var(--text-primary)'}}>{item.nome}</p>
                        <div style={{display:'flex',gap:'0.4rem',alignItems:'center',marginTop:2}}>
                          <span style={{fontSize:'0.6rem',fontFamily:'monospace',color:'var(--text-muted)'}}>{item.codigo}</span>
                          {item.extra && <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 5px',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.1)',color:'var(--accent-bright)'}}>EXTRA</span>}
                        </div>
                      </td>

                      {/* Prioridade */}
                      <td className="p-4 text-center">
                        {item.prioridade ? (
                          <span style={{color:'#f59e0b',fontSize:'0.85rem'}}>{'★'.repeat(item.prioridade)}{'☆'.repeat(5-item.prioridade)}</span>
                        ) : (
                          <span style={{color:'var(--text-muted)',fontSize:'0.7rem'}}>—</span>
                        )}
                      </td>

                      {/* Qtd pedido */}
                      <td className="p-4 text-center font-black text-xs" style={{color:'var(--text-secondary)'}}>
                        {item.qtdSolicitada||'—'} {item.unidade}
                      </td>

                      {/* Qtd enviada — editável */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={()=>setItensConferencia(itensConferencia.map((i,k)=>k===idx?{...i,qtdEnviada:Math.max(0,Number(i.qtdEnviada)-1)}:i))}
                            style={{padding:'0.25rem',borderRadius:'0.375rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',cursor:'pointer'}}>
                            <ChevronDown size={12}/>
                          </button>
                          <input type="number" step="0.001"
                            className="text-center bg-transparent font-black text-xs border-none outline-none"
                            style={{color:'var(--accent-bright)',width:52}}
                            value={item.qtdEnviada}
                            onChange={e=>setItensConferencia(itensConferencia.map((i,k)=>k===idx?{...i,qtdEnviada:e.target.value}:i))}
                          />
                          <button onClick={()=>setItensConferencia(itensConferencia.map((i,k)=>k===idx?{...i,qtdEnviada:Number(i.qtdEnviada)+1}:i))}
                            style={{padding:'0.25rem',borderRadius:'0.375rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',cursor:'pointer'}}>
                            <ChevronUp size={12}/>
                          </button>
                        </div>
                      </td>

                      {/* Remover item extra */}
                      <td className="p-4">
                        {item.extra && (
                          <button onClick={()=>setItensConferencia(itensConferencia.filter((_,k)=>k!==idx))}
                            style={{color:'var(--text-muted)',cursor:'pointer'}}
                            onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Rodapé da tabela */}
              <div style={{padding:'0.75rem 1rem',borderTop:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'0.65rem',fontWeight:700,color:'var(--text-muted)'}}>
                  {itensConferencia.filter(i=>i.atendido).length} de {itensConferencia.length} itens conferidos
                </span>
                <span style={{fontSize:'0.65rem',fontWeight:700,color:itensConferencia.filter(i=>i.extra).length>0?'var(--accent-bright)':'var(--text-muted)'}}>
                  {itensConferencia.filter(i=>i.extra).length > 0 ? `+${itensConferencia.filter(i=>i.extra).length} item(ns) extra(s)` : ''}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center rounded-[48px] border-4 border-dashed opacity-30 p-20 text-center"
            style={{backgroundColor:'var(--bg-surface)',borderColor:'var(--border-bright)',color:'var(--text-muted)'}}>
            <Package size={56} className="mb-4"/>
            <p className="font-black uppercase text-xs tracking-[0.3em]">Selecione uma carga na fila lateral</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAtendimento;