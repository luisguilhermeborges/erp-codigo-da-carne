import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Save, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

const GestaoEstoque = () => {
  const [previa, setPrevia] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCarregando(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const formatados = data
        .map(row => {
          // Normalização de números (trata vírgulas do Excel)
          const parseNum = (v) => parseFloat(String(v || 0).replace(',', '.'));
          
          return {
            codigo: row['(*) Código'] || row['Código'],
            nome: row['(*) Descrição'] || row['Descrição'],
            unidade: String(row['(*) Unidade de Medida'] || row['Unidade'] || 'kg').toLowerCase(),
            preco: parseNum(row['Preço Venda'] || row['Preço de Venda']),
            custo: parseNum(row['Custo Reposição'] || row['Custo de reposição'])
          };
        })
        // Regra de negócio: Apenas produtos com preço de venda
        .filter(item => item.preco > 0 && item.nome);

      setPrevia(formatados);
      setCarregando(false);
    };

    reader.readAsBinaryString(file);
  };

  const confirmarImportacao = () => {
    localStorage.setItem('produtos_erp', JSON.stringify(previa));
    alert(`Sucesso! ${previa.length} produtos foram carregados e configurados com 3 casas decimais.`);
    setPrevia([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-tight">Importação de Produtos</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Layout MBM: Código | Descrição | Unidade | Preço</p>
        </div>
        {previa.length > 0 && (
          <button 
            onClick={confirmarImportacao} 
            className="bg-green-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-green-500 transition-all"
          >
            <Save size={16}/> Salvar no Sistema
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div className="relative group">
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 p-12 rounded-[32px] text-center space-y-4 group-hover:bg-blue-50 transition-colors">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20">
            <Upload size={32} />
          </div>
          <div>
            <h4 className="font-black uppercase text-slate-800 italic">Selecionar Planilha de Itens</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Clique ou arraste o ficheiro .xlsx aqui</p>
          </div>
        </div>
      </div>

      {/* Pré-visualização */}
      {previa.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
            <AlertCircle size={18} />
            <p className="text-[10px] font-black uppercase">Filtro Ativo: Apenas itens com preço de venda detectados.</p>
          </div>

          <div className="border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
                <tr>
                  <th className="p-4">Código</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4 text-center">Unidade</th>
                  <th className="p-4 text-right">Preço Venda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[10px] font-bold uppercase text-slate-600">
                {previa.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-blue-600 font-black">{p.codigo}</td>
                    <td className="p-4">{p.nome}</td>
                    <td className="p-4 text-center text-slate-400">{p.unidade}</td>
                    <td className="p-4 text-right">R$ {p.preco.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestaoEstoque;