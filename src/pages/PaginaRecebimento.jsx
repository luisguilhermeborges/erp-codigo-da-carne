import React, { useState, useEffect, useCallback } from 'react';
import {
  PackageCheck, Clock, ArrowRight, CheckCircle2, Package,
  ChevronDown, ChevronUp, RefreshCw, CalendarDays, AlertTriangle,
  X, Loader2, CheckCheck, FlaskConical
} from 'lucide-react';
import { api } from '../services/api';

// ── Utilitário: formatar data ISO para pt-BR ──────────────────────────────────
const parseDataBR = (str) => {
  if (!str) return 0;
  const p = str.match(/(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})/);
  if (!p) return 0;
  return new Date(`${p[3]}-${p[2]}-${p[1]}T${p[4]}:${p[5]}:00`).getTime();
};

const fmtData = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR');
  } catch {
    return iso;
  }
};

// ── Chip de status de validade ────────────────────────────────────────────────
const ChipValidade = ({ dtValidade }) => {
  if (!dtValidade) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const validade = new Date(dtValidade + 'T00:00:00');
  const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

  let cor = '#10b981', bg = 'rgba(16,185,129,0.1)', label = `${diffDias}d`;
  if (diffDias <= 0) { cor = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; label = 'Vencido'; }
  else if (diffDias <= 3) { cor = '#f59e0b'; bg = 'rgba(245,158,11,0.1)'; label = `${diffDias}d`; }

  return (
    <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, backgroundColor: bg, color: cor, border: `1px solid ${cor}30`, marginLeft: 6 }}>
      {label}
    </span>
  );
};

