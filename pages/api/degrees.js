import { getDegrees } from '@/lib/db-admin';

export default async function handler(req, res) {
  const { collegeId } = req.query;
  const degrees = await getDegrees(collegeId);
  res.status(200).json(degrees);
}
