// Exemplo: src/data/models/FichaTreino.js
class FichaTreino {
  constructor({ id, alunoId, professorId, dataCriacao, objetivo, nomeProfessor, exercicios }) {
    this.id = id;
    this.alunoId = alunoId;
    this.professorId = professorId;
    this.dataCriacao = dataCriacao;
    this.objetivo = objetivo;
    this.nomeProfessor = nomeProfessor; // Adicionar este campo
    this.exercicios = exercicios || []; // Adicionar este campo como um array
  }
}
export default FichaTreino;