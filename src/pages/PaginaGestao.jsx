import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  Beef, 
  Plus, 
  Trash2, 
  UserPlus, 
  Upload, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

const PaginaGestao = () => {
  const [abaAtiva, setAbaAtiva] = useState('usuarios');
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('usuarios_erp') || '[]'));
  const [novoUser, setNovoUser] = useState({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
  
  // Estados para Filiais e Estoque
  const [filiais, setFiliais] = useState(() => JSON.parse(localStorage.getItem('filiais_config') || '["000 - PRODUÇÃO", "001 - CENTRO", "002 - ALPHAVILLE", "003 - GLEBA"]'));
  const [novaFilial, setNovaFilial] = useState('');
  const [dadosImportados, setDadosImportados] = useState(null);

  const abas = [
    { id: 'usuarios', rotulo: 'Usuários', icone: Users },
    { id: 'filiais', rotulo: 'Filiais', icone: MapPin },
    { id: 'permissoes', rotulo: 'Permissões', icone: ShieldCheck },
    { id: 'estoque', rotulo: 'Estoque/Produtos', icone: Beef },
  ];

  // Lógica de Importação Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      setDadosImportados(data);
      console.log("Dados do Excel:", data);
      // Aqui salvaremos no localStorage ou banco após confirmar o modelo
    };
    reader.readAsBinaryString(file);
  };

  const salvarUser = (e) => {
    e.preventDefault();
    const lista = [...usuarios, { ...novoUser, id: Date.now() }];
    setUsuarios(lista);
    localStorage.setItem('usuarios_erp', JSON.stringify(lista));
    setNovoUser({ nome: '', login: '', senha: '', cargo: 'comercial', unidade: '001' });
  };

  const adicionarFilial = () => {
    if(!novaFilial) return;
    const novaLista = [...filiais, novaFilial];
    setFiliais(novaLista);
    localStorage.setItem('filiais_config', JSON.stringify(novaLista));
    setNovaFilial('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-800">Gestão do Sistema</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Controle de Filiais, Acessos e Produtos</p>
      </header>

      {/* Navegação de Abas */}
      <div className="flex gap-4 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              abaAtiva === aba.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <aba.icone size={16} />
            {aba.rotulo}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[500px]">
        
        {/* ABA USUÁRIOS */}
        {abaAtiva === 'usuarios' && (
          <div className="space-y-8">
            <form onSubmit={salvarUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-50 p-6 rounded-3xl">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Nome</label>
                <input type="text" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.nome} onChange={e => setNovoUser({...novoUser, nome: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Login</label>
                <input type="text" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.login} onChange={e => setNovoUser({...novoUser, login: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Senha</label>
                <input type="password" placeholder="****" className="w-full p-3 rounded-xl border-none text-xs font-bold" required value={novoUser.senha} onChange={e => setNovoUser({...novoUser, senha: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Cargo/Loja</label>
                <div className="flex gap-2">
                  <select className="bg-white p-3 rounded-xl border-none text-xs font-bold w-full" value={novoUser.cargo} onChange={e => setNovoUser({...novoUser, cargo: e.target.value})}>
                    <option value="comercial">Comercial</option>
                    <option value="estoque">Estoque</option>
                    <option value="adm">ADM</option>
                  </select>
                  <select className="bg-white p-3 rounded-xl border-none text-xs font-bold w-full" value={novoUser.unidade} onChange={e => setNovoUser({...novoUser, unidade: e.target.value})}>
                    {filiais.map(f => <option key={f} value={f.split(' ')[0]}>{f.split(' ')[0]}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-blue-600 text-white p-3.5 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                <UserPlus size={16}/> Cadastrar
              </button>
            </form>

            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                <tr><th className="p-6">Nome</th><th>Cargo</th><th>Login</th><th>Base</th><th className="text-right p-6">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-bold">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-6">{u.nome}</td>
                    <td className="uppercase text-blue-600 font-black">{u.cargo}</td>
                    <td>{u.login}</td>
                    <td>{u.unidade}</td>
                    <td className="text-right p-6">
                      <button onClick={() => setUsuarios(usuarios.filter(x => x.id !== u.id))} className="text-red-300 hover:text-red-500">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ABA FILIAIS */}
        {abaAtiva === 'filiais' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400">Identificação da Filial (Ex: 004 - LONDRINA)</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border-none text-xs font-bold" 
                  value={novaFilial}
                  onChange={(e) => setNovaFilial(e.target.value.toUpperCase())}
                />
              </div>
              <button onClick={adicionarFilial} className="bg-blue-600 text-white p-3.5 rounded-xl font-black text-[10px] uppercase px-8">Adicionar</button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filiais.map((f, i) => (
                <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><MapPin size={16}/></div>
                    <span className="font-black text-xs uppercase text-slate-700">{f}</span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA PERMISSÕES */}
        {abaAtiva === 'permissoes' && (
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-800">Cargos e Poderes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['MASTER', 'ADM', 'ESTOQUE', 'COMERCIAL'].map(cargo => (
                <div key={cargo} className="p-6 border border-slate-100 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs text-blue-600 uppercase">{cargo}</span>
                    <ShieldCheck size={18} className="text-slate-300"/>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Acesso a: {cargo === 'MASTER' ? 'Todos os módulos do sistema' : 'Módulos operacionais específicos'}
                  </div>
                  <button className="text-[9px] font-black uppercase text-slate-300 cursor-not-allowed">Configurar Regras</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA ESTOQUE / EXCEL */}
        {abaAtiva === 'estoque' && (
          <div className="space-y-8">
            <div className="bg-blue-50/50 border-2 border-dashed border-blue-100 p-12 rounded-[40px] text-center space-y-4 relative">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20">
                <Upload size={32} />
              </div>
              <div>
                <h4 className="font-black uppercase text-slate-800 italic">Importar Planilha de Produtos</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Arraste o arquivo ou clique para selecionar</p>
              </div>
            </div>

            {dadosImportados && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase">
                    <CheckCircle2 size={16}/> {dadosImportados.length} Itens Detectados
                  </div>
                  <button className="bg-slate-800 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase">Processar e Atualizar Estoque</button>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-[10px] font-bold">
                    <thead className="bg-slate-50 uppercase text-slate-400">
                      <tr>
                        {Object.keys(dadosImportados[0]).map(key => <th key={key} className="p-4">{key}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 uppercase">
                      {dadosImportados.slice(0, 5).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          {Object.values(row).map((val, j) => <td key={j} className="p-4">{String(val)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-slate-50 text-center text-[9px] font-bold text-slate-400 uppercase">Apenas os 5 primeiros itens mostrados na prévia</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaGestao;