import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJnvt8iS02N4AEZ8REW1s4yHKj6jyLJvU",
  authDomain: "fantasy-basketball-cfb4d.firebaseapp.com",
  projectId: "fantasy-basketball-cfb4d",
  storageBucket: "fantasy-basketball-cfb4d.appspot.com",
  messagingSenderId: "519836618745",
  appId: "1:519836618745:web:91ae9f10886e7750123728",
  measurementId: "G-ME6RC9QBRK",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
