import supabase from '../supabase/supabaseClient.js';
import Professor from '../entities/Professor.js';

export const listarProfessores = () => {
  return supabase.from('professor').select('*');
};

export const criarProfessor = (dados) => {
  const professor = new Professor(dados);
  return supabase.from('professor').insert([professor]);
};

export const atualizarProfessor = (id_usuario, dados) => {
  const professor = new Professor({ id_usuario, ...dados });
  return supabase
    .from('professor')
    .update({ especialidade: professor.especialidade })
    .eq('id_usuario', id_usuario);
};

export const deletarProfessor = (id_usuario) => {
  return supabase.from('professor').delete().eq('id_usuario', id_usuario);
};

// Função para listar um professor pelo id_usuario
export const listarProfessorPorId = (id_usuario) => {
  return supabase
    .from('professor')
    .select('*')
    .eq('id_usuario', id_usuario)
    .single();
};

