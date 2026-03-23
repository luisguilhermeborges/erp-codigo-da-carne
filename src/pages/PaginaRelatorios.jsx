import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Tag, 
  Calendar, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

// Importação da biblioteca Excel (XLSX)
import * as XLSX from 'xlsx';
import { getHistorico } from '../services/cache';

const PaginaRelatorios = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    getHistorico().then(setHistorico).catch(() => {
      setHistorico(JSON.parse(localStorage.getItem('historico_pedidos') || '[]'));
    });
  }, []);

  // FUNÇÃO DE EXPORTAÇÃO XLSX (MODELO RIGOROSO DE 20 COLUNAS)
  const exportarParaExcel = (pedido) => {
    // Cabeçalho exato do Modelo de Importação MBM
    const cabecalho = [
      "Nro Ped. Cliente", "Seq. Item", "* Código Item (Reduzido)", "* Código Item", 
      "Descrição Item", "* Qtde. Venda", "Unid. Venda", "Valor Unitário (Venda)", 
      "Dt. Entrega", "* Tipo Desconto (P/V)", "% Desconto", "Valor Desconto", 
      "Código Nat. Op.", "Descrição Nat. Operação", "Código Tab. Preço", 
      "Descrição Tab. Preço", "% Config. Nat. Operação 1", "% Config. Nat. Operação 2", 
      "Item Ped. Cliente", "Item Seq. Cliente"
    ];

    // Mapeamento dos itens para as colunas da planilha
    const dadosRows = pedido.itens.map((item, index) => {
      // Cria uma linha vazia com 20 colunas
      const row = new Array(20).fill(""); 
      
      row[0] = "";                                  // Nro Ped. Cliente (Vazio conforme pedido)
      row[1] = index + 1;                           // Seq. Item (Sequencial)
      row[3] = item.codigo;                         // * Código Item
      row[4] = item.nome;                           // Descrição Item
      row[5] = Number(item.qtdEnviada || item.qtd);  // * Qtde. Venda (Real conferida)
      row[6] = item.unidade;                        // Unid. Venda
      row[9] = "V";                                 // * Tipo Desconto (P/V) (V Maiúsculo)
      
      return row;
    });

    // Cria a folha de cálculo a partir do cabeçalho e dados
    const ws = XLSX.utils.aoa_to_sheet([cabecalho, ...dadosRows]);
    
    // Configuração de largura das colunas (Opcional para visualização)
    ws['!cols'] = [
      { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, 
      { wch: 40 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
      { wch: 15 }, { wch: 18 }
    ];

    // Cria o livro de cálculo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Importacao_PV");

    // Dispara o download do ficheiro XLSX
    XLSX.writeFile(wb, `PEDIDO_${pedido.idExterno||pedido.id}_MBM_NF.xlsx`);
  };

  // Lógica de filtragem dos relatórios
  const dadosFiltrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return historico.filter(reg => {
      if (!reg) return false;
      const matchesTipo = filtroTipo === 'TODOS' || reg.tipo === filtroTipo;
      const matchesData = !filtroData || (reg.data && reg.data.includes(filtroData));
      const matchTexto = 
        (reg.id?.toString().toLowerCase().includes(termo)) ||
        (reg.cliente?.toLowerCase().includes(termo)) ||
        (reg.itens?.some(i => i.nome?.toLowerCase().includes(termo) || i.codigo?.toString().toLowerCase().includes(termo)));
      return matchesTipo && matchesData && matchTexto;
    });
  }, [pesquisa, filtroData, filtroTipo, historico]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color: "var(--text-primary)" }}>
            Relatórios
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-muted)" }}>
            Exportação direta para integração de faturamento (XLSX)
          </p>
        </div>
      </header>

      {/* Painel de Filtros Avançados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-[32px] border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase ml-2" style={{ color: "var(--text-muted)" }}>Pesquisa Geral</label>
          <div className="p-3 rounded-2xl flex items-center gap-3" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <Search size={16} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="ID OU CLIENTE..." 
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase" 
              value={pesquisa} 
              onChange={(e) => setPesquisa(e.target.value)} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase ml-2" style={{ color: "var(--text-muted)" }}>Data do Pedido</label>
          <div className="p-3 rounded-2xl flex items-center gap-3" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <Calendar size={16} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="DD/MM/AAAA" 
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase" 
              value={filtroData} 
              onChange={(e) => setFiltroData(e.target.value)} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase ml-2" style={{ color: "var(--text-muted)" }}>Tipo de Movimento</label>
          <div className="p-3 rounded-2xl flex items-center gap-3" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <Filter size={16} className="text-slate-300" />
            <select 
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-black uppercase" 
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="TODOS">TODOS OS TIPOS</option>
              <option value="PEDIDO_LOJA">PEDIDO DE LOJA</option>
              <option value="TRANSFERENCIA_AVULSA">TRANSFERÊNCIA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listagem de Cards de Histórico */}
      <div className="space-y-4">
        {dadosFiltrados.map((reg) => (
          <div key={reg.idExterno||reg.id} className="p-8 rounded-[40px] border shadow-sm transition-all group" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className={`p-4 rounded-2xl ${reg.tipo === 'TRANSFERENCIA_AVULSA' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {reg.tipo === 'TRANSFERENCIA_AVULSA' ? <Tag size={24} /> : <ShoppingCart size={24} />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: "var(--text-muted)" }}>
                    #{reg.idExterno||reg.id} • {reg.data}
                  </span>
                  <h3 className="text-lg font-black uppercase mt-1 leading-tight" style={{ color: "var(--text-primary)" }}>{reg.cliente}</h3>
                </div>
              </div>

              {/* Botão de Exportação de Planilha MBM */}
              <button 
                onClick={() => exportarParaExcel(reg)}
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl transition-all shadow-xl shadow-green-600/20 active:scale-95 border-b-4 border-green-800"
              >
                <FileSpreadsheet size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exportar para MBM</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {reg.itens?.map((prod, idx) => (
                <div key={idx} className="p-4 rounded-2xl flex flex-col border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
                  <span className="text-[10px] font-black uppercase truncate mb-1" style={{ color: "var(--text-primary)" }}>{prod.nome}</span>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                    <span className="text-[8px] font-black uppercase" style={{ color: "var(--text-muted)" }}>Cód: {prod.codigo}</span>
                    <span className="text-xs font-black" style={{ color: "var(--accent-bright)" }}>
                      {(Number(prod.qtdEnviada || prod.qtd) || 0).toFixed(prod.unidade === 'kg' ? 3 : 0)} {prod.unidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {dadosFiltrados.length === 0 && (
          <div className="py-20 text-center opacity-30 italic text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Nenhum registo encontrado para os filtros selecionados
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaRelatorios;