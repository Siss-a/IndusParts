import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas do carrinho precisam de autenticação
// O usuário deve estar logado para gerenciar seu carrinho

// GET /carrinho - Ver itens do carrinho do usuário logado
router.get('/', authMiddleware, CarrinhoController.verCarrinho);

// POST /carrinho/item - Adicionar item ao carrinho
// Body: { id_produto, quantidade }
router.post('/item', authMiddleware, CarrinhoController.adicionarItem);

// PUT /carrinho/item/:id_item - Atualizar quantidade de um item
// Body: { quantidade }
router.put('/item/:id_item', authMiddleware, CarrinhoController.atualizarQuantidade);

// DELETE /carrinho/item/:id_item - Remover item específico do carrinho
router.delete('/item/:id_item', authMiddleware, CarrinhoController.removerItem);

// DELETE /carrinho - Limpar carrinho inteiro do usuário
router.delete('/', authMiddleware, CarrinhoController.limparCarrinho);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/item', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/item/:id_item', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;