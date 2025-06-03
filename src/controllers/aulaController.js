// controllers/aulaController.js
import aulaService from '../services/aulaService.js';

// Listar todas as aulas
export const listar = async (req, res) => {
  try {
    const { data, error } = await aulaService.listarAulas();
    if (error) return res.status(400).json({ erro: error.message });
    return res.status(200).json(data);
  } catch (erro) {
    console.error('Erro ao listar aulas:', erro);
    return res.status(400).json({ erro: erro.message });
  }
};

// Criar uma nova aula
export const criar = async (req, res) => {
  try {
    const { nome, descricao, horario, professor_id, data } = req.body;

    if (!nome || !descricao || !horario || !professor_id || data === undefined) {
      return res.status(400).json({ 
        erro: 'Dados incompletos. Todos os campos são obrigatórios.' 
      });
    }

    const { data: result, error } = await aulaService.criarAula({ 
      nome, 
      descricao, 
      horario, 
      professor_id, 
      data 
    });

    if (error) return res.status(400).json({ erro: error.message });
    return res.status(201).json(result);
  } catch (erro) {
    console.error('Erro ao criar aula:', erro);
    return res.status(400).json({ erro: erro.message });
  }
};

// Atualizar uma aula existente
export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, horario, professor_id, data } = req.body;

    if (nome === undefined && descricao === undefined && horario === undefined &&
        professor_id === undefined && data === undefined) {
      return res.status(400).json({ 
        erro: 'Nenhum dado fornecido para atualização' 
      });
    }

    const { data: result, error } = await aulaService.atualizarAula(id, {
      nome, descricao, horario, professor_id, data
    });

    if (error) return res.status(400).json({ erro: error.message });
    return res.status(200).json(result);
  } catch (erro) {
    console.error('Erro ao atualizar aula:', erro);
    return res.status(400).json({ erro: erro.message });
  }
};

// Remover uma aula existente
export const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await aulaService.deletarAula(id);
    
    if (error) return res.status(400).json({ erro: error.message });
    return res.status(200).json({ mensagem: 'Aula removida com sucesso' });
  } catch (erro) {
    console.error('Erro ao remover aula:', erro);
    return res.status(400).json({ erro: erro.message });
  }
};

// Buscar aula por ID
export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await aulaService.listarAulaPorId(id);
    
    if (error || !data) return res.status(404).json({ erro: 'Aula não encontrada' });
    return res.status(200).json(data);
  } catch (erro) {
    console.error('Erro ao buscar aula:', erro);
    return res.status(404).json({ erro: erro.message });
  }
};

// Listar aulas de um professor específico
export const listarPorProfessor = async (req, res) => {
  try {
    const { professor_id } = req.params;
    const { data, error } = await aulaService.listarAulasPorProfessor(professor_id);
    
    if (error) return res.status(400).json({ erro: error.message });
    return res.status(200).json(data);
  } catch (erro) {
    console.error('Erro ao listar aulas do professor:', erro);
    return res.status(400).json({ erro: erro.message });
  }
};
