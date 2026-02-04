import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Save, X, RefreshCw } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('usuarios_erp') || '[]'));
  const [filiais] = useState(() => JSON.parse(localStorage.getItem('filiais_config') || '["000 - PRODUÇÃO", "001 - CENTRO", "002 - ALPHAVILLE", "003 - GLEBA"]'));
  
  const [editandoId, setEditandoId] = useState(null);
  const [novoUser, setNovoUser] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });

  const salvarUser = (e) => {
    e.preventDefault();
    let lista = editandoId 
      ? usuarios.map(u => u.id === editandoId ? { ...novoUser, id: editandoId } : u)
      : [...usuarios, { ...novoUser, id: Date.now() }];

    setUsuarios(lista);
    localStorage.setItem('usuarios_erp', JSON.stringify(lista));
    setEditandoId(null);
    setNovoUser({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
    alert("Dados salvos!");
  };

  const resetarSenha = (u) => {
    if (confirm(`Deseja resetar a senha de ${u.nome} para "codigo123"?`)) {
      const novaLista = usuarios.map(usr => usr.id === u.id ? { ...usr, senha: 'codigo123' } : usr);
      setUsuarios(novaLista);
      localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
      alert("Senha resetada com sucesso para: codigo123");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <form onSubmit={salvarUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
          <input type="text" className="w-full p-4 rounded-xl border-none text-xs font-bold uppercase" required value={novoUser.nome} onChange={e => setNovoUser({...novoUser, nome: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Login</label>
          <input type="text" className="w-full p-4 rounded-xl border-none text-xs font-bold shadow-sm" required value={novoUser.login} onChange={e => setNovoUser({...novoUser, login: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Senha</label>
          <input type="text" className="w-full p-4 rounded-xl border-none text-xs font-bold shadow-sm" required value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Hierarquia</label>
          <select className="bg-white p-4 rounded-xl border-none text-[10px] font-black uppercase w-full shadow-sm" value={novoUser.cargo} onChange={e => setNovoUser({...novoUser, cargo: e.target.value})}>
            <option value="comercial">Comercial</option>
            <option value="estoque">Estoque</option>
            <option value="pcp">PCP (Logística/Geral)</option>
            <option value="adm">ADM</option>
            <option value="master">Master</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-4 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 h-[52px]">
          {editandoId ? <Save size={18}/> : <UserPlus size={18}/>}
          {editandoId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr><th className="p-8">Colaborador</th><th>Cargo</th><th>Login</th><th>Unidade</th><th className="text-right p-8">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-bold uppercase">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-8 text-slate-800 font-black">{u.nome}</td>
                <td><span className={`px-3 py-1 rounded-full text-[9px] font-black ${u.cargo === 'pcp' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{u.cargo}</span></td>
                <td className="text-slate-400 lowercase">{u.login}</td>
                <td className="text-slate-500">{u.unidade}</td>
                <td className="text-right p-8 flex justify-end gap-3">
                  <button onClick={() => resetarSenha(u)} title="Resetar Senha" className="p-3 text-amber-500 hover:bg-amber-50 rounded-2xl transition-all">
                    <RefreshCw size={18}/>
                  </button>
                  <button onClick={() => {setEditandoId(u.id); setNovoUser(u);}} className="p-3 text-blue-400 hover:bg-blue-50 rounded-2xl transition-all"><Edit2 size={18}/></button>
                  <button onClick={() => setUsuarios(usuarios.filter(x => x.id !== u.id))} className="p-3 text-red-200 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={18}/></button>
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