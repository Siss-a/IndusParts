import express from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Criar pedido (usuário precisa estar logado)
router.post("/", authMiddleware, PedidoController.criar);

// Listar os pedidos do usuário logado
router.get("/", authMiddleware, PedidoController.listarDoUsuario);

export default router;
