import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, Edit2, Save, X, Plus, Building2, AlertTriangle } from 'lucide-react';

const GestaoFiliais = () => {
  const [filiais, setFiliais] = useState(() => {
    const salvo = localStorage.getItem('filiais_config_completo');
    if (salvo) {
      try {
        const dados = JSON.parse(salvo);
        if (dados.length > 0 && typeof dados[0] === 'object') return dados;
      } catch (e) { console.error("Erro ao ler filiais", e); }
    }
    return [
      { id: 1, codigo: '000', nome: 'PRODUÇÃO', cnpj: '', endereco: '' },
      { id: 2, codigo: '001', nome: 'CENTRO', cnpj: '', endereco: '' }
    ];
  });

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ codigo: '', nome: '', cnpj: '', endereco: '' });
  const [erro, setErro] = useState('');

  // Função para formatar CNPJ na visualização (00.000.000/0000-00)
  const formatarCNPJ = (val) => {
    const s = val.replace(/\D/g, '');
    if (s.length !== 14) return val; // Retorna original se incompleto
    return s.replace(/^(\2330)(\2330)(\2330)(\2330)(\2330)/, "$1.$2.$3/$4-$5");
  };

  useEffect(() => {
    localStorage.setItem('filiais_config_completo', JSON.stringify(filiais));
    const listaSimples = filiais.map(f => `${f.codigo} - ${f.nome}`);
    localStorage.setItem('filiais_config', JSON.stringify(listaSimples));
  }, [filiais]);

  // Função para permitir apenas números nos inputs
  const apenasNumeros = (val) => val.replace(/\D/g, '');

  const salvar = (e) => {
    e.preventDefault();
    setErro('');

    // 1. Validação de Código Único
    const codigoExiste = filiais.some(f => f.codigo.trim() === form.codigo.trim() && f.id !== editandoId);
    if (codigoExiste) {
      setErro(`O código "${form.codigo}" já está em uso!`);
      return;
    }

    // 2. Validação de CNPJ (Somente se preenchido, deve ter 14 dígitos)
    if (form.cnpj.length > 0 && form.cnpj.length !== 14) {
      setErro("O CNPJ deve conter exatamente 14 dígitos numéricos.");
      return;
    }

    if (editandoId) {
      setFiliais(filiais.map(f => f.id === editandoId ? { ...form, id: editandoId } : f));
    } else {
      setFiliais([...filiais, { ...form, id: Date.now() }]);
    }
    resetForm();
    alert("Unidade salva com sucesso!");
  };

  const iniciarEdicao = (f) => {
    setEditandoId(f.id);
    setForm({ ...f });
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditandoId(null);
    setForm({ codigo: '', nome: '', cnpj: '', endereco: '' });
    setErro('');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <form onSubmit={salvar} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {editandoId ? `Editando Unidade ${form.codigo}` : 'Nova Filial / Loja'}
          </h3>
          {editandoId && (
            <button type="button" onClick={resetForm} className="text-red-500 hover:bg-red-50 p-2 rounded-xl">
              <X size={18}/>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2 text-blue-600">Código (Somente Números)</label>
            <input 
              type="text" 
              maxLength={6}
              placeholder="Ex: 001" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold uppercase"
              required 
              value={form.codigo} 
              onChange={e => setForm({...form, codigo: apenasNumeros(e.target.value)})} 
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome da Unidade</label>
            <input type="text" placeholder="LOJA CENTRO" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold uppercase" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-2 text-blue-600">CNPJ (14 dígitos)</label>
            <input 
              type="text" 
              maxLength={14}
              placeholder="Apenas números" 
              className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold" 
              value={form.cnpj} 
              onChange={e => setForm({...form, cnpj: apenasNumeros(e.target.value)})} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Endereço Completo</label>
          <input type="text" placeholder="RUA, NÚMERO, BAIRRO..." className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-xs font-bold uppercase" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} />
        </div>

        {erro && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertTriangle size={18} />
            <span className="text-[10px] font-black uppercase tracking-tight">{erro}</span>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20">
          {editandoId ? <Save size={18}/> : <Plus size={18}/>}
          {editandoId ? 'Gravar Alterações' : 'Adicionar Filial'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filiais.map(f => (
          <div key={f.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Building2 size={24}/></div>
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase">Cód: {f.codigo}</span>
                  <h3 className="text-sm font-black text-slate-800 uppercase leading-none">{f.nome}</h3>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => iniciarEdicao(f)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={18}/></button>
                <button onClick={() => setFiliais(filiais.filter(x => x.id !== f.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-50 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">CNPJ</p>
                <p className="text-[10px] font-bold text-slate-600">{f.cnpj ? formatarCNPJ(f.cnpj) : '---'}</p>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin size={14} className="shrink-0" />
                <p className="text-[9px] font-bold uppercase leading-tight">{f.endereco || 'Sem endereço'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestaoFiliais;