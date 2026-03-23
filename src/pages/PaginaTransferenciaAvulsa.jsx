import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { BANCO_PADRAO } from '../data/bancoPadrao';
import { api } from '../services/api';
import { getEstoque } from '../services/cache';

const PaginaTransferenciaAvulsa = ({ user }) => {
  const [busca, setBusca]                     = useState('');
  const [itensTransferencia, setItensTransferencia] = useState([]);
  const [catalogoProdutos, setCatalogoProdutos]     = useState([]);
  const [enviando, setEnviando]               = useState(false);

  const MOTIVOS = ['Sem etiqueta','Sem vácuo','Mal cheiro','Perto da validade','Solicitação para venda','Embalagem errada','Produto sem identificação','Sem preço'];

  useEffect(() => {
    getEstoque().then(setCatalogoProdutos).catch(() => {
      const precos = JSON.parse(localStorage.getItem('precos_cdc') || '{}');
      const dados = Object.entries(BANCO_PADRAO).map(([nome, v]) => {
        const cod = String(v.codigo ?? '').trim().replace(/^0+/, '');
        return { id:cod, codigo:cod, nome, unidade:v.unidade, categoria:v.categoria, tags:v.tags||[v.categoria], preco:precos[cod]??0 };
      });
      setCatalogoProdutos(dados);
    });
  }, []);

  const adicionarItem = (produto) => {
    setItensTransferencia([...itensTransferencia, { ...produto, idUnico:`${produto.codigo}-${Date.now()}`, qtd:0, motivo:'Sem etiqueta' }]);
    setBusca('');
  };

  const atualizarItem = (idUnico, campo, valor) => {
    setItensTransferencia(prev => prev.map(i =>
      i.idUnico === idUnico ? { ...i, [campo]: campo === 'motivo' ? valor : Math.max(0, Number(valor)) } : i
    ));
  };

  const finalizarTransferencia = async () => {
    const itensValidos = itensTransferencia.filter(i => i.qtd > 0);
    if (itensValidos.length === 0) return alert("Insira as quantidades antes de enviar.");
    setEnviando(true);
    try {
      const transferencia = {
        id:            `TR-${Math.floor(Math.random() * 9000) + 1000}`,
        cliente:       `TRANSFERÊNCIA: ${user?.unidade || user?.nome} > PRODUÇÃO`,
        unidadeOrigem: user?.unidade,
        destino:       '000',
        usuario:       user?.nome,
        data:          new Date().toLocaleString(),
        tipo:          'TRANSFERENCIA_AVULSA',
        status:        'Pendente',
        itens:         itensValidos,
      };
      await api.pedidos.criar(transferencia);
      alert('✅ Transferência enviada com sucesso!');
      setItensTransferencia([]);
    } catch (err) {
      alert('Erro ao enviar transferência. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const produtosFiltrados = catalogoProdutos.filter(p =>
    busca.length > 1 && (p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.includes(busca))
  );

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <header>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter" style={{ color:'var(--text-primary)' }}>Transferência Avulsa / Retorno</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--text-muted)' }}>Permitido adicionar múltiplos motivos para o mesmo item</p>
        </header>

        <div className="relative">
          <div className="p-6 rounded-[24px] border flex items-center gap-4" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border)' }}>
            <Search style={{ color:'var(--text-muted)' }} />
            <input type="text" placeholder="PESQUISAR ITEM..." className="w-full border-none text-xs font-black uppercase bg-transparent outline-none"
              style={{ color:'var(--text-primary)' }} value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
          {produtosFiltrados.length > 0 && (
            <div className="absolute top-20 left-0 w-full rounded-[24px] shadow-2xl z-50 p-4 max-h-72 overflow-y-auto border" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border)' }}>
              {produtosFiltrados.map(p => (
                <button key={`${p.codigo}-${p.nome}`} onClick={() => adicionarItem(p)}
                  className="w-full text-left p-4 rounded-2xl flex justify-between items-center transition-all"
                  style={{ color:'var(--text-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                  <div>
                    <p className="text-[10px] font-black uppercase" style={{ color:'var(--accent-bright)' }}>{p.codigo}</p>
                    <p className="text-sm font-black uppercase">{p.nome}</p>
                    <p className="text-[9px]" style={{ color:'var(--text-muted)' }}>{p.categoria}</p>
                  </div>
                  <Plus size={18} style={{ color:'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[32px] border overflow-hidden" style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border)' }}>
          <table className="w-full text-left">
            <thead style={{ backgroundColor:'var(--bg-elevated)' }}>
              <tr className="text-[10px] font-black uppercase" style={{ color:'var(--text-muted)' }}>
                <th className="p-8">Produto</th>
                <th className="p-8 text-center">Quantidade</th>
                <th className="p-8">Motivo</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody>
              {itensTransferencia.map(item => (
                <tr key={item.idUnico} style={{ borderTop:'1px solid var(--border)' }}>
                  <td className="p-8">
                    <p className="text-sm font-black uppercase" style={{ color:'var(--text-primary)' }}>{item.nome}</p>
                    <span className="text-[10px] font-bold" style={{ color:'var(--accent-bright)' }}>{item.codigo}</span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-center rounded-xl p-1 w-fit mx-auto border" style={{ backgroundColor:'var(--bg-elevated)', borderColor:'var(--border)' }}>
                      <button onClick={() => atualizarItem(item.idUnico,'qtd',item.qtd-1)} className="p-2" style={{ color:'var(--text-secondary)' }}
                        onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}><Minus size={14}/></button>
                      <input type="number" step="0.001" className="w-24 text-center bg-transparent font-black text-xs border-none p-0 outline-none"
                        style={{ color:'var(--accent-bright)' }} value={item.qtd} onChange={e=>atualizarItem(item.idUnico,'qtd',e.target.value)}/>
                      <button onClick={() => atualizarItem(item.idUnico,'qtd',item.qtd+1)} className="p-2" style={{ color:'var(--text-secondary)' }}
                        onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}><Plus size={14}/></button>
                    </div>
                  </td>
                  <td className="p-8">
                    <select className="p-3 rounded-xl font-black text-[10px] uppercase border-none w-full"
                      style={{ backgroundColor:'rgba(251,146,60,0.1)', color:'#ea580c' }}
                      value={item.motivo} onChange={e=>atualizarItem(item.idUnico,'motivo',e.target.value)}>
                      {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => setItensTransferencia(itensTransferencia.filter(i=>i.idUnico!==item.idUnico))}
                      style={{ color:'var(--text-muted)' }} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {itensTransferencia.length === 0 && (
                <tr><td colSpan={4} className="p-12 text-center text-[10px] font-black uppercase opacity-30" style={{ color:'var(--text-muted)' }}>Nenhum item adicionado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[420px]">
        <div className="p-8 rounded-[40px] sticky top-8 shadow-2xl border" style={{ backgroundColor:'var(--bg-surface)', borderColor:'var(--border)', color:'var(--text-primary)' }}>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 italic" style={{ color:'var(--accent-bright)' }}>Resumo do Envio</h2>
          <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {itensTransferencia.map(item => (
              <div key={item.idUnico} className="flex justify-between items-center pb-4" style={{ borderBottom:'1px solid var(--border)' }}>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase leading-tight" style={{ color:'var(--text-primary)' }}>{item.nome}</p>
                  <p className="text-[8px] font-bold uppercase" style={{ color:'#f97316' }}>{item.motivo}</p>
                </div>
                <p className="text-xs font-black ml-4" style={{ color:'var(--accent-bright)' }}>
                  {Number(item.qtd).toFixed(item.unidade==='KG'?3:0)} {item.unidade}
                </p>
              </div>
            ))}
          </div>
          <button onClick={finalizarTransferencia} disabled={itensTransferencia.length===0||enviando}
            className="w-full py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] transition-all text-white"
            style={{ backgroundColor:'#ea580c', opacity:itensTransferencia.length===0?0.5:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}
            onMouseEnter={e=>{if(itensTransferencia.length>0)e.currentTarget.style.backgroundColor='#c2410c';}}
            onMouseLeave={e=>e.currentTarget.style.backgroundColor='#ea580c'}>
            {enviando && <div style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>}
            Enviar à Produção
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaTransferenciaAvulsa;