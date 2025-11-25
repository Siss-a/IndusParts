import express from 'express';
// import AuthController from '../controllers/AuthController.js';
import UsuarioController from '../controllers/UsuarioController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas de usuários (apenas admin)
router.get('/', authMiddleware, adminMiddleware, UsuarioController.listarUsuarios);
router.post('/', authMiddleware, adminMiddleware, UsuarioController.criarUsuario);
router.put('/:id', authMiddleware, adminMiddleware, UsuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, adminMiddleware, UsuarioController.excluirUsuario);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;