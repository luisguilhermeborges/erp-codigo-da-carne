import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingCart, Plus, Minus, Trash2, 
  Filter, ChevronDown, ChevronRight, Building2, 
  CheckCircle, AlertCircle 
} from 'lucide-react';

const PaginaPedidos = () => {
  const [estoque, setEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filiaisAcesso, setFiliaisAcesso] = useState([]);
  const [filialSelecionada, setFilialSelecionada] = useState('');
  const [categoriasAbertas, setCategoriasAbertas] = useState([]);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });

  useEffect(() => {
    // 1. Puxa o usuário que está logado no momento
    const usuarioAtivo = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
    const todasFiliais = JSON.parse(localStorage.getItem('filiais_cdc') || '[]');
    const estoqueValidado = JSON.parse(localStorage.getItem('produtos_estoque_cdc') || '[]');
    
    // 2. Filtra filiais permitidas
    // Se for ADM, vê todas. Senão, vê apenas as que estão no seu array 'unidades'
    const permitidas = usuarioAtivo.cargo === 'adm' 
      ? todasFiliais 
      : todasFiliais.filter(f => usuarioAtivo.unidades?.includes(f.nome));

    setFiliaisAcesso(permitidas);
    setEstoque(estoqueValidado.filter(p => p.status === 'ATIVO'));
    
    // Auto-seleciona se tiver só uma
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
    const itemExistente = carrinho.find(c => c.id === prod.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(c => c.id === prod.id ? { ...c, qtd: c.qtd + 1 } : c));
    } else {
      setCarrinho([...carrinho, { ...prod, qtd: 1 }]);
    }
    dispararAviso("Adicionado", `${prod.nome} está no carrinho.`);
  };

  const finalizarPedido = () => {
    if (!filialSelecionada) return dispararAviso("Atenção", "Selecione a filial destino.", "erro");
    if (carrinho.length === 0) return dispararAviso("Vazio", "O carrinho não tem itens.", "erro");

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
    dispararAviso("Sucesso", "Pedido enviado para processamento.");
  };

  return (
    <div className="flex h-full gap-8 p-8 relative">
      
      {/* MODAL DE AVISO CENTRALIZADO */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in duration-300">
            {aviso.tipo === 'erro' ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4" /> : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500 uppercase">{aviso.msg}</p>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      {/* CATÁLOGO DE ITENS */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <header className="mb-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 tracking-tighter">Realizar Pedido</h2>
          <div className="mt-6 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-bold text-xs uppercase focus:border-blue-500 outline-none shadow-sm" placeholder="O que deseja pedir?" value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
          </div>
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
                          <p className="text-[9px] font-black text-slate-300 uppercase">#{prod.codigo}</p>
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

      {/* PAINEL DE FINALIZAÇÃO */}
      <div className="w-[420px] bg-slate-900 rounded-[44px] shadow-2xl overflow-hidden sticky top-8 h-[calc(100vh-64px)] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8"><ShoppingCart className="text-blue-500" /><h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Carrinho</h3></div>
          
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-2">Filial de Destino</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select value={filialSelecionada} onChange={e => setFilialSelecionada(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-800 rounded-2xl text-xs font-bold uppercase border-none focus:ring-2 ring-blue-500 text-white appearance-none">
              <option value="">Selecione sua base...</option>
              {filiaisAcesso.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrinho.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
              <div className="flex-1 pr-2">
                <h5 className="text-[10px] font-black uppercase text-white leading-tight">{item.nome}</h5>
                <p className="text-[9px] font-bold text-blue-400 mt-1">R$ {item.preco} x{item.qtd}</p>
              </div>
              <button onClick={() => setCarrinho(carrinho.filter((_, i) => i !== idx))} className="text-slate-600 hover:text-red-400"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-800/30">
          <button onClick={finalizarPedido} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl">Finalizar Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;