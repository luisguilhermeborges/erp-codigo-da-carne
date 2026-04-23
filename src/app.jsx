import React, { useState, useEffect } from 'react';
import { api } from './services/api';

// Importação das Páginas
import Login from './pages/Login';
import PaginaHome from './pages/PaginaHome';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import PaginaGestao from './pages/PaginaGestao';
import PaginaImportacao from './pages/PaginaImportacao';
import PaginaBuscador from './pages/PaginaBuscador';
import PaginaRecebimento from './pages/PaginaRecebimento';
import PaginaGestaoEstoqueLocal from './pages/Gestao/PaginaGestaoEstoqueLocal';
import PaginaDP from './pages/DP/PaginaDP';
import PaginaFinanceiro from './pages/Financeiro/PaginaFinanceiro';

// Importação de Componentes
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';

import { Heart, Wrench, QrCode, Menu, ChevronDown, User, MapPin, ClipboardList, Package, DollarSign, Users } from 'lucide-react';

// Placeholder reutilizável para páginas em desenvolvimento
const EmDesenvolvimento = ({ icone: Icone, titulo, descricao }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 opacity-60 select-none animate-in fade-in">
    <div style={{
      background: 'var(--bg-elevated)',
      border: '2px dashed var(--border-bright)',
      borderRadius: '2rem',
      padding: '3rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      textAlign: 'center',
    }}>
      <Icone size={48} style={{ color: 'var(--accent-bright)' }} />
      <Wrench size={20} style={{ color: 'var(--text-muted)' }} />
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {titulo}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {descricao || 'Em desenvolvimento — em breve disponível'}
      </p>
    </div>
  </div>
);

