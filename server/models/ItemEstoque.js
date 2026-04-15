const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemEstoqueSchema = new Schema({
  codigo: { type: String, required: true },
  nome: { type: String, required: true },
  pai: { type: String, default: 'Outros' },
  filho: { type: String, default: 'Outros' },
  unidadeAlojamento: { type: String, required: true },
  origemTransferencia: { type: String }, // Ex: "Estoque / Produção"

  qtdRecebida: { type: Number, required: true },
  qtdAtual: { type: Number, required: true },
  unidadeMedida: { type: String, default: 'KG' },

  lote: { type: String, required: true },
  precoEtiqueta: { type: Number, required: true },
  dtProducao: { type: String, required: true },
  dtValidade: { type: String, required: true },

  recebidoPor: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ItemEstoque', ItemEstoqueSchema);
