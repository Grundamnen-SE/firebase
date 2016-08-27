auth.onAuthStateChanged(function(user) {
  if (user) {
    db.ref("permissions/"+user.uid+"/write").once("value").then(function(data){
      if (data.val()) {
        window.user = user;
        loadEditor();
      } else {
        logout();
        unloadEditor();
        notify("Du har inte behörighet att ändra ämnen.");
      }
    }, function(err){
      console.log(err);
    });
  } else {
    unloadEditor();
  }
  console.log("onAuthStateChanged", user);
});

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
  for (var i = 0; i < elementsSorted.length; i++) {
    $("#element").append('<option value="'+elementsSorted[i]+'">'+elementsSorted[i]+'</option>');
  }
}

function unloadEditor() {
  editorLoaded = false;
  $("#editor").hide();
  $("#login").show();
  $("#editing-area").hide();
  window.user = null;
}

$("#element").on("change", function(e){
  $("#editing-area").show();
  loadElementEditor($(this).val());
});

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
    notify("Ämnet har sparats.");
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
