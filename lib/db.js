import { db } from '@/lib//firebase';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

export async function createUser(user) {
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUser(userId) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) return null;
    return docSnap.data();
  } catch (error) {
    console.log(error);
  }
}

export async function createUniversity(university) {
  try {
    const { id } = await addDoc(collection(db, 'universities'), university);
    return { id, ...university };
  } catch (error) {
    console.log(error);
  }
}

export async function createCollege(college) {
  try {
    const { id } = await addDoc(collection(db, 'colleges'), college);
    return { id, ...college };
  } catch (error) {
    console.log(error);
  }
}

export async function createDegree(degree) {
  try {
    const { id } = await addDoc(collection(db, 'degrees'), degree);
    return { id, ...degree };
  } catch (error) {
    console.log(error);
  }
}

export async function createSubject(subject) {
  try {
    const { id } = await addDoc(collection(db, 'subjects'), subject);
    return { id, ...subject };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSubject(subjectId) {
  try {
    await deleteDoc(doc(db, 'subjects', subjectId));
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserSubjectsState(userId, subjectsState) {
  try {
    await setDoc(doc(db, 'userSubjectsState', userId), subjectsState, {
      merge: true,
    });
  } catch (error) {
    console.log(error);
  }
}
