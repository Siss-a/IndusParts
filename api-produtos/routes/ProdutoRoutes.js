import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { uploadImagem } from '../middlewares/UploadMiddleware.js';

const router = express.Router();

// CREATE
router.post('/', uploadImagem.single('imagem'), ProdutoController.criarProduto);

// READ
router.get('/buscar/nome', ProdutoController.buscarPorNome);
router.get('/buscar/categoria', ProdutoController.buscarPorCategoria);
router.get('/', ProdutoController.listarProdutos);
router.get('/:id', ProdutoController.buscarProduto);

// UPDATE
router.put('/:id', ProdutoController.atualizarProduto);

// DELETE
router.delete('/:id', ProdutoController.excluirProduto);

export default router;