// ── Modal de recebimento de uma transferência ─────────────────────────────────
const ModalRecebimento = ({ transferencia, user, onClose, onConfirmado }) => {
  const [itens, setItens] = useState(
    (transferencia.itens || []).filter(item => Number(item.qtdEnviada ?? item.qtd) > 0).map(item => ({
      ...item,
      recebido: item.recebido ?? true,
      dtProducao: item.dtProducao || '',
      dtValidade: item.dtValidade || '',
    }))
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const atualizarItem = (idx, campo, valor) => {
    setItens(prev => prev.map((it, i) => i === idx ? { ...it, [campo]: valor } : it));
  };

  const todosConfirmados = itens.every(i => !i.recebido || (i.dtProducao && i.dtValidade));

  const confirmar = async () => {
    if (!todosConfirmados) {
      setErro('Preencha Data de Produção e Validade para todos os itens recebidos.');
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      const id = transferencia.idExterno || transferencia.id || transferencia._id;
      await api.pedidos.receber(id, {
        itens,
        dataRecebimento: new Date().toLocaleString('pt-BR'),
        recebidoPor: user?.nome,
      });
      onConfirmado();
    } catch {
      setErro('Erro ao confirmar recebimento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-3xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        {/* Cabeçalho do modal */}
        <div className="flex items-start justify-between p-7 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-bright)', backgroundColor: 'rgba(59,130,246,0.1)', padding: '3px 10px', borderRadius: 999 }}>
                {transferencia.idExterno}
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {transferencia.data}
              </span>
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Confirmar Recebimento
            </h2>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
              Origem: <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{transferencia.unidadeOrigem || transferencia.usuario}</span>
            </p>
          </div>
          <button onClick={onClose}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <X size={20} />
          </button>
        </div>

        {/* Tabela de itens */}
        <div className="flex-1 overflow-y-auto px-7">
          <table className="w-full border-collapse" style={{ fontSize: '0.75rem' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
              <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                {['✓', 'Produto', 'Qtd', 'Preço Et.', 'Produção', 'Validade'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', opacity: item.recebido ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                  {/* Checkbox recebido */}
                  <td style={{ padding: '10px 12px' }}>
                    <input
                      type="checkbox"
                      checked={item.recebido}
                      onChange={e => atualizarItem(idx, 'recebido', e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                  </td>
                  {/* Produto */}
                  <td style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1.2 }}>{item.nome}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'var(--accent-bright)', fontWeight: 700 }}>{item.codigo}</span>
                  </td>
                  {/* Qtd */}
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-bright)' }}>
                      {Number(item.qtdEnviada ?? item.qtd).toFixed(item.unidade === 'KG' ? 3 : 0)} {item.unidade}
                    </span>
                  </td>
                  {/* Data de produção */}
                  <td style={{ padding: '10px 12px' }}>
                    <input
                      type="date"
                      value={item.dtProducao}
                      disabled={!item.recebido}
                      onChange={e => atualizarItem(idx, 'dtProducao', e.target.value)}
                      style={{
                        backgroundColor: item.recebido ? 'var(--bg-elevated)' : 'transparent',
                        border: `1px solid ${item.recebido && !item.dtProducao ? '#f59e0b' : 'var(--border)'}`,
                        borderRadius: 10, padding: '5px 8px', fontSize: '0.7rem', fontWeight: 700,
                        color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: item.recebido ? 'pointer' : 'default'
                      }}
                    />
                  </td>
                  {/* Data de validade */}
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="date"
                        value={item.dtValidade}
                        disabled={!item.recebido}
                        onChange={e => atualizarItem(idx, 'dtValidade', e.target.value)}
                        style={{
                          backgroundColor: item.recebido ? 'var(--bg-elevated)' : 'transparent',
                          border: `1px solid ${item.recebido && !item.dtValidade ? '#ef4444' : 'var(--border)'}`,
                          borderRadius: 10, padding: '5px 8px', fontSize: '0.7rem', fontWeight: 700,
                          color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: item.recebido ? 'pointer' : 'default'
                        }}
                      />
                      {item.dtValidade && <ChipValidade dtValidade={item.dtValidade} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="p-7 pt-4 shrink-0 flex flex-col gap-3">
          {erro && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12 }}>
              <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444' }}>{erro}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} disabled={enviando}
              style={{ flex: '0 0 auto', padding: '12px 24px', borderRadius: 16, border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={confirmar} disabled={enviando}
              style={{
                flex: 1, padding: '14px 24px', borderRadius: 16, border: 'none',
                backgroundColor: todosConfirmados ? '#10b981' : 'var(--bg-elevated)',
                color: todosConfirmados ? '#fff' : 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: todosConfirmados ? '0 4px 20px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.2s',
              }}>
              {enviando
                ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Confirmando...</>
                : <><CheckCheck size={16} /> Confirmar Recebimento</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Card de uma transferência pendente ────────────────────────────────────────
const CardTransferencia = ({ transferencia, onAbrir }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 24, overflow: 'hidden', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Cabeçalho do card */}
      <div className="flex items-center justify-between p-5 gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-bright)', backgroundColor: 'rgba(59,130,246,0.1)', padding: '3px 10px', borderRadius: 999 }}>
                {transferencia.idExterno || transferencia.id || 'N/A'}
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                Pendente
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: 2 }}>
              {transferencia.unidadeOrigem || 'Estoque / Produção'}
            </p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Enviado por: {transferencia.usuario} · {transferencia.data}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div style={{ textAlign: 'center', padding: '6px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 12 }}>
            <p style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{transferencia.itens?.length || 0}</p>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>itens</p>
          </div>
          <button onClick={() => onAbrir(transferencia)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
              borderRadius: 14, border: 'none', backgroundColor: '#3b82f6', color: '#fff',
              fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <PackageCheck size={14} />
            Receber
          </button>
          <button onClick={() => setExpandido(!expandido)}
            style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Lista resumida dos itens (expandível) */}
      {expandido && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(transferencia.itens || []).filter(item => Number(item.qtdEnviada ?? item.qtd) > 0).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', opacity: 0.85 }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{item.nome}</p>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'var(--accent-bright)', fontWeight: 700 }}>{item.codigo}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-bright)', flexShrink: 0, marginLeft: 8 }}>
                  {Number(item.qtdEnviada ?? item.qtd).toFixed(item.unidade === 'KG' ? 3 : 0)} {item.unidade}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Página Principal ──────────────────────────────────────────────────────────
const PaginaRecebimento = ({ user }) => {
  const [transferencias, setTransferencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(null);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const unidade = user?.unidade || '';

  const carregar = useCallback(async () => {
    if (!unidade) return;
    setCarregando(true);
    setErro('');
    try {
      const data = await api.pedidos.paraReceber(unidade);
      // Garante que pegamos a lista de transferências mesmo se vier em um objeto { pedidos: [...] }
      const lista = Array.isArray(data) ? data : (data?.pedidos || data?.transferencias || []);
      setTransferencias([...lista].sort((a,b) => parseDataBR(b.data) - parseDataBR(a.data)));
    } catch {
      setErro('Erro ao carregar transferências. Verifique a conexão.');
    } finally {
      setCarregando(false);
    }
  }, [unidade]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleConfirmado = (id) => {
    setModalAberto(null);
    setTransferencias(prev => prev.filter(t => (t.idExterno || t.id || t._id) !== id));
    setSucesso('Recebimento confirmado com sucesso!');
    setTimeout(() => setSucesso(''), 4000);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">

      {/* ── CABEÇALHO ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Recebimento
          </h2>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PackageCheck size={12} />
            Transferências pendentes de confirmação · {unidade || 'Sem unidade definida'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Contador de pendências */}
          {!carregando && transferencias.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 14, backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Clock size={14} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b' }}>
                {transferencias.length} {transferencias.length === 1 ? 'pendente' : 'pendentes'}
              </span>
            </div>
          )}

          {/* Botão atualizar */}
          <button onClick={carregar} disabled={carregando}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 14, border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
              cursor: carregando ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!carregando) e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <RefreshCw size={14} style={{ animation: carregando ? 'spin 1s linear infinite' : 'none' }} />
            Atualizar
          </button>
        </div>
      </header>

      {/* ── ALERTAS ── */}
      {sucesso && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16 }}>
          <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>{sucesso}</p>
        </div>
      )}

      {erro && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16 }}>
          <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>{erro}</p>
        </div>
      )}

      {/* ── SEM UNIDADE ── */}
      {!unidade && !carregando && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.5, textAlign: 'center', padding: '4rem 2rem' }}>
          <AlertTriangle size={48} style={{ color: 'var(--text-muted)' }} />
          <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Filial não definida</p>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Selecione uma filial no menu superior para ver os recebimentos pendentes.</p>
        </div>
      )}

      {/* ── CARREGANDO ── */}
      {carregando && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Loader2 size={40} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Buscando transferências...</p>
        </div>
      )}

      {/* ── ESTADO VAZIO ── */}
      {!carregando && !erro && transferencias.length === 0 && unidade && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5, textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))', border: '2px dashed var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={36} style={{ color: '#10b981' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--text-muted)', letterSpacing: '-0.02em' }}>
              Tudo em dia!
            </p>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: 4 }}>
              Não há transferências pendentes de confirmação para <strong>{unidade}</strong>
            </p>
          </div>
        </div>
      )}

      {/* ── LISTA DE TRANSFERÊNCIAS ── */}
      {!carregando && transferencias.length > 0 && (
        <div className="flex flex-col gap-4 flex-1">
          {/* Info de instrução */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 14 }}>
            <FlaskConical size={14} style={{ color: '#60a5fa', flexShrink: 0 }} />
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Clique em <strong>Receber</strong> para confirmar o recebimento dos itens e preencher as datas de produção e validade.
            </p>
          </div>

          {transferencias.map(t => (
            <CardTransferencia
              key={t.idExterno}
              transferencia={t}
              onAbrir={(tr) => setModalAberto(tr)}
            />
          ))}
        </div>
      )}

      {/* ── MODAL ── */}
      {modalAberto && (
        <ModalRecebimento
          transferencia={modalAberto}
          user={user}
          onClose={() => setModalAberto(null)}
          onConfirmado={() => handleConfirmado(modalAberto.idExterno)}
        />
      )}
    </div>
  );
};

export default PaginaRecebimento;
