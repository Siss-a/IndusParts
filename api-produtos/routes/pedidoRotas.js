import express from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de pedidos precisam de autenticação

// POST /api/pedidos/checkout - Finalizar compra e criar pedido
router.post("/checkout", authMiddleware, PedidoController.checkout);

// GET /api/pedidos - Listar todos os pedidos do usuário logado
router.get("/", authMiddleware, PedidoController.listarPedidos);

// GET /api/pedidos/:id - Ver detalhes de um pedido específico
router.get("/:id", authMiddleware, PedidoController.verPedido);

export default router;