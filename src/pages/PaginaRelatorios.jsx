import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Tag, Calendar, Filter, FileSpreadsheet, ChevronDown, ChevronRight, Clock, Printer, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getHistorico } from '../services/cache';

// ── Utilitários ───────────────────────────────────────────────────────────────
const parseDataBR = (str) => {
  if (!str) return 0;
  const p = str.match(/(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})/);
  if (!p) return 0;
  return new Date(`${p[3]}-${p[2]}-${p[1]}T${p[4]}:${p[5]}:00`).getTime();
};

const tempoDecorrido = (dataStr) => {
  if (!dataStr) return '—';
  const ts = parseDataBR(dataStr);
  if (!ts) return dataStr;
  const diff  = Date.now() - ts;
  if (isNaN(diff)) return '—';
  const min  = Math.floor(diff / 60000);
  const h    = Math.floor(min / 60);
  const d    = Math.floor(h / 24);
  if (d > 0)  return `${d}d ${h%24}h atrás`;
  if (h > 0)  return `${h}h ${min%60}min atrás`;
  return `${min}min atrás`;
};

// ── Geração do XLSX MBM ───────────────────────────────────────────────────────
const exportarXLSX = (pedido) => {
  const itens = [...(pedido.itens||[])]
    .filter(i => Number(i.qtdEnviada || 0) > 0)
    .sort((a,b)=>(a.nome||'').localeCompare(b.nome||''));
    
  const cab = [
    "Nro Ped. Cliente","Seq. Item","* Código Item (Reduzido)","* Código Item",
    "Descrição Item","* Qtde. Venda","Unid. Venda","Valor Unitário (Venda)",
    "Dt. Entrega","* Tipo Desconto (P/V)","% Desconto","Valor Desconto",
    "Código Nat. Op.","Descrição Nat. Operação","Código Tab. Preço",
    "Descrição Tab. Preço","% Config. Nat. Operação 1","% Config. Nat. Operação 2",
    "Item Ped. Cliente","Item Seq. Cliente"
  ];
  const rows = itens.map((item,i)=>{
    const r = new Array(20).fill("");
    r[0]=""; 
    r[1]=i+1; 
    r[2]={t: 's', v: String(item.codigo), z: '@'}; 
    r[3]={t: 's', v: String(item.codigo), z: '@'}; 
    r[4]=item.nome;
    r[5]=Number(item.qtdEnviada||item.qtd||0); 
    r[6]=item.unidade; 
    r[9]="V";
    return r;
  });
  const ws = XLSX.utils.aoa_to_sheet([cab,...rows]);
  ws['!cols']=[{wch:15},{wch:10},{wch:20},{wch:20},{wch:40},{wch:15},{wch:10},{wch:15},{wch:15},{wch:18}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Importacao_PV");
  XLSX.writeFile(wb, `PEDIDO_${pedido.idExterno||pedido.id}_MBM.xlsx`);
};

// ── Impressão de relatório ────────────────────────────────────────────────────
const ImprimirRelatorio = ({ pedidos, onFechar }) => {
  const todos = [...pedidos].sort((a,b)=>(a.cliente||'').localeCompare(b.cliente||''));
  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-auto" style={{color:'#000',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:900,margin:'0 auto',padding:'2rem'}}>
        <div className="flex gap-3 mb-6 print:hidden">
          <button onClick={()=>window.print()} style={{padding:'0.75rem 1.5rem',backgroundColor:'#1e40af',color:'#fff',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Printer size={16}/> Imprimir
          </button>
          <button onClick={onFechar} style={{padding:'0.75rem 1.5rem',backgroundColor:'#f1f5f9',color:'#475569',borderRadius:'0.75rem',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',border:'none'}}>
            Fechar
          </button>
        </div>

        <div style={{borderBottom:'2px solid #000',paddingBottom:'1rem',marginBottom:'1.5rem'}}>
          <h1 style={{fontSize:'1.4rem',fontWeight:900,textTransform:'uppercase',margin:0}}>CÓDIGO DA CARNE — Relatório de Atendimentos</h1>
          <p style={{fontSize:'0.7rem',color:'#475569',margin:'0.25rem 0 0'}}>Gerado em {new Date().toLocaleString()} · {pedidos.length} pedido(s)</p>
        </div>

        {todos.map((reg, ri) => {
          const atendidos    = (reg.itens||[]).filter(i => Number(i.qtdEnviada || 0) > 0).sort((a,b)=>(b.prioridade||0)-(a.prioridade||0)||(a.nome||'').localeCompare(b.nome||''));
          const naoAtendidos = (reg.itens||[]).filter(i => Number(i.qtdEnviada || 0) <= 0).sort((a,b)=>(a.nome||'').localeCompare(b.nome||''));
          return (
            <div key={ri} style={{marginBottom:'2rem',breakInside:'avoid'}}>
              <div style={{backgroundColor:'#1e293b',color:'#fff',padding:'0.6rem 0.875rem',borderRadius:'0.5rem 0.5rem 0 0',display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}>
                <span style={{fontWeight:800,textTransform:'uppercase'}}>#{reg.idExterno} — {reg.cliente}</span>
                <span style={{opacity:0.7}}>{reg.data} · {reg.atendidoPor||'—'}</span>
              </div>
              {atendidos.length>0 && (
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.68rem',borderLeft:'3px solid #16a34a'}}>
                  <thead style={{backgroundColor:'#f0fdf4'}}>
                    <tr>
                      {['#','Produto','Código','Prioridade','Qtd'].map(h=>(
                        <th key={h} style={{padding:'0.4rem 0.6rem',textAlign:'left',fontWeight:700,textTransform:'uppercase',fontSize:'0.6rem',color:'#16a34a'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {atendidos.map((item,i)=>(
                      <tr key={i} style={{borderTop:'1px solid #dcfce7',backgroundColor:i%2===0?'#fff':'#f0fdf4'}}>
                        <td style={{padding:'0.35rem 0.6rem',color:'#94a3b8'}}>{i+1}</td>
                        <td style={{padding:'0.35rem 0.6rem',fontWeight:600,textTransform:'uppercase'}}>{item.nome}</td>
                        <td style={{padding:'0.35rem 0.6rem',fontFamily:'monospace',color:'#475569'}}>{item.codigo}</td>
                        <td style={{padding:'0.35rem 0.6rem',color:'#f59e0b'}}>{'★'.repeat(item.prioridade||0)}{'☆'.repeat(3-(item.prioridade||0))}</td>
                        <td style={{padding:'0.35rem 0.6rem',fontWeight:700}}>{Number(item.qtdEnviada||item.qtd||0)} {item.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {naoAtendidos.length>0 && (
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.68rem',borderLeft:'3px solid #dc2626',marginTop:4}}>
                  <thead style={{backgroundColor:'#fff7f7'}}>
                    <tr>
                      {['#','Produto (NÃO ATENDIDO)','Código','Prioridade'].map(h=>(
                        <th key={h} style={{padding:'0.4rem 0.6rem',textAlign:'left',fontWeight:700,textTransform:'uppercase',fontSize:'0.6rem',color:'#dc2626'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {naoAtendidos.map((item,i)=>(
                      <tr key={i} style={{borderTop:'1px solid #fecaca'}}>
                        <td style={{padding:'0.35rem 0.6rem',color:'#94a3b8'}}>{i+1}</td>
                        <td style={{padding:'0.35rem 0.6rem',fontWeight:600,textTransform:'uppercase'}}>{item.nome}</td>
                        <td style={{padding:'0.35rem 0.6rem',fontFamily:'monospace',color:'#475569'}}>{item.codigo}</td>
                        <td style={{padding:'0.35rem 0.6rem',color:'#f59e0b'}}>{'★'.repeat(item.prioridade||0)}{'☆'.repeat(3-(item.prioridade||0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
        <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
      </div>
    </div>
  );
};

// ── Card de relatório ─────────────────────────────────────────────────────────
const CardRelatorio = ({ reg }) => {
  const [aberto, setAberto] = useState(false);

  const atendidos    = useMemo(()=>[...(reg.itens||[])].filter(i => Number(i.qtdEnviada || 0) > 0).sort((a,b)=>(b.prioridade||0)-(a.prioridade||0)||(a.nome||'').localeCompare(b.nome||'')), [reg]);
  const naoAtendidos = useMemo(()=>[...(reg.itens||[])].filter(i => Number(i.qtdEnviada || 0) <= 0).sort((a,b)=>(a.nome||'').localeCompare(b.nome||'')), [reg]);

  return (
    <div className="rounded-[32px] border overflow-hidden transition-all" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>

      {/* Header clicável */}
      <button onClick={()=>setAberto(!aberto)} className="w-full text-left p-6 transition-all"
        onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
        onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div style={{padding:'0.75rem',borderRadius:'0.875rem',backgroundColor:reg.tipo==='TRANSFERENCIA_AVULSA'?'rgba(249,115,22,0.1)':'rgba(59,130,246,0.1)',flexShrink:0}}>
              {reg.tipo==='TRANSFERENCIA_AVULSA' ? <Tag size={20} style={{color:'#f97316'}}/> : <ShoppingCart size={20} style={{color:'var(--accent-bright)'}}/>}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)'}}>#{reg.idExterno||reg.id} · {reg.data}</span>
                {naoAtendidos.length > 0 && (
                  <span style={{fontSize:'0.55rem',fontWeight:700,padding:'1px 6px',borderRadius:'999px',backgroundColor:'rgba(239,68,68,0.1)',color:'#ef4444',textTransform:'uppercase'}}>
                    {naoAtendidos.length} não atendido{naoAtendidos.length>1?'s':''}
                  </span>
                )}
              </div>
              <h3 className="font-black uppercase text-sm leading-tight" style={{color:'var(--text-primary)'}}>{reg.cliente}</h3>
              <p style={{fontSize:'0.6rem',marginTop:2,color:'var(--text-muted)'}}>
                {reg.unidadeOrigem && `${reg.unidadeOrigem} → ${reg.filial||reg.destino||'—'} · `}
                Atendido por: {reg.atendidoPor||'—'} · {reg.dataAtendimento||'—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Badges resumo */}
            <div style={{display:'flex',gap:'0.3rem',alignItems:'center'}}>
              {atendidos.length > 0 && (
                <span style={{display:'flex',alignItems:'center',gap:'0.2rem',fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'rgba(16,185,129,0.1)',color:'#10b981'}}>
                  <CheckCircle size={10}/> {atendidos.length}
                </span>
              )}
              {naoAtendidos.length > 0 && (
                <span style={{display:'flex',alignItems:'center',gap:'0.2rem',fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'rgba(239,68,68,0.1)',color:'#ef4444'}}>
                  <XCircle size={10}/> {naoAtendidos.length}
                </span>
              )}
            </div>
            <button onClick={e=>{e.stopPropagation();exportarXLSX(reg);}}
              style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.4rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'#16a34a',color:'#fff',fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',border:'none',cursor:'pointer'}}>
              <FileSpreadsheet size={13}/> MBM
            </button>
            {aberto ? <ChevronDown size={16} style={{color:'var(--text-muted)'}}/> : <ChevronRight size={16} style={{color:'var(--text-muted)'}}/> }
          </div>
        </div>
      </button>

      {/* Conteúdo expandido */}
      {aberto && (
        <div style={{borderTop:'1px solid var(--border)',padding:'1rem'}}>

          {/* Atendidos */}
          {atendidos.length > 0 && (
            <div className="mb-4">
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                <CheckCircle size={14} style={{color:'#10b981'}}/>
                <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#10b981'}}>Atendidos — {atendidos.length} itens</span>
              </div>
              <div style={{borderRadius:'0.875rem',overflow:'hidden',overflowX:'auto',border:'1px solid rgba(16,185,129,0.2)'}} className="custom-scrollbar">
                <table style={{width:'100%',minWidth:'500px',borderCollapse:'collapse',fontSize:'0.68rem'}}>
                  <thead style={{backgroundColor:'rgba(16,185,129,0.06)'}}>
                    <tr style={{color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',fontSize:'0.58rem'}}>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'left'}}>Produto</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'left'}}>Código</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'center'}}>Prioridade</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'right'}}>Qtd Enviada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendidos.map((item,i)=>(
                      <tr key={i} style={{borderTop:'1px solid rgba(16,185,129,0.1)'}}>
                        <td style={{padding:'0.4rem 0.75rem',fontWeight:600,textTransform:'uppercase',color:'var(--text-primary)'}}>{item.nome}</td>
                        <td style={{padding:'0.4rem 0.75rem',fontFamily:'monospace',fontSize:'0.62rem',color:'var(--text-muted)'}}>{item.codigo}</td>
                        <td style={{padding:'0.4rem 0.75rem',textAlign:'center',color:'#f59e0b'}}>{'★'.repeat(item.prioridade||0)}{'☆'.repeat(3-(item.prioridade||0))}</td>
                        <td style={{padding:'0.4rem 0.75rem',textAlign:'right',fontWeight:700,color:'#10b981'}}>{Number(item.qtdEnviada||item.qtd||0)} {item.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Não atendidos */}
          {naoAtendidos.length > 0 && (
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                <XCircle size={14} style={{color:'#ef4444'}}/>
                <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#ef4444'}}>Não Atendidos — {naoAtendidos.length} itens</span>
              </div>
              <div style={{borderRadius:'0.875rem',overflow:'hidden',overflowX:'auto',border:'1px solid rgba(239,68,68,0.2)'}} className="custom-scrollbar">
                <table style={{width:'100%',minWidth:'500px',borderCollapse:'collapse',fontSize:'0.68rem'}}>
                  <thead style={{backgroundColor:'rgba(239,68,68,0.04)'}}>
                    <tr style={{color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',fontSize:'0.58rem'}}>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'left'}}>Produto</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'left'}}>Código</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'center'}}>Prioridade</th>
                      <th style={{padding:'0.4rem 0.75rem',textAlign:'right',color:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:4}}>
                        <Clock size={11}/> Há quanto tempo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {naoAtendidos.map((item,i)=>(
                      <tr key={i} style={{borderTop:'1px solid rgba(239,68,68,0.1)'}}>
                        <td style={{padding:'0.4rem 0.75rem',fontWeight:600,textTransform:'uppercase',color:'var(--text-primary)'}}>{item.nome}</td>
                        <td style={{padding:'0.4rem 0.75rem',fontFamily:'monospace',fontSize:'0.62rem',color:'var(--text-muted)'}}>{item.codigo}</td>
                        <td style={{padding:'0.4rem 0.75rem',textAlign:'center',color:'#f59e0b'}}>{'★'.repeat(item.prioridade||0)}{'☆'.repeat(3-(item.prioridade||0))}</td>
                        <td style={{padding:'0.4rem 0.75rem',textAlign:'right'}}>
                          <span style={{display:'inline-flex',alignItems:'center',gap:'0.25rem',fontSize:'0.6rem',fontWeight:700,padding:'2px 7px',borderRadius:'999px',backgroundColor:'rgba(245,158,11,0.1)',color:'#d97706'}}>
                            <Clock size={9}/> {tempoDecorrido(reg.dataAtendimento||reg.data)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
const PaginaRelatorios = ({ user }) => {
  const [pesquisa, setPesquisa]   = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroFilial, setFiltroFilial] = useState('TODAS');
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);

  const isAdminOrEstoque = user?.cargo === 'master' || user?.cargo === 'adm' || user?.cargo === 'estoque' || user?.cargo === 'gestorestoque';
  const filialUsuario = user?.unidade || '';

  const carregar = async () => {
    setCarregando(true);
    try { 
      const d = await getHistorico(); 
      setHistorico([...d].sort((a,b) => parseDataBR(b.data) - parseDataBR(a.data))); 
    }
    catch { 
      const d = JSON.parse(localStorage.getItem('historico_pedidos')||'[]');
      setHistorico([...d].sort((a,b) => parseDataBR(b.data) - parseDataBR(a.data))); 
    }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregar(); }, []);

  const dadosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return [...historico]
      .filter(reg => {
        if (!reg) return false;
        const matchTipo = filtroTipo==='TODOS' || reg.tipo===filtroTipo;
        const matchData = !filtroData || (reg.data&&reg.data.includes(filtroData));
        const matchFilialCombo = filtroFilial==='TODAS' || reg.filial===filtroFilial || reg.destino===filtroFilial || reg.unidadeOrigem===filtroFilial;
        const matchRestricaoRole = isAdminOrEstoque || reg.filial===filialUsuario || reg.destino===filialUsuario || reg.unidadeOrigem===filialUsuario;
        
        const matchTexto =
          (reg.idExterno?.toString().toLowerCase().includes(termo)) ||
          (reg.id?.toString().toLowerCase().includes(termo)) ||
          (reg.cliente?.toLowerCase().includes(termo)) ||
          (reg.itens?.some(i=>i.nome?.toLowerCase().includes(termo)||i.codigo?.toString().includes(termo)));
          
        return matchTipo && matchData && matchFilialCombo && matchRestricaoRole && matchTexto;
      });
      // A ordem base já vem invertida cronologicamente (último feito no topo).
  }, [pesquisa, filtroData, filtroTipo, historico]);

  const totalNaoAtendidos = useMemo(()=>
    dadosFiltrados.reduce((acc,r)=>acc+(r.itens||[]).filter(i => Number(i.qtdEnviada || 0) <= 0).length,0)
  , [dadosFiltrados]);

  return (
    <div className="space-y-6 animate-in fade-in" style={{color:'var(--text-primary)'}}>

      {imprimindo && <ImprimirRelatorio pedidos={dadosFiltrados} onFechar={()=>setImprimindo(false)}/>}

      {/* Cabeçalho */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>Relatórios</h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4}}>
            {dadosFiltrados.length} pedido(s) · Mais recentes primeiro
            {totalNaoAtendidos > 0 && <span style={{color:'#ef4444',marginLeft:8}}>· {totalNaoAtendidos} item(ns) não atendido(s)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={carregar}
            style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 0.875rem',borderRadius:'0.875rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,cursor:'pointer'}}>
            <RefreshCw size={13} className={carregando?'animate-spin':''}/> Atualizar
          </button>
          <button onClick={()=>setImprimindo(true)}
            style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 0.875rem',borderRadius:'0.875rem',border:'none',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px var(--accent-glow)'}}>
            <Printer size={13}/> Imprimir Relatório
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5 rounded-[28px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
        <div className="space-y-1.5">
          <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',paddingLeft:4}}>Pesquisa</label>
          <div className="flex items-center gap-2 p-3 rounded-2xl" style={{backgroundColor:'var(--bg-elevated)'}}>
            <Search size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
            <input type="text" placeholder="ID, cliente ou produto..." className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase" style={{color:'var(--text-primary)'}} value={pesquisa} onChange={e=>setPesquisa(e.target.value)}/>
          </div>
        </div>
        <div className="space-y-1.5">
          <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',paddingLeft:4}}>Data</label>
          <div className="flex items-center gap-2 p-3 rounded-2xl" style={{backgroundColor:'var(--bg-elevated)'}}>
            <Calendar size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
            <input type="text" placeholder="DD/MM/AAAA" className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase" style={{color:'var(--text-primary)'}} value={filtroData} onChange={e=>setFiltroData(e.target.value)}/>
          </div>
        </div>
        <div className="space-y-1.5">
          <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',paddingLeft:4}}>Tipo</label>
          <div className="flex items-center gap-2 p-3 rounded-2xl" style={{backgroundColor:'var(--bg-elevated)'}}>
            <Filter size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
            <select className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase" style={{color:'var(--text-primary)'}} value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}>
              <option value="TODOS">Todos os tipos</option>
              <option value="PEDIDO_LOJA">Pedido de Loja</option>
              <option value="TRANSFERENCIA_AVULSA">Transferência</option>
            </select>
          </div>
        </div>
      </div>
      
      {isAdminOrEstoque && (
        <div className="p-5 mt-3 rounded-[28px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
           <div className="space-y-1.5 max-w-sm">
             <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',paddingLeft:4}}>Filial</label>
             <div className="flex items-center gap-2 p-3 rounded-2xl" style={{backgroundColor:'var(--bg-elevated)'}}>
               <Filter size={14} style={{color:'var(--text-muted)',flexShrink:0}}/>
               <select className="bg-transparent border-none outline-none w-full text-xs font-bold uppercase" style={{color:'var(--text-primary)'}} value={filtroFilial} onChange={e=>setFiltroFilial(e.target.value)}>
                 <option value="TODAS">Todas as Filiais</option>
                 {Array.from(new Set(historico.map(r=>r.filial||r.destino||r.unidadeOrigem).filter(Boolean))).sort().map(fil => (
                   <option key={fil} value={fil}>{fil}</option>
                 ))}
               </select>
             </div>
           </div>
        </div>
      )}

      {/* Lista de relatórios — fechados por padrão */}
      <div className="space-y-3">
        {dadosFiltrados.map(reg => <CardRelatorio key={reg.idExterno||reg.id} reg={reg}/>)}
        {dadosFiltrados.length === 0 && !carregando && (
          <div className="py-20 text-center opacity-30">
            <Search size={40} className="mx-auto mb-3" style={{color:'var(--text-muted)'}}/>
            <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Nenhum registro encontrado</p>
          </div>
        )}
        {carregando && (
          <div className="py-12 text-center opacity-30"><RefreshCw size={28} className="mx-auto animate-spin" style={{color:'var(--text-muted)'}}/></div>
        )}
      </div>
    </div>
  );
};

export default PaginaRelatorios;