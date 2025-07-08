import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBh9hBg2AxbVx2SyWKpDGNKNfpCYotoTko",
  authDomain: "ano-labs.firebaseapp.com",
  projectId: "ano-labs",
  storageBucket: "ano-labs.appspot.com",
  messagingSenderId: "350584010626",
  appId: "1:350584010626:web:8aeff5059cb9480712c19b",
  measurementId: "G-Y5KBJC59E3"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
window.storage = getStorage(app);
window.firestoreHelpers = { addDoc, collection, serverTimestamp };
window.storageHelpers = { ref, uploadBytes, getDownloadURL };
