import bcrypt from 'bcrypt';
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
    console.log('dados recebidos no service (criar):', dados);
    try {
      const saltRounds = 10;
      const senhaEncriptada = await bcrypt.hash(dados.senha, saltRounds);

      const usuarioParaInserir = {
        nome: dados.nome, 
        cpf: dados.cpf,
        email: dados.email,
        senha: senhaEncriptada,
        telefone: dados.telefone,
        endereco: dados.endereco,
        titulo_objetivo: dados.titulo_objetivo,
        descricao_objetivo: dados.descricao_objetivo,
      };
      
      const { data, error } = await supabase
        .from('usuarios')
        .insert([usuarioParaInserir])
        .select(); 

      if (data && data.length > 0) {
        delete data[0].senha;
      }

      return { data, error };
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      return { data: null, error: err };
    }
  };

// Atualizar um usuário por ID
export const atualizarUsuario = async (id, dados) => {
  console.log('dados recebidos no service (atualizar):', id, dados);
  try {
    const dadosParaAtualizar = {};
    if (dados.nome) dadosParaAtualizar.nome = dados.nome;
    if (dados.cpf) dadosParaAtualizar.cpf = dados.cpf;
    if (dados.email) dadosParaAtualizar.email = dados.email;
    if (dados.telefone) dadosParaAtualizar.telefone = dados.telefone;
    if (dados.endereco) dadosParaAtualizar.endereco = dados.endereco;
    if (dados.titulo_objetivo) dadosParaAtualizar.titulo_objetivo = dados.titulo_objetivo;
    if (dados.descricao_objetivo) dadosParaAtualizar.descricao_objetivo = dados.descricao_objetivo;
    
    if (Object.keys(dadosParaAtualizar).length === 0) {
        return { data: null, error: { message: "Nenhum dado fornecido para atualização." } };
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(dadosParaAtualizar)
      .eq('id', id)
      .select(); 
  
    let responseData = null;
    if (data && data.length > 0) {
      responseData = data[0];  
      if (responseData.senha) {
        delete responseData.senha;
      }
    }

    return { data: responseData, error };
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
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
