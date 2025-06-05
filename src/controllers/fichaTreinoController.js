import * as fichaTreinoService from '../services/fichaTreinoService.js';

// Função auxiliar para validar e converter ID para inteiro
const validateAndParseId = (id, res, context) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    console.error(`--- ERRO DE VALIDAÇÃO DE ID NO CONTROLLER (${context}): ID inválido '${id}' ---`);
    res.status(400).json({ error: `ID ${context} inválido. Esperado um número inteiro, recebido '${id}'.` });
    return null;
  }
  return parsedId;
};

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

    // Valida e converte o ID para inteiro
    const fichaId = validateAndParseId(id, res, 'buscarPorId Ficha');
    if (fichaId === null) return; // Se a validação falhou, já enviou a resposta de erro

    const ficha = await fichaTreinoService.buscarFichaTreinoPorId(fichaId); // Passa o ID validado

    if (!ficha) {
      return res.status(404).json({ error: "Ficha de treino não encontrada." });
    }

    res.json(ficha);
  } catch (err) {
    console.error(`--- ERRO NO CONTROLLER (buscarPorId Ficha: ${req.params.id}) ---`);
    res.status(500).json({ error: err.message || "Erro ao buscar ficha de treino." });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Valida e converte o ID para inteiro
    const fichaId = validateAndParseId(id, res, 'atualizar Ficha');
    if (fichaId === null) return;

    // Verifica se a ficha existe antes de atualizar
    const fichaExistente = await fichaTreinoService.buscarFichaTreinoPorId(fichaId);
    if (!fichaExistente) {
      return res.status(404).json({ error: "Ficha de treino não encontrada para atualização." });
    }

    const fichaAtualizada = await fichaTreinoService.atualizarFichaTreino(fichaId, updateData);
    if (!fichaAtualizada) {
      return res.status(500).json({ error: "Erro ao atualizar ficha de treino." });
    }

    res.json(fichaAtualizada);
  } catch (err) {
    console.error(`--- ERRO NO CONTROLLER (atualizar Ficha: ${req.params.id}) ---`);
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Valida e converte o ID para inteiro
    const fichaId = validateAndParseId(id, res, 'deletar Ficha');
    if (fichaId === null) return;

    // Verifica se a ficha existe antes de deletar
    const fichaExistente = await fichaTreinoService.buscarFichaTreinoPorId(fichaId);
    if (!fichaExistente) {
      return res.status(404).json({ error: "Ficha de treino não encontrada para exclusão." });
    }

    const deletado = await fichaTreinoService.deletarFichaTreino(fichaId);
    if (!deletado) {
      return res.status(500).json({ error: "Erro ao deletar ficha de treino." });
    }

    res.status(204).send();
  } catch (err) {
    console.error(`--- ERRO NO CONTROLLER (deletar Ficha: ${req.params.id}) ---`);
    res.status(500).json({ error: err.message || "Erro interno do servidor." });
  }
};

// Métodos adicionais para filtros

export const listarPorAlunoId = async (req, res) => {
  try {
    const { alunoId } = req.params;
    // O alunoId é um UUID, então não precisa de parseInt aqui
    // Se aluno_id no DB fosse INTEGER e viesse como UUID do cliente, seria problema.
    const fichas = await fichaTreinoService.listarFichasTreinoPorAlunoId(alunoId);
    res.json(fichas);
  } catch (err) {
    console.error(`--- ERRO NO CONTROLLER (listarPorAlunoId: ${req.params.alunoId}) ---`);
    res.status(500).json({ error: err.message || "Erro ao buscar fichas por aluno." });
  }
};

export const listarPorProfessorId = async (req, res) => {
  try {
    const { professorId } = req.params;
    // O professorId é um UUID, então não precisa de parseInt aqui
    // Se professor_id no DB fosse INTEGER e viesse como UUID do cliente, seria problema.
    const fichas = await fichaTreinoService.listarFichasTreinoPorProfessorId(professorId);
    res.json(fichas);
  } catch (err) {
    console.error(`--- ERRO NO CONTROLLER (listarPorProfessorId: ${req.params.professorId}) ---`);
    res.status(500).json({ error: err.message || "Erro ao buscar fichas por professor." });
  }
};

// A função listarFichasTreinoPorAlunoId abaixo parece ser uma duplicata
// e está no lugar errado (deveria estar em services).
// Deixei-a aqui como você forneceu, mas ela já está no seu fichaTreinoService.js
// e no controller, a chamada correta é para fichaTreinoService.listarFichasTreinoPorAlunoId.
// Se esta for uma nova implementação, ela precisa ser exportada e utilizada.
/*
export const listarFichasTreinoPorAlunoId = async (alunoId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *, // Seleciona todos os campos da ficha de treino
      professor:professores(id, nome), // Exemplo: Traz o ID e nome do professor
      exercicios_ficha_treino( // Exemplo: Se você tem uma tabela intermediária para exercicios da ficha
        exercicio:exercicios(id, nome, descricao, series, repeticoes) // Detalhes dos exercícios
      )
      `
    )
    .eq('aluno_id', alunoId);

  if (error) {
    console.error('Erro ao buscar fichas de treino por aluno ID:', error.message);
    return [];
  }

  // Mapear os dados para o formato que você espera no frontend
  return data.map(f => ({
      id: f.id,
      alunoId: f.aluno_id,
      professorId: f.professor_id,
      dataCriacao: f.data_criacao,
      objetivo: f.objetivo,
      nomeProfessor: f.professor ? f.professor.nome : 'N/A',
      exercicios: f.exercicios_ficha_treino ? f.exercicios_ficha_treino.map(ef => ef.exercicio) : []
  }));
};
*/