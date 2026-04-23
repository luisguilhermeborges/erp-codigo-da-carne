import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, FileText, Repeat, LogOut, Heart, Sun, Moon, 
  QrCode, FileDown, Shield, X, Search, PackageCheck, ClipboardList, Beef, DollarSign, 
  ChevronDown, ChevronRight, ShieldCheck, MapPin
} from 'lucide-react';
import { api } from '../services/api';

const BarraLateral = ({ usuario, abaAtiva, setAbaAtiva, onLogout, menuAberto, setMenuAberto }) => {
  const [tema, setTema]                         = useState(() => localStorage.getItem('tema_cdc') || 'light');
  const [pendentesRecebimento, setPendentesRec] = useState(0);
  const [pendentesAtendimento, setPendentesAt]  = useState(0);
  const [submenusAbertos, setSubmenusAbertos]   = useState({});

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

  const alternarSubmenu = (id) => {
    setSubmenusAbertos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const menuConfig = [
    { id: 'mural', label: 'Home', icon: Heart, roles: ['comercial', 'adm', 'master', 'pcp', 'gestorestoque', 'estoque', 'producao', 'dev'] },
    {
      id: 'estoque_menu',
      label: 'Gestão de Estoque',
      icon: Package,
      roles: ['adm', 'master', 'gestorestoque', 'estoque', 'comercial', 'dev'],
      subItems: [
        { id: 'pedidos', label: 'Fazer Pedido', icon: ShoppingCart, roles: ['comercial', 'adm', 'master', 'estoque'] },
        { id: 'atendimento', label: 'Atendimento', icon: LayoutDashboard, roles: ['adm', 'master', 'gestorestoque', 'estoque'], badge: pendentesAtendimento },
        { id: 'transferencia', label: 'Transferência', icon: Repeat, roles: ['comercial', 'adm', 'master', 'gestorestoque', 'estoque'] },
        { id: 'recebimento', label: 'Recebimento', icon: PackageCheck, roles: ['comercial', 'adm', 'master'], badge: pendentesRecebimento, isDevelopment: true },
        { id: 'relatorios_estoque', label: 'Relatórios', icon: FileText, roles: ['adm', 'master', 'gestorestoque', 'estoque', 'dev'] },
      ]
    },
    {
      id: 'producao_menu',
      label: 'Produção',
      icon: Beef,
      roles: ['producao', 'adm', 'master', 'estoque', 'dev'],
      subItems: [
        { id: 'fichas_producao', label: 'Fichas Produção', icon: ClipboardList, roles: ['producao', 'adm', 'master'] },
        { id: 'gerador', label: 'Gerador Cód/Lote', icon: QrCode, roles: ['adm', 'master', 'pcp', 'gestorestoque', 'estoque'] },
      ]
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: DollarSign,
      roles: ['adm', 'master', 'dev'],
      isDevelopment: true
    },
    {
      id: 'dp_menu',
      label: 'Dep. Pessoal',
      icon: Users,
      roles: ['adm', 'master', 'dev'],
      subItems: [
        { id: 'dp_gestao', label: 'Gestão Equipe', icon: Users, roles: ['adm', 'master'] },
        { id: 'dp_hotsite', label: 'Hotsite Dados', icon: MapPin, roles: ['adm', 'master'] },
        { id: 'dp_arquivos', label: 'Arquivos', icon: FileDown, roles: ['adm', 'master'] },
      ]
    },
    {
      id: 'gestao_menu',
      label: 'Gestão',
      icon: Shield,
      roles: ['adm', 'master', 'dev'],
      subItems: [
        { id: 'gestao_usuarios', label: 'Usuários', icon: Users, roles: ['adm', 'master'] },
        { id: 'gestao_filiais', label: 'Filiais', icon: MapPin, roles: ['adm', 'master'] },
        { id: 'gestao_cargos', label: 'Cargos', icon: Shield, roles: ['adm', 'master'] },
        { id: 'gestao_admin', label: 'Admin Requisições', icon: ShieldCheck, roles: ['master'] },
      ]
    },
    { id: 'buscador', label: 'Pesquisar Produto', icon: Search, roles: ['comercial', 'adm', 'master', 'gestorestoque', 'pcp', 'estoque', 'producao', 'dev'] },
  ];

  const cargoUsuario = usuario?.cargo?.toLowerCase() || 'comercial';
  const isDev = cargoUsuario === 'dev';

  const checkPermissao = (item) => {
    // DEV vê tudo
    if (isDev) return true;
    
    // Se o item for de desenvolvimento e o usuário não for DEV, esconde
    if (item.isDevelopment) return false;

    return item.roles.includes(cargoUsuario);
  };

  const renderItem = (item, level = 0) => {
    if (!checkPermissao(item)) return null;

    const temSubItems = item.subItems && item.subItems.length > 0;
    // Se for um submenu, precisamos filtrar os subItems também
    const subItemsVisiveis = temSubItems ? item.subItems.filter(si => checkPermissao(si)) : [];
    
    if (temSubItems && subItemsVisiveis.length === 0) return null;

    const isAberto = submenusAbertos[item.id];
    const Icone = item.icon;
    const ativo = abaAtiva === item.id || (temSubItems && subItemsVisiveis.some(si => si.id === abaAtiva));

    return (
      <div key={item.id} style={{ marginBottom: '0.15rem' }}>
        <button
          onClick={() => {
            if (temSubItems) {
              alternarSubmenu(item.id);
            } else {
              setAbaAtiva(item.id);
              setMenuAberto(false);
            }
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: level === 0 ? '0.75rem 1.25rem' : '0.6rem 1rem 0.6rem 2.5rem',
            borderRadius: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: level === 0 ? '0.7rem' : '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.15s ease',
            backgroundColor: (ativo && !temSubItems) ? 'var(--accent)' : 'transparent',
            color: (ativo && !temSubItems) ? '#fff' : (ativo && temSubItems) ? 'var(--accent-bright)' : 'var(--text-muted)',
            boxShadow: (ativo && !temSubItems) ? '0 4px 16px var(--accent-glow)' : 'none',
          }}
          onMouseEnter={e => { if (!(ativo && !temSubItems)) { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
          onMouseLeave={e => { if (!(ativo && !temSubItems)) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = (ativo && temSubItems) ? 'var(--accent-bright)' : 'var(--text-muted)'; }}}
        >
          <Icone size={level === 0 ? 18 : 16} />
          <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
          
          {item.isDevelopment && (
            <span style={{ fontSize: '0.5rem', padding: '1px 4px', borderRadius: '4px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>DEV</span>
          )}

          {item.badge > 0 && (
            <span style={{
              minWidth: 16, height: 16, borderRadius: 999, backgroundColor: '#f59e0b',
              color: '#fff', fontSize: '0.5rem', fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px'
            }}>
              {item.badge}
            </span>
          )}
          
          {temSubItems && (
            isAberto ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </button>

        {temSubItems && isAberto && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.15rem' }}>
            {item.subItems.map(subItem => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

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
          width: '18rem',
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
      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.1rem', overflowY: 'auto' }} className="custom-scrollbar">
        {menuConfig.map(item => renderItem(item))}
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