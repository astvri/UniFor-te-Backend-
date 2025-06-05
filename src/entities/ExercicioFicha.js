export default class ExercicioFicha {
  constructor({ id, nome_treino, descricao, professor_nome, aluno_id, exercicios }) {
    this.id = id; 
    this.nome_treino = nome_treino;
    this.descricao = descricao;
    this.professor_nome = professor_nome;
    this.aluno_id = aluno_id; 
    this.exercicios = exercicios || []; 
  }
}

