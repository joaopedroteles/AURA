/*const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM usuarios');
        res.status(200).json(users.rows);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Rota para obter um usuário específico pelo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Rota para atualizar um usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    try {
        const result = await db.query(
            'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
            [nome, email, senha, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Rota para deletar um usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

module.exports = router;*/