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
  $("#name").text(loggedin_user.displayName ? loggedin_user.displayName:loggedin_user.email);
}

function unloadApprove() {
  $("#approve").hide();
  $("#login").show();
}

// Ladda ämnen som har "approved":false
db.ref("pending_approval").once('value').then(function(data){
  setApprove(data.val());
});
db.ref("pending_approval").on('child_added', function(data){
  console.log("pending_approval child_added", data.val());
  addApprove(data.val());
});
db.ref("pending_approval").on('child_removed', function(data){
  console.log("pending_approval child_removed", data.val());
  removeApprove(data.val());
});
db.ref("pending_approval").on('child_changed', function(data){
  // Do some function?
});

// Approve management
var approveList
function setApprove(data){
  for (var key in data) {

  }
}
function addApprove(data){

}
function removeApprove(data){

}
