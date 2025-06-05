
import * as exercicioService from '../services/exercicioService.js';

export const criar = async (req, res) => {
  console.log('[Controller][Exercicio] Recebida requisição para criar exercício:', req.body);
  try {
    const exercicioData = req.body;
    const camposObrigatorios = ['nome']; 

    for (const campo of camposObrigatorios) {
      if (exercicioData[campo] === undefined || exercicioData[campo] === null || exercicioData[campo] === '') {
        console.warn(`[Controller][Exercicio] Campo obrigatório ausente ou vazio: ${campo}`);
        return res.status(400).json({ error: `Campo obrigatório ausente ou vazio: ${campo}` });
      }
    }

    if (typeof exercicioData.nome !== 'string') {
      return res.status(400).json({ error: 'O campo nome deve ser texto.' });
    }
    if (exercicioData.maquina !== undefined && exercicioData.maquina !== null && typeof exercicioData.maquina !== 'string') {
      return res.status(400).json({ error: 'O campo maquina deve ser texto.' });
    }

    console.log('[Controller][Exercicio] Chamando exercicioService.criarExercicio...');
    const data = await exercicioService.criarExercicio({ 
      nome: exercicioData.nome, 
      maquina: exercicioData.maquina 
    });
    console.log('[Controller][Exercicio] Retorno de criarExercicio:', data);

    res.status(201).json(data);

  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (criar Exercicio) ---');
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

export const listar = async (req, res) => {
  console.log('[Controller][Exercicio] Recebida requisição para listar exercícios');
  try {
    console.log('[Controller][Exercicio] Chamando exercicioService.listarExercicios...');
    const data = await exercicioService.listarExercicios();
    console.log('[Controller][Exercicio] Retorno de listarExercicios:', data ? `${data.length} exercícios` : 'array vazio');
    res.json(data);
  } catch (err) {
    console.error('\n--- ERRO DETALHADO NO CONTROLLER (listar Exercicio) ---');
    // ... (logs detalhados)
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller][Exercicio] Recebida requisição para buscar exercício por ID: ${id}`);
  try {
    console.log(`[Controller][Exercicio] Chamando exercicioService.buscarExercicioPorId(${id})...`);
    const data = await exercicioService.buscarExercicioPorId(id);
    console.log(`[Controller][Exercicio] Retorno de buscarExercicioPorId(${id}):`, data ? 'Encontrado' : 'Não encontrado');
    if (!data) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (buscarPorId Exercicio: ${id}) ---`);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller][Exercicio] Recebida requisição para atualizar exercício ID: ${id}`, req.body);
  try {
    const existente = await exercicioService.buscarExercicioPorId(id);
    if (!existente) {
      console.warn(`[Controller][Exercicio] Exercício ID: ${id} não encontrado para atualização.`);
      return res.status(404).json({ error: 'Exercício não encontrado para atualização.' });
    }

    const exercicioData = req.body;
    
    if (exercicioData.nome !== undefined && (typeof exercicioData.nome !== 'string' || exercicioData.nome.trim() === '')) {
      return res.status(400).json({ error: 'O campo nome deve ser texto não vazio.' });
    }
    if (exercicioData.maquina !== undefined && exercicioData.maquina !== null && typeof exercicioData.maquina !== 'string') {
      return res.status(400).json({ error: 'O campo maquina deve ser texto.' });
    }

    console.log(`[Controller][Exercicio] Chamando exercicioService.atualizarExercicio(${id})...`);
    const data = await exercicioService.atualizarExercicio(id, { 
      nome: exercicioData.nome, 
      maquina: exercicioData.maquina 
    });
    console.log(`[Controller][Exercicio] Retorno de atualizarExercicio(${id}):`, data);
    
    res.json(data); 

  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (atualizar Exercicio: ${id}) ---`);
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  console.log(`[Controller][Exercicio] Recebida requisição para deletar exercício ID: ${id}`);
  try {
    const existente = await exercicioService.buscarExercicioPorId(id);
    if (!existente) {
      console.warn(`[Controller][Exercicio] Exercício ID: ${id} não encontrado para exclusão.`);
      return res.status(404).json({ error: 'Exercício não encontrado para exclusão.' });
    }

    console.log(`[Controller][Exercicio] Chamando exercicioService.deletarExercicio(${id})...`);
    const sucesso = await exercicioService.deletarExercicio(id);
    console.log(`[Controller][Exercicio] Retorno de deletarExercicio(${id}):`, sucesso);
    
    if (!sucesso) {
       console.error(`[Controller][Exercicio] Erro ao deletar exercício ID: ${id}: serviço retornou false inesperadamente`);
       return res.status(500).json({ error: 'Erro ao deletar exercício (não encontrado após verificação inicial).' });
    }

    res.status(204).send();

  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (deletar Exercicio: ${id}) ---`);
    res.status(err.message.startsWith('Não é possível deletar') ? 409 : 500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};

export const buscarPorNome = async (req, res) => {
  const { nome } = req.params;
  console.log(`[Controller][Exercicio] Recebida requisição para buscar exercícios por nome: "${nome}"`);
  try {
    console.log(`[Controller][Exercicio] Chamando exercicioService.buscarExerciciosPorNome("${nome}")...`);
    const data = await exercicioService.buscarExerciciosPorNome(nome);
    console.log(`[Controller][Exercicio] Retorno de buscarExerciciosPorNome("${nome}"):`, data ? `${data.length} exercícios` : 'array vazio');
    res.json(data);
  } catch (err) {
    console.error(`\n--- ERRO DETALHADO NO CONTROLLER (buscarPorNome Exercicio: ${nome}) ---`);
    // ... (logs detalhados)
    res.status(500).json({ 
      error: err.message || 'Erro interno do servidor.', 
      detailedError: { message: err.message, name: err.name, code: err.code } 
    });
  }
};



