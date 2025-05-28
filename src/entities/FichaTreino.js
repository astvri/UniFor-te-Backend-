export default class FichaTreino {
    constructor({
      id = null,
      titulo,
      descricao,
      exercicios,
      alunoId = null,
      professorId = null,
      createdAt = new Date(),
    }) {
      this.id = id; // id pode ser null ao criar antes de salvar no banco
      this.titulo = titulo;
      this.descricao = descricao;
      this.exercicios = exercicios; // array de strings, ex: ["Supino 3x14", "Agachamento 4x10"]
      this.alunoId = alunoId;
      this.professorId = professorId;
      this.createdAt = createdAt; }
    }