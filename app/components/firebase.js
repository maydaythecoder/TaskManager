// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpDEX8FIXAI4ZHvfRarBfT5jl4gwQQzIY",
  authDomain: "task-manager-c7b75.firebaseapp.com",
  projectId: "task-manager-c7b75",
  storageBucket: "task-manager-c7b75.appspot.com",
  messagingSenderId: "971478807714",
  appId: "1:971478807714:web:b907c307615cc49b3893fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =getFirestore(app)