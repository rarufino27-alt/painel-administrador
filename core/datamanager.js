const DataManager = {

  rotas: [],

  arquivos: [
    "./data/condominio-porto-do-cabo.json",
    "./data/gaibu.json",
    "./data/enseadas.json",
    "./data/setor-4.json",
    "./data/xareu.json",
    "./data/itapuama.json",
    "./data/calhetas.json",
    "./data/lote-garapu2-lote-dona-amara.json",
    "./data/cohab.json",
    "./data/centro-do-cabo.json",
    "./data/shopping-costa-dourada.json",
    "./data/aguia-american-club-br-101.json",
    "./data/empresas.json",
    "./data/engenhos.json",
    "./data/interurbanas.json",
    "./data/interestaduais.json",
    "./data/lazer-festa.json",
    "./data/locais.json",
    "./data/longas-locais.json",
    "./data/praias.json",
    "./data/bairro-sao-francisco-baixo.json"
  ],

  async carregar() {
    try {

      const respostas = await Promise.all(
        this.arquivos.map(a =>
          fetch(a).then(r => {
            if (!r.ok) throw new Error("Falha ao carregar " + a);
            return r.json();
          })
        )
      );

      this.rotas = respostas.flat();

      console.log("✅ Rotas carregadas:", this.rotas.length);

    } catch (e) {

      console.error("❌ Erro ao carregar rotas", e);
      throw e;

    }
  },

  listarOrigens() {

    const locais = new Set();

    this.rotas.forEach(r => {
      locais.add(r.origem);
      locais.add(r.destino);
    });

    return [...locais].sort();

  },

  listarDestinos(local) {

    const destinos = new Set();

    this.rotas.forEach(r => {

      if (r.origem === local) {
        destinos.add(r.destino);
      }

      if (r.destino === local) {
        destinos.add(r.origem);
      }

    });

    return [...destinos].sort();

  },

  buscarValor(origem, destino) {

    let rota = this.rotas.find(
      r => r.origem === origem && r.destino === destino
    );

    if (!rota) {
      rota = this.rotas.find(
        r => r.origem === destino && r.destino === origem
      );
    }

    return rota ? Number(rota.valor) : null;

  },

  calcularValorCompleto(origem, parada, destino) {

    if (!origem || !destino) return null;

    if (!parada) {
      return this.buscarValor(origem, destino);
    }

    const trecho1 = this.buscarValor(origem, parada);
    const trecho2 = this.buscarValor(parada, destino);

    if (trecho1 === null || trecho2 === null) return null;

    return trecho1 + trecho2;

  }

};