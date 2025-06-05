export default class Professor {
  constructor({ id_usuario, especialidade }) {
    this.id_usuario = id_usuario;
    this.especialidade = especialidade;

    this.validar();
  }

  validar() {
    // Remove esta validação
    // if (!this.id || typeof this.id !== 'string') {
    //   throw new Error('ID é obrigatório e deve ser um UUID válido.');
    // }

    if (!this.especialidade || this.especialidade.length < 2) {
      throw new Error('Especialidade deve conter pelo menos 2 caracteres.');
    }
  }
}
