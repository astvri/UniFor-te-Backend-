import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import supabase from '../supabase/supabaseClient.js';


import * as usuarioService from '../services/usuarioService.js';


export const listar = async (req, res) => {
  const { data, error } = await usuarioService.listarUsuarios();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const criar = async (req, res) => {
    try {
      console.log("BODY recebido:", req.body); 
  
      const { data, error } = await usuarioService.criarUsuario(req.body);
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const { data: user, error: findError } = await supabase
      .from('usuarios') 
      .select('*') 
      .eq('email', email)
      .single();

   
    if (findError) {
        if (findError.code === 'PGRST116') {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // Email não encontrado
        }
        console.error('Erro ao buscar utilizador:', findError);
        return res.status(500).json({ error: 'Erro ao tentar fazer login.' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Senha incorreta
    }

    
    const secretKey = process.env.JWT_SECRET;
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' }); 

    delete user.senha;

    res.status(200).json({ token, user });

  } catch (error) {
    console.error('Erro no servidor durante o login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
  

export const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await usuarioService.atualizarUsuario(id, req.body);
    if (error) return res.status(500).json({ error: error.message });
    
    if (data) {
      res.json(data); 
    } else {
      res.status(404).json({ error: 'Usuário não encontrado ou não foi possível atualizar' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  const { error } = await usuarioService.deletarUsuario(id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await usuarioService.buscarUsuarioPorId(id);
  if (error || !data) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(data);
};
