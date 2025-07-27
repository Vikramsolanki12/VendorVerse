// Import Firebase core and services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // For product image uploads

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKWuYlRAif3bN8D2A5fpUyfAkKgfCppCE",
  authDomain: "vendorverse-5a8c3.firebaseapp.com",
  projectId: "vendorverse-5a8c3",
  storageBucket: "vendorverse-5a8c3.appspot.com", // ✅ Correct bucket
  messagingSenderId: "69030701712",
  appId: "1:69030701712:web:d299c85fa40ed31dc40615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in your components
export const auth = getAuth(app);         // Used in supplierLogin.jsx
export const db = getFirestore(app);      // Used in supplierForm, storeForm, productForm
export const storage = getStorage(app);   // Used in productForm for image upload
