import express from 'express';
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar
} from '../controllers/agendamentoAulaController.js';

const router = express.Router();

router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;
