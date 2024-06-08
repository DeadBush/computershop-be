import {getApp, getApps, initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyCsYmsSfZHDKXNpD1QOggeiVfKUXHLcWN8",
    authDomain: "bugcar-store.firebaseapp.com",
    projectId: "bugcar-store",
    storageBucket: "bugcar-store.appspot.com",
    messagingSenderId: "320142156214",
    appId: "1:320142156214:web:b7729296d6c93bbff12117"
  };

  const app= getApps.length >0? getApp(): initializeApp(firebaseConfig);
  const db=getFirestore(app);
  const storage= getStorage(app);

  export {db,storage};
