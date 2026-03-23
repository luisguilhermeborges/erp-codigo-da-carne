const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id:          String,
  codigo:      String,
  nome:        String,
  unidade:     String,
  categoria:   String,
  tags:        [String],
  preco:       mongoose.Schema.Types.Mixed,
  prioridade:  Number,
  qtd:         mongoose.Schema.Types.Mixed,
  qtdEnviada:  mongoose.Schema.Types.Mixed,
  atendido:    Boolean,
  motivo:      String,
}, { _id: false, strict: false });

const PedidoSchema = new mongoose.Schema({
  idExterno:       { type: String, required: true, unique: true },
  filial:          String,
  cliente:         String,
  unidadeOrigem:   String,
  destino:         String,
  usuario:         String,
  data:            String,
  tipo:            { type: String, enum: ['PEDIDO_LOJA','TRANSFERENCIA_AVULSA'], default: 'PEDIDO_LOJA' },
  status:          { type: String, enum: ['Pendente','Finalizado'], default: 'Pendente' },
  itens:           [ItemSchema],
  dataAtendimento: String,
  atendidoPor:     String,
  criadoEm:        { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Pedido', PedidoSchema);