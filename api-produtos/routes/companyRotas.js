import express from 'express';
import CompanyController from '../controllers/CompanyController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas (visualização)
router.get('/', authMiddleware, CompanyController.listarTodos);
router.get('/:id', authMiddleware, CompanyController.buscarPorId);
router.get('/:id/users', authMiddleware, CompanyController.buscarUsuarios);
router.get('/:id/addresses', authMiddleware, CompanyController.buscarEnderecos);

// Rotas protegidas (apenas admin pode criar/editar/excluir)
router.post('/', authMiddleware, adminMiddleware, CompanyController.criar);
router.put('/:id', authMiddleware, adminMiddleware, CompanyController.atualizar);
router.delete('/:id', authMiddleware, adminMiddleware, CompanyController.excluir);

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

router.options('/:id/users', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

router.options('/:id/addresses', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

export default router;