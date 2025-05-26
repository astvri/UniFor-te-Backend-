import supabase from '../supabase/supabaseClient.js';
import Aluno from '../entities/Aluno.js';

export const listarAlunos = () => {
  return supabase.from('aluno').select('*');
};

export const criarAluno = (dados) => {
  const aluno = new Aluno(dados);
  return supabase.from('aluno').insert([aluno]);
};

export const atualizarAluno = (id_usuario, dados) => {
  const aluno = new Aluno({ id_usuario, ...dados });
  return supabase
    .from('aluno')
    .update({ objetivo: aluno.objetivo })
    .eq('id_usuario', id_usuario);
};

export const deletarAluno = (id_usuario) => {
  return supabase.from('aluno').delete().eq('id_usuario', id_usuario);
};

// Função para listar um aluno pelo id_usuario
export const listarAlunoPorId = (id_usuario) => {
  return supabase
    .from('aluno')
    .select('*')
    .eq('id_usuario', id_usuario)
    .single();
};
