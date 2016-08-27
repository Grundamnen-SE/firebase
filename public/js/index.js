var loading = false;
var elementLoaded = [];
var loadElementData;
var title = "Grundämnen.se";

var elements = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si",
                "P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni",
                "Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
                "Cs","Ba","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb",
                "Bi","Po","At","Rn","Fr","Ra","Rf","Db","Sg","Bh","Hs","Mt","Ds",
                "Rg","Cn","Uut","Fl","Uup","Lv","Uus","Uuo","La","Ce","Pr","Nd",
                "Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Ac","Th",
                "Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"];

var database = firebase.database();

function dataExtractor(data, key) {
  //console.log(key, data);
  if (typeof data === "object" && data.constructor !== Array) {
    for (var newkey in data) {
      if (!data.hasOwnProperty(newkey)) return;
      dataExtractor(data[newkey], key+"."+newkey);
    }
  } else if (data.constructor === Array) {
    for (var i = 0; i < data.length; i++) {
      $("[data-elm='"+key+"']").append("<li>"+data[i]+"</li>");
    }
    elementLoaded.push(key);
  } else {
    if ($("[data-elm='"+key+"']").is("input")) {
      $("[data-elm='"+key+"']").val(data);
    } else if ($("[data-elm='"+key+"']").is("textarea")) {
      $("[data-elm='"+key+"']").text(data);
    } else if ($('[data-elm="'+key+'"]').attr("data-elm-attr") == "attribute") {
      $('[data-elm="'+key+'"]').attr("data-elm-raw", data);
    } else {
      $("[data-elm='"+key+"']").text(data);
    }
    elementLoaded.push(key);
  }
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function loadElement(elm, override) {
  console.log("loadElement");
  var jselm = $('td[data-iselm][data-name="'+elm+'"]');
  if (!$(jselm).hasClass("td-extend") &&
      !$(jselm).hasClass("td-header") &&
      !$(jselm).hasClass("td-none") &&
      !$(jselm).hasClass("td-about") &&
      !$(jselm).hasClass("td-logo")) {
      if (!loading) {

        loading = true;
        var atomic_number = $(jselm).attr("data-number");
        var atomic_text = $(jselm).attr("data-name");

        if (!isInArray(elm, elements)) {
          // Notify user of invalid element
          alert("element is not valid");
          loading = false;
          return;
        }

        var colors = {
          "pol": "#C2CAFF", "alk": "#FFC2C2", "jor": "#FFE4C2", "ove": "#C2FFCF", "eju": "#DFDFDF", "ovr": "#C2FFF2",
          "hme": "#C2ECFF", "ick": "#C2C7FF", "dia": "#DCC2FF", "gas": "#FFC2FF", "lan": "#FAFFC2", "akt": "#D7FFC2"
        }
        for (var prop in colors) {
          if (!colors.hasOwnProperty(prop)) continue;
          if ($(jselm).hasClass(prop)) {
            $("#overlay").css({"background-color": colors[prop]});
            break;
          }
        }

        database.ref("elements/"+elm).once("value").then(function(data){
          data = data.val();
          console.log(data);
          // TODO: Redo when the new logging system is implemented
          if ((data.text == null && data.approved) || (data.approved)) data.text = "Detta ämne är inte klart ännu.";
          loadElementData = data;
          var elementdata = data;
          window.history.pushState("", "", "/"+elementdata.element);
          $("title").text(elementdata.element+" - "+title);
          for (var key in elementdata) {
            if (!elementdata.hasOwnProperty(key)) continue;
            var obj = elementdata[key];
            dataExtractor(obj, key);
          }
          $("body").css({"overflow":"hidden"});
          if (getCookie("gr-settings-easing", "true") == "false" || override) {
            $("#overlay").show();
          } else {
            $("#overlay").show("scale", 300);
          }
          element = true;
          loading = false;
        });
      }
    }
}

$(document).on('ready', function(e){
  $(".tab1 td").each(function(i,o){
  if (!$(this).hasClass("td-extend") &&
      !$(this).hasClass("td-header") &&
      !$(this).hasClass("td-none") &&
      !$(this).hasClass("td-about") &&
      !$(this).hasClass("td-logo")) {

      var nr = $(this).find(".atomic_number").text();
      var name = $(this).find(".atomic_text").text();
      $(this).attr("data-number", nr);
      $(this).attr("data-name", name);
      $(this).attr("data-iselm", "true");
    }
  });

  if (window.location.href.split("/")[3] !== "") {
    loadElement(window.location.href.split("/")[3]);
  }

  $("td").on("click", function(e) {
    if ($(this).attr("data-iselm") === "true" && $(this).attr("data-name") !== null && $(this).attr("data-name") !== "") {
      loadElement($(this).attr("data-name"));
    }
  });
});

//Info/Help-rutan (färgförklaring)
$( "#help" ).dialog({
  autoOpen: false,
  title: "Färgförklaring"
});
$( ".help" ).click(function() {
  $( "#help" ).dialog( "open" );
});

// Settings-rutan:
$( "#settings" ).dialog({
  autoOpen: false,
  title: "Inställningar"
});
$( "#settings-button" ).click(function() {
  $( "#settings" ).dialog( "open" );
});

//Gör så att rutan stängs när man klickar på x. Funktionen anropas via onclick
function exit(override) {
  $("title").text(title);
  window.history.pushState("", "", "/");
  $("#edit").remove();
  for (var i = 0; i < elementLoaded.length; i++) {
    $('[data-elm="'+elementLoaded[i]+'"]').empty();
    if ($('[data-elm="'+elementLoaded[i]+'"]').attr("data-elm-raw") != false) {
      $('[data-elm="'+elementLoaded[i]+'"]').removeAttr("data-elm-raw");
    }
  }
  elementLoaded = [];
  if (getCookie("gr-settings-easing", "true") == "false" || override) {
    $("#overlay").hide();
  } else {
    $("#overlay").hide("scale", 200);
  }
  $("#rst").css({"overflow":"hidden", "display":"none"});
  $("body").css({"overflow":"initial"});
  element = false;
  loadElementData = {};
}

// Om man klickar på Esc ska rutan stängas:
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    exit();
  }
});
