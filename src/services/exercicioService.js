import Exercicio from '../entities/Exercicios.js'; 
import supabase from '../supabase/supabaseClient.js';

// Criar um novo exercício
export const criarExercicio = async (exercicioData) => {
  console.log('[Service][Exercicio] Iniciando criarExercicio com dados:', exercicioData);
  try {

    const { nome, maquina } = exercicioData;
    
    // Validação básica
    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new Error('Nome do exercício é obrigatório e deve ser texto.');
    }
    if (maquina !== undefined && maquina !== null && typeof maquina !== 'string') {
       throw new Error('Máquina deve ser texto.');
     }

    console.log('[Service][Exercicio] Inserindo exercício no Supabase...');
    const { data, error } = await supabase
      .from('exercicios')
      .insert([{ 
        nome: nome.trim(), 
        maquina: maquina ? maquina.trim() : null // Garante null se vazio ou undefined
      }])
      .select() // Retorna o registro inserido
      .single(); // Espera um único resultado
    
    if (error) {
      console.error('[Service][Exercicio] Erro Supabase ao criar exercício:', error);
      throw error;
    }
    if (!data) {
       console.error('[Service][Exercicio] Supabase não retornou dados após inserir exercício.');
      throw new Error('Erro ao inserir exercício: Supabase não retornou dados.');
    }

    console.log('[Service][Exercicio] Exercício criado com sucesso:', data);
    return new Exercicio(data); // Usa a classe Exercicio atualizada

  } catch (error) {
    console.error('\n--- ERRO DETALHADO NO SERVICE (criarExercicio) ---');
    console.error('Mensagem:', error.message);
    console.error('Stack Trace:\n', error.stack);
    if (error.code) console.error('Código do Erro (Supabase?):', error.code);
    if (error.details) console.error('Detalhes do Erro (Supabase?):', error.details);
    if (error.hint) console.error('Hint (Supabase?):', error.hint);
    console.error('Objeto de Erro Completo (Stringified):', JSON.stringify(error, null, 2));
    console.error('--- FIM ERRO DETALHADO ---');
    throw error; // Re-throw para o controller
  }
};

// Listar todos os exercícios
export const listarExercicios = async () => {
  console.log('[Service][Exercicio] Iniciando listarExercicios...');
  try {
    const { data: exercicios, error } = await supabase
      .from('exercicios')
      .select('*'); // Seleciona todas as colunas: id, created_at, nome, maquina
    
    if (error) {
      console.error('[Service][Exercicio] Erro Supabase ao listar exercícios:', error);
      throw error;
    }
    console.log(`[Service][Exercicio] Encontrados ${exercicios ? exercicios.length : 0} exercícios.`);
    return exercicios ? exercicios.map(ex => new Exercicio(ex)) : [];
  } catch (error) {
    console.error('\n--- ERRO DETALHADO NO SERVICE (listarExercicios) ---');
    throw error;
  }
};

// Buscar um exercício por ID
export const buscarExercicioPorId = async (id) => {
  console.log(`[Service][Exercicio] Iniciando buscarExercicioPorId para ID: ${id}`);
  try {
    const { data: exercicio, error } = await supabase
      .from('exercicios')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Retorna o objeto, null se não encontrado, ou erro
    
    if (error) {
      console.error(`[Service][Exercicio] Erro Supabase ao buscar exercício ID ${id}:`, error);
      throw error;
    }
    
    if (!exercicio) {
      console.log(`[Service][Exercicio] Exercício ID: ${id} não encontrado.`);
      return null;
    }
    
    console.log(`[Service][Exercicio] Exercício ID: ${id} encontrado.`);
    return new Exercicio(exercicio);
  } catch (error) {
     console.error(`\n--- ERRO DETALHADO NO SERVICE (buscarExercicioPorId: ${id}) ---`);
    throw error;
  }
};

