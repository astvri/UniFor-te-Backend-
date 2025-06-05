import express from 'express';
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
  buscarPorNome,
} from '../controllers/exerciciosController.js';

const router = express.Router();

// Rotas principais
router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

// Rotas adicionais
router.get('/nome/:nome', buscarPorNome);

export default router;

