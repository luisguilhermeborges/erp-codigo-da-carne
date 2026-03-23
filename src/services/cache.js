// Cache centralizado — server primeiro, localStorage como fallback
import { api } from './api';
import { BANCO_PADRAO } from '../data/bancoPadrao';

const limparCodigo = (v) => String(v ?? '').trim().replace(/^0+/, '');

// ── Preços ────────────────────────────────────────────────────────────────────
export const getPrecos = async () => {
  try {
    const dados = await api.precos.buscar();
    // Atualiza cache local
    localStorage.setItem('precos_cdc', JSON.stringify(dados));
    return dados;
  } catch {
    return JSON.parse(localStorage.getItem('precos_cdc') || '{}');
  }
};

// ── Filiais ───────────────────────────────────────────────────────────────────
export const getFiliais = async () => {
  try {
    const dados = await api.filiais.buscar();
    localStorage.setItem('filiais_config_completo', JSON.stringify(dados));
    return dados;
  } catch {
    return JSON.parse(localStorage.getItem('filiais_config_completo') || '[]');
  }
};

// ── Estoque (banco + preços) ──────────────────────────────────────────────────
export const getEstoque = async ({ apenasComPreco = false } = {}) => {
  const precos = await getPrecos();
  const lista = Object.entries(BANCO_PADRAO).map(([nome, v]) => {
    const cod = limparCodigo(v.codigo);
    return {
      id:        cod,
      codigo:    cod,
      codigoOriginal: v.codigo,
      nome,
      preco:     precos[cod] ?? 0,
      unidade:   v.unidade,
      categoria: v.categoria,
      tags:      v.tags || [v.categoria],
    };
  });
  return apenasComPreco ? lista.filter(p => p.preco > 0) : lista;
};

// ── Fila de pedidos ───────────────────────────────────────────────────────────
export const getFila = async () => {
  try {
    const dados = await api.pedidos.fila();
    localStorage.setItem('fila_pedidos', JSON.stringify(dados));
    return dados;
  } catch {
    return JSON.parse(localStorage.getItem('fila_pedidos') || '[]');
  }
};

// ── Histórico ─────────────────────────────────────────────────────────────────
export const getHistorico = async () => {
  try {
    const dados = await api.pedidos.historico();
    localStorage.setItem('historico_pedidos', JSON.stringify(dados));
    return dados;
  } catch {
    return JSON.parse(localStorage.getItem('historico_pedidos') || '[]');
  }
};