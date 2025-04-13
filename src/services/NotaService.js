const PDFParser = require("pdf2json");
const NotaFiscal = require("../models/NotaFiscal");

class NotaService {
   
    static async extrairDadosNota(nota) {
        return new Promise((resolve, reject) => {

            const pdfParser = new PDFParser(this, 1);
           
            pdfParser.on("pdfParser_dataError", (errData) => console.error(errData.parserError));
            
            pdfParser.on("pdfParser_dataReady", async (pdfData)=>{
                let conteudo = pdfParser.getRawTextContent()
                if(conteudo){
                    try {
                        this.tratarDadosExtraidos(conteudo)
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }else{
                    reject("Erro ao ler o arquivo PDF")
                }
            });
            pdfParser.loadPDF(nota.caminho);
        
        })
    }

    static async #extrairTransacoes(linha){
        const regex = /(B3\s?RV\s?LISTADO)\s*([cv])\s*((?:OPCAO\s?DE\s?(?:compra|venda)|vista|fracionario))(?:([0-9]{2}\/[0-9]{2}))?/i;
    // Remove espaços extras    
        linha = linha.replace(/\s+/g, " ");

    // Obtém e remove o último caractere (indica crédito ou débito)
        linha = linha.trimEnd()
        let creditoDebito = linha.slice(-1);
        linha = linha.slice(0, -1)  
    
    // Aplica regex para capturar informações principais
        const match = linha.match(regex);

        if (!match) {
            console.error(`Erro ao processar linha: "${linha}"`);
            return null;
        }
    // Armazena as informações extraídas pela regex
        let [ _, b3, operacao, mercado, vencimento ] = match
        vencimento = vencimento || null
    
    // Remove o trecho correspondente à regex da string original
        linha = linha.replace(match[0],'')

    // Filtra somente números
        const numerosEncontrados = linha.match(/[\d.,]+/g);
        if (!numerosEncontrados) {
            return null;
        }
        let numeros = numerosEncontrados[numerosEncontrados.length - 1];
    
    // Remove os números da string para obter o ativo
        let ativo = linha.replace(numeros, '').trim();

    // Substitu '.' por ''    
        numeros = numeros.replace(/\./g, '')
    
    // Encontra a posição da vírgula
        const posVirgula = numeros.indexOf(',');
        if (posVirgula === -1) {
            console.error(`Erro ao localizar vírgula nos números: "${numeros}"`);
            return null;
        }

    // Divide os números para extrair quantidade e valor unitário 
        let quantidadeValorStr = numeros.slice(0, posVirgula + 3).replace(',','.')
    
    // Divide os números para extrair valor total 
        const valorTotal = Number(numeros.slice(posVirgula + 3).replace(',','.'));
    
        //inicia contador 
        let i = 1
        let valorUnitario,quantidade;

    // Loop para encontrar a quantidade e o valor unitário corretos
        do {
            //encontra posição ','
                const posPonto = quantidadeValorStr.indexOf('.')
                if (posPonto === -1) {
                console.error(`Erro ao localizar vírgula nos valores de quantidade: "${quantidadeValorStr}"`);
                return null;
                }
            //separa numeros inicando na posição da ','- 'i' que na primeira passagem sera 1 casa 
            // antes da virgula resultando assim em um suposto valor por unidade que sera verificada 
            //a cada interação do laço
                valorUnitario = Number(quantidadeValorStr.slice(posPonto - i));
            //separa numeros inicando na posição '0' até ',' - 'i' que na primeira passagem sera 1 casa 
            // antes da virgula resultando assim em um suposto valor por unidade que sera verificada 
            //a cada interação do laço
                quantidade = Number(quantidadeValorStr.slice(0, posPonto - i));
                
            //incrementa 1 a cada passagem
                i++
            //verifica se condição foi satisfeita 
        } while ( quantidade * valorUnitario !== valorTotal);

        return {
            b3,
            operacao,
            mercado,
            vencimento,
            ativo,
            creditoDebito,
            quantidade: Number(quantidade),
            valorUnitario,
            valorTotal
        }

    }

    static async tratarDadosExtraidos(conteudo) {
        let listaNotas=[];
        
        let nota = null;
       let paginas = conteudo.split("Page");
        //let transacao = [];
       
        paginas.pop(); 
        //pag = pag[1]

        for(const pag of paginas){
            let transacoesPendentes=[];
            let [n_Nota,folha]=[null,null]
            let dataNota = null; 
            let resumoFinanceiro = {}

            let linhas = pag.split("\n")
            let index = 0;
            for (const linha of linhas){
                if(index === linhas.length-1){

                    listaNotas.push(nota)
                    nota = null;
                    transacoesPendentes = [];
                }

                let linhaMinuscula = linha.toLowerCase()
                if(linhaMinuscula.includes("nr. nota")){
                    dataNota = linhaMinuscula.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)[0];
                    [n_Nota,folha] = linhaMinuscula.match(/[\d]+/g);
                    nota = new NotaFiscal(n_Nota, dataNota, folha);
                }

                if (transacoesPendentes.length > 0) {
                    if (nota instanceof NotaFiscal) {
                        for (const transacao of transacoesPendentes) {
                            nota.adicionarTransacao(transacao);
                        }
                        transacoesPendentes=[]; // Limpa o array após adicionar as transações
                    }
                }

                if(linhaMinuscula.includes("b3")){ 
                    let reposta = await this.#extrairTransacoes(linhaMinuscula)
                    transacoesPendentes.push(reposta)
                }

                let resumoFinanceiroLista =[
                    {regex:/valor\s?líquido\s?das\s?operações/i, key: "valor_líquido_das_operacoes", secao:"clearing"},
                    {regex:/taxa\s?de\s?liquidação/i, key: "taxa_de_liquidacao", secao:"clearing"},
                    {regex:/taxa\s?de\s?registro/i, key: "taxa_de_registro", secao:"clearing"},
                    {regex:/total\s?cblc/i, key: "total_cblc", secao:"clearing"},
                    {regex:/taxa\s?de\s?termo/i, key: "taxa_de_termo", secao:"bolsa"},
                    {regex:/taxa\s?a.n.a/i, key: "taxa_ana", secao:"bolsa"},
                    {regex:/emolumentos/i, key: "emolumentos", secao:"bolsa"},
                    {regex:/total\s?bovespa/i, key: "total_bovespa", secao:"bolsa"},
                    {regex:/taxa\s?operacional/i, key: "taxa_operacional", secao:"operacional"},
                    {regex:/execução/i, key: "execucao", secao:"operacional"},
                    {regex:/taxa\s?de\s?custódia/i, key: "taxa_custodia", secao:"operacional"},
                    {regex:/impostos/i, key: "impostos", secao:"operacional"},
                    {regex:/i.r.r.f/i, key: "irrf", secao:"operacional"},
                    {regex:/outros/i, key: "outros", secao:"operacional"},
                    {regex:/total\s?custos/i, key: "total_custos", secao:"operacional"},
                    {regex:/líquido\s?para/i, key: "liquido", secao:"operacional"},      
                ]

                for(const campo of resumoFinanceiroLista){
                    if(campo.regex.test(linhaMinuscula)){
                        const valor = linhaMinuscula.match(/[\d.,]+/g)[0].replace('.','').replace(',','.');
                        if(valor){
                            nota.atualizarResumoFinanceiro(campo.key,valor,campo.secao)
                        }else resumoFinanceiro[campo.secao][campo.key] = 0;
                       
                        break;
                    }
                }

                index++
            }
        }
    }

}

module.exports = NotaService;