const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  senha: { type: String, default: '' },
  primeiroAcesso: { type: Boolean, default: true },
  cargo: { type: String, enum: ['adm', 'comercial', 'pcp', 'estoque', 'producao', 'dev'], default: 'comercial' },
  unidades: [{ type: String }] // Array de nomes das filiais autorizadas
});

module.exports = mongoose.model('User', UserSchema);
