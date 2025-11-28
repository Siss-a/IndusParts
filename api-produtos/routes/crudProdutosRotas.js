import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ============================================
// ROTAS DO CRUD DE PRODUTOS (ADMIN)
// ============================================

// Todas as rotas aqui requerem autenticação de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/crud-produtos - Listar todos os produtos (com paginação)
router.get('/', ProdutoController.listarTodos);

// GET /api/crud-produtos/:id - Buscar produto específico por ID
router.get('/:id', ProdutoController.buscarPorId);

// POST /api/crud-produtos - Criar novo produto
router.post('/', upload.single('imagem'), ProdutoController.criar);

// PUT /api/crud-produtos/:id - Atualizar produto existente
router.put('/:id', upload.single('imagem'), ProdutoController.atualizar);

// DELETE /api/crud-produtos/:id - Excluir produto
router.delete('/:id', ProdutoController.excluir);

// POST /api/crud-produtos/upload - Upload de imagem para produto específico
router.post('/upload', upload.single('imagem'), ProdutoController.uploadImagem);

export default router;