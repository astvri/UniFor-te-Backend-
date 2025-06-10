export default class Aula {
  constructor({ id, nome, descricao, horario, professor_id, data }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.horario = horario;
    this.professor_id = professor_id;
    this.data = data;
  }
}