// Atualizar um exercício
export const atualizarExercicio = async (id, exercicioData) => {
  console.log(`[Service][Exercicio] Iniciando atualizarExercicio para ID: ${id} com dados:`, exercicioData);
  try {
    // REMOVIDOS: repeticoes, series
    const { nome, maquina } = exercicioData;

    // Validar tipos
    if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === '')) {
       throw new Error('Nome do exercício deve ser texto não vazio.');
    }
    if (maquina !== undefined && maquina !== null && typeof maquina !== 'string') {
        throw new Error('Máquina deve ser texto.');
      }

    // Montar objeto apenas com campos fornecidos
    const dadosParaAtualizar = {};
    if (nome !== undefined) dadosParaAtualizar.nome = nome.trim();
    if (maquina !== undefined) dadosParaAtualizar.maquina = maquina === '' ? null : maquina.trim(); 
    // REMOVIDOS: repeticoes, series

    if (Object.keys(dadosParaAtualizar).length === 0) {
      console.warn('[Service][Exercicio] Nenhuma informação fornecida para atualizar.');
      return await buscarExercicioPorId(id); 
    }

    console.log('[Service][Exercicio] Atualizando exercício no Supabase...');
    const { data, error } = await supabase
      .from('exercicios')
      .update(dadosParaAtualizar)
      .eq('id', id)
      .select()
      .single(); // Espera o registro atualizado
    
    if (error) {
      console.error(`[Service][Exercicio] Erro Supabase ao atualizar exercício ID ${id}:`, error);
      throw error;
    }
     if (!data) {
       console.error(`[Service][Exercicio] Supabase não retornou dados após atualizar exercício ID ${id}.`);
       throw new Error('Erro ao atualizar exercício: ID não encontrado ou Supabase não retornou dados.');
     }
    
    console.log(`[Service][Exercicio] Exercício ID: ${id} atualizado com sucesso.`);
    return new Exercicio(data);
  } catch (error) {
     console.error(`\n--- ERRO DETALHADO NO SERVICE (atualizarExercicio: ${id}) ---`);
     // ... (logs detalhados)
    throw error;
  }
};

// Deletar um exercício
export const deletarExercicio = async (id) => {
  console.log(`[Service][Exercicio] Iniciando deletarExercicio para ID: ${id}`);
  try {
    console.log(`[Service][Exercicio] Tentando deletar exercício ID: ${id} no Supabase...`);
    const { error, count } = await supabase
      .from('exercicios')
      .delete()
      .eq('id', id);
    
    if (error) {
       if (error.code === '23503') { 
         console.warn(`[Service][Exercicio] Tentativa de deletar exercício ID ${id} falhou: Exercício está em uso em uma ou mais fichas.`);
         throw new Error(`Não é possível deletar o exercício (ID: ${id}) pois ele está associado a uma ou mais fichas.`);
       } else {
         console.error(`[Service][Exercicio] Erro Supabase ao deletar exercício ID ${id}:`, error);
         throw error;
       }
    }
    console.log(`[Service][Exercicio] Deleção do exercício ID: ${id}. Contagem: ${count}`);
    return count > 0; 
  } catch (error) {
     if (error.message.startsWith('Não é possível deletar')) {
       throw error;
     }
     console.error(`\n--- ERRO DETALHADO NO SERVICE (deletarExercicio: ${id}) ---`);
    throw error;
  }
};

// Buscar exercícios por nome)
export const buscarExerciciosPorNome = async (nome) => {
  console.log(`[Service][Exercicio] Iniciando buscarExerciciosPorNome com termo: "${nome}"`);
  try {
    const { data: exercicios, error } = await supabase
      .from('exercicios')
      .select('*')
      .ilike('nome', `%${nome}%`); 
    
    if (error) {
      console.error(`[Service][Exercicio] Erro Supabase ao buscar por nome "${nome}":`, error);
      throw error;
    }
    console.log(`[Service][Exercicio] Encontrados ${exercicios ? exercicios.length : 0} exercícios para o nome "${nome}".`);
    return exercicios ? exercicios.map(ex => new Exercicio(ex)) : [];
  } catch (error) {
     console.error(`\n--- ERRO DETALHADO NO SERVICE (buscarExerciciosPorNome: ${nome}) ---`);

    throw error;
  }
};


