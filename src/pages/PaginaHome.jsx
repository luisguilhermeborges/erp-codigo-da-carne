import React, { useState, useEffect } from 'react';
import {
  Heart, ExternalLink, ShoppingBag, Trash2, Plus, X,
  Beef, Shield, Clock, Users, Flame, Star, ChevronDown,
  CheckCircle, AlertTriangle, BookOpen, Phone, Mail,
  Trophy, Target, Zap, Award, TrendingUp, Coffee
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

const CONTATOS = [
  { icon: Phone,  label: 'Suporte Interno',   valor: '(44) 99999-0000' },
  { icon: Mail,   label: 'E-mail da equipe',  valor: 'equipe@codigodacarne.com.br' },
  { icon: Coffee, label: 'RH / Gestão',       valor: '(44) 98888-0001' },
];

// ── Classificados ─────────────────────────────────────────────────────────────
const Classificados = ({ user }) => {
  const [anuncios, setAnuncios]       = useState(() => JSON.parse(localStorage.getItem('quadro_anuncios') || '[]'));
  const [modal, setModal]             = useState(false);
  const [novo, setNovo]               = useState({ titulo: '', preco: '', contato: '' });

  const fmt = (val) => {
    const n = val.replace(/\D/g,'');
    if (n.length<=2) return `(${n}`;
    if (n.length<=3) return `(${n.slice(0,2)}) ${n.slice(2)}`;
    if (n.length<=7) return `(${n.slice(0,2)}) ${n.slice(2,3)} ${n.slice(3)}`;
    return `(${n.slice(0,2)}) ${n.slice(2,3)} ${n.slice(3,7)}-${n.slice(7,11)}`;
  };

  const postar = () => {
    if (!novo.titulo || novo.contato.length < 16) return alert("Preencha título e WhatsApp completo!");
    const lista = [{ ...novo, id: Date.now(), autor: user.nome, userId: user.login }, ...anuncios];
    setAnuncios(lista);
    localStorage.setItem('quadro_anuncios', JSON.stringify(lista));
    setNovo({ titulo:'', preco:'', contato:'' });
    setModal(false);
  };

  const remover = (id) => {
    const lista = anuncios.filter(a => a.id !== id);
    setAnuncios(lista);
    localStorage.setItem('quadro_anuncios', JSON.stringify(lista));
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
                placeholder="WhatsApp" maxLength={16} value={novo.contato} onChange={e=>setNovo({...novo,contato:fmt(e.target.value)})}/>
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

// ── Página principal ──────────────────────────────────────────────────────────
const PaginaHome = ({ user }) => {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = user?.nome?.split(' ')[0] || 'Colaborador';

  return (
    <div className="space-y-6 animate-in fade-in" style={{color:'var(--text-primary)'}}>

      {/* ── HERO ── */}
      <div style={{
        background:'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderRadius:'2rem', padding:'3rem', position:'relative', overflow:'hidden',
        border:'1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Brilho decorativo */}
        <div style={{position:'absolute',top:-60,right:-60,width:200,height:200,backgroundColor:'rgba(59,130,246,0.08)',borderRadius:'50%',filter:'blur(60px)'}}/>
        <div style={{position:'absolute',bottom:-40,left:100,width:150,height:150,backgroundColor:'rgba(139,92,246,0.06)',borderRadius:'50%',filter:'blur(50px)'}}/>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <p style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(148,163,184,0.7)',marginBottom:'0.5rem'}}>
                {saudacao}, seja bem-vindo(a)
              </p>
              <h1 style={{fontSize:'2.5rem',fontWeight:900,fontStyle:'italic',textTransform:'uppercase',letterSpacing:'-0.03em',color:'#fff',lineHeight:1.1}}>
                {primeiroNome}<span style={{color:'#3b82f6'}}>.</span>
              </h1>
              <p style={{fontSize:'0.7rem',fontWeight:600,color:'rgba(148,163,184,0.6)',marginTop:'0.5rem',textTransform:'uppercase',letterSpacing:'0.15em'}}>
                {user?.cargo?.toUpperCase()} · Código da Carne ERP
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',alignItems:'flex-end'}}>
              <div style={{padding:'0.5rem 1rem',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.25)',color:'#60a5fa',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase'}}>
                🟢 Sistema Online
              </div>
              <p style={{fontSize:'0.6rem',color:'rgba(148,163,184,0.5)',textTransform:'uppercase',letterSpacing:'0.1em'}}>
                {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}
              </p>
            </div>
          </div>

          {/* Valores rápidos */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.75rem',marginTop:'2rem'}}>
            {VALORES.map(v=>(
              <div key={v.label} style={{backgroundColor:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'1rem',padding:'1rem',textAlign:'center'}}>
                <v.icon size={22} style={{color:'#3b82f6',margin:'0 auto 0.5rem'}}/>
                <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',color:'#f1f5f9',marginBottom:2}}>{v.label}</p>
                <p style={{fontSize:'0.55rem',color:'rgba(148,163,184,0.6)',fontWeight:600}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID PRINCIPAL ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'1.5rem',alignItems:'start'}}>

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

          {/* Regras */}
          <Secao titulo="Regras e Conduta" icone={BookOpen} cor="#3b82f6" defaultAberto={true}>
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

          {/* Benefícios — Totalpass */}
          <Secao titulo="Benefícios da Equipe" icone={Star} cor="#f59e0b" defaultAberto={true}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {/* Totalpass */}
              <a href="https://totalpass.com.br" target="_blank" rel="noopener noreferrer"
                style={{backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'1.25rem',textDecoration:'none',display:'block',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#f59e0b';e.currentTarget.style.backgroundColor='rgba(245,158,11,0.05)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.backgroundColor='var(--bg-elevated)';}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                  <div style={{width:36,height:36,borderRadius:'0.75rem',background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Trophy size={18} style={{color:'#fff'}}/>
                  </div>
                  <ExternalLink size={14} style={{color:'var(--text-muted)'}}/>
                </div>
                <p style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)',marginBottom:4}}>TotalPass</p>
                <p style={{fontSize:'0.65rem',color:'var(--text-secondary)',lineHeight:1.5}}>Acesso a academias e centros de bem-estar. Clique para acessar seu benefício.</p>
                <div style={{marginTop:'0.75rem',display:'inline-flex',alignItems:'center',gap:'0.3rem',fontSize:'0.6rem',fontWeight:700,color:'#f59e0b',textTransform:'uppercase'}}>
                  Acessar portal <ExternalLink size={10}/>
                </div>
              </a>

              {/* Placeholder outros benefícios */}
              <div style={{backgroundColor:'var(--bg-elevated)',border:'1px dashed var(--border-bright)',borderRadius:'1rem',padding:'1.25rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',gap:'0.5rem',opacity:0.5}}>
                <Plus size={24} style={{color:'var(--text-muted)'}}/>
                <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)'}}>Em breve</p>
                <p style={{fontSize:'0.6rem',color:'var(--text-muted)'}}>Novos benefícios a caminho</p>
              </div>
            </div>
          </Secao>

          {/* Classificados */}
          <Secao titulo="Classificados" icone={ShoppingBag} cor="#10b981" defaultAberto={true}>
            <Classificados user={user}/>
          </Secao>

          {/* Mural dos Sonhos */}
          <Secao titulo="Mural dos Sonhos" icone={Heart} cor="#ec4899" defaultAberto={false}>
            <MuralSonhos user={user}/>
          </Secao>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-4" style={{position:'sticky',top:'1.5rem'}}>

          {/* Card usuário */}
          <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem',textAlign:'center'}}>
            <div style={{width:56,height:56,borderRadius:'1rem',background:'linear-gradient(135deg,var(--accent),#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.875rem',fontSize:'1.5rem',fontWeight:900,color:'#fff',textTransform:'uppercase'}}>
              {primeiroNome[0]}
            </div>
            <p style={{fontSize:'0.875rem',fontWeight:800,textTransform:'uppercase',color:'var(--text-primary)'}}>{user?.nome}</p>
            <p style={{fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginTop:4}}>{user?.cargo}</p>
            {user?.unidades?.length > 0 && (
              <div style={{marginTop:'0.75rem',display:'flex',flexWrap:'wrap',gap:'0.3rem',justifyContent:'center'}}>
                {user.unidades.map(u=>(
                  <span key={u} style={{fontSize:'0.55rem',fontWeight:700,padding:'2px 8px',borderRadius:'999px',backgroundColor:'rgba(59,130,246,0.1)',color:'var(--accent-bright)',textTransform:'uppercase'}}>{u}</span>
                ))}
              </div>
            )}
          </div>

          {/* Contatos */}
          <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem'}}>
            <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-muted)',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <Phone size={12}/> Contatos
            </p>
            <div className="space-y-3">
              {CONTATOS.map(c=>(
                <div key={c.label} style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                  <div style={{width:28,height:28,borderRadius:'0.5rem',backgroundColor:'var(--bg-elevated)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <c.icon size={13} style={{color:'var(--accent-bright)'}}/>
                  </div>
                  <div>
                    <p style={{fontSize:'0.6rem',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase'}}>{c.label}</p>
                    <p style={{fontSize:'0.7rem',fontWeight:700,color:'var(--text-primary)'}}>{c.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div style={{backgroundColor:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'1.5rem',padding:'1.5rem'}}>
            <p style={{fontSize:'0.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--text-muted)',marginBottom:'0.875rem',display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <Zap size={12}/> Links Rápidos
            </p>
            <div className="space-y-2">
              {[
                { label:'Portal TotalPass', url:'https://totalpass.com.br', cor:'#f59e0b' },
                { label:'Manual do ERP',   url:'#', cor:'#3b82f6' },
                { label:'Cardápio Digital', url:'#', cor:'#10b981' },
              ].map(l=>(
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0.75rem',borderRadius:'0.75rem',backgroundColor:'var(--bg-elevated)',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=l.cor;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';}}>
                  <span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-primary)'}}>{l.label}</span>
                  <ExternalLink size={12} style={{color:l.cor,flexShrink:0}}/>
                </a>
              ))}
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