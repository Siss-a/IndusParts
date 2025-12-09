import express from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ========== ROTAS DE USUÁRIO ==========
router.post('/checkout', authMiddleware, PedidoController.checkout);
router.get('/', authMiddleware, PedidoController.listarPedidos);
router.get('/:id', authMiddleware, PedidoController.verPedido);

// ========== ROTAS DE ADMIN ==========
router.get('/admin/todos', authMiddleware, adminMiddleware, PedidoController.listarTodos);
router.get('/admin/buscar', authMiddleware, adminMiddleware, PedidoController.buscar);
router.get('/admin/pedidos/${pedidoId}', authMiddleware, adminMiddleware, PedidoController.verDetalhes);

export default router;