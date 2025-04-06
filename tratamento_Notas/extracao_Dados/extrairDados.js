/*const fs = require("fs");
const PDFParser = require("pdf2json");
const NotaFiscal = require("../../src/models/NotaFiscal.js");

const gerarDocTxt = async(nota, caminho)=>{
    console.log(nota)
    const pdfParser = new PDFParser(this, 1);
    
    pdfParser.on("pdfParser_dataError", (errData) => console.error(errData.parserError));

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
         let conteudo = pdfParser.getRawTextContent()
         if(conteudo){

         }else{
            console.log("Erro ao ler o arquivo PDF")
         }
    });
    pdfParser.loadPDF(nota.caminho);
}




module.exports={gerarDocTxt}

*/