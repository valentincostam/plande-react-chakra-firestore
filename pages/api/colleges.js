import { getColleges } from '@/lib/db-admin';

export default async function handler(req, res) {
  const { universityId } = req.query;
  const colleges = await getColleges(universityId);
  res.status(200).json(colleges);
}
