import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "./firebaseConfig";

export async function getData(collectionName: string) {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(collection(getFirebaseDb(), collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}