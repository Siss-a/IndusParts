import express from 'express';
import CarrinhoController from '../controllers/CarrinhoController.js';

const router = express.Router();

router.post("/adicionar", CarrinhoController.adicionar);
router.put("/atualizar", CarrinhoController.atualizar);
router.delete("/remover/:produtoId", CarrinhoController.remover);
router.get("/", CarrinhoController.listar);


export default router;
