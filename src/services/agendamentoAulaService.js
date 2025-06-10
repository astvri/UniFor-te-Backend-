import supabase from '../supabase/supabaseClient.js';
import AgendamentoAula from '../entities/AgendamentoAula.js';

const agendamentoAulaService = {
  listarAgendamentos: () => {
    return supabase.from('agendamento_aula').select('*');
  },

  buscarPorId: (id) => {
    return supabase.from('agendamento_aula').select('*').eq('id', id).single();
  },

  listarPorAluno: (aluno_id) => {
    return supabase.from('agendamento_aula').select('*').eq('aluno_id', aluno_id);
  },

  agendarAula: async ({ aula_id, aluno_id }) => {
    const { data: aula, error: erroAula } = await supabase
      .from('aula')
      .select('nome, descricao, data, horario')
      .eq('id', aula_id)
      .single();

    if (erroAula) return { error: erroAula };

    const agendamento = new AgendamentoAula({
      aula_id,
      aluno_id,
      nome: aula.nome,
      descricao: aula.descricao,
      data: aula.data,
      horario: aula.horario,
    });

    return supabase.from('agendamento_aula').insert([agendamento]);
  },

  deletarAgendamento: (id) => {
    return supabase.from('agendamento_aula').delete().eq('id', id);
  }
};

export default agendamentoAulaService;
