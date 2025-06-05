
import ExercicioFicha from '../entities/ExercicioFicha.js';
import supabase from '../supabase/supabaseClient.js';


const buscarExerciciosDetalhadosPorFichaId = async (fichaId) => {
  console.log(`[Service] Buscando exercícios detalhados para ficha ID: ${fichaId}`);
  try {
    const { data: exerciciosRelacionados, error } = await supabase
      .from('exercicio_ficha_exercicios') // Nome correto da tabela de ligação
      .select(`
        id, 
        exercicio_ficha_id, 
        exercicios_id, 
        series, 
        repeticoes, 
        carga, 
        observacoes,
        exercicios ( id, nome, maquina ) 
      `)
      .eq('exercicio_ficha_id', fichaId);

    if (error) {
      console.error(`[Service] Erro Supabase ao buscar exercícios detalhados para ficha ID ${fichaId}:`, error);
      throw error;
    }

    console.log(`[Service] Encontrados ${exerciciosRelacionados ? exerciciosRelacionados.length : 0} exercícios detalhados para ficha ID: ${fichaId}.`);
    
  
    return exerciciosRelacionados ? exerciciosRelacionados.map(rel => ({
      relacao_id: rel.id,
      exercicio_id: rel.exercicios_id, 
      nome: rel.exercicios ? rel.exercicios.nome : 'Nome não encontrado',
      maquina: rel.exercicios ? rel.exercicios.maquina : 'Máquina não encontrada',
      series: rel.series,
      repeticoes: rel.repeticoes,
      carga: rel.carga,
      observacoes: rel.observacoes
    })) : [];

  } catch (error) {
    console.error(`\n--- ERRO DETALHADO NO SERVICE (buscarExerciciosDetalhadosPorFichaId: ${fichaId}) ---`);
    console.error('Mensagem:', error.message);
    console.error('Stack Trace:\n', error.stack);
    console.error('Objeto de Erro Completo:', JSON.stringify(error, null, 2));
    console.error('--- FIM ERRO DETALHADO ---\n');
    throw error;
  }
};


// Criar uma nova ficha de exercícios
export const criarExercicioFicha = async (fichaData) => {
  console.log('[Service] Iniciando criarExercicioFicha com dados:', fichaData);
  const { nome_treino, descricao, exercicios, professor_nome } = fichaData;
  
  try {
    // 1. Inserir a ficha principal
    console.log('[Service] Inserindo ficha principal no Supabase...');
    const { data: fichaInserida, error: fichaError } = await supabase
      .from('exercicio_ficha')
      .insert([{ nome_treino, descricao, professor_nome }])
      .select('id') 
      .single();

    if (fichaError) {
      console.error('[Service] Erro do Supabase ao inserir ficha:', fichaError);
      throw fichaError;
    }
    if (!fichaInserida || !fichaInserida.id) {
      console.error('[Service] Supabase não retornou ID após inserir ficha.');
      throw new Error('Erro ao inserir ficha de exercícios: Supabase não retornou ID.');
    }
    const exercicioFichaId = fichaInserida.id;
    console.log('[Service] Ficha principal inserida com ID:', exercicioFichaId);

    if (exercicios && exercicios.length > 0) {
      console.log(`[Service] Inserindo ${exercicios.length} exercícios relacionados para ficha ID: ${exercicioFichaId}`);
      
      const exerciciosParaInserir = exercicios.map(ex => ({
        exercicio_ficha_id: exercicioFichaId,
        exercicios_id: ex.exercicios_id,
        series: ex.series,
        repeticoes: ex.repeticoes,
        carga: ex.carga || null,
        observacoes: ex.observacoes || null
      }));

      const { error: exerciciosError } = await supabase
        .from('exercicio_ficha_exercicios') 
        .insert(exerciciosParaInserir);

      if (exerciciosError) {
        console.error('[Service] Erro do Supabase ao inserir exercícios relacionados:', exerciciosError);
        await supabase.from('exercicio_ficha').delete().eq('id', exercicioFichaId);
        console.warn(`[Service] Ficha principal ID ${exercicioFichaId} deletada devido a erro ao inserir exercícios.`);
        throw exerciciosError;
      }
      console.log('[Service] Exercícios relacionados inseridos com sucesso.');
    }
    
    console.log(`[Service] Buscando ficha recém-criada (ID: ${exercicioFichaId}) com detalhes...`);
    return await buscarExercicioFichaPorId(exercicioFichaId);
    
  } catch (error) {
    
    throw error; 
  }
};

export const listarExerciciosFicha = async () => {
  console.log('[Service] Iniciando listarExerciciosFicha...');
  try {
    console.log('[Service] Buscando todas as fichas no Supabase...');
    const { data: fichas, error } = await supabase
      .from('exercicio_ficha')
      .select('*'); 
    
    if (error) {
      console.error('[Service] Erro do Supabase ao listar fichas:', error);
      throw error;
    }
    console.log(`[Service] Encontradas ${fichas ? fichas.length : 0} fichas.`);
    
    
    const fichasCompletas = [];
    if (fichas) {
      for (const ficha of fichas) {
        const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(ficha.id);
        fichasCompletas.push(new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados }));
      }
    }
    
    console.log('[Service] Retornando fichas completas:', `${fichasCompletas.length} fichas`);
    return fichasCompletas;
  } catch (error) {
    throw error;
  }
};

