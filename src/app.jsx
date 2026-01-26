import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaRelatorios from './pages/PaginaRelatorios';
import './App.css';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [tempoAtivo, setTempoAtivo] = useState(0);

  // Widget de Tempo Ativo (MBM Style)
  useEffect(() => {
    const timer = setInterval(() => setTempoAtivo(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderConteudo = () => {
    switch (telaAtiva) {
      case 'dashboard':
        return <BannerBoasVindas tempo={tempoAtivo} unidade="001 - CENTRO" />;
      case 'fazer-pedido':
        return <PaginaPedidos />;
      case 'atender-pedidos':
        return <PaginaAtendimento />;
      case 'relatorios':
        return <PaginaRelatorios />;
      default:
        return <BannerBoasVindas tempo={tempoAtivo} />;
    }
  };

  return (
    <div className="mbm-dashboard">
      <BarraLateral telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
      <main className="mbm-content">
        <div className="page-wrapper">
          {renderConteudo()}
        </div>
      </main>
    </div>
  );
}

export default App;