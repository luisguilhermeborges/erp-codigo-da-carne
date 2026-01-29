import React, { useState } from 'react';
import { Users, MapPin, Beef } from 'lucide-react';

// Importação dos submódulos organizados na pasta Gestao
import GestaoEstoque from './Gestao/GestaoEstoque';
import GestaoUsuarios from './Gestao/GestaoUsuarios';
import GestaoFiliais from './Gestao/GestaoFiliais';

const PaginaGestao = () => {
  // Define qual aba começa aberta (Estoque por padrão)
  const [abaAtiva, setAbaAtiva] = useState('estoque');

  // Configuração das abas disponíveis
  const abas = [
    { 
      id: 'estoque', 
      rotulo: 'Estoque / Produtos', 
      icone: Beef,
      descricao: 'Importação de planilha e gestão de itens'
    },
    { 
      id: 'usuarios', 
      rotulo: 'Usuários / Equipe', 
      icone: Users,
      descricao: 'Controle de acessos, cargos e bases'
    },
    { 
      id: 'filiais', 
      rotulo: 'Filiais / Lojas', 
      icone: MapPin,
      descricao: 'Cadastro de CNPJ, endereços e unidades'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho da Página */}
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">
          Módulo de Gestão
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Configurações administrativas do ecossistema Código da Carne
        </p>
      </header>

      {/* Menu de Navegação por Abas */}
      <div className="flex gap-4 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-t-[24px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              abaAtiva === aba.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <aba.icone size={18} />
            {aba.rotulo}
          </button>
        ))}
      </div>

      {/* Container de Conteúdo Dinâmico */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[600px] relative overflow-hidden">
        {/* Detalhe visual de fundo para manter o padrão MBM */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-32 -translate-y-32 opacity-50" />

        {/* Renderização Condicional dos Módulos */}
        <div className="relative z-10">
          {abaAtiva === 'estoque' && <GestaoEstoque />}
          {abaAtiva === 'usuarios' && <GestaoUsuarios />}
          {abaAtiva === 'filiais' && <GestaoFiliais />}
        </div>
      </div>

      {/* Rodapé informativo do Módulo */}
      <footer className="flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
            Sistema Operacional - {abaAtiva} ativo
          </span>
        </div>
        <p className="text-[9px] font-black uppercase text-slate-300 italic">
          Código da Carne &copy; 2026
        </p>
      </footer>
    </div>
  );
};

export default PaginaGestao;