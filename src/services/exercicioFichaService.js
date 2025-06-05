
import ExercicioFicha from '../entities/ExercicioFicha.js';
import supabase from '../supabase/supabaseClient.js';

//buscar exercicios detalhados por id
const buscarExerciciosDetalhadosPorFichaId = async (fichaId) => {
  try {
    const { data: exerciciosRelacionados, error } = await supabase
      .from('exercicio_ficha_exercicios') 
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
    throw error;
  }
};


// Criar uma nova ficha de exercícios
export const criarExercicioFicha = async (fichaData) => {
  const { nome_treino, descricao, exercicios, professor_nome, aluno_id } = fichaData;
  
  try {
    const { data: fichaInserida, error: fichaError } = await supabase
      .from('exercicio_ficha')
      .insert([{ nome_treino, descricao, professor_nome, aluno_id }]) // Incluído aluno_id
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

    if (exercicios && exercicios.length > 0) {
      
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
    }
    
    return await buscarExercicioFichaPorId(exercicioFichaId);
    
  } catch (error) {
    throw error; 
  }
};

// Listar todas as fichas de exercícios
export const listarExerciciosFicha = async () => {
  try {
    const { data: fichas, error } = await supabase
      .from('exercicio_ficha')
      .select('*'); 
    
    if (error) {
      console.error('[Service] Erro do Supabase ao listar fichas:', error);
      throw error;
    }
    
    // Buscar exercícios para cada ficha
    const fichasCompletas = [];
    if (fichas) {
      for (const ficha of fichas) {
        const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(ficha.id);
        fichasCompletas.push(new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados }));
      }
    }
    
    return fichasCompletas;
  } catch (error) {
    throw error;
  }
};

// Buscar uma ficha de exercícios por ID
export const buscarExercicioFichaPorId = async (id) => {
  try {
    const { data: ficha, error } = await supabase
      .from('exercicio_ficha')
      .select('*')
      .eq('aluno_id', id) 
      .single(); 
    
    if (error && error.code !== 'PGRST116') { 
        console.error(`[Service] Erro do Supabase ao buscar ficha ID ${id}:`, error);
        throw error;
    }
    
    if (!ficha) {
      return null;
    }
    
    const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(ficha.id);

    const fichaCompleta = new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados });
    return fichaCompleta;
  } catch (error) {
    throw error;
  }
};

// Atualizar uma ficha de exercícios
export const atualizarExercicioFicha = async (id, fichaData) => {
  const { nome_treino, descricao, exercicios, professor_nome, aluno_id } = fichaData;
  
  try {
    const dadosParaAtualizar = { nome_treino, descricao, professor_nome, aluno_id }; // Incluído aluno_id
    Object.keys(dadosParaAtualizar).forEach(key => dadosParaAtualizar[key] === undefined && delete dadosParaAtualizar[key]);

    if (Object.keys(dadosParaAtualizar).length > 0) {
        const { error: updateFichaError } = await supabase
          .from('exercicio_ficha')
          .update(dadosParaAtualizar)
          .eq('id', id);
        
        if (updateFichaError) {
          console.error(`[Service] Erro do Supabase ao atualizar ficha ID ${id}:`, updateFichaError);
          throw updateFichaError;
        }
    } else {
        // console.log(`[Service] Nenhum dado da ficha principal para atualizar para ID: ${id}.`);
    }
    
    if (exercicios !== undefined) { 
      const { error: deleteError } = await supabase
        .from('exercicio_ficha_exercicios')
        .delete()
        .eq('exercicio_ficha_id', id);
      
      if (deleteError) {
        console.error(`[Service] Erro do Supabase ao deletar exercícios antigos para ficha ID ${id}:`, deleteError);
        throw deleteError;
      }
      
      // Inserir novos relacionamentos se houver algum
      if (exercicios && exercicios.length > 0) {
        const exerciciosParaInserir = exercicios.map(ex => ({
          exercicio_ficha_id: id,
          exercicios_id: ex.exercicios_id, 
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
      }
    }
    
    return await buscarExercicioFichaPorId(id);
    
  } catch (error) {
    throw error;
  }
};

// Deletar uma ficha de exercícios
export const deletarExercicioFicha = async (id) => {
  try {
    const { error, count } = await supabase
      .from('exercicio_ficha')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[Service] Erro do Supabase ao deletar ficha principal ID ${id}:`, error);
      throw error;
    }
    
    return count > 0; 
  } catch (error) {
    console.error(`\n--- ERRO DETALHADO NO SERVICE (deletarExercicioFicha: ${id}) ---`);
    throw error;
  }
};

// Listar fichas por professor
export const listarFichasPorProfessor = async (professorNome) => {
  try {
    const { data: fichas, error } = await supabase
      .from('exercicio_ficha')
      .select('*')
      .eq('professor_nome', professorNome);
    
    if (error) {
      console.error(`[Service] Erro do Supabase ao listar fichas do professor ${professorNome}:`, error);
      throw error;
    }

    
    // Buscar exercícios para cada ficha
    const fichasCompletas = [];
    if (fichas) {
      for (const ficha of fichas) {
        const exerciciosDetalhados = await buscarExerciciosDetalhadosPorFichaId(ficha.id);
        fichasCompletas.push(new ExercicioFicha({ ...ficha, exercicios: exerciciosDetalhados }));
      }
    }
    
    return fichasCompletas;
  } catch (error) {
    throw error;
  }
};

