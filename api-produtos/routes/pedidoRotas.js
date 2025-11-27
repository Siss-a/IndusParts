// routes/pedidoRotas.js
import express from "express";
import PedidoController from "../controllers/PedidoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


// Checkout (cria pedido a partir do carrinho)
router.post("/checkout", authMiddleware, PedidoController.checkout);

// Ver pedido
router.get("/:id", authMiddleware, PedidoController.verPedido);


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
