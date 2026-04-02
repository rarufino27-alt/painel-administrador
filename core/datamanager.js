const DataManager = {

  rotas: [],
  indice: {},

  async carregar(){

    try{

      // 🔥 CARREGA LISTA DE ARQUIVOS
      const lista = await fetch("./data/index.json?v=" + Date.now())
        .then(r => r.json());

      const respostas = await Promise.all(
        lista.map(nome =>
          fetch("./data/" + nome + "?v=" + Date.now())
            .then(r => {
              if(!r.ok){
                throw new Error("Erro ao carregar " + nome);
              }
              return r.json();
            })
        )
      );

      let dados = [];

      respostas.forEach(bloco => {

        // FORMATO ARRAY
        if(Array.isArray(bloco)){
          dados.push(...bloco);
        }

        else{

          for(const chave in bloco){

            const valor = bloco[chave];

            // FORMATO DESTINO COM ORIGENS
            if(valor && Array.isArray(valor.origens)){

              valor.origens.forEach(origem => {
                dados.push({
                  origem,
                  destino: chave,
                  valor: Number(valor.valor),
                  regiao: "Cabo"
                });
              });

            }

            // FORMATO POR ORIGEM
            else if(Array.isArray(valor)){

              valor.forEach(item => {
                dados.push({
                  origem: chave,
                  destino: item.destino,
                  valor: Number(item.valor),
                  regiao: item.regiao || "Cabo"
                });
              });

            }

          }

        }

      });

      // 🔥 NORMALIZAÇÃO
      dados = this.validar(dados);

      this.rotas = dados;

      this.criarIndice();

      console.log("✅ Rotas carregadas:", this.rotas.length);

    }catch(e){

      console.error("❌ ERRO DataManager:", e);

    }

  },

  validar(lista){

    const vistos = new Set();
    const resultado = [];

    lista.forEach(item => {

      if(!item?.origem || !item?.destino) return;

      const origem = item.origem.trim();
      const destino = item.destino.trim();
      const valor = Number(item.valor);

      if(isNaN(valor)) return;

      const chave = origem.toLowerCase() + "|" + destino.toLowerCase();

      if(vistos.has(chave)) return;

      vistos.add(chave);

      resultado.push({
        origem,
        destino,
        valor,
        regiao: item.regiao || "Cabo"
      });

    });

    return resultado;

  },

  criarIndice(){

    this.indice = {};

    this.rotas.forEach(r => {

      if(!this.indice[r.origem]){
        this.indice[r.origem] = {};
      }

      this.indice[r.origem][r.destino] = r.valor;

      // 🔥 BIDIRECIONAL AUTOMÁTICO
      if(!this.indice[r.destino]){
        this.indice[r.destino] = {};
      }

      this.indice[r.destino][r.origem] = r.valor;

    });

  },

  listarOrigens(){
    return Object.keys(this.indice).sort();
  },

  listarDestinos(origem){
    return this.indice[origem]
      ? Object.keys(this.indice[origem]).sort()
      : [];
  },

  buscarValor(origem, destino){

    return this.indice[origem]?.[destino] ?? null;

  }

};
