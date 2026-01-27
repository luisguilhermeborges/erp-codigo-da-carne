import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Verifica o Master Padrão (Sem mensagem de dica no erro)
    if (username.toLowerCase() === 'master' && password === 'luis') {
      onLogin({ id: '0', nome: 'Master CDC', cargo: 'master', unidade: 'TODAS' });
      return;
    }

    // 2. Verifica usuários no "banco" (localStorage)
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_erp') || '[]');
    
    // Adicionando Otávio manualmente caso ele ainda não exista no cache do navegador
    const otavioPadrao = { login: 'otavio', senha: 'otavio', nome: 'Otávio', cargo: 'estoque', unidade: 'TODAS' };
    const todosUsuarios = [...usuariosSalvos, otavioPadrao];

    const encontrado = todosUsuarios.find(u => 
      u.login.toLowerCase() === username.toLowerCase() && u.senha === password
    );

    if (encontrado) {
      onLogin(encontrado);
    } else {
      // Mensagem genérica para não dar pistas a invasores
      alert("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0b1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black italic text-blue-500 tracking-tighter">CÓDIGO DA CARNE</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Acesso Restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="USUÁRIO" 
                className="w-full bg-white/10 border border-white/10 p-5 pl-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="SENHA" 
                className="w-full bg-white/10 border border-white/10 p-5 pl-14 pr-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white">
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;