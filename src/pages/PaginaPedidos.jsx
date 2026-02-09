import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Filter, ChevronDown, ChevronRight, Building2, CheckCircle, AlertCircle } from 'lucide-react';

const PaginaPedidos = () => {
  const [estoque, setEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filiaisAcesso, setFiliaisAcesso] = useState([]);
  const [filialSelecionada, setFilialSelecionada] = useState('');
  const [categoriasAbertas, setCategoriasAbertas] = useState([]);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });

  useEffect(() => {
    const usuarioAtivo = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
    const todasFiliais = JSON.parse(localStorage.getItem('filiais_cdc') || '[]');
    const estoqueValidado = JSON.parse(localStorage.getItem('produtos_estoque_cdc') || '[]');
    
    // Filtro Inteligente: Verifica permissão por array ou campo único
    let permitidas = todasFiliais.filter(f => {
      if (usuarioAtivo.cargo === 'adm' || usuarioAtivo.cargo === 'ADM') return true;
      const unidadesArray = usuarioAtivo.unidades || [];
      const unidadeUnica = usuarioAtivo.unidade || '';
      return unidadesArray.includes(f.nome) || f.nome.includes(unidadeUnica);
    });

    setFiliaisAcesso(permitidas);
    setEstoque(estoqueValidado.filter(p => p.status === 'ATIVO'));
    if (permitidas.length === 1) setFilialSelecionada(permitidas[0].nome);
  }, []);

  const dispararAviso = (titulo, msg, tipo = 'sucesso') => {
    setAviso({ show: true, titulo, msg, tipo });
  };

  const estoqueAgrupado = useMemo(() => {
    const grupos = {};
    estoque.forEach(item => {
      if (item.nome.toLowerCase().includes(pesquisa.toLowerCase())) {
        const cat = item.categoria || "DIVERSOS";
        if (!grupos[cat]) grupos[cat] = [];
        grupos[cat].push(item);
      }
    });
    return grupos;
  }, [estoque, pesquisa]);

  const adicionarAoCarrinho = (prod) => {
    const existe = carrinho.find(c => c.id === prod.id);
    if (existe) {
      atualizarQtd(prod.id, 1);
    } else {
      setCarrinho([...carrinho, { ...prod, qtd: 1.000 }]);
    }
  };

  const atualizarQtd = (id, delta) => {
    setCarrinho(carrinho.map(c => {
      if (c.id === id) {
        const novaQtd = Math.max(0.001, parseFloat(c.qtd) + delta);
        return { ...c, qtd: parseFloat(novaQtd.toFixed(3)) };
      }
      return c;
    }));
  };

  const finalizarPedido = () => {
    if (!filialSelecionada) return dispararAviso("Filial Ausente", "Escolha a base de destino.", "erro");
    if (carrinho.length === 0) return dispararAviso("Carrinho Vazio", "Adicione itens primeiro.", "erro");

    const pedido = { 
      id: Date.now(), 
      filial: filialSelecionada, 
      data: new Date().toLocaleString(), 
      itens: carrinho,
      status: 'PENDENTE'
    };
    
    const hist = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    localStorage.setItem('historico_pedidos', JSON.stringify([pedido, ...hist]));
    
    setCarrinho([]);
    dispararAviso("Pedido Confirmado", "Enviado com sucesso para a logística.");
  };

  return (
    <div className="flex h-full gap-8 p-8 relative">
      {/* MODAL CENTRAL */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 text-center animate-in zoom-in duration-300">
            {aviso.tipo === 'erro' ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4" /> : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500 uppercase">{aviso.msg}</p>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">OK</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <header className="mb-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 tracking-tighter">Realizar Pedido</h2>
          <input className="w-full mt-6 pl-6 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-bold text-xs uppercase outline-none focus:border-blue-500 shadow-sm" placeholder="O que deseja pedir?" value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
        </header>

        <div className="space-y-4">
          {Object.entries(estoqueAgrupado).map(([categoria, itens]) => {
            const isOpen = categoriasAbertas.includes(categoria);
            return (
              <div key={categoria} className="bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-sm">
                <button onClick={() => setCategoriasAbertas(prev => isOpen ? prev.filter(c => c !== categoria) : [...prev, categoria])} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Filter size={18} /></div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">{categoria}</h3>
                  </div>
                  {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itens.map((prod) => (
                      <div key={prod.id} className="p-4 bg-slate-50 rounded-[22px] border border-slate-100 flex justify-between items-center group">
                        <div className="flex-1 pr-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-800 leading-tight">{prod.nome}</h4>
                          <p className="text-xs font-black text-blue-600 mt-1">R$ {prod.preco}</p>
                        </div>
                        <button onClick={() => adicionarAoCarrinho(prod)} className="p-4 bg-white hover:bg-blue-600 hover:text-white rounded-2xl shadow-sm transition-all"><Plus size={20} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[420px] bg-slate-900 rounded-[44px] shadow-2xl overflow-hidden h-[calc(100vh-64px)] sticky top-8 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8"><ShoppingCart className="text-blue-500" /><h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Carrinho</h3></div>
          <select value={filialSelecionada} onChange={e => setFilialSelecionada(e.target.value)} className="w-full p-4 bg-slate-800 rounded-2xl text-xs font-bold uppercase border-none text-white outline-none">
            <option value="">Selecione sua base...</option>
            {filiaisAcesso.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrinho.map((item) => (
            <div key={item.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-[10px] font-black uppercase text-white leading-tight flex-1">{item.nome}</h5>
                <button onClick={() => setCarrinho(carrinho.filter(i => i.id !== item.id))} className="text-slate-600 hover:text-red-400 ml-2"><Trash2 size={16} /></button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-blue-400">R$ {item.preco}</p>
                <div className="flex items-center gap-2 bg-slate-700 p-1.5 rounded-xl border border-slate-600">
                  <button onClick={() => atualizarQtd(item.id, -1)} className="text-white hover:text-blue-400"><Minus size={14}/></button>
                  <input 
                    type="number" step="0.001" 
                    className="w-16 bg-transparent text-center text-xs font-black text-white border-none p-0 outline-none"
                    value={item.qtd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCarrinho(carrinho.map(c => c.id === item.id ? { ...c, qtd: val || 0 } : c));
                    }}
                  />
                  <button onClick={() => atualizarQtd(item.id, 1)} className="text-white hover:text-blue-400"><Plus size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-800/30">
          <button onClick={finalizarPedido} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl tracking-widest hover:bg-blue-500 transition-all">
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;