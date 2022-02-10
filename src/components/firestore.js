import firebase from "firebase/app";
import "firebase/firestore";


const config ={
    apiKey: "", //insira aqui a chave de API(retirada por questão de precaução)
    authDomain: "web-tcc-52fd1.firebaseapp.com",
    projectId: "web-tcc-52fd1",
    storageBucket: "web-tcc-52fd1.appspot.com",
    messagingSenderId: "627247435144",
    appId: "1:627247435144:web:557afc964cb7907bd33e3d",
    measurementId: "G-HMKHL3K2JK"
};     
    
if (!firebase.apps.length) {
firebase.initializeApp(config);
}

export default firebase;
