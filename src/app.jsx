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

function App() {
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('atendimento');

  // Recupera a sessão ao carregar a página
  useEffect(() => {
    const salvo = localStorage.getItem('usuario_logado');
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  // Se não houver usuário logado, trava na tela de Login
  if (!usuario) {
    return <Login onLogin={(user) => setUsuario(user)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* BARRA LATERAL */}
      <BarraLateral 
        usuario={usuario} 
        abaAtiva={abaAtiva} 
        setAbaAtiva={(aba) => setAbaAtiva(aba)}
        onLogout={() => {
          localStorage.removeItem('usuario_logado');
          setUsuario(null);
        }} 
      />

      <main className="flex-1 overflow-y-auto p-8">
        <BannerBoasVindas usuario={usuario} />

        <div className="mt-8">
          {abaAtiva === 'atendimento' && <PaginaAtendimento />}
          {abaAtiva === 'pedidos' && <PaginaPedidos />}
          {abaAtiva === 'relatorios' && <PaginaRelatorios />}
          {abaAtiva === 'transferencia' && <PaginaTransferenciaAvulsa />}
          {abaAtiva === 'gestao' && <PaginaGestao />}
        </div>
      </main>
    </div>
  );
}

export default App;