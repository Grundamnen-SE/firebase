// Inloggning
var loggedin_user;

auth.onAuthStateChanged(function(user) {
  if (user) {
    db.ref("permissions/"+user.uid+"/approve").once("value").then(function(data){
      if (data.val()) {
        loggedin_user = user;
        loadApprove();
      } else {
        logout();
        unloadApprove();
        notify("Du har inte behörighet att godkänna ändringar av ämnen.");
      }
    }, function(err){
      console.log(err);
    });
  } else {
    unloadApprove();
  }
  console.log("onAuthStateChanged", user);
});

/* load/unload approve page */
function loadApprove() {
  $("#approve").show();
  $("#login").hide();
}

function unloadApprove() {
  $("#approve").hide();
  $("#login").show();
}
