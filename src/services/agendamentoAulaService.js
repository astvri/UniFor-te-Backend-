import supabase from '../supabase/supabaseClient.js';
import AgendamentoAula from '../entities/AgendamentoAula.js';

const TABLE_NAME = 'agendamento_aula';

export const criarAgendamento = async (agendamentoData) => {
  const { aluno_id, aula_id, status } = agendamentoData;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ aluno_id, aula_id, status }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar agendamento:', error.message);
    return { data: null, error };
  }

  return {
    data: new AgendamentoAula(data),
    error: null,
  };
};

export const listarAgendamentos = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');

  if (error) {
    console.error('Erro ao listar agendamentos:', error.message);
    return { data: [], error };
  }

  return {
    data: data.map((a) => new AgendamentoAula(a)),
    error: null,
  };
};

export const buscarAgendamentoPorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar agendamento:', error.message);
    return { data: null, error };
  }

  return {
    data: new AgendamentoAula(data),
    error: null,
  };
};

export const atualizarAgendamento = async (id, updateData) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar agendamento:', error.message);
    return { data: null, error };
  }

  return {
    data: new AgendamentoAula(data),
    error: null,
  };
};

export const deletarAgendamento = async (id) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar agendamento:', error.message);
    return { success: false, error };
  }

  return { success: true, error: null };
};
