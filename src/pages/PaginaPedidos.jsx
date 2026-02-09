import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Filter, ChevronDown, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const PaginaPedidos = () => {
  const [estoque, setEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filiaisAcesso, setFiliaisAcesso] = useState([]);
  const [filialSelecionada, setFilialSelecionada] = useState('');
  const [categoriasAbertas, setCategoriasAbertas] = useState([]);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });

  useEffect(() => {
    // 1. DADOS MESTRE
    const sessao = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
    const todosUsuarios = JSON.parse(localStorage.getItem('usuarios_erp') || '[]');
    const todasFiliais = JSON.parse(localStorage.getItem('filiais_cdc') || '[]');
    const estoqueSalvo = JSON.parse(localStorage.getItem('produtos_estoque_cdc') || '[]');

    // 2. BUSCA O USUÁRIO ATUALIZADO NA LISTA (O SEGREDO É ESSE)
    const userFresco = todosUsuarios.find(u => u.login === sessao.login) || sessao;

    // 3. FILTRA FILIAIS PELO CAMPO 'unidades'
    let permitidas = todasFiliais.filter(f => {
      if (userFresco.cargo === 'adm' || userFresco.cargo === 'ADM') return true;
      const minhasUnidades = Array.isArray(userFresco.unidades) ? userFresco.unidades : [];
      return minhasUnidades.includes(f.nome);
    });

    setFiliaisAcesso(permitidas);
    setEstoque(estoqueSalvo.filter(p => p.status === 'ATIVO'));
    if (permitidas.length === 1) setFilialSelecionada(permitidas[0].nome);
  }, []);

  const atualizarQtd = (id, delta) => {
    setCarrinho(prev => prev.map(item => {
      if (item.id === id) {
        const nova = Math.max(0, (parseFloat(item.qtd) || 0) + delta);
        return { ...item, qtd: parseFloat(nova.toFixed(3)) };
      }
      return item;
    }));
  };

  const finalizarPedido = () => {
    if (!filialSelecionada) return setAviso({ show: true, titulo: "Atenção", msg: "Escolha a filial destino.", tipo: "erro" });
    if (carrinho.length === 0) return setAviso({ show: true, titulo: "Vazio", msg: "O carrinho está vazio.", tipo: "erro" });

    const pedido = { id: Date.now(), filial: filialSelecionada, data: new Date().toLocaleString(), itens: carrinho };
    const hist = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    localStorage.setItem('historico_pedidos', JSON.stringify([pedido, ...hist]));
    
    setCarrinho([]);
    setAviso({ show: true, titulo: "Sucesso!", msg: "Pedido enviado para a logística.", tipo: "sucesso" });
  };

  return (
    <div className="flex h-full gap-8 p-8 relative">
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-center">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 animate-in zoom-in">
            {aviso.tipo === 'erro' ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4" /> : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500 uppercase">{aviso.msg}</p>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-800 tracking-tighter">Realizar Pedido</h2>
        <input className="w-full mt-4 p-5 bg-white border-2 border-slate-100 rounded-[24px] font-bold text-xs uppercase outline-none" placeholder="Buscar produto..." value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
        
        <div className="space-y-4 mt-6">
          {Object.entries(estoque.reduce((acc, p) => {
            if (p.nome.toLowerCase().includes(pesquisa.toLowerCase())) {
              const cat = p.categoria || "DIVERSOS";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(p);
            }
            return acc;
          }, {})).map(([categoria, itens]) => (
            <div key={categoria} className="bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-sm">
              <button onClick={() => setCategoriasAbertas(prev => prev.includes(categoria) ? prev.filter(c => c !== categoria) : [...prev, categoria])} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all">
                <span className="text-sm font-black uppercase tracking-widest text-slate-700">{categoria}</span>
                {categoriasAbertas.includes(categoria) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {categoriasAbertas.includes(categoria) && (
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {itens.map(prod => (
                    <div key={prod.id} className="p-4 bg-slate-50 rounded-[22px] border border-slate-100 flex justify-between items-center group">
                      <div className="flex-1 pr-2"><h4 className="text-[11px] font-black uppercase text-slate-800">{prod.nome}</h4><p className="text-xs font-black text-blue-600">R$ {prod.preco}</p></div>
                      <button onClick={() => setCarrinho([...carrinho, { ...prod, qtd: 1.000 }])} className="p-4 bg-white hover:bg-blue-600 hover:text-white rounded-2xl shadow-sm transition-all"><Plus size={20} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[420px] bg-slate-900 rounded-[44px] shadow-2xl overflow-hidden sticky top-8 h-[calc(100vh-64px)] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8"><ShoppingCart className="text-blue-500" /><h3 className="text-xl font-black uppercase italic text-white tracking-tighter">Carrinho</h3></div>
          <select value={filialSelecionada} onChange={e => setFilialSelecionada(e.target.value)} className="w-full p-4 bg-slate-800 rounded-2xl text-xs font-bold uppercase border-none text-white outline-none">
            <option value="">Destino do Pedido...</option>
            {filiaisAcesso.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {carrinho.map((item) => (
            <div key={item.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <h5 className="text-[10px] font-black uppercase text-white flex-1">{item.nome}</h5>
                <button onClick={() => setCarrinho(carrinho.filter(i => i.id !== item.id))} className="text-slate-600 hover:text-red-400 ml-2"><Trash2 size={16}/></button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-blue-400">R$ {item.preco}</p>
                <div className="flex items-center gap-2 bg-slate-700 p-1.5 rounded-xl border border-slate-600">
                  <button onClick={() => atualizarQtd(item.id, -1)} className="text-white hover:text-blue-400"><Minus size={14}/></button>
                  <input type="number" step="0.001" className="w-16 bg-transparent text-center text-xs font-black text-white border-none outline-none" value={item.qtd} onChange={e => {
                      const v = parseFloat(e.target.value);
                      setCarrinho(carrinho.map(c => c.id === item.id ? { ...c, qtd: isNaN(v) ? 0 : v } : c));
                  }} />
                  <button onClick={() => atualizarQtd(item.id, 1)} className="text-white hover:text-blue-400"><Plus size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 bg-slate-800/30">
          <button onClick={finalizarPedido} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl tracking-widest hover:bg-blue-500 transition-all">Confirmar Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPedidos;