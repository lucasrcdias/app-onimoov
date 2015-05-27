$(function () {
  var activeScreen = $(".home"),
      lastScreen = $(".home"),
      homeScreen = $(".home"),
      navbar = $(".nav"),
      query = '',
      alertBox = $(".alert");

  function toggleScreens(sc1, sc2, act) {
    if (!act.is(":visible")) {
      var t1 = sc1.length, //tamanho do array 1
        t2 = sc2.length; //tamanho do array 2
      for (var i = 0; i < t1; i++) //para cada tela da lista sc1, ele faz o fadeOut
        sc1[i].fadeOut();
      for (var i = 0; i < t2; i++) //para cada tela da lista sc2, ele faz o fadeIn
        sc2[i].fadeIn();
      
      lastScreen = activeScreen; //define como 'ultima' tela, o frame que estava sendo exibido
      activeScreen = act; //define o parâmetro 'act' como tela em exibição
    }
  }
  
  function varrerLinhasPorNumero(data, num){
    $.each(data.linhas, function (i, item) {
        if (parseInt(item.numero) == num){
          var ida = item.sentido.split("/")[0],
              volta = item.sentido.split("/")[1];
          $(".sentidos .container").append("<div class='box sentido' id='sentido"+ i +"' data-index='"+ i +"'>"+
                                           "  <div class='sentido-infos'>"+
                                           "     <span class='sentido-name'>"+ida+"</span>"+
                                           "    <i class='fa fa-arrow-down'></i>"+
                                           "    <span class='sentido-name'>"+volta+"</span>"+
                                           "  </div>"+
                                           "  <div class='sentido-btn'><span>VER HORÁRIO</span>"+
                                           "  </div>"+
                                           "</div>");
        }
    });
  }
  
  function pesquisarPorNumero(num){
    $(".section-title").text(num);
    $(".sentido").remove();
    var linhas = $.getJSON("assets/resources/linhas.json", function (data) {
      varrerLinhasPorNumero(data, num); //varre cada linha encontrada
    }).done(function(){
      if($(".sentido").length > 0){
        alertBox.fadeOut(function(){
          alertBox.removeClass("error");
          $(".alert h1").remove();
        });
        toggleScreens([activeScreen], [$(".sentidos"), $(".nav")], $(".sentidos"));
      }
      else showAlert("error", "Nenhuma linha encontrada!");
    });
  }
  
  function pesquisarPorPalavra(pal){
    var linhasEncontradas = [],
        linhas = $.getJSON("assets/resources/linhas.json", function (data) {
          $.each(data.linhas, function (i, item) {
            if ((this.id.indexOf(pal.toUpperCase()) > -1 || this.itinerario.indexOf(pal.toUpperCase()) > -1)) {
              if(linhasEncontradas.indexOf(this.numero) == -1){
                $(".linhas .container").append("<div class='box linha' id='linha"+this.numero+"' data-numero="+ this.numero +">"+
                                               "  <span class='linha-id'>"+this.numero+"</span>"+
                                               "  <b class='linha-name'>"+this.nome+"</b>"+
                                               "  <span class='see-more'>VER</span>"+
                                               "</div>");
                linhasEncontradas.push(this.numero);
              }
            }
          });
        }).done(function(){
          if($(".linha").length > 0){
            alertBox.fadeOut(function(){
              alertBox.removeClass("error");
              $(".alert h1").remove();
            });
            toggleScreens([activeScreen], [$(".linhas"), $(".nav")], $(".linhas"));
          }
          else showAlert("error", "Nenhuma linha encontrada!");
        });
  }
  
  function pesquisarPorIndex(indice){
    var linhas = $.getJSON("assets/resources/linhas.json", function (data) {
      console.log(data.linhas[indice].id);
    });
  }
  
  function showAlert(tipo, msg){
    if(!alertBox.is(":visible")){
      alertBox.addClass(tipo).append("<h1>"+msg+"</h1>").fadeIn();
      window.setTimeout(function(){
      alertBox.fadeOut(function(){
        alertBox.removeClass(tipo);
        $(".alert h1").remove();
      });
    }, 5000);
    }
  }
  
  $(".show-favorites").click(function () {
    toggleScreens([activeScreen], [$(".favoritos"), $(".nav")], $(".favoritos"));
  });
  
  $(".search-btn").click(function () {
    query = $("#" + $(this).data("input")).val();
    if (parseInt(query[query.length - 1]) && query.length > 2) {
      //se entrar aqui, o termo pesquisado é um número    
      //console.log("Pesquisou pelo número da linha");
      $(".sentido").remove();
      pesquisarPorNumero(query);      
    }
    else {
      //se entrar aqui, o termo pesquisado não é um número    
      //console.log("Não pesquisou pelo número da linha");
      $(".linha").remove();
      pesquisarPorPalavra(query);
    }
  });
  
  $(".go-back").click(function(){
    if(lastScreen.hasClass("home"))
      toggleScreens([activeScreen, $(".nav")], [lastScreen], lastScreen);
    else 
      toggleScreens([activeScreen], [lastScreen], lastScreen);
  });
  
  $(document).on('click','[id^="linha"]',function(){
    pesquisarPorNumero($(this).data("numero"));
    if(retornou)
      toggleScreens([activeScreen], [$(".sentidos"), $(".nav")], $(".sentidos"));
    retornou = false;
  });
  
  $(document).on('click','[id^="sentido"]',function(){
    $(".sentido").remove();
    pesquisarPorNumero($(this).data("numero"))
    toggleScreens([activeScreen], [$(".resultado"), $(".nav")], $(".resultado"));
    retornou = false;
  });
  //botão para mostrar o horário, na pagina do resultado
  $(".show-result").click(function(){
    var s = $("#"+$(this).data("result"));
    if(!s.is(":visible")){
      $(".result").slideUp();
      s.slideDown();
    }else s.slideUp();
  });
}(jQuery));