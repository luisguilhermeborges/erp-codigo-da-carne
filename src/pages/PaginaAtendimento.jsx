import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, Package, XCircle, RefreshCw, Printer, Barcode, Plus, Search, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../services/api';
import { getFila, getEstoque } from '../services/cache';

// ── Folha de impressão ────────────────────────────────────────────────────────
const FolhaImpressao = ({ pedido, onFechar }) => {
  const atendidos    = [...(pedido.itens||[])].filter(i => Number(i.qtdEnviada || 0) > 0).sort((a,b) => (b.prioridade||0)-(a.prioridade||0) || (a.nome||'').localeCompare(b.nome||''));
  const naoAtendidos = [...(pedido.itens||[])].filter(i => Number(i.qtdEnviada || 0) <= 0).sort((a,b) => (a.nome||'').localeCompare(b.nome||''));

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto" style={{color:'#000',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:820,margin:'0 auto',padding:'2rem'}}>
        {/* Controles (não imprimem) */}
        <div className="flex gap-3 mb-6 print:hidden">
          <button onClick={()=>window.print()} style={{padding:'0.75rem 1.5rem',backgroundColor:'#1e40af',color:'#fff',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',textTransform:'uppercase',cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Printer size={16}/> Imprimir
          </button>
          <button onClick={onFechar} style={{padding:'0.75rem 1.5rem',backgroundColor:'#f1f5f9',color:'#475569',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',textTransform:'uppercase',cursor:'pointer',border:'none'}}>
            Fechar
          </button>
        </div>

        {/* Cabeçalho */}
        <div style={{borderBottom:'2px solid #000',paddingBottom:'0.5rem',marginBottom:'0.75rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h1 style={{fontSize:'1.1rem',fontWeight:900,textTransform:'uppercase',margin:0}}>CÓDIGO DA CARNE</h1>
              <p style={{fontSize:'0.6rem',fontWeight:600,textTransform:'uppercase',color:'#475569',margin:0}}>Folha de Separação de Pedido</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:'0.65rem',fontWeight:700,margin:0}}>#{pedido.idExterno}</p>
              <p style={{fontSize:'0.55rem',color:'#475569',margin:0}}>{pedido.data}</p>
              {pedido.dataAtendimento && <p style={{fontSize:'0.55rem',color:'#475569',margin:0}}>Atendido: {pedido.dataAtendimento}</p>}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.25rem',marginTop:'0.5rem',padding:'0.4rem',backgroundColor:'#f8fafc',borderRadius:'0.3rem',fontSize:'0.6rem'}}>
            <div><strong>Origem:</strong> {pedido.unidadeOrigem||'—'}</div>
            <div><strong>Destino:</strong> {pedido.filial||pedido.destino||'—'}</div>
            <div><strong>Solicitante:</strong> {pedido.usuario||'—'}</div>
          </div>
        </div>

        {/* Tabela atendidos */}
        {atendidos.length > 0 && (
          <>
            <h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',marginBottom:'0.25rem',color:'#16a34a'}}>✓ Itens Atendidos ({atendidos.length})</h2>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.6rem',marginBottom:'1rem'}}>
              <thead>
                <tr style={{backgroundColor:'#1e293b',color:'#fff'}}>
                  {['#','Produto','Código','Prioridade (+ Baixa / Alta)','Qtd'].map(h=>(
                    <th key={h} style={{padding:'0.25rem 0.4rem',textAlign:'left',fontWeight:700,textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {atendidos.map((item,i)=>(
                  <tr key={i} style={{borderBottom:'1px solid #e2e8f0',backgroundColor:i%2===0?'#fff':'#f8fafc',height:'1.5rem'}}>
                    <td style={{padding:'0.25rem 0.4rem',color:'#94a3b8',fontWeight:600}}>{i+1}</td>
                    <td style={{padding:'0.25rem 0.4rem',fontWeight:700,textTransform:'uppercase'}}>{item.nome}</td>
                    <td style={{padding:'0.25rem 0.4rem',fontFamily:'monospace',color:'#475569'}}>{item.codigo}</td>
                    <td style={{padding:'0.25rem 0.4rem',color:'#f59e0b'}}>{['Baixa','Normal','Alta'][(item.prioridade||1)-1] || 'Normal'}</td>
                    <td style={{padding:'0.25rem 0.4rem',fontWeight:700}}>{Number(item.qtdEnviada||item.qtd||0)} {item.unidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Tabela não atendidos */}
        {naoAtendidos.length > 0 && (
          <>
            <h2 style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',marginBottom:'0.25rem',color:'#dc2626'}}>✗ Itens Não Atendidos ({naoAtendidos.length})</h2>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.6rem',marginBottom:'1rem'}}>
              <thead>
                <tr style={{backgroundColor:'#7f1d1d',color:'#fff'}}>
                  {['#','Produto','Código','Prioridade'].map(h=>(
                    <th key={h} style={{padding:'0.25rem 0.4rem',textAlign:'left',fontWeight:700,textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {naoAtendidos.map((item,i)=>(
                  <tr key={i} style={{borderBottom:'1px solid #fecaca',backgroundColor:i%2===0?'#fff7f7':'#fff',height:'1.5rem'}}>
                    <td style={{padding:'0.25rem 0.4rem',color:'#94a3b8',fontWeight:600}}>{i+1}</td>
                    <td style={{padding:'0.25rem 0.4rem',fontWeight:700,textTransform:'uppercase'}}>{item.nome}</td>
                    <td style={{padding:'0.25rem 0.4rem',fontFamily:'monospace',color:'#475569'}}>{item.codigo}</td>
                    <td style={{padding:'0.25rem 0.4rem',color:'#f59e0b'}}>{['Baixa','Normal','Alta'][(item.prioridade||1)-1] || 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Rodapé */}
        <div style={{marginTop:'1.5rem',paddingTop:'0.75rem',borderTop:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',fontSize:'0.6rem',color:'#94a3b8'}}>
          <span>Impresso em: {new Date().toLocaleString()}</span>
          <span>Código da Carne © 2026</span>
        </div>
      </div>
      <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
    </div>
  );
};

// ── Geração do XLSX para o sistema MBM (igual ao de relatórios) ───────────────
const gerarXLSX = (pedido) => {
  const itensAtendidos = (pedido.itens||[]).filter(i => Number(i.qtdEnviada || 0) > 0)
    .sort((a,b) => (a.nome||'').localeCompare(b.nome||''));

  const cabecalho = [
    "Nro Ped. Cliente","Seq. Item","* Código Item (Reduzido)","* Código Item",
    "Descrição Item","* Qtde. Venda","Unid. Venda","Valor Unitário (Venda)",
    "Dt. Entrega","* Tipo Desconto (P/V)","% Desconto","Valor Desconto",
    "Código Nat. Op.","Descrição Nat. Operação","Código Tab. Preço",
    "Descrição Tab. Preço","% Config. Nat. Operação 1","% Config. Nat. Operação 2",
    "Item Ped. Cliente","Item Seq. Cliente"
  ];
  const rows = itensAtendidos.map((item, i) => {
    const row = new Array(20).fill("");
    row[0] = "";
    row[1] = i + 1;
    row[3] = {t: 's', v: String(item.codigo)};
    row[4] = item.nome;
    row[5] = Number(item.qtdEnviada || item.qtd || 0);
    row[6] = item.unidade;
    row[9] = "V";
    return row;
  });
  const ws = XLSX.utils.aoa_to_sheet([cabecalho, ...rows]);
  ws['!cols'] = [{wch:15},{wch:10},{wch:20},{wch:20},{wch:40},{wch:15},{wch:10},{wch:15},{wch:15},{wch:18}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Importacao_PV");
  XLSX.writeFile(wb, `PEDIDO_${pedido.idExterno||pedido.id}_MBM.xlsx`);
};

// ── Página principal ──────────────────────────────────────────────────────────
const PaginaAtendimento = ({ user }) => {
  const [fila, setFila]                           = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [itensConferencia, setItensConferencia]   = useState([]);
  const [carregando, setCarregando]               = useState(false);
  const [finalizando, setFinalizando]             = useState(false);
  const [mostrarImpressao, setMostrarImpressao]   = useState(false);
  const [modoLeitor, setModoLeitor]               = useState(false);
  const [codigoLido, setCodigoLido]               = useState('');
  const [feedbackLeitor, setFeedbackLeitor]       = useState(null);
  const [modalAddItem, setModalAddItem]           = useState(false);
  const [buscaAdd, setBuscaAdd]                   = useState('');
  const [catalogoAdd, setCatalogoAdd]             = useState([]);
  const inputLeitorRef = useRef();

  useEffect(() => { getEstoque({ apenasComPreco: false }).then(setCatalogoAdd).catch(()=>{}); }, []);

  const carregarFila = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await getFila();
      const filtrados = ['master','adm'].includes(user?.cargo?.toLowerCase())
        ? dados
        : dados.filter(p => p.unidadeOrigem === user?.unidade || !p.unidadeOrigem);
      setFila(filtrados.slice().reverse()); // os recebidos por último ficam em cima
    } catch { } finally { setCarregando(false); }
  }, [user]);

  useEffect(() => {
    carregarFila();
    const iv = setInterval(carregarFila, 8000);
    return () => clearInterval(iv);
  }, [carregarFila]);

  useEffect(() => {
    if (!pedidoSelecionado) return;
    // Ordem alfabética, prioridade alta no topo
    const itens = [...(pedidoSelecionado.itens||[])]
      .sort((a,b) => (b.prioridade||0)-(a.prioridade||0) || (a.nome||'').localeCompare(b.nome||''))
      .map(item => ({ ...item, qtdSolicitada: Number(item.qtd)||1, qtdEnviada: Number(item.qtd)||1 }));
    setItensConferencia(itens);
  }, [pedidoSelecionado]);

  useEffect(() => { if (modoLeitor && inputLeitorRef.current) inputLeitorRef.current.focus(); }, [modoLeitor]);

  const processarBusca = useCallback(() => {
    const termo = buscaAdd.trim();
    if (!termo) return;

    let ehBalanca = false;
    let codBalanca = '';
    let pesoBalanca = 0;

    // Detecta código de balança padrão CDC 13 dígitos
    if (termo.length === 13 && termo.startsWith('2') && /^\d+$/.test(termo)) {
      ehBalanca = true;
      codBalanca = termo.substring(1, 7); // índices 1 a 6 são o código
      pesoBalanca = parseInt(termo.substring(7, 12), 10) / 1000; // peso em kg
    }

    const codBusca = ehBalanca ? codBalanca : termo;
    const qtdExtra = ehBalanca ? pesoBalanca : 1;

    // Procura no pedido sendo atendido
    const idx  = itensConferencia.findIndex(i => String(i.codigo) === codBusca);
    if (idx !== -1) {
      setItensConferencia(prev => prev.map((i,k) => k===idx ? {...i, qtdEnviada:(Number(i.qtdEnviada)||0)+qtdExtra} : i));
      setFeedbackLeitor({ tipo:'ok', msg:`✓ ${itensConferencia[idx].nome} (+${qtdExtra})` });
      setBuscaAdd('');
    } else {
      // Procura no inventario geral
      const prodCat = catalogoAdd.find(p => String(p.codigo) === codBusca);
      if (prodCat) {
        adicionarItemExtra(prodCat, qtdExtra);
        setFeedbackLeitor({ tipo:'ok', msg:`✓ ${prodCat.nome} (EXTRA +${qtdExtra})` });
        setBuscaAdd('');
      } else {
        setFeedbackLeitor({ tipo:'erro', msg:`Não encontrado: ${codBusca}` });
      }
    }

    setTimeout(() => setFeedbackLeitor(null), 2500);
    if (inputLeitorRef.current) inputLeitorRef.current.focus();
  }, [buscaAdd, itensConferencia, catalogoAdd]);

  const adicionarItemExtra = (prod, defaultQtd = 1) => {
    if (itensConferencia.find(i => String(i.codigo) === String(prod.codigo))) {
      setFeedbackLeitor({ tipo:'aviso', msg:'Item já está na lista' });
      setTimeout(() => setFeedbackLeitor(null), 2000);
      return;
    }
    setItensConferencia(prev => [...prev, { ...prod, qtdSolicitada:0, qtdEnviada:defaultQtd, extra:true }]);
    setBuscaAdd('');
  };

  const finalizarAtendimento = async () => {
    if (!window.confirm("Confirmar a conferência desta carga?")) return;
    setFinalizando(true);
    try {
      const pedidoFinalizado = {
        ...pedidoSelecionado,
        itens:           itensConferencia,
        dataAtendimento: new Date().toLocaleString(),
        atendidoPor:     user.nome,
        status:          'Finalizado',
      };
      await api.pedidos.finalizar(String(pedidoSelecionado.idExterno || pedidoSelecionado.id), {
        itens:           itensConferencia,
        dataAtendimento: pedidoFinalizado.dataAtendimento,
        atendidoPor:     user.nome,
      });
      // Gera XLSX automaticamente
      gerarXLSX(pedidoFinalizado);
      await carregarFila();
      setPedidoSelecionado(null);
      alert("✅ Atendimento finalizado! Planilha MBM gerada automaticamente.");
    } catch { alert("Erro ao finalizar atendimento. Tente novamente."); }
    finally { setFinalizando(false); }
  };

  const produtosBusca = buscaAdd.length > 1
    ? [...catalogoAdd].filter(p => p.nome.toLowerCase().includes(buscaAdd.toLowerCase()) || p.codigo.includes(buscaAdd)).sort((a,b)=>a.nome.localeCompare(b.nome))
    : [];

  // Exibição unificada, ordenda por prioridade e alfabeticamente
  const itensExibicao = [...itensConferencia].sort((a,b)=>(b.prioridade||0)-(a.prioridade||0)||(a.nome||'').localeCompare(b.nome||''));

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">

      {mostrarImpressao && pedidoSelecionado && (
        <FolhaImpressao pedido={{...pedidoSelecionado, itens:itensConferencia}} onFechar={()=>setMostrarImpressao(false)}/>
      )}

      {mostrarImpressao && pedidoSelecionado && (
        <FolhaImpressao pedido={{...pedidoSelecionado, itens:itensConferencia}} onFechar={()=>setMostrarImpressao(false)}/>
      )}

      {/* ── FILA LATERAL ── */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Cargas na Fila</h2>
          <button onClick={carregarFila} style={{color:'var(--text-muted)'}}><RefreshCw size={13} className={carregando?'animate-spin':''}/></button>
        </div>
        <div className="space-y-2">
          {fila.map(p => {
            const ativo = pedidoSelecionado?.idExterno === p.idExterno;
            return (
              <button key={p.idExterno} onClick={()=>setPedidoSelecionado(p)}
                className="w-full p-4 rounded-[22px] border text-left transition-all"
                style={{backgroundColor:ativo?'var(--accent)':'var(--bg-card)',borderColor:ativo?'var(--accent)':'var(--border)',color:ativo?'#fff':'var(--text-primary)',boxShadow:ativo?'0 4px 20px var(--accent-glow)':'none'}}>
                <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',opacity:0.6}}>#{p.idExterno} · {p.data}</p>
                <p className="text-xs font-black uppercase leading-tight mt-0.5">{p.cliente||p.filial}</p>
                {p.unidadeOrigem && <p style={{fontSize:'0.55rem',fontWeight:600,opacity:0.7,marginTop:2}}>{p.unidadeOrigem} → {p.filial||p.destino}</p>}
                {p.tipo==='TRANSFERENCIA_AVULSA' && <span style={{fontSize:'0.55rem',fontWeight:700,color:ativo?'rgba(255,255,255,0.8)':'#f97316'}}>TRANSFERÊNCIA</span>}
                <p style={{fontSize:'0.55rem',opacity:0.5,marginTop:3}}>{p.itens?.length||0} itens</p>
              </button>
            );
          })}
          {fila.length===0 && !carregando && (
            <div className="p-8 text-center opacity-30"><Package size={28} className="mx-auto mb-2"/><p className="font-black uppercase text-[10px]">Fila Vazia</p></div>
          )}
          {carregando && fila.length===0 && <div className="p-8 text-center opacity-30"><RefreshCw size={22} className="mx-auto animate-spin"/></div>}
        </div>
      </div>

      {/* ── CONFERÊNCIA ── */}
      <div className="flex-1 min-w-0">
        {pedidoSelecionado ? (
          <div className="space-y-4">

            {/* Header */}
            <header className="p-5 rounded-[28px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black italic uppercase" style={{color:'var(--text-primary)'}}>Conferência de Saída</h2>
                  <p style={{fontSize:'0.65rem',fontWeight:600,color:'var(--text-muted)',marginTop:2}}>{pedidoSelecionado.cliente}</p>
                  {pedidoSelecionado.unidadeOrigem && (
                    <p style={{fontSize:'0.65rem',fontWeight:700,color:'var(--accent-bright)',marginTop:2}}>
                      {pedidoSelecionado.unidadeOrigem} → {pedidoSelecionado.filial||pedidoSelecionado.destino}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button onClick={()=>setMostrarImpressao(true)}
                    style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}>
                    <Printer size={13}/> Imprimir
                  </button>
                  <button onClick={finalizarAtendimento} disabled={finalizando}
                    style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 1rem',borderRadius:'0.75rem',border:'none',backgroundColor:'#10b981',color:'#fff',fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px rgba(16,185,129,0.3)'}}>
                    {finalizando?<RefreshCw size={13} className="animate-spin"/>:<CheckCircle size={13}/>}
                    Finalizar + Exportar
                  </button>
                </div>
              </div>

              {/* Leitor Unificado e Busca de Produtos */}
              <div className="mt-3 relative z-20">
                <div className="flex items-center gap-3 p-3 rounded-2xl border-2" style={{borderColor:'var(--accent)',backgroundColor:'rgba(59,130,246,0.05)'}}>
                  <Barcode size={16} style={{color:'var(--accent)',flexShrink:0}}/>
                  <input ref={inputLeitorRef} value={buscaAdd} onChange={e=>setBuscaAdd(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&buscaAdd.trim()&&processarBusca()}
                    placeholder="Bipar item ou digitar id/nome..." className="flex-1 bg-transparent border-none outline-none font-mono text-sm uppercase"
                    style={{color:'var(--text-primary)'}} autoFocus/>
                  {buscaAdd && <button onClick={processarBusca} style={{padding:'0.3rem 0.75rem',borderRadius:'0.5rem',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,border:'none',cursor:'pointer'}}>BUSCAR</button>}
                </div>
                
                {produtosBusca.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-2xl border max-h-[300px] overflow-y-auto custom-scrollbar" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
                    {produtosBusca.slice(0,10).map(p=>(
                      <button key={p.codigo} onClick={()=>adicionarItemExtra(p)}
                        className="w-full flex justify-between items-center p-3 rounded-xl transition-all text-left"
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
                  </div>
                )}
                
                {feedbackLeitor && (
                  <div className="mt-2" style={{padding:'0.4rem 0.875rem',borderRadius:'0.75rem',fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',
                    backgroundColor:feedbackLeitor.tipo==='ok'?'rgba(16,185,129,0.1)':feedbackLeitor.tipo==='aviso'?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)',
                    color:feedbackLeitor.tipo==='ok'?'#10b981':feedbackLeitor.tipo==='aviso'?'#f59e0b':'#ef4444'}}>
                    {feedbackLeitor.msg}
                  </div>
                )}
              </div>
            </header>

            {/* ── LISTA DE ITENS DO PEDIDO ── */}
            {itensExibicao.length > 0 && (
              <div className="rounded-[24px] border overflow-hidden overflow-x-auto custom-scrollbar" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
                <div style={{padding:'0.6rem 1rem',backgroundColor:'rgba(59,130,246,0.08)',borderBottom:'1px solid var(--border)',minWidth:'600px'}}>
                  <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'var(--accent-bright)'}}>Itens para Separação ({itensExibicao.length})</span>
                </div>
                <table className="w-full text-left" style={{minWidth:'600px'}}>
                  <thead style={{backgroundColor:'var(--bg-elevated)'}}>
                    <tr style={{color:'var(--text-muted)',fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase'}}>
                      <th className="px-4 py-2">Produto</th>
                      <th className="px-4 py-2 text-center w-28">Prioridade</th>
                      <th className="px-4 py-2 text-center w-40">Qtd Enviada</th>
                      <th className="px-4 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensExibicao.map((item) => {
                      const realIdx = itensConferencia.findIndex(i => i.codigo === item.codigo);
                      const isZerado = Number(item.qtdEnviada || 0) <= 0;
                      
                      return (
                        <tr key={realIdx} style={{borderTop:'1px solid var(--border)',backgroundColor:item.extra?'rgba(59,130,246,0.03)':isZerado?'rgba(239,68,68,0.03)':'transparent'}}>
                          <td className="px-4 py-3">
                            <p style={{fontWeight:700,textTransform:'uppercase',fontSize:'0.7rem',lineHeight:1.3,color:isZerado?'#ef4444':'var(--text-primary)'}}>{item.nome}</p>
                            <div style={{display:'flex',gap:'0.4rem',marginTop:2}}>
                              <span style={{fontSize:'0.58rem',fontFamily:'monospace',color:'var(--text-muted)'}}>{item.codigo}</span>
                              {item.extra && <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 4px',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.1)',color:'var(--accent-bright)'}}>EXTRA</span>}
                              {isZerado && <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 4px',borderRadius:'999px',backgroundColor:'rgba(239,68,68,0.1)',color:'#ef4444'}}>FALTA</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center" style={{fontSize:'0.8rem',color:'#f59e0b'}}>
                            {'★'.repeat(item.prioridade||0)}{'☆'.repeat(3-(item.prioridade||0))}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={()=>setItensConferencia(itensConferencia.map((i,k)=>k===realIdx?{...i,qtdEnviada:Math.max(0,Number(i.qtdEnviada||0)-1)}:i))}
                                style={{padding:'0.4rem',borderRadius:'0.375rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',cursor:'pointer'}}>
                                <ChevronDown size={14}/>
                              </button>
                              
                              <input type="number" step="0.001"
                                className="text-center bg-transparent font-black border-none outline-none"
                                style={{
                                  color: isZerado ? '#ef4444' : 'var(--accent-bright)', 
                                  width: 80, 
                                  fontSize: '1.2rem'
                                }}
                                value={item.qtdEnviada}
                                onChange={e=>setItensConferencia(itensConferencia.map((i,k)=>k===realIdx?{...i,qtdEnviada:e.target.value}:i))}
                              />
                              
                              <button onClick={()=>setItensConferencia(itensConferencia.map((i,k)=>k===realIdx?{...i,qtdEnviada:Number(i.qtdEnviada||0)+1}:i))}
                                style={{padding:'0.4rem',borderRadius:'0.375rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',cursor:'pointer'}}>
                                <ChevronUp size={14}/>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {item.extra && (
                              <button onClick={()=>setItensConferencia(itensConferencia.filter((_,k)=>k!==realIdx))}
                                style={{color:'var(--text-muted)',cursor:'pointer'}}
                                onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                                onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                                <Trash2 size={15}/>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Rodapé contador */}
            <div style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0.25rem',fontSize:'0.65rem',fontWeight:700,color:'var(--text-muted)'}}>
              <span>{itensConferencia.filter(i => Number(i.qtdEnviada || 0) > 0).length} de {itensConferencia.length} itens atendidos</span>
              {itensConferencia.filter(i=>i.extra).length > 0 && (
                <span style={{color:'var(--accent-bright)'}}>+{itensConferencia.filter(i=>i.extra).length} extra(s)</span>
              )}
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