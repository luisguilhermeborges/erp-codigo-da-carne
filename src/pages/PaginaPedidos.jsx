import React, { useState, useMemo } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { ChevronDown, ChevronUp, ShoppingCart, User, Trash2, Plus, Minus, Search, CheckCircle } from 'lucide-react';

const PaginaPedidos = () => {
  const [usuario, setUsuario] = useState('1');
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [categoriasAbertas, setCategoriasAbertas] = useState(['dia-a-dia']);

  const categoriasFiltradas = useMemo(() => {
    if (!busca) return categoriasProdutos;
    return categoriasProdutos.map(cat => ({
      ...cat,
      itens: cat.itens.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toLowerCase().includes(busca.toLowerCase()))
    })).filter(cat => cat.itens.length > 0);
  }, [busca]);

  const atualizarQtd = (codigo, novaQtd) => {
    const valor = Number(novaQtd);
    if (valor <= 0) setCarrinho(prev => prev.filter(i => i.codigo !== codigo));
    else setCarrinho(prev => prev.map(i => i.codigo === codigo ? { ...i, qtd: valor } : i));
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    
    const novoPedido = {
      id: Math.floor(Math.random() * 9000) + 1000,
      cliente: "BALCÃO UNIDADE 001",
      usuario: usuario,
      itens: carrinho,
      total: carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0),
      data: new Date().toLocaleString()
    };

    const fila = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
    localStorage.setItem('fila_pedidos', JSON.stringify([...fila, novoPedido]));
    
    alert(`✅ Pedido #${novoPedido.id} enviado para o Atendimento!`);
    setCarrinho([]);
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        {/* BUSCA E USUÁRIO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <User className="text-blue-600" />
            <select value={usuario} onChange={e => setUsuario(e.target.value)} className="font-black text-sm uppercase bg-transparent border-none focus:ring-0">
              <option value="1">USUÁRIO 01 - MATHIAS</option>
              <option value="2">USUÁRIO 02 - LUIS</option>
              <option value="3">USUÁRIO 03 - MARCO</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <Search className="text-slate-300" />
            <input type="text" placeholder="BUSCAR PRODUTO..." value={busca} onChange={e => setBusca(e.target.value)} className="flex-1 border-none focus:ring-0 text-xs font-black uppercase" />
          </div>
        </div>

        {/* LISTAGEM DE PRODUTOS */}
        {categoriasFiltradas.map(cat => (
          <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <button onClick={() => setCategoriasAbertas(prev => prev.includes(cat.id) ? prev.filter(c => c !== cat.id) : [...prev, cat.id])} className="w-full flex justify-between p-6 items-center hover:bg-slate-50">
              <span className="text-[11px] font-black uppercase tracking-widest">{cat.nome}</span>
              {(categoriasAbertas.includes(cat.id) || busca) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </button>
            {(categoriasAbertas.includes(cat.id) || busca) && (
              <div className="p-6 grid grid-cols-2 gap-4 bg-slate-50/50 border-t">
                {cat.itens.map(prod => (
                  <div key={prod.codigo} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
                    <div>
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">{prod.codigo}</span>
                      <p className="text-sm font-black text-slate-800 uppercase">{prod.nome}</p>
                      <p className="text-xs text-slate-400 font-bold">R$ {prod.preco.toFixed(2)}</p>
                    </div>
                    <button onClick={() => setCarrinho(prev => {
                      const ex = prev.find(i => i.codigo === prod.codigo);
                      if (ex) return prev.map(i => i.codigo === prod.codigo ? {...i, qtd: i.qtd + 1} : i);
                      return [...prev, {...prod, qtd: 1}];
                    })} className="bg-slate-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={18}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CARRINHO LATERAL */}
      <div className="w-[400px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-10"><ShoppingCart className="text-blue-500" /><h2 className="text-xs font-black uppercase tracking-widest">Resumo</h2></div>
          <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {carrinho.map(item => (
              <div key={item.codigo} className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase">{item.nome}</p>
                  <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1 w-fit">
                    <button onClick={() => atualizarQtd(item.codigo, item.qtd - 1)} className="p-1 hover:text-blue-500"><Minus size={12}/></button>
                    <input type="number" value={item.qtd} onChange={e => atualizarQtd(item.codigo, e.target.value)} className="w-10 text-center text-[11px] font-black text-blue-400 bg-transparent border-none focus:ring-0 p-0" />
                    <button onClick={() => atualizarQtd(item.codigo, item.qtd + 1)} className="p-1 hover:text-blue-500"><Plus size={12}/></button>
                  </div>
                </div>
                <button onClick={() => atualizarQtd(item.codigo, 0)} className="text-red-500/30 hover:text-red-500 ml-4"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Geral</span>
              <span className="text-2xl font-black text-blue-500">R$ {carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0).toFixed(2)}</span>
            </div>
            <button onClick={finalizarPedido} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3">
              <CheckCircle size={18} /> Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;