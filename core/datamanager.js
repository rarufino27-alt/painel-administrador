const DataManager = {

  cache: {
    rotas: null,
    origens: null
  },

  // ===== FUNÇÃO INTERNA DE NORMALIZAÇÃO =====
  normalizar(texto){
    return texto
      ?.toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  // ===== CARREGAR ORIGENS =====
  async carregarOrigens(){

    if(this.cache.origens){
      return this.cache.origens;
    }

    const arquivos = [
      "condominio-porto-do-cabo.json",
      "gaibu.json",
      "enseadas.json",
      "setor-4.json",
      "xareu.json",
      "itapuama.json",
      "calhetas.json",
      "lote-garapu2-lote-dona-amara.json",
      "cohab.json",
      "centro-do-cabo.json",
      "shopping-costa-dourada.json",
      "aguia-american-club-br-101.json",
      "empresas.json",
      "engenhos.json",
      "hospitais-clinicas.json",
      "interurbanas.json",
      "interestaduais.json",
      "lazer-festa.json",
      "locais.json",
      "longas-locais.json",
      "praias.json",
      "bairro-sao-francisco-baixo.json"
    ];

    try{

      const respostas = await Promise.all(
        arquivos.map(async nome => {
          const r = await fetch("data/" + nome);
          if(!r.ok) return [];
          return await r.json();
        })
      );

      const rotasBrutas = respostas.flat();

      this.cache.rotas = rotasBrutas
        .filter(r => r.origem && r.destino && r.valor)
        .map(r => ({
          origem: r.origem.trim(),
          destino: r.destino.trim(),
          origemKey: this.normalizar(r.origem),
          destinoKey: this.normalizar(r.destino),
          valor: Number(r.valor)
        }));

      // GERAR LISTA COMPLETA DE LOCAIS (ORIGENS + DESTINOS)
      const locais = new Set();

      this.cache.rotas.forEach(r=>{
        locais.add(r.origem);
        locais.add(r.destino);
      });

      const origens = [...locais]
        .sort((a,b)=>a.localeCompare(b,'pt-BR'));

      this.cache.origens = origens;

      return origens;

    }catch(e){
      console.error("Erro ao carregar rotas:", e);
      return [];
    }
  },

  // ===== LISTAR DESTINOS (AGORA BIDIRECIONAL) =====
  listarDestinos(origem){

    if(!this.cache.rotas || !origem) return [];

    const origemKey = this.normalizar(origem);

    const destinos = [];

    this.cache.rotas.forEach(r=>{

      if(r.origemKey === origemKey){
        destinos.push(r.destino);
      }

      if(r.destinoKey === origemKey){
        destinos.push(r.origem);
      }

    });

    return [...new Set(destinos)]
      .sort((a,b)=>a.localeCompare(b,'pt-BR'));
  },

  // ===== BUSCAR VALOR (IDA OU VOLTA) =====
  buscarValor(origem, destino){

    if(!this.cache.rotas || !origem || !destino) return null;

    const o = this.normalizar(origem);
    const d = this.normalizar(destino);

    const rota = this.cache.rotas.find(r =>
      (r.origemKey === o && r.destinoKey === d) ||
      (r.origemKey === d && r.destinoKey === o)
    );

    return rota ? rota.valor : null;
  }

};

window.DataManager = DataManager;