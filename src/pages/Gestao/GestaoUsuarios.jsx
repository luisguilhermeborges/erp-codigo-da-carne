import React, { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('usuarios_erp') || '[]'));
  const [novo, setNovo] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });

  const salvar = (e) => {
    e.preventDefault();
    const lista = [...usuarios, { ...novo, id: Date.now() }];
    setUsuarios(lista);
    localStorage.setItem('usuarios_erp', JSON.stringify(lista));
    setNovo({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={salvar} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-50 p-6 rounded-3xl">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Nome Completo</label>
          <input type="text" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novo.nome} onChange={e => setNovo({...novo, nome: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Acesso (Login/Senha)</label>
          <div className="flex gap-2">
            <input type="text" placeholder="User" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novo.login} onChange={e => setNovo({...novo, login: e.target.value})} />
            <input type="password" placeholder="***" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novo.senha} onChange={e => setNovo({...novo, senha: e.target.value})} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Cargo</label>
          <select className="w-full p-3 rounded-xl border-none text-xs font-bold" value={novo.cargo} onChange={e => setNovo({...novo, cargo: e.target.value})}>
            <option value="comercial">Comercial</option>
            <option value="estoque">Estoque (000)</option>
            <option value="adm">Administrador</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Unidade Base</label>
          <select className="w-full p-3 rounded-xl border-none text-xs font-bold" value={novo.unidade} onChange={e => setNovo({...novo, unidade: e.target.value})}>
            <option value="000">000 - PRODUÇÃO</option>
            <option value="001">001 - CENTRO</option>
            <option value="002">002 - ALPHAVILLE</option>
            <option value="003">003 - GLEBA</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-3.5 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
          <UserPlus size={16}/> Criar Acesso
        </button>
      </form>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr><th className="p-6">Operador</th><th>Cargo</th><th>Login</th><th>Unidade</th><th className="text-right p-6">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-bold">
            {usuarios.map(u => (
              <tr key={u.id}>
                <td className="p-6">{u.nome}</td>
                <td className="uppercase text-blue-600 font-black text-[10px]">{u.cargo}</td>
                <td className="text-slate-400">{u.login}</td>
                <td>{u.unidade}</td>
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

export default GestaoUsuarios;