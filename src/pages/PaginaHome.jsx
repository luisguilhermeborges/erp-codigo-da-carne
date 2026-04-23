import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
  Heart, ExternalLink, ShoppingBag, Trash2, Plus, X,
  Beef, Shield, Clock, Users, Flame, Star, ChevronDown,
  CheckCircle, AlertTriangle, BookOpen, Phone, Mail,
  Trophy, Target, Zap, Award, TrendingUp, Coffee, Camera, Smartphone, Apple
} from 'lucide-react';
import MuralSonhos from '../components/MuralSonhos';

// ── Regras e Valores ──────────────────────────────────────────────────────────
const REGRAS = [
  {
    icon: Clock,
    cor: '#3b82f6',
    titulo: 'Pontualidade',
    texto: 'O horário de funcionamento deve ser rigorosamente respeitado. Atrasos devem ser comunicados com antecedência mínima de 30 minutos ao supervisor direto.',
  },
  {
    icon: Shield,
    cor: '#10b981',
    titulo: 'Higiene e Segurança',
    texto: 'EPIs obrigatórios em todas as áreas de manipulação. Uniforme completo e limpo durante todo o expediente. Tolerância zero para descumprimento das normas sanitárias.',
  },
  {
    icon: Users,
    cor: '#8b5cf6',
    titulo: 'Respeito Mútuo',
    texto: 'Ambiente de trabalho baseado no respeito, colaboração e profissionalismo. Condutas inadequadas serão tratadas conforme o código de ética da empresa.',
  },
  {
    icon: Flame,
    cor: '#f59e0b',
    titulo: 'Qualidade do Produto',
    texto: 'O padrão Código da Carne é inegociável. Cada produto entregue deve refletir nosso compromisso com a excelência. Qualquer desvio deve ser reportado imediatamente.',
  },
  {
    icon: Target,
    cor: '#ef4444',
    titulo: 'Metas e Resultados',
    texto: 'As metas mensais são discutidas em equipe e devem ser perseguidas com dedicação. Cada colaborador é parte fundamental do resultado coletivo.',
  },
  {
    icon: Zap,
    cor: '#06b6d4',
    titulo: 'Uso do Sistema ERP',
    texto: 'O sistema é ferramenta de trabalho obrigatória. Pedidos fora do ERP não serão processados. Dúvidas devem ser reportadas ao ADM responsável.',
  },
];

const VALORES = [
  { icon: Trophy,    label: 'Excelência',     desc: 'Em cada corte, em cada entrega' },
  { icon: Heart,     label: 'Paixão',         desc: 'Amamos o que fazemos' },
  { icon: Award,     label: 'Reconhecimento', desc: 'Valorizamos cada colaborador' },
  { icon: TrendingUp,label: 'Crescimento',    desc: 'Evoluímos juntos todos os dias' },
];

