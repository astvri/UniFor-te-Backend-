import * as usuarioService from '../services/usuarioService.js';

export const listar = async (req, res) => {
  const { data, error } = await usuarioService.listarUsuarios();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const criar = async (req, res) => {
    try {
      console.log("BODY recebido:", req.body); // 🕵️ Verifique isso no console
  
      const { data, error } = await usuarioService.criarUsuario(req.body);
      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

export const atualizar = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await usuarioService.atualizarUsuario(id, req.body);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
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
