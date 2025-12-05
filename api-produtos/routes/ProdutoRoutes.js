import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { uploadImagem } from '../middlewares/UploadMiddleware.js';

import { authMiddleware, adminMiddleware } from '../middlewares/AuthMiddleware.js';
const router = express.Router();

// CREATE
router.post('/', uploadImagem, ProdutoController.criarProduto);

// READ
router.get('/buscar/nome', ProdutoController.buscarPorNome);
router.get('/buscar/categoria', ProdutoController.buscarPorCategoria);
router.get('/', ProdutoController.listarProdutos);
router.get('/:id', ProdutoController.buscarPorId);

router.options('/registrar', (req, res) => {
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

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-aOrigin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;


/* import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rotas públicas (não precisam de autenticação)
router.get('/', ProdutoController.listarTodos);
router.get('/:id', ProdutoController.buscarPorId);

// Rotas protegidas (precisam de autenticação)
router.post('/', authMiddleware,  uploadImagens.single('imagem'), handleUploadError, ProdutoController.criarProduto);
router.post('/upload', authMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.uploadImagem);
router.put('/:id', authMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.atualizar);
router.delete('/:id', authMiddleware, ProdutoController.excluir);

// Rotas OPTIONS para CORS (preflight requests)


export default router;
 */