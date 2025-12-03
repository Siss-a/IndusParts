import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
//import { authMiddleware } from '../middlewares/authMiddleware.js';
//import { uploadImagem } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/usuarios', authMiddleware, adminMiddleware, UsuarioController.criarUsuario);
router.get('/usuarios/:id', authMiddleware, adminMiddleware, UsuarioController.buscarUsuario);
router.get('/usuarios', authMiddleware, adminMiddleware, UsuarioController.listarUsuarios);
router.put('/usuarios/:id', authMiddleware, adminMiddleware, UsuarioController.atualizarUsuario);
router.delete('/usuarios/:id', authMiddleware, adminMiddleware, UsuarioController.excluirUsuario);

// Perfil do usuário logado
router.get('/auth/perfil', authMiddleware, UsuarioController.obterPerfil);

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

router.options('/produtos', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});


router.options('/upload', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});


router.options('/produtos/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;