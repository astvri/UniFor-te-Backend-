import supabase from '../supabase/supabaseClient.js';
import FichaTreino from '../entities/FichaTreino.js';

const TABLE_NAME = 'ficha_treino';

export const criarFichaTreino = async (fichaData) => {
  const { objetivo, alunoId, professorId } = fichaData;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        objetivo,
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
    return new FichaTreino({
      id: data.id,
      alunoId: data.aluno_id,
      professorId: data.professor_id,
      dataCriacao: data.data_criacao,
      objetivo: data.objetivo
    });
  }

  return null;
};

export const listarFichasTreino = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');

  if (error) {
    console.error('Erro ao listar fichas de treino:', error.message);
    return [];
  }

  return data.map(f =>
    new FichaTreino({
      id: f.id,
      alunoId: f.aluno_id,
      professorId: f.professor_id,
      dataCriacao: f.data_criacao,
      objetivo: f.objetivo
    })
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
    return new FichaTreino({
      id: data.id,
      alunoId: data.aluno_id,
      professorId: data.professor_id,
      dataCriacao: data.data_criacao,
      objetivo: data.objetivo
    });
  }

  return null;
};

export const atualizarFichaTreino = async (id, updateData) => {
  const updatePayload = {};
  if (updateData.objetivo !== undefined) updatePayload.objetivo = updateData.objetivo;
  if (updateData.alunoId !== undefined) updatePayload.aluno_id = updateData.alunoId;
  if (updateData.professorId !== undefined) updatePayload.professor_id = updateData.professorId;

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
    return new FichaTreino({
      id: data.id,
      alunoId: data.aluno_id,
      professorId: data.professor_id,
      dataCriacao: data.data_criacao,
      objetivo: data.objetivo
    });
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
    .select(
      `
      *,
      professor_data:professor(
        id_usuario,
        especialidade,
        usuario:usuarios(id, nome)
      ),
      exercicios_relacionados:exercicio_ficha_exercicios(
        series,
        repeticoes,
        carga,
        observacoes,
        exercicio:exercicios(id, nome, maquina)
      )
      `
    )
    .eq('aluno_id', alunoId);

  if (error) {
    console.error('Erro ao buscar fichas de treino por aluno ID:', error.message);
    return [];
  }

  return data.map(f => {
    const exerciciosMapeados = f.exercicios_relacionados ? f.exercicios_relacionados.map(rel => ({
      id: rel.exercicio?.id,
      nome: rel.exercicio?.nome,
      maquina: rel.exercicio?.maquina,
      series: rel.series,
      repeticoes: rel.repeticoes,
      carga: rel.carga,
      observacoes: rel.observacoes
    })) : [];

    return new FichaTreino({
      id: f.id,
      alunoId: f.aluno_id,
      professorId: f.professor_id,
      dataCriacao: f.data_criacao,
      objetivo: f.objetivo,
      nomeProfessor: f.professor_data?.usuario?.nome || 'Não informado',
      exercicios: exerciciosMapeados
    });
  });
};

export const listarFichasTreinoPorProfessorId = async (professorId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('professor_id', professorId);

  if (error) {
    console.error('Erro ao buscar fichas de treino por professor ID:', error.message);
    return [];
  }

  return data.map(f =>
    new FichaTreino({
      id: f.id,
      alunoId: f.aluno_id,
      professorId: f.professor_id,
      dataCriacao: f.data_criacao,
      objetivo: f.objetivo
    })
  );
};