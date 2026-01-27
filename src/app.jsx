import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import Login from './pages/Login';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import './App.css';

function App() {
  // Inicializa o usuário a partir do localStorage para manter a sessão ativa
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_sessao');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      return null;
    }
  });
  
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [tempoAtivo, setTempoAtivo] = useState(0);

  // Timer global de tempo ativo (Estilo MBM)
  useEffect(() => {
    const timer = setInterval(() => setTempoAtivo(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user_sessao', JSON.stringify(userData));
    setTelaAtiva('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_sessao');
    setTelaAtiva('dashboard');
  };

  // Trava de segurança: Se não houver usuário logado, renderiza apenas a tela de Login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Gerenciador de Rotas Internas
  const renderConteudo = () => {
    switch (telaAtiva) {
      case 'dashboard':
        return (
          <BannerBoasVindas 
            tempo={tempoAtivo} 
            unidade={user.unidade} 
            nome={user.nome} 
          />
        );
      case 'fazer-pedido':
        return <PaginaPedidos user={user} />;
      case 'atender-pedidos':
        return <PaginaAtendimento user={user} />;
      case 'transferencia-avulsa':
        return <PaginaTransferenciaAvulsa user={user} />;
      case 'relatorios':
        return <PaginaRelatorios user={user} />;
      case 'usuarios':
        return <PaginaUsuarios />;
      default:
        return (
          <BannerBoasVindas 
            tempo={tempoAtivo} 
            unidade={user.unidade} 
            nome={user.nome} 
          />
        );
    }
  };

  return (
    <div className="mbm-dashboard">
      {/* A BarraLateral recebe o usuário para filtrar os menus permitidos */}
      <BarraLateral 
        telaAtiva={telaAtiva} 
        setTelaAtiva={setTelaAtiva} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="mbm-content">
        <div className="page-wrapper">
          {renderConteudo()}
        </div>
      </main>
    </div>
  );
}

export default App;