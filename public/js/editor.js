var auth = firebase.auth();
var db = firebase.database();
var elements = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si",
                "P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni",
                "Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb",
                "Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe",
                "Cs","Ba","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb",
                "Bi","Po","At","Rn","Fr","Ra","Rf","Db","Sg","Bh","Hs","Mt","Ds",
                "Rg","Cn","Uut","Fl","Uup","Lv","Uus","Uuo","La","Ce","Pr","Nd",
                "Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Ac","Th",
                "Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr"].sort();

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

auth.onAuthStateChanged(function(user) {
  if (user) {
    window.user = user;
    loadEditor();
    console.log("onAuthStateChanged", user);
  } else {
    unloadEditor();
  }
});

function loginCustom(email, password) {
  auth.signInWithEmailAndPassword(email, password).catch(function(error) {
    console.log("Authentication error", error);
  });
}

function loginGoogle() {
  console.log("loginGoogle");
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  login(googleProvider);
}

function loginFacebook() {
  var facebookProvider = new firebase.auth.FacebookAuthProvider();
  login(facebookProvider);
}

function login(provider) {
  auth.signInWithPopup(provider).then(function(result){
    console.log("Authentication success", result);
  }).catch(function(error){
    if (error.code === 'auth/account-exists-with-different-credential') {
      // Notify user of account with that email exists bit with another auth method
      auth.fetchProvidersForEmail(error.email).then(function(providers){
        console.log("Auth with another account", providers)
        if (providers.length > 0) {
          switch (providers[0]) {
            case 'google.com': loginGoogle(); break;
            case 'facebook.com': loginFacebook(); break;
            default: notify("Kunde inte logga in: fel inloggningsmetod");
          }
        }
      });
    }
    console.log("Authentication error", error);
  });
}

function logout() {
  auth.signOut().then(function(){
    unloadEditor();
  }, function(error){
    // Error signing out
  });
}

// Editor
var editorLoaded = false;

function loadEditor() {
  if (editorLoaded === true) return;
  editorLoaded = true;
  $("#editor").show();
  $("#login").hide();
  $("#editing-area").hide();
  $("#username").val("");
  $("#password").val("");
  $("#name").text(window.user.displayName ? window.user.displayName:window.user.email);
  for (var i = 0; i < elements.length; i++) {
    $("#element").append('<option value="'+elements[i]+'">'+elements[i]+'</option>');
  }
}

function unloadEditor() {
  if (editorLoaded === false) return;
  editorLoaded = false;
  $("#editor").hide();
  $("#login").show();
  $("#editing-area").hide();
  window.user = null;
}

function notify(message) {
  $("#notification").text(message).fadeIn(1000, function(){setTimeout(function(){$("#notification").fadeOut();}, 7*1000)});
}

$("#element").on("change", function(e){
  $("#editing-area").show();
  loadElementEditor($(this).val());
});

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function save() {
  var data = saveElementEditor();
  data.element = $("#element").val();
  data.number = data.elementdata.protons;
  db.ref("elements/"+data.element).once("value").then(function(va){
    va = va.val();
    data.approved = false;
    if (va) data.previous = va; else data.previous = {};
    console.log(data);
    db.ref("elements/"+data.element).set(data);
  });
}

function loadElementEditor(element) {
  db.ref("elements/"+element).once("value").then(function(data){
    var data = data.val();
    console.log(data);
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      var obj = data[key];
      dataExtractor(obj, key);
    }
  });
}

function saveElementEditor() {
  var data = {};
  $("[data-elm]").each(function(){
    var key = $(this).attr("data-elm");
    if (key.indexOf(".") === -1) {
      if ($(this).is("input,textarea")) {
        data[key] = $(this).val();
      } else if ($(this).find("input")) {
        data[key] = $(this).find("input").val();
      } else if ($(this).find("textarea")) {
        data[key] = $(this).find("textarea").val();
      }
    } else {
      var key = key.split(".");
      if (!data[key[0]]) data[key[0]] = {};
      if ($(this).is("input,textarea")) {
        data[key[0]][key[1]] = $(this).val();
      } else if ($(this).find("input")) {
        data[key[0]][key[1]] = $(this).find("input").val();
      } else if ($(this).find("textarea")) {
        data[key[0]][key[1]] = $(this).find("textarea").val();
      }
    }
  });
  return data;
}
