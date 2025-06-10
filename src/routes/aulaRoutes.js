import express from 'express';
import {
  listar,
  criar,
  atualizar,
  deletar,
  buscarPorId,
  listarPorProfessor,
  listarAulasComProfessor
} from '../controllers/aulaController.js';

const router = express.Router();

router.get('/', listar);
router.get('/professor/:professor_id', listarPorProfessor);
router.get('/com-professor', listarAulasComProfessor);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);


export default router;
