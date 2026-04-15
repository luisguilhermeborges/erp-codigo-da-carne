import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Package, Tag, RefreshCw, Upload, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getEstoque, getHistorico, getPrecos } from '../services/cache';
import { api } from '../services/api';

const PaginaBuscador = () => {
  const [termo, setTermo]                     = useState('');
  const [catalogo, setCatalogo]               = useState([]);
  const [mapaDatas, setMapaDatas]             = useState({});
  const [carregando, setCarregando]           = useState(true);
  const [importando, setImportando]           = useState(false);
  const [ultimaImportacao, setUltimaImportacao] = useState(null);
  const [avisoImport, setAvisoImport]         = useState(null); // { tipo, msg }
  const fileInputRef = useRef();

  // ── Carregar data da última importação do localStorage ──
  useEffect(() => {
    const salvo = localStorage.getItem('ultima_importacao_layout');
    if (salvo) setUltimaImportacao(new Date(salvo));
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const [dados, hist] = await Promise.all([
        getEstoque({ apenasComPreco: false }),
        getHistorico().catch(()=>[])
      ]);
      setCatalogo(dados);

      const mapa = {};
      hist.forEach(ped => {
        const strData = (ped.data || '').split(',')[0];
        const p = strData.split('/');
        if (p.length === 3) {
          const d = new Date(`${p[2]}-${p[1]}-${p[0]}T00:00:00`);
          if (!isNaN(d)) {
            (ped.itens||[]).forEach(i => {
              const cod = String(i.codigo);
              if (!mapa[cod] || d > mapa[cod]) mapa[cod] = d;
            });
          }
        }
      });
      setMapaDatas(mapa);
    } catch (error) {
      console.error("Erro ao carregar catálogo", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const getTempoTexto = (data) => {
    if (!data) return "Nunca pedido";
    const hj = new Date(); hj.setHours(0,0,0,0);
    const dt = new Date(data); dt.setHours(0,0,0,0);
    const dias = Math.floor((hj - dt) / 86400000);
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Ontem";
    return `Há ${dias} dias`;
  };

  const getTempoImportacao = (data) => {
    if (!data) return null;
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH   = Math.floor(diffMs / 3600000);
    const diffD   = Math.floor(diffMs / 86400000);
    if (diffMin < 1)  return 'Agora mesmo';
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffH < 24)   return `Há ${diffH}h`;
    if (diffD === 1)  return 'Ontem';
    return `Há ${diffD} dias`;
  };

  // ── Importar Layout de Importação ──────────────────────────────────────────
  const handleImportarLayout = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // Reset input
    setImportando(true);
    setAvisoImport(null);
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      // Encontrar linha de cabeçalho
      let headerRow = -1;
      for (let i = 0; i < Math.min(10, rows.length); i++) {
        const rowArr = rows[i].map(c => String(c).toLowerCase().trim());
        if (rowArr.some(c => c.includes('código') || c.includes('codigo') || c === 'cod') &&
            rowArr.some(c => c.includes('preço') || c.includes('preco') || c.includes('venda'))) {
          headerRow = i;
          break;
        }
      }

      let codIdx = -1, precoIdx = -1;

      if (headerRow >= 0) {
        const header = rows[headerRow].map(c => String(c).toLowerCase().trim());
        // Identificar colunas
        codIdx = header.findIndex(c => c.includes('código item') || c.includes('codigo item') || c === 'código' || c === 'codigo' || c === 'cod');
        if (codIdx === -1) codIdx = header.findIndex(c => c.includes('código') || c.includes('codigo'));
        precoIdx = header.indexOf('preço venda');
        if (precoIdx === -1) precoIdx = header.indexOf('preco venda');
        if (precoIdx === -1) precoIdx = header.findIndex(c => c.includes('preço') && c.includes('venda'));
        if (precoIdx === -1) precoIdx = header.findIndex(c => c.includes('venda'));
        if (precoIdx === -1) precoIdx = header.findIndex(c => c.includes('preço') || c.includes('preco') || c.includes('unitário') || c.includes('unitario'));
      } else {
        // Tentar detectar automaticamente: coluna com zeros à esq e coluna numérica subsequente
        headerRow = 0;
        if (rows.length > 1) {
          const sample = rows.slice(1, 10);
          // Identificar coluna de código (valores numéricos com zeros principais)
          for (let ci = 0; ci < (rows[0]?.length || 0); ci++) {
            const vals = sample.map(r => String(r[ci]||'').trim()).filter(v=>v.length>0);
            if (vals.every(v => /^\d{4,}$/.test(v))) { codIdx = ci; break; }
          }
          // Identificar coluna de preço (valores decimais)
          for (let ci = 0; ci < (rows[0]?.length || 0); ci++) {
            if (ci === codIdx) continue;
            const vals = sample.map(r => r[ci]).filter(v=>v!=='');
            if (vals.every(v => !isNaN(Number(String(v).replace(',','.'))) && Number(String(v).replace(',','.')) > 0)) {
              precoIdx = ci; break;
            }
          }
        }
      }

      if (codIdx === -1 || precoIdx === -1) {
        setAvisoImport({ tipo:'erro', msg:'Não foi possível identificar as colunas de Código e Preço no arquivo. Verifique o formato.' });
        setImportando(false);
        return;
      }

      // Montar mapa de preços
      const mapa = {};
      const dataRows = rows.slice(headerRow + 1);
      dataRows.forEach(row => {
        const cod   = String(row[codIdx] || '').trim();
        const preco = parseFloat(String(row[precoIdx] || '').replace(',', '.'));
        if (cod && !isNaN(preco) && preco > 0) {
          mapa[cod] = preco;
        }
      });

      if (Object.keys(mapa).length === 0) {
        setAvisoImport({ tipo:'erro', msg:'Nenhum preço encontrado no arquivo. Verifique se o layout está correto.' });
        setImportando(false);
        return;
      }

      // Enviar para API
      const resultado = await api.precos.importar(mapa);
      const agora = new Date();
      localStorage.setItem('ultima_importacao_layout', agora.toISOString());
      setUltimaImportacao(agora);
      setAvisoImport({ tipo:'sucesso', msg:`✅ ${resultado.atualizados || Object.keys(mapa).length} preços atualizados com sucesso!` });

      // Recarregar catálogo com novos preços
      await carregarProdutos();
    } catch (err) {
      console.error(err);
      setAvisoImport({ tipo:'erro', msg:'Erro ao processar o arquivo. Verifique se é um Excel válido.' });
    } finally {
      setImportando(false);
    }
  };

  const produtosFiltrados = useMemo(() => {
    if (!termo.trim()) return catalogo;
    const busca = termo.toLowerCase();
    return catalogo.filter(p =>
      (p.nome && p.nome.toLowerCase().includes(busca)) ||
      (p.codigo && p.codigo.includes(busca)) ||
      (p.pai && p.pai.toLowerCase().includes(busca)) ||
      (p.filho && p.filho.toLowerCase().includes(busca))
    );
  }, [termo, catalogo]);

  // Alerta de preços desatualizados (> 7 dias)
  const precosDesatualizados = ultimaImportacao
    ? Math.floor((new Date() - ultimaImportacao) / 86400000) > 7
    : true;

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">

      {/* ── CABEÇALHO ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>
            Consulta de Produtos
          </h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4}}>
            {produtosFiltrados.length} produto(s) encontrado(s) no catálogo
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Data da última importação */}
          {ultimaImportacao && (
            <div style={{
              display:'flex',alignItems:'center',gap:'0.35rem',
              padding:'0.4rem 0.75rem',borderRadius:'0.75rem',
              backgroundColor: precosDesatualizados ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
              border: `1px solid ${precosDesatualizados ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
            }}>
              <Clock size={12} style={{color: precosDesatualizados?'#f59e0b':'#10b981',flexShrink:0}}/>
              <div>
                <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color: precosDesatualizados?'#d97706':'#059669'}}>
                  {precosDesatualizados ? 'Preços podem estar desatualizados' : 'Preços atualizados'}
                </p>
                <p style={{fontSize:'0.55rem',fontWeight:600,color:'var(--text-muted)'}}>
                  Última importação: {getTempoImportacao(ultimaImportacao)} · {ultimaImportacao.toLocaleDateString('pt-BR')} {ultimaImportacao.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
                </p>
              </div>
            </div>
          )}
          {!ultimaImportacao && (
            <div style={{display:'flex',alignItems:'center',gap:'0.35rem',padding:'0.4rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)'}}>
              <AlertCircle size={12} style={{color:'#ef4444'}}/>
              <p style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'#ef4444'}}>Nenhuma importação realizada</p>
            </div>
          )}

          {/* Importar Layout */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{display:'none'}}
            onChange={handleImportarLayout}
          />
          <button
            onClick={()=>fileInputRef.current?.click()}
            disabled={importando}
            style={{
              display:'flex',alignItems:'center',gap:'0.3rem',
              padding:'0.5rem 0.875rem',borderRadius:'0.75rem',
              border:'1px solid var(--accent)',
              backgroundColor:'rgba(59,130,246,0.08)',
              color:'var(--accent-bright)',
              fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',
              opacity: importando?0.7:1,
            }}>
            {importando
              ? <RefreshCw size={13} className="animate-spin"/>
              : <Upload size={13}/>
            }
            {importando ? 'Importando...' : 'Importar Layout'}
          </button>

          {/* Atualizar Base */}
          <button onClick={carregarProdutos} disabled={carregando}
            style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}>
            <RefreshCw size={13} className={carregando ? 'animate-spin' : ''}/> Atualizar Base
          </button>
        </div>
      </header>

      {/* Aviso de importação */}
      {avisoImport && (
        <div style={{
          display:'flex',alignItems:'center',gap:'0.5rem',
          padding:'0.6rem 1rem',borderRadius:'1rem',
          backgroundColor: avisoImport.tipo==='sucesso' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${avisoImport.tipo==='sucesso' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
        }}>
          {avisoImport.tipo==='sucesso'
            ? <CheckCircle size={16} style={{color:'#10b981',flexShrink:0}}/>
            : <AlertCircle size={16} style={{color:'#ef4444',flexShrink:0}}/>
          }
          <p style={{fontSize:'0.7rem',fontWeight:700,color: avisoImport.tipo==='sucesso'?'#10b981':'#ef4444',textTransform:'uppercase'}}>
            {avisoImport.msg}
          </p>
          <button onClick={()=>setAvisoImport(null)} style={{marginLeft:'auto',color:'var(--text-muted)',cursor:'pointer',fontSize:'1rem',lineHeight:1}}>×</button>
        </div>
      )}

      {/* Barra de Pesquisa */}
      <div className="flex items-center gap-3 p-4 rounded-[28px] border-2 shadow-sm transition-all"
        style={{backgroundColor:'var(--bg-card)',borderColor: termo ? 'var(--accent)' : 'var(--border)'}}>
        <Search size={20} style={{color: termo ? 'var(--accent)' : 'var(--text-muted)', flexShrink:0}}/>
        <input
          autoFocus
          className="flex-1 bg-transparent border-none outline-none font-black text-sm uppercase tracking-wide"
          style={{color:'var(--text-primary)'}}
          placeholder="Digite o NOME, CÓDIGO ou CATEGORIA do produto..."
          value={termo}
          onChange={e => setTermo(e.target.value)}
        />
        {termo && (
          <button onClick={() => setTermo('')} style={{padding:'0.4rem', borderRadius:'50%', backgroundColor:'var(--bg-elevated)', color:'var(--text-muted)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      {/* ── LISTA DE RESULTADOS ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[32px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
        {carregando ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 p-12">
            <RefreshCw size={40} className="animate-spin mb-4" style={{color:'var(--text-muted)'}}/>
            <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Carregando catálogo...</p>
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead style={{backgroundColor:'var(--bg-elevated)', position: 'sticky', top: 0, zIndex: 10}}>
              <tr style={{color:'var(--text-muted)',fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                <th className="px-6 py-4 w-16 text-center">Ícone</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Descrição do Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:4}}>
                    <DollarSign size={11}/> Preço Venda
                  </div>
                </th>
                <th className="px-6 py-4 text-center">Último Pedido</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((prod, index) => {
                const dt = mapaDatas[String(prod.codigo)];
                const msgTempo = getTempoTexto(dt);
                const isRecente = dt && Math.floor((new Date().setHours(0,0,0,0) - new Date(dt).setHours(0,0,0,0))/86400000) <= 7;
                const temPreco = prod.preco && prod.preco > 0;

                return (
                  <tr key={prod.codigo + index} style={{borderTop:'1px solid var(--border)', transition:'background-color 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                    onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl" style={{backgroundColor:'rgba(59,130,246,0.1)', color:'var(--accent-bright)'}}>
                        <Package size={18}/>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{fontFamily:'monospace', fontSize:'0.75rem', fontWeight:700, color:'var(--text-secondary)', padding:'4px 8px', borderRadius:'8px', backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)'}}>
                        {prod.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{fontWeight:800, textTransform:'uppercase', fontSize:'0.8rem', color:'var(--text-primary)', lineHeight:1.2}}>
                        {prod.nome}
                      </p>
                      {prod.unidade && (
                        <span style={{fontSize:'0.6rem', fontWeight:700, color:'var(--text-muted)', marginTop:4, display:'inline-block'}}>
                          Unidade: {prod.unidade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span style={{fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', color:'var(--text-muted)'}}>
                          <Tag size={10} className="inline mr-1"/>
                          {prod.pai || 'Geral'}
                        </span>
                        <span style={{fontSize:'0.55rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', opacity:0.7, paddingLeft:14}}>
                          {prod.filho}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {temPreco ? (
                        <span style={{fontSize:'0.85rem', fontWeight:900, color:'var(--accent-bright)'}}>
                          {Number(prod.preco).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}
                        </span>
                      ) : (
                        <span style={{fontSize:'0.65rem', fontWeight:700, color:'var(--text-muted)', opacity:0.5}}>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span style={{
                        fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '999px',
                        backgroundColor: isRecente ? 'rgba(16,185,129,0.1)' : dt ? 'rgba(59,130,246,0.1)' : 'rgba(148,163,184,0.1)',
                        color: isRecente ? '#10b981' : dt ? '#3b82f6' : 'var(--text-muted)'
                      }}>
                        {msgTempo}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40 p-20 text-center">
            <Search size={56} className="mb-4" style={{color:'var(--text-muted)'}}/>
            <p className="font-black uppercase text-sm tracking-[0.2em]" style={{color:'var(--text-muted)'}}>
              Nenhum produto encontrado
            </p>
            <p className="text-xs font-bold mt-2" style={{color:'var(--text-secondary)'}}>
              Tente buscar por outro termo ou código.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaBuscador;