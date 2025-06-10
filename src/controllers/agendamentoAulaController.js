import agendamentoAulaService from '../services/agendamentoAulaService.js';

export const listar = async (req, res) => {
  try {
    const { data, error } = await agendamentoAulaService.listarAgendamentos();
    if (error) return res.status(400).json({ erro: error.message });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await agendamentoAulaService.buscarPorId(id);
  if (error || !data) return res.status(404).json({ erro: 'Agendamento não encontrado' });
  return res.status(200).json(data);
};

export const listarPorAluno = async (req, res) => {
  const { aluno_id } = req.params;
  const { data, error } = await agendamentoAulaService.listarPorAluno(aluno_id);
  if (error) return res.status(400).json({ erro: error.message });
  return res.status(200).json(data);
};

export const agendar = async (req, res) => {
  const { aula_id, aluno_id } = req.body;

  if (!aula_id || !aluno_id) {
    return res.status(400).json({ erro: 'aula_id e aluno_id são obrigatórios' });
  }

  const { data, error } = await agendamentoAulaService.agendarAula({ aula_id, aluno_id });
  if (error) return res.status(400).json({ erro: error.message });

  return res.status(201).json(data);
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  const { error } = await agendamentoAulaService.deletarAgendamento(id);
  if (error) return res.status(400).json({ erro: error.message });
  return res.status(200).json({ mensagem: 'Agendamento deletado com sucesso' });
};
