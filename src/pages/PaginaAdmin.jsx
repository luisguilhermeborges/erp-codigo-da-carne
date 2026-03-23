import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, AlertTriangle, ShoppingCart, Tag, CheckCircle, Clock, XCircle } from 'lucide-react';
import { api } from '../services/api';

const PaginaAdmin = ({ user }) => {
  const [pedidos, setPedidos]   = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [filtro, setFiltro]     = useState('TODOS');
  const [confirmando, setConfirmando] = useState(null); // id do pedido a apagar

  const carregar = async () => {
    setCarregando(true);
    try {
      const dados = await api.pedidos.todos();
      setPedidos(dados);
    } catch (err) {
      alert('Erro ao carregar pedidos do servidor');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const apagar = async (idExterno) => {
    try {
      await api.pedidos.apagar(idExterno);
      setPedidos(prev => prev.filter(p => p.idExterno !== idExterno));
      setConfirmando(null);
    } catch (err) {
      alert('Erro ao apagar pedido');
    }
  };

  const limparTodos = async (status) => {
    if (!window.confirm(`Apagar TODOS os pedidos ${status==='Finalizado'?'finalizados':'pendentes'}? Isso não pode ser desfeito.`)) return;
    try {
      await api.pedidos.limpar(status);
      await carregar();
    } catch (err) {
      alert('Erro ao limpar pedidos');
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'TODOS')     return true;
    if (filtro === 'Pendente')  return p.status === 'Pendente';
    if (filtro === 'Finalizado') return p.status === 'Finalizado';
    if (filtro === 'PEDIDO_LOJA') return p.tipo === 'PEDIDO_LOJA';
    if (filtro === 'TRANSFERENCIA_AVULSA') return p.tipo === 'TRANSFERENCIA_AVULSA';
    return true;
  });

  const total     = pedidos.length;
  const pendentes = pedidos.filter(p => p.status === 'Pendente').length;
  const finalizados = pedidos.filter(p => p.status === 'Finalizado').length;

  const chipStyle = (ativo) => ({
    padding:'0.35rem 1rem', borderRadius:'999px', border:'1px solid var(--border)',
    fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', cursor:'pointer',
    backgroundColor: ativo ? 'var(--accent)' : 'var(--bg-elevated)',
    color: ativo ? '#fff' : 'var(--text-secondary)', transition:'all 0.15s',
  });

  return (
    <div className="space-y-8 animate-in fade-in" style={{ color:'var(--text-primary)' }}>

      {/* Modal confirmação */}
      {confirmando && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor:'rgba(0,0,0,0.6)' }}>
          <div className="rounded-[32px] p-10 shadow-2xl space-y-6 w-full max-w-sm text-center" style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)' }}>
            <AlertTriangle size={48} className="mx-auto text-red-500" />
            <h3 className="font-black uppercase text-lg" style={{ color:'var(--text-primary)' }}>Apagar pedido?</h3>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>#{confirmando} — Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmando(null)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs"
                style={{ backgroundColor:'var(--bg-elevated)', color:'var(--text-secondary)', border:'1px solid var(--border)' }}>Cancelar</button>
              <button onClick={() => apagar(confirmando)} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white"
                style={{ backgroundColor:'#ef4444' }}>Apagar</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color:'var(--text-primary)' }}>Administração</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color:'var(--text-muted)' }}>Gerenciamento de requisições — acesso restrito ao master</p>
        </div>
        <button onClick={carregar} style={{ color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.7rem', fontWeight:700 }}>
          <RefreshCw size={16} className={carregando?'animate-spin':''}/> Atualizar
        </button>
      </header>

      {/* Cards resumo */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total de Pedidos', val:total,      cor:'var(--accent-bright)', icon:ShoppingCart },
          { label:'Na Fila',          val:pendentes,   cor:'#f59e0b',             icon:Clock },
          { label:'Finalizados',      val:finalizados, cor:'#10b981',             icon:CheckCircle },
        ].map(c => (
          <div key={c.label} style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'1.25rem', padding:'1.5rem', display:'flex', gap:'1rem', alignItems:'center' }}>
            <c.icon size={28} style={{ color:c.cor, flexShrink:0 }}/>
            <div>
              <p style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)' }}>{c.label}</p>
              <p style={{ fontSize:'1.75rem', fontWeight:900, color:c.cor, lineHeight:1 }}>{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ações de limpeza em massa */}
      <div className="flex gap-3 flex-wrap" style={{ padding:'1rem 1.25rem', backgroundColor:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:'1rem' }}>
        <AlertTriangle size={16} style={{ color:'#ef4444', flexShrink:0, marginTop:2 }}/>
        <div className="flex-1 flex flex-wrap gap-3 items-center">
          <p style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-secondary)' }}>Ações em massa:</p>
          <button onClick={() => limparTodos('Finalizado')}
            style={{ padding:'0.4rem 1rem', borderRadius:'999px', border:'1px solid rgba(239,68,68,0.3)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', cursor:'pointer', backgroundColor:'rgba(239,68,68,0.1)', color:'#ef4444' }}>
            Limpar finalizados ({finalizados})
          </button>
          <button onClick={() => limparTodos('Pendente')}
            style={{ padding:'0.4rem 1rem', borderRadius:'999px', border:'1px solid rgba(245,158,11,0.3)', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', cursor:'pointer', backgroundColor:'rgba(245,158,11,0.1)', color:'#d97706' }}>
            Limpar pendentes ({pendentes})
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
        {[
          { k:'TODOS', label:`Todos (${total})` },
          { k:'Pendente', label:`Na fila (${pendentes})` },
          { k:'Finalizado', label:`Finalizados (${finalizados})` },
          { k:'PEDIDO_LOJA', label:'Pedidos' },
          { k:'TRANSFERENCIA_AVULSA', label:'Transferências' },
        ].map(f => (
          <button key={f.k} style={chipStyle(filtro===f.k)} onClick={() => setFiltro(f.k)}>{f.label}</button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-3">
        {pedidosFiltrados.map(p => (
          <div key={p.idExterno} className="p-6 rounded-[28px] border transition-all"
            style={{ backgroundColor:'var(--bg-card)', borderColor:'var(--border)' }}>
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start">
                <div style={{ padding:'0.75rem', borderRadius:'0.875rem', backgroundColor: p.tipo==='TRANSFERENCIA_AVULSA'?'rgba(249,115,22,0.1)':'rgba(59,130,246,0.1)' }}>
                  {p.tipo==='TRANSFERENCIA_AVULSA' ? <Tag size={20} style={{ color:'#f97316' }}/> : <ShoppingCart size={20} style={{ color:'var(--accent-bright)' }}/>}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase" style={{ color:'var(--text-muted)' }}>#{p.idExterno}</span>
                    <span style={{
                      fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', padding:'2px 8px', borderRadius:'999px',
                      backgroundColor: p.status==='Finalizado'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)',
                      color: p.status==='Finalizado'?'#10b981':'#f59e0b'
                    }}>{p.status}</span>
                    <span style={{ fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)' }}>
                      {p.tipo==='TRANSFERENCIA_AVULSA'?'TRANSFERÊNCIA':'PEDIDO'}
                    </span>
                  </div>
                  <p className="font-black uppercase text-sm" style={{ color:'var(--text-primary)' }}>{p.cliente||p.filial}</p>
                  <p className="text-[9px] mt-1" style={{ color:'var(--text-muted)' }}>
                    {p.data} • {p.itens?.length||0} itens • Por: {p.usuario||'—'}
                    {p.atendidoPor && ` • Atendido por: ${p.atendidoPor}`}
                  </p>
                </div>
              </div>

              <button onClick={() => setConfirmando(p.idExterno)}
                className="p-3 rounded-2xl transition-all flex-shrink-0"
                style={{ color:'var(--text-muted)', border:'1px solid var(--border)' }}
                onMouseEnter={e=>{e.currentTarget.style.backgroundColor='rgba(239,68,68,0.1)';e.currentTarget.style.color='#ef4444';e.currentTarget.style.borderColor='rgba(239,68,68,0.3)';}}
                onMouseLeave={e=>{e.currentTarget.style.backgroundColor='transparent';e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.borderColor='var(--border)';}}>
                <Trash2 size={16}/>
              </button>
            </div>

            {/* Itens resumidos */}
            {p.itens && p.itens.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.itens.slice(0,6).map((item, i) => (
                  <span key={i} style={{ fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', padding:'2px 8px', borderRadius:'999px', backgroundColor:'var(--bg-elevated)', color:'var(--text-secondary)' }}>
                    {item.nome?.substring(0,25)}{item.nome?.length>25?'…':''}
                  </span>
                ))}
                {p.itens.length > 6 && (
                  <span style={{ fontSize:'0.6rem', fontWeight:700, padding:'2px 8px', borderRadius:'999px', backgroundColor:'var(--bg-elevated)', color:'var(--text-muted)' }}>+{p.itens.length-6} mais</span>
                )}
              </div>
            )}
          </div>
        ))}

        {pedidosFiltrados.length === 0 && !carregando && (
          <div className="py-20 text-center opacity-30">
            <XCircle size={48} className="mx-auto mb-4" style={{ color:'var(--text-muted)' }}/>
            <p className="font-black uppercase text-xs tracking-widest" style={{ color:'var(--text-muted)' }}>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaAdmin;