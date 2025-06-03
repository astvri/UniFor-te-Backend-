import * as agendamentoService from '../services/agendamentoAulaService.js';

export const criar = async (req, res) => {
  const agendamento = req.body;

  if (!agendamento.aluno_id || !agendamento.aula_id || !agendamento.status) {
    return res.status(400).json({ error: 'aluno_id, aula_id e status são obrigatórios.' });
  }

  const { data, error } = await agendamentoService.criarAgendamento(agendamento);
  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};

export const listar = async (req, res) => {
  const { data, error } = await agendamentoService.listarAgendamentos();
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await agendamentoService.buscarAgendamentoPorId(id);
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Agendamento não encontrado.' });

  res.json(data);
};

export const atualizar = async (req, res) => {
  const { id } = req.params;
  const { data: exists } = await agendamentoService.buscarAgendamentoPorId(id);
  if (!exists) return res.status(404).json({ error: 'Agendamento não encontrado.' });

  const { data, error } = await agendamentoService.atualizarAgendamento(id, req.body);
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const deletar = async (req, res) => {
  const { id } = req.params;
  const { data: exists } = await agendamentoService.buscarAgendamentoPorId(id);
  if (!exists) return res.status(404).json({ error: 'Agendamento não encontrado.' });

  const { success, error } = await agendamentoService.deletarAgendamento(id);
  if (error) return res.status(500).json({ error: error.message });

  res.status(204).send();
};
