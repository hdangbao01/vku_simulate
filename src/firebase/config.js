import { initializeApp } from "firebase/app"

import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
    apiKey: "AIzaSyC0W_56-9K7yjigUBTwk5Igu9ZoKcJO_OQ",
    authDomain: "vku-simulate.firebaseapp.com",
    projectId: "vku-simulate",
    storageBucket: "vku-simulate.appspot.com",
    messagingSenderId: "1058081409750",
    appId: "1:1058081409750:web:aa30b5a4ddd0626d691777",
    measurementId: "G-0FRB7TT2L0"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

const provider = new GoogleAuthProvider()

connectFirestoreEmulator(db, 'localhost', 8088)
connectAuthEmulator(auth, "http://127.0.0.1:9099");

export { db, auth, analytics, provider }