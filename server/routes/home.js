const express = require('express');
const router  = express.Router();
const Config  = require('../models/Config');
const Mural   = require('../models/Mural');
const Anuncio = require('../models/Anuncio');

// ── CONTATOS ────────────────────────────────────────────────────────────────
router.get('/contatos', async (req, res) => {
  try {
    const config = await Config.findOne({ chave: 'contatos_lojas' });
    res.json(config ? config.valor : []);
  } catch (err) { res.status(500).json({ error: 'Erro ao buscar contatos' }); }
});

router.post('/contatos', async (req, res) => {
  try {
    const config = await Config.findOneAndUpdate(
      { chave: 'contatos_lojas' },
      { valor: req.body, atualizadoEm: new Date() },
      { upsert: true, new: true }
    );
    res.json(config.valor);
  } catch (err) { res.status(400).json({ error: 'Erro ao salvar contatos' }); }
});

// ── MURAL DOS SONHOS ────────────────────────────────────────────────────────
router.get('/mural', async (req, res) => {
  try { res.json(await Mural.find().sort({ criadoEm: -1 })); }
  catch (err) { res.status(500).json({ error: 'Erro ao buscar mural' }); }
});

router.post('/mural', async (req, res) => {
  try {
    const card = await Mural.findOneAndUpdate(
      { userLogin: req.body.userLogin },
      { ...req.body, criadoEm: new Date() },
      { upsert: true, new: true }
    );
    res.json(card);
  } catch (err) { res.status(400).json({ error: 'Erro ao salvar card' }); }
});

router.delete('/mural/:id', async (req, res) => {
  try { await Mural.findOneAndDelete({ id: req.params.id }); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: 'Erro ao apagar card' }); }
});

// ── ANÚNCIOS ───────────────────────────────────────────────────────────────
router.get('/anuncios', async (req, res) => {
  try { res.json(await Anuncio.find().sort({ criadoEm: -1 })); }
  catch (err) { res.status(500).json({ error: 'Erro ao buscar anúncios' }); }
});

router.post('/anuncios', async (req, res) => {
  try {
    const anuncio = new Anuncio(req.body);
    await anuncio.save();
    res.json(anuncio);
  } catch (err) { res.status(400).json({ error: 'Erro ao salvar anúncio' }); }
});

router.delete('/anuncios/:id', async (req, res) => {
  try { await Anuncio.findOneAndDelete({ id: req.params.id }); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: 'Erro ao apagar anúncio' }); }
});

module.exports = router;
