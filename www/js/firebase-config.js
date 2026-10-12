/**
 * ==============================================================================
 * NEXVION AI — Universal Firebase & Cloud Messaging Configuration
 * ==============================================================================
 * Compatible with:
 *  - Standard browser script tags (compat SDK v10)
 *  - ES Modules & Bundlers
 *  - Firebase Cloud Messaging (Web Push / VAPID)
 */

const firebaseConfig = {
  apiKey: "AIzaSyCT5ieblE-Uj_fvBfeodPackWJ38M_RuF4",
  authDomain: "nexvion-ai.firebaseapp.com",
  projectId: "nexvion-ai",
  storageBucket: "nexvion-ai.firebasestorage.app",
  messagingSenderId: "916097030104",
  appId: "1:916097030104:web:e9b393b7fa8c89a84b84ad",
  measurementId: "G-Q09E6TX5XJ"
};

// Web Push Public VAPID Key Pair (FCM)
// Generated in Firebase Console: Project settings -> Cloud Messaging -> Web Push certificates
const VAPID_PUBLIC_KEY = "BJuxiPU55m5rguhim06cFOT8CrPXfo4cUQ6UERVHl0LVJKXuo05KYpPK0jSVvqJ6MkPonQe6KTSJDrQSMh_QlF0";

// Browser Environment Initialization
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
  window.VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;

  if (typeof firebase !== "undefined") {
    if (!firebase.apps || !firebase.apps.length) {
      try {
        firebase.initializeApp(firebaseConfig);
      } catch (err) {
        console.warn("[FirebaseConfig] Initialization note:", err.message);
      }
    }

    try {
      if (firebase.auth) window.auth = firebase.auth();
      if (firebase.firestore) window.db = firebase.firestore();
      if (firebase.messaging && typeof firebase.messaging.isSupported === "function" && firebase.messaging.isSupported()) {
        window.messaging = firebase.messaging();
      }
    } catch (e) {
      console.warn("[FirebaseConfig] Services attach note:", e.message);
    }
  }
}

// Node / CommonJS export support
if (typeof module !== "undefined" && module.exports) {
  module.exports = { firebaseConfig, VAPID_PUBLIC_KEY };
}
