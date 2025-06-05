
import * as exercicioFichaService from '../services/exercicioFichaService.js';

export const criar = async (req, res) => {
  console.log('[Controller] Recebida requisição para criar ficha:', req.body);
  try {
    const fichaData = req.body;
    const camposObrigatoriosFicha = ['nome_treino', 'professor_nome'];

    for (const campo of camposObrigatoriosFicha) {
      if (!fichaData[campo]) {
        console.warn(`[Controller] Campo obrigatório da ficha ausente: ${campo}`);
        return res.status(400).json({ error: `Campo obrigatório da ficha ausente: ${campo}` });
      }
    }

    // Validar estrutura dos exercícios se fornecidos
    if (fichaData.exercicios) {
      if (!Array.isArray(fichaData.exercicios)) {
        console.warn('[Controller] Campo exercicios não é um array');
        return res.status(400).json({ error: 'O campo exercicios deve ser um array' });
      }
      
      const camposObrigatoriosExercicio = ['exercicios_id', 'series', 'repeticoes']; // Ajustado para exercicios_id
      for (const [index, exercicio] of fichaData.exercicios.entries()) {
        for (const campo of camposObrigatoriosExercicio) {
          if (exercicio[campo] === undefined || exercicio[campo] === null || exercicio[campo] === '') { // Checar ausência ou vazio
            console.warn(`[Controller] Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index}`);
            return res.status(400).json({ error: `Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index}` });
          }
        }
      }
    }

    console.log('[Controller] Chamando exercicioFichaService.criarExercicioFicha...');
    const data = await exercicioFichaService.criarExercicioFicha(fichaData);
    console.log('[Controller] Retorno de criarExercicioFicha:', data);


    res.status(201).json(data);
  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (criar) ---');
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);

    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } // Enviar código do erro se disponível
    });
  }
};

export const listar = async (req, res) => {
  console.log('[Controller] Recebida requisição para listar fichas');
  try {
    console.log('[Controller] Chamando exercicioFichaService.listarExerciciosFicha...');
    const data = await exercicioFichaService.listarExerciciosFicha();
    console.log('[Controller] Retorno de listarExerciciosFicha:', data ? `${data.length} fichas` : 'array vazio');
    res.json(data);
  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (listar) ---');
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);
    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller] Recebida requisição para buscar ficha por ID: ${id}`);
  try {
    console.log(`[Controller] Chamando exercicioFichaService.buscarExercicioFichaPorId(${id})...`);
    const data = await exercicioFichaService.buscarExercicioFichaPorId(id);
    console.log(`[Controller] Retorno de buscarExercicioFichaPorId(${id}):`, data ? 'Encontrado' : 'Não encontrado');
    if (!data) {
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada.' });
    }
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (buscarPorId: ${id}) ---`);
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);
    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller] Recebida requisição para atualizar ficha ID: ${id}`, req.body);
  try {
   
    const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!existente) {
      console.warn(`[Controller] Ficha ID: ${id} não encontrada para atualização.`);
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada para atualização.' });
    }

    const fichaData = req.body;
    
    if (fichaData.exercicios) {
      if (!Array.isArray(fichaData.exercicios)) {
        console.warn('[Controller] Campo exercicios não é um array na atualização');
        return res.status(400).json({ error: 'O campo exercicios deve ser um array' });
      }
      const camposObrigatoriosExercicio = ['exercicios_id', 'series', 'repeticoes'];
      for (const [index, exercicio] of fichaData.exercicios.entries()) {
         for (const campo of camposObrigatoriosExercicio) {
          if (exercicio[campo] === undefined || exercicio[campo] === null || exercicio[campo] === '') {
            console.warn(`[Controller] Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index} da atualização`);
            return res.status(400).json({ error: `Campo obrigatório '${campo}' ausente ou vazio no exercício índice ${index} da atualização` });
          }
        }
      }
    }

    console.log(`[Controller] Chamando exercicioFichaService.atualizarExercicioFicha(${id})...`);
    const data = await exercicioFichaService.atualizarExercicioFicha(id, fichaData);
    console.log(`[Controller] Retorno de atualizarExercicioFicha(${id}):`, data ? 'Atualizado' : 'Erro na atualização');
    
    res.json(data);

  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (atualizar: ${id}) ---`);
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);
    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller] Recebida requisição para deletar ficha ID: ${id}`);
  try {
    const existente = await exercicioFichaService.buscarExercicioFichaPorId(id);
    if (!existente) {
      console.warn(`[Controller] Ficha ID: ${id} não encontrada para exclusão.`);
      return res.status(404).json({ error: 'Ficha de exercícios não encontrada para exclusão.' });
    }

    console.log(`[Controller] Chamando exercicioFichaService.deletarExercicioFicha(${id})...`);
    const sucesso = await exercicioFichaService.deletarExercicioFicha(id);
    console.log(`[Controller] Retorno de deletarExercicioFicha(${id}):`, sucesso);
    if (!sucesso) {
      console.error(`[Controller] Erro ao deletar ficha ID: ${id}: serviço retornou false inesperadamente`);
      return res.status(500).json({ error: 'Erro ao deletar ficha de exercícios.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (deletar: ${id}) ---`);
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);
    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

// Listar fichas por professor
export const listarPorProfessor = async (req, res) => {
  const { professorNome } = req.params;
  console.log(`[Controller] Recebida requisição para listar fichas do professor: ${professorNome}`);
  try {
    console.log(`[Controller] Chamando exercicioFichaService.listarFichasPorProfessor(${professorNome})...`);
    const data = await exercicioFichaService.listarFichasPorProfessor(professorNome);
    console.log(`[Controller] Retorno de listarFichasPorProfessor(${professorNome}):`, data ? `${data.length} fichas` : 'array vazio');
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (listarPorProfessor: ${professorNome}) ---`);
    console.error('Mensagem:', err.message);
    console.error('Stack Trace:\n', err.stack);
    if (err.code) console.error('Código do Erro (Supabase?):', err.code);
    if (err.details) console.error('Detalhes do Erro (Supabase?):', err.details);
    if (err.hint) console.error('Hint (Supabase?):', err.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(err, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

