require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importação dos Modelos
const User = require('./models/User');
// Nota: Se ainda não criou o model de Produto, o código abaixo cria um simples automaticamente
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  id: String,
  nome: { type: String, uppercase: true },
  codigo: String,
  categoria: String,
  unidade: String,
  preco: String,
  status: { type: String, default: 'ATIVO' },
  tags: [String]
}));

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ligação ao MongoDB Atlas
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Conectado com sucesso!"))
  .catch(err => console.error("❌ Erro ao ligar ao MongoDB:", err));

// --- ROTAS DE UTILIZADORES ---

// Procurar todos os utilizadores
app.get('/api/usuarios', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao procurar utilizadores" });
  }
});

// Procurar um utilizador específico pelo login (Para sincronizar permissões no Fazer Pedidos)
app.get('/api/usuarios/:login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.params.login });
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Criar ou Atualizar utilizador (Upsert)
app.post('/api/usuarios', async (req, res) => {
  try {
    const { login } = req.body;
    // O upsert garante que se o login já existir, ele apenas atualiza os dados
    const user = await User.findOneAndUpdate(
      { login }, 
      req.body, 
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Erro ao salvar utilizador", details: err });
  }
});

// Apagar utilizador
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilizador removido" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar" });
  }
});

// --- ROTAS DE PRODUTOS (ESTOQUE) ---

// Listar produtos ativos
app.get('/api/produtos', async (req, res) => {
  try {
    const products = await Product.find({ status: 'ATIVO' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao procurar produtos" });
  }
});

// Salvar ou Atualizar produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findOneAndUpdate(
      { id }, 
      req.body, 
      { upsert: true, new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Erro ao salvar produto" });
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ERP Código da Carne a rodar na porta ${PORT}`);
});