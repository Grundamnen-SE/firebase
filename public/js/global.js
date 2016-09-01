// Vars
var elements = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si",
                "P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni",
                "Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
                "Cs","Ba","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb",
                "Bi","Po","At","Rn","Fr","Ra","Rf","Db","Sg","Bh","Hs","Mt","Ds",
                "Rg","Cn","Uut","Fl","Uup","Lv","Uus","Uuo","La","Ce","Pr","Nd",
                "Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Ac","Th",
                "Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"]
var elementsSorted = elements.sort();
var db = firebase.database();

// Generic Functions
function dataExtractor(data, key) {
  console.log(key, data);
  if (typeof data === "object" && data.constructor !== Array) {
    for (var newkey in data) {
      if (!data.hasOwnProperty(newkey)) return;
      dataExtractor(data[newkey], key+"."+newkey);
    }
  } else if (data.constructor === Array) {
    for (var i = 0; i < data.length; i++) {
      $("[data-elm='"+key+"']").append("<li>"+data[i]+"</li>");
    }
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
  }
}
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

// Notification
var notifyID;
$(document).ready(function(){
  $("body").prepend('<div id="notification" class="disnon"></div>');
});

function notify(message) {
  stopNotify();
  $("#notification").text(message).fadeIn(1000, function(){notifyID = setTimeout(function(){$("#notification").fadeOut();}, 7*1000)});
}
function stopNotify() {
  window.clearTimeout(notifyID);
  $("#notification").hide();
}
