import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Repeat, LogOut, Heart, Sun, Moon, QrCode, FileDown, Shield, X, Search, PackageCheck, ClipboardList } from 'lucide-react';
import { api } from '../services/api';

const BarraLateral = ({ usuario, abaAtiva, setAbaAtiva, onLogout, menuAberto, setMenuAberto }) => {
  const [tema, setTema]                         = useState(() => localStorage.getItem('tema_cdc') || 'light');
  const [pendentesRecebimento, setPendentesRec] = useState(0);
  const [pendentesAtendimento, setPendentesAt]  = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema_cdc', tema);
  }, [tema]);

  // Polling para badges
  useEffect(() => {
    const unidade = usuario?.unidade;
    const cargo = usuario?.cargo?.toLowerCase();
    
    const buscarBadges = async () => {
      // 1. Recebimento
      if (unidade) {
        api.pedidos.paraReceber(unidade)
          .then(data => setPendentesRec(Array.isArray(data) ? data.length : 0))
          .catch(() => {});
      }

      // 2. Atendimento (Fila)
      api.pedidos.fila()
        .then(data => {
          if (Array.isArray(data)) {
            const filtrados = ['master', 'adm'].includes(cargo)
              ? data
              : data.filter(p => p.unidadeOrigem === unidade || !p.unidadeOrigem);
            setPendentesAt(filtrados.length);
          }
        })
        .catch(() => {});
    };

    buscarBadges();
    const interval = setInterval(buscarBadges, 60000); 
    return () => clearInterval(interval);
  }, [usuario]);

  const alternarTema = () => setTema(t => t === 'dark' ? 'light' : 'dark');

  const menuItens = [
    { id: 'mural',        label: 'Home',              icon: Heart,         roles: ['comercial', 'adm', 'master', 'pcp', 'gestorestoque', 'estoque', 'producao'] },
    { id: 'atendimento',  label: 'Atendimento',      icon: LayoutDashboard, roles: ['adm', 'master', 'gestorestoque', 'estoque'], badge: pendentesAtendimento },
    { id: 'pedidos',      label: 'Fazer Pedidos',    icon: ShoppingCart,  roles: ['comercial', 'adm', 'master', 'estoque'] },
    { id: 'transferencia',label: 'Transferência',    icon: Repeat,        roles: ['comercial', 'adm', 'master', 'gestorestoque', 'estoque'] },
    { id: 'recebimento',  label: 'Recebimento',      icon: PackageCheck,  roles: ['comercial', 'adm', 'master'], badge: pendentesRecebimento },
    { id: 'relatorios',   label: 'Relatórios',       icon: FileText,      roles: ['adm', 'master'] },
    { id: 'gestao',       label: 'Gestão',           icon: Users,         roles: ['adm', 'master', 'gestorestoque', 'estoque'] },
    { id: 'estoque_local',label: 'Itens Recebidos',  icon: Package,       roles: ['adm', 'master', 'gestorestoque', 'estoque', 'comercial'], label_short: 'Estoque' },
    { id: 'buscador',     label: 'Pesquisar Produto',icon: Search,        roles: ['comercial', 'adm', 'master', 'gestorestoque', 'pcp', 'estoque', 'producao'] },
    { id: 'fichas_producao', label: 'Fichas Produção', icon: ClipboardList, roles: ['producao', 'adm', 'master'] },
    { id: 'gerador',      label: 'Gerador Cód/Lote', icon: QrCode,        roles: ['adm', 'master', 'pcp', 'gestorestoque', 'estoque'] },
  ];

  const itensVisiveis = menuItens.filter(item =>
    item.roles.includes(usuario?.cargo?.toLowerCase() || 'comercial')
  );

  return (
    <>
      {/* Overlay para mobile */}
      {menuAberto && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside 
        className={`fixed md:relative flex flex-col h-full z-50 transition-transform duration-300 ease-in-out ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          width: '17rem',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}>
        {/* Logo and Close Button */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em', margin: 0 }}>
            SAAS<span style={{ color: 'var(--accent-bright)' }}>CDC</span>
          </h1>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuAberto(false)}
          >
            <X size={24} />
          </button>
        </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {itensVisiveis.map((item) => {
          const Icone = item.icon;
          const ativo = abaAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setAbaAtiva(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.15s ease',
                backgroundColor: ativo ? 'var(--accent)' : 'transparent',
                color: ativo ? '#fff' : 'var(--text-muted)',
                boxShadow: ativo ? '0 4px 16px var(--accent-glow)' : 'none',
              }}
              onMouseEnter={e => { if (!ativo) { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!ativo) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
            >
              <Icone size={18} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 999, backgroundColor: '#f59e0b',
                  color: '#fff', fontSize: '0.55rem', fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Rodapé: Tema + Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Botão alternar tema */}
        <button
          onClick={alternarTema}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.875rem',
            border: '1px solid var(--border-bright)',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {tema === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: 'transparent',
            color: '#f87171',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
    </>
  );
};

export default BarraLateral;