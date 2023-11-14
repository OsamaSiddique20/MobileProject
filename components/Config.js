import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD5H1K6zQqEt_Gf0TqxTZ_tPvviZcU-GV4",
  authDomain: "test-3df00.firebaseapp.com",
  projectId: "test-3df00",
  storageBucket: "test-3df00.appspot.com",
  messagingSenderId: "192252953492",
  appId: "1:192252953492:web:fbb913f7e95639ba790581"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app);