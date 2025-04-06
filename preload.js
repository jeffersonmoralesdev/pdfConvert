// preload.js
const {contextBridge ,ipcRenderer} = require ('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  abrirDialogoArquivo: (quantidadeMaxima) => ipcRenderer.invoke('abrir-dialogo-arquivo',quantidadeMaxima),
  processarPDF: (files) => ipcRenderer.invoke('process-pdf', files)
});



/*console.log("funcionou preload")
//exemplo exibindo versão do electron no console
contextBridge.exposeInMainWorld('api',{
    verElectron: ()=> process.versions.electron,
    open:()=>ipcRenderer.send('mensagem-x'),
    extracaoDados:(filePath)=> ipcRenderer.send('process-pdf',filePath)
})
*/
//outro exemplo


/*const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendPdf: (filePath) => ipcRenderer.send('process-pdf', filePath),
  onPdfProcessed: (callback) => {
    ipcRenderer.on('pdf-processed', (_, data) => callback(data));
  }
});*/
/*const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendPdf: (filePath) => ipcRenderer.send('process-pdf', filePath),
    onPdfProcessed: (callback) => {
      ipcRenderer.on('pdf-processed', (_, data) => callback(data))
    }
});*/