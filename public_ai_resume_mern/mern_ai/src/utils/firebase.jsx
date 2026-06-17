import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7CRUszJ_-0JhJJaT4vmVxruH2qrabPVk",
  authDomain: "ai-resume-analyzer-7c562.firebaseapp.com",
  projectId: "ai-resume-analyzer-7c562",
  storageBucket: "ai-resume-analyzer-7c562.firebasestorage.app",
  messagingSenderId: "463283354770",
  appId: "1:463283354770:web:3043d313afb0bbf20b3a4b",
  measurementId: "G-2KE1Z4FTYC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };