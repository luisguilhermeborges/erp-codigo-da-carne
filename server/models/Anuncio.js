const mongoose = require('mongoose');

const AnuncioSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  titulo: { type: String, required: true },
  preco: { type: String },
  contato: { type: String, required: true },
  autor: { type: String, required: true },
  userId: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anuncio', AnuncioSchema);
