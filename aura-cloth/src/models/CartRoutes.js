const express = require('express');
const router = express.Router();
const { Cart } = require('../models'); // Certifique-se de que o caminho está correto

// Rota para buscar itens do carrinho do usuário
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({ where: { userId } });
    res.json(cartItems);
  } catch (error) {
    console.error('Erro ao buscar itens do carrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar itens do carrinho' });
  }
});

// Rota para adicionar item ao carrinho
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    const cartItem = await Cart.create({ userId, productId, quantity });
    res.json(cartItem);
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
  }
});

// Rota para remover item do carrinho
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Cart.destroy({ where: { userId, productId } });
    res.status(204).end();
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover item do carrinho' });
  }
});

module.exports = router;