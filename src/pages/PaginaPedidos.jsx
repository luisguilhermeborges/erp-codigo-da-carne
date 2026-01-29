import React, { useState, useMemo } from 'react';
import { categoriasProdutos } from '../data/produtos';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  MapPin 
} from 'lucide-react';

const PaginaPedidos = ({ user }) => {
  const [unidadeSolicitante, setUnidadeSolicitante] = useState(
    user.cargo === 'comercial' ? user.unidade : '001'
  );
  
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [categoriasAbertas, setCategoriasAbertas] = useState(['dia-a-dia']);

  const categoriasFiltradas = useMemo(() => {
    if (!busca) return categoriasProdutos;
    return categoriasProdutos.map(cat => ({
      ...cat,
      itens: cat.itens.filter(p => 
        p.nome.toLowerCase().includes(busca.toLowerCase()) || 
        p.codigo.toLowerCase().includes(busca.toLowerCase())
      )
    })).filter(cat => cat.itens.length > 0);
  }, [busca]);

  const toggleCategoria = (id) => {
    setCategoriasAbertas(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const existe = prev.find(i => i.codigo === produto.codigo);
      if (existe) {
        return prev.map(i => i.codigo === produto.codigo ? { ...i, qtd: Number(i.qtd) + 1 } : i);
      }
      // Inicializa kg com 4,000 e un com 1
      return [...prev, { ...produto, qtd: produto.unidade === 'kg' ? 4.000 : 1 }];
    });
  };

  const atualizarQtd = (codigo, novaQtd) => {
    const valor = Number(novaQtd);
    if (valor <= 0) {
      setCarrinho(prev => prev.filter(i => i.codigo !== codigo));
    } else {
      setCarrinho(prev => prev.map(i => i.codigo === codigo ? { ...i, qtd: valor } : i));
    }
  };

  const totalGeral = carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0);

  const finalizarPedido = () => {
    if (carrinho.length === 0) return alert("O carrinho está vazio!");

    const novoPedido = {
      id: Math.floor(Math.random() * 9000) + 1000,
      cliente: `SOLICITAÇÃO BASE ${unidadeSolicitante}`,
      unidadeOrigem: unidadeSolicitante,
      solicitante: user.nome,
      itens: carrinho,
      total: totalGeral,
      data: new Date().toLocaleString(),
      status: 'Pendente',
      tipo: 'PEDIDO_LOJA'
    };

    const filaExistente = JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
    localStorage.setItem('fila_pedidos', JSON.stringify([...filaExistente, novoPedido]));

    alert(`✅ Pedido #${novoPedido.id} enviado com sucesso!`);
    setCarrinho([]);
  };

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${
            user.cargo === 'comercial' ? 'bg-slate-50 border-slate-100' : 'bg-white border-blue-100 shadow-sm'
          }`}>
            <MapPin className="text-blue-600" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidade Solicitante</p>
              <select 
                disabled={user.cargo === 'comercial'} 
                value={unidadeSolicitante} 
                onChange={(e) => setUnidadeSolicitante(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 font-black text-sm uppercase p-0 disabled:opacity-60"
              >
                <option value="000">000 - PRODUÇÃO</option>
                <option value="001">001 - CENTRO</option>
                <option value="002">002 - ALPHAVILLE</option>
                <option value="003">003 - GLEBA</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <Search className="text-slate-300" />
            <input 
              type="text" 
              placeholder="BUSCAR CÓDIGO OU NOME..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 border-none focus:ring-0 text-xs font-black uppercase"
            />
          </div>
        </div>

        <div className="space-y-4">
          {categoriasFiltradas.map(cat => (
            <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <button onClick={() => toggleCategoria(cat.id)} className="w-full flex justify-between p-6 items-center hover:bg-slate-50 transition-colors">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">{cat.nome}</span>
                {categoriasAbertas.includes(cat.id) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </button>

              {categoriasAbertas.includes(cat.id) && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 border-t border-slate-50">
                  {cat.itens.map(prod => (
                    <div key={prod.codigo} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-blue-400 transition-all">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{prod.codigo}</span>
                        <p className="text-sm font-black text-slate-800 uppercase">{prod.nome}</p>
                        <p className="text-xs text-slate-400 font-bold">R$ {prod.preco.toFixed(2)} / {prod.unidade}</p>
                      </div>
                      <button onClick={() => adicionarAoCarrinho(prod)} className="bg-slate-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90">
                        <Plus size={18}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[420px]">
        <div className="bg-[#0a0b1e] text-white p-8 rounded-[40px] sticky top-8 shadow-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <ShoppingCart size={20} />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em]">Resumo do Pedido</h2>
          </div>

          <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar mb-8">
            {carrinho.length === 0 ? (
              <div className="py-10 text-center opacity-20"><p className="text-[10px] font-black uppercase">Carrinho Vazio</p></div>
            ) : (
              carrinho.map(item => (
                <div key={item.codigo} className="flex justify-between items-center border-b border-white/5 pb-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider">{item.nome}</p>
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1 w-fit">
                      <button onClick={() => atualizarQtd(item.codigo, Number(item.qtd) - 1)} className="p-1 hover:text-blue-500"><Minus size={12}/></button>
                      <input 
                        type="number" 
                        step={item.unidade === 'kg' ? "1.000" : "1"}
                        value={item.qtd} 
                        onChange={(e) => atualizarQtd(item.codigo, e.target.value)}
                        className="w-20 text-center text-[11px] font-black text-blue-400 bg-transparent border-none focus:ring-0 p-0" 
                      />
                      <button onClick={() => atualizarQtd(item.codigo, Number(item.qtd) + 1)} className="p-1 hover:text-blue-500"><Plus size={12}/></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      {Number(item.qtd).toFixed(item.unidade === 'kg' ? 3 : 0)} {item.unidade}
                    </p>
                    <p className="text-xs font-black text-white">R$ {(item.preco * item.qtd).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase">Total Estimado</span>
              <span className="text-3xl font-black text-blue-500">R$ {totalGeral.toFixed(2)}</span>
            </div>
            <button onClick={finalizarPedido} disabled={carrinho.length === 0} className="w-full bg-blue-600 hover:bg-blue-50 py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl transition-all">
              Finalizar Solicitação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;