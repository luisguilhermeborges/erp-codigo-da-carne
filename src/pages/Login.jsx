import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Beef } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. VERIFICAÇÃO MASTER UNIVERSAL
    // Esta verificação é feita diretamente no código, funcionando em qualquer PC
    if (username.toLowerCase() === 'master' && password === 'luis') {
      onLogin({ 
        id: 'master-id', 
        nome: 'Administrador Master', 
        login: 'master', 
        cargo: 'master', 
        unidade: 'TODAS' 
      });
      return;
    }

    // 2. VERIFICAÇÃO DE UTILIZADORES DO LOCALSTORAGE
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_erp') || '[]');
    
    // Procura na lista de utilizadores criados na página de Gestão
    const encontrado = usuariosSalvos.find(u => 
      u.login.toLowerCase() === username.toLowerCase() && u.senha === password
    );

    if (encontrado) {
      onLogin(encontrado);
    } else {
      alert("Acesso negado: utilizador ou senha incorretos.");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0b1e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Detalhes Visuais de Fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-white/5 p-12 rounded-[48px] border border-white/10 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in duration-500 relative">
        <div className="text-center mb-12">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <Beef className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase">Código da Carne</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Portal de Gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="UTILIZADOR" 
                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="PALAVRA-PASSE" 
                className="w-full bg-white/5 border border-white/10 p-5 pl-14 pr-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all text-white mt-4"
          >
            Entrar no Sistema
          </button>
        </form>

        <p className="text-center text-slate-600 text-[8px] font-black uppercase tracking-[0.2em] mt-10">
          © 2026 Código da Carne | Londrina - PR
        </p>
      </div>
    </div>
  );
};

export default Login;