(function ($) {
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
      for (var i = 0; i < t1; i++){ //para cada tela da lista sc1, ele faz o fadeOut
        sc1[i].fadeOut();
      }
      for (var i = 0; i < t2; i++) {//para cada tela da lista sc2, ele faz o fadeIn
        sc2[i].fadeIn();
        if(sc2[i].has(".go-back")) {
          sc2[i].find(".go-back").attr("data-screen", activeScreen.selector);
        }
      }
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
      $("#id-linha").html(data.linhas[indice].id);
      $("#sentido-linha").html(data.linhas[indice].sentido);
      loadHorarios(data.linhas[indice].horarios);
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
  
  function pesquisar(query){
    query = siglas(query);
    if (parseInt(query.substring(0, query.length - 1)) && query.length > 2) {
      $(".sentido").remove();
      pesquisarPorNumero(query);      
    }
    else {
      $(".linha").remove();
      pesquisarPorPalavra(query);
    }
  }

  function loadHorarios(horarios) {
    var qtdHorarios = horarios.length,
      htmlHorarios = '';

    for (var i = 0; i < qtdHorarios; i++) {
      var listaHorario = horarios[i].horario.split('**'),
        tamListaHorario = listaHorario.length,
        htmlResult = 
          "<table>" +
          "  <thead>" +
          "    <tr><td>" + listaHorario[1] + "</td><td>" + listaHorario[2] + "</td><td>" + listaHorario[3] + "</td><td>" + listaHorario[4] + "</td></tr>" +
          "</thead>" +
          "<tbody>";
      //o for vai começar do 5, lembrando que por ser uma lista o primeiro índice é 0, então vamos começar do 6 item ou seja, 5º indice pois os 5 primeiros item (0, 4) são padrões.
      //vou decrementar 4 pois quero que ele vá até o último item - 4 para que eu possa avançar manualmente dentro do for.
      tamListaHorario -= 4;
      for (var y = 5; y < tamListaHorario; y += 4) {
        htmlResult += "<tr>";
        if (parseInt(listaHorario[y].split(":")[0]) <= 6)
          htmlResult += "<td>" + listaHorario[y] + "</td>";
        else htmlResult += "<td></td>";
        if (parseInt(listaHorario[y + 1].split(":")[0]) <= 12)
          htmlResult += "<td>" + listaHorario[y + 1] + "</td>";
        else htmlResult += "<td></td>";
        if (parseInt(listaHorario[y + 2].split(":")[0]) <= 18)
          htmlResult += "<td>" + listaHorario[y + 2] + "</td>";
        else htmlResult += "<td></td>";
        if (parseInt(listaHorario[y + 3].split(":")[0]) <= 24)
          htmlResult += "<td>" + listaHorario[y + 3] + "</td>";
        else htmlResult += "<td></td>";
        htmlResult += "</tr>";
      }
      htmlResult += "   </tbody>" +
        " </table>" +
        "</div>";
      $("#" + (i + 1)).html(htmlResult);
      $(".show" + (i + 1)).fadeIn();
    }
  }
  
  $(".show-favorites").click(function () {
    toggleScreens([activeScreen], [$(".favoritos"), $(".nav")], $(".favoritos"));
  });
  
  $(".search-btn").click(function () {
    pesquisar($("#" + $(this).data("input")).val());    
  });
  
  $(".search-input").keyup(function(event) {
    if (event.which === 13)
      pesquisar($(this).val());      
  });
  
  $(".go-back").click(function(){
    var voltarPara = $($(this).data("screen")); 
    if(voltarPara.hasClass("home"))
      toggleScreens([activeScreen, $(".nav")], [voltarPara], voltarPara);
    else 
      toggleScreens([activeScreen], [voltarPara], voltarPara);
  });
  
  $(document).on('click','[id^="linha"]',function(){
    pesquisarPorNumero($(this).data("numero"));
    toggleScreens([activeScreen], [$(".sentidos"), $(".nav")], $(".sentidos"));
  });
  
  $(document).on('click','[id^="sentido"]',function(){
    pesquisarPorIndex($(this).data("index"))
    toggleScreens([activeScreen], [$(".resultado"), $(".nav")], $(".resultado"));
  });
  //botão para mostrar o horário, na pagina do resultado
  $(".show-result").click(function(){
    var s = $("#"+$(this).data("result"));
    if(!s.is(":visible")){
      $(".result").slideUp();
      s.slideDown();
    }else s.slideUp();
  });
  
  //todo o código para reconhecimento de voz

  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;


  var voiceAvailable = true;

  function upgrade() {
    $(".voice-toggler").fadeOut();
    voiceAvailable = false;
  }
  var two_line = /\n\n/g;
  var one_line = /\n/g;

  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  function siglas(s) {
    return s.toLowerCase().replace('jardim', 'jd.').replace('avenida', 'av.').replace('engenheiro', 'eng.').replace('vila', 'vl.').replace('parque', 'pq.').replace('doutor', 'dr').replace('bosque', 'bq.').replace('chácaras', 'ch.').replace('chácara', 'ch.').replace('residencial', 'res.').replace('francisco', 'fco.').replace('viaduto', 'vd.').replace('tenente', 'tte.').replace('tenente', 'ten.').replace('ponte', 'pte.').replace('estrada', 'estr.').replace('princesa', 'princ.').toUpperCase();
  }
  
  var first_char = /\S/;

  function capitalize(s) {
    return s.replace(first_char, function (m) {
      return m.toUpperCase();
    });
  }

  function showInfo(s) {
    $(".voice-message h1").fadeOut("fast", function () {
      var el = $("#" + s);
      if (el) el.fadeIn();
    });

  }

  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  }
  else {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.onstart = function () {
      recognizing = true;
      showInfo('info_speak_now');
    };
    recognition.onerror = function (event) {
      if (event.error == 'no-speech') {
        showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('info_blocked');
        } else {
          showInfo('info_denied');
        }
        ignore_onend = true;
      }
    };
    recognition.onend = function () {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      if (!final_transcript) {
        showInfo('info_start');
        return;
      }
      $(".voice-overlay").fadeOut(function () {
        pesquisar($("#final_span").text());
      });
    };
    recognition.onresult = function (event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal)
          final_transcript += event.results[i][0].transcript;
        else
          interim_transcript += event.results[i][0].transcript;
      }
      final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
    };
  }

  $(".voice-toggler").click(function () {
    $(".voice-overlay").fadeIn();
    if (voiceAvailable) {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = "pt-BR";
      recognition.start();
      ignore_onend = false;
      final_span.innerHTML = '';
      interim_span.innerHTML = '';
      showInfo('info_allow');
      start_timestamp = event.timeStamp;
    }
  });
  
  $(".voice-cancel").click(function () {
    $(".voice-overlay").fadeOut();
  });
}(jQuery));