import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, RefreshCw, FileSpreadsheet, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import { BANCO_PADRAO } from '../data/bancoPadrao';
import { api } from '../services/api';

const limparCodigo = (v) => String(v ?? '').trim();
const converterPreco = (v) => { const n = parseFloat(String(v ?? '').trim().replace(',','.')); return isNaN(n) ? 0 : n; };
const fmt = (v) => Number(v).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });

const Badge = ({ tipo }) => {
  const cfg = {
    atualizado:     { label:'Com preço',     bg:'rgba(16,185,129,0.12)', color:'#10b981' },
    sem_preco:      { label:'Preço zerado',  bg:'rgba(245,158,11,0.12)', color:'#f59e0b' },
    nao_encontrado: { label:'Fora do banco', bg:'rgba(100,116,139,0.12)',color:'#64748b' },
  }[tipo] || {};
  return <span style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', padding:'2px 8px', borderRadius:'999px', backgroundColor:cfg.bg, color:cfg.color }}>{cfg.label}</span>;
};

const PaginaImportacao = ({ user }) => {
  const [etapa, setEtapa]           = useState('upload');
  const [arrastando, setArrastando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [salvando, setSalvando]     = useState(false);
  const [resultados, setResultados] = useState([]);
  const [resumo, setResumo]         = useState(null);
  const [filtro, setFiltro]         = useState('todos');
  const inputRef = useRef();

  const idxBanco = {};
  Object.entries(BANCO_PADRAO).forEach(([nome, v]) => { idxBanco[limparCodigo(v.codigo)] = { ...v, nome }; });

  const lerArquivo = useCallback((file) => {
    setProcessando(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb  = XLSX.read(e.target.result, { type:'array' });
        const ws  = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:'' });
        let hi = raw.findIndex(r => r.some(c => String(c).toLowerCase().includes('código') || String(c).toLowerCase().includes('codigo')));
        if (hi === -1) hi = 0;
        const headers = raw[hi].map(h => String(h).toLowerCase());
        const iCod  = headers.findIndex(h => h.includes('código') || h.includes('codigo'));
        const iDesc = headers.findIndex(h => h.includes('descri'));
        const iPrec = headers.findIndex(h => h.includes('preço') || h.includes('preco') || h.includes('venda'));
        if (iCod === -1) { alert('Coluna "Código" não encontrada.'); setProcessando(false); return; }
        const dados = raw.slice(hi + 1).filter(r => r[iCod] && String(r[iCod]).trim())
          .map(r => ({ codigo: limparCodigo(r[iCod]), descricao: iDesc !== -1 ? String(r[iDesc]??'').trim() : '', preco: iPrec !== -1 ? converterPreco(r[iPrec]) : 0 }))
          .filter(r => r.codigo);
        cruzar(dados);
      } catch (err) { alert('Erro ao ler o arquivo: ' + err.message); setProcessando(false); }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const cruzar = (dados) => {
    let qtdAtualizado = 0, qtdSemPreco = 0, qtdForaBanco = 0;
    const res = dados.map(linha => {
      const item = idxBanco[linha.codigo];
      if (!item) { qtdForaBanco++; return { ...linha, status:'nao_encontrado', nomeBanco:'—', categoria:'—' }; }
      if (!linha.preco) { qtdSemPreco++; return { ...linha, status:'sem_preco', nomeBanco:item.nome, categoria:item.categoria }; }
      qtdAtualizado++;
      return { ...linha, status:'atualizado', nomeBanco:item.nome, categoria:item.categoria };
    });
    setResultados(res);
    setResumo({ qtdAtualizado, qtdSemPreco, qtdForaBanco, total:dados.length });
    setEtapa('preview');
    setProcessando(false);
  };

  const confirmarImportacao = async () => {
    setSalvando(true);
    try {
      // 1. Monta mapa { codigo: preco }
      const mapa = {};
      resultados.forEach(r => { if (r.status === 'atualizado') mapa[r.codigo] = r.preco; });

      // 2. Envia para o server — salva no MongoDB
      const result = await api.precos.importar(mapa);
      if (!result.ok) throw new Error('Falha no server');

      // 3. Atualiza localStorage como cache local para acesso offline
      const anteriores = JSON.parse(localStorage.getItem('precos_cdc') || '{}');
      localStorage.setItem('precos_cdc', JSON.stringify({ ...anteriores, ...mapa }));
      // 4. Salva timestamp da última importação
      localStorage.setItem('precos_data_importacao', new Date().toISOString());

      setResumo(prev => ({ ...prev, aplicados: Object.keys(mapa).length }));
      setEtapa('resultado');
    } catch (err) {
      alert('Erro ao salvar no servidor: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  const onDrop = (e) => { e.preventDefault(); setArrastando(false); const f = e.dataTransfer.files[0]; if (f) lerArquivo(f); };
  const reset  = () => { setEtapa('upload'); setResultados([]); setResumo(null); setFiltro('todos'); };
  const linhasFiltradas = filtro === 'todos' ? resultados : resultados.filter(r => r.status === filtro);

  return (
    <div className="space-y-8 animate-in fade-in" style={{ color:'var(--text-primary)' }}>
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color:'var(--text-primary)' }}>Importação de Preços</h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color:'var(--text-muted)' }}>Preços salvos no servidor MongoDB — disponíveis para todas as filiais</p>
      </header>

      {etapa === 'upload' && (
        <div onDrop={onDrop} onDragOver={e=>{e.preventDefault();setArrastando(true);}} onDragLeave={()=>setArrastando(false)} onClick={()=>inputRef.current.click()}
          style={{ border:`2px dashed ${arrastando?'var(--accent)':'var(--border-bright)'}`, borderRadius:'2rem', padding:'5rem 3rem', textAlign:'center', cursor:'pointer', backgroundColor:arrastando?'rgba(59,130,246,0.05)':'var(--bg-card)', transition:'all 0.2s' }}>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{display:'none'}} onChange={e=>e.target.files[0]&&lerArquivo(e.target.files[0])} />
          {processando ? <RefreshCw size={48} className="mx-auto mb-4 animate-spin" style={{color:'var(--accent)'}} /> : <FileSpreadsheet size={48} className="mx-auto mb-4" style={{color:'var(--accent-bright)'}} />}
          <p className="font-black uppercase text-sm" style={{color:'var(--text-primary)'}}>{processando?'Processando...':'Arraste o Layout de Importação aqui'}</p>
          <p className="text-[10px] font-bold uppercase mt-2" style={{color:'var(--text-muted)'}}>ou clique para selecionar • .xlsx / .xls</p>
          <div style={{marginTop:'1.5rem',display:'inline-flex',gap:'0.5rem',alignItems:'center',padding:'0.75rem 1.25rem',borderRadius:'1rem',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.7rem',fontWeight:600}}>
            <Info size={14} /> Preços salvos no MongoDB — sincronizado com todas as filiais
          </div>
        </div>
      )}

      {etapa === 'preview' && resumo && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[{label:'Com preço',val:resumo.qtdAtualizado,cor:'#10b981'},{label:'Preço zerado',val:resumo.qtdSemPreco,cor:'#f59e0b'},{label:'Fora do banco',val:resumo.qtdForaBanco,cor:'#64748b'}].map(c=>(
              <div key={c.label} style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.25rem',padding:'1.5rem'}}>
                <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',letterSpacing:'0.1em'}}>{c.label}</p>
                <p style={{fontSize:'2rem',fontWeight:900,color:c.cor,marginTop:'0.25rem'}}>{c.val}</p>
              </div>
            ))}
          </div>

          <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',backgroundColor:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'1rem',padding:'1rem 1.25rem'}}>
            <Info size={16} style={{color:'var(--accent-bright)',flexShrink:0,marginTop:2}} />
            <p style={{fontSize:'0.7rem',fontWeight:600,color:'var(--text-secondary)',lineHeight:1.6}}>
              <strong style={{color:'#10b981'}}>{resumo.qtdAtualizado} preços</strong> serão salvos no <strong>MongoDB</strong> e ficam disponíveis instantaneamente para todas as filiais em Pedidos, Transferência e Atendimento.
            </p>
          </div>

          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {[{k:'todos',label:`Todos (${resultados.length})`},{k:'atualizado',label:`✓ Com preço (${resumo.qtdAtualizado})`},{k:'sem_preco',label:`— Zerado (${resumo.qtdSemPreco})`},{k:'nao_encontrado',label:`✗ Fora banco (${resumo.qtdForaBanco})`}].map(f=>(
                <button key={f.k} onClick={()=>setFiltro(f.k)} style={{padding:'0.4rem 1rem',borderRadius:'999px',border:'1px solid var(--border)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',backgroundColor:filtro===f.k?'var(--accent)':'var(--bg-elevated)',color:filtro===f.k?'#fff':'var(--text-secondary)',transition:'all 0.15s'}}>{f.label}</button>
              ))}
            </div>

            <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end'}}>
              <button onClick={reset} style={{padding:'0.6rem 1.5rem',borderRadius:'0.875rem',border:'1px solid var(--border)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)'}}>Cancelar</button>
              <button onClick={confirmarImportacao} disabled={resumo.qtdAtualizado===0||salvando} style={{padding:'0.6rem 2rem',borderRadius:'0.875rem',border:'none',fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',cursor:resumo.qtdAtualizado>0?'pointer':'not-allowed',backgroundColor:resumo.qtdAtualizado>0?'var(--accent)':'var(--bg-elevated)',color:resumo.qtdAtualizado>0?'#fff':'var(--text-muted)',boxShadow:resumo.qtdAtualizado>0?'0 4px 20px var(--accent-glow)':'none',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                {salvando && <RefreshCw size={14} className="animate-spin"/>}
                {salvando ? 'Salvando...' : `Confirmar Importação (${resumo.qtdAtualizado})`}
              </button>
            </div>
          </div>

          <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',overflow:'hidden'}}>
            <div style={{overflowX:'auto',maxHeight:'55vh',overflowY:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.7rem'}}>
                <thead>
                  <tr style={{backgroundColor:'var(--bg-elevated)',position:'sticky',top:0,zIndex:1}}>
                    {['Código','Nome no Banco CDC','Descrição do Layout','Categoria','Preço','Status'].map(h=>(
                      <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-muted)',whiteSpace:'nowrap',borderBottom:'1px solid var(--border)'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhasFiltradas.map((r,i)=>(
                    <tr key={i} style={{borderTop:'1px solid var(--border)'}}>
                      <td style={{padding:'0.6rem 1rem',fontWeight:700,color:'var(--accent-bright)',whiteSpace:'nowrap'}}>{r.codigo}</td>
                      <td style={{padding:'0.6rem 1rem',fontWeight:600,color:'var(--text-primary)',maxWidth:220}}>{r.nomeBanco}</td>
                      <td style={{padding:'0.6rem 1rem',color:'var(--text-secondary)',maxWidth:220}}>{r.descricao}</td>
                      <td style={{padding:'0.6rem 1rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{r.categoria}</td>
                      <td style={{padding:'0.6rem 1rem',fontWeight:800,color:'#10b981',textAlign:'right',whiteSpace:'nowrap'}}>{r.preco?fmt(r.preco):'—'}</td>
                      <td style={{padding:'0.6rem 1rem',whiteSpace:'nowrap'}}><Badge tipo={r.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      )}

      {etapa === 'resultado' && resumo && (
        <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'2rem',padding:'4rem',textAlign:'center'}}>
          <CheckCircle size={64} className="mx-auto mb-6" style={{color:'#10b981'}} />
          <h3 style={{fontSize:'1.75rem',fontWeight:900,textTransform:'uppercase',fontStyle:'italic',color:'var(--text-primary)'}}>Preços Salvos no Servidor!</h3>
          <p style={{marginTop:'0.5rem',fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--text-muted)'}}>{resumo.aplicados} preços no MongoDB — disponíveis para todas as filiais</p>
          <button onClick={reset} style={{marginTop:'2.5rem',padding:'0.875rem 2.5rem',borderRadius:'0.875rem',border:'none',fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',cursor:'pointer',backgroundColor:'var(--accent)',color:'#fff',boxShadow:'0 4px 20px var(--accent-glow)'}}>Nova Importação</button>
        </div>
      )}
    </div>
  );
};

export default PaginaImportacao;