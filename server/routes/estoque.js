const express = require('express');
const router = express.Router();
const ItemEstoque = require('../models/ItemEstoque');

// GET /api/estoque/:unidade
router.get('/:unidade', async (req, res) => {
  try {
    const { unidade } = req.params;
    const filtro = unidade === 'TODAS' ? {} : { unidadeAlojamento: unidade };
    const itens = await ItemEstoque.find(filtro).sort({ criadoEm: -1 });
    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar itens do estoque' });
  }
});

// POST /api/estoque/baixa/:id
router.post('/baixa/:id', async (req, res) => {
  try {
    const { qtdAAbater } = req.body;
    const item = await ItemEstoque.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    
    item.qtdAtual = Math.max(0, item.qtdAtual - Number(qtdAAbater));
    await item.save();
    
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao dar baixa no estoque' });
  }
});

// DELETE /api/estoque/:id
router.delete('/:id', async (req, res) => {
  try {
    await ItemEstoque.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar item do estoque' });
  }
});

// DELETE /api/estoque
router.delete('/', async (req, res) => {
  try {
    await ItemEstoque.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao limpar estoque' });
  }
});

module.exports = router;
