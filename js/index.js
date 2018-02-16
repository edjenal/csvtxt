$('#closeAlertSucesso').on('click', function() {
  $("#alertSucesso").hide();
});

$('#closeAlertErro').on('click', function() {
  $("#alertErro").hide();
});

function checkFile(file) {
  $("#alertSucesso").hide();
  $("#alertErro").hide();

  var extension = file.substr((file.lastIndexOf('.') +1));
  if (!/(csv|CSV)$/ig.test(extension)) {
    $("#alertErroDetalhe").html('<strong>Erro</strong>, arquivo inválido. Favor usar um arquivo CSV!');
    $("#alertErro").show();
    return false;
  } else {
    return true;
  }
}

function getData() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('_');
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

document.getElementById('file').onchange = function(){

  var file = this.files[0];

  if (checkFile(file.name)) {
    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file // console.log(this.result);

      // Lines
      var lines = this.result.split('\n');
      var novoArquivo = "";
      
      for(var line = 0; line < lines.length; line++){
        
        var linha = lines[line];

        if (linha.split(";;;").length > 1 || linha == "") {
        } else {

          if (linha.split(";").length > 1) {
            var coluna = linha.split(';');
            
            var prefixo = coluna[0].toString();
            var data = coluna[2].replace(/\//g,"");
            var kmRodado = (Math.round(coluna[3])).toString();

            if (kmRodado != "0") {
              while(prefixo.length<7){
                prefixo = "0"+prefixo;
              }

              while(kmRodado.length<4){
                kmRodado = "0"+kmRodado;
              }

              novoArquivo += prefixo+data+"23"+kmRodado+"\r\n";
            }
          }
        }
      }

      document.getElementById("out").innerText = novoArquivo;

      $("#out").css("display", "");
      
      $("#alertSucessoDetalhe").html('Arquivo TXT gerado com  <strong>sucesso!</strong>');
      $("#alertSucesso").show();
      
      download(novoArquivo, 'conversao_'+getData()+'.txt', 'text/plain');
    };
    reader.readAsText(file);
  }
};