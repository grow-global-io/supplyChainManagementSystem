import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/fbconfig";

export const getData = async ()=>{
    const docRef = doc(db, "Vendor", "C0Uv0fnFq9ERcRLkzH9p");
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}