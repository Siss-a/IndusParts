// routes/carrinhoRotas.js
import express from "express";
import CarrinhoController from "../controllers/CarrinhoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Ver carrinho
router.get("/", CarrinhoController.verCarrinho);

// Adicionar item
router.post("/item", CarrinhoController.adicionarItem);

// Atualizar quantidade
router.put("/item/:id_item", CarrinhoController.atualizarQuantidade);

// Remover item
router.delete("/item/:id_item", CarrinhoController.removerItem);

// Limpar carrinho
router.delete("/", CarrinhoController.limparCarrinho);

export default router;
