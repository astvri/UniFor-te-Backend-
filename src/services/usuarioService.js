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
        tipo_usuario: dados.tipo_usuario // Adicionado tipo_usuario
      };
      
      const { data, error } = await supabase
        .from('usuarios')
        .insert([usuarioParaInserir])
        .select(); 

      if (error) {
        console.error('Erro ao inserir usuário:', error);
        return { data: null, error: error };
      }

      if (data && data.length > 0) {
        const novoUsuario = data[0];
        delete novoUsuario.senha;

        // Se o tipo de usuário for 'Professor', criar entrada na tabela 'professor'
        if (novoUsuario.tipo_usuario === 'Professor') {
          const { error: professorError } = await supabase
            .from('professor')
            .insert([
              {
                id_usuario: novoUsuario.id,
                especialidade: 'Não informada' // Especialidade padrão
              }
            ]);
          
          if (professorError) {
            console.error('Erro ao criar entrada na tabela professor:', professorError);
            // Você pode decidir como lidar com este erro: 
            // 1. Retornar um erro para o frontend (e talvez reverter a criação do usuário)
            // 2. Apenas logar o erro e permitir que o usuário continue, mas sem a entrada de professor
            // Por enquanto, vamos apenas logar e continuar.
          }
        } else if (novoUsuario.tipo_usuario === 'Aluno') { // Adicionado para Aluno
          const { error: alunoError } = await supabase
            .from('aluno')
            .insert([
              {
                id_usuario: novoUsuario.id,
                objetivo: 'Aguardando definição de objetivo' // Objetivo padrão para aluno
              }
            ]);
          
          if (alunoError) {
            console.error('Erro ao criar entrada na tabela aluno:', alunoError);
          }
        }
      }

      return { data, error: null };
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

