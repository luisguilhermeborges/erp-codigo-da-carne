import React, { useState } from 'react';
import { Users, MapPin, Beef, ShieldCheck } from 'lucide-react';

// Importação dos submódulos da pasta Gestao
import GestaoEstoque from './Gestao/GestaoEstoque';
import GestaoUsuarios from './Gestao/GestaoUsuarios';
import GestaoFiliais from './Gestao/GestaoFiliais';
import PaginaImportacao from './PaginaImportacao';
import PaginaAdmin from './PaginaAdmin';

const PaginaGestao = ({ user, abaInicial = 'estoque' }) => {
  // Define a aba inicial vinda das props ou padrão
  const [abaAtiva, setAbaAtiva] = useState(abaInicial);

  // Configuração das abas com a restrição para o cargo PCP
  const isMasterOrAdm = ['master', 'adm', 'dev'].includes(user?.cargo?.toLowerCase());
  const isLogistica = ['master', 'adm', 'estoque', 'gestorestoque', 'dev'].includes(user?.cargo?.toLowerCase());

  const abas = [
    {
      id: 'estoque',
      rotulo: 'Estoque / Produtos',
      icone: Beef,
      permissao: true 
    },
    {
      id: 'usuarios',
      rotulo: 'Usuários / Equipe',
      icone: Users,
      permissao: isMasterOrAdm
    },
    {
      id: 'filiais',
      rotulo: 'Filiais / Lojas',
      icone: MapPin,
      permissao: isMasterOrAdm
    },
    {
      id: 'cargos',
      rotulo: 'Cargos / Acessos',
      icone: ShieldCheck,
      permissao: isMasterOrAdm
    },
    {
      id: 'importacao',
      rotulo: 'Importar Layout',
      icone: Beef,
      permissao: isLogistica
    },
    {
      id: 'admin',
      rotulo: 'Admin Requisições',
      icone: ShieldCheck,
      permissao: user?.cargo?.toLowerCase() === 'master'
    }
  ];

  // Filtra apenas as abas que o utilizador tem permissão para ver
  const abasVisiveis = abas.filter(aba => aba.permissao);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho do Módulo Administrativo */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            Módulo de Gestão
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>
            Controle administrativo Código da Carne
          </p>
        </div>

        {/* Badge de Nível de Acesso */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <ShieldCheck size={14} style={{ color: 'var(--accent-bright)' }} />
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Acesso: {user.cargo}
          </span>
        </div>
      </header>

      {/* Navegação por Abas Estilizada */}
      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
        {abasVisiveis.map(aba => {
          const ativo = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className="flex items-center gap-3 px-6 py-4 rounded-t-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
              style={{
                backgroundColor: ativo ? 'var(--accent)' : 'var(--bg-card)',
                color: ativo ? '#fff' : 'var(--text-muted)',
                boxShadow: ativo ? '0 4px 20px var(--accent-glow)' : 'none',
                border: '1px solid ' + (ativo ? 'var(--accent)' : 'var(--border)'),
                borderBottom: 'none',
              }}
            >
              <aba.icone size={16} />
              {aba.rotulo}
            </button>
          );
        })}
      </div>

      {/* Área Central de Conteúdo dos Submódulos */}
      <div className="p-8 rounded-[48px] border min-h-[600px] relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {/* Marca d'água decorativa interna */}
        <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none">
          <Beef size={300} />
        </div>

        <div className="relative z-10">
          {/* Renderização Condicional Protegida */}
          {abaAtiva === 'estoque' && <GestaoEstoque user={user} />}

          {abaAtiva === 'usuarios' && isMasterOrAdm && (
            <GestaoUsuarios user={user} />
          )}

          {abaAtiva === 'filiais' && isMasterOrAdm && <GestaoFiliais user={user} />}

          {abaAtiva === 'cargos' && isMasterOrAdm && (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
               <ShieldCheck size={48} className="mb-4" />
               <h3 className="font-black uppercase">Gestão de Cargos</h3>
               <p className="text-xs uppercase font-bold">Módulo em desenvolvimento</p>
             </div>
          )}

          {abaAtiva === 'importacao' && isLogistica && <PaginaImportacao user={user} />}

          {abaAtiva === 'admin' && user?.cargo?.toLowerCase() === 'master' && <PaginaAdmin user={user} />}
        </div>
      </div>

      {/* Rodapé de Status */}
      <footer className="flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: 'var(--text-muted)' }}>
            Servidor Local Ativo • Sessão: {user.login}
          </span>
        </div>
        <p className="text-[9px] font-black uppercase italic" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
          Código da Carne © 2026 | Gestão Integrada
        </p>
      </footer>
    </div>
  );
};


export default PaginaGestao;