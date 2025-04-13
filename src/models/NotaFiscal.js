class NotaFiscal {
    #numero;
    #transacoes;
    #dataEmissao;
    #folha;
    #resumoFinanceiro ;

    constructor(numero, dataEmissao, folha) {
        this.#numero = numero;
        this.#dataEmissao = dataEmissao;
        this.#folha = folha;
        this.#transacoes = [];
        this.#resumoFinanceiro = {
            clearing:{ 
              valor_líquido_das_operacoes: null,
              taxa_de_liquidacao: null,
              taxa_de_registro: null,
              total_cblc: null,
            },
            bolsa:{
              taxa_de_termo: null,
              taxa_ana: null,
              emolumentos: null,
              total_bovespa: null,
            },
            operacional:{
              taxa_operacional: null,
              execucao: null,
              taxa_custodia: null,
              impostos: null,
              irrf: null,
              outros: null,
              total_custos: null,
              liquido: null,
            }
        };
    }

    adicionarTransacao(transacao) {
        this.#transacoes.push(transacao);
    }
    atualizarResumoFinanceiro(campo, valor, secao) {
        if(this.#resumoFinanceiro[secao] && this.#resumoFinanceiro[secao].hasOwnProperty(campo)){
            this.#resumoFinanceiro[secao][campo] = parseFloat(valor);
        }else{
            console.error(`Campo ${campo} não encontrado na seção ${secao}`);
        }
    }

    toJSON() {
      return {
          numero: this.#numero,
          dataEmissao: this.#dataEmissao,
          folha: this.#folha,
          transacoes: this.#transacoes,
          resumoFinanceiro: this.#resumoFinanceiro
      };
  }
  

}



module.exports = NotaFiscal;