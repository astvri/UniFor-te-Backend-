export default class ExercicioFicha {
    constructor({ id, ficha_id, nome_exercicio, series, repeticoes, carga, observacoes }) {
      this.id = id;
      this.ficha_id = ficha_id;
      this.nome_exercicio = nome_exercicio;
      this.series = series;
      this.repeticoes = repeticoes;
      this.carga = carga;
      this.observacoes = observacoes;
    }
  }
  