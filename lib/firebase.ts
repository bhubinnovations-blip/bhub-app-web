import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAcjDk14VvIuVQeFxNbxmrrLWTXPRr0Fw0",
    authDomain: "bhub-341910.firebaseapp.com",
    projectId: "bhub-341910",
    storageBucket: "bhub-341910.appspot.com",
    messagingSenderId: "784716107176",
    appId: "1:784716107176:web:29cb9b7715fbe5f97de19d",
    measurementId: "G-H6HKFSBQR1"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };