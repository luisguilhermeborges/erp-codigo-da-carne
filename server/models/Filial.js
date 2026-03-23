const mongoose = require('mongoose');

const FilialSchema = new mongoose.Schema({
  id:        { type: Number, required: true, unique: true },
  codigo:    { type: String, required: true, unique: true },
  nome:      { type: String, required: true },
  cnpj:      String,
  endereco:  String,
});

module.exports = mongoose.model('Filial', FilialSchema);