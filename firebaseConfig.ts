


import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyCcBp75n1LcfWmDd5ZdT2kRAhS1xlewSWA",

  authDomain: "calendario-menu-david.firebaseapp.com",

  projectId: "calendario-menu-david",

  storageBucket: "calendario-menu-david.firebasestorage.app",

  messagingSenderId: "231783153569",

  appId: "1:231783153569:web:4e95cee4ce9e240e8615e0",

  measurementId: "G-XNKEC4Q5W4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
