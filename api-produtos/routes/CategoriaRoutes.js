import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';

const router = express.Router();

router.post('/', CategoriaController.criar);
router.get('/', CategoriaController.listar);
router.get('/:id', CategoriaController.buscar);
router.put('/:id', CategoriaController.atualizar);
router.delete('/:id', CategoriaController.excluir);

export default router;
