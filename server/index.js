const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão com MongoDB (Use o MongoDB Atlas para ficar online)
mongoose.connect('SUA_URL_DO_MONGODB_AQUI')
  .then(() => console.log("MongoDB Conectado!"))
  .catch(err => console.log("Erro ao conectar:", err));

// Rota para buscar dados frescos do usuário (Resolve seu problema de sincronismo)
app.get('/api/usuarios/:login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.params.login });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Rota para salvar/atualizar usuário
app.post('/api/usuarios', async (req, res) => {
  const { login, nome, unidades, cargo, senha } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { login }, 
      { nome, unidades, cargo, senha }, 
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar" });
  }
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));