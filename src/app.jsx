import React, { useState, useEffect } from 'react';
import './App.css';

// Componente de Card de Status (Estilo MBM)
const StatusCard = ({ title, value, color }) => (
  <div className={`status-card ${color}`}>
    <div className="status-info">
      <span>{title}</span>
      <h3>{value}</h3>
    </div>
  </div>
);

function App() {
  const [unidade, setUnidade] = useState('001 - CENTRO');
  const [tempoAtivo, setTempoAtivo] = useState(0);

  // Lógica do Widget de Tempo Ativo
  useEffect(() => {
    const timer = setInterval(() => setTempoAtivo(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatarTempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="mbm-dashboard">
      {/* Sidebar Dark */}
      <aside className="mbm-sidebar">
        <div className="sidebar-logo">
          <h2>C.D.C</h2>
          <p>CÓDIGO DA CARNE</p>
        </div>
        <nav className="sidebar-nav">
          <button className="active">🏠 Dashboard</button>
          <button>📦 Estoque</button>
          <button>📊 Relatórios</button>
          <button>⚙️ Configurações</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="mbm-content">
        {/* Welcome Banner com Tempo Ativo */}
        <header className="mbm-banner">
          <div className="banner-text">
            <h1>Olá, Gestor! 👋</h1>
            <p>Seja bem-vindo ao painel da <strong>{unidade}</strong></p>
          </div>
          <div className="active-time-widget">
            <span>⏱️ TEMPO ATIVO</span>
            <strong>{formatarTempo(tempoAtivo)}</strong>
          </div>
        </header>

        {/* Seleção de Unidade */}
        <section className="unit-selector">
          <button onClick={() => setUnidade('000 - PRODUÇÃO')}>000</button>
          <button onClick={() => setUnidade('001 - CENTRO')}>001</button>
          <button onClick={() => setUnidade('002 - ALPHAVILLE')}>002</button>
          <button onClick={() => setUnidade('003 - GLEBA')}>003</button>
        </section>

        {/* Grid de Status */}
        <section className="status-grid">
          <StatusCard title="PEDIDOS HOJE" value="42" color="blue" />
          <StatusCard title="EM PRODUÇÃO" value="12" color="orange" />
          <StatusCard title="CONCLUÍDOS" value="28" color="green" />
          <StatusCard title="PENDENTES" value="02" color="red" />
        </section>

        {/* Área de Tabela/Conteúdo */}
        <section className="data-section">
          <div className="data-card">
            <h3>Últimas Movimentações - {unidade}</h3>
            <div className="placeholder-table">
              <p>Nenhum registro encontrado para esta unidade hoje.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;