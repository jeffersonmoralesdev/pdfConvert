const ExcelJS = require('exceljs');
const NotaFiscal = require('../models/NotaFiscal');

class ExcellReportService {
    #workbook;
    #sheet;
    #indexRow = 2;

    constructor(name) {
        this.#workbook = new ExcelJS.Workbook();
        this.#sheet = this.#workbook.addWorksheet(name);
        this.#setSheetColumns();
    }

    #setSheetColumns() {
        this.#sheet.columns = [
            { key: 'coluna_A', width: 5  },
            { key: 'coluna_B', width: 23 },
            { key: 'coluna_C', width: 20 },
            { key: 'coluna_D', width: 17},
            { key: 'coluna_E', width: 23 },
            { key: 'coluna_F', width: 15 },
            { key: 'coluna_G', width: 20 },
            { key: 'coluna_H', width: 20 },
            { key: 'coluna_I', width: 15 },
            { key: 'coluna_J', width: 20 },
            { key: 'coluna_K', width: 15 },
            { key: 'coluna_L', width: 17 },
            { key: 'coluna_M', width: 15 }       
        ];   
    }
    
    //FUNÇÃO QUE MESCLA AS CELULAS
    #mergeCellRow(sheet, indexRow, descricaoHeader=null){

        if(descricaoHeader === 'subTitle'){
            sheet.mergeCells(`B${indexRow}:C${indexRow}`);
            sheet.mergeCells(`D${indexRow}:D${indexRow}`);
            sheet.mergeCells(`E${indexRow}:F${indexRow}`);
            sheet.mergeCells(`G${indexRow}:H${indexRow}`);  
            sheet.mergeCells(`I${indexRow}:K${indexRow}`);
            sheet.mergeCells(`L${indexRow}:M${indexRow}`);
        }else if(descricaoHeader === 'title'){
            sheet.mergeCells(`B${indexRow}:M${indexRow}`);
        }else{
            //console.log(indexRow)
            sheet.mergeCells(`B${indexRow}:J${indexRow}`);
            sheet.mergeCells(`K${indexRow}:M${indexRow}`);
        }    

    }

    //FUNÇÃO QUE CRIA O HEADER DA TABELA
    #createHeader(sheet, header, indexRow, indiceLetras, descricaoHeader = null){
        
        indiceLetras.forEach((letra, index) => {
        
            //ESCREVE O HEADER NA CELULA
            sheet.getCell(`${letra}${indexRow}`).value = header[index];
            
            //DEIXA O TEXTO EM NEGRITO E TAMANHO 12
            sheet.getCell(`${letra}${indexRow}`).font = { bold: true, size: 12 };
            
            //CENTRALIZA O TEXTO
            sheet.getCell(`${letra}${indexRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
            
            //DEFINI BORDAS DA CELULA QUE CONTEM OS HEADERS
            sheet.getCell(`${letra}${indexRow}`).border = { 
                top: { style: 'medium', color: { argb: 'FF000000' } },
                bottom: { style: 'medium', color: { argb: 'FF000000' } },
                left: { style: 'medium', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } }
            } 
            //DEFINI A COR DE FUNDO DA CELULA
            if(descricaoHeader === 'subTitle'){
                sheet.getCell(`${letra}${indexRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3E3E3' } }
            }else if(descricaoHeader === 'title'){
                sheet.getCell(`${letra}${indexRow}`).font = {color:{argb:'FFFFFFFF'}, bold: true, size: 16 };
                sheet.getCell(`${letra}${indexRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } }
            }else{
                sheet.getCell(`${letra}${indexRow}`).alignment = { horizontal: 'center', vertical: 'middle' };            
            }
        });

    }

    #defineEstiloCelulasCentrais(sheet, letra, indexRow, direcao=null){
        let borda={};
        if (letra === 'E' || letra === 'L' )
        sheet.getCell(`${letra}${indexRow}`).alignment ={horizontal:'center',vertical:'middle'}  
    
        if(direcao === 'right'){
            borda.right = 'medium'
            borda.left = 'hair'
        }else if(direcao === 'left'){
            borda.left = 'medium'
            borda.right = 'hair'
        }else{
            borda.left = 'hair'
            borda.right = 'hair'
        }
        
        sheet.getCell(`${letra}${indexRow}`).border = {
            top: { style: 'hair', color: { argb: 'FF000000' } },
            bottom: { style: 'hair', color: { argb: 'FF000000' } },
            right: { style: borda.right, color: { argb: 'FF000000' } },
            left: { style: borda.left, color: { argb: 'FF000000' } }
        }
    }

    #formataMoeda(sheet, letra, indexRow){
        sheet.getCell(`${letra}${indexRow}`).numFmt = 'R$ #,##0.00';
        sheet.getCell(`${letra}${indexRow}`).alignment ={horizontal:'center',vertical:'middle'}
    }


    criarDocXlxs = (relatorio,name,caminho)=>{ 
        const header = ['Especificação do Título', 'Mercado', 'Quantidade', 'Preço', 'Valor Operação', 'Débito/Crédito'];
        const indiceHeader = ["B","D","E","G","I","L"];
    
        const taxa = ['valor liq. operações','taxa liquidação', 'taxa registro', 'taxa de termo/opções', 'taxa A.N.A', 'taxa emolumentos', 'taxa operacional', 'execução', 'taxa de custódia', 'impostos', 'I.R.R.F', 'outros'];
        const indiceTaxas = ["B","C","D","E","F","G","H","I","J","K","L","M"];
       
    
        this.#sheet.columns = [
            { key: 'coluna_A', width: 5  },
            { key: 'coluna_B', width: 23 },
            { key: 'coluna_C', width: 20 },
            { key: 'coluna_D', width: 17 },
            { key: 'coluna_E', width: 23 },
            { key: 'coluna_F', width: 15 },
            { key: 'coluna_G', width: 20 },
            { key: 'coluna_H', width: 20 },
            { key: 'coluna_I', width: 15 },
            { key: 'coluna_J', width: 20 },
            { key: 'coluna_K', width: 15 },
            { key: 'coluna_L', width: 17 },
            { key: 'coluna_M', width: 15 }
        ];
    
        for(const nota of relatorio) {
            if(nota instanceof NotaFiscal){
                this.#mergeCellRow(this.#sheet, this.#indexRow, 'title');
                let tituloNota = [`N°${nota.toJSON().numero}`];
                this.#createHeader(this.#sheet,tituloNota, this.#indexRow, ["B"],"title");
                this.#indexRow ++;
        
                this.#mergeCellRow(this.#sheet, this.#indexRow, 'subTitle');
                this.#createHeader(this.#sheet, header, this.#indexRow, indiceHeader, "subTitle");
                this.#indexRow ++;
                
                nota.toJSON().transacoes.forEach((transacao, index) => {
                    this.#mergeCellRow(this.#sheet, this.#indexRow, 'subTitle');
                    this.#sheet.getCell(`B${this.#indexRow}`).value = transacao.ativo;
                    this.#sheet.getCell(`D${this.#indexRow}`).value = transacao.mercado;
                    this.#sheet.getCell(`E${this.#indexRow}`).value = transacao.quantidade;
                    this.#sheet.getCell(`G${this.#indexRow}`).value = transacao.valorUnitario;
                    this.#sheet.getCell(`I${this.#indexRow}`).value = transacao.valorTotal;
                    this.#sheet.getCell(`L${this.#indexRow}`).value = transacao.creditoDebito;
                    
                    indiceHeader.forEach(letra=>{
                        
                        if(letra === 'G' || letra ==='I' )this.#formataMoeda(this.#sheet, letra, this.#indexRow)
                        
                        if(letra === indiceHeader[0]){
                            this.#defineEstiloCelulasCentrais(this.#sheet, letra, this.#indexRow, 'left')
                        }else if(letra === indiceHeader[indiceHeader.length-1]){    
                            this.#defineEstiloCelulasCentrais(this.#sheet, letra, this.#indexRow, 'right')
                        }else{
                            this.#defineEstiloCelulasCentrais(this.#sheet, letra, this.#indexRow)
                        }
                    })
        
                    this.#indexRow ++;
                });
                this.#createHeader(this.#sheet, taxa, this.#indexRow, indiceTaxas, "subTitle");
                this.#indexRow ++;
                
                this.#sheet.getCell(`B${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.clearing.valor_líquido_das_operacoes;
                //definir estilo e adicionar moeda padrão após. implemntar no codigo principal
                this.#sheet.getCell(`C${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.clearing.taxa_de_liquidacao;
                this.#sheet.getCell(`D${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.clearing.taxa_de_registro;
                this.#sheet.getCell(`E${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.bolsa.taxa_de_termo;
                this.#sheet.getCell(`F${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.bolsa.taxa_ana;
                this.#sheet.getCell(`G${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.bolsa.emolumentos;
                this.#sheet.getCell(`H${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.taxa_operacional;
                this.#sheet.getCell(`I${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.execucao;
                this.#sheet.getCell(`J${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.taxa_custodia;
                this.#sheet.getCell(`K${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.impostos;
                this.#sheet.getCell(`L${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.irrf;
                this.#sheet.getCell(`M${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.outros;
                indiceTaxas.forEach((letra,index) => {
                    this.#formataMoeda(this.#sheet,letra, this.#indexRow);
                    if (index === 0){
                        this.#defineEstiloCelulasCentrais(this.#sheet, letra,this.#indexRow,'left')
                    }else if(index === indiceTaxas.length - 1){
                        this.#defineEstiloCelulasCentrais(this.#sheet, letra,this.#indexRow,'right')
                    }else{
                        this.#defineEstiloCelulasCentrais(this.#sheet, letra,this.#indexRow)
                    }
                })
                this.#indexRow ++;
                this.#mergeCellRow(this.#sheet,this.#indexRow)
                this.#createHeader(this.#sheet,['total liquido'],this.#indexRow,['B'],'subTitle')
                this.#sheet.getCell(`K${this.#indexRow}`).value = nota.toJSON().resumoFinanceiro.operacional.liquido;
                this.#formataMoeda(this.#sheet,'K', this.#indexRow)
                this.#sheet.getCell(`K${this.#indexRow}`).font={ bold:'true', size:14}
                this.#sheet.getCell(`K${this.#indexRow}`).border = {
                    top:{style:'medium', color:{argb: 'FF000000'}},
                    bottom:{style:'medium', color:{argb: 'FF000000'}},
                    right:{style:'medium', color:{argb: 'FF000000'}},
                    left:{style:'medium', color:{argb: 'FF000000'}}
                }
        
        
                this.#indexRow ++;
                this.#indexRow ++;
                this.#indexRow ++;
            }    
        }
        name = name.replace('.pdf', ''); 
        this.#workbook.xlsx.writeFile(`${caminho}\\${name}.xlsx`).then(() => {
            console.log('Planilha criada com sucesso!');
        });

    }   


}
module.exports = ExcellReportService;