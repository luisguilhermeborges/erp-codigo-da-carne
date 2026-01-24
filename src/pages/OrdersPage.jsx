import React, { useState } from 'react';
import { PRODUCT_DATABASE } from '../data/products';
import { Plus, Minus, Search, ShoppingCart, Check, Trash2 } from 'lucide-react';

const OrdersPage = () => {
  const [mode, setMode] = useState('make'); // 'make' ou 'fulfill'
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const categories = [
    'La Duquesa (Dia a Dia)', 'La Reina', 'La Duquesa (Intermediária)', 
    'Código Series', 'Itens Secos', 'Bebidas'
  ];

  const handleQty = (item, delta) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQty = Math.max(0, existing.orderQty + delta);
        if (newQty === 0) return prev.filter(i => i.id !== item.id);
        return prev.map(i => i.id === item.id ? { ...i, orderQty: newQty } : i);
      }
      return delta > 0 ? [...prev, { ...item, orderQty: delta, reason: '' }] : prev;
    });
  };

  const getQty = (id) => cart.find(i => i.id === id)?.orderQty || 0;

  return (
    <div className="animate-in fade-in duration-500">
      {/* HEADER DE STATUS */}
      <div className="bg-[#0a0b1e] rounded-[2.5rem] p-10 mb-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl border border-white/5 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 uppercase tracking-tighter">Central de Pedidos</h2>
          <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span>👤 Luis Guilherme</span>
            <span>📍 Loja: Alphaville</span>
            <span>📅 {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button onClick={() => setMode('make')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'make' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Fazer Pedido</button>
          <button onClick={() => setMode('fulfill')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'fulfill' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Atender Pedido</button>
        </div>
      </div>

      {!showCheckout ? (
        <>
          <div className="relative mb-12 max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar corte ou código..." 
              className="w-full bg-white p-5 pl-14 rounded-[2rem] border-none shadow-sm focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-14 pb-40">
            {categories.map(cat => (
              <div key={cat} className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">{cat}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PRODUCT_DATABASE.filter(p => p.category === cat && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                    <div key={product.id} className={`bg-white p-6 rounded-[2.5rem] border transition-all flex items-center justify-between group ${getQty(product.id) > 0 ? 'border-blue-500 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${getQty(product.id) > 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
                          <Check size={24} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase">#{product.code}</p>
                          <h4 className="text-sm font-bold text-slate-700 leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{product.unit}</p>
                          {mode === 'fulfill' && <p className="text-blue-600 font-black text-xs mt-1 tracking-tighter">R$ {product.price.toFixed(2)}</p>}
                        </div>
                      </div>
                      <div className="flex items-center bg-slate-50 rounded-2xl p-1 gap-1 border border-slate-100">
                        <button onClick={() => handleQty(product, -1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-slate-400 hover:text-red-500"><Minus size={16}/></button>
                        <span className="w-8 text-center text-xs font-black text-slate-800">{getQty(product.id)}</span>
                        <button onClick={() => handleQty(product, 1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-slate-400 hover:text-blue-600"><Plus size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#0a0b1e] text-white p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center hover:scale-[1.02] transition-all border border-white/10"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-blue-600 p-3 rounded-2xl"><ShoppingCart size={24}/></div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Revisar Pedido</p>
                    <p className="text-base font-bold">{cart.length} itens selecionados</p>
                  </div>
                </div>
                <div className="pr-2"><Check size={24} className="text-blue-500" /></div>
              </button>
            </div>
          )}
        </>
      ) : (
        <CheckoutScreen cart={cart} setCart={setCart} onBack={() => setShowCheckout(false)} mode={mode} />
      )}
    </div>
  );
};

const CheckoutScreen = ({ cart, onBack, mode, setCart }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.orderQty), 0);

  return (
    <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 max-w-5xl mx-auto mb-24 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-bold flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><ShoppingCart size={24} /></div>
          Confirmação do Pedido
        </h3>
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Ajustar Itens</button>
      </div>

      <div className="space-y-6 mb-12">
        {cart.map(item => (
          <div key={item.id} className="bg-slate-50 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100">
            <div className="flex items-center gap-8 flex-1">
              <div className="bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl text-blue-600 shadow-sm border border-slate-100">
                {item.orderQty}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{item.code}</p>
                <h4 className="text-lg font-bold text-slate-800">{item.name}</h4>
                {mode === 'fulfill' && <p className="text-sm text-blue-600 font-bold">R$ {item.price.toFixed(2)} / {item.unit}</p>}
              </div>
            </div>
            
            <div className="w-full md:w-80">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Observação / Sobra</label>
              <input 
                type="text" 
                placeholder="Motivo de não envio ou ajuste..."
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                value={item.reason}
                onChange={(e) => {
                  const newCart = cart.map(i => i.id === item.id ? { ...i, reason: e.target.value } : i);
                  setCart(newCart);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Check size={24} />
          </div>
          <p className="text-xs text-slate-500 font-medium">Confirme os dados antes de finalizar o envio para a produção.</p>
        </div>
        <div className="flex items-center gap-10">
          {mode === 'fulfill' && (
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total do Atendimento</p>
              <p className="text-3xl font-black text-blue-600 tracking-tighter">R$ {total.toFixed(2)}</p>
            </div>
          )}
          <button className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all">
            Enviar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;