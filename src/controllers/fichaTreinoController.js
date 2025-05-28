import * as fichaTreinoService from '../services/fichaTreinoService.js';


export const criar = async (req, res) => {
  try {
    const fichaData = req.body;
    if (!fichaData.titulo || !fichaData.descricao || !fichaData.exercicios) {
      return res.status(400).json({ error: "Título, descrição e exercícios são obrigatórios." });
    }

    const { data, error } = await fichaTreinoService.createFichaTreino(fichaData);
    if (error) return res.status(500).json({ error: error.message || "Erro ao criar ficha de treino." });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

export const listar = async (req, res) => {
  const { data, error } = await fichaTreinoService.getAllFichasTreino();
  if (error) return res.status(500).json({ error: error.message || "Erro ao buscar fichas de treino." });
  res.json(data);
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await fichaTreinoService.getFichaTreinoById(id);
  if (error) return res.status(500).json({ error: error.message || "Erro ao buscar ficha." });
  if (!data) return res.status(404).json({ error: "Ficha de treino não encontrada." });
  res.json(data);
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await fichaTreinoService.updateFichaTreino(id, req.body);
    if (error) return res.status(500).json({ error: error.message || "Erro ao atualizar ficha de treino." });
    if (!data) {
      // Verifica se existe antes de retornar erro genérico
      const { data: exists } = await fichaTreinoService.getFichaTreinoById(id);
      if (!exists) return res.status(404).json({ error: "Ficha de treino não encontrada para atualização." });
      return res.status(500).json({ error: "Erro ao atualizar ficha de treino." });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  try {
    const { data: exists, error: errExist } = await fichaTreinoService.getFichaTreinoById(id);
    if (errExist) return res.status(500).json({ error: errExist.message || "Erro ao verificar ficha." });
    if (!exists) return res.status(404).json({ error: "Ficha de treino não encontrada para exclusão." });

    const { error } = await fichaTreinoService.deleteFichaTreino(id);
    if (error) return res.status(500).json({ error: error.message || "Erro ao deletar ficha de treino." });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

// Métodos adicionais para filtros

export const listarPorAlunoId = async (req, res) => {
  const { alunoId } = req.params;
  const { data, error } = await fichaTreinoService.getFichasTreinoByAlunoId(alunoId);
  if (error) return res.status(500).json({ error: error.message || "Erro ao buscar fichas por aluno." });
  res.json(data);
};

export const listarPorProfessorId = async (req, res) => {
  const { professorId } = req.params;
  const { data, error } = await fichaTreinoService.getFichasTreinoByProfessorId(professorId);
  if (error) return res.status(500).json({ error: error.message || "Erro ao buscar fichas por professor." });
  res.json(data);
};
