import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARJQ4FbirWPTXOdk0Un54y2r74oc09h8E",
  authDomain: "lab1-386517.firebaseapp.com",
  projectId: "lab1-386517",
  storageBucket: "lab1-386517.appspot.com",
  messagingSenderId: "582868506312",
  appId: "1:582868506312:web:09acfa977ca4af0a78b7fd",
  measurementId: "G-9ZG01WQCC4"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase auth instance
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
