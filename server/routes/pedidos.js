const express = require('express');
const router  = express.Router();
const Pedido  = require('../models/Pedido');

// GET /api/pedidos/fila — pedidos pendentes (fila de atendimento)
router.get('/fila', async (req, res) => {
  try {
    const fila = await Pedido.find({ status: 'Pendente' }).sort({ criadoEm: 1 });
    res.json(fila);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar fila' });
  }
});

// GET /api/pedidos/historico — pedidos finalizados
router.get('/historico', async (req, res) => {
  try {
    const hist = await Pedido.find({ status: 'Finalizado' }).sort({ criadoEm: -1 });
    res.json(hist);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

// GET /api/pedidos/todos — todos (para admin)
router.get('/todos', async (req, res) => {
  try {
    const todos = await Pedido.find().sort({ criadoEm: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// GET /api/pedidos/para-receber?destino=XXX — transferências pendentes para uma unidade
router.get('/para-receber', async (req, res) => {
  try {
    const { destino } = req.query;
    if (!destino) return res.status(400).json({ error: 'Parâmetro destino obrigatório' });

    // O destino pode ser o código (ex: "001") ou o nome completo (ex: "001 - CENTRO")
    const codigoDestino = destino.split(' - ')[0]?.trim();
    const pendentes = await Pedido.find({
      tipo: 'TRANSFERENCIA_AVULSA',
      status: 'Pendente',
      $or: [
        { destino: destino },
        { destino: codigoDestino },
      ]
    }).sort({ criadoEm: -1 });

    res.json(pendentes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar transferências para receber' });
  }
});

// POST /api/pedidos — criar pedido ou transferência
router.post('/', async (req, res) => {
  try {
    const dados = req.body;
    const pedido = await Pedido.findOneAndUpdate(
      { idExterno: String(dados.id || dados.idExterno) },
      {
        idExterno:     String(dados.id || dados.idExterno),
        filial:        dados.filial,
        cliente:       dados.cliente,
        unidadeOrigem: dados.unidadeOrigem,
        destino:       dados.destino,
        usuario:       dados.usuario,
        data:          dados.data,
        tipo:          dados.tipo || 'PEDIDO_LOJA',
        status:        dados.status || 'Pendente',
        itens:         dados.itens || [],
      },
      { upsert: true, new: true }
    );
    res.json(pedido);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar pedido', details: err.message });
  }
});

// PUT /api/pedidos/:id/finalizar — marcar como finalizado (atendimento)
router.put('/:id/finalizar', async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndUpdate(
      { idExterno: req.params.id },
      {
        status:          'Finalizado',
        itens:           req.body.itens,
        dataAtendimento: req.body.dataAtendimento,
        atendidoPor:     req.body.atendidoPor,
      },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao finalizar pedido' });
  }
});

// PUT /api/pedidos/:id/receber — confirmar recebimento pelo comercial
router.put('/:id/receber', async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndUpdate(
      { idExterno: req.params.id },
      {
        status:          'Recebido',
        itens:           req.body.itens,
        dataRecebimento: req.body.dataRecebimento,
        recebidoPor:     req.body.recebidoPor,
      },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao confirmar recebimento' });
  }
});

// DELETE /api/pedidos/:id — apagar pedido (admin/master)
router.delete('/:id', async (req, res) => {
  try {
    await Pedido.findOneAndDelete({ idExterno: req.params.id });
    res.json({ ok: true, message: 'Pedido removido' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar pedido' });
  }
});

// DELETE /api/pedidos — apagar todos (admin/master)
router.delete('/', async (req, res) => {
  try {
    const { status } = req.query; // ?status=Finalizado ou ?status=Pendente
    const filtro = status ? { status } : {};
    const result = await Pedido.deleteMany(filtro);
    res.json({ ok: true, removidos: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao limpar pedidos' });
  }
});

module.exports = router;