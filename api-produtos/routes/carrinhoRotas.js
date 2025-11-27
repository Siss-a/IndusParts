// routes/carrinhoRotas.js
import express from "express";
import CarrinhoController from "../controllers/CarrinhoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//TODAS AS ROTAS PRECISAM DE AUTENTICAÇÃO

// Ver carrinho
router.get("/",authMiddleware, CarrinhoController.verCarrinho);

// Adicionar item
router.post("/item", authMiddleware, CarrinhoController.adicionarItem);
router.post("/add", authMiddleware, CarrinhoController.adicionar);

// Atualizar quantidade
router.put("/item/:id_item", authMiddleware, CarrinhoController.atualizarQuantidade);

// Remover item
router.delete("/item/:id_item", authMiddleware, CarrinhoController.removerItem);

// Limpar carrinho
router.delete("/", authMiddleware, CarrinhoController.limparCarrinho);

//NÃO SEI SE REALMENTE PRECISA DESSA PARTE
// rota raiz
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

// rota dinâmica com id
router.options('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});


export default router;
