import { db } from '@/lib/firebase-admin';

export async function getUniversities() {
  try {
    const docs = [];
    const querySnapshot = await db.collection('universities').get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs;
  } catch (error) {
    console.log(error);
  }
}

export async function getUniversityBySlug(slug) {
  try {
    const docs = [];
    const querySnapshot = await db
      .collection('universities')
      .where('slug', '==', slug)
      .get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getColleges(universityId = null) {
  try {
    const docs = [];
    const collectionRef = db.collection('colleges');
    const querySnapshot = universityId
      ? await collectionRef.where('universityId', '==', universityId).get()
      : await collectionRef.get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs;
  } catch (error) {
    console.log(error);
  }
}

export async function getCollegeBySlug(slug) {
  try {
    const docs = [];
    const querySnapshot = await db
      .collection('colleges')
      .where('slug', '==', slug)
      .get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getDegrees(collegeId = null) {
  try {
    const docs = [];
    const collectionRef = db.collection('degrees');
    const querySnapshot = collegeId
      ? await collectionRef.where('collegeId', '==', collegeId).get()
      : await collectionRef.get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs;
  } catch (error) {
    console.log(error);
  }
}

export async function getDegreeBySlug(slug) {
  try {
    const docs = [];
    const querySnapshot = await db
      .collection('degrees')
      .where('slug', '==', slug)
      .get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getSubjects(degreeId = null) {
  try {
    const docs = [];
    const collectionRef = db.collection('subjects');
    const query = degreeId
      ? collectionRef.where('degreeId', '==', degreeId)
      : collectionRef;
    const querySnapshot = await query.orderBy('createdAt', 'asc').get();
    querySnapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
    return docs;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserSubjectsState(userId, degreeId) {
  try {
    const doc = await db.collection('userSubjectsState').doc(userId).get();
    if (!doc.exists) return null;
    const userSubjectsState = doc.data()[degreeId];
    return userSubjectsState;
  } catch (error) {
    console.log(error);
  }
}
