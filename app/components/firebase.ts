// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getStorage } from "@firebase/storage";
import { getFunctions } from "@firebase/functions";

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
export const authInstance = getAuth(app);
export const storageInstance = getStorage(app);
export const functionsInstance = getFunctions(app);

let analyticsInstance;

// Self-invoking async function
(async () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Only initialize analytics if it's supported
    if (await isSupported()) {
      analyticsInstance = getAnalytics(app);
    }
  }
})();



export {
    analyticsInstance, app //firebase.google.com/docs/web/setup#available-libraries
};