import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Save, X, RefreshCw, ShieldAlert } from 'lucide-react';

const GestaoUsuarios = () => {
  // Carrega os usuários do localStorage ou inicia vazio
  const [usuarios, setUsuarios] = useState(() => {
    const salvo = localStorage.getItem('usuarios_erp');
    return salvo ? JSON.parse(salvo) : [];
  });

  // Carrega as filiais cadastradas para o seletor
  const [filiais] = useState(() => {
    const salvo = localStorage.getItem('filiais_config');
    return salvo ? JSON.parse(salvo) : ["000 - PRODUÇÃO", "001 - CENTRO", "002 - ALPHAVILLE", "003 - GLEBA"];
  });
  
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ 
    nome: '', 
    login: '', 
    senha: '', 
    cargo: 'comercial', 
    unidade: '001' 
  });

  const salvarUser = (e) => {
    e.preventDefault();
    
    let listaAtualizada;
    if (editandoId) {
      // Atualiza usuário existente
      listaAtualizada = usuarios.map(u => u.id === editandoId ? { ...form, id: editandoId } : u);
    } else {
      // Cria novo usuário
      listaAtualizada = [...usuarios, { ...form, id: Date.now() }];
    }

    setUsuarios(listaAtualizada);
    localStorage.setItem('usuarios_erp', JSON.stringify(listaAtualizada));
    
    // Reseta o formulário
    setEditandoId(null);
    setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
    alert(editandoId ? "Cadastro atualizado!" : "Novo colaborador cadastrado!");
  };

  const iniciarEdicao = (u) => {
    setEditandoId(u.id);
    setForm({ 
      nome: u.nome, 
      login: u.login, 
      senha: u.senha, 
      cargo: u.cargo, 
      unidade: u.unidade || '001' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetarSenha = (u) => {
    if (window.confirm(`Deseja resetar a senha de ${u.nome} para "codigo123"?`)) {
      const novaLista = usuarios.map(usr => 
        usr.id === u.id ? { ...usr, senha: 'codigo123' } : usr
      );
      setUsuarios(novaLista);
      localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
      
      // Se estiver editando este usuário no momento, atualiza a senha no form
      if (editandoId === u.id) {
        setForm(prev => ({ ...prev, senha: 'codigo123' }));
      }
      alert("Senha resetada com sucesso para: codigo123");
    }
  };

  const excluirUser = (id) => {
    if (window.confirm("Deseja excluir este usuário permanentemente?")) {
      const novaLista = usuarios.filter(u => u.id !== id);
      setUsuarios(novaLista);
      localStorage.setItem('usuarios_erp', JSON.stringify(novaLista));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Formulário de Cadastro / Edição */}
      <form onSubmit={salvarUser} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {editandoId ? 'Editando Colaborador' : 'Cadastrar Novo Colaborador'}
          </h3>
          {editandoId && (
            <button type="button" onClick={() => {
              setEditandoId(null);
              setForm({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
            }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all">
              <X size={18}/>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold uppercase" 
              required 
              value={form.nome} 
              onChange={e => setForm({...form, nome: e.target.value})} 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Login</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold" 
              required 
              value={form.login} 
              onChange={e => setForm({...form, login: e.target.value})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Senha</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold" 
              required 
              value={form.senha} 
              onChange={e => setForm({...form, senha: e.target.value})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Cargo e Base</label>
            <div className="flex gap-2">
              <select 
                className="bg-white p-4 rounded-2xl border-none text-[10px] font-black uppercase w-full shadow-sm" 
                value={form.cargo} 
                onChange={e => setForm({...form, cargo: e.target.value})}
              >
                <option value="comercial">Comercial</option>
                <option value="estoque">Estoque</option>
                <option value="pcp">PCP (Logística)</option>
                <option value="adm">ADM</option>
                <option value="master">Master</option>
              </select>
              <select 
                className="bg-white p-4 rounded-2xl border-none text-[10px] font-black uppercase w-full shadow-sm" 
                value={form.unidade} 
                onChange={e => setForm({...form, unidade: e.target.value})}
              >
                {filiais.map(f => (
                  <option key={f} value={f.split(' ')[0]}>{f.split(' ')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 h-[52px]">
            {editandoId ? <Save size={18}/> : <UserPlus size={18}/>}
            {editandoId ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="p-8">Colaborador</th>
              <th>Cargo</th>
              <th>Login</th>
              <th>Base</th>
              <th className="text-right p-8">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-bold uppercase">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-8 text-slate-800 font-black">{u.nome}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                    u.cargo === 'master' ? 'bg-purple-100 text-purple-600' : 
                    u.cargo === 'pcp' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {u.cargo}
                  </span>
                </td>
                <td className="text-slate-400 font-medium lowercase tracking-tighter">{u.login}</td>
                <td className="text-slate-500 font-black">{u.unidade}</td>
                <td className="text-right p-8">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => resetarSenha(u)} 
                      title="Resetar Senha"
                      className="p-3 text-amber-500 hover:bg-amber-50 rounded-2xl transition-all"
                    >
                      <RefreshCw size={18}/>
                    </button>
                    <button 
                      onClick={() => iniciarEdicao(u)} 
                      className="p-3 text-blue-400 hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      <Edit2 size={18}/>
                    </button>
                    <button 
                      onClick={() => excluirUser(u.id)} 
                      className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Informativo sobre o PCP */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
        <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
            <ShieldAlert size={20}/>
        </div>
        <p className="text-[10px] font-black uppercase text-slate-500 leading-tight">
          O perfil <span className="text-orange-600 font-black">PCP</span> tem acesso global a pedidos, estoque e filiais para fins de logística, mas não possui permissão para gerenciar a equipe ou configurações sensíveis.
        </p>
      </div>
    </div>
  );
};

export default GestaoUsuarios;