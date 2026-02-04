import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Tag, 
  Calendar, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

// Importação da biblioteca para gerar o Excel real
import * as XLSX from 'xlsx';

const PaginaRelatorios = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
    setHistorico(dados);
  }, []);

  // FUNÇÃO DE EXPORTAÇÃO PARA EXCEL (MODELO DE IMPORTAÇÃO)
  const exportarParaExcel = (pedido) => {
    // Cabeçalho exato conforme o modelo (20 colunas)
    const cabecalho = [
      "Nro Ped. Cliente", "Seq. Item", "* Código Item (Reduzido)", "* Código Item", 
      "Descrição Item", "* Qtde. Venda", "Unid. Venda", "Valor Unitário (Venda)", 
      "Dt. Entrega", "* Tipo Desconto (P/V)", "% Desconto", "Valor Desconto", 
      "Código Nat. Op.", "Descrição Nat. Operação", "Código Tab. Preço", 
      "Descrição Tab. Preço", "% Config. Nat. Operação 1", "% Config. Nat. Operação 2", 
      "Item Ped. Cliente", "Item Seq. Cliente"
    ];

    // Mapeamento dos itens preenchendo as colunas específicas
    const dadosRows = pedido.itens.map((item, index) => {
      const row = new Array(20).fill(""); // Cria uma linha vazia com 20 posições
      
      row[0] = "";                         // Nro Ped. Cliente (Em branco conforme solicitado)
      row[1] = index + 1;                  // Seq. Item
      row[3] = item.codigo;                // * Código Item
      row[4] = item.nome;                  // Descrição Item
      row[5] = Number(item.qtdEnviada || item.qtd); // * Qtde. Venda
      row[6] = item.unidade;               // Unid. Venda
      row[9] = "v";                        // * Tipo Desconto (P/V) [NOVO REQUISITO]
      
      return row;
    });

    // Cria a folha de cálculo a partir do Array de Arrays (AOA)
    const ws = XLSX.utils.aoa_to_sheet([cabecalho, ...dadosRows]);
    
    // Configura a largura das colunas para melhor visualização
    ws['!cols'] = [
      { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, 
      { wch: 40 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
      { wch: 15 }, { wch: 18 }
    ];

    // Cria o livro de cálculo (Workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Importacao_PV");

    // Gera o ficheiro .xlsx e inicia o download
    XLSX.writeFile(wb, `IMPORT_NF_PEDIDO_${pedido.id}.xlsx`);
  };

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
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Relatórios</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Exportação para Nota Fiscal (XLSX)</p>
        </div>
      </header>

      {/* Painel de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Pesquisa</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Search size={16} className="text-slate-300" />
            <input type="text" placeholder="ID OU CLIENTE..." className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Data</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Calendar size={16} className="text-slate-300" />
            <input type="text" placeholder="DD/MM/AAAA" className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Movimento</label>
          <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
            <Filter size={16} className="text-slate-300" />
            <select className="bg-transparent border-none focus:ring-0 w-full text-xs font-bold uppercase" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="TODOS">TODOS OS TIPOS</option>
              <option value="PEDIDO_LOJA">PEDIDO DE LOJA</option>
              <option value="TRANSFERENCIA_AVULSA">TRANSFERÊNCIA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {dadosFiltrados.map((reg) => (
          <div key={reg.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className={`p-4 rounded-2xl ${reg.tipo === 'TRANSFERENCIA_AVULSA' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {reg.tipo === 'TRANSFERENCIA_AVULSA' ? <Tag size={24} /> : <ShoppingCart size={24} />}
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">#{reg.id} • {reg.data}</span>
                  <h3 className="text-lg font-black text-slate-800 uppercase mt-1 leading-tight">{reg.cliente}</h3>
                </div>
              </div>
              <button 
                onClick={() => exportarParaExcel(reg)}
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl transition-all shadow-xl shadow-green-600/20 active:scale-95 border-b-4 border-green-800"
              >
                <FileSpreadsheet size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Exportar para NF</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {reg.itens?.map((prod, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] font-black text-slate-800 uppercase truncate mb-1">{prod.nome}</span>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Cód: {prod.codigo}</span>
                    <span className="text-xs font-black text-blue-600">
                      {(Number(prod.qtdEnviada || prod.qtd) || 0).toFixed(prod.unidade === 'kg' ? 3 : 0)} {prod.unidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginaRelatorios;