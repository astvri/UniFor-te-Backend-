export default class FichaTreino {
  constructor({
      id = null,
      alunoId = null,
      professorId = null,
      dataCriacao = new Date(),
      objetivo = null,
  }) {
      this.id = id; // id pode ser null ao criar antes de salvar no banco
      this.alunoId = alunoId;
      this.professorId = professorId;
      this.dataCriacao = dataCriacao;
      this.objetivo = objetivo;
  }
}