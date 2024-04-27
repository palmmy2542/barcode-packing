// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { Product } from "./contexts/PackingProvider/types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUGKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of products from your database
async function getProducts() {
  const productsCol = collection(db, "products");
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map((doc) => {
    const result = doc.data();
    const { createdAt, updatedAt, ...rest } = result;
    return {
      id: doc.id,
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
      ...rest,
    } as Product;
  });
  return productList;
}

async function addProduct(product: Omit<Product, "id">) {
  try {
    const productsCol = collection(db, "products");
    const docRef = await addDoc(productsCol, product);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

export { getProducts, addProduct };
