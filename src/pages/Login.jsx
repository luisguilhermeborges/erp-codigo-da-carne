import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Beef, AlertCircle, Loader2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    
    // 1. VERIFICAÇÃO MASTER UNIVERSAL (Mantida conforme seu original)
    if (username.toLowerCase() === 'master' && password === 'luis') {
      const masterUser = { 
        id: 'master-id', 
        nome: 'Administrador Master', 
        login: 'master', 
        cargo: 'master', 
        unidade: 'TODAS' 
      };
      localStorage.setItem('usuario_logado', JSON.stringify(masterUser));
      onLogin(masterUser);
      return;
    }

    // 2. VERIFICAÇÃO NO MONGODB (Substituindo o localStorage antigo)
    try {
      const res = await fetch(`https://api-codigo-da-carne.onrender.com/api/usuarios/${username}`);
      
      if (!res.ok) {
        setErro('UTILIZADOR NÃO ENCONTRADO');
        setCarregando(false);
        return;
      }

      const user = await res.json();

      if (user.senha === password) {
        const sessao = {
          login: user.login,
          nome: user.nome,
          cargo: user.cargo,
          unidades: user.unidades
        };
        
        localStorage.setItem('usuario_logado', JSON.stringify(sessao));
        onLogin(sessao);
      } else {
        setErro('PALAVRA-PASSE INCORRETA');
      }
    } catch (err) {
      setErro('ERRO DE CONEXÃO COM O SERVIDOR');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[44px] p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* EFEITO DE BRILHO AO FUNDO */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full"></div>
        
        <div className="text-center mb-10 relative">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20 rotate-12">
            <Beef size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Código <span className="text-blue-500 italic">da</span> Carne
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">
            Acesso ao Sistema ERP
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase flex items-center gap-3 animate-pulse">
            <AlertCircle size={16} /> {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="UTILIZADOR" 
                className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="PALAVRA-PASSE" 
                className="w-full bg-white/5 border border-white/10 p-5 pl-14 pr-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all text-white mt-4 flex items-center justify-center gap-2"
          >
            {carregando ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
            © 2026 ERP CÓDIGO DA CARNE • V2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;