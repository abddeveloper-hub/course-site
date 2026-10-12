// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
  authDomain: "nexvion-ai.firebaseapp.com",
  projectId: "nexvion-ai",
  storageBucket: "nexvion-ai.firebasestorage.app",
  messagingSenderId: "916097030104",
  appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad",
  measurementId: "G-Q09E6TX5XJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
    window.firebaseAnalytics = analytics;
  } catch (e) {
    // Analytics is guarded in environments without active measurement support
  }
  window.firebaseConfig = firebaseConfig;
  window.firebaseApp = app;
}

export { firebaseConfig, app, analytics };
export default app;
