import firebase from "firebase/app";


import "firebase/auth";
import 'firebase/firestore';
import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDxV0_9cgyw40cVPcGXvP3vL8d7sNtpU0E",
  authDomain: "cycleware-sun.firebaseapp.com",
  projectId: "cycleware-sun",
  storageBucket: "cycleware-sun.appspot.com",
  messagingSenderId: "274458144801",
  appId: "1:274458144801:web:97a2b90d74d26c7a1c3360"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
