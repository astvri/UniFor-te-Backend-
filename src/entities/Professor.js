export default class Professor {
    constructor({ id_usuario, especialidade }) {
      this.id_usuario = id_usuario;
      this.especialidade = especialidade;
  
      this.validar();
    }
  
    validar() {
      if (!this.id_usuario || typeof this.id_usuario !== 'string') {
        throw new Error('ID do usuário é obrigatório e deve ser um UUID válido.');
      }
  
      if (!this.especialidade || this.especialidade.length < 2) {
        throw new Error('Especialidade deve conter pelo menos 2 caracteres.');
      }
    }
  }
  