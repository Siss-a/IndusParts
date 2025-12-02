import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';

// Importacão dos middlewares
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware, adminMiddleware)


// Rotas de usuários
router.get('/', UsuarioController.listarUsuarios);
router.get('/:id', UsuarioController.buscarUsuario);
router.post('/', UsuarioController.criarUsuario);
router.put('/:id', UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;