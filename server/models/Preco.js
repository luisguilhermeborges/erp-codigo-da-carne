const mongoose = require('mongoose');

// Armazena o mapa completo de preços { codigo: preco }
const PrecoSchema = new mongoose.Schema({
  codigo:     { type: String, required: true, unique: true },
  preco:      { type: Number, required: true },
  atualizadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Preco', PrecoSchema);