import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoyB1o3NFyTef0MXEeOCBGurWw_5dJtcA",
  authDomain: "hapham-storage-20d39.firebaseapp.com",
  projectId: "hapham-storage-20d39",
  storageBucket: "hapham-storage-20d39.firebasestorage.app",
  messagingSenderId: "62166994403",
  appId: "1:62166994403:web:818fd8708255a62832e4d6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };