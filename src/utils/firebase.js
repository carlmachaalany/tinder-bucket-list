import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqNZaRuf3dXr22HfMfVXSFKtuIZB9dBFo",
  authDomain: "tinder-bucket-list.firebaseapp.com",
  projectId: "tinder-bucket-list",
  storageBucket: "tinder-bucket-list.appspot.com",
  messagingSenderId: "536032705438",
  appId: "1:536032705438:web:496f3f411444126f9cf48f",
  measurementId: "G-8TG66SEQJH"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();