import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import Login from './pages/Login';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaGestao from './pages/PaginaGestao';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import './App.css';

function App() {
  // Alterado para null: agora o sistema não guarda a sessão no browser
  // O utilizador terá de fazer login sempre que a página for recarregada
  const [user, setUser] = useState(null);
  
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [tempoAtivo, setTempoAtivo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTempoAtivo(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Removemos o localStorage.setItem para não persistir a sessão
    setTelaAtiva('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setTelaAtiva('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const renderConteudo = () => {
    switch (telaAtiva) {
      case 'dashboard':
        return <BannerBoasVindas tempo={tempoAtivo} unidade={user.unidade} nome={user.nome} />;
      case 'fazer-pedido':
        return <PaginaPedidos user={user} />;
      case 'atender-pedidos':
        return <PaginaAtendimento user={user} />;
      case 'transferencia-avulsa':
        return <PaginaTransferenciaAvulsa user={user} />;
      case 'relatorios':
        return <PaginaRelatorios user={user} />;
      case 'gestao':
        return <PaginaGestao user={user} />;
      default:
        return <BannerBoasVindas tempo={tempoAtivo} unidade={user.unidade} nome={user.nome} />;
    }
  };

  return (
    <div className="mbm-dashboard">
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