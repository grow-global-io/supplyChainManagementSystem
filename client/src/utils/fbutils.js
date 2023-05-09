import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/fbconfig";
import { v4 as uuidv4 } from "uuid";
export const getData = async () => {
  const docRef = doc(db, "Vendor", "C0Uv0fnFq9ERcRLkzH9p");
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};
// save vendor data to firestore
export const saveData = async (data, collectionName) => {
  console.log(data);
  const docRef = doc(db, collectionName, uuidv4());
  await setDoc(docRef, data);
  console.log("Document written with ID: ", docRef.id);
};

// get collection data
export const getCollectionData = async (collectionName) => {
  console.log("here", collectionName);
  const querySnapshot = await getDocs(collection(db, collectionName));
  let data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    data.push(doc.data());
    console.log(doc.id, " => ", doc.data());
  });
  return data;
};
