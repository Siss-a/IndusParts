import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import cors from 'cors';

const router = express.Router();

// Todas as rotas do carrinho precisam de autenticação
// O usuário deve estar logado para gerenciar seu carrinho

router.use(cors({
    origin: '*', // em produção, coloque o domínio do frontend
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

router.post("/adicionar",authMiddleware, CarrinhoController.adicionar);
router.put("/atualizar",authMiddleware, CarrinhoController.atualizar);
router.delete("/remover/:produtoId",authMiddleware, CarrinhoController.remover);
router.get("/",authMiddleware, CarrinhoController.listar);

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