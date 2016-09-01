var auth = firebase.auth();

function loginCustom(email, password) {
  if (email == "" || password == "") {
    notify("Du har inte skrivit in alla dina uppgifter");
  } else {
    notify("Loggar in...");
  }
  auth.signInWithEmailAndPassword(email, password).then(function(){
    stopNotify();
  }).catch(function(error) {
    console.log("Authentication error", error);
    notify("Något gick fel vid inloggning");
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
  notify("Loggar in...");
  auth.signInWithPopup(provider).then(function(result){
    stopNotify();
    console.log("Authentication success", result.email);
  }).catch(function(error){
    if (error.code === 'auth/account-exists-with-different-credential') {
      notify("Du valde fel inloggningsmetod för den angivna mejlen, byter till korrekt.");
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
    } else {
      notify("Något gick fel vid inloggning");
    }
    console.log("Authentication error", error);
  });
}

function logout() {
  notify("Du är utloggad");
  auth.signOut().then(function(){
    console.log("Logout successful");
  }, function(error){
    // Error signing out
  });
}
