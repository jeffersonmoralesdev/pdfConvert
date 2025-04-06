require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

const { app, BrowserWindow, nativeTheme, ipcMain, dialog, Menu } = require('electron')
const path = require('node:path')
const fs = require('fs');
//const { gerarDocTxt } = require("./tratamento_Notas/extracao_Dados/extrairDados");
const NotaService = require("./src/services/NotaService.js")

const createWindow = () => {

    nativeTheme.themeSource='dark'
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon:'./img/icon_rounded.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    mainWindow.loadFile('index.html')
}   

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
//sempre retorna caminho documents
let caminho = app.getPath('documents').replace(/\\/g, '\\\\')
console.log("caca",caminho)

//caminho = caminho.replace(/\\/g, '\\\\'); // Substitui as barras invertidas por barras normais

//console.log("caminho", newCaminho)
const template=[
    {
        label:'Arquivo',
        submenu:[
            {
                label:'Salvar Como',
                click:async () => {
                    const result = await dialog.showOpenDialog({
                        title: 'Selecionar Pasta',
                        properties: ['openDirectory'], // Apenas diretórios serão mostrados
                    });
            
                    if (!result.canceled && result.filePaths.length > 0) {
                        caminho = result.filePaths[0] 
                        
                        console.log(`Pasta selecionada: ${caminho}`);
                        // Exemplo: Criar o arquivo na pasta selecionada
                        //const conteudo = "Dados extraídos do PDF...";
                        //const filePath = path.join(selectedFolder, 'dados.txt');
                        /*try {
                            fs.writeFileSync(filePath, conteudo, 'utf-8');
                            console.log(`Arquivo salvo em: ${filePath}`);
                        } catch (err) {
                            console.error('Erro ao criar o arquivo:', err);
                        }*/
                    }
                }
            }, 
            {
                label:'Sair',
                click:()=>app.quit(),
                accelerator:'Alt+F4'
            }
            
        ]

    },
    {
        label:'Exibir'
    },
    {
        label:'Ajuda'
    }
]






ipcMain.handle('abrir-dialogo-arquivo', async (_,quantidade) => {
    let arquivoRestantes = 10 - quantidade;
    const result = await dialog.showOpenDialog({
        properties: ['openFile','multiSelections'],
        filters: [{ name: 'PDFs', extensions: ['pdf'] }]
    });  

    if (result.filePaths && result.filePaths.length > arquivoRestantes) { // Limite de 10 arquivos
        dialog.showErrorBox('Erro', 'Você só pode selecionar no máximo 10 arquivos');
        return;
    }   
    lista = []
    if (!result.canceled && result.filePaths.length > 0) {
        result.filePaths.forEach((caminho)=>{
            
            const arquivo={
                caminho ,
                name:path.basename(caminho)
            }
            lista.push(arquivo)
        })
    } 
    return lista;
})
        
    /*
console.log("Caminho em Buffer:", Buffer.from(originalPath));
console.log("Caminho UTF-8 (decode):", Buffer.from(originalPath, 'binary').toString('utf-8'));
console.log("Caminho Unicode Normalizado (NFC):", originalPath.normalize('NFC'));
    */




//IPC >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.handle('process-pdf', async (_, filePath) => {
    if (!filePath) {
        console.log('Nenhum arquivo selecionado.');
        return;
    }

    for( const nota of filePath ){
        await NotaService.extrairDadosNota(nota)
    }
});





































/** 📌 Comunicação com o frontend para processar o PDF **/
/*ipcMain.on('process-pdf', async (event, filePath) => {
    try {
        console.log("nome arquivo")
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        console.log("Texto extraído do PDF:", data.text);
        
        // Envia o texto extraído de volta para o frontend
        event.reply('pdf-processed', data.text);
    } catch (error) {
        console.error("Erro ao processar o PDF:", error);
        event.reply('pdf-processed', `Erro: ${error.message}`);
    }
});







    //console.log("resultado",lista)
        /*const caminho = result.filePaths[0];
        const name = path.basename(caminho)
*/
    // Criar uma nova janela para exibir o PDF
   /* const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            plugins: true
        }
    });
    
    // Carregar o PDF na janela
    win.loadURL(`file://${filePath}`);
    */
      

/*fs.writeFileSync('log.txt', `Caminho original: ${result.filePaths[0]}`, 'utf-8');
const originalPath = result.filePaths[0];
*/
/*console.log("Caminho original:", originalPath);



*/
//////////////////////////////////////////////////////////////


















































/* resizable: false, // Evita redimensionamento que possa causar barra de rolagem
   autoHideMenuBar: false, // Oculta a barra de menu
   backgroundColor: '#222222', //mudar cor do titulo, 
   titleBarOverlay: {
        color: '#FFFF4FFF', // Cor da barra superior
        symbolColor: '#000000' // Cor dos ícones (minimizar, maximizar, fechar)
    }
    */