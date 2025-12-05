import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas do carrinho precisam de autenticação
router.post("/adicionar", authMiddleware, CarrinhoController.adicionar);
router.put("/atualizar", authMiddleware, CarrinhoController.atualizar);
router.delete("/remover/:produtoId", authMiddleware, CarrinhoController.remover);
router.get("/", authMiddleware, CarrinhoController.listar);

// Rotas OPTIONS para CORS (preflight requests) - CORRIGIDAS
router.options('/adicionar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/atualizar', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/remover/:produtoId', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;