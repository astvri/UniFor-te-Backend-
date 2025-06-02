import express from 'express';
import {
  listar,
  criar,
  atualizar,
  deletar,
  buscarPorId,
  login
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/login', login);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;
