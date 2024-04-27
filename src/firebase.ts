// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Packaging, Palette, Product } from "./contexts/PackingProvider/types";
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

async function updateProductById(id: string, product: Omit<Product, "id">) {
  try {
    const productsCol = doc(db, "products", id);
    const docRef = await updateDoc(productsCol, product);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

async function getPackagings() {
  const packagingsCol = collection(db, "packagings");
  const packagingSnapshot = await getDocs(packagingsCol);
  const packagingList = packagingSnapshot.docs.map((doc) => {
    const result = doc.data();
    const { createdAt, updatedAt, products, ...rest } = result;
    return {
      id: doc.id,
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
      products: products?.map((product: any) => {
        const { createdAt, updatedAt, ...rest } = product;
        return {
          ...rest,
          createdAt: createdAt.toDate(),
          updatedAt: updatedAt.toDate(),
        };
      }),
      ...rest,
    } as Packaging;
  });
  return packagingList;
}

async function addPackaging(packaging: Omit<Packaging, "id">) {
  try {
    const packagingsCol = collection(db, "packagings");
    const docRef = await addDoc(packagingsCol, packaging);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

async function updatePackagingById(
  id: string,
  packaging: Omit<Packaging, "id">
) {
  try {
    const packagingsCol = doc(db, "packagings", id);
    const docRef = await updateDoc(packagingsCol, packaging);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

async function getPalettes() {
  const palettesCol = collection(db, "palettes");
  const paletteSnapshot = await getDocs(palettesCol);
  const paletteList = paletteSnapshot.docs.map((doc) => {
    const result = doc.data();
    const { createdAt, updatedAt, packagings, ...rest } = result;
    return {
      id: doc.id,
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
      packagings: packagings?.map((packaging: any) => {
        const { createdAt, updatedAt, ...rest } = packaging;
        return {
          ...rest,
          createdAt: createdAt.toDate(),
          updatedAt: updatedAt.toDate(),
        };
      }),
      ...rest,
    } as Palette;
  });
  return paletteList;
}

async function addPalette(palette: Omit<Palette, "id">) {
  try {
    const palettesCol = collection(db, "palettes");
    const docRef = await addDoc(palettesCol, palette);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

async function updatePaletteById(id: string, palette: Omit<Palette, "id">) {
  try {
    const palettesCol = doc(db, "palettes", id);
    const docRef = await updateDoc(palettesCol, palette);
    return docRef;
  } catch (err) {
    console.log(err);
  }
}

export {
  addPackaging,
  addPalette,
  addProduct,
  getPackagings,
  getPalettes,
  getProducts,
  updatePackagingById,
  updatePaletteById,
  updateProductById,
};
