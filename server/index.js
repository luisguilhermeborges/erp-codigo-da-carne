require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── Conexão MongoDB ──────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado!'))
  .catch(err => console.error('❌ Erro MongoDB:', err));

// ── Models ───────────────────────────────────────────────────────────────────
const User   = require('./models/User');
const Preco  = require('./models/Preco');
const Pedido = require('./models/Pedido');
const Filial = require('./models/Filial');

// ── Rotas modulares ──────────────────────────────────────────────────────────
app.use('/api/precos',   require('./routes/precos'));
app.use('/api/pedidos',  require('./routes/pedidos'));
app.use('/api/filiais',  require('./routes/filiais'));
app.use('/api/estoque',  require('./routes/estoque'));

// ── Rotas de Usuários ────────────────────────────────────────────────────────
app.get('/api/usuarios', async (req, res) => {
  try { res.json(await User.find()); }
  catch (err) { res.status(500).json({ error: 'Erro ao buscar usuários' }); }
});

app.get('/api/usuarios/:login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.params.login });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: 'Erro no servidor' }); }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { login: req.body.login }, req.body,
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) { res.status(400).json({ error: 'Erro ao salvar usuário' }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ error: 'Erro ao apagar usuário' }); }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor ERP CDC na porta ${PORT}`));