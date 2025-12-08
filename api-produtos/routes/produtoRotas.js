import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProdutoController.listarProdutos);
router.get('/categoria/:categoria', ProdutoController.buscarPorCategoria);
router.get('/:id', ProdutoController.buscarPorId);


// Rotas protegidas (precisam de autenticação)
router.post('/', authMiddleware, adminMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.criarProduto);
router.put('/atualizar/:id', /* authMiddleware, adminMiddleware, */ uploadImagens.single('imagem'), handleUploadError, ProdutoController.atualizarProduto)
router.delete('/excluir/:id', authMiddleware, ProdutoController.excluirProduto);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;