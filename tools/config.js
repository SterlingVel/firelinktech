const firebaseConfig = {
  apiKey: "AIzaSyBFCxY8ZPJExV8NJOvdJmLWO-rlwj164wA",
  authDomain: "firelink-dev-f3713.firebaseapp.com",
  databaseURL: "https://firelink-dev-f3713-default-rtdb.firebaseio.com",
  projectId: "firelink-dev-f3713",
  storageBucket: "firelink-dev-f3713.firebasestorage.app",
  messagingSenderId: "537961293518",
  appId: "1:537961293518:web:535344f6a7c4662c83129f",
  measurementId: "G-EKZY59PR1V"
};

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

export {firebase, firebaseConfig}