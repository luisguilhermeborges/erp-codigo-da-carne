import React, { useState, useEffect } from 'react';
import { Users, FileDown, MapPin, ClipboardList, Wrench, ShoppingCart, Beef, Plus, Trash2, Search, CheckCircle, Package } from 'lucide-react';
import { api } from '../../services/api';
import { getEstoque } from '../../services/cache';

const EmDesenvolvimento = ({ icone: Icone, titulo, descricao }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 opacity-60 select-none animate-in fade-in">
    <div style={{
      background: 'var(--bg-elevated)',
      border: '2px dashed var(--border-bright)',
      borderRadius: '2rem',
      padding: '3rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      textAlign: 'center',
    }}>
      <Icone size={48} style={{ color: 'var(--accent-bright)' }} />
      <Wrench size={20} style={{ color: 'var(--text-muted)' }} />
      <h2 style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {titulo}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {descricao || 'Em desenvolvimento — em breve disponível'}
      </p>
    </div>
  </div>
);

const PedidosColaborador = ({ user }) => {
  const [catalogo, setCatalogo] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    getEstoque({ apenasComPreco: false }).then(setCatalogo).catch(() => {});
  }, []);

  const itensFiltrados = busca.length > 1
    ? catalogo.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.includes(busca))
    : [];

  const addAoCarrinho = (p) => {
    const jaTem = carrinho.find(item => item.codigo === p.codigo);
    if (jaTem) {
      setCarrinho(carrinho.map(item => item.codigo === p.codigo ? { ...item, qtd: item.qtd + 1 } : item));
    } else {
      setCarrinho([...carrinho, { ...p, qtd: 1 }]);
    }
    setBusca('');
  };

  const removerDoCarrinho = (codigo) => {
    setCarrinho(carrinho.filter(item => item.codigo !== codigo));
  };

  const enviarPedido = async () => {
    if (carrinho.length === 0) return alert("Adicione itens ao pedido!");
    if (!window.confirm("Confirmar pedido para desconto em folha?")) return;

    setEnviando(true);
    try {
      const pedido = {
        id: Date.now(),
        idExterno: `COLAB-${Date.now()}`,
        cliente: `COLABORADOR: ${user.nome.toUpperCase()}`,
        filial: "DESCONTO EM FOLHA",
        unidadeOrigem: user.unidade || "MATRIZ",
        destino: "CONSUMO INTERNO",
        usuario: user.nome,
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'PEDIDO_COLABORADOR',
        status: 'Pendente',
        itens: carrinho.map(item => ({
          ...item,
          qtdSolicitada: item.qtd,
          prioridade: 2 // Normal
        }))
      };

      await api.pedidos.criar(pedido);
      setSucesso(true);
      setCarrinho([]);
      setTimeout(() => setSucesso(false), 5000);
    } catch {
      alert("Erro ao enviar pedido");
    } finally {
      setEnviando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-xl font-black uppercase italic" style={{ color: 'var(--text-primary)' }}>Pedido Enviado!</h3>
        <p className="text-xs font-bold uppercase opacity-50 mt-2">O pedido foi para a fila de produção.</p>
        <button onClick={() => setSucesso(false)} className="mt-6 px-8 py-3 rounded-xl bg-blue-600 text-white font-black uppercase text-[10px]">Novo Pedido</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-[var(--bg-elevated)] p-6 rounded-[32px] border border-[var(--border)]">
        <h3 className="text-sm font-black uppercase italic mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <ShoppingCart size={18} className="text-blue-500" /> Realizar Pedido Pessoal
        </h3>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input 
            type="text" 
            placeholder="BUSCAR PRODUTO..." 
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-transparent outline-none focus:border-blue-500 transition-all font-bold uppercase text-xs" 
            style={{ borderColor: 'var(--border)' }}
          />
          {itensFiltrados.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden">
              {itensFiltrados.map(p => (
                <button key={p.codigo} onClick={() => addAoCarrinho(p)} className="w-full flex justify-between items-center p-4 hover:bg-[var(--bg-elevated)] transition-all border-b border-[var(--border)] last:border-0 text-left">
                  <div>
                    <p className="text-[10px] font-black uppercase">{p.nome}</p>
                    <p className="text-[8px] font-bold opacity-50">{p.codigo} · {p.pai}</p>
                  </div>
                  <Plus size={16} className="text-blue-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {carrinho.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2">Itens Selecionados:</p>
            {carrinho.map(item => (
              <div key={item.codigo} className="flex items-center justify-between p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                    {item.qtd}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase">{item.nome}</p>
                    <p className="text-[7px] font-bold opacity-50">UN: {item.unidade}</p>
                  </div>
                </div>
                <button onClick={() => removerDoCarrinho(item.codigo)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={enviarPedido} 
              disabled={enviando}
              className="w-full py-5 mt-4 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest shadow-xl shadow-green-600/20 hover:bg-green-500 transition-all disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Confirmar Pedido (Desconto em Folha)'}
            </button>
          </div>
        ) : (
          <div className="p-10 text-center opacity-30">
            <Package size={40} className="mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase italic">Carrinho Vazio</p>
          </div>
        )}
      </div>
      <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20">
        <p className="text-[9px] font-bold text-blue-400 uppercase leading-relaxed">
          * Os pedidos realizados nesta tela serão descontados diretamente em sua folha de pagamento. A retirada deve ser feita no setor de expedição após o atendimento.
        </p>
      </div>
    </div>
  );
};

const PaginaDP = ({ user, abaInicial = 'gestao' }) => {
  const [abaAtiva, setAbaAtiva] = useState(abaInicial);

  const abas = [
    { id: 'gestao', label: 'Gestão de Equipe', icon: Users },
    { id: 'pedidos_colab', label: 'Pedidos / Folha', icon: ShoppingCart },
    { id: 'arquivos', label: 'Gestão de Arquivos', icon: FileDown },
    { id: 'hotsite', label: 'Hotsite Funcionário', icon: MapPin },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          Departamento Pessoal
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>
          Gestão de Recursos Humanos e Documentação
        </p>
      </header>

      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
        {abas.map(aba => {
          const ativo = abaAtiva === aba.id;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className="flex items-center gap-3 px-6 py-4 rounded-t-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
              style={{
                backgroundColor: ativo ? 'var(--accent)' : 'var(--bg-card)',
                color: ativo ? '#fff' : 'var(--text-muted)',
                boxShadow: ativo ? '0 4px 20px var(--accent-glow)' : 'none',
                border: '1px solid ' + (ativo ? 'var(--accent)' : 'var(--border)'),
                borderBottom: 'none',
              }}
            >
              <aba.icon size={16} />
              {aba.label}
            </button>
          );
        })}
      </div>

      <div className="p-8 rounded-[48px] border min-h-[500px] relative" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="relative z-10">
          {abaAtiva === 'gestao' && (
            <EmDesenvolvimento icone={Users} titulo="Gestão de Equipe" descricao="Módulo de cadastro e manutenção de funcionários em construção." />
          )}
          {abaAtiva === 'pedidos_colab' && (
            <PedidosColaborador user={user} />
          )}
          {abaAtiva === 'arquivos' && (
            <EmDesenvolvimento icone={FileDown} titulo="Gestão de Arquivos" descricao="Upload e organização de documentos admissionais." />
          )}
          {abaAtiva === 'hotsite' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase italic" style={{ color: 'var(--text-primary)' }}>Portal do Colaborador</h3>
                <p className="text-xs font-bold uppercase opacity-50">Pré-cadastro admissional</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-60">Nome Completo</label>
                  <input type="text" className="w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-blue-500 transition-all" style={{ borderColor: 'var(--border)' }} placeholder="EX: JOÃO DA SILVA" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-60">CPF</label>
                  <input type="text" className="w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-blue-500 transition-all" style={{ borderColor: 'var(--border)' }} placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-60">Data de Nascimento</label>
                  <input type="date" className="w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-blue-500 transition-all" style={{ borderColor: 'var(--border)' }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase ml-2 opacity-60">Telefone / WhatsApp</label>
                  <input type="text" className="w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-blue-500 transition-all" style={{ borderColor: 'var(--border)' }} placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div className="p-6 rounded-3xl border-2 border-dashed flex flex-col items-center gap-4 cursor-pointer hover:bg-blue-500/5 transition-all" style={{ borderColor: 'var(--border)' }}>
                <FileDown size={32} className="opacity-20" />
                <p className="text-[10px] font-black uppercase text-center">Clique ou arraste fotos dos seus documentos (RG, CPF, Comprovante de Residência)</p>
              </div>

              <button className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all">
                Enviar Dados para o DP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaDP;
