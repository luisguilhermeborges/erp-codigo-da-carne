import React, { useState } from 'react';
import { Megaphone, ExternalLink, ShoppingBag, Trash2, X } from 'lucide-react';
import MuralSonhos from './MuralSonhos';

const BannerBoasVindas = ({ user }) => {
  if (!user) return null;

  const [anuncios, setAnuncios] = useState(() => JSON.parse(localStorage.getItem('quadro_anuncios') || '[]'));
  const [modalAnuncio, setModalAnuncio] = useState(false);
  const [novoAnuncio, setNovoAnuncio] = useState({ titulo: '', preco: '', contato: '' });

  const formatarTelefone = (val) => {
    const n = val.replace(/\D/g, '');
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 3) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2, 3)} ${n.slice(3)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 3)} ${n.slice(3, 7)}-${n.slice(7, 11)}`;
  };

  const handlePostar = () => {
    if (!novoAnuncio.titulo || novoAnuncio.contato.length < 16) return alert("Preencha título e WhatsApp completo!");
    const lista = [{ ...novoAnuncio, id: Date.now(), autor: user.nome, userId: user.id }, ...anuncios];
    setAnuncios(lista);
    localStorage.setItem('quadro_anuncios', JSON.stringify(lista));
    setNovoAnuncio({ titulo: '', preco: '', contato: '' });
    setModalAnuncio(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0a0b1e] p-12 rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
            Olá, <span className="text-blue-500">{user.nome.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            Base: {user.unidade} | Código da Carne ERP
          </p>
        </div>
        <Megaphone className="absolute right-[-20px] bottom-[-20px] text-white/5" size={200} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Comunicados</h3>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 italic font-black text-blue-800 text-[11px]">
              Bem-vindo ao novo ecossistema digital. Confira seu Mural de Sonhos abaixo!
            </div>
          </section>
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Totalpass</h3>
            <a href="https://totalpass.com.br" target="_blank" className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-black uppercase">Acessar Manual</span>
              <ExternalLink size={16} className="text-blue-600"/>
            </a>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-blue-600" size={20} />
                <h3 className="text-[10px] font-black uppercase text-slate-800">Classificados</h3>
              </div>
              <button onClick={() => setModalAnuncio(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase">+ Novo Anúncio</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anuncios.map(a => (
                <div key={a.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                  {(user.cargo === 'master' || a.userId === user.id) && (
                    <button onClick={() => setAnuncios(anuncios.filter(x => x.id !== a.id))} className="absolute top-4 right-4 text-red-300 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                  )}
                  <h4 className="text-xs font-black uppercase italic">{a.titulo}</h4>
                  <p className="text-[11px] font-black text-green-600 mt-2">R$ {a.preco}</p>
                  <div className="mt-4 pt-4 border-t text-slate-400 text-[8px] font-black uppercase">
                    Vendedor: {a.autor} <br/>
                    <span className="text-blue-500 text-[10px]">WhatsApp: {a.contato}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MuralSonhos user={user} />

      {modalAnuncio && (
        <div className="fixed inset-0 bg-[#0a0b1e]/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-4 shadow-2xl animate-in zoom-in">
            <h3 className="text-sm font-black uppercase text-slate-800 italic">Novo Classificado</h3>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-xs font-bold uppercase" placeholder="Título" value={novoAnuncio.titulo} onChange={e => setNovoAnuncio({...novoAnuncio, titulo: e.target.value})} />
            <div className="flex gap-2">
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-xs font-bold uppercase" placeholder="Valor" value={novoAnuncio.preco} onChange={e => setNovoAnuncio({...novoAnuncio, preco: e.target.value})} />
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none text-xs font-bold uppercase" placeholder="WhatsApp" value={novoAnuncio.contato} maxLength={16} onChange={e => setNovoAnuncio({...novoAnuncio, contato: formatarTelefone(e.target.value)})} />
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={handlePostar} className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px]">Publicar</button>
              <button onClick={() => setModalAnuncio(false)} className="px-8 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerBoasVindas;