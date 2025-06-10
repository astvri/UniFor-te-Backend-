import express from 'express';
import {
  listar,
  buscarPorId,
  listarPorAluno,
  agendar,
  deletar
} from '../controllers/agendamentoAulaController.js';

const router = express.Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.get('/aluno/:aluno_id', listarPorAluno);
router.post('/', agendar);
router.delete('/:id', deletar);

export default router;
