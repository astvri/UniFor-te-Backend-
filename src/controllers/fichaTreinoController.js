import * as fichaTreinoService from '../services/fichaTreinoService.js';

export const criar = async (req, res) => {
  try {
    const fichaData = req.body;
    
    // Validação dos campos obrigatórios
    if (!fichaData.objetivo) {
      return res.status(400).json({ error: "O objetivo da ficha de treino é obrigatório." });
    }

    const novaFicha = await fichaTreinoService.criarFichaTreino(fichaData);
    if (!novaFicha) {
      return res.status(500).json({ error: "Erro ao criar ficha de treino." });
    }

    res.status(201).json(novaFicha);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

export const listar = async (req, res) => {
  try {
    const fichas = await fichaTreinoService.listarFichasTreino();
    res.json(fichas);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro ao buscar fichas de treino." });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ficha = await fichaTreinoService.buscarFichaTreinoPorId(id);
    
    if (!ficha) {
      return res.status(404).json({ error: "Ficha de treino não encontrada." });
    }
    
    res.json(ficha);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro ao buscar ficha de treino." });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verifica se a ficha existe antes de atualizar
    const fichaExistente = await fichaTreinoService.buscarFichaTreinoPorId(id);
    if (!fichaExistente) {
      return res.status(404).json({ error: "Ficha de treino não encontrada para atualização." });
    }

    const fichaAtualizada = await fichaTreinoService.atualizarFichaTreino(id, updateData);
    if (!fichaAtualizada) {
      return res.status(500).json({ error: "Erro ao atualizar ficha de treino." });
    }

    res.json(fichaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a ficha existe antes de deletar
    const fichaExistente = await fichaTreinoService.buscarFichaTreinoPorId(id);
    if (!fichaExistente) {
      return res.status(404).json({ error: "Ficha de treino não encontrada para exclusão." });
    }

    const deletado = await fichaTreinoService.deletarFichaTreino(id);
    if (!deletado) {
      return res.status(500).json({ error: "Erro ao deletar ficha de treino." });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

// Métodos adicionais para filtros

export const listarPorAlunoId = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const fichas = await fichaTreinoService.listarFichasTreinoPorAlunoId(alunoId);
    res.json(fichas);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro ao buscar fichas por aluno." });
  }
};

export const listarPorProfessorId = async (req, res) => {
  try {
    const { professorId } = req.params;
    const fichas = await fichaTreinoService.listarFichasTreinoPorProfessorId(professorId);
    res.json(fichas);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erro ao buscar fichas por professor." });
  }
};