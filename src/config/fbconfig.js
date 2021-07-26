import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    //Make ur own .env.local file then paste ur api key their
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const firestore = firebase.firestore()
// if (window.location.hostname.includes("localhost")) {
//   auth.useEmulator("http://localhost:9099")
//   firestore.useEmulator("localhost", 8080)
//   functions.useEmulator("localhost", 5001)
// }
 


export {auth, firestore}
export default firebase