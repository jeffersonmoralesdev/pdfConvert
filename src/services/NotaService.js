const PDFParser = require("pdf2json");

class NotaService {
    static async extrairDadosNota(nota) {
        const pdfParser = new PDFParser(this, 1);
            
            pdfParser.on("pdfParser_dataError", (errData) => console.error(errData.parserError));
        
            pdfParser.on("pdfParser_dataReady", async (pdfData) => {
                 let conteudo = pdfParser.getRawTextContent()
                 if(conteudo){
                    this.#tratarDadosExtraidos(conteudo)
                 }else{
                    console.log("Erro ao ler o arquivo PDF")
                 }
            });
            pdfParser.loadPDF(nota.caminho);
    }

    static #tratarDadosExtraidos(conteudo) {
        let listaNotas=[]
        let paginas = conteudo.split("Page");
        paginas.pop(); 
        //console.log("paginas:", paginas);

        for(const pag of paginas){
            for (const linha of pag.split("\n")){
                
            }
            
        }
        

    }

}

module.exports = NotaService;