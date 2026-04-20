import React, { useState, useEffect, useRef } from 'react';
import { Search, Minus, Trash2, ArrowRight, Package, Barcode, X, Send, Repeat } from 'lucide-react';
import { BANCO_COMPLETO } from '../data/bancoPadrao';
import { api } from '../services/api';
import { getEstoque } from '../services/cache';

// Padrão balança: 13 dígitos começando com 2
const REGEX_BALANCA = /^2(\d{6})(\d{5})\d$/;

const MOTIVOS = [
  'Sem etiqueta','Sem vácuo','Mal cheiro','Perto da validade',
  'Solicitação para venda','Embalagem errada','Produto sem identificação','Sem preço'
];

const PaginaTransferenciaAvulsa = ({ user }) => {
  const [busca, setBusca]               = useState('');
  const [itens, setItens]               = useState([]);
  const [catalogo, setCatalogo]         = useState([]);
  const [sugestoes, setSugestoes]       = useState([]);
  const [enviando, setEnviando]         = useState(false);
  const [sucesso, setSucesso]           = useState(false);
  const inputRef = useRef(null);

  const isComercial = user?.cargo?.toLowerCase() === 'comercial';

  useEffect(() => {
    getEstoque({ apenasComPreco: isComercial }).then(setCatalogo).catch(() => {
      const precos = JSON.parse(localStorage.getItem('precos_cdc') || '{}');
      const dados = Object.entries(BANCO_COMPLETO).map(([nome, v]) => {
        const cod = String(v.codigo ?? '').trim();
        return { id: cod, codigo: cod, nome, unidade: v.unidade, pai: v.pai || 'Outros', filho: v.filho || 'Outros', preco: precos[cod] ?? 0 };
      });
      setCatalogo(isComercial ? dados.filter(d => d.preco > 0) : dados);
    });
  }, [isComercial]);

  // Atualizar sugestões conforme digita
  useEffect(() => {
    const t = busca.trim();
    if (!t || t.length < 2) { setSugestoes([]); return; }
    const low = t.toLowerCase();
    setSugestoes(catalogo.filter(p =>
      p.nome.toLowerCase().includes(low) || p.codigo.includes(t)
    ).slice(0, 8));
  }, [busca, catalogo]);

  // Processar input (teclado ou leitor)
  const processarInput = (valor) => {
    const val = valor.trim();
    if (!val) return;

    // — padrão balança —
    const m = val.match(REGEX_BALANCA);
    if (m) {
      const cod  = m[1];                               // 6 dígitos = código
      const peso = parseInt(m[2], 10) / 1000;          // 5 dígitos / 1000 = kg
      const prod = catalogo.find(p => p.codigo === cod);
      if (prod) {
        adicionarItem(prod, peso);
        setBusca('');
        return;
      }
    }

    // — busca exata por código —
    const exato = catalogo.find(p => p.codigo === val);
    if (exato) { adicionarItem(exato, 1); setBusca(''); return; }

    // — sem match: abre sugestões —
  };

  const adicionarItem = (produto, qtdInicial = 1) => {
    setItens(prev => {
      const existente = prev.find(i => i.codigo === produto.codigo);
      if (existente) {
        return prev.map(i => i.codigo === produto.codigo
          ? { ...i, qtd: parseFloat((i.qtd + qtdInicial).toFixed(3)) }
          : i
        );
      }
      return [...prev, {
        ...produto,
        idUnico: `${produto.codigo}-${Date.now()}`,
        qtd: qtdInicial,
        motivo: 'Sem etiqueta',
      }];
    });
    setSugestoes([]);
    setBusca('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const atualizarItem = (idUnico, campo, valor) => {
    setItens(prev => prev.map(i =>
      i.idUnico === idUnico
        ? { ...i, [campo]: campo === 'motivo' ? valor : Math.max(0, Number(valor)) }
        : i
    ));
  };

  const removerItem = (idUnico) => setItens(prev => prev.filter(i => i.idUnico !== idUnico));

  const finalizarTransferencia = async () => {
    const itensValidos = itens.filter(i => i.qtd > 0);
    if (itensValidos.length === 0) return;
    setEnviando(true);
    try {
      await api.pedidos.criar({
        id:            `TR-${Math.floor(Math.random() * 9000) + 1000}`,
        cliente:       `TRANSFERÊNCIA: ${user?.unidade || user?.nome} › PRODUÇÃO`,
        unidadeOrigem: user?.unidade,
        destino:       '000',
        usuario:       user?.nome,
        data:          new Date().toLocaleString('pt-BR'),
        tipo:          'TRANSFERENCIA_AVULSA',
        status:        'Pendente',
        itens:         itensValidos,
      });
      setSucesso(true);
      setItens([]);
      setTimeout(() => setSucesso(false), 3000);
    } catch {
      alert('Erro ao enviar transferência. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const totalItens = itens.reduce((s, i) => s + i.qtd, 0);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">

      {/* ── CABEÇALHO ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>
            Transferência
          </h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4,display:'flex',alignItems:'center',gap:6}}>
            <Repeat size={12}/> Retorno / Avulsa — leia o código de barras ou pesquise
          </p>
        </div>

        {/* Resumo rota */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}}>
          <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#3b82f6'}}>
            {user?.unidade || user?.unidades?.[0] || 'Loja'}
          </span>
          <ArrowRight size={12} style={{color:'var(--text-muted)'}}/>
          <span style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#f59e0b'}}>
            Estoque / Produção
          </span>
        </div>
      </header>

      {/* ── CAMPO PRINCIPAL DE BUSCA / LEITOR ── */}
      <div className="relative">
        <div
          className="flex items-center gap-4 p-4 rounded-[28px] border-2 transition-all shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: busca ? 'var(--accent)' : 'var(--border)',
            boxShadow: busca ? '0 0 0 4px var(--accent-glow)' : 'none'
          }}
        >
          <Barcode size={20} style={{color: busca ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0}}/>
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none font-black text-sm uppercase tracking-wide"
            style={{color:'var(--text-primary)'}}
            placeholder="Digite o código de barras, código ou nome do produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') processarInput(busca);
            }}
          />
          {busca && (
            <button onClick={() => { setBusca(''); setSugestoes([]); inputRef.current?.focus(); }}
              style={{padding:'4px',borderRadius:'50%',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>
              <X size={14}/>
            </button>
          )}
          <button
            onClick={() => processarInput(busca)}
            disabled={!busca.trim()}
            className="px-4 py-2 rounded-2xl font-black text-[10px] uppercase transition-all"
            style={{
              backgroundColor: busca.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
              color: busca.trim() ? '#fff' : 'var(--text-muted)',
              flexShrink: 0
            }}>
            Adicionar
          </button>
        </div>

        {/* Sugestões */}
        {sugestoes.length > 0 && (
          <div className="absolute top-[72px] left-0 right-0 z-50 rounded-[24px] shadow-2xl border overflow-hidden"
            style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
            {sugestoes.map(p => (
              <button
                key={p.codigo}
                onClick={() => adicionarItem(p, 1)}
                className="w-full text-left px-5 py-3 flex justify-between items-center transition-all"
                style={{borderBottom:'1px solid var(--border)'}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}
              >
                <div>
                  <span style={{fontFamily:'monospace',fontSize:'0.65rem',color:'var(--accent-bright)',fontWeight:700}}>{p.codigo}</span>
                  <p style={{fontWeight:800,textTransform:'uppercase',fontSize:'0.8rem',color:'var(--text-primary)'}}>{p.nome}</p>
                </div>
                <span style={{fontSize:'0.6rem',color:'var(--text-muted)',textTransform:'uppercase'}}>{p.unidade} · {p.pai} ({p.filho})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── ÁREA PRINCIPAL ── */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-0">

        {/* Tabela de itens */}
        <div className="flex-1 rounded-[32px] border overflow-hidden flex flex-col" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
          {itens.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 p-12 text-center">
              <Package size={48} className="mb-4" style={{color:'var(--text-muted)'}}/>
              <p className="font-black uppercase text-sm tracking-widest" style={{color:'var(--text-muted)'}}>
                Nenhum item adicionado
              </p>
              <p className="text-xs font-bold mt-2" style={{color:'var(--text-secondary)'}}>
                Use o campo acima ou o leitor de código de barras
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead style={{backgroundColor:'var(--bg-elevated)',position:'sticky',top:0,zIndex:10}}>
                  <tr style={{color:'var(--text-muted)',fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                    <th className="px-5 py-4">Produto</th>
                    <th className="px-5 py-4 text-center" style={{width:140}}>Quantidade</th>
                    <th className="px-5 py-4" style={{width:200}}>Motivo</th>
                    <th className="px-5 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map(item => (
                    <tr key={item.idUnico} style={{borderTop:'1px solid var(--border)'}}>
                      <td className="px-5 py-4">
                        <p style={{fontWeight:800,textTransform:'uppercase',fontSize:'0.8rem',color:'var(--text-primary)',lineHeight:1.2}}>{item.nome}</p>
                        <span style={{fontFamily:'monospace',fontSize:'0.6rem',color:'var(--accent-bright)',fontWeight:700}}>{item.codigo}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center rounded-2xl p-1 gap-1 mx-auto w-fit" style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)'}}>
                          <button onClick={() => atualizarItem(item.idUnico,'qtd', parseFloat((item.qtd-1).toFixed(3)))}
                            className="p-1.5 rounded-xl transition-colors"
                            style={{color:'var(--text-muted)'}}
                            onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                            <Minus size={13}/>
                          </button>
                          <input type="number" step="0.001" min="0"
                            className="w-20 text-center bg-transparent font-black text-sm border-none outline-none"
                            style={{color:'var(--accent-bright)'}}
                            value={item.qtd}
                            onChange={e=>atualizarItem(item.idUnico,'qtd',e.target.value)}/>
                          <span style={{fontSize:'0.65rem',fontWeight:700,color:'var(--text-muted)',paddingRight:4}}>{item.unidade}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="w-full p-2 rounded-xl font-black text-[10px] uppercase border-none outline-none"
                          style={{backgroundColor:'rgba(251,146,60,0.1)',color:'#ea580c'}}
                          value={item.motivo}
                          onChange={e=>atualizarItem(item.idUnico,'motivo',e.target.value)}>
                          {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => removerItem(item.idUnico)}
                          style={{color:'var(--text-muted)',padding:6,borderRadius:8}}
                          onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Painel lateral */}
        <div className="w-full xl:w-[320px]">
          <div className="rounded-[40px] p-8 shadow-2xl border xl:sticky top-0 flex flex-col gap-5"
            style={{backgroundColor:'var(--bg-surface)',borderColor:'var(--border)'}}>

            <div>
              <p style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--accent-bright)',marginBottom:8}}>
                Resumo da Transferência
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {itens.length === 0 ? (
                  <p style={{fontSize:'0.7rem',color:'var(--text-muted)',fontWeight:600}}>Nenhum item ainda</p>
                ) : (
                  itens.map(i => (
                    <div key={i.idUnico} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                      <div>
                        <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)',lineHeight:1.2}}>{i.nome}</p>
                        <p style={{fontSize:'0.6rem',color:'#f97316',fontWeight:700}}>{i.motivo}</p>
                      </div>
                      <span style={{fontSize:'0.75rem',fontWeight:800,color:'var(--accent-bright)',flexShrink:0,marginLeft:8}}>
                        {Number(i.qtd).toFixed(i.unidade==='KG'?3:0)} {i.unidade}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {itens.length > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',backgroundColor:'var(--bg-elevated)',borderRadius:12}}>
                <span style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-muted)'}}>Total itens</span>
                <span style={{fontSize:'0.9rem',fontWeight:900,color:'var(--text-primary)'}}>{itens.length}</span>
              </div>
            )}

            {sucesso && (
              <div style={{padding:'12px 16px',borderRadius:16,backgroundColor:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',textAlign:'center'}}>
                <p style={{fontSize:'0.7rem',fontWeight:800,color:'#10b981',textTransform:'uppercase'}}>✅ Transferência enviada!</p>
              </div>
            )}

            <button
              onClick={finalizarTransferencia}
              disabled={itens.length === 0 || enviando}
              className="w-full py-5 rounded-[24px] font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3"
              style={{
                backgroundColor: itens.length > 0 ? '#ea580c' : 'var(--bg-elevated)',
                color: itens.length > 0 ? '#fff' : 'var(--text-muted)',
                boxShadow: itens.length > 0 ? '0 4px 20px rgba(234,88,12,0.3)' : 'none',
              }}
              onMouseEnter={e=>{if(itens.length>0)e.currentTarget.style.backgroundColor='#c2410c';}}
              onMouseLeave={e=>e.currentTarget.style.backgroundColor=itens.length>0?'#ea580c':'var(--bg-elevated)'}
            >
              {enviando
                ? <div style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
                : <Send size={14}/>
              }
              {enviando ? 'Enviando...' : 'Enviar à Produção'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaTransferenciaAvulsa;