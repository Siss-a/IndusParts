// routes/pedidoRotas.js
import express from "express";
import PedidoController from "../controllers/PedidoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Checkout (cria pedido a partir do carrinho)
router.post("/checkout", PedidoController.checkout);

// Ver pedido
router.get("/:id", PedidoController.verPedido);

export default router;
