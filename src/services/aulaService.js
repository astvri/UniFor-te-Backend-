import supabase from '../supabase/supabaseClient.js';
import Aula from '../entities/Aula.js';

const aulaService = {
  listarAulas: () => {
    return supabase.from('aula').select('*');
  },

  criarAula: (dados) => {
    const aula = new Aula(dados);
    const { id, ...dadosSemId } = aula; // remove o campo `id`
    return supabase.from('aula').insert([dadosSemId]); // agora funciona
  }, // <-- VÍRGULA FALTANDO AQUI

  atualizarAula: (id, dados) => {
    const aula = new Aula({ id, ...dados });

    return supabase
      .from('aula')
      .update({
        nome: aula.nome,
        descricao: aula.descricao,
        horario: aula.horario,
        professor_id: aula.professor_id,
        data: aula.data
      })
      .eq('id', id); // usa o `id` corretamente
  },

  deletarAula: (id) => {
    return supabase.from('aula').delete().eq('id', id);
  },

  listarAulaPorId: (id) => {
    return supabase
      .from('aula')
      .select('*')
      .eq('id', id)
      .single();
  },

  listarAulasPorProfessor: (professor_id) => {
    return supabase
      .from('aula')
      .select('*')
      .eq('professor_id', professor_id);
  }
};

export default aulaService;
