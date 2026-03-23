import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Repeat, LogOut, Heart, Sun, Moon, QrCode, FileDown, Shield } from 'lucide-react';

const BarraLateral = ({ usuario, abaAtiva, setAbaAtiva, onLogout }) => {
  const [tema, setTema] = useState(() => localStorage.getItem('tema_cdc') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema_cdc', tema);
  }, [tema]);

  const alternarTema = () => setTema(t => t === 'dark' ? 'light' : 'dark');

  const menuItens = [
    { id: 'mural',        label: 'Mural dos Sonhos', icon: Heart,           roles: ['comercial', 'adm', 'master', 'pcp'] },
    { id: 'atendimento',  label: 'Atendimento',      icon: LayoutDashboard, roles: ['comercial', 'adm', 'master'] },
    { id: 'pedidos',      label: 'Fazer Pedidos',    icon: ShoppingCart,    roles: ['comercial', 'adm', 'master'] },
    { id: 'transferencia',label: 'Transferência',    icon: Repeat,          roles: ['comercial', 'adm', 'master'] },
    { id: 'relatorios',   label: 'Relatórios',       icon: FileText,        roles: ['adm', 'master'] },
    { id: 'gestao',       label: 'Gestão',           icon: Users,           roles: ['adm', 'master'] },
    { id: 'estoque',      label: 'Estoque',          icon: Package,         roles: ['adm', 'master'] },
    { id: 'importacao',   label: 'Importar Layout',  icon: FileDown,        roles: ['adm', 'master'] },
    { id: 'admin',        label: 'Admin Requisições', icon: Shield,          roles: ['master'] },
    { id: 'gerador',      label: 'Gerador Cód/Lote', icon: QrCode,          roles: ['adm', 'master', 'pcp', 'comercial'] },
  ];

  const itensVisiveis = menuItens.filter(item =>
    item.roles.includes(usuario?.cargo?.toLowerCase() || 'comercial')
  );

  return (
    <aside style={{
      width: '17rem',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow)',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>
          ERP <span style={{ color: 'var(--accent-bright)' }}>CDC</span>
        </h1>
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
              {item.label}
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
  );
};

export default BarraLateral;