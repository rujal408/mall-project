import firebase from 'firebase/app'
import 'firebase/storage' //for storage
import 'firebase/firestore' //deals with database

var firebaseConfig = {
    apiKey: "AIzaSyAlUMKnJCqHdPJdyRTM0jpDL-Z4fa3WnLU",
    authDomain: "mall-project-a28a9.firebaseapp.com",
    projectId: "mall-project-a28a9",
    storageBucket: "mall-project-a28a9.appspot.com",
    messagingSenderId: "187518449093",
    appId: "1:187518449093:web:5975fcea9d83b0def747ac"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseDatabase = firebase.firestore()
export const firebaseFile = firebase.storage()