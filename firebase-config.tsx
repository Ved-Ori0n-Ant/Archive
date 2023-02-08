import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCFNsJj3kECC8jAbnEATlZRuLzyeSz8Jio",
    authDomain: "fir-auth-d4c5c.firebaseapp.com",
    databaseURL: "https://fir-auth-d4c5c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-auth-d4c5c",
    storageBucket: "fir-auth-d4c5c.appspot.com",
    messagingSenderId: "663160661759",
    appId: "1:663160661759:web:ec14cc20a0dc044b854eca",
    measurementId: "G-DHK2744GVE"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app)

  export {db}