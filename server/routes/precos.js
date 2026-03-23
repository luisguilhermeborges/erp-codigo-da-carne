const express = require('express');
const router  = express.Router();
const Preco   = require('../models/Preco');

// GET /api/precos — retorna mapa { codigo: preco }
router.get('/', async (req, res) => {
  try {
    const lista = await Preco.find();
    const mapa  = {};
    lista.forEach(p => { mapa[p.codigo] = p.preco; });
    res.json(mapa);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar preços' });
  }
});

// POST /api/precos/importar — recebe { "44315": 279.8, ... } e faz upsert em massa
router.post('/importar', async (req, res) => {
  try {
    const mapa = req.body; // { codigo: preco }
    const ops  = Object.entries(mapa).map(([codigo, preco]) => ({
      updateOne: {
        filter: { codigo },
        update: { $set: { codigo, preco: Number(preco), atualizadoEm: new Date() } },
        upsert: true,
      }
    }));
    if (ops.length === 0) return res.json({ ok: true, atualizados: 0 });
    const result = await Preco.bulkWrite(ops);
    res.json({ ok: true, atualizados: result.upsertedCount + result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao importar preços', details: err.message });
  }
});

module.exports = router;