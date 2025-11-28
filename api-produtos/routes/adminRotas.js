import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import ProdutoController from '../controllers/ProdutoController.js';

// Importacão dos middlewares
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas de usuários
router.get('/usuarios', authMiddleware, adminMiddleware, UsuarioController.listarUsuarios);
router.post('/usuarios', authMiddleware, adminMiddleware, UsuarioController.criarUsuario);
router.put('/usuarios/:id', authMiddleware, adminMiddleware, UsuarioController.atualizarUsuario);
router.delete('/usuarios/:id', authMiddleware, adminMiddleware, UsuarioController.excluirUsuario);

// Rotas de produtos
router.get('/produtos', authMiddleware, adminMiddleware, ProdutoController.listarTodos);
router.post('/produtos', authMiddleware, adminMiddleware, ProdutoController.criar);
router.put('/produtos/:id', authMiddleware, adminMiddleware, ProdutoController.atualizar);
router.delete('/produtos/:id', authMiddleware, adminMiddleware, ProdutoController.excluir);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/usuarios', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/usuarios/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;