import { db } from './firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function getData(collectionName: string) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
