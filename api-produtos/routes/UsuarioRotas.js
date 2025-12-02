import express from 'express';
//import UsuarioController from '../controllers/UsuarioController.js';
import ProdutoController from '../controllers/ProdutoController.js';
//import { uploadImagem } from '../middlewares/uploadMiddleware.js';

// Importacão dos middlewares
import { authMiddleware, adminMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

//Rotas de usuários comum
router.get('/produtos', ProdutoController.listarTodos);
router.get('/produtos/:id', ProdutoController.buscarPorId);

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