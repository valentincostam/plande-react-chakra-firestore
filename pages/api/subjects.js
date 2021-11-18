import { getSubjects } from '@/lib/db-admin';

export default async function handler(req, res) {
  const { degreeId } = req.query;
  const subjects = await getSubjects(degreeId);
  res.status(200).json(subjects);
}
