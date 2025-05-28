import supabase from '../supabase/supabaseClient.js';
import FichaTreino from '../entities/FichaTreino.js';

const TABLE_NAME = 'fichas_treino';

export const criarFichaTreino = async (fichaData) => {
  const { titulo, descricao, exercicios, alunoId, professorId } = fichaData;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        titulo,
        descricao,
        exercicios,
        aluno_id: alunoId,
        professor_id: professorId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar ficha de treino:', error.message);
    return null;
  }

  if (data) {
    return new FichaTreino(
      data.id,
      data.titulo,
      data.descricao,
      data.exercicios,
      data.aluno_id,
      data.professor_id,
      data.created_at
    );
  }

  return null;
};

export const listarFichasTreino = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');

  if (error) {
    console.error('Erro ao listar fichas de treino:', error.message);
    return [];
  }

  return data.map(
    (f) =>
      new FichaTreino(
        f.id,
        f.titulo,
        f.descricao,
        f.exercicios,
        f.aluno_id,
        f.professor_id,
        f.created_at
      )
  );
};

export const buscarFichaTreinoPorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar ficha de treino por ID:', error.message);
    return null;
  }

  if (data) {
    return new FichaTreino(
      data.id,
      data.titulo,
      data.descricao,
      data.exercicios,
      data.aluno_id,
      data.professor_id,
      data.created_at
    );
  }

  return null;
};

export const atualizarFichaTreino = async (id, updateData) => {
  const updatePayload = {};
  if (updateData.titulo !== undefined) updatePayload.titulo = updateData.titulo;
  if (updateData.descricao !== undefined)
    updatePayload.descricao = updateData.descricao;
  if (updateData.exercicios !== undefined)
    updatePayload.exercicios = updateData.exercicios;
  if (updateData.alunoId !== undefined)
    updatePayload.aluno_id = updateData.alunoId;
  if (updateData.professorId !== undefined)
    updatePayload.professor_id = updateData.professorId;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar ficha de treino:', error.message);
    return null;
  }

  if (data) {
    return new FichaTreino(
      data.id,
      data.titulo,
      data.descricao,
      data.exercicios,
      data.aluno_id,
      data.professor_id,
      data.created_at
    );
  }

  return null;
};

export const deletarFichaTreino = async (id) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    console.error('Erro ao deletar ficha de treino:', error.message);
    return false;
  }

  return true;
};

export const listarFichasTreinoPorAlunoId = async (alunoId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('aluno_id', alunoId);

  if (error) {
    console.error(
      'Erro ao buscar fichas de treino por aluno ID:',
      error.message
    );
    return [];
  }

  return data.map(
    (f) =>
      new FichaTreino(
        f.id,
        f.titulo,
        f.descricao,
        f.exercicios,
        f.aluno_id,
        f.professor_id,
        f.created_at
      )
  );
};

export const listarFichasTreinoPorProfessorId = async (professorId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('professor_id', professorId);

  if (error) {
    console.error(
      'Erro ao buscar fichas de treino por professor ID:',
      error.message
    );
    return [];
  }

  return data.map(
    (f) =>
      new FichaTreino(
        f.id,
        f.titulo,
        f.descricao,
        f.exercicios,
        f.aluno_id,
        f.professor_id,
        f.created_at
      )
  );
};
