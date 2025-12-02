import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// CREATE
router.post('/', upload.single('imagem'), ProdutoController.criarProduto);

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
