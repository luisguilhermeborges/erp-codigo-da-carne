import React, { useState } from 'react';
import { PRODUCT_DATABASE } from '../data/produtos'; 
import { Plus, Minus, Search, ShoppingCart, Check, Eye, EyeOff, ChevronRight } from 'lucide-react';

const PaginaPedidos = ({ onSalvarPedido }) => {
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  
  // UX: Permite esconder as categorias para limpar a tela em tablets ou telas menores.
  const [mostrarCategorias, setMostrarCategorias] = useState(true);

  // CATEGORIAS: Lista fixa baseada na estrutura do Código da Carne.
  const categorias = [
    'La Duquesa (Dia a Dia)', 'La Reina', 'La Duquesa (Intermediária)', 
    'Código Series', 'Itens Secos', 'Bebidas'
  ];

  // FUNÇÃO: Adiciona ou remove itens do carrinho. 
  // Se a quantidade chegar a 0, o item é removido da lista automaticamente.
  const ajustarQtd = (produto, delta) => {
    setCarrinho(prev => {
      const existe = prev.find(i => i.id === produto.id);
      if (existe) {
        const novaQtd = Math.max(0, existe.qtdPedido + delta);
        if (novaQtd === 0) return prev.filter(i => i.id !== produto.id);
        return prev.map(i => i.id === produto.id ? { ...i, qtdPedido: novaQtd } : i);
      }
      return delta > 0 ? [...prev, { ...produto, qtdPedido: delta }] : prev;
    });
  };

  const verQtd = (id) => carrinho.find(i => i.id === id)?.qtdPedido || 0;

  // FUNÇÃO: Finaliza o pedido e envia os dados consolidados para o App.jsx.
  const finalizarPedido = () => {
    if (carrinho.length === 0) return;
    onSalvarPedido({
      items: carrinho,
      data: new Date().toISOString(),
      // Redutor para calcular o total financeiro do pedido.
      total: carrinho.reduce((acc, item) => acc + (item.price * item.qtdPedido), 0)
    });
    setCarrinho([]); // Limpa o carrinho local.
    setMostrarCheckout(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {!mostrarCheckout ? (
        <>
          {/* TOPO: Título e botão de visibilidade. */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Fazer Pedido</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Seleção de itens para produção</p>
            </div>
            
            <button 
              onClick={() => setMostrarCategorias(!mostrarCategorias)}
              className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
            >
              {mostrarCategorias ? <><EyeOff size={16} /> Ocultar Categorias</> : <><Eye size={16} /> Ver Categorias</>}
            </button>
          </div>

          {/* BUSCA: Filtra produtos pelo nome ou código em tempo real. */}
          <div className="relative mb-12 max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
            <input 
              type="text" 
              placeholder="Pesquisar corte..." 
              className="w-full bg-white p-6 pl-16 rounded-[2.5rem] border-none shadow-sm outline-none text-base font-medium"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* LISTAGEM: Agrupada por categorias conforme solicitado. */}
          <div className="space-y-16 pb-40">
            {categorias.map(cat => (
              <div key={cat} className={`space-y-8 ${!mostrarCategorias ? 'hidden' : 'block'}`}>
                <div className="flex items-center gap-4 ml-4">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">{cat}</h3>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PRODUCT_DATABASE.filter(p => p.category === cat && p.name.toLowerCase().includes(busca.toLowerCase())).map(produto => (
                    <div key={produto.id} className={`bg-white p-8 rounded-[3rem] border transition-all flex flex-col gap-6 ${verQtd(produto.id) > 0 ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 shadow-sm'}`}>
                      <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${verQtd(produto.id) > 0 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-200'}`}>
                          <Check size={28} strokeWidth={3} />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase">#{produto.code}</p>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-slate-800">{produto.name}</h4>

                      <div className="flex items-center bg-slate-50 rounded-[1.5rem] p-2 gap-2 border border-slate-100">
                        <button onClick={() => ajustarQtd(produto, -1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400"><Minus size={18}/></button>
                        <span className="flex-1 text-center text-lg font-black text-slate-800">{verQtd(produto.id)}</span>
                        <button onClick={() => ajustarQtd(produto, 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-400"><Plus size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BOTÃO FLUTUANTE: Só aparece se houver itens no carrinho. */}
          {carrinho.length > 0 && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
              <button 
                onClick={() => setMostrarCheckout(true)}
                className="w-full bg-[#0a0b1e] text-white p-7 rounded-[2.5rem] shadow-2xl flex justify-between items-center hover:scale-[1.03] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-blue-600 p-4 rounded-2xl"><ShoppingCart size={28}/></div>
                  <p className="text-lg font-bold">{carrinho.length} Itens no Carrinho</p>
                </div>
                <ChevronRight size={24} className="text-blue-500" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* COMPONENTE DE CHECKOUT: Mostra o resumo final para confirmação. */
        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Conferência Final</h3>
            <button onClick={() => setMostrarCheckout(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">Voltar</button>
          </div>
          <div className="space-y-4 mb-16">
            {carrinho.map(item => (
              <div key={item.id} className="bg-slate-50/50 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-slate-50">{item.qtdPedido}</div>
                  <h4 className="text-base font-bold text-slate-800">{item.name}</h4>
                </div>
              </div>
            ))}
          </div>
          <button onClick={finalizarPedido} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all">
            Enviar para Produção
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginaPedidos;