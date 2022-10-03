import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbSCN0_7QKHc0OAN-YOG1Q6_FFR_nhj9g",

  authDomain: "minestrom-644e6.firebaseapp.com",

  projectId: "minestrom-644e6",

  storageBucket: "minestrom-644e6.appspot.com",

  messagingSenderId: "281083162203",

  appId: "1:281083162203:web:e162a8286b7af2e7db197e",

  measurementId: "G-MG284QV72L",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const db = getFirestore(app);
