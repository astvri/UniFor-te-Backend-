class FichaTreino {
    constructor(id, titulo, descricao, exercicios, alunoId = null, professorId = null, createdAt = new Date()) {
        this.id = id; // ID gerado pelo banco de dados (ex: Supabase)
        this.titulo = titulo;
        this.descricao = descricao;
        this.exercicios = exercicios; // Array de strings como ["Supino 3x14", "Agachamento 4x10"]
        this.alunoId = alunoId; // Opcional: Chave estrangeira para Aluno
        this.professorId = professorId; // Opcional: Chave estrangeira para Professor
        this.createdAt = createdAt;
    }
}

module.exports = FichaTreino;
