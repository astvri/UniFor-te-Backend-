import express from 'express';
import {
  listar,
  criar,
  atualizar,
  deletar,
  buscarPorId,
} from '../controllers/alunoController.js';

const router = express.Router();

router.get('/', listar);
router.get('/:id_usuario', buscarPorId);
router.post('/', criar);
router.put('/:id_usuario', atualizar);
router.delete('/:id_usuario', deletar);

export default router;
