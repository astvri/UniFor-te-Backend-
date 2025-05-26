export default class Aluno {
    constructor({ id_usuario, objetivo }) {
      this.id_usuario = id_usuario;
      this.objetivo = objetivo;
  
      this.validar();
    }
  
    validar() {
      if (!this.id_usuario || typeof this.id_usuario !== 'string') {
        throw new Error('ID do usuário é obrigatório e deve ser um UUID válido.');
      }
  
      if (!this.objetivo || typeof this.objetivo !== 'string') {
        throw new Error('O objetivo é obrigatório e deve ser uma string.');
      }
    }
  }
  
