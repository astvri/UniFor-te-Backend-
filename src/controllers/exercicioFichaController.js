
import * as exercicioFichaService from '../services/exercicioFichaService.js';
import { validate as uuidValidate } from 'uuid';

const isValidUuidOrNull = (uuid) => {
  if (uuid === null || uuid === undefined) {
    return true; 
  }
  return uuidValidate(uuid);
};

export const criar = async (req, res) => {
  try {
    const fichaData = req.body;
    const camposObrigatoriosFicha = ['nome_treino', 'professor_nome'];

    for (const campo of camposObrigatoriosFicha) {
      if (!fichaData[campo]) {
        return res.status(400).json({ error: `Campo obrigatório da ficha ausente: ${campo}` });
      }
    }

    if (fichaData.aluno_id !== undefined && !isValidUuidOrNull(fichaData.aluno_id)) {
      return res.status(400).json({ error: 'O campo aluno_id, se fornecido, deve ser um UUID válido.' });
    }

    if (fichaData.exercicios) {
      if (!Array.isArray(fichaData.exercicios)) {
        return res.status(400).json({ error: 'O campo exercicios deve ser um array' });
      }
      
      const camposObrigatoriosExercicio = ['exercicios_id', 'series', 'repeticoes'];
      for (const [index, exercicio] of fichaData.exercicios.entries()) {
        for (const campo of camposObrigatoriosExercicio) {
          if (exercicio[campo] === undefined || exercicio[campo] === null || exercicio[campo] === '') {
            return res.status(400).json({ error: `Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index}` });
          }
        }
        if (typeof exercicio.exercicios_id !== 'number') {
            return res.status(400).json({ error: `Campo 'exercicios_id' deve ser um número no exercício índice ${index}` });
        }
      }
    }


    const data = await exercicioFichaService.criarExercicioFicha(fichaData);

    res.status(201).json(data);
  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (criar Ficha) ---');
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const listar = async (req, res) => {
  try {
    const data = await exercicioFichaService.listarExerciciosFicha();
    res.json(data);
  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (listar Ficha) ---');
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!data) {
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada.' });
    }
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (buscarPorId Ficha: ${id}) ---`);
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!existente) {
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada para atualização.' });
    }

    const fichaData = req.body;

    if (fichaData.aluno_id !== undefined && !isValidUuidOrNull(fichaData.aluno_id)) {
      return res.status(400).json({ error: 'O campo aluno_id, se fornecido, deve ser um UUID válido ou null.' });
    }
        if (fichaData.exercicios !== undefined) { // Apenas validar se o array foi explicitamente enviado
      if (!Array.isArray(fichaData.exercicios)) {
        return res.status(400).json({ error: 'O campo exercicios deve ser um array' });
      }
      const camposObrigatoriosExercicio = ['exercicios_id', 'series', 'repeticoes'];
      for (const [index, exercicio] of fichaData.exercicios.entries()) {
         for (const campo of camposObrigatoriosExercicio) {
          if (exercicio[campo] === undefined || exercicio[campo] === null || exercicio[campo] === '') {
            return res.status(400).json({ error: `Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index} da atualização` });
          }
        }
        if (typeof exercicio.exercicios_id !== 'number') {
            return res.status(400).json({ error: `Campo 'exercicios_id' deve ser um número no exercício índice ${index}` });
        }
      }
    }

    const data = await exercicioFichaService.atualizarExercicioFicha(id, fichaData);
    
    res.json(data);

  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (atualizar Ficha: ${id}) ---`);
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  try {
    const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!existente) {
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada para exclusão.' });
    }

    const sucesso = await exercicioFichaService.deletarExercicioFicha(id);
    if (!sucesso) {
      return res.status(500).json({ error: 'Erro ao deletar ficha de exercícios.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (deletar Ficha: ${id}) ---`);
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

// Listar fichas por professor
export const listarPorProfessor = async (req, res) => {
  const { professorNome } = req.params;
  try {
    const data = await exercicioFichaService.listarFichasPorProfessor(professorNome);
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (listarPorProfessor Ficha: ${professorNome}) ---`);
    console.error('Mensagem:', err.message);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