// Buscar uma ficha de exercícios por ID
export const buscarExercicioFichaPorId = async (id) => {
  console.log(`[Service] Iniciando buscarExercicioFichaPorId para ID: ${id}`);
  try {
    console.log(`[Service] Buscando ficha ID: ${id} no Supabase...`);
    const { data: ficha, error } = await supabase
      .from('exercicio_ficha')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') { 
        console.error(`[Service] Erro do Supabase ao buscar ficha ID ${id}:`, error);
        throw error;
    }
    
    if (!ficha) {
      console.log(`[Service] Ficha ID: ${id} não encontrada.`);
      return null;
    }
    
    console.log(`[Service] Ficha ID: ${id} encontrada. Buscando exercícios detalhados...`);
    const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(id);
    
    const fichaCompleta = new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados });
    console.log(`[Service] Retornando ficha completa para ID: ${id}`);
    return fichaCompleta;
  } catch (error) {
    throw error;
  }
};

// Atualizar uma ficha de exercícios
export const atualizarExercicioFicha = async (id, fichaData) => {
  console.log(`[Service] Iniciando atualizarExercicioFicha para ID: ${id} com dados:`, fichaData);
  const { nome_treino, descricao, exercicios, professor_nome } = fichaData;
  
  try {
    // 1. Atualizar a ficha principal
    console.log(`[Service] Atualizando ficha principal ID: ${id} no Supabase...`);
    const { error: updateFichaError } = await supabase
      .from('exercicio_ficha')
      .update({ nome_treino, descricao, professor_nome })
      .eq('id', id);
    
    if (updateFichaError) {
      console.error(`[Service] Erro do Supabase ao atualizar ficha ID ${id}:`, updateFichaError);
      throw updateFichaError;
    }
    console.log(`[Service] Ficha principal ID: ${id} atualizada.`);
    
    
    if (exercicios !== undefined) { 
      console.log(`[Service] Atualizando exercícios relacionados para ficha ID: ${id}. Removendo existentes...`);
      const { error: deleteError } = await supabase
        .from('exercicio_ficha_exercicios')
        .delete()
        .eq('exercicio_ficha_id', id);
      
      if (deleteError) {
        console.error(`[Service] Erro do Supabase ao deletar exercícios antigos para ficha ID ${id}:`, deleteError);
        throw deleteError;
      }
      console.log(`[Service] Exercícios antigos para ficha ID: ${id} removidos.`);
      
      // Inserir novos relacionamentos se houver algum
      if (exercicios && exercicios.length > 0) {
        console.log(`[Service] Inserindo ${exercicios.length} novos exercícios para ficha ID: ${id}`);
        const exerciciosParaInserir = exercicios.map(ex => ({
          exercicio_ficha_id: id,
          exercicios_id: ex.exercicios_id, // Usar o ID do exercício vindo do request
          series: ex.series,
          repeticoes: ex.repeticoes,
          carga: ex.carga || null,
          observacoes: ex.observacoes || null
        }));

        const { error: insertError } = await supabase
          .from('exercicio_ficha_exercicios')
          .insert(exerciciosParaInserir);

        if (insertError) {
          console.error(`[Service] Erro do Supabase ao inserir novos exercícios para ficha ID ${id}:`, insertError);
          throw insertError; 
        }
        console.log(`[Service] Novos exercícios para ficha ID: ${id} inseridos.`);
      }
    }
    console.log(`[Service] Buscando ficha atualizada (ID: ${id}) com detalhes...`);
    return await buscarExercicioFichaPorId(id);
    
  } catch (error) {
    throw error;
  }
};

// Deletar uma ficha de exercícios
export const deletarExercicioFicha = async (id) => {
  console.log(`[Service] Iniciando deletarExercicioFicha para ID: ${id}`);
  try {
    console.log(`[Service] Deletando ficha principal ID: ${id} no Supabase...`);
    const { error, count } = await supabase
      .from('exercicio_ficha')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[Service] Erro do Supabase ao deletar ficha principal ID ${id}:`, error);
      throw error;
    }
    
    console.log(`[Service] Ficha principal ID: ${id} deletada. Contagem: ${count}`);
    return count > 0; 
  } catch (error) {
    console.error(`\n--- ERRO DETALHADO NO SERVICE (deletarExercicioFicha: ${id}) ---`);
    console.error('Mensagem:', error.message);
    console.error('Stack Trace:\n', error.stack);
    console.error('Objeto de Erro Completo:', JSON.stringify(error, null, 2));
    console.error('--- FIM ERRO DETALHADO ---\n');
    throw error;
  }
};

// Listar fichas por professor
export const listarFichasPorProfessor = async (professorNome) => {
  console.log(`[Service] Iniciando listarFichasPorProfessor para professor: ${professorNome}`);
  try {
    console.log(`[Service] Buscando fichas do professor ${professorNome} no Supabase...`);
    const { data: fichas, error } = await supabase
      .from('exercicio_ficha')
      .select('*')
      .eq('professor_nome', professorNome);
    
    if (error) {
      console.error(`[Service] Erro do Supabase ao listar fichas do professor ${professorNome}:`, error);
      throw error;
    }
    console.log(`[Service] Encontradas ${fichas ? fichas.length : 0} fichas para o professor ${professorNome}.`);
    
    const fichasCompletas = [];
    if (fichas) {
      for (const ficha of fichas) {
        const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(ficha.id);
        fichasCompletas.push(new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados }));
      }
    }
    
    console.log(`[Service] Retornando fichas completas para o professor ${professorNome}:`, `${fichasCompletas.length} fichas`);
    return fichasCompletas;
  } catch (error) {
    throw error;
  }
};

