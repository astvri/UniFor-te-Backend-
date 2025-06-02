export default class Aula {
  constructor({ id, nome, descricao, horario, professor_id, data }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.horario = horario;
    this.professor_id = professor_id;
    this.data = data;
  }

  // validar() {
  //   if (!this.nome || typeof this.nome !== 'string') {
  //     throw new Error('Nome da aula é obrigatório.');
  //   }
  //
  //   if (!this.descricao || typeof this.descricao !== 'string') {
  //     throw new Error('Descrição da aula é obrigatória.');
  //   }
  //
  //   if (!this.horario) {
  //     throw new Error('Horário da aula é obrigatório.');
  //   }
  //
  //   if (!this.professor_id) {
  //     throw new Error('Professor é obrigatório.');
  //   }
  //
  //   if (this.vagas_disponiveis === undefined || this.vagas_disponiveis < 1) {
  //     throw new Error('A aula deve ter pelo menos 1 vaga disponível.');
  //   }
  // }
}