import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, Trash2, Search, CheckCircle2, 
  XCircle, AlertTriangle 
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

  // Função para garantir o Padrão Contábil (Ex: 1.250,80)
  const formatarPrecoContabil = (valor) => {
    if (valor === undefined || valor === null || valor === "") return "0,00";
    
    // Converte para número tratando pontos e vírgulas
    let num = typeof valor === 'string' 
      ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) 
      : valor;
    
    if (isNaN(num)) return "0,00";

    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
            preco: formatarPrecoContabil(row['Preço Venda']), // Formata aqui
            status: 'ATIVO'
          };
        }
        return null;
      }).filter(p => p !== null);

      const nomesExistentes = new Set(produtos.map(p => p.nome.toUpperCase()));
      const filtrados = novosProdutos.filter(p => !nomesExistentes.has(p.nome.toUpperCase()));

      salvarEAtualizar([...produtos, ...filtrados]);
      alert(`${filtrados.length} itens importados com preços em padrão contábil.`);
    };
    reader.readAsBinaryString(file);
  };

  const deletarItem = (id) => {
    if (window.confirm("Remover este item?")) {
      salvarEAtualizar(produtos.filter(p => p.id !== id));
    }
  };

  const alternarStatus = (id) => {
    salvarEAtualizar(produtos.map(p => 
      p.id === id ? { ...p, status: p.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' } : p
    ));
  };

  const itensFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(pesquisa.toLowerCase()) || 
    p.codigo.includes(pesquisa)
  );

  return (
    <div className="p-8 space-y-6 animate-in fade-in">
      <header className="flex justify-between items-center bg-slate-900 p-10 rounded-[40px] text-white">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Gestão de Itens</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Validação Contábil Ativa</p>
        </div>
        <label className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase cursor-pointer transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          <Upload size={18} /> Importar Layout
          <input type="file" className="hidden" onChange={handleImport} accept=".xlsx, .csv" />
        </label>
      </header>

      <input 
        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[24px] font-bold text-xs uppercase focus:ring-2 ring-blue-500 outline-none"
        placeholder="Pesquisar produto ou código..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Cód</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Produto</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Categoria</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Preço (R$)</th>
              <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensFiltrados.map((item) => (
              <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-all ${item.status === 'INATIVO' ? 'opacity-40 grayscale' : ''}`}>
                <td className="p-6">
                  <button onClick={() => alternarStatus(item.id)}>
                    {item.status === 'ATIVO' ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-slate-300" />}
                  </button>
                </td>
                <td className="p-6 font-mono text-xs text-slate-400">#{item.codigo}</td>
                <td className="p-6 font-black uppercase text-xs text-slate-800">{item.nome}</td>
                <td className="p-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{item.categoria}</span>
                </td>
                <td className="p-6 font-black text-xs text-blue-600">{item.preco}</td>
                <td className="p-6 text-right">
                  <button onClick={() => deletarItem(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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