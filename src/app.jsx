import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WelcomeBanner from './components/WelcomeBanner';
import StockSelector from './components/StockSelector';
import OrdersTable from './components/OrdersTable';
import StatusCard from './components/StatusCard';
import StockEntryForm from './components/StockEntryForm';
import OrdersPage from './pages/OrdersPage';

function App() {
  const [activeStock, setActiveStock] = useState('matriz');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('dashboard'); // 'dashboard' ou 'pedidos'
  
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory_cdc_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('inventory_cdc_v2', JSON.stringify(inventory));
  }, [inventory]);

  const addStockItem = (newItem) => {
    const status = Number(newItem.qty) <= 5 ? 'Baixo Estoque' : 'Em Estoque';
    setInventory([{ ...newItem, id: Date.now(), status }, ...inventory]);
  };

  const deleteItem = (id) => {
    if (window.confirm("Deseja remover este item do estoque?")) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const currentItems = inventory.filter(item => 
    item.unit === activeStock && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar setView={setView} activeView={view} />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {view === 'dashboard' ? (
          <div className="animate-in fade-in duration-700 max-w-7xl mx-auto space-y-12">
            <WelcomeBanner />
            <StockSelector activeStock={activeStock} setActiveStock={setActiveStock} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatusCard title="Unidade" count={activeStock.toUpperCase()} color="blue" />
              <StatusCard title="Produtos" count={currentItems.length} color="green" />
              <StatusCard title="Peso Total" count={`${currentItems.reduce((a, b) => a + Number(b.qty), 0).toFixed(2)}kg`} color="purple" />
            </div>

            <StockEntryForm activeStock={activeStock} onAdd={addStockItem} />
            
            <OrdersTable 
              items={currentItems} 
              stockName={activeStock} 
              onDelete={deleteItem}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <OrdersPage />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;