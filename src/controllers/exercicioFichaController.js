import * as exercicioFichaService from '../services/exercicioFichaService.js';

export const criar = async (req, res) => {
  try {
    const exercicioData = req.body;
    const camposObrigatorios = ['ficha_id', 'nome_exercicio', 'series', 'repeticoes'];

    for (const campo of camposObrigatorios) {
      if (!exercicioData[campo]) {
        return res.status(400).json({ error: `Campo obrigatório ausente: ${campo}` });
      }
    }

    const data = await exercicioFichaService.criarExercicioFicha(exercicioData);
    if (!data) {
      return res.status(500).json({ error: 'Erro ao criar exercício da ficha.' });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro interno do servidor.' });
  }
};

export const listar = async (req, res) => {
  const data = await exercicioFichaService.listarExerciciosFicha();
  res.json(data);
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const data = await exercicioFichaService.buscarExercicioFichaPorId(id);
  if (!data) {
    return res.status(404).json({ error: 'Exercício da ficha não encontrado.' });
  }
  res.json(data);
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await exercicioFichaService.atualizarExercicioFicha(id, req.body);
    if (!data) {
      const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
      if (!existente) {
        return res.status(404).json({ error: 'Exercício da ficha não encontrado para atualização.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar exercício da ficha.' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro interno do servidor.' });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  try {
    const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!existente) {
      return res.status(404).json({ error: 'Exercício da ficha não encontrado para exclusão.' });
    }

    const sucesso = await exercicioFichaService.deletarExercicioFicha(id);
    if (!sucesso) {
      return res.status(500).json({ error: 'Erro ao deletar exercício da ficha.' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro interno do servidor.' });
  }
};

export const listarPorFichaId = async (req, res) => {
  const { fichaId } = req.params;
  const data = await exercicioFichaService.listarExerciciosPorFichaId(fichaId);
  res.json(data);
};
