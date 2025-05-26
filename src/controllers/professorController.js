import * as professorService from '../services/professorService.js';

export const listar = async (req, res) => {
  const { data, error } = await professorService.listarProfessores();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const criar = async (req, res) => {
  try {
    const { data, error } = await professorService.criarProfessor(req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const atualizar = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const { data, error } = await professorService.atualizarProfessor(id_usuario, req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletar = async (req, res) => {
  const { id_usuario } = req.params;
  const { error } = await professorService.deletarProfessor(id_usuario);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};


export const buscarPorId = async (req, res) => {
  const { id_usuario } = req.params;
  const { data, error } = await professorService.listarProfessorPorId(id_usuario);
  if (error) return res.status(404).json({ error: 'Professor não encontrado' });
  res.json(data);
};
