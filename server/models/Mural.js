const mongoose = require('mongoose');

const MuralSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  userLogin: { type: String, required: true },
  userName: { type: String, required: true },
  foto: { type: String },
  sonhos: [{
    texto: String,
    realizado: Boolean
  }],
  data: { type: String },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mural', MuralSchema);
