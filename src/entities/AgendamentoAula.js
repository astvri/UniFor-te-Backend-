export default class AgendamentoAula {
  constructor({ aula_id, aluno_id, nome, descricao, data, horario }) {
    this.aula_id = aula_id;
    this.aluno_id = aluno_id;
    this.nome = nome;
    this.descricao = descricao;
    this.data = data;
    this.horario = horario;
  }
}
