import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Save, X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const salvo = localStorage.getItem('usuarios_erp');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [filiais] = useState(() => {
    const salvo = localStorage.getItem('filiais_cdc');
    return salvo ? JSON.parse(salvo) : [
      { id: 1, nome: "000 - PRODUÇÃO" },
      { id: 2, nome: "001 - CENTRO" },
      { id: 3, nome: "002 - ALPHAVILLE" },
      { id: 4, nome: "003 - GLEBA" }
    ];
  });
  
  const [editandoId, setEditandoId] = useState(null);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });
  const [form, setForm] = useState({ 
    nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] 
  });

  const exibirAviso = (titulo, msg, tipo = 'sucesso') => {
    setAviso({ show: true, titulo, msg, tipo });
  };

  const toggleUnidade = (nomeFilial) => {
    setForm(prev => {
      const jaTem = prev.unidades.includes(nomeFilial);
      return {
        ...prev,
        unidades: jaTem 
          ? prev.unidades.filter(f => f !== nomeFilial) 
          : [...prev.unidades, nomeFilial]
      };
    });
  };

  const salvarUser = (e) => {
    e.preventDefault();
    if (form.unidades.length === 0 && form.cargo !== 'adm') {
      return exibirAviso("Atenção", "Selecione ao menos uma base para este utilizador.", "erro");
    }

    let novaLista;
    if (editandoId) {
      novaLista = usuarios.map(u => u.id === editandoId ? { ...form, id: editandoId } : u);
      exibirAviso("Sucesso", "Dados e acessos atualizados.");
    } else {
      novaLista = [...usuarios, { ...form, id: Date.now() }];
      exibirAviso("Cadastrado", "Colaborador adicionado com sucesso.");
    }

    setUsuarios(novaLista);
    localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
    setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
    setEditandoId(null);
  };

  const excluirUser = (id) => {
    if (window.confirm("Eliminar este utilizador?")) {
      const nova = usuarios.filter(u => u.id !== id);
      setUsuarios(nova);
      localStorage.setItem('usuarios_erp', JSON.stringify(nova));
    }
  };

  return (
    <div className="p-8 space-y-6 relative">
      {/* MODAL DE AVISO CENTRALIZADO */}
      {aviso.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 text-center animate-in zoom-in">
            {aviso.tipo === 'erro' ? <AlertCircle size={64} className="text-red-500 mx-auto mb-4" /> : <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />}
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800">{aviso.titulo}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500 uppercase">{aviso.msg}</p>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Equipa e Acessos</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Configuração de permissões por base</p>
        </div>
        <UserPlus size={32} className="text-blue-500" />
      </header>

      <form onSubmit={salvarUser} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Login" value={form.login} onChange={e => setForm({...form, login: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required={!editandoId} />
        <select className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
          <option value="comercial">Comercial</option>
          <option value="pcp">PCP (Produção)</option>
          <option value="adm">Administrador</option>
        </select>

        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Filiais Autorizadas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filiais.map(f => (
              <button
                key={f.id} type="button" onClick={() => toggleUnidade(f.nome)}
                className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${form.unidades.includes(f.nome) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                {f.nome}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="md:col-span-2 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition-all">
          <Save size={18} className="inline mr-2" /> {editandoId ? 'Atualizar Colaborador' : 'Cadastrar Colaborador'}
        </button>
      </form>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase text-slate-400">
            <tr><th className="p-6">Colaborador</th><th className="p-6">Bases</th><th className="p-6 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-6">
                  <p className="font-black text-xs uppercase text-slate-800">{u.nome}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{u.cargo}</p>
                </td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-1">
                    {u.unidades?.map(un => <span key={un} className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded-md uppercase">{un}</span>)}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => {setEditandoId(u.id); setForm({...u});}} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl mr-2"><Edit2 size={16}/></button>
                  <button onClick={() => excluirUser(u.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
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