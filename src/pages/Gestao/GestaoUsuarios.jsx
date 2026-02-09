import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Save, CheckCircle, AlertCircle } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const salvo = localStorage.getItem('usuarios_erp');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [filiais] = useState(() => {
    // CHAVE MESTRA: filiais_cdc
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
  const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });

  const exibirAviso = (titulo, msg, tipo = 'sucesso') => {
    setAviso({ show: true, titulo, msg, tipo });
  };

  const toggleUnidade = (nomeFilial) => {
    setForm(prev => {
      const unidadesAtuais = Array.isArray(prev.unidades) ? prev.unidades : [];
      return {
        ...prev,
        unidades: unidadesAtuais.includes(nomeFilial) 
          ? unidadesAtuais.filter(u => u !== nomeFilial) 
          : [...unidadesAtuais, nomeFilial]
      };
    });
  };

  const iniciarEdicao = (u) => {
    setEditandoId(u.id);
    // Converte dados antigos de string para array para não dar erro
    const unidadesProntas = Array.isArray(u.unidades) ? u.unidades : (u.unidade ? [u.unidade] : []);
    setForm({ ...u, unidades: unidadesProntas });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const salvarUser = (e) => {
    e.preventDefault();
    const novaLista = editandoId 
      ? usuarios.map(u => u.id === editandoId ? { ...form, id: editandoId } : u)
      : [...usuarios, { ...form, id: Date.now() }];

    setUsuarios(novaLista);
    localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
    
    // SINCRONIZAÇÃO: Se for o usuário logado, atualiza a sessão na hora
    const sessao = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
    if (sessao.login === form.login) {
      localStorage.setItem('usuario_logado', JSON.stringify({ ...form, id: editandoId || Date.now() }));
    }

    setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
    setEditandoId(null);
    exibirAviso("Sucesso", "Usuário e acessos sincronizados.");
  };

  return (
    <div className="p-8 space-y-6 relative">
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

      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Gestão de Equipe</h1>
        <UserPlus size={32} />
      </header>

      <form onSubmit={salvarUser} className="bg-white p-8 rounded-[40px] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Login" value={form.login} onChange={e => setForm({...form, login: e.target.value})} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
        <select className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
          <option value="comercial">Comercial</option>
          <option value="adm">Administrador</option>
        </select>

        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Marque as bases autorizadas:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filiais.map(f => (
              <button key={f.id} type="button" onClick={() => toggleUnidade(f.nome)} className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${ (Array.isArray(form.unidades) && form.unidades.includes(f.nome)) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                {f.nome}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="md:col-span-2 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs">Salvar Colaborador</button>
      </form>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase text-slate-400">
            <tr><th className="p-6">Colaborador</th><th className="p-6">Acessos</th><th className="p-6 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-slate-50">
                <td className="p-6 font-black text-xs uppercase">{u.nome}</td>
                <td className="p-6 flex flex-wrap gap-1">
                  {Array.isArray(u.unidades) && u.unidades.map(un => (
                    <span key={un} className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-1 rounded-md uppercase">{un}</span>
                  ))}
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => iniciarEdicao(u)} className="p-2 text-blue-400"><Edit2 size={16}/></button>
                  <button onClick={() => {const n = usuarios.filter(x => x.id !== u.id); setUsuarios(n); localStorage.setItem('usuarios_erp', JSON.stringify(n));}} className="p-2 text-red-300"><Trash2 size={16}/></button>
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