// ── Contatos Gerenciáveis ─────────────────────────────────────────────────────
const ContatosGerenciaveis = ({ user }) => {
  const cargoStr = user?.cargo?.toLowerCase() || '';
  const isMaster = cargoStr === 'master' || cargoStr === 'adm' || cargoStr === 'dev';
  const padrao = [
    { id: 1, label: 'SUPORTE INTERNO', valor: '(44) 99999-0000' },
    { id: 2, label: 'RH / GESTÃO', valor: '(44) 98888-0001' },
    { id: 3, label: 'LOJA MATRIZ', valor: '(44) 3333-3333' }
  ];
  
  const [contatos, setContatos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [tempContatos, setTempContatos] = useState([]);

  useEffect(() => {
    api.home.contatos.buscar()
      .then(dados => {
        if (dados && dados.length > 0) {
          setContatos(dados);
          setTempContatos(dados);
        } else {
          setContatos(padrao);
          setTempContatos(padrao);
        }
      })
      .catch(() => {
        setContatos(padrao);
        setTempContatos(padrao);
      });
  }, []);

  const salvarContatos = async () => {
    try {
      const novos = await api.home.contatos.salvar(tempContatos);
      setContatos(novos);
      setEditando(false);
    } catch {
      alert("Erro ao salvar contatos");
    }
  };

  if (editando) {
    return (
      <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--accent)',borderRadius:'1.5rem',padding:'1.5rem'}}>
        <div className="flex justify-between items-center mb-3">
          <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--accent)'}}>Editar Contatos</p>
          <button onClick={salvarContatos} style={{fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',padding:'4px 10px',backgroundColor:'var(--accent)',color:'#fff',borderRadius:'999px',border:'none'}}>Salvar</button>
        </div>
        <div className="space-y-3">
          {tempContatos.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={c.label} onChange={(e) => { const n = [...tempContatos]; n[i].label = e.target.value.toUpperCase(); setTempContatos(n); }} className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-2 text-xs font-bold uppercase outline-none" placeholder="TÍTULO"/>
              <input value={c.valor} onChange={(e) => { const n = [...tempContatos]; n[i].valor = e.target.value.toUpperCase(); setTempContatos(n); }} className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-2 text-xs font-bold uppercase outline-none" placeholder="CONTATO"/>
              <button onClick={() => setTempContatos(tempContatos.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
            </div>
          ))}
          <button onClick={() => setTempContatos([...tempContatos, { id: Date.now(), label: '', valor: '' }])} className="w-full p-2 border border-dashed border-[var(--border-bright)] rounded-lg text-[10px] font-black uppercase text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">+ Adicionar Contato</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem', position:'relative'}}>
      {isMaster && (
        <button onClick={() => { setTempContatos([...contatos]); setEditando(true); }} style={{position:'absolute',top:16,right:16,fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',color:'var(--accent-bright)',background:'none',border:'none',cursor:'pointer'}}>Editar</button>
      )}
      <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-muted)',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:'0.4rem'}}>
        <Phone size={12}/> Contatos
      </p>
      <div className="space-y-3">
        {contatos.map((c, i) => (
          <div key={i} style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <div style={{width:28,height:28,borderRadius:'0.5rem',backgroundColor:'var(--bg-elevated)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Phone size={13} style={{color:'var(--accent-bright)'}}/>
            </div>
            <div>
              <p style={{fontSize:'0.6rem',fontWeight:800,color:'var(--text-muted)',textTransform:'uppercase'}}>{c.label}</p>
              <p style={{fontSize:'0.7rem',fontWeight:800,color:'var(--text-primary)',textTransform:'uppercase'}}>{c.valor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Classificados ─────────────────────────────────────────────────────────────
const Classificados = ({ user }) => {
  const [anuncios, setAnuncios]       = useState([]);
  const [modal, setModal]             = useState(false);
  const [novo, setNovo]               = useState({ titulo: '', preco: '', contato: '', foto: null });

  useEffect(() => {
    api.home.anuncios.buscar().then(setAnuncios).catch(() => {});
  }, []);

  const postar = async () => {
    if (!novo.titulo || novo.contato.length < 16) return alert("Preencha título e WhatsApp completo!");
    try {
      const item = { ...novo, id: Date.now(), autor: user.nome, userId: user.login };
      const salvo = await api.home.anuncios.salvar(item);
      setAnuncios([salvo, ...anuncios]);
      setNovo({ titulo:'', preco:'', contato:'', foto: null });
      setModal(false);
    } catch {
      alert("Erro ao publicar anúncio");
    }
  };

  const remover = async (id) => {
    if (!window.confirm("Deseja remover este anúncio?")) return;
    try {
      await api.home.anuncios.apagar(id);
      setAnuncios(anuncios.filter(a => a.id !== id));
    } catch {
      alert("Erro ao remover anúncio");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <ShoppingBag size={18} style={{color:'var(--accent-bright)'}}/>
          <h3 style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-primary)'}}>
            Classificados da Equipe
          </h3>
          {anuncios.length > 0 && (
            <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'var(--bg-elevated)',color:'var(--text-muted)'}}>
              {anuncios.length}
            </span>
          )}
        </div>
        <button onClick={()=>setModal(true)}
          style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.4rem 0.875rem',borderRadius:'0.75rem',border:'none',backgroundColor:'var(--accent)',color:'#fff',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer',boxShadow:'0 4px 12px var(--accent-glow)'}}>
          <Plus size={13}/> Anunciar
        </button>
      </div>

      {anuncios.length === 0 ? (
        <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)',opacity:0.4}}>
          <ShoppingBag size={32} style={{margin:'0 auto 0.5rem'}}/>
          <p style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase'}}>Nenhum anúncio ainda</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'0.75rem'}}>
          {anuncios.map(a => (
            <div key={a.id} style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1rem',position:'relative',transition:'all 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              {(user.cargo==='master'||a.userId===user.login) && (
                <button onClick={()=>remover(a.id)} style={{position:'absolute',top:8,right:8,color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',padding:2}}
                  onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
                  <Trash2 size={13}/>
                </button>
              )}
              {a.foto && (
                <div style={{width:'100%', height:'140px', marginBottom:'0.75rem', borderRadius:'0.75rem', overflow:'hidden'}}>
                  <img src={a.foto} alt="Anúncio" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
              )}
              <h4 style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',fontStyle:'italic',color:'var(--text-primary)',marginBottom:4,paddingRight:20}}>{a.titulo}</h4>
              {a.preco && <p style={{fontSize:'0.85rem',fontWeight:900,color:'#10b981'}}>R$ {a.preco}</p>}
              <div style={{marginTop:'0.75rem',paddingTop:'0.5rem',borderTop:'1px solid var(--border)',fontSize:'0.65rem',color:'var(--text-muted)'}}>
                <p style={{fontWeight:600}}>{a.autor}</p>
                <p style={{color:'var(--accent-bright)',fontWeight:700,marginTop:2}}>📱 {a.contato}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm" style={{backgroundColor:'rgba(0,0,0,0.6)'}}>
          <div className="rounded-[32px] shadow-2xl w-full max-w-md p-8 space-y-4" style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)'}}>
            <div className="flex justify-between items-center">
              <h3 style={{fontSize:'0.875rem',fontWeight:800,textTransform:'uppercase',fontStyle:'italic',color:'var(--text-primary)'}}>Novo Classificado</h3>
              <button onClick={()=>setModal(false)} style={{color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <input className="w-full p-4 rounded-2xl text-xs font-bold uppercase outline-none"
              style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-primary)'}}
              placeholder="Título do anúncio" value={novo.titulo} onChange={e=>setNovo({...novo,titulo:e.target.value})}/>
            <div className="flex gap-2">
              <input className="w-full p-4 rounded-2xl text-xs font-bold uppercase outline-none"
                style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-primary)'}}
                placeholder="Valor (R$)" value={novo.preco} onChange={e=>setNovo({...novo,preco:e.target.value})}/>
              <input className="w-full p-4 rounded-2xl text-xs font-bold outline-none"
                style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',color:'var(--text-primary)'}}
                placeholder="WhatsApp" maxLength={16} value={novo.contato} onChange={e=>{
                  const n = e.target.value.replace(/\D/g,'');
                  let f = n;
                  if (n.length>0) f = '(' + n;
                  if (n.length>2) f = '(' + n.slice(0,2) + ') ' + n.slice(2);
                  if (n.length>3) f = '(' + n.slice(0,2) + ') ' + n.slice(2,3) + ' ' + n.slice(3);
                  if (n.length>7) f = '(' + n.slice(0,2) + ') ' + n.slice(2,3) + ' ' + n.slice(3,7) + '-' + n.slice(7,11);
                  setNovo({...novo,contato:f});
                }}/>
            </div>
            
            <div className="flex flex-col gap-2">
              <label style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-muted)'}}>Adicionar Foto (Opcional)</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-colors"
                  style={{backgroundColor:'var(--bg-elevated)',border:'1px dashed var(--border-bright)', color:'var(--text-secondary)'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-bright)'}>
                  <Camera size={16} />
                  <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase'}}>{novo.foto ? 'Trocar Imagem' : 'Escolher Imagem'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2 * 1024 * 1024) return alert("Imagem muito grande! Máximo 2MB.");
                    const reader = new FileReader();
                    reader.onload = ev => setNovo({...novo, foto: ev.target.result});
                    reader.readAsDataURL(file);
                  }} />
                </label>
                {novo.foto && (
                  <div className="relative">
                    <img src={novo.foto} alt="Preview" style={{width:40,height:40,borderRadius:8,objectFit:'cover'}} />
                    <button onClick={()=>setNovo({...novo,foto:null})} style={{position:'absolute',top:-6,right:-6,background:'red',color:'white',border:'none',borderRadius:'50%',width:16,height:16,fontSize:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={postar} className="flex-1 py-4 rounded-2xl font-black uppercase text-xs text-white" style={{backgroundColor:'var(--accent)',boxShadow:'0 4px 16px var(--accent-glow)',border:'none',cursor:'pointer'}}>Publicar</button>
              <button onClick={()=>setModal(false)} className="px-6 py-4 rounded-2xl font-black uppercase text-xs" style={{backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',border:'1px solid var(--border)',cursor:'pointer'}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Seção colapsável ──────────────────────────────────────────────────────────
const Secao = ({ titulo, icone: Icone, cor, children, defaultAberto = false }) => {
  const [aberto, setAberto] = useState(defaultAberto);
  return (
    <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.75rem',overflow:'hidden'}}>
      <button onClick={()=>setAberto(!aberto)} className="w-full flex items-center justify-between p-6 transition-all"
        onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
        onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}>
        <div className="flex items-center gap-3">
          <div style={{width:36,height:36,borderRadius:'0.625rem',backgroundColor:`${cor}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icone size={18} style={{color:cor}}/>
          </div>
          <span style={{fontSize:'0.8rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text-primary)'}}>{titulo}</span>
        </div>
        <ChevronDown size={18} style={{color:'var(--text-muted)',transform:aberto?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s'}}/>
      </button>
      {aberto && <div style={{borderTop:'1px solid var(--border)',padding:'1.5rem'}}>{children}</div>}
    </div>
  );
};

// ── Card de Perfil com Foto ────────────────────────────────────────────────────
const CardPerfil = ({ user }) => {
  const fileRef = React.useRef();
  const chave = `foto_perfil_${user?.login || 'user'}`;
  const [foto, setFoto] = useState(() => localStorage.getItem(chave) || null);
  const primeiroNome = user?.nome?.split(' ')[0] || 'Colaborador';

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setFoto(base64);
      localStorage.setItem(chave, base64);
      window.dispatchEvent(new Event('foto_perfil_updated'));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem',textAlign:'center'}}>
      <div style={{position:'relative',width:64,height:64,margin:'0 auto 0.875rem'}}>
        {foto ? (
          <img src={foto} alt="Perfil" style={{width:64,height:64,borderRadius:'1rem',objectFit:'cover',border:'2px solid var(--accent)'}} />
        ) : (
          <div style={{width:64,height:64,borderRadius:'1rem',background:'linear-gradient(135deg,var(--accent),#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:900,color:'#fff',textTransform:'uppercase'}}>
            {primeiroNome[0]}
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          title="Alterar foto de perfil"
          style={{position:'absolute',bottom:-6,right:-6,width:24,height:24,borderRadius:'50%',backgroundColor:'var(--accent)',border:'2px solid var(--bg-card)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <Camera size={11} style={{color:'#fff'}}/>
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFoto}/>
      </div>
      <p style={{fontSize:'0.875rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)'}}>{user?.nome}</p>
      <p style={{fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginTop:4}}>{user?.cargo}</p>
      {foto && (
        <button onClick={() => { setFoto(null); localStorage.removeItem(chave); }}
          style={{marginTop:8,fontSize:'0.55rem',fontWeight:700,color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',textTransform:'uppercase'}}>
          Remover foto
        </button>
      )}
      {user?.unidades?.length > 0 && (
        <div style={{marginTop:'0.75rem',display:'flex',flexWrap:'wrap',gap:'0.3rem',justifyContent:'center'}}>
          {user.unidades.map(u=>(
            <span key={u} style={{fontSize:'0.55rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.1)',color:'var(--accent-bright)',textTransform:'uppercase'}}>{u}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
const PaginaHome = ({ user }) => {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = user?.nome?.split(' ')[0] || 'Colaborador';

  return (
    <div className="space-y-6 animate-in fade-in" style={{color:'var(--text-primary)'}}>

      {/* ── HERO COMPACTO ── */}
      <div style={{
        background:'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius:'1.5rem', padding:'1.25rem 1.75rem', position:'relative', overflow:'hidden',
        border:'1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{position:'absolute',top:-40,right:-40,width:120,height:120,backgroundColor:'rgba(59,130,246,0.08)',borderRadius:'50%',filter:'blur(40px)'}}/>
        <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'0.75rem'}}>
          <div>
            <p style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(148,163,184,0.7)'}}>
              {saudacao}, seja bem-vindo(a)
            </p>
            <h1 style={{fontSize:'1.75rem',fontWeight:900,fontStyle:'italic',textTransform:'uppercase',letterSpacing:'-0.03em',color:'#fff',lineHeight:1.1,margin:'2px 0'}}>
              {primeiroNome}<span style={{color:'#3b82f6'}}>.</span>
            </h1>
            <p style={{fontSize:'0.6rem',fontWeight:600,color:'rgba(148,163,184,0.6)',textTransform:'uppercase',letterSpacing:'0.1em'}}>
              {user?.cargo?.toUpperCase()} · Código da Carne ERP
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.3rem',alignItems:'flex-end'}}>
            <div style={{padding:'0.3rem 0.75rem',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.25)',color:'#60a5fa',fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase'}}>
              🟢 Sistema Online
            </div>
            <p style={{fontSize:'0.55rem',color:'rgba(148,163,184,0.5)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
              {new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'})}
            </p>
          </div>
        </div>
      </div>

      {/* ── GRID PRINCIPAL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* COLUNA ESQUERDA */}
        <div className="space-y-4">

          {/* Comunicado em destaque */}
          <div style={{backgroundColor:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'1.5rem',padding:'1.25rem 1.5rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
            <div style={{width:36,height:36,borderRadius:'0.625rem',backgroundColor:'rgba(59,130,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Beef size={18} style={{color:'#60a5fa'}}/>
            </div>
            <div>
              <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#60a5fa',marginBottom:4,letterSpacing:'0.08em'}}>📢 Comunicado da Gestão</p>
              <p style={{fontSize:'0.75rem',fontWeight:600,color:'var(--text-secondary)',lineHeight:1.6,fontStyle:'italic'}}>
                "Bem-vindos ao novo sistema digital da Código da Carne. Use o ERP para todos os pedidos e transferências. Em caso de dúvidas, acione o ADM responsável."
              </p>
            </div>
          </div>

          {/* Mural dos Sonhos — logo após comunicado */}
          <Secao titulo="Mural dos Sonhos" icone={Heart} cor="#ec4899" defaultAberto={true}>
            <MuralSonhos user={user}/>
          </Secao>

          {/* Benefícios — Hospitar */}
          <Secao titulo="Benefícios da Equipe" icone={Star} cor="#f59e0b" defaultAberto={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Plano de saúde Hospitar */}
              <div style={{backgroundColor:'var(--bg-elevated)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'1rem',padding:'1.25rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                  <div style={{width:36,height:36,borderRadius:'0.75rem',background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Shield size={18} style={{color:'#fff'}}/>
                  </div>
                  <span style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'#10b981',backgroundColor:'rgba(16,185,129,0.1)',padding:'3px 8px',borderRadius:'999px'}}>Ativo</span>
                </div>
                <p style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)',marginBottom:4}}>Plano de Saúde Hospitar</p>
                <p style={{fontSize:'0.65rem',color:'var(--text-secondary)',lineHeight:1.5,marginBottom:'0.75rem'}}>Plano médico empresarial. Preencha seus dados para ativar o benefício.</p>
                <a href="#" onClick={e=>e.preventDefault()}
                  style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',fontWeight:700,color:'#10b981',textTransform:'uppercase',padding:'6px 12px',borderRadius:'999px',backgroundColor:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',textDecoration:'none'}}>
                  Preencher dados <ExternalLink size={10}/>
                </a>
                <p style={{fontSize:'0.55rem',color:'var(--text-muted)',marginTop:6}}>🔒 Link do formulário em breve</p>
              </div>

              {/* TotalPass */}
              <a href="https://totalpass.com.br" target="_blank" rel="noopener noreferrer"
                style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.25rem',textDecoration:'none',display:'block',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#f59e0b';e.currentTarget.style.backgroundColor='rgba(245,158,11,0.05)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.backgroundColor='var(--bg-elevated)';}}
              >
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                  <div style={{width:36,height:36,borderRadius:'0.75rem',background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Trophy size={18} style={{color:'#fff'}}/>
                  </div>
                  <ExternalLink size={14} style={{color:'var(--text-muted)'}}/>
                </div>
                <p style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)',marginBottom:4}}>TotalPass</p>
                <p style={{fontSize:'0.65rem',color:'var(--text-secondary)',lineHeight:1.5}}>Acesso a academias e centros de bem-estar.</p>
                <div style={{marginTop:'0.75rem',display:'inline-flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',fontWeight:700,color:'#f59e0b',textTransform:'uppercase'}}>
                  Acessar portal <ExternalLink size={10}/>
                </div>
              </a>
            </div>
          </Secao>

          {/* Classificados */}
          <Secao titulo="Classificados" icone={ShoppingBag} cor="#10b981" defaultAberto={false}>
            <Classificados user={user}/>
          </Secao>

          {/* Regras e Conduta — ao final da página */}
          <Secao titulo="Regras e Conduta" icone={BookOpen} cor="#3b82f6" defaultAberto={false}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'0.75rem'}}>
              {REGRAS.map(r=>(
                <div key={r.titulo} style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1rem',display:'flex',gap:'0.75rem'}}>
                  <div style={{width:32,height:32,borderRadius:'0.5rem',backgroundColor:`${r.cor}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                    <r.icon size={15} style={{color:r.cor}}/>
                  </div>
                  <div>
                    <p style={{fontSize:'0.7rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)',marginBottom:4}}>{r.titulo}</p>
                    <p style={{fontSize:'0.65rem',fontWeight:500,color:'var(--text-secondary)',lineHeight:1.6}}>{r.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </Secao>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-4" style={{position:'sticky',top:'1.5rem'}}>

          {/* Card Perfil com foto */}
          <CardPerfil user={user}/>

          {/* Contatos Gerenciáveis */}
          <ContatosGerenciaveis user={user} />

          {/* Links rápidos */}
          <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem'}}>
            <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-muted)',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <Zap size={12}/> Links Rápidos
            </p>
            <div className="space-y-2">
              {/* Central do Funcionário */}
              <a href="https://centraldofuncionario.com.br/31305" target="_blank" rel="noopener noreferrer"
                style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#3b82f6';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';}}>
                <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-primary)'}}>Portal Central do Funcionário</span>
                <ExternalLink size={12} style={{color:'#3b82f6',flexShrink:0}}/>
              </a>
              {/* Baixar App — ícones lado a lado */}
              <div style={{display:'flex',gap:'0.5rem'}}>
                <a href="https://apps.apple.com/br/app/ponto-web-funcion%C3%A1rios/id1434571841" target="_blank" rel="noopener noreferrer"
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',padding:'0.6rem',borderRadius:'0.75rem',backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#6366f1'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--text-secondary)'}}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <span style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-secondary)'}}>iOS</span>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.secullum.pontoweb.centraldofuncionario" target="_blank" rel="noopener noreferrer"
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem',padding:'0.6rem',borderRadius:'0.75rem',backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#22c55e'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--text-secondary)'}}><path d="M3.18 23.76c.37.21.8.24 1.2.09l12.82-6.61-2.8-2.81-11.22 9.33zm-1.83-20.4c-.21.37-.26.82-.26 1.28v16.72c0 .46.09.91.26 1.28l.13.13 9.36-9.36v-.22L1.48 3.23l-.13.13zM20.65 10.2l-2.68-1.65-3.12 3.12 3.12 3.11 2.72-1.67c.77-.48.77-1.43-.04-1.91zm-18.3 12.55l11.22-9.33L10.75 11 0 20.34l2.35 2.41z"/></svg>
                  <span style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-secondary)'}}>Android</span>
                </a>
              </div>
              {/* Portal TotalPass */}
              <a href="https://totalpass.com.br" target="_blank" rel="noopener noreferrer"
                style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#f59e0b';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';}}>
                <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-primary)'}}>Portal TotalPass</span>
                <ExternalLink size={12} style={{color:'#f59e0b',flexShrink:0}}/>
              </a>
            </div>
          </div>

          {/* Frases motivacionais (rotação diária) */}
          <div style={{background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'1.5rem',padding:'1.25rem',textAlign:'center'}}>
            <p style={{fontSize:'0.7rem',fontWeight:700,fontStyle:'italic',color:'var(--text-secondary)',lineHeight:1.7}}>
              "{[
                'A qualidade nunca é um acidente; é sempre o resultado de um esforço inteligente.',
                'Cada corte perfeito começa com comprometimento.',
                'Excelência não é um destino, é uma jornada diária.',
                'O melhor produto vem das melhores pessoas.',
                'Trabalho em equipe divide o esforço e multiplica o sucesso.',
              ][new Date().getDay() % 5]}"
            </p>
            <p style={{fontSize:'0.55rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:'0.5rem',letterSpacing:'0.1em'}}>— Código da Carne</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaHome;