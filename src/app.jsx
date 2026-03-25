import React, { useState, useEffect } from 'react';

// Importação das Páginas
import Login from './pages/Login';
import PaginaHome from './pages/PaginaHome';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import PaginaGestao from './pages/PaginaGestao';
import PaginaAdmin from './pages/PaginaAdmin';
import PaginaImportacao from './pages/PaginaImportacao';

// Importação de Componentes
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
// import MuralSonhos from './components/MuralSonhos'; — desabilitado temporariamente

import { Heart, Wrench, QrCode } from 'lucide-react';

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

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('mural');

  useEffect(() => {
    try {
      const salvo = localStorage.getItem('usuario_logado');
      if (salvo) {
        const userObj = JSON.parse(salvo);
        if (userObj && userObj.login) setUsuario(userObj);
      }
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
    }
  }, []);

  if (!usuario) {
    return <Login onLogin={(user) => setUsuario(user)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-blue-500/30">
      <BarraLateral
        usuario={usuario}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onLogout={() => {
          localStorage.removeItem('usuario_logado');
          setUsuario(null);
        }}
      />

      <main className="flex-1 overflow-y-auto p-8 relative" style={{ backgroundColor: 'var(--bg-base)' }}>
        {usuario && (
          <>
            <div>
              {abaAtiva === 'mural' && <PaginaHome user={usuario} />}

              {/* Gerador de Códigos e Lote — em desenvolvimento */}
              {abaAtiva === 'gerador' && (
                <EmDesenvolvimento
                  icone={QrCode}
                  titulo="Gerador de Códigos e Lote"
                  descricao="Módulo em construção — em breve disponível"
                />
              )}

              {abaAtiva === 'atendimento'  && <PaginaAtendimento user={usuario} />}
              {abaAtiva === 'pedidos'      && <PaginaPedidos user={usuario} />}
              {abaAtiva === 'relatorios'   && <PaginaRelatorios user={usuario} />}
              {abaAtiva === 'transferencia'&& <PaginaTransferenciaAvulsa user={usuario} />}
              {abaAtiva === 'gestao'       && <PaginaGestao user={usuario} />}
              {abaAtiva === 'importacao'   && <PaginaImportacao user={usuario} />}
              {abaAtiva === 'admin'        && <PaginaAdmin user={usuario} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;