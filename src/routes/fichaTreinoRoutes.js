import express from 'express';
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  deletar,
  listarPorAlunoId,
  listarPorProfessorId,
} from '../controllers/fichaTreinoController.js';

const router = express.Router();

router.get('/aluno/:alunoId', listarPorAlunoId);
router.get('/professor/:professorId', listarPorProfessorId);

router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId); 
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;