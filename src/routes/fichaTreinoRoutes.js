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

// Rotas principais CRUD
router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

// Rotas de filtro por relacionamentos
router.get('/aluno/:alunoId', listarPorAlunoId);
router.get('/professor/:professorId', listarPorProfessorId);

export default router;