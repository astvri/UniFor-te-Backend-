import supabase from '../supabase/supabaseClient.js';
import Usuario from '../entities/Usuario.js';

// Listar todos os usuários
export const listarUsuarios = async () => {
  try {
    const { data, error } = await supabase.from('usuarios').select('*');
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Criar um novo usuário
export const criarUsuario = async (dados) => {
    console.log('dados recebidos no service:', dados);  // <-- aqui
    try {
      const usuario = new Usuario(dados);
      const { data, error } = await supabase.from('usuarios').insert([usuario]);
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  };
  

// Atualizar um usuário por ID
export const atualizarUsuario = async (id, dados) => {
  try {
    const usuario = new Usuario({ id, ...dados });
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        cpf: usuario.cpf,
        email: usuario.email,
        senha: usuario.senha,
      })
      .eq('id', id);
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Deletar um usuário por ID
export const deletarUsuario = async (id) => {
  try {
    const { data, error } = await supabase.from('usuarios').delete().eq('id', id);
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Buscar um usuário pelo ID
export const buscarUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};
