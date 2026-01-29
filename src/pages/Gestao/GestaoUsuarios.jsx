import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Save, X, MapPin } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('usuarios_erp') || '[]'));
  const [filiais] = useState(['000 - PRODUÇÃO', '001 - CENTRO', '002 - ALPHAVILLE', '003 - GLEBA']);
  
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ 
    nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] 
  });

  const toggleUnidade = (cod) => {
    // Proteção: Garante que 'unidades' sempre seja um array antes de usar o includes
    const unidadesAtuais = Array.isArray(form.unidades) ? form.unidades : [];
    setForm(prev => ({
      ...prev,
      unidades: unidadesAtuais.includes(cod) 
        ? unidadesAtuais.filter(u => u !== cod) 
        : [...unidadesAtuais, cod]
    }));
  };

  const salvar = (e) => {
    e.preventDefault();
    
    // Validação de unidades para cargos que não são Master
    if (form.cargo !== 'master' && (!form.unidades || form.unidades.length === 0)) {
      return alert("Selecione ao menos uma unidade de acesso!");
    }

    let novaLista;
    if (editandoId) {
      novaLista = usuarios.map(u => u.id === editandoId ? { ...form, id: editandoId } : u);
    } else {
      novaLista = [...usuarios, { ...form, id: Date.now() }];
    }

    setUsuarios(novaLista);
    localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
    resetForm();
    alert("Usuário salvo com sucesso!");
  };

  const iniciarEdicao = (u) => {
    setEditandoId(u.id);
    // Proteção: Se o usuário for antigo e não tiver o array 'unidades', criamos um vazio
    setForm({ 
      ...u, 
      unidades: Array.isArray(u.unidades) ? u.unidades : (u.unidade ? [u.unidade] : []) 
    });
  };

  const resetForm = () => {
    setEditandoId(null);
    setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <form onSubmit={salvar} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {editandoId ? 'Editando Operador' : 'Novo Cadastro de Acesso'}
          </h3>
          {editandoId && (
            <button onClick={resetForm} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all">
              <X size={18}/>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
            <input type="text" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold uppercase" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Login / Senha</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Login" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold" required value={form.login} onChange={e => setForm({...form, login: e.target.value})} />
              <input type="password" placeholder="Senha" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold" required value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Cargo / Poder</label>
            <select className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-black uppercase" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
              <option value="comercial">Comercial (Loja)</option>
              <option value="estoque">Produção (Cozinha)</option>
              <option value="adm">Administrador</option>
              <option value="master">Master (Acesso Total)</option>
            </select>
          </div>
        </div>

        {form.cargo !== 'master' && (
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Unidades Permitidas (Selecione uma ou mais)</label>
            <div className="flex flex-wrap gap-3">
              {filiais.map(f => {
                const cod = f.split(' ')[0];
                const ativo = Array.isArray(form.unidades) && form.unidades.includes(cod);
                return (
                  <button key={cod} type="button" onClick={() => toggleUnidade(cod)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${ativo ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 hover:bg-slate-100'}`}>
                    <MapPin size={14}/> {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
          {editandoId ? <Save size={18}/> : <UserPlus size={18}/>}
          {editandoId ? 'Atualizar Dados' : 'Criar Novo Acesso'}
        </button>
      </form>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr><th className="p-6">Operador</th><th>Cargo</th><th>Login</th><th>Bases de Acesso</th><th className="text-right p-6">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-bold uppercase">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 text-slate-800">{u.nome}</td>
                <td><span className={`px-3 py-1 rounded-full text-[9px] font-black ${u.cargo === 'master' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{u.cargo}</span></td>
                <td className="text-slate-400 lowercase">{u.login}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {u.cargo === 'master' ? (
                      <span className="text-slate-400 italic lowercase">Acesso Total</span>
                    ) : (
                      (Array.isArray(u.unidades) ? u.unidades : []).map(uni => (
                        <span key={uni} className="bg-slate-100 px-2 py-0.5 rounded text-[8px]">{uni}</span>
                      ))
                    )}
                  </div>
                </td>
                <td className="text-right p-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => iniciarEdicao(u)} className="text-blue-400 hover:text-blue-600 p-2 transition-all"><Edit2 size={18}/></button>
                    <button onClick={() => {
                      if(confirm("Deseja excluir este usuário?")) {
                        const nova = usuarios.filter(x => x.id !== u.id);
                        setUsuarios(nova);
                        localStorage.setItem('usuarios_erp', JSON.stringify(nova));
                      }
                    }} className="text-red-300 hover:text-red-500 p-2 transition-all"><Trash2 size={18}/></button>
                  </div>
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