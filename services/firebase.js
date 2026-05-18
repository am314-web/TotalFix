import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  inMemoryPersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJOXN1P89vJ9UWHfuTzp30oQzMUVZYMu4",
  authDomain: "workmate-f5e38.firebaseapp.com",
  projectId: "workmate-f5e38",
  storageBucket: "workmate-f5e38.firebasestorage.app",
  messagingSenderId: "833429138415",
  appId: "1:833429138415:web:3794cfdedac0a1aca0a41a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: inMemoryPersistence,
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
