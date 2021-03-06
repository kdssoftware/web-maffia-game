import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const userRefId = req.query.id || req.body.id;
    if(!userRefId) {
        res.status(400).json({ error: 'User id is required' });
        return;
    }
    const user = await User.getAvailableJobsStatic(userRefId);
    if(!user) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    res.status(200).json(user);
}
