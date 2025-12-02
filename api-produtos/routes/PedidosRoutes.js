import express from 'express';
import PedidoController from '../controllers/PedidoController.js';

const router = express.Router();

router.post("/", PedidoController.criar);
router.get("/", PedidoController.listarDoUsuario);

export default router;
