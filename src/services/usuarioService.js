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
        tipo_usuario: dados.tipo_usuario, 
      };
      
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .insert([usuarioParaInserir])
        .select(); 

      if (usuarioError) {
        console.error('Erro ao criar usuário:', usuarioError);
        return { data: null, error: usuarioError };
      }

      if (usuarioData && usuarioData.length > 0) {
        const novoUsuario = usuarioData[0];
        delete novoUsuario.senha;

        if (novoUsuario.tipo_usuario === 'aluno') {
          const alunoParaInserir = {
            id_usuario: novoUsuario.id, // Usar o ID do usuário recém-criado
            objetivo: novoUsuario.titulo_objetivo, // Usar o titulo_objetivo como objetivo do aluno
          };

          const { data: alunoData, error: alunoError } = await supabase
            .from('aluno')
            .insert([alunoParaInserir])
            .select();

          if (alunoError) {
            console.error('Erro ao criar entrada na tabela aluno:', alunoError);
            // Decidir se o erro na criação do aluno deve reverter a criação do usuário
            // Por simplicidade, aqui apenas logamos o erro e retornamos o usuário criado
            // Em um cenário real, você pode querer transações ou compensação.
          }
        }
        return { data: novoUsuario, error: null };
      }

      return { data: null, error: { message: 'Usuário não foi criado.' } };
    } catch (err) {
      console.error('Erro geral ao criar usuário:', err);
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
    if (dados.tipo_usuario) dadosParaAtualizar.tipo_usuario = dados.tipo_usuario; // Adicionado tipo_usuario
    
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
    return { data: null, error: err };
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



