import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingCart, Tag, Filter, 
  Plus, Minus, Trash2, ChevronRight, CheckCircle 
} from 'lucide-react';

const PaginaPedidos = () => {
  const [estoque, setEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [cliente, setCliente] = useState('');

  // Carrega os produtos validados da Gestão de Estoque
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('produtos_estoque_cdc') || '[]');
    // Só exibe produtos ATIVOS
    setEstoque(dados.filter(p => p.status === 'ATIVO'));
  }, []);

  // Agrupa os produtos por Categoria para exibição
  const estoqueAgrupado = useMemo(() => {
    const grupos = {};
    const termo = pesquisa.toLowerCase();

    estoque.forEach(item => {
      if (item.nome.toLowerCase().includes(termo) || item.codigo.includes(termo)) {
        const cat = item.categoria || "DIVERSOS";
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(item);
      }
    });

    // Ordena as categorias alfabeticamente
    return Object.keys(grupos).sort().reduce((acc, key) => {
      acc[key] = grupos[key];
      return acc;
    }, {});
  }, [estoque, pesquisa]);

  const adicionarAoCarrinho = (produto) => {
    const existe = carrinho.find(item => item.id === produto.id);
    if (existe) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, qtd: 1 }]);
    }
  };

  const atualizarQtd = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = Math.max(1, item.qtd + delta);
        return { ...item, qtd: novaQtd };
      }
      return item;
    }));
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const finalizarPedido = () => {
    if (!cliente) return alert("Por favor, informe o nome do cliente.");
    if (carrinho.length === 0) return alert("O carrinho está vazio.");

    const novoPedido = {
      id: Date.now(),
      cliente,
      data: new Date().toLocaleString('pt-BR'),
      itens: carrinho,
      status: 'PENDENTE'
    };

    const historico = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    localStorage.setItem('historico_pedidos', JSON.stringify([novoPedido, ...historico]));
    
    setCarrinho([]);
    setCliente('');
    alert("Pedido realizado com sucesso!");
  };

  return (
    <div className="flex h-full gap-8 p-8 animate-in fade-in duration-500">
      
      {/* Coluna da Esquerda: Catálogo por Categorias */}
      <div className="flex-1 space-y-8 overflow-y-auto pr-4">
        <header>
          <h2 className="text-4xl font-black uppercase italic italic tracking-tighter text-slate-800">
            Balcão de Vendas
          </h2>
          <div className="mt-6 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-bold text-xs uppercase focus:border-blue-500 outline-none shadow-sm"
              placeholder="O que o cliente procura? (Nome ou Código)"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </header>

        <div className="space-y-10">
          {Object.entries(estoqueAgrupado).map(([categoria, produtos]) => (
            <section key={categoria} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  {categoria}
                </h3>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">
                  {produtos.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {produtos.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase">#{item.codigo}</span>
                        <h4 className="text-xs font-black uppercase text-slate-800 leading-tight pr-4">
                          {item.nome}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Preço Un.</p>
                        <p className="text-sm font-black text-blue-600">R$ {item.preco}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => adicionarAoCarrinho(item)}
                      className="mt-4 w-full py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Adicionar ao Item
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Coluna da Direita: Carrinho / Finalização */}
      <div className="w-[400px] flex flex-col bg-white border border-slate-100 rounded-[44px] shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-900 text-white">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-blue-500" />
            <h3 className="text-xl font-black uppercase italic italic tracking-tighter">Resumo do Pedido</h3>
          </div>
          <input 
            className="w-full p-4 bg-slate-800 rounded-2xl text-xs font-bold uppercase border-none focus:ring-2 ring-blue-500 text-white placeholder-slate-500"
            placeholder="Nome do Cliente..."
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrinho.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-40">
              <ShoppingCart size={48} />
              <p className="text-[10px] font-black uppercase tracking-widest">Carrinho Vazio</p>
            </div>
          ) : (
            carrinho.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <h5 className="text-[10px] font-black uppercase text-slate-700 leading-tight">{item.nome}</h5>
                  <p className="text-[9px] font-bold text-blue-600 mt-1">R$ {item.preco}</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                  <button onClick={() => atualizarQtd(item.id, -1)} className="p-1 text-slate-400 hover:text-red-500"><Minus size={14}/></button>
                  <span className="text-xs font-black text-slate-700">{item.qtd}</span>
                  <button onClick={() => atualizarQtd(item.id, 1)} className="p-1 text-slate-400 hover:text-blue-500"><Plus size={14}/></button>
                </div>
                <button onClick={() => removerDoCarrinho(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={finalizarPedido}
            disabled={carrinho.length === 0}
            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all
              ${carrinho.length > 0 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Confirmar Pedido <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;