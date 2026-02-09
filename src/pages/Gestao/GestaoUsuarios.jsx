import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, CheckCircle, AlertCircle } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });
  const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });

  const filiaisMaster = ["000 - PRODUÇÃO", "001 - CENTRO", "002 - ALPHAVILLE", "003 - GLEBA"];

  const carregar = async () => {
    const res = await fetch('http://localhost:5000/api/usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => { carregar(); }, []);

  const toggleUnidade = (nome) => {
    setForm(prev => ({
      ...prev,
      unidades: prev.unidades.includes(nome) ? prev.unidades.filter(u => u !== nome) : [...prev.unidades, nome]
    }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setAviso({ show: true, titulo: "Sucesso", msg: "Utilizador atualizado no MongoDB.", tipo: "sucesso" });
        setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
        carregar();
      }
    } catch {
      setAviso({ show: true, titulo: "Erro", msg: "Falha na conexão.", tipo: "erro" });
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* MODAL DE AVISO */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-10 text-center max-w-md w-full shadow-2xl">
            {aviso.tipo === 'erro' ? <AlertCircle size={64} className="text-red-500 mx-auto" /> : <CheckCircle size={64} className="text-emerald-500 mx-auto" />}
            <h3 className="text-2xl font-black uppercase mt-4">{aviso.titulo}</h3>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Gestão de Equipa</h1>
        <UserPlus size={32} className="text-blue-500" />
      </header>

      <form onSubmit={salvar} className="bg-white p-8 rounded-[40px] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 border border-slate-100">
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Login" value={form.login} onChange={e => setForm({...form, login: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
        <select className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
          <option value="comercial">Comercial</option>
          <option value="adm">Administrador</option>
        </select>

        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400">Bases Autorizadas:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filiaisMaster.map(f => (
              <button key={f} type="button" onClick={() => toggleUnidade(f)} className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${form.unidades.includes(f) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="md:col-span-2 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs">Gravar no MongoDB</button>
      </form>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b font-black text-[10px] uppercase text-slate-400">
            <tr><th className="p-6">Nome</th><th className="p-6">Acessos</th><th className="p-6 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-6 font-black text-xs uppercase">{u.nome} <span className="block text-[8px] text-blue-500">{u.cargo}</span></td>
                <td className="p-6 flex flex-wrap gap-1">
                  {u.unidades?.map(un => <span key={un} className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-1 rounded uppercase">{un}</span>)}
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => setForm(u)} className="p-2 text-blue-400"><Edit2 size={16}/></button>
                  <button onClick={async () => { await fetch(`http://localhost:5000/api/usuarios/${u._id}`, {method:'DELETE'}); carregar(); }} className="p-2 text-red-300"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoUsuarios;