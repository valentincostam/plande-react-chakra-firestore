import { getUserSubjectsState } from '@/lib/db-admin';
import { auth } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  const { uid: userId } = await auth.verifyIdToken(req.headers.token);
  const { degreeId } = req.query;
  const userSubjectsState = await getUserSubjectsState(userId, degreeId);
  res.status(200).json(userSubjectsState);
}
