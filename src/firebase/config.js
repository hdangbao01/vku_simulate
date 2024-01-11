import { initializeApp } from "firebase/app"

import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC0W_56-9K7yjigUBTwk5Igu9ZoKcJO_OQ",
    authDomain: "vku-simulate.firebaseapp.com",
    projectId: "vku-simulate",
    storageBucket: "vku-simulate.appspot.com",
    messagingSenderId: "1058081409750",
    appId: "1:1058081409750:web:aa30b5a4ddd0626d691777",
    measurementId: "G-0FRB7TT2L0",
    // databaseURL: "https://vku-simulate-default-rtdb.asia-southeast1.firebasedatabase.app/"
    // apiKey: "AIzaSyDA9I-yhQF1YGru07ymL-V_GDRQTlI3ZLM",
    // authDomain: "api-vku.firebaseapp.com",
    // projectId: "api-vku",
    // storageBucket: "api-vku.appspot.com",
    // messagingSenderId: "107523604688",
    // appId: "1:107523604688:web:e8b3f3cc2a1467e8e31ed5",
    // measurementId: "G-8DZQ0SV6EF"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
// const database = getDatabase(app);

const provider = new GoogleAuthProvider()

// connectAuthEmulator(auth, "http://127.0.0.1:9099");
// connectFirestoreEmulator(db, 'localhost', 8088)
// connectDatabaseEmulator(database, "127.0.0.1", 9000);

export { db, auth, provider }