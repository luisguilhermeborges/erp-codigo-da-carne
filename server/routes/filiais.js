const express = require('express');
const router  = express.Router();
const Filial  = require('../models/Filial');

// GET /api/filiais
router.get('/', async (req, res) => {
  try {
    res.json(await Filial.find().sort({ codigo: 1 }));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filiais' });
  }
});

// POST /api/filiais — upsert por id
router.post('/', async (req, res) => {
  try {
    const filial = await Filial.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { upsert: true, new: true }
    );
    res.json(filial);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar filial', details: err.message });
  }
});

// POST /api/filiais/sync — recebe array completo e substitui tudo
router.post('/sync', async (req, res) => {
  try {
    const filiais = req.body;
    await Filial.deleteMany({});
    const salvas = await Filial.insertMany(filiais);
    res.json({ ok: true, total: salvas.length });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao sincronizar filiais' });
  }
});

// DELETE /api/filiais/:id
router.delete('/:id', async (req, res) => {
  try {
    await Filial.findOneAndDelete({ id: Number(req.params.id) });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar filial' });
  }
});

module.exports = router;