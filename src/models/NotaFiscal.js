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
              liquido_para: null,
            }
        };
    }

    adicionarTransacao(transacao) {
        this.#transacoes.push(transacao);
    }

}

module.exports = NotaFiscal;