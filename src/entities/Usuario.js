export default class Usuario {
    constructor({ cpf, email, senha, telefone, endereco, nome, tipo_usuario,titulo_objetivo,descricao_objetivo }) {
    
      this.cpf = cpf;
      this.email = email;
      this.senha = senha;
      this.telefone = telefone;
      this.endereco = endereco;
      this.nome = nome;
      this.tipo_usuario = tipo_usuario;
      this.titulo_objetivo = titulo_objetivo;
      this.descricao_objetivo = descricao_objetivo;
  
    }

  }
  