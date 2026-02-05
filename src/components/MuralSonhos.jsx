import React, { useState, useEffect } from 'react';
import { Heart, Camera, Trash2, Plus, X, Save, CheckSquare, Square, ArrowLeft, ArrowRight } from 'lucide-react';

const MuralSonhos = ({ user }) => {
  if (!user) return null;

  const [cards, setCards] = useState(() => {
    try {
      const salvo = localStorage.getItem('mural_sonhos_v3');
      return salvo ? JSON.parse(salvo) : [];
    } catch (e) { return []; }
  });

  const [modalAberto, setModalAberto] = useState(false);
  const meuCard = cards.find(c => c.userLogin === user.login);
  const [tempSonho, setTempSonho] = useState({ foto: '', sonhos: [] });
  const [novoInputSonho, setNovoInputSonho] = useState('');

  useEffect(() => {
    localStorage.setItem('mural_sonhos_v3', JSON.stringify(cards));
  }, [cards]);

  const moverCard = (index, direcao) => {
    if (user.cargo !== 'master') return;
    const novaLista = [...cards];
    const novoIndex = index + direcao;
    if (novoIndex < 0 || novoIndex >= novaLista.length) return;
    [novaLista[index], novaLista[novoIndex]] = [novaLista[novoIndex], novaLista[index]];
    setCards(novaLista);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setTempSonho({ ...tempSonho, foto: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const addSonhoLista = () => {
    if (novoInputSonho.trim() && tempSonho.sonhos.length < 5) {
      setTempSonho({ ...tempSonho, sonhos: [...tempSonho.sonhos, { texto: novoInputSonho.trim(), realizado: false }] });
      setNovoInputSonho('');
    }
  };

  const salvarCard = () => {
    if (tempSonho.sonhos.length === 0) return alert("Adicione pelo menos um sonho!");
    const novoCard = {
      id: meuCard ? meuCard.id : Date.now(),
      userLogin: user.login,
      userName: user.nome,
      foto: tempSonho.foto,
      sonhos: tempSonho.sonhos,
      data: new Date().toLocaleDateString('pt-BR')
    };
    const novaLista = meuCard ? cards.map(c => c.userLogin === user.login ? novoCard : c) : [...cards, novoCard];
    setCards(novaLista);
    setModalAberto(false);
  };

  const toggleRealizado = (cardId, sonhoIdx) => {
    if (user.cargo !== 'master') return;
    const novosCards = cards.map(card => {
      if (card.id === cardId) {
        const novosSonhos = card.sonhos.map((s, idx) => idx === sonhoIdx ? { ...s, realizado: !s.realizado } : s);
        return { ...card, sonhos: novosSonhos };
      }
      return card;
    });
    setCards(novosCards);
  };

  return (
    <div className="bg-slate-900 p-8 rounded-[40px] border-[10px] border-slate-800 shadow-2xl mt-8">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Heart className="text-pink-500 animate-pulse" size={24} />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">Mural dos Sonhos</h3>
        </div>
        {(user.cargo === 'master' || !meuCard) && (
          <button onClick={() => {
            setTempSonho(meuCard ? { foto: meuCard.foto, sonhos: meuCard.sonhos } : { foto: '', sonhos: [] });
            setModalAberto(true);
          }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg transition-all">
            {meuCard ? 'Editar Meus Sonhos' : '+ Criar Meu Card'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start">
        {cards.map((card, index) => (
          <div key={card.id} className="bg-[#fefce8] p-5 rounded-sm shadow-xl transform rotate-1 hover:rotate-0 transition-all border-l-[10px] border-blue-600/20 flex flex-col h-auto">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded truncate max-w-[100px]">@ {card.userName.split(' ')[0]}</span>
              <div className="flex gap-1">
                {user.cargo === 'master' && (
                  <>
                    <button onClick={() => moverCard(index, -1)} className="text-slate-400 hover:text-blue-600 p-1"><ArrowLeft size={14}/></button>
                    <button onClick={() => moverCard(index, 1)} className="text-slate-400 hover:text-blue-600 p-1"><ArrowRight size={14}/></button>
                  </>
                )}
                {(user.cargo === 'master' || card.userLogin === user.login) && (
                  <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className="text-red-200 hover:text-red-500 ml-1"><Trash2 size={14}/></button>
                )}
              </div>
            </div>
            {card.foto && <img src={card.foto} className="w-full h-40 object-cover rounded-xl mb-4 shadow-md" alt="Sonho" />}
            <div className="space-y-3">
              {card.sonhos.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-tight">
                  <button 
                    onClick={() => toggleRealizado(card.id, idx)}
                    disabled={user.cargo !== 'master'}
                    className={`${user.cargo === 'master' ? 'text-blue-600 cursor-pointer' : 'text-slate-300 cursor-default'}`}
                  >
                    {s.realizado ? <CheckSquare size={18}/> : <Square size={18}/>}
                  </button>
                  <p className={`text-[12px] font-bold text-slate-700 italic normal-case ${s.realizado ? 'line-through opacity-50' : ''}`}>
                    {s.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-800 italic">Meus Sonhos</h3>
              <button onClick={() => setModalAberto(false)}><X/></button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 text-center relative group">
                {tempSonho.foto ? <img src={tempSonho.foto} className="h-24 mx-auto rounded-xl" /> : <div className="py-4"><Camera className="mx-auto text-slate-300"/><p className="text-[9px] font-black uppercase text-slate-400 mt-2">Adicionar Foto</p></div>}
                <input type="file" accept="image/*" onChange={handleFoto} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="flex gap-2">
                <input type="text" className="flex-1 p-4 bg-slate-50 rounded-xl text-xs font-bold border-none normal-case" placeholder="Qual seu sonho?" value={novoInputSonho} onChange={e => setNovoInputSonho(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSonhoLista()}/>
                <button onClick={addSonhoLista} className="bg-blue-600 text-white p-4 rounded-xl"><Plus/></button>
              </div>
              <div className="space-y-2">
                {tempSonho.sonhos.map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                    <span className="text-[10px] font-bold normal-case">{s.texto}</span>
                    <button onClick={() => setTempSonho({...tempSonho, sonhos: tempSonho.sonhos.filter((_, idx) => idx !== i)})}><Trash2 size={14} className="text-red-300"/></button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={salvarCard} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px]">Fixar no Mural</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MuralSonhos;