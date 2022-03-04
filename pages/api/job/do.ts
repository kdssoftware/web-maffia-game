// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { Job } from '@models/Job';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POST
  if (req.method === 'POST') {
    const {jobRefId, userRefId}  :  {jobRefId: string, userRefId : string } = req.body;
    if (!jobRefId || !userRefId) {
        const user = await User.getByRef(userRefId);
        const job = await Job.getByRef(jobRefId);
        if(!user || !job) {
            res.status(400).json({ error: 'User or job not found' });
        }
        await user.doJob(job.getRefId());
        res.status(200).json(user);
        return;
    }

  }
}
