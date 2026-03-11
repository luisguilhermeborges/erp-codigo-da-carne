import React, { useState, useEffect } from 'react';

// Importação das Páginas
import Login from './pages/Login';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import PaginaGestao from './pages/PaginaGestao';

// Importação de Componentes
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import MuralSonhos from './components/MuralSonhos';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('mural');

  // Recupera a sessão ao carregar a página
  useEffect(() => {
    try {
      const salvo = localStorage.getItem('usuario_logado');
      if (salvo) {
        const userObj = JSON.parse(salvo);
        // Garante que o objeto tenha o que as telas precisam
        if (userObj && userObj.login) {
          setUsuario(userObj);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar sessão:", e);
    }
  }, []);

  // Se não houver usuário logado, mostra o Login
  if (!usuario) {
    return <Login onLogin={(user) => setUsuario(user)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-blue-500/30">
      {/* BARRA LATERAL - Passando as funções de forma limpa */}
      <BarraLateral 
        usuario={usuario} 
        abaAtiva={abaAtiva} 
        setAbaAtiva={setAbaAtiva} 
        onLogout={() => {
          localStorage.removeItem('usuario_logado');
          setUsuario(null);
        }} 
      />

      <main className="flex-1 overflow-y-auto p-8 relative" style={{backgroundColor: "#0f172a"}}>
        {/* Camada de segurança: Só renderiza o conteúdo se o usuário existir */}
        {usuario && (
          <>
            <BannerBoasVindas usuario={usuario} />
            <div className="mt-8">
              {abaAtiva === 'mural' && <MuralSonhos user={usuario} />}
              {abaAtiva === 'atendimento' && <PaginaAtendimento user={usuario} />}
              {abaAtiva === 'pedidos' && <PaginaPedidos user={usuario} />}
              {abaAtiva === 'relatorios' && <PaginaRelatorios user={usuario} />}
              {abaAtiva === 'transferencia' && <PaginaTransferenciaAvulsa user={usuario} />}
              {abaAtiva === 'gestao' && <PaginaGestao user={usuario} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;