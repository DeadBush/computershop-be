import {getApp, getApps, initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyC-6CZtabxZNyw24LDYY-19eINw2g4f9vM",
  authDomain: "computershopbichhuyen.firebaseapp.com",
  projectId: "computershopbichhuyen",
  storageBucket: "computershopbichhuyen.appspot.com",
  messagingSenderId: "689752324254",
  appId: "1:689752324254:web:854d08a06a3feeff4b638f"
};

  const app= getApps.length >0? getApp(): initializeApp(firebaseConfig);
  const db=getFirestore(app);
  const storage= getStorage(app);

  export {db,storage};
