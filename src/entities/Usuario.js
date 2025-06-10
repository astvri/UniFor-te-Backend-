export default class Usuario {
    constructor({ cpf, email, senha, telefone, endereco, nome, tipo_usuario }) {
    
      this.cpf = cpf;
      this.email = email;
      this.senha = senha;
      this.telefone = telefone;
      this.endereco = endereco;
      this.nome = nome;
      this.tipo_usuario = tipo_usuario;
  
    }
  
   //  validar() {
    // Remove esta validação
      // if (!this.id || typeof this.id !== 'string') {
      //   throw new Error('ID é obrigatório e deve ser um UUID válido.');
      // }
  
      // if (!this.cpf || typeof this.cpf !== 'string' || this.cpf.length !== 11) {
        // throw new Error('CPF é obrigatório e deve conter 11 caracteres.');
      // }
  
      // if (!this.email || typeof this.email !== 'string' || !this.email.includes('@')) {
      //   throw new Error('Email é obrigatório e deve ser um email válido.');
      // }
  
      // if (!this.senha || typeof this.senha !== 'string' || this.senha.length < 6) {
      //   throw new Error('Senha é obrigatória e deve ter no mínimo 6 caracteres.');
      // }
   //  }
  }

