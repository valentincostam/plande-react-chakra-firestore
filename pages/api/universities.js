import { getUniversities } from '@/lib/db-admin';

export default async function handler(req, res) {
  const universities = await getUniversities();
  res.status(200).json(universities);
}
