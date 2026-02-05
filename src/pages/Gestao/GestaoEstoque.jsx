import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, Trash2, Search, CheckCircle2, 
  XCircle, AlertTriangle, FileSpreadsheet 
} from 'lucide-react';
import { BANCO_PADRAO } from '../../data/bancoPadrao';

const GestaoEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    const salvos = localStorage.getItem('produtos_estoque_cdc');
    if (salvos) setProdutos(JSON.parse(salvos));
  }, []);

  const salvarEAtualizar = (novaLista) => {
    setProdutos(novaLista);
    localStorage.setItem('produtos_estoque_cdc', JSON.stringify(novaLista));
  };

  // IMPORTAÇÃO: Cruza o Layout com o Banco Padrão
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      const novosProdutos = data.map(row => {
        const descricaoOriginal = (row['(*) Descrição'] || row['Descrição'] || "").trim();
        const nomeChave = descricaoOriginal.toUpperCase();
        
        const infoBase = BANCO_PADRAO[nomeChave];

        if (infoBase) {
          return {
            id: `${infoBase.codigo}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            nome: descricaoOriginal,
            codigo: infoBase.codigo,
            categoria: infoBase.categoria,
            unidade: infoBase.unidade,
            preco: row['Preço Venda'] || "0,00", // Preço vem da planilha importada agora
            status: 'ATIVO'
          };
        }
        return null;
      }).filter(p => p !== null);

      // Evita duplicatas por nome
      const nomesExistentes = new Set(produtos.map(p => p.nome.toUpperCase()));
      const filtrados = novosProdutos.filter(p => !nomesExistentes.has(p.nome.toUpperCase()));

      salvarEAtualizar([...produtos, ...filtrados]);
      alert(`${filtrados.length} itens oficiais foram adicionados ao estoque.`);
    };
    reader.readAsBinaryString(file);
  };

  // CORREÇÃO DEFINITIVA DA EXCLUSÃO
  const deletarItem = (idParaRemover) => {
    if (window.confirm("Deseja remover este item permanentemente?")) {
      const novaLista = produtos.filter(item => item.id !== idParaRemover);
      salvarEAtualizar(novaLista);
    }
  };

  const alternarStatus = (id) => {
    const novaLista = produtos.map(p => 
      p.id === id ? { ...p, status: p.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' } : p
    );
    salvarEAtualizar(novaLista);
  };

  const itensFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(pesquisa.toLowerCase()) || 
    p.codigo.includes(pesquisa)
  );

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-center bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl">
        <div>
          <h1 className="text-4xl font-black uppercase italic italic tracking-tighter">Gestão de Estoque</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Baseado em Classificação Oficial CDC
          </p>
        </div>
        <label className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          <Upload size={18} /> Importar Planilha de Layout
          <input type="file" className="hidden" onChange={handleImport} accept=".xlsx, .csv" />
        </label>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] font-bold text-xs uppercase focus:border-blue-500 outline-none shadow-sm"
          placeholder="Pesquisar por nome ou código reduzido..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-8 text-[10px] font-black uppercase text-slate-400">Status</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400">Código</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400">Descrição</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400">Categoria</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400">Preço Venda</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {itensFiltrados.map((item) => (
              <tr key={item.id} className={`group hover:bg-slate-50 transition-all ${item.status === 'INATIVO' ? 'opacity-40 grayscale' : ''}`}>
                <td className="p-8">
                  <button onClick={() => alternarStatus(item.id)}>
                    {item.status === 'ATIVO' ? (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : (
                      <XCircle className="text-slate-300" size={24} />
                    )}
                  </button>
                </td>
                <td className="p-8 font-mono text-xs font-bold text-slate-400">#{item.codigo}</td>
                <td className="p-8 font-black uppercase text-xs text-slate-800">{item.nome}</td>
                <td className="p-8">
                  <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-[9px] font-black uppercase">
                    {item.categoria}
                  </span>
                </td>
                <td className="p-8 font-black text-xs text-blue-600">R$ {item.preco}</td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => deletarItem(item.id)}
                    className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoEstoque;