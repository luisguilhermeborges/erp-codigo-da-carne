import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, CheckCircle, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

const GestaoUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [aviso, setAviso] = useState({ show: false, titulo: '', msg: '', tipo: 'sucesso' });
  const [form, setForm] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 15;

  const filiaisMaster = ["000 - PRODUÇÃO", "001 - CENTRO", "002 - ALPHAVILLE", "003 - GLEBA"];

  const carregar = async () => {
    try {
      const data = await api.usuarios.buscar();
      const ordenados = data.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      setUsuarios(ordenados);
    } catch (e) {
      console.error(e);
    }
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
      await api.usuarios.salvar(form);
      setAviso({ show: true, titulo: "Sucesso", msg: "Utilizador salvo no banco de dados.", tipo: "sucesso" });
      setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidades: [] });
      carregar();
    } catch {
      setAviso({ show: true, titulo: "Erro", msg: "Falha na conexão.", tipo: "erro" });
    }
  };

  const resetarSenha = async (userToReset) => {
    if (!window.confirm(`Deseja realmente resetar a senha de ${userToReset.nome}? O acesso voltará a ser '123'.`)) return;
    try {
      await api.usuarios.salvar({ ...userToReset, senha: '', primeiroAcesso: true });
      setAviso({ show: true, titulo: "Sucesso", msg: "Senha resetada para '123'.", tipo: "sucesso" });
      carregar();
    } catch {
      setAviso({ show: true, titulo: "Erro", msg: "Falha ao resetar senha.", tipo: "erro" });
    }
  };

  const apagar = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await api.usuarios.apagar(id);
      carregar();
    } catch {
      setAviso({ show: true, titulo: "Erro", msg: "Falha ao apagar.", tipo: "erro" });
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
            <p className="text-slate-500 mt-2 font-bold uppercase text-[10px]">{aviso.msg}</p>
            <button onClick={() => setAviso({ ...aviso, show: false })} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center bg-slate-900 p-8 rounded-[40px] text-white">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Gestão de Equipe</h1>
        <UserPlus size={32} className="text-blue-500" />
      </header>

      <form onSubmit={salvar} className="bg-white p-8 rounded-[40px] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 border border-slate-100">
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" placeholder="Login" value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} required />
        <input className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none" type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
        <select className="p-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}>
          <option value="comercial">Comercial</option>
          <option value="adm">Administrador</option>
          <option value="estoque">Estoque</option>
          <option value="producao">Produção</option>
          {user?.cargo?.toLowerCase() === 'master' && <option value="master">Master</option>}
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
        <button type="submit" className="md:col-span-2 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs">Salvar Usuário</button>
      </form>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b font-black text-[10px] uppercase text-slate-400">
              <tr><th className="p-6">Nome</th><th className="p-6">Acessos</th><th className="p-6">Status</th><th className="p-6 text-right">Ações</th></tr>
            </thead>
            <tbody>
              {usuarios.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA).map(u => {
                const isTargetMaster = u.cargo?.toLowerCase() === 'master';
              const canEdit = !isTargetMaster || user?.cargo?.toLowerCase() === 'master';
              const isPrimeiroAcesso = u.primeiroAcesso !== false;

              return (
              <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="p-6 font-black text-xs uppercase">{u.nome} {isTargetMaster && <span className="ml-2 text-amber-500">★</span>}<span className="block text-[8px] text-blue-500">{u.cargo}</span></td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-1">
                    {u.unidades?.map(un => <span key={un} className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-1 rounded uppercase">{un.split(' - ')[0]}</span>)}
                  </div>
                </td>
                <td className="p-6">
                  {isPrimeiroAcesso ? (
                    <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase">
                      <KeyRound size={12} /> 1º Acesso
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
                      <CheckCircle size={12} /> Ativo
                    </span>
                  )}
                </td>
                <td className="p-6 text-right">
                  {canEdit && (
                    <div className="flex justify-end gap-2">
                      {!isPrimeiroAcesso && (
                        <button 
                          onClick={() => resetarSenha(u)} 
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" 
                          title="Resetar para Senha Padrão"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button onClick={() => setForm(u)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={16} /></button>
                      <button onClick={() => apagar(u._id)} className="p-2 text-red-300 hover:bg-red-50 rounded-lg transition-colors" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        
        {/* Controles de Paginação */}
        {usuarios.length > ITENS_POR_PAGINA && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="text-[10px] font-black uppercase text-slate-400 pl-4">
              Página {paginaAtual} de {Math.ceil(usuarios.length / ITENS_POR_PAGINA)}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <button 
                disabled={paginaAtual >= Math.ceil(usuarios.length / ITENS_POR_PAGINA)}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestaoUsuarios;