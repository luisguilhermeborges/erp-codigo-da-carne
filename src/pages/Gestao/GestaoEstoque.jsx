import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Save, AlertCircle } from 'lucide-react';

const GestaoEstoque = () => {
  const [previa, setPrevia] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const formatados = data
        .map(row => {
          const parseNum = (v) => parseFloat(String(v || 0).replace(',', '.'));
          return {
            codigo: row['(*) Código'] || row['Código'],
            nome: row['(*) Descrição'] || row['Descrição'],
            unidade: String(row['(*) Unidade de Medida'] || row['Unidade'] || 'kg').toLowerCase(),
            preco: parseNum(row['Preço Venda'] || row['Preço de Venda']),
            custo: parseNum(row['Custo Reposição'] || row['Custo de reposição'])
          };
        })
        .filter(item => item.preco > 0 && item.nome); // Filtro: apenas itens com preço

      setPrevia(formatados);
    };
    reader.readAsBinaryString(file);
  };

  const confirmar = () => {
    localStorage.setItem('produtos_erp', JSON.stringify(previa));
    alert(`Sucesso! ${previa.length} produtos carregados.`);
    setPrevia([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800">Catálogo de Produtos</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Importação via layout MBM (Apenas itens com preço)</p>
        </div>
        {previa.length > 0 && (
          <button onClick={confirmar} className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
            <Save size={16}/> Confirmar Importação
          </button>
        )}
      </div>

      <div className="relative border-2 border-dashed border-slate-200 p-12 rounded-[32px] text-center hover:bg-slate-50 transition-all">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <Upload size={32} className="mx-auto text-blue-600 mb-2" />
        <p className="text-[10px] font-black uppercase text-slate-400">Clique para selecionar a planilha de itens</p>
      </div>

      {previa.length > 0 && (
        <div className="border border-slate-100 rounded-[24px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
              <tr><th className="p-4">Código</th><th className="p-4">Descrição</th><th className="p-4 text-right">Preço Venda</th><th className="p-4 text-center">UM</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[10px] font-bold uppercase">
              {previa.slice(0, 20).map((p, i) => (
                <tr key={i}>
                  <td className="p-4 text-blue-600 font-black">{p.codigo}</td>
                  <td className="p-4">{p.nome}</td>
                  <td className="p-4 text-right">R$ {p.preco.toFixed(2)}</td>
                  <td className="p-4 text-center text-slate-400">{p.unidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestaoEstoque;