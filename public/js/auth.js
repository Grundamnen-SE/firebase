var auth = firebase.auth();

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
  if ($("body").find("#login") == null) return;
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
