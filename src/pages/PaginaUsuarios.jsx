import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const PaginaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUser, setNovoUser] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001 - CENTRO' });
  const [carregando, setCarregando] = useState(false);

  const carregarUsers = async () => {
    setCarregando(true);
    try {
      const data = await api.usuarios.buscar();
      setUsuarios(data);
    } catch (e) {
      alert('Erro ao carregar usuários');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsers();
  }, []);

  const salvarUser = async (e) => {
    e.preventDefault();
    try {
      await api.usuarios.salvar({ 
        ...novoUser, 
        unidades: [novoUser.unidade] // Adaptação para o schema do backend, que tem array 'unidades'
      });
      setNovoUser({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001 - CENTRO' });
      carregarUsers();
    } catch (e) {
      alert('Erro ao salvar usuário');
    }
  };

  const apagarUser = async (id) => {
    if (!window.confirm('Tem certeza?')) return;
    try {
      await api.usuarios.apagar(id);
      carregarUsers();
    } catch (e) {
      alert('Erro ao apagar usuário');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Configurações de Acesso</h2>
        <button onClick={carregarUsers} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600">
          <RefreshCw size={14} className={carregando ? 'animate-spin' : ''} /> Atualizar
        </button>
      </div>
      
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
          <label className="text-[9px] font-black uppercase text-slate-400">Senha (Opcional)</label>
          <input type="password" placeholder="Deixe vazio para o usuário criar" className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Cargo</label>
          <select className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" value={novoUser.cargo} onChange={e => setNovoUser({...novoUser, cargo: e.target.value})}>
            <option value="comercial">Comercial</option>
            <option value="estoque">Adm Estoque</option>
            <option value="producao">Produção</option>
            <option value="adm">Administrador</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400">Loja</label>
          <select className="w-full bg-slate-50 p-3 rounded-xl border-none text-xs font-bold" value={novoUser.unidade} onChange={e => setNovoUser({...novoUser, unidade: e.target.value})}>
            <option value="000 - PRODUÇÃO">000 - PRODUÇÃO</option>
            <option value="001 - CENTRO">001 - CENTRO</option>
            <option value="002 - ALPHAVILLE">002 - ALPHAVILLE</option>
            <option value="003 - GLEBA">003 - GLEBA</option>
          </select>
        </div>
        <button type="submit" disabled={carregando} className="bg-blue-600 text-white p-3.5 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 disabled:bg-blue-300">
          {carregando ? <Loader2 size={16} className="animate-spin" /> : <><UserPlus size={16}/> Cadastrar</>}
        </button>
      </form>

      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr><th className="p-6">Nome</th><th>Cargo</th><th>Login</th><th>S/ Senha</th><th>Lojas</th><th className="text-right p-6">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {usuarios.map(u => (
              <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 font-bold">{u.nome}</td>
                <td className="uppercase text-[10px] font-black text-blue-600">{u.cargo}</td>
                <td className="text-xs text-slate-400">{u.login}</td>
                <td className="text-xs text-slate-400">{!u.senha ? 'Sim' : 'Não'}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {(u.unidades || []).map(un => (
                       <span key={un} className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded-full">{un.split(' - ')[0]}</span>
                    ))}
                  </div>
                </td>
                <td className="text-right p-6">
                  <button onClick={() => apagarUser(u._id || u.id)} className="text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
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