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

// Rotas de filtro por relacionamentos (MAIS ESPECÍFICAS - devem vir primeiro)
router.get('/aluno/:alunoId', listarPorAlunoId);
router.get('/professor/:professorId', listarPorProfessorId);

// Rotas principais CRUD (MAIS GENÉRICAS - devem vir depois)
router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId); // Esta rota agora será testada DEPOIS das rotas /aluno e /professor
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;