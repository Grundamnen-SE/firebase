var auth = firebase.auth();

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
function loadEditor() {
  $("#editor").show();
  $("#login").hide();
  $("#username").val("");
  $("#password").val("");
  $("#name").text(window.user.displayName ? window.user.displayName:window.user.email);
}

function unloadEditor() {
  $("#editor").hide();
  $("#login").show();
  window.user = null;
}

function notify(message) {
  $("#notification").text(message).fadeIn(1000, function(){setTimeout(function(){$("#notification").fadeOut();}, 7*1000)});
}
