import React, { useState, useEffect } from 'react';
import BarraLateral from './components/BarraLateral';
import BannerBoasVindas from './components/BannerBoasVindas';
import CartaoStatus from './components/CartaoStatus';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaAtendimento from './pages/PaginaAtendimento';
import PaginaRelatorios from './pages/PaginaRelatorios';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [pedidos, setPedidos] = useState(() => {
    const salvo = localStorage.getItem('cdc_pedidos_v3');
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('cdc_pedidos_v3', JSON.stringify(pedidos));
  }, [pedidos]);

  // FUNÇÃO: Salva o pedido inicial (Solicitado)
  const adicionarPedido = (novoPedido) => {
    const pedidoCompleto = { 
      ...novoPedido, 
      id: `PED-${Date.now().toString().slice(-6)}`, // Gera um número de pedido visível
      status: 'Aberto',
      horario: new Date().toLocaleTimeString('pt-BR'),
      data: new Date().toLocaleDateString('pt-BR')
    };
    setPedidos([pedidoCompleto, ...pedidos]);
    setTelaAtiva('dashboard');
  };

  // FUNÇÃO: Atualiza o pedido com os itens realmente atendidos
  const finalizarAtendimento = (idPedido, itensAtendidos) => {
    setPedidos(pedidos.map(p => 
      p.id === idPedido ? { ...p, items: itensAtendidos, status: 'Atendido' } : p
    ));
    setTelaAtiva('relatorios');
  };

  const totalAbertos = pedidos.filter(p => p.status === 'Aberto').length;
  const totalAtendidos = pedidos.filter(p => p.status === 'Atendido').length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <BarraLateral setTelaAtiva={setTelaAtiva} telaAtiva={telaAtiva} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {telaAtiva === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-12">
            <BannerBoasVindas />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CartaoStatus titulo="Pedidos Aguardando" total={totalAbertos} cor="azul" />
              <CartaoStatus titulo="Pedidos Concluídos" total={totalAtendidos} cor="verde" />
            </div>
          </div>
        )}

        {telaAtiva === 'fazer-pedido' && <PaginaPedidos onSalvarPedido={adicionarPedido} />}
        
        {telaAtiva === 'atender-pedidos' && (
          <PaginaAtendimento 
            pedidos={pedidos} 
            onFinalizarAtendimento={finalizarAtendimento} 
          />
        )}

        {telaAtiva === 'relatorios' && <PaginaRelatorios pedidos={pedidos} />}
      </main>
    </div>
  );
}

export default App;