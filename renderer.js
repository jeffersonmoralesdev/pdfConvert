//console.log("rederer executou!!!!!!!!!",api.verElectron())
/*




const botao = document.getElementById('uploadFiles')
const docPdf = document.getElementById('inputPdf')
const listPdf = [];
var files = null;
*/
let lista = document.querySelector('.subBox');
let msg = document.getElementById('msg')
let rmvBtn = document.querySelectorAll('.remove-button')
let arquivos = [];

document.getElementById("selecionarArquivo").addEventListener("click", async () => {
  
  if (arquivos.length > 9){
    alert('Você ja atingiu limite maximo de arquivos selecionados! Maximo:10')
    return
  }
  const dadosArquivos = await electronAPI.abrirDialogoArquivo(arquivos.length);
  if (dadosArquivos === null){
    console.log("dados null")
    return;
  }else if (dadosArquivos instanceof Array){
    dadosArquivos.forEach((dados)=>{
      
            if (arquivos.length > 0) {
              ///console.log("resultado: entrou no primeiro if ")
              
              arquivos = [...arquivos, dados];
            } else {
              msg.innerHTML=''
              arquivos.push(dados);
            }    
    })
  }
  updateLista(arquivos)
});

const updateLista = (arquivo) => {  
    if(!arquivos.length > 0){
      msg.innerHTML='Nenhum arquivo selecionado';
    }

    // observação função map retorna item a item nem que seja implicito. foreach não retorna apenas percorre array
    lista.innerHTML = arquivo.map((item, index) =>{ 
      return `<div class='item'>
                <span title='${item.name}'>
                  ${item.name}
                </span>
                <button type='button' class='remove-button' data-index='${index}'>❌</button>
              </div>`
    }).join("");

    document.querySelectorAll('.remove-button').forEach(button=>{
        button.addEventListener('click',()=>{
          const index = parseInt(button.CDATA_SECTION_NODE.index)
          removerItem(index);
        })
    })
}

// Função para remover um item da lista
const removerItem = (index) => {

  console.log(arquivos)
  // Remove o item no índice especificado
  arquivos.splice(index, 1);

  // Atualiza a lista após a remoção
  updateLista(arquivos);
}

document.querySelector('.process-button').addEventListener('click', async ()=>{
   if(arquivos.length > 0){
      const process = electronAPI.processarPDF(arquivos)
   }else{
      alert('selecione ao menos 1 arquivo!!!')
   } 
})

/*lista = document.getElementById('selected')
msg = document.getElementById('fileNames')
let arquivos = null;

document.getElementById("selecionarArquivo").addEventListener("click", async () => {
  const dadosArquivos = await window.electronAPI.abrirDialogoArquivo();

  
  if (dadosArquivos) {
     updateLista(dadosArquivos)
    //arquivos = {filePath.name, filePath.caminho}
  
    //console.log('nome do caminho',arquivos)
      /*document.getElementById("caminhoArquivo").textContent = filePath;
      window.electronAPI.processarPDF(filePath); // Envia o caminho para o backend
      
  }
});

const updateLista =(dadosArquivos)=>{
    if(!arquivos){
      arquivos = [dadosArquivos]
      fileNames.innerHTML=''
    }else{

      arquivos = [...arquivos, dadosArquivos]
      console.log("XXX",arquivos)
    }

    lista.innerHTML = arquivos.map((item,index)=>`
      <div>
        <p>${item}</p>
        <button onclick="removerItem(${index})">Excluir</button>
      </div>
      `).join("");

    
}

const removerItem = (index) => {
  // Remove o item no índice especificado
  arquivos.splice(index, 1);

  // Atualiza a lista após a remoção
  updateLista();
}
*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*docPdf.addEventListener('change',function(){
  console.log("eventosssssss:",event)
  files = event.target.files.file;

})*/

/*botao.addEventListener('click',function(){
  console.log("vc clickou no button")
  if (docPdf.files.length > 0) {
    const file = docPdf.files[0]; // Obtém o arquivo

    console.log("Arquivo selecionado:", file); // Debug
    api.extracaoDados({ name: file.name, path: file.path || null }); // Envia para o main
  } else {
    console.log("Nenhum arquivo selecionado!");
  }
  
})
console.log("botão:",chama)
//<button type="button" id="chama" class="upload-button" onclick="chamou()">📤 Carregar PDFs</button>
/*const uploadFiles=()=>{
  console.log("clickou")
  //window.api.open()
}*/
/*
document.getElementById('inputPdf').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileNames').innerText = file.name;
    }
});

document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('inputPdf');
    if (fileInput.files.length === 0) {
        alert('Selecione um arquivo PDF primeiro!');
        return;
    }

    const filePath = fileInput.files[0].path; // Obtém o caminho do arquivo
    window.Electron.sendPdf(filePath);
});

// Quando receber o texto processado, exibir na interface
window.electron.onPdfProcessed((data) => {
    document.getElementById('outputText').innerText = data;
});
*//*

// No código do seu renderer (HTML/JS)
document.getElementById('inputPdf').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      document.getElementById('fileNames').innerText = file.name;
    }
  });
  
  document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('inputPdf');
    if (fileInput.files.length === 0) {
      alert('Selecione um arquivo PDF primeiro!');
      return;
    }
  
    const filePath = fileInput.files[0].path; // Obtém o caminho do arquivo
    window.electron.sendPdf(filePath); // Envia para o processo principal
  });
  
  // Quando receber o texto processado, exibir na interface
  window.electron.onPdfProcessed((data) => {
    document.getElementById('outputText').innerText = data;
  });
  */