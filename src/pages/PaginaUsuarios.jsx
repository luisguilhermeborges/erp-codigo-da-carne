import React, { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

const PaginaUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('usuarios_erp') || '[]'));
  const [novoUser, setNovoUser] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });

  const salvarUser = (e) => {
    e.preventDefault();
    const lista = [...usuarios, { ...novoUser, id: Date.now() }];
    setUsuarios(lista);
    localStorage.setItem('usuarios_erp', JSON.stringify(lista));
    setNovoUser({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Configurações de Acesso</h2>
      
      <form onSubmit={salvarUser} className="bg-white p-8 rounded-[32px] grid grid-cols-1 md:grid-cols-6 gap-4 items-end shadow-sm border border-slate-100">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Nome</label>
          <input type="text" className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.nome} onChange={e => setNovoUser({...novoUser, nome: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Login</label>
          <input type="text" className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.login} onChange={e => setNovoUser({...novoUser, login: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Senha</label>
          <input type="password" className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Cargo</label>
          <select className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" value={novoUser.cargo} onChange={e => setNovoUser({...novoUser, cargo: e.target.value})}>
            <option value="comercial">Comercial</option>
            <option value="estoque">Adm Estoque</option>
            <option value="adm">Administrador</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Loja</label>
          <select className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" value={novoUser.unidade} onChange={e => setNovoUser({...novoUser, unidade: e.target.value})}>
            <option value="000">000 - PRODUÇÃO</option>
            <option value="001">001 - CENTRO</option>
            <option value="002">002 - ALPHAVILLE</option>
            <option value="003">003 - GLEBA</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-3.5 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
          <UserPlus size={16}/> Cadastrar
        </button>
      </form>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr><th className="p-6">Nome</th><th>Cargo</th><th>Login</th><th>Loja Base</th><th className="text-right p-6">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 font-bold">{u.nome}</td>
                <td className="uppercase text-[10px] font-black text-blue-600">{u.cargo}</td>
                <td className="text-xs text-slate-400">{u.login}</td>
                <td><span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full">{u.unidade}</span></td>
                <td className="text-right p-6">
                  <button onClick={() => {
                    const nova = usuarios.filter(x => x.id !== u.id);
                    setUsuarios(nova);
                    localStorage.setItem('usuarios_erp', JSON.stringify(nova));
                  }} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaginaUsuarios;