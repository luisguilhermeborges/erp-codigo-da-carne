import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ login: '', senha: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      // 1. Procura o utilizador no backend (MongoDB)
      const res = await fetch(`http://localhost:5000/api/usuarios/${form.login}`);
      
      if (!res.ok) {
        setErro('Utilizador não encontrado no sistema.');
        return;
      }

      const user = await res.json();

      // 2. Valida a palavra-passe
      if (user.senha === form.senha) {
        // Guarda os dados básicos da sessão no localStorage
        localStorage.setItem('usuario_logado', JSON.stringify({
          login: user.login,
          nome: user.nome,
          cargo: user.cargo
        }));
        
        // Redireciona para a página principal após o login
        navigate('/atendimento');
      } else {
        setErro('Palavra-passe incorreta. Tente novamente.');
      }
    } catch (err) {
      setErro('Erro ao ligar ao servidor. Certifique-se de que o backend está ativo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[44px] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Sistema ERP</h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Controlo de Acesso</p>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-black uppercase flex items-center gap-3">
            <AlertCircle size={16} /> {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none focus:ring-2 ring-blue-500" 
              placeholder="Utilizador" 
              value={form.login} 
              onChange={e => setForm({...form, login: e.target.value})} 
              required 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase outline-none focus:ring-2 ring-blue-500" 
              type="password" 
              placeholder="Palavra-passe" 
              value={form.senha} 
              onChange={e => setForm({...form, senha: e.target.value})} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;