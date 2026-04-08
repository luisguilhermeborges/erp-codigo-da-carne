import React, { useState, useEffect, useMemo } from 'react';
import { Search, Package, Tag, ArrowRight, RefreshCw } from 'lucide-react';
import { getEstoque } from '../services/cache';

const PaginaBuscador = () => {
  const [termo, setTermo] = useState('');
  const [catalogo, setCatalogo] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      // O getEstoque já traz a estrutura mesclada (bancoPadrao + precos salvos)
      // Trazemos todos os produtos (apenasComPreco: false) para a pesquisa
      const dados = await getEstoque({ apenasComPreco: false });
      
      // Aqui os dados já possuem .preco e (futuramente) .estoque na estrutura,
      // mas nós vamos ocultá-los na renderização visual abaixo.
      setCatalogo(dados);
    } catch (error) {
      console.error("Erro ao carregar catálogo", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = useMemo(() => {
    if (!termo.trim()) return catalogo;
    const busca = termo.toLowerCase();
    return catalogo.filter(p => 
      (p.nome && p.nome.toLowerCase().includes(busca)) || 
      (p.codigo && p.codigo.includes(busca)) ||
      (p.categoria && p.categoria.toLowerCase().includes(busca))
    );
  }, [termo, catalogo]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* ── CABEÇALHO E BUSCA ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter" style={{color:'var(--text-primary)'}}>
            Consulta de Produtos
          </h2>
          <p style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',color:'var(--text-muted)',marginTop:4}}>
            {produtosFiltrados.length} produto(s) encontrado(s) no catálogo
          </p>
        </div>

        <button onClick={carregarProdutos} disabled={carregando}
          style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid var(--border)',backgroundColor:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',cursor:'pointer'}}>
          <RefreshCw size={13} className={carregando ? 'animate-spin' : ''}/> Atualizar Base
        </button>
      </header>

      {/* Barra de Pesquisa */}
      <div className="flex items-center gap-3 p-4 rounded-[28px] border-2 shadow-sm transition-all" 
        style={{backgroundColor:'var(--bg-card)',borderColor: termo ? 'var(--accent)' : 'var(--border)'}}>
        <Search size={20} style={{color: termo ? 'var(--accent)' : 'var(--text-muted)', flexShrink:0}}/>
        <input 
          autoFocus
          className="flex-1 bg-transparent border-none outline-none font-black text-sm uppercase tracking-wide"
          style={{color:'var(--text-primary)'}} 
          placeholder="Digite o NOME, CÓDIGO ou CATEGORIA do produto..."
          value={termo} 
          onChange={e => setTermo(e.target.value)}
        />
        {termo && (
          <button onClick={() => setTermo('')} style={{padding:'0.4rem', borderRadius:'50%', backgroundColor:'var(--bg-elevated)', color:'var(--text-muted)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>

      {/* ── LISTA DE RESULTADOS ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[32px] border" style={{backgroundColor:'var(--bg-card)',borderColor:'var(--border)'}}>
        {carregando ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 p-12">
            <RefreshCw size={40} className="animate-spin mb-4" style={{color:'var(--text-muted)'}}/>
            <p className="font-black uppercase text-xs tracking-widest" style={{color:'var(--text-muted)'}}>Carregando catálogo...</p>
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead style={{backgroundColor:'var(--bg-elevated)', position: 'sticky', top: 0, zIndex: 10}}>
              <tr style={{color:'var(--text-muted)',fontSize:'0.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                <th className="px-6 py-4 w-16 text-center">Ícone</th>
                <th className="px-6 py-4">Código Original</th>
                <th className="px-6 py-4">Descrição do Produto</th>
                <th className="px-6 py-4">Categoria</th>
                {/* As colunas de PREÇO e ESTOQUE estão ocultas na interface por enquanto */}
                {/* <th className="px-6 py-4 text-right">Estoque</th> */}
                {/* <th className="px-6 py-4 text-right">Preço</th> */}
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((prod, index) => (
                <tr key={prod.codigo + index} style={{borderTop:'1px solid var(--border)', transition:'background-color 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor='var(--bg-elevated)'}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='transparent'}
                >
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl" style={{backgroundColor:'rgba(59,130,246,0.1)', color:'var(--accent-bright)'}}>
                      <Package size={18}/>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span style={{fontFamily:'monospace', fontSize:'0.75rem', fontWeight:700, color:'var(--text-secondary)', padding:'4px 8px', borderRadius:'8px', backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)'}}>
                      {prod.codigo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p style={{fontWeight:800, textTransform:'uppercase', fontSize:'0.8rem', color:'var(--text-primary)', lineHeight:1.2}}>
                      {prod.nome}
                    </p>
                    {prod.unidade && (
                      <span style={{fontSize:'0.6rem', fontWeight:700, color:'var(--text-muted)', marginTop:4, display:'inline-block'}}>
                        Unidade de medida: {prod.unidade}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={12} style={{color:'var(--text-muted)'}}/>
                      <span style={{fontSize:'0.65rem', fontWeight:800, textTransform:'uppercase', color:'var(--text-muted)'}}>
                        {prod.categoria || 'Geral'}
                      </span>
                    </div>
                  </td>
                  
                  {/* ESTRUTURA PRONTA (COMENTADA) PARA EXIBIR PREÇO E ESTOQUE NO FUTURO */}
                  {/* <td className="px-6 py-4 text-right">
                    <span style={{fontWeight:800, fontSize:'0.75rem', color: prod.estoque > 0 ? '#10b981' : '#ef4444'}}>
                      {prod.estoque || 0} {prod.unidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span style={{fontWeight:800, fontSize:'0.75rem', color:'var(--text-primary)'}}>
                      {Number(prod.preco || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </span>
                  </td> 
                  */}
                  
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={16} style={{color:'var(--border-bright)'}}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40 p-20 text-center">
            <Search size={56} className="mb-4" style={{color:'var(--text-muted)'}}/>
            <p className="font-black uppercase text-sm tracking-[0.2em]" style={{color:'var(--text-muted)'}}>
              Nenhum produto encontrado
            </p>
            <p className="text-xs font-bold mt-2" style={{color:'var(--text-secondary)'}}>
              Tente buscar por outro termo ou código.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaBuscador;