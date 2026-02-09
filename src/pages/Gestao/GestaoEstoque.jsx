import React, { useState, useEffect } from 'react';
import { Package, Plus, Save, Trash2, Edit2 } from 'lucide-react';

const GestaoEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ id: '', nome: '', categoria: 'BOVINOS', unidade: 'KG', preco: '0.00' });

  const carregar = async () => {
    const res = await fetch('http://localhost:5000/api/produtos');
    const data = await res.json();
    setProdutos(data);
  };

  useEffect(() => { carregar(); }, []);

  const salvarProd = async (e) => {
    e.preventDefault();
    const dados = { ...form, id: form.id || Date.now().toString(), status: 'ATIVO' };
    
    await fetch('http://localhost:5000/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    setForm({ id: '', nome: '', categoria: 'BOVINOS', unidade: 'KG', preco: '0.00' });
    carregar();
  };

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Gestão de Estoque</h1>
        <Package size={32} className="text-emerald-500" />
      </header>

      <form onSubmit={salvarProd} className="bg-white p-8 rounded-[40px] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 border border-slate-100">
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none md:col-span-2" placeholder="Nome do Produto" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <select className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
          <option value="BOVINOS">Bovinos</option>
          <option value="AVES">Aves</option>
          <option value="SUINOS">Suínos</option>
          <option value="DIVERSOS">Diversos</option>
        </select>
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Preço" type="number" step="0.01" value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} required />
        <button type="submit" className="md:col-span-4 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-emerald-700 transition-all">Salvar Produto no Banco</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {produtos.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center group">
            <div>
              <span className="text-[8px] font-black text-emerald-500 uppercase">{p.categoria}</span>
              <h4 className="text-[11px] font-black uppercase text-slate-800 leading-tight">{p.nome}</h4>
              <p className="text-xs font-black text-slate-400 mt-1">R$ {p.preco}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(p)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-500"><Edit2 size={16}/></button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestaoEstoque;