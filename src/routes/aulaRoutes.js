import { Router } from 'express';
import {
  listar,
  criar,
  atualizar,
  deletar,
  buscarPorId,
  listarPorProfessor
} from '../controllers/aulaController.js';

const router = Router();

router.get('/', listar);
router.get('/professor/:professor_id', listarPorProfessor);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;
