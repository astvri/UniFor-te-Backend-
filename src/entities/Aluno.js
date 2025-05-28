export default class Aluno {
    constructor({ id_usuario, objetivo }) {
      this.id_usuario = id_usuario;
      this.objetivo = objetivo;
  
      this.validar();
    }
  
    validar() {
 // Remove esta validação
      // if (!this.id || typeof this.id !== 'string') {
      //   throw new Error('ID é obrigatório e deve ser um UUID válido.');
      // }
  
      if (!this.objetivo || typeof this.objetivo !== 'string') {
        throw new Error('O objetivo é obrigatório e deve ser uma string.');
      }
    }
  }
  
