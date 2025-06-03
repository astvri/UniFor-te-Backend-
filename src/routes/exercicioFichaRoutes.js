import express from 'express';
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
  listarPorFichaId,
} from '../controllers/exercicioFichaController.js';

const router = express.Router();

// Rotas principais
router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

// Rota adicional para listar exercícios por ficha_id
router.get('/ficha/:fichaId', listarPorFichaId);

export default router;
