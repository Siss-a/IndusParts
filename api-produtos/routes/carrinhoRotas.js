import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';
/* import */
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/adicionar", authMiddleware, CarrinhoController.adicionar);
router.put("/atualizar", authMiddleware, CarrinhoController.atualizar);
router.delete("/remover/:produtoId", authMiddleware, CarrinhoController.remover);
router.delete("/limpar", authMiddleware, CarrinhoController.limpar);
router.get("/", authMiddleware, CarrinhoController.listar);
router.get("/count", authMiddleware, CarrinhoController.count);

export default router;