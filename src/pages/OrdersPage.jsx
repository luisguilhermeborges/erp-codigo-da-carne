import React, { useState } from 'react';
import { PRODUCT_DATABASE } from '../data/products'; //
import { Plus, Minus, Search, ShoppingCart, Check, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';

const OrdersPage = ({ onSaveOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

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
      return delta > 0 ? [...prev, { ...item, orderQty: delta }] : prev;
    });
  };

  const getQty = (id) => cart.find(i => i.id === id)?.orderQty || 0;

  const handleFinishOrder = () => {
    if (cart.length === 0) return;
    onSaveOrder({
      items: cart,
      date: new Date().toISOString(),
      total: cart.reduce((acc, item) => acc + (item.price * item.orderQty), 0)
    });
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {!showCheckout ? (
        <>
          {/* HEADER DA PÁGINA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Fazer Pedido</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Seleção de produtos para produção</p>
            </div>
            
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
            >
              {showCategories ? (
                <> <EyeOff size={16} className="text-blue-600" /> Esconder Categorias </>
              ) : (
                <> <Eye size={16} className="text-blue-600" /> Mostrar Categorias </>
              )}
            </button>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="relative mb-12 max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
            <input 
              type="text" 
              placeholder="Pesquisar corte ou código..." 
              className="w-full bg-white p-6 pl-16 rounded-[2.5rem] border-none shadow-sm focus:ring-4 focus:ring-blue-50 outline-none text-base transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* GRID DE PRODUTOS */}
          <div className="space-y-16 pb-40">
            {categories.map(cat => (
              <div key={cat} className={`space-y-8 transition-all duration-500 ${!showCategories ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <div className="flex items-center gap-4 ml-4">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">{cat}</h3>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PRODUCT_DATABASE.filter(p => p.category === cat && p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                    <div key={product.id} className={`bg-white p-8 rounded-[3rem] border transition-all flex flex-col gap-6 group relative ${getQty(product.id) > 0 ? 'border-blue-500 shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}>
                      <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${getQty(product.id) > 0 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-200'}`}>
                          <Check size={28} strokeWidth={3} />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase">#{product.code}</p>
                          <p className="text-blue-600 font-black text-sm tracking-tighter">R$ {product.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-800 leading-tight mb-1">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{product.unit}</p>
                      </div>

                      <div className="flex items-center bg-slate-50 rounded-[1.5rem] p-2 gap-2 border border-slate-100 mt-2">
                        <button onClick={() => handleQty(product, -1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-red-500 transition-all text-slate-400"><Minus size={18}/></button>
                        <span className="flex-1 text-center text-lg font-black text-slate-800">{getQty(product.id)}</span>
                        <button onClick={() => handleQty(product, 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-blue-600 transition-all text-slate-400"><Plus size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BOTÃO FLUTUANTE REVISAR */}
          {cart.length > 0 && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#0a0b1e] text-white p-7 rounded-[2.5rem] shadow-2xl flex justify-between items-center hover:scale-[1.03] transition-all border border-white/10 group"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-blue-600 p-4 rounded-2xl group-hover:rotate-12 transition-transform"><ShoppingCart size={28}/></div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-0.5">Revisar Pedido</p>
                    <p className="text-lg font-bold tracking-tight">{cart.length} itens no carrinho</p>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-full mr-2"><ChevronRight size={24} className="text-blue-500" /></div>
              </button>
            </div>
          )}
        </>
      ) : (
        <CheckoutScreen cart={cart} onBack={() => setShowCheckout(false)} onFinish={handleFinishOrder} />
      )}
    </div>
  );
};

const CheckoutScreen = ({ cart, onBack, onFinish }) => {
  return (
    <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 max-w-4xl mx-auto mb-24 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-4">
            Revisão Final
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Confirme os itens selecionados</p>
        </div>
        <button onClick={onBack} className="bg-slate-50 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">Editar Lista</button>
      </div>

      <div className="space-y-4 mb-16">
        {cart.map(item => (
          <div key={item.id} className="bg-slate-50/50 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-blue-600 shadow-sm border border-slate-50">
                {item.orderQty}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase">#{item.code}</p>
                <h4 className="text-base font-bold text-slate-800">{item.name}</h4>
              </div>
            </div>
            <div className="text-right">
               <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{item.unit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <Check size={32} strokeWidth={3} />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase leading-relaxed max-w-[200px]">Tudo pronto para enviar à produção.</p>
        </div>
        
        <button 
          onClick={onFinish}
          className="w-full md:w-auto bg-blue-600 text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:translate-y-[-4px] transition-all active:scale-95"
        >
          Enviar Pedido
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;