import React, { useState } from 'react';
import { Users, MapPin, Beef, ShieldCheck } from 'lucide-react';

// Importação dos submódulos da pasta Gestao
import GestaoEstoque from './Gestao/GestaoEstoque';
import GestaoUsuarios from './Gestao/GestaoUsuarios';
import GestaoFiliais from './Gestao/GestaoFiliais';

const PaginaGestao = ({ user }) => {
  // Define a aba inicial como 'estoque'
  const [abaAtiva, setAbaAtiva] = useState('estoque');

  // Configuração das abas com a restrição para o cargo PCP
  // O PCP não tem permissão para ver ou editar a equipa (Usuários)
  const abas = [
    { 
      id: 'estoque', 
      rotulo: 'Estoque / Produtos', 
      icone: Beef,
      permissao: true // Todos os gestores acedem
    },
    { 
      id: 'usuarios', 
      rotulo: 'Usuários / Equipe', 
      icone: Users,
      permissao: user.cargo !== 'pcp' // Oculto para PCP
    },
    { 
      id: 'filiais', 
      rotulo: 'Filiais / Lojas', 
      icone: MapPin,
      permissao: true // Todos os gestores acedem
    }
  ];

  // Filtra apenas as abas que o utilizador tem permissão para ver
  const abasVisiveis = abas.filter(aba => aba.permissao);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho do Módulo Administrativo */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">
            Módulo de Gestão
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Controlo administrativo do ecossistema Código da Carne
          </p>
        </div>
        
        {/* Badge de Nível de Acesso */}
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <ShieldCheck size={14} className="text-blue-600" />
          <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">
            Acesso: {user.cargo}
          </span>
        </div>
      </header>

      {/* Navegação por Abas Estilizada */}
      <div className="flex gap-4 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
        {abasVisiveis.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-3 px-8 py-5 rounded-t-[28px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              abaAtiva === aba.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <aba.icone size={18} />
            {aba.rotulo}
          </button>
        ))}
      </div>

      {/* Área Central de Conteúdo dos Submódulos */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm min-h-[600px] relative">
        {/* Marca d'água decorativa interna */}
        <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none">
          <Beef size={300} />
        </div>

        <div className="relative z-10">
          {/* Renderização Condicional Protegida */}
          {abaAtiva === 'estoque' && <GestaoEstoque />}
          
          {abaAtiva === 'usuarios' && user.cargo !== 'pcp' && (
            <GestaoUsuarios />
          )}
          
          {abaAtiva === 'filiais' && <GestaoFiliais />}
        </div>
      </div>

      {/* Rodapé de Status */}
      <footer className="flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
            Servidor Local Ativo • Sessão: {user.login}
          </span>
        </div>
        <p className="text-[9px] font-black uppercase text-slate-300 italic">
          Código da Carne &copy; 2026 | Gestão Integrada
        </p>
      </footer>
    </div>
  );
};

export default PaginaGestao;