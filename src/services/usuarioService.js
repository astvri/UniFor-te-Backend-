import bcrypt from 'bcrypt';
import supabase from '../supabase/supabaseClient.js';

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
      console.error('Erro ao inserir usuário:', usuarioError);
      return { data: null, error: usuarioError };
    }

    if (!usuarioData || usuarioData.length === 0) {
      return { data: null, error: { message: 'Usuário não foi criado.' } };
    }

    const novoUsuario = usuarioData[0];
    delete novoUsuario.senha;

    // Criar entrada adicional dependendo do tipo de usuário
    if (novoUsuario.tipo_usuario === 'Professor') {
      const { error: professorError } = await supabase
        .from('professor')
        .insert([{ id_usuario: novoUsuario.id, especialidade: 'Não informada' }]);

      if (professorError) {
        console.error('Erro ao criar professor:', professorError);
      }
    } else if (novoUsuario.tipo_usuario === 'Aluno') {
      const { error: alunoError } = await supabase
        .from('aluno')
        .insert([{ id_usuario: novoUsuario.id, objetivo: 'Aguardando definição de objetivo' }]);

      if (alunoError) {
        console.error('Erro ao criar aluno:', alunoError);
      }
    }

    return { data: novoUsuario, error: null };

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
    if (dados.tipo_usuario) dadosParaAtualizar.tipo_usuario = dados.tipo_usuario;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      return { data: null, error: { message: 'Nenhum dado fornecido para atualização.' } };
    }

    const { data, error } = await supabase
      .from('usuarios')
      .update(dadosParaAtualizar)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { data: null, error };
    }

    const usuarioAtualizado = data?.[0];
    if (usuarioAtualizado?.senha) delete usuarioAtualizado.senha;

    return { data: usuarioAtualizado, error: null };

  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return { data: null, error: err };
  }
};

// Deletar um usuário por ID
export const deletarUsuario = async (id) => {
  try {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    return { data: error ? null : { id }, error };
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    return { data: null, error: err };
  }
};

// Buscar um usuário por ID
export const buscarUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};
