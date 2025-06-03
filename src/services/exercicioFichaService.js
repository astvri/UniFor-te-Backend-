import supabase from '../supabase/supabaseClient.js';
import ExercicioFicha from '../entities/ExercicioFicha.js';

const TABLE_NAME = 'exercicio_ficha';

export const criarExercicioFicha = async (exercicioData) => {
  const { ficha_id, nome_exercicio, series, repeticoes, carga, observacoes } = exercicioData;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        ficha_id,
        nome_exercicio,
        series,
        repeticoes,
        carga,
        observacoes,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar exercício da ficha:', error.message);
    return null;
  }

  if (data) {
    return new ExercicioFicha(data);
  }

  return null;
};

export const listarExerciciosFicha = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');

  if (error) {
    console.error('Erro ao listar exercícios da ficha:', error.message);
    return [];
  }

  return data.map((e) => new ExercicioFicha(e));
};

export const buscarExercicioFichaPorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar exercício da ficha por ID:', error.message);
    return null;
  }

  if (data) {
    return new ExercicioFicha(data);
  }

  return null;
};

export const atualizarExercicioFicha = async (id, updateData) => {
  const updatePayload = {};

  if (updateData.ficha_id !== undefined) updatePayload.ficha_id = updateData.ficha_id;
  if (updateData.nome_exercicio !== undefined) updatePayload.nome_exercicio = updateData.nome_exercicio;
  if (updateData.series !== undefined) updatePayload.series = updateData.series;
  if (updateData.repeticoes !== undefined) updatePayload.repeticoes = updateData.repeticoes;
  if (updateData.carga !== undefined) updatePayload.carga = updateData.carga;
  if (updateData.observacoes !== undefined) updatePayload.observacoes = updateData.observacoes;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar exercício da ficha:', error.message);
    return null;
  }

  if (data) {
    return new ExercicioFicha(data);
  }

  return null;
};

export const deletarExercicioFicha = async (id) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar exercício da ficha:', error.message);
    return false;
  }

  return true;
};

export const listarExerciciosPorFichaId = async (fichaId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('ficha_id', fichaId);

  if (error) {
    console.error('Erro ao listar exercícios por ficha_id:', error.message);
    return [];
  }

  return data.map((e) => new ExercicioFicha(e));
};
