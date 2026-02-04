import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import Login from './pages/Login';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaRelatorios from './pages/PaginaRelatorios';
import PaginaTransferenciaAvulsa from './pages/PaginaTransferenciaAvulsa';
import PaginaGestao from './pages/PaginaGestao'; 
import './App.css';

function App() {
  // O estado inicia como null para forçar o login sempre que a página for aberta/atualizada
  const [user, setUser] = useState(null);
  
  // Controle de navegação entre as telas
  const [telaAtiva, setTelaAtiva] = useState('dashboard');

  // Função disparada após o sucesso no Login.jsx
  const handleLogin = (userData) => {
    setUser(userData);
    setTelaAtiva('dashboard');
  };

  // Função para deslogar o usuário
  const handleLogout = () => {
    setUser(null);
    setTelaAtiva('dashboard');
  };

  // Se não houver usuário logado, mostra apenas a tela de Login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Lógica de roteamento interno do sistema
  const renderConteudo = () => {
    switch (telaAtiva) {
      case 'dashboard':
        // Passa o objeto user completo para o Banner e Mural dos Sonhos
        return <BannerBoasVindas user={user} />;
      
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
        return <BannerBoasVindas user={user} />;
    }
  };

  return (
    <div className="mbm-dashboard">
      {/* Barra Lateral de Navegação */}
      <BarraLateral 
        telaAtiva={telaAtiva} 
        setTelaAtiva={setTelaAtiva} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Área Principal de Conteúdo */}
      <main className="mbm-content">
        <div className="page-wrapper">
          {renderConteudo()}
        </div>
      </main>
    </div>
  );
}

export default App;