const TermosDeUso = ({ user, onAccept }) => {
  const [salvando, setSalvando] = useState(false);
  
  const aceitar = async () => {
    setSalvando(true);
    try {
      const u = { ...user, termosAceitos: true };
      await api.usuarios.salvar(u);
      localStorage.setItem('usuario_logado', JSON.stringify(u));
      onAccept(u);
    } catch {
      alert("Erro ao salvar aceite.");
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-black uppercase mb-4 text-slate-900">Termos de Uso e Privacidade</h2>
        <div className="flex-1 overflow-auto pr-2 text-xs text-slate-600 space-y-4 font-medium custom-scrollbar">
          <p>Bem-vindo(a) ao ERP Código da Carne. Ao utilizar este sistema, você concorda com as seguintes condições:</p>
          <h3 className="font-bold text-slate-800 uppercase mt-4">1. Uso da Plataforma</h3>
          <p>O sistema é de uso exclusivo para as operações internas. O acesso é pessoal e intransferível. É expressamente proibido compartilhar suas credenciais de acesso com terceiros.</p>
          <h3 className="font-bold text-slate-800 uppercase mt-4">2. Confidencialidade</h3>
          <p>Todas as informações disponíveis no sistema (pedidos, valores, relatórios, cadastros, etc.) são estritamente confidenciais e de propriedade exclusiva da empresa.</p>
          <h3 className="font-bold text-slate-800 uppercase mt-4">3. Conduta e Responsabilidade</h3>
          <p>O colaborador deve utilizar a plataforma de maneira ética e profissional. Os registros, como no Mural dos Sonhos e Classificados, não devem conter material ofensivo ou inadequado.</p>
          <h3 className="font-bold text-slate-800 uppercase mt-4">4. Política de Cookies e Dados</h3>
          <p>Utilizamos armazenamento local (cookies/local storage) para manter sua sessão ativa e salvar preferências. Ao continuar, você concorda com a coleta e uso dos dados estritamente necessários para o funcionamento do sistema.</p>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={aceitar} 
            disabled={salvando}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {salvando ? 'Salvando...' : 'Li e Aceito os Termos'}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('mural');
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem('usuario_logado');
      if (salvo) {
        const userObj = JSON.parse(salvo);
        if (userObj && userObj.login) {
          setUsuario(userObj);
          // Redireciona comercial para pedidos por padrão, se a aba mural estiver restrita
          if (userObj.cargo?.toLowerCase() === 'comercial' && abaAtiva === 'mural') {
            setAbaAtiva('pedidos');
          }
        }
      }
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
    }
  }, []);

  if (!usuario) {
    return <Login onLogin={(user) => setUsuario(user)} />;
  }

  // Se o usuário já passou pelo primeiro acesso (trocou a senha) e ainda não aceitou os termos:
  if (usuario.primeiroAcesso === false && !usuario.termosAceitos) {
    return <TermosDeUso user={usuario} onAccept={(user) => setUsuario(user)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans selection:bg-blue-500/30 w-full relative">
      {/* Mobile Top Bar */}
      {usuario && (
        <div className="md:hidden flex items-center justify-between p-4 border-b z-20" style={{backgroundColor:'var(--bg-surface)', borderColor:'var(--border)'}}>
          <h1 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em', margin: 0 }}>
            SAAS<span style={{ color: 'var(--accent-bright)' }}>CDC</span>
          </h1>
          <button onClick={() => setMenuAberto(true)} style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
        </div>
      )}

      <BarraLateral
        usuario={usuario}
        abaAtiva={abaAtiva}
        setAbaAtiva={(aba) => { setAbaAtiva(aba); setMenuAberto(false); }}
        onLogout={() => {
          localStorage.removeItem('usuario_logado');
          setUsuario(null);
        }}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--bg-base)' }}>
        {/* Discreeta Topbar Global Desktop */}
        {usuario && (
          <header className="hidden md:flex items-center justify-end px-8 py-3 border-b z-10 shrink-0" style={{backgroundColor:'var(--bg-surface)', borderColor:'var(--border)'}}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{borderColor:'var(--border)', backgroundColor:'var(--bg-elevated)'}}>
                <User size={14} style={{color:'var(--accent)'}}/>
                <span className="text-[10px] font-bold uppercase" style={{color:'var(--text-secondary)'}}>{usuario.nome?.split(' ')[0]} ({usuario.cargo})</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{borderColor:'var(--border)', backgroundColor:'var(--bg-elevated)'}}>
                <MapPin size={14} style={{color:'var(--accent-bright)'}}/>
                <span className="text-[10px] font-bold uppercase" style={{color:'var(--text-secondary)'}}>Filial:</span>
                {['master', 'adm', 'dev'].includes(usuario.cargo?.toLowerCase()) ? (
                  <select 
                    className="bg-transparent border-none text-[10px] font-black uppercase outline-none cursor-pointer"
                    style={{color:'var(--text-primary)'}}
                    value={usuario.unidade || ''}
                    onChange={(e) => {
                       const nu = {...usuario, unidade: e.target.value};
                       setUsuario(nu);
                       localStorage.setItem('usuario_logado', JSON.stringify(nu));
                       setAbaAtiva('mural'); // Redireciona para Home sem recarregar
                    }}
                  >
                    <option value="001 - CENTRO">001 - Centro</option>
                    <option value="002 - ALPHAVILLE">002 - Alphaville</option>
                    <option value="003 - GLEBA">003 - Gleba</option>
                    <option value="000 - PRODUCAO">000 - Producao</option>
                    <option value="">Todas</option>
                  </select>
                ) : (
                  <span className="text-[10px] font-black uppercase" style={{color:'var(--text-primary)'}}>{usuario.unidade || 'Sem filial'}</span>
                )}
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {usuario && (
            <div className="max-w-7xl mx-auto h-full">
              {/* Envelopa cada aba em div para cache */}
              <div className={abaAtiva === 'mural' ? 'block h-full' : 'hidden'}><PaginaHome user={usuario} /></div>

              {/* Gerador de Códigos e Lote */}
              <div className={abaAtiva === 'gerador' ? 'block h-full' : 'hidden'}>
                <EmDesenvolvimento icone={QrCode} titulo="Gerador de Códigos e Lote" descricao="Módulo em construção — em breve disponível" />
              </div>

              {/* Fichas de Produção */}
              <div className={abaAtiva === 'fichas_producao' ? 'block h-full' : 'hidden'}>
                <EmDesenvolvimento icone={ClipboardList} titulo="Fichas de Produção" descricao="Em construção — vou criar a estrutura perfeita" />
              </div>

              {/* DP */}
              <div className={abaAtiva.startsWith('dp_') ? 'block h-full' : 'hidden'}>
                <PaginaDP user={usuario} abaInicial={abaAtiva.replace('dp_', '')} />
              </div>

              {/* Financeiro */}
              <div className={abaAtiva === 'financeiro' ? 'block h-full' : 'hidden'}>
                <PaginaFinanceiro />
              </div>

              <div className={abaAtiva === 'atendimento' ? 'block h-full' : 'hidden'}><PaginaAtendimento user={usuario} /></div>
              <div className={abaAtiva === 'pedidos' ? 'block h-full' : 'hidden'}><PaginaPedidos user={usuario} /></div>
              <div className={abaAtiva === 'relatorios_estoque' ? 'block h-full' : 'hidden'}><PaginaRelatorios user={usuario} /></div>
              <div className={abaAtiva === 'transferencia' ? 'block h-full' : 'hidden'}><PaginaTransferenciaAvulsa user={usuario} /></div>
              <div className={abaAtiva === 'recebimento' ? 'block h-full' : 'hidden'}><PaginaRecebimento user={usuario} /></div>
              
              {/* Gestão */}
              <div className={abaAtiva.startsWith('gestao_') ? 'block h-full' : 'hidden'}>
                <PaginaGestao user={usuario} abaInicial={abaAtiva.replace('gestao_', '')} />
              </div>

              <div className={abaAtiva === 'estoque_local' ? 'block h-full' : 'hidden'}><PaginaGestaoEstoqueLocal user={usuario} /></div>
              <div className={abaAtiva === 'buscador' ? 'block h-full' : 'hidden'}><PaginaBuscador user={usuario} /></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;