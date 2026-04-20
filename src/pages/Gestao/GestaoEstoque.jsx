import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Save, Trash2, Edit2, X, Search, RefreshCw, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { BANCO_COMPLETO, ORDEM_CATEGORIAS_PAI } from '../../data/bancoPadrao';
import { api } from '../../services/api';
import { getPrecos } from '../../services/cache';

const UNIDADES   = ["KG","UN","MI","BR"];

const formVazio = { codigo:'', nome:'', pai:'Bovino', filho:'Churrasco', unidade:'KG', preco:'', status:'ATIVO' };

const GestaoEstoque = ({ user }) => {
  const cargo = user?.cargo?.toLowerCase();
  const podeEditar = cargo === 'master' || cargo === 'adm';

  const [precos, setPrecos]     = useState({});    // { codigo: preco } do server
  const [pesquisa, setPesquisa] = useState('');
  const [catFiltro, setCatFiltro] = useState('TODAS');
  const [form, setForm]         = useState(formVazio);
  const [editando, setEditando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso]       = useState(null);
  const [confirmarApagar, setConfirmarApagar] = useState(null);

  // Carrega preços do server
  const carregarPrecos = async () => {
    const dados = await getPrecos();
    setPrecos(dados);
  };

  useEffect(() => { carregarPrecos(); }, []);

  // Monta lista de produtos do banco com preços
  const produtos = useMemo(() => {
    return Object.entries(BANCO_COMPLETO).map(([nome, v]) => {
      const cod = String(v.codigo ?? '').trim();
      return {
        codigo:    cod,
        codigoOriginal: v.codigo,
        nome,
        pai:       v.pai || 'Outros',
        filho:     v.filho || 'Outros',
        unidade:   v.unidade,
        preco:     precos[cod] ?? 0,
      };
    }).sort((a,b) => (a.nome||'').localeCompare(b.nome||''));
  }, [precos]);

  const produtosFiltrados = useMemo(() => produtos.filter(p => {
    const termoBusca = pesquisa.toLowerCase();
    const matchBusca = !pesquisa || p.nome.toLowerCase().includes(termoBusca) || p.codigo.includes(pesquisa);
    const matchCat   = catFiltro === 'TODAS' || p.pai === catFiltro;
    return matchBusca && matchCat;
  }), [produtos, pesquisa, catFiltro]);

  const abrirEditar = (prod) => {
    setForm({ codigo: prod.codigo, nome: prod.nome, pai: prod.pai, filho: prod.filho, unidade: prod.unidade, preco: prod.preco ? String(prod.preco) : '', status: 'ATIVO' });
    setEditando(true);
    setModalAberto(true);
  };

  const abrirNovo = () => {
    setForm(formVazio);
    setEditando(false);
    setModalAberto(true);
  };

  const salvar = async () => {
    if (!form.codigo || !form.nome) return setAviso({ tipo:'erro', msg:'Código e nome são obrigatórios.' });
    if (!form.preco || isNaN(parseFloat(form.preco))) return setAviso({ tipo:'erro', msg:'Informe um preço válido.' });

    setSalvando(true);
    try {
      // Salva o preço no server
      const cod = String(form.codigo).trim();
      await api.precos.importar({ [cod]: parseFloat(form.preco) });

      // Atualiza cache local
      const novosPrecos = { ...precos, [cod]: parseFloat(form.preco) };
      localStorage.setItem('precos_cdc', JSON.stringify(novosPrecos));
      setPrecos(novosPrecos);

      setAviso({ tipo:'ok', msg: editando ? 'Preço atualizado com sucesso!' : 'Produto salvo com sucesso!' });
      setModalAberto(false);
      setForm(formVazio);
    } catch {
      setAviso({ tipo:'erro', msg:'Erro ao salvar. Verifique o servidor.' });
    } finally {
      setSalvando(false);
    }
  };

  const apagarPreco = async (codigo) => {
    try {
      // Zera o preço no server
      await api.precos.importar({ [codigo]: 0 });
      const novos = { ...precos, [codigo]: 0 };
      localStorage.setItem('precos_cdc', JSON.stringify(novos));
      setPrecos(novos);
      setConfirmarApagar(null);
      setAviso({ tipo:'ok', msg:'Preço removido — produto não aparece mais nos pedidos.' });
    } catch {
      setAviso({ tipo:'erro', msg:'Erro ao remover preço.' });
    }
  };

  const chip = (ativo) => ({
    padding:'0.3rem 0.85rem', borderRadius:'999px', border:`1px solid ${ativo?'var(--accent)':'var(--border)'}`,
    fontSize:'0.6rem', fontWeight:800, textTransform:'uppercase', cursor:'pointer',
    backgroundColor: ativo ? 'var(--accent)' : 'var(--bg-elevated)',
    color: ativo ? '#fff' : 'var(--text-secondary)', transition:'all 0.15s',
  });

  const comPreco    = produtos.filter(p => p.preco > 0).length;
  const semPreco    = produtos.filter(p => !p.preco).length;

  return (
    <div className="space-y-6 animate-in fade-in" style={{color:'var(--text-primary)'}}>

      {/* Aviso flutuante */}
      {aviso && (
        <div style={{position:'fixed',top:'1.5rem',right:'1.5rem',zIndex:9999,padding:'0.875rem 1.25rem',borderRadius:'1rem',
          backgroundColor: aviso.tipo==='ok'?'rgba(16,185,129,0.95)':'rgba(239,68,68,0.95)',
          color:'#fff',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',
          boxShadow:'0 8px 32px rgba(0,0,0,0.3)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
          {aviso.tipo==='ok'?<CheckCircle size={16}/>:<AlertTriangle size={16}/>}
          {aviso.msg}
          <button onClick={()=>setAviso(null)} style={{marginLeft:'0.5rem',opacity:0.7}}><X size={14}/></button>
        </div>
      )}

      {/* Modal confirmar apagar */}
      {confirmarApagar && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[32px] p-8 shadow-2xl w-full max-w-sm text-center space-y-4" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}}>
            <AlertTriangle size={40} className="mx-auto text-red-500"/>
            <h3 className="font-black uppercase" style={{color:'var(--text-primary)'}}>Remover preço?</h3>
            <p style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>O produto deixará de aparecer nos pedidos. Pode ser reativado importando um novo preço.</p>
            <div className="flex gap-3">
              <button onClick={()=>setConfirmarApagar(null)} className="flex-1 py-3 rounded-2xl font-black uppercase text-xs" style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)'}}>Cancelar</button>
              <button onClick={()=>apagarPreco(confirmarApagar)} className="flex-1 py-3 rounded-2xl font-black uppercase text-xs text-white" style={{backgroundColor:'#ef4444'}}>Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar/criar */}
      {modalAberto && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="rounded-[32px] p-8 shadow-2xl w-full max-w-md space-y-5" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}}>
            <div className="flex justify-between items-center">
              <h3 className="font-black uppercase text-sm" style={{color:'var(--text-primary)'}}>{editando?'Editar Produto':'Novo Produto'}</h3>
              <button onClick={()=>setModalAberto(false)} style={{color:'var(--text-muted)'}}><X size={18}/></button>
            </div>

            <div className="space-y-3">
              {/* SKU / Código */}
              <div>
                <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>SKU / Código</label>
                <input value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})}
                  disabled={editando}
                  placeholder="Ex: 044315"
                  className="w-full p-4 rounded-2xl font-bold text-xs uppercase outline-none"
                  style={{backgroundColor:'var(--bg-elevated)',color:editando?'var(--text-muted)':'var(--text-primary)',border:'1px solid var(--border)',cursor:editando?'not-allowed':'text'}}/>
              </div>

              {/* Nome */}
              <div>
                <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>Nome do Produto</label>
                <input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value.toUpperCase()})}
                  placeholder="Nome do produto"
                  className="w-full p-4 rounded-2xl font-bold text-xs uppercase outline-none"
                  style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-primary)',border:'1px solid var(--border)'}}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Categoria Pai */}
                <div>
                  <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>Categoria Pai</label>
                  <select value={form.pai} onChange={e=>setForm({...form,pai:e.target.value})}
                    className="w-full p-4 rounded-2xl font-bold text-xs uppercase outline-none"
                    style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-primary)',border:'1px solid var(--border)'}}>
                    {ORDEM_CATEGORIAS_PAI.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Filho / Finalidade */}
                <div>
                  <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>Subcategoria</label>
                  <input value={form.filho} onChange={e=>setForm({...form,filho:e.target.value.toUpperCase()})}
                    className="w-full p-4 rounded-2xl font-bold text-xs uppercase outline-none"
                    style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-primary)',border:'1px solid var(--border)'}}/>
                </div>
                {/* Unidade */}
                <div>
                  <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>Unidade</label>
                  <select value={form.unidade} onChange={e=>setForm({...form,unidade:e.target.value})}
                    className="w-full p-4 rounded-2xl font-bold text-xs uppercase outline-none"
                    style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-primary)',border:'1px solid var(--border)'}}>
                    {UNIDADES.map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Preço de venda */}
              <div>
                <label style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',display:'block',marginBottom:4}}>Preço de Venda (R$)</label>
                <input type="number" step="0.01" min="0" value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})}
                  placeholder="0,00"
                  className="w-full p-4 rounded-2xl font-bold text-xs outline-none"
                  style={{backgroundColor:'var(--bg-elevated)',color:'var(--accent-bright)',border:'1px solid var(--border)'}}/>
              </div>

              {editando && (
                <div style={{padding:'0.75rem',borderRadius:'0.875rem',backgroundColor:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.15)',fontSize:'0.65rem',color:'var(--text-secondary)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <Package size={14} style={{color:'var(--accent-bright)',flexShrink:0}}/>
                  Agora você pode editar nome, categoria e unidade além do <strong>preço</strong>.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={()=>setModalAberto(false)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs"
                style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)'}}>Cancelar</button>
              <button onClick={salvar} disabled={salvando} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white"
                style={{backgroundColor:'var(--accent)',boxShadow:'0 4px 20px var(--accent-glow)',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
                {salvando && <RefreshCw size={14} className="animate-spin"/>}
                <Save size={14}/>
                {salvando ? 'Salvando...' : 'Salvar Preço'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>Estoque / Produtos</h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4}}>
            {comPreco} com preço · {semPreco} sem preço · {produtos.length} total no banco
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={carregarPrecos} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1rem',borderRadius:'0.875rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,cursor:'pointer'}}>
            <RefreshCw size={14}/> Atualizar
          </button>
          {podeEditar && (
            <button onClick={abrirNovo} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.25rem',borderRadius:'0.875rem',border:'none',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 16px var(--accent-glow)'}}>
              <Plus size={14}/> Novo Produto
            </button>
          )}
        </div>
      </header>

      {/* Busca + filtros */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 rounded-[24px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
          <Search size={16} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <input className="flex-1 bg-transparent border-none outline-none font-bold text-xs uppercase"
            style={{color:'var(--text-primary)'}} placeholder="Buscar por nome ou código..."
            value={pesquisa} onChange={e=>setPesquisa(e.target.value)}/>
          {pesquisa && <button onClick={()=>setPesquisa('')} style={{color:'var(--text-muted)'}}><X size={14}/></button>}
        </div>
        <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap'}}>
          <button style={chip(catFiltro==='TODAS')} onClick={()=>setCatFiltro('TODAS')}>Todas</button>
          <button style={chip(catFiltro==='COM_PRECO')} onClick={()=>setCatFiltro('COM_PRECO')}>
            ✓ Com preço ({comPreco})
          </button>
          <button style={chip(catFiltro==='SEM_PRECO')} onClick={()=>setCatFiltro('SEM_PRECO')}>
            — Sem preço ({semPreco})
          </button>
          {ORDEM_CATEGORIAS_PAI.map(c=>(
            <button key={c} style={chip(catFiltro===c)} onClick={()=>setCatFiltro(catFiltro===c?'TODAS':c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',overflow:'hidden'}}>
        <div style={{overflowX:'auto',maxHeight:'60vh',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.7rem'}}>
            <thead>
              <tr style={{backgroundColor:'var(--bg-elevated)',position:'sticky',top:0,zIndex:1}}>
                {['SKU / Código','Nome','Grupo / Subgrupo','Unidade','Preço de Venda','Status', podeEditar?'Ações':''].map(h=>(
                  <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-muted)',whiteSpace:'nowrap',borderBottom:'1px solid var(--border)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados
                .filter(p => {
                  if (catFiltro === 'COM_PRECO') return p.preco > 0;
                  if (catFiltro === 'SEM_PRECO') return !p.preco;
                  return true;
                })
                .map((p, i) => (
                <tr key={p.codigo} style={{borderTop:'1px solid var(--border)',backgroundColor:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                  <td style={{padding:'0.6rem 1rem',fontWeight:700,color:'var(--accent-bright)',whiteSpace:'nowrap',fontFamily:'monospace'}}>{p.codigoOriginal || p.codigo}</td>
                  <td style={{padding:'0.6rem 1rem',fontWeight:600,color:'var(--text-primary)',maxWidth:260}}>{p.nome}</td>
                  <td style={{padding:'0.6rem 1rem',whiteSpace:'nowrap'}}>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      <span style={{fontSize:'0.55rem',fontWeight:900,padding:'1px 8px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--accent-bright)',textTransform:'uppercase',width:'fit-content'}}>{p.pai}</span>
                      <span style={{fontSize:'0.5rem',fontWeight:700,padding:'1px 8px',borderRadius:'999px',backgroundColor:'transparent',color:'var(--text-muted)',textTransform:'uppercase',border:'1px solid var(--border)',width:'fit-content'}}>{p.filho}</span>
                    </div>
                  </td>
                  <td style={{padding:'0.6rem 1rem',fontWeight:700,color:'var(--text-secondary)',textAlign:'center'}}>{p.unidade}</td>
                  <td style={{padding:'0.6rem 1rem',fontWeight:800,color:p.preco>0?'#10b981':'var(--text-muted)',textAlign:'right',whiteSpace:'nowrap'}}>
                    {p.preco > 0 ? Number(p.preco).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : '— sem preço'}
                  </td>
                  <td style={{padding:'0.6rem 1rem',textAlign:'center'}}>
                    <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:p.preco>0?'rgba(16,185,129,0.1)':'rgba(100,116,139,0.1)',color:p.preco>0?'#10b981':'#64748b',textTransform:'uppercase'}}>
                      {p.preco > 0 ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  {podeEditar && (
                    <td style={{padding:'0.6rem 1rem',whiteSpace:'nowrap'}}>
                      <div style={{display:'flex',gap:'0.4rem',justifyContent:'center'}}>
                        <button onClick={()=>abrirEditar(p)} title="Editar preço"
                          style={{padding:'0.4rem',borderRadius:'0.5rem',border:'1px solid var(--border)',backgroundColor:'transparent',color:'var(--text-muted)',cursor:'pointer',transition:'all 0.15s'}}
                          onMouseEnter={e=>{e.currentTarget.style.backgroundColor='rgba(59,130,246,0.1)';e.currentTarget.style.color='var(--accent-bright)';}}
                          onMouseLeave={e=>{e.currentTarget.style.backgroundColor='transparent';e.currentTarget.style.color='var(--text-muted)';}}>
                          <Edit2 size={14}/>
                        </button>
                        {p.preco > 0 && (
                          <button onClick={()=>setConfirmarApagar(p.codigo)} title="Remover preço"
                            style={{padding:'0.4rem',borderRadius:'0.5rem',border:'1px solid var(--border)',backgroundColor:'transparent',color:'var(--text-muted)',cursor:'pointer',transition:'all 0.15s'}}
                            onMouseEnter={e=>{e.currentTarget.style.backgroundColor='rgba(239,68,68,0.1)';e.currentTarget.style.color='#ef4444';}}
                            onMouseLeave={e=>{e.currentTarget.style.backgroundColor='transparent';e.currentTarget.style.color='var(--text-muted)';}}>
                            <Trash2 size={14}/>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aviso sem acesso */}
      {!podeEditar && (
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'1rem 1.25rem',borderRadius:'1rem',backgroundColor:'rgba(100,116,139,0.06)',border:'1px solid rgba(100,116,139,0.15)'}}>
          <Package size={16} style={{color:'var(--text-muted)',flexShrink:0}}/>
          <p style={{fontSize:'0.7rem',fontWeight:600,color:'var(--text-muted)'}}>Visualização apenas — edição de preços restrita a ADM e Master.</p>
        </div>
      )}
    </div>
  );
};

export default GestaoEstoque;