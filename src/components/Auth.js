import firebase from 'firebase';




  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyA91qIDNfhQ56rj80m4ZkwvI0CAMy7OGfE",
    authDomain: "web-tcc-52fd1.firebaseapp.com",
    projectId: "web-tcc-52fd1",
    storageBucket: "web-tcc-52fd1.appspot.com",
    messagingSenderId: "627247435144",
    appId: "1:627247435144:web:557afc964cb7907bd33e3d",
    measurementId: "G-HMKHL3K2JK"
  };
  // Initialize Firebase
  const Auth = firebase.initializeApp(firebaseConfig);

export default Auth;