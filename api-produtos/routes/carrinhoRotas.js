import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas do carrinho precisam de autenticação
router.post("/adicionar", authMiddleware, CarrinhoController.adicionar);
router.put("/atualizar", authMiddleware, CarrinhoController.atualizar);
router.delete("/remover/:produtoId", authMiddleware, CarrinhoController.remover);
router.delete("/limpar", authMiddleware, CarrinhoController.limpar);
router.get("/", authMiddleware, CarrinhoController.listar);


export default router;