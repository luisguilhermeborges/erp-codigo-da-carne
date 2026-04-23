import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Beef, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { api } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // Estado para fluxo de "Criar senha no primeiro acesso"
  const [needsPasswordUser, setNeedsPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    
    // 1. VERIFICAÇÃO MASTER UNIVERSAL — perfis separados
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

    if (username.toLowerCase() === 'luis' && password === '2928') {
      const luisUser = {
        id: 'luis-id',
        nome: 'Luis Guilherme',
        login: 'luis',
        cargo: 'dev',
        unidade: 'TODAS'
      };
      localStorage.setItem('usuario_logado', JSON.stringify(luisUser));
      onLogin(luisUser);
      return;
    }

    // 2. VERIFICAÇÃO NO MONGODB
    try {
      const user = await api.usuarios.buscarUm(username);
      
      if (!user || user.error) {
        setErro('UTILIZADOR NÃO ENCONTRADO');
        setCarregando(false);
        return;
      }

      // REGRA: Primeiro acesso aceita 123 e obriga a trocar
      const ePrimeiroAcesso = user.primeiroAcesso !== false; 

      if (ePrimeiroAcesso) {
        if (password === '123') {
          setNeedsPasswordUser(user);
          setCarregando(false);
          return;
        } else if (!user.senha) {
          // Se não tem senha definida no banco, obriga a usar 123 no primeiro acesso
          setErro('PRIMEIRO ACESSO: UTILIZE A SENHA 123');
          setCarregando(false);
          return;
        }
      }

      // Login normal (se já tiver senha ou se for o primeiro acesso mas digitou a senha que o admin cadastrou)
      if (user.senha === password) {
        // Se logou com a senha certa mas ainda era primeiro acesso, ainda assim obriga a trocar?
        if (ePrimeiroAcesso) {
          setNeedsPasswordUser(user);
        } else {
          efetuarLogin(user);
        }
      } else {
        setErro('PALAVRA-PASSE INCORRETA');
      }
    } catch (err) {
      setErro('ERRO DE CONEXÃO COM O SERVIDOR');
    } finally {
      setCarregando(false);
    }
  };

  const efetuarLogin = (user) => {
    const sessao = {
      login: user.login,
      nome: user.nome,
      cargo: user.cargo,
      unidades: user.unidades,
      unidade: user.unidades?.[0] || '' 
    };
    localStorage.setItem('usuario_logado', JSON.stringify(sessao));
    onLogin(sessao);
  };

  const handleCreatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setErro('A senha deve ter no mínimo 4 caracteres');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      // Atualiza a senha no backend e marca como primeiro acesso concluído
      const userAtualizado = { ...needsPasswordUser, senha: newPassword, primeiroAcesso: false };
      await api.usuarios.salvar(userAtualizado);
      
      // Senha criada com sucesso, logar
      efetuarLogin(userAtualizado);
    } catch (err) {
      setErro('ERRO AO CRIAR SENHA');
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
            {needsPasswordUser ? <KeyRound size={32} className="text-white" /> : <Beef size={32} className="text-white" />}
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            {needsPasswordUser ? 'Criar Senha' : <>Código <span className="text-blue-500 italic">da</span> Carne</>}
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">
            {needsPasswordUser ? `Primeiro acesso: ${needsPasswordUser.nome}` : 'Acesso ao Sistema ERP'}
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase flex items-center gap-3 animate-pulse">
            <AlertCircle size={16} /> {erro}
          </div>
        )}

        {!needsPasswordUser ? (
          /* FORMULARIO DE LOGIN NORMAL */
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative">
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
                  // NOTE: Removido o 'required' para permitir login vazio e acionar o fluxo de criação de senha
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
        ) : (
          /* FORMULARIO DE CRIAÇÃO DE SENHA */
          <form onSubmit={handleCreatePassword} className="space-y-4 relative animate-in zoom-in duration-300">
            <div className="space-y-2">
              <p className="text-xs text-center text-slate-400 mb-4">
                Por segurança, defina uma palavra-passe antes de acessar o sistema. Mínimo de 4 caracteres.
              </p>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="NOVA PALAVRA-PASSE" 
                  className="w-full bg-white/5 border border-white/10 p-5 pl-14 pr-14 rounded-2xl text-white font-black text-xs uppercase outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-700"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={4}
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
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-emerald-600/20 active:scale-[0.98] transition-all text-white mt-4 flex items-center justify-center gap-2"
            >
              {carregando ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Salvar e Entrar"
              )}
            </button>
          </form>
        )